import type * as Response from "src/api/response.type"
import { useCms } from "src/common/composables/useCms"
import { useAuth } from "src/common/hooks/useAuth"
import { CMS_DISPLAY_LOGIN } from "src/common/utils/constants"
import { computed } from "vue"

export function useH5MenuListCms() {
  const { isLogin } = useAuth()
  const { cmsH5BottomMenuList } = useCms()

  const h5MenuList = computed(() => {
    if (!isLogin.value) {
      return cmsH5BottomMenuList.value?.filter((cmsItem: Response.CmsItem) => {
        const login = cmsItem.Setting?.payload?.display_login
        return login !== CMS_DISPLAY_LOGIN.Enums.AFTER_LOGIN
      })
    } else {
      return cmsH5BottomMenuList.value?.filter((cmsItem: Response.CmsItem) => {
        const login = cmsItem.Setting?.payload?.display_login
        return login !== CMS_DISPLAY_LOGIN.Enums.BEFORE_LOGIN
      })
    }
  })

  return {
    h5MenuList,
  }
}
