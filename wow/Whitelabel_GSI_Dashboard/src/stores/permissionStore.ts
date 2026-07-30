import { defineStore } from "pinia"
import { getAccountAdminDetail, getAdminAccountPermission, getAccountPermissionDetail } from "@/api/adminAccount"
import { useRouter } from "vue-router"
import { PERMISSION } from "@/utils/constants"

interface SubPermission {
  id: number
  name: string
  layer: number
  actions: {
    edit?: boolean
    view?: boolean
    export?: boolean
    unlock: boolean
  }
}

interface Permission {
  id: number
  name: string
  layer: number
  sub_permission: SubPermission[]
}

type PermissionActions = {
  label: string
  id: number
  edit: boolean
  view: boolean
  export: boolean
  unlock: boolean
}

type PermissionList = {
  [key: string]: PermissionActions[]
}

export const usePermissionStore = defineStore({
  id: "permission",
  state: (): { permissionList: PermissionList; fetchingPermission: boolean } => ({
    permissionList: {},
    fetchingPermission: false
  }),
  actions: {
    async fetchPermissionList() {
      if (this.fetchingPermission) {
        // 如果已經在取得權限列表，就不要再重複呼叫了
        return
      }

      // 設置為正在取得權限列表
      this.fetchingPermission = true

      try {
        const data = await getInitialPermission()
        if (data) {
          this.permissionList = data
        } else {
          this.permissionList = {}
        }
      } finally {
        // 無論成功或失敗，都要重置為未在取得權限列表的狀態
        this.fetchingPermission = false
      }
    },
    async ensurePermissionList() {
      if (Object.keys(this.permissionList).length === 0) {
        await this.fetchPermissionList()
      }
      return this.permissionList
    }
  },
  getters: {
    permission: (state): any => {
      return state.permissionList
    }
  }
})

async function getInitialPermission() {
  try {
    const userId = sessionStorage.getItem("userID")

    if (userId) {
      const permissionResponse = await getAccountPermissionDetail()

      const permissionList: PermissionList = {}
      const parentPermissions = permissionResponse.data.parent_permission

      if (Array.isArray(parentPermissions)) {
        parentPermissions.forEach((permission: Permission) => {
          if (Array.isArray(permission.sub_permission)) {
            permissionList[permission.id] = permission.sub_permission.map((sub: SubPermission) => {
              const actions = sub.actions || {}

              if (sub.id === PERMISSION.Enums.A_F_MEMBER_KYC) {
                return {
                  label: sub.name,
                  id: sub.id,
                  edit: actions.edit ?? true,
                  view: actions.view ?? true,
                  export: actions.export ?? true,
                  unlock: actions.unlock ?? true
                }
              } else {
                return {
                  label: sub.name,
                  id: sub.id,
                  edit: actions.edit ?? true,
                  view: actions.view ?? true,
                  export: actions.export ?? true
                }
              }
            })
          }
        })
      }
      sessionStorage.setItem("permission", JSON.stringify(permissionList))

      //console.log(permissionList)
      return permissionList
    } else {
      return {}
    }
  } catch (error) {
    return {}
  }
}
