import { CMS_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsType"
import { CMS_DISPLAY_DEVICE_ENUMS } from "@shared-lib/constants/enums/cmsDisplayDevice"
import { CMS_DISPLAY_LOGIN_ENUMS } from "@shared-lib/constants/enums/cmsDisplayLogin"
import { getCmsList, type GetCmsListResponseType } from "@shared-lib/api/apiFunctions/cms_getCmsList"
import { FIVE_MINUTES } from "@shared-lib/constants/durationTime"
import { ROUTE_PATH } from "@shared-lib/constants/routePath"
import { DEFAULT_DYNAMIC_ITEMS, DYNAMIC_ICON_FALLBACK, SIDE_MENU_LOGOUT_KEY, STATIC_MEMBER_ITEMS } from "./constants"
import {
  ensureExternalLinkProtocol,
  resolveCmsLang,
  resolveDidRoute,
  resolveEntranceNavigationTarget,
} from "./resolver"
import type { SideMenuItem } from "./types"

const buildClickTarget = (key: string) => `handleSideMenu${key.replace(/[^a-zA-Z0-9]/g, "") || "Item"}Click`

const normalizeCmsListResponse = (response: GetCmsListResponseType | { data?: GetCmsListResponseType }) => {
  if (Array.isArray(response)) return response
  return response.data ?? []
}

const normalizeKey = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ")

export const useSideMenu = () => {
  const route = useRoute()
  const authStore = useAuthStore()
  const { currentLocale } = useLanguage()
  const { isDown } = useCustomBreakpoints()
  const { pushToast } = useToastQueue()
  const { logout, isPending: isLogoutPending } = useLogout()
  const collapsed = useState<boolean>("r017-side-menu-collapsed", () => false)

  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value
  }

  const setCollapsed = (value: boolean) => {
    collapsed.value = value
  }

  watch(
    () => isDown.phone,
    (isPhone) => {
      if (!isPhone) return
      collapsed.value = true
    },
    { immediate: true }
  )

  const { data, isLoading } = useApiQuery<typeof getCmsList, GetCmsListResponseType, GetCmsListResponseType>(
    ["r017", "cms-menu", CMS_TYPE_ENUMS.MENU],
    getCmsList,
    { type: CMS_TYPE_ENUMS.MENU },
    {
      staleTime: FIVE_MINUTES,
      select: (response: GetCmsListResponseType | { data?: GetCmsListResponseType }) =>
        normalizeCmsListResponse(response)
    }
  )

  const dynamicItems = computed<SideMenuItem[]>(() => {
    const cmsList = data.value ?? []

    const filteredCmsList = cmsList.filter((item) => {
      const displayLogin = item.Setting?.payload?.display_login ?? CMS_DISPLAY_LOGIN_ENUMS.NO_RESTRICTIONS
      const displayDevice = item.Setting?.payload?.display_device ?? CMS_DISPLAY_DEVICE_ENUMS.NO_RESTRICTIONS

      const loginMatched =
        displayLogin === CMS_DISPLAY_LOGIN_ENUMS.NO_RESTRICTIONS ||
        (displayLogin === CMS_DISPLAY_LOGIN_ENUMS.AFTER_LOGIN && authStore.isLoggedIn) ||
        (displayLogin === CMS_DISPLAY_LOGIN_ENUMS.BEFORE_LOGIN && !authStore.isLoggedIn)

      const deviceMatched =
        displayDevice === CMS_DISPLAY_DEVICE_ENUMS.NO_RESTRICTIONS ||
        (displayDevice === CMS_DISPLAY_DEVICE_ENUMS.DESKTOP && !isDown.phone) ||
        (displayDevice === CMS_DISPLAY_DEVICE_ENUMS.MOBILE && isDown.phone)

      return loginMatched && deviceMatched
    })

    const mapped = filteredCmsList.reduce<SideMenuItem[]>((acc, item) => {
      const entrance = item.Entrance?.[0]
      const label = resolveCmsLang(item.Setting?.lang, String(currentLocale.value))
      if (!entrance || !label) return acc

      const payload = entrance.payload || {}
      const normalizedLabel = normalizeKey(label)
      const fallbackIcon = DYNAMIC_ICON_FALLBACK[normalizedLabel] || "mdi:apps"

      acc.push({
        key: String(item.id),
        label,
        icon: fallbackIcon,
        iconSrc: item.Setting?.icon_path || undefined,
        did: payload.did,
        gameType: payload.game_type,
        to:
          (payload.link ? ensureExternalLinkProtocol(payload.link) : "") ||
          resolveDidRoute(payload.did) ||
          // resolveLobbyRoute(payload.game_type, payload.product_code) ||
          "",
        entrance
      } satisfies SideMenuItem)

      return acc
    }, [])

    if (!mapped.length) return isLoading.value ? [] : DEFAULT_DYNAMIC_ITEMS
    return mapped
  })

  const memberItems = computed(() => {
    if (authStore.isLoggedIn) return STATIC_MEMBER_ITEMS

    return [
      { key: "login", label: "登入", icon: "mdi:login", to: ROUTE_PATH.LOGIN.PASSWORD },
      { key: "register", label: "註冊", icon: "mdi:account-plus-outline", to: ROUTE_PATH.REGISTER }
    ] satisfies SideMenuItem[]
  })

  const isActivePath = (targetPath: string) => {
    if (!targetPath || targetPath.startsWith("http")) return false
    if (targetPath === ROUTE_PATH.HOME) return route.path === ROUTE_PATH.HOME
    return route.path === targetPath || route.path.startsWith(`${targetPath}/`)
  }

  const isItemActive = (item: SideMenuItem) => {
    const target = resolveEntranceNavigationTarget(item)
    const targetPath = target.to || item.to || ""
    if (target.isExternal) return false
    return isActivePath(targetPath)
  }

  // Handle side menu logout click
  const handleItemLogoutClick = async (item: SideMenuItem) => {
    if (!authStore.isLoggedIn || isLogoutPending.value) return

    handleGlobalClick({
      target: buildClickTarget(item.key),
      debounceTimer: 250,
      callback: async () => {
        try {
          await logout()

          pushToast({
            severity: TOAST_SEVERITY_ENUMS.SUCCESS,
            summary: "Logout Success",
            detail: "已成功登出",
            life: 2000
          })
        } catch {
          pushToast({
            severity: TOAST_SEVERITY_ENUMS.ERROR,
            summary: "Logout Failed",
            detail: "登出失敗，請稍後再試",
            life: 2200
          })
        }
      }
    })
  }

  // Handle side menu item click
  const handleItemClick = async (item: SideMenuItem) => {
    if (item.key === SIDE_MENU_LOGOUT_KEY) {
      await handleItemLogoutClick(item)
      return
    }

    handleGlobalClick({
      target: buildClickTarget(item.key),
      debounceTimer: 250,
      callback: async () => {
        const target = resolveEntranceNavigationTarget(item)
        if (!target.to) return

        if (target.isExternal) {
          if (!process.client) return
          window.location.href = target.to
          return
        }

        await navigateTo(target.to)
      }
    })
  }

  return {
    collapsed,
    toggleCollapsed,
    setCollapsed,
    isLoading,
    memberItems,
    dynamicItems,
    isItemActive,
    handleItemClick
  }
}
