<script setup lang="ts">
import type { CmsItem } from "@shared-lib/api/commonTypes/cmsTypes"
import { CMS_ENTRANCE_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsEntranceType"
import { CMS_DISPLAY_LOGIN_ENUMS } from "@shared-lib/constants/enums/cmsDisplayLogin"
import { CMS_OPENING_METHOD_ENUMS } from "@shared-lib/constants/enums/cmsOpeningMethod"
import { ROUTE_PATH, AUTH_ROUTE_GROUPS } from "@shared-lib/constants/routePath"
import { resolveDidRoute, resolveCategoryLobbyRoute } from "../../composables/useSideMenu/resolver"

const route = useRoute()
const { locale } = useI18n()
const authStore = useAuthStore()
const runtimeConfig = useRuntimeConfig()

const { navigationBarList } = useMobileBottomNav()

const AUTH_REQUIRED_ROUTE_SET = new Set<string>(AUTH_ROUTE_GROUPS.AUTH_REQUIRED_ROUTES)

const imageBaseUrl = computed(() => removeTrailingSlash(String(runtimeConfig.public.imageBase || "")))

// ── Helpers ───────────────────────────────────────────────────────────────

/** 取得多語系標題，優先使用目前語系，其次 en */
const getNavLabel = (item: CmsItem): string => {
  const lang = locale.value
  const titles = item.Setting?.lang ?? {}
  return (titles[lang as keyof typeof titles] as string) || (titles["en"] as string) || ""
}

/**
 * 解析圖示路徑：
 * - 已是絕對 URL (https://...) → 直接使用
 * - 相對路徑 → 拼接 NUXT_PUBLIC_IMAGE_BASE
 */
const resolveIconSrc = (path: string): string => {
  if (!path) return ""
  if (/^https?:\/\//i.test(path)) return path
  return withBase(imageBaseUrl.value, path)
}

const getNavIconSrc = (item: CmsItem, active: boolean): string => {
  const setting = item.Setting
  if (!setting) return ""
  const raw = active ? setting.selected_icon_path || setting.icon_path : setting.icon_path
  return resolveIconSrc(raw || "")
}

/** 從 Entrance[0] 計算目的地路徑 */
const getNavItemTo = (item: CmsItem): string => {
  const entrance = item.Entrance?.[0]
  if (!entrance) return ROUTE_PATH.HOME
  const { type, payload } = entrance

  // 內部頁面 (INTERNAL_PAGE) → 以 did 解析路由
  if (type === CMS_ENTRANCE_TYPE_ENUMS.INTERNAL_PAGE) {
    return resolveDidRoute(payload.did) || ROUTE_PATH.HOME
  }

  // 分類大廳 → 視 LOBBYOPEN 決定走 productLobby 或 gameLobby
  if (type === CMS_ENTRANCE_TYPE_ENUMS.CATEGORY_LOBBY && payload.game_type != null) {
    return resolveCategoryLobbyRoute(payload.game_type) || ROUTE_PATH.HOME
  }

  // 連結類 (CUSTOM_LINK / 其他)
  if (payload.link) {
    return payload.link.startsWith("/") ? payload.link : payload.link
  }

  // 備援：用 did 解析
  if (payload.did) {
    return resolveDidRoute(payload.did) || ROUTE_PATH.HOME
  }

  return ROUTE_PATH.HOME
}

/** 判斷目前路由是否對應到此 Nav 項目 */
const isNavItemActive = (item: CmsItem): boolean => {
  const entrance = item.Entrance?.[0]
  if (!entrance) return false
  const { type, payload } = entrance

  if (type === CMS_ENTRANCE_TYPE_ENUMS.CATEGORY_LOBBY && payload.game_type != null) {
    return String(route.params.gameType ?? "") === String(payload.game_type)
  }

  // INTERNAL_PAGE 或 did → 比對解析出的路徑
  if (type === CMS_ENTRANCE_TYPE_ENUMS.INTERNAL_PAGE || payload.did) {
    const path = resolveDidRoute(payload.did)
    if (!path) return false
    return route.path === path || route.path.startsWith(path + "/")
  }

  if (payload.link) {
    const link = payload.link.startsWith("/") ? payload.link : `/${payload.link}`
    if (link === "/" || link === ROUTE_PATH.HOME) return route.path === ROUTE_PATH.HOME
    return route.path.startsWith(link)
  }

  return false
}

const getNavTextColor = (item: CmsItem) =>
  isNavItemActive(item) ? "var(--navbar-navbar-title-active)" : "var(--navbar-navbar-title-enabled)"

// ── Click handler ─────────────────────────────────────────────────────────

const handleNavItemClick = (event: MouseEvent, item: CmsItem) => {
  event.preventDefault()
  const entrance = item.Entrance?.[0]
  if (!entrance) return

  handleGlobalClick({
    target: `handleMobileBottomNav_${item.id}_Click`,
    debounceTimer: 250,
    callback: async () => {
      const { type, payload } = entrance
      const displayLogin = item.Setting?.payload?.display_login ?? CMS_DISPLAY_LOGIN_ENUMS.NO_RESTRICTIONS

      // 未登入 + 需要登入的項目 → 導向登入頁
      const destination = getNavItemTo(item)
      const requiresLogin =
        displayLogin === CMS_DISPLAY_LOGIN_ENUMS.AFTER_LOGIN || AUTH_REQUIRED_ROUTE_SET.has(destination)

      if (!authStore.isLoggedIn && requiresLogin) {
        await navigateTo(ROUTE_PATH.LOGIN.PASSWORD)
        return
      }

      // INTERNAL_PAGE (did-based)
      if (type === CMS_ENTRANCE_TYPE_ENUMS.INTERNAL_PAGE) {
        const path = resolveDidRoute(payload.did)
        if (path) await navigateTo(path)
        return
      }

      // 分類大廳
      if (type === CMS_ENTRANCE_TYPE_ENUMS.CATEGORY_LOBBY && payload.game_type != null) {
        await navigateTo(resolveCategoryLobbyRoute(payload.game_type))
        return
      }

      // 連結類（依 opening_method 決定開啟方式）
      if (payload.link) {
        const openingMethod = item.Setting?.payload?.opening_method ?? CMS_OPENING_METHOD_ENUMS.REDIRECT
        const isExternal = !payload.link.startsWith("/")
        if (isExternal || openingMethod === CMS_OPENING_METHOD_ENUMS.NEW_TAB) {
          window.open(payload.link, "_blank")
        } else {
          await navigateTo(payload.link)
        }
        return
      }

      // 備援：用 did 解析
      if (payload.did) {
        const path = resolveDidRoute(payload.did)
        if (path) await navigateTo(path)
      }
    }
  })
}
</script>

<template>
  <nav v-if="navigationBarList?.length" class="fixed hidden phone:block bottom-0 left-0 right-0 z-30">
    <div
      class="grid bg-[var(--navbar-navbar-bg)]"
      :style="{ gridTemplateColumns: `repeat(${navigationBarList.length}, 1fr)` }"
    >
      <NuxtLink
        v-for="item in navigationBarList"
        :key="item.id"
        :to="getNavItemTo(item)"
        :class="cx(FLEX_CENTER, 'flex-col gap-2 transition-colors p-3')"
        @click="handleNavItemClick($event, item)"
      >
        <BaseImage
          v-if="getNavIconSrc(item, isNavItemActive(item))"
          :src="getNavIconSrc(item, isNavItemActive(item))"
          class="w-[24px] object-contain"
          :alt="getNavLabel(item)"
          aria-hidden="true"
        />

        <span class="text-sm leading-none" :style="{ color: getNavTextColor(item) }">{{ getNavLabel(item) }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
