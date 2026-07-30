import type * as Response from "src/api/response.type"
import { isCmsEntranceActive as isSharedCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { CMS_ENTRANCE_TYPE, CMS_OPENING_METHOD } from "src/common/utils/constants"
import type { RouteLocationNormalizedLoaded } from "vue-router"

import { MENU } from "../utils/constants"
import { useSiteRedirect } from "./useSiteRedirect"

type CmsRouteNameResolver = (did: string) => string | undefined

function normalizeRouteParam(value: unknown): string | undefined {
  if (Array.isArray(value)) return value.length ? String(value[0]) : undefined
  if (value == null) return undefined
  return String(value)
}

function isCategoryLobbyRouteName(routeName: string): boolean {
  return routeName === "ProductLobby" || routeName === "GameLobby"
}

function isCategoryLobbyGameTypeActive(
  entrance: Response.CmsEntranceItem | undefined,
  route: RouteLocationNormalizedLoaded
): boolean {
  if (entrance?.type !== CMS_ENTRANCE_TYPE.Enums.CATEGORY_LOBBY) return false
  const gameType = entrance.payload?.game_type
  if (!gameType) return false

  const routeName = String(route.name ?? "")
  if (!isCategoryLobbyRouteName(routeName)) return false

  return normalizeRouteParam(route.params.gameType) === String(gameType)
}

export function isSetR027CmsEntranceActive(
  entrance: Response.CmsEntranceItem | undefined,
  route: RouteLocationNormalizedLoaded,
  resolveRouteNameByDid: CmsRouteNameResolver
): boolean {
  if (isCategoryLobbyGameTypeActive(entrance, route)) return true

  return isSharedCmsEntranceActive(entrance, route, resolveRouteNameByDid)
}

export function useEntranceHandler() {
  const { handleEntrance } = useCms()
  const { handleSiteRedirect } = useSiteRedirect()

  const handleEntranceClick = (item: {
    entrance: Response.CmsEntranceItem
    opening_method?: CMS_OPENING_METHOD.Enums
  }) => {
    if (item.entrance.type === CMS_ENTRANCE_TYPE.Enums.INTERNAL_PAGE) {
      const did = item.entrance.payload.did as keyof typeof MENU.RouterNameMapping
      handleSiteRedirect({ did, opening_method: item.opening_method })
      return
    }
    handleEntrance({
      entrance: item.entrance,
      isLoginPup: true,
      productLobbyRoute: {
        name: "ProductLobby",
        params: { gameType: item.entrance.payload.game_type },
      },
      cmsHomeRoute: {
        name: "CmsHome",
        params: { cmsId: item.entrance.payload.link_id },
      },
      cmsCustomPageRoute: {
        name: "CmsCustomPage",
        params: { cmsCustomPageId: item.entrance.payload.link_id },
      },
      openingMethod: item.opening_method,
    })
  }

  return {
    handleEntranceClick,
  }
}
