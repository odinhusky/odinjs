import { computed, type ComputedRef } from "vue"
import { usePermissionStore } from "@/stores/permissionStore"
import { PERMISSION } from "@/utils/constants"

export type QuickAmountPermission = {
  view: boolean
  edit: boolean
}

type StoredPermissionAction = {
  id: number
  view?: boolean
  edit?: boolean
}

type StoredPermissionList = Record<string, StoredPermissionAction[]>

export function useQuickAmountPermission(): ComputedRef<QuickAmountPermission> {
  const permissionStore = usePermissionStore()

  return computed(() => {
    const permissionAction = Object.values(permissionStore.permission as StoredPermissionList)
      .flat()
      .find((permission) => permission.id === PERMISSION.Enums.A_F_PAYMENT_QUICK_AMOUNT_SETTING)

    return {
      view: permissionAction?.view === true,
      edit: permissionAction?.edit === true
    }
  })
}
