import { ROUTE_PATH } from "@shared-lib/constants/routePath"
import { POST_LOGIN_RETURN_ROUTE } from "@shared-lib/constants/sessionStorageKeys"

interface EnsureLoggedInOptions {
  redirectPath?: string
  summary?: string
  detail?: string
  life?: number
}

export const useRequireLogin = () => {
  const authStore = useAuthStore()
  const route = useRoute()
  const { pushToast } = useToastQueue()
  const postLoginReturnRoute = useSessionStorage<string>(POST_LOGIN_RETURN_ROUTE, "")

  const ensureLoggedIn = async (options: EnsureLoggedInOptions = {}) => {
    if (authStore.isLoggedIn) return true

    const redirectPath = String(options.redirectPath || route.fullPath || "")
    postLoginReturnRoute.value = redirectPath

    pushToast({
      severity: TOAST_SEVERITY_ENUMS.ERROR,
      summary: options.summary || "Login Required",
      detail: options.detail || "請先登入",
      life: options.life || 2500
    })

    await navigateTo(ROUTE_PATH.LOGIN.PASSWORD)
    return false
  }

  return {
    ensureLoggedIn
  }
}
