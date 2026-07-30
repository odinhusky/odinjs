import { useQuasar } from "quasar"
import type * as Response from "src/api/response.type"
import { useCms } from "src/common/composables/useCms"
import { CMS_DISPLAY_DEVICE } from "src/common/utils/constants"
import { computed } from "vue"

/** 側邊選單按鈕：登入過濾由 useCms.menuList 處理，此 hook 僅過濾裝置 */
export function useAsideMenuBtnListCms() {
  const $q = useQuasar()
  const { menuList } = useCms()

  const asideMenuBtnList = computed(() => {
    const isMobile = $q.platform.is.mobile
    return menuList.value?.filter((item: Response.CmsItem) => {
      const displayDevice = item.Setting?.payload?.display_device
      if (isMobile) {
        return displayDevice !== CMS_DISPLAY_DEVICE.Enums.DESKTOP
      }
      return displayDevice !== CMS_DISPLAY_DEVICE.Enums.MOBILE
    })
  })

  return {
    asideMenuBtnList,
  }
}
