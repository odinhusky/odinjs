import type { CmsItem } from "@shared-lib/api/commonTypes/cmsTypes"
import { CMS_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsType"
import { CMS_DISPLAY_LOGIN_ENUMS } from "@shared-lib/constants/enums/cmsDisplayLogin"
import { useCmsListQuery } from "@shared-lib/api/hooks/useCmsListQuery"

export const useMobileBottomNav = () => {
  const authStore = useAuthStore()

  const { data: rawNavList } = useCmsListQuery({ type: CMS_TYPE_ENUMS.H5_BOTTOM_MENU })

  /**
   * 依據登入狀態過濾導覽列項目：
   * - 未登入：隱藏 AFTER_LOGIN 項目（如會員中心、歷史紀錄等）
   * - 已登入：隱藏 BEFORE_LOGIN 項目（如登入、註冊入口等）
   */
  const navigationBarList = computed<CmsItem[]>(() => {
    if (!rawNavList.value?.length) return []

    return rawNavList.value.filter((item) => {
      const displayLogin = item.Setting?.payload?.display_login ?? CMS_DISPLAY_LOGIN_ENUMS.NO_RESTRICTIONS

      if (!authStore.isLoggedIn) {
        return displayLogin !== CMS_DISPLAY_LOGIN_ENUMS.AFTER_LOGIN
      } else {
        return displayLogin !== CMS_DISPLAY_LOGIN_ENUMS.BEFORE_LOGIN
      }
    })
  })

  return { navigationBarList }
}
