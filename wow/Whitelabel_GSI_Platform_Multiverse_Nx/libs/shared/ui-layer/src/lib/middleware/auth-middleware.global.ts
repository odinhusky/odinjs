import { AUTH_ROUTE_GROUPS, ROUTE_PATH } from "@shared-lib/constants/routePath"
import { useUserProfileStore } from "@shared-lib/stores/userProfile"

const GUEST_ONLY_ROUTES = new Set<string>(AUTH_ROUTE_GROUPS.GUEST_ONLY_ROUTES)
const AUTH_REQUIRED_ROUTES = new Set<string>(AUTH_ROUTE_GROUPS.AUTH_REQUIRED_ROUTES)
const AUTH_REQUIRED_ROUTE_PREFIXES = ["/member/bankCardAdd/", "/member/bankCardEdit/"]

// 代理才能進入的路徑：profile.is_member_agent === false 時擋掉。
// profile 尚未載入時不擋（由頁面層 redirect 兜底，避免直開連結時的 race）。
const AGENT_ONLY_ROUTES = new Set<string>([ROUTE_PATH.MEMBER.MEMBER_MANAGEMENT])

const isAuthRequiredRoute = (path: string) => {
  if (AUTH_REQUIRED_ROUTES.has(path)) return true
  return AUTH_REQUIRED_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix))
}

const sanitizeInternalPath = (path: string) => {
  if (!path) return ""
  if (!path.startsWith("/")) return ""
  if (path.startsWith("//")) return ""
  return path
}

const isGuestOnlyRoute = (path: string) => {
  return GUEST_ONLY_ROUTES.has(path)
}

const isGuestOnlyFullPath = (fullPath: string) => {
  const [path] = fullPath.split("?")
  return isGuestOnlyRoute(path || "")
}

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore(usePinia())
  const postLoginReturnRoute = useSessionStorage<string>(POST_LOGIN_RETURN_ROUTE, "")

  if (!authStore.isLoggedIn) {
    if (isGuestOnlyRoute(to.path)) {
      const existingReturnRoute = sanitizeInternalPath(postLoginReturnRoute.value)
      if (existingReturnRoute) return

      const fallbackFrom = sanitizeInternalPath(from.fullPath)
      if (fallbackFrom && !isGuestOnlyRoute(from.path)) {
        postLoginReturnRoute.value = fallbackFrom
      }
      return
    }

    if (!isAuthRequiredRoute(to.path)) return

    postLoginReturnRoute.value = sanitizeInternalPath(to.fullPath)

    return navigateTo(ROUTE_PATH.LOGIN.PASSWORD, { replace: true })
  }

  if (AGENT_ONLY_ROUTES.has(to.path)) {
    const userProfileStore = useUserProfileStore(usePinia())
    const profile = userProfileStore.profile
    if (profile && !profile.is_member_agent) {
      return navigateTo(ROUTE_PATH.MEMBER.SUMMARY, { replace: true })
    }
  }

  if (!GUEST_ONLY_ROUTES.has(to.path)) return

  const saved = sanitizeInternalPath(postLoginReturnRoute.value)
  postLoginReturnRoute.value = ""

  if (!saved || isGuestOnlyFullPath(saved)) {
    return navigateTo(ROUTE_PATH.HOME, { replace: true })
  }

  return navigateTo(saved, { replace: true })
})
