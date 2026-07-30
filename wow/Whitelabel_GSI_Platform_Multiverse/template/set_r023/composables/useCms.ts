import type * as Response from "src/api/response.type"
import { useCms } from "src/common/composables/useCms"
import { CMS_ENTRANCE_TYPE, CMS_OPENING_METHOD } from "src/common/utils/constants"
import { FB_SPORTS_PRODUCT_CODE } from "src/common/utils/fbSportsLaunch"

import { MENU } from "../utils/constants"
import { useSiteRedirect } from "./useSiteRedirect"

const normalizeDid = (did: string) => {
  return did.replace(/-/g, "_").replace(/[A-Z]/g, "_$&").toLowerCase()
}

export function useEntranceHandler() {
  const { handleEntrance } = useCms()
  const { handleSiteRedirect } = useSiteRedirect()

  const handleEntranceClick = (item: {
    entrance: Response.CmsEntranceItem
    opening_method?: CMS_OPENING_METHOD.Enums
  }) => {
    const did = item.entrance.payload.did as keyof typeof MENU.RouterNameMapping | undefined
    const normalizedDid = did ? normalizeDid(did) : ""
    const productCode = Number(item.entrance.payload.product_code)

    if (productCode === FB_SPORTS_PRODUCT_CODE) {
      handleSiteRedirect({ did: "fb_page", opening_method: item.opening_method })
      return
    }

    if (
      item.entrance.type === CMS_ENTRANCE_TYPE.Enums.INTERNAL_PAGE &&
      did &&
      (MENU.RouterNameMapping[did] || MENU.RouterNameMapping[normalizedDid])
    ) {
      handleSiteRedirect({ did, opening_method: item.opening_method })
      return
    }

    if (item.entrance.type === CMS_ENTRANCE_TYPE.Enums.INTERNAL_PAGE && did) {
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
      openingMethod: item.opening_method,
    })
  }

  return {
    handleEntranceClick,
  }
}
