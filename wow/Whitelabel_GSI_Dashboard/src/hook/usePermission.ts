import { usePermissionStore } from "src/stores/permissionStore"
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useEnv, ENV_MODE_ENUM } from "src/hook/useEnv"
import { PERMISSION_TYPE } from "@/utils/constants"

export function usePermission() {
  const route = useRoute()
  const permissionStore = usePermissionStore()
  const pId = route.meta.permission as number[]
  const pType = [PERMISSION_TYPE.Enums.Edit, PERMISSION_TYPE.Enums.Export, PERMISSION_TYPE.Enums.View]
  const permission = ref<{ edit?: boolean; export?: boolean; view?: boolean }>({})
  const { envData } = useEnv()
  const appMode = envData().VITE_APP_MODE
  const result: { [key: string]: boolean } = {}
  for (let type of pType) {
    result[type] = false
  }

  const permissionList = permissionStore.permission

  for (let category in permissionList) {
    const entries = permissionList[category]
    if (Array.isArray(entries)) {
      for (let entry of entries) {
        if (pId?.includes(entry.id)) {
          for (let type of pType) {
            if (entry[type] === true) {
              result[type] = true
            }
          }
        }
      }
    }
  }
  //permission.value = { edit: true, export: true }
  //暫時關閉
  permission.value = result

  //總控暫時關閉功能
  if (appMode === ENV_MODE_ENUM.ADMIN) {
    permission.value = { edit: true, export: true, view: true }
  }

  //console.log(result)

  return { permission }
}
