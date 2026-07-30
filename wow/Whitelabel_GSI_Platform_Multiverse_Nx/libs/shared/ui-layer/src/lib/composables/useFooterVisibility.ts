const HIDDEN_FOOTER_PATHS = new Set(["/login", "/login/phone", "/register"])
const MEMBER_ROUTE_ROOT = "/member"

export const shouldShowFooterForPath = (path: string) =>
  path !== MEMBER_ROUTE_ROOT &&
  !path.startsWith(`${MEMBER_ROUTE_ROOT}/`) &&
  !HIDDEN_FOOTER_PATHS.has(path)

export const useFooterVisibility = () => {
  const route = useRoute()

  const shouldShowFooter = computed(() => {
    if (route.meta?.showFooter === true) return true
    if (route.meta?.showFooter === false) return false
    return shouldShowFooterForPath(route.path)
  })

  return {
    shouldShowFooter
  }
}
