import type * as Response from "src/api/response.type"
import { useCms } from "src/common/composables/useCms"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { CMS_DISPLAY_DEVICE } from "src/common/utils/constants"
import { toRef } from "vue"

/** 浮動圖示：登入過濾由 useCms 統一處理，此 hook 僅補裝置判斷 */
export function useFloatingIconListCms() {
  const { isDown } = useMediaQuery()
  const isMobile = toRef(isDown, "padXl")
  const { floatingIconList } = useCms()

  const shouldDisplayDevice = (cmsItem: Response.CmsItem) => {
    const deviceSetting = cmsItem.Setting?.payload?.display_device as CMS_DISPLAY_DEVICE.Enums | undefined

    if (deviceSetting === undefined) {
      return true
    }

    return deviceSetting === CMS_DISPLAY_DEVICE.Enums.NO_RESTRICTIONS
      ? true
      : deviceSetting === CMS_DISPLAY_DEVICE.Enums.DESKTOP
      ? !isMobile.value
      : deviceSetting === CMS_DISPLAY_DEVICE.Enums.MOBILE
      ? isMobile.value
      : false
  }

  return {
    floatingIconList,
    shouldDisplayDevice,
  }
}
