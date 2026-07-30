import type { CmsItem, CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"
import type { Banner } from "@shared-lib/api/apiFunctions/banner_getBannerList"
import type { ProductItem } from "@shared-lib/api/commonTypes/gameTypes"
import { CMS_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsType"
import { CMS_ENTRANCE_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsEntranceType"
import { BANNER_POSITION_ENUMS } from "@shared-lib/constants/enums/bannerPosition"
import { GAME_TYPE_STRING_TO_ENUMS } from "@shared-lib/constants/enums/gameType"
import { TANSTACK_QUERY_KEY_PRODUCT_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import { ROUTE_PATH } from "@shared-lib/constants/routePath"
import { getAllProductList } from "@shared-lib/api/apiFunctions/game_getAllProductList"
import { useBanner } from "@shared-lib/api/hooks/useBanner"
import { useCmsListQuery } from "@shared-lib/api/hooks/useCmsListQuery"
import { useApiQuery } from "@shared-lib/api/useApiQuery"
import { toProductLobbyRoute, toGameLobbyRoute } from "@shared-lib/constants/routePath"

export const useHome = () => {
  const router = useRouter()
  const { locale } = useI18n()
  const { openGame } = useOpenGame()

  // ── Banner ────────────────────────────────────────────────────────────────
  const { bannerList, isLoading: isBannerLoading } = useBanner({
    params: { position: BANNER_POSITION_ENUMS.HOME }
  })

  // ── CMS Home sections ─────────────────────────────────────────────────────
  const { data: homeCmsList, isLoading: isCmsLoading } = useCmsListQuery({
    type: CMS_TYPE_ENUMS.HOME
  })

  // console.log("!! homeCmsList", homeCmsList)

  // ── All product list (for ProviderList) ───────────────────────────────────
  const { data: allProductList, isLoading: isAllProductLoading } = useApiQuery<typeof getAllProductList, ProductItem[]>(
    [TANSTACK_QUERY_KEY_PRODUCT_LIST, "all"],
    getAllProductList,
    undefined,
    {
      select: (response) => (response.data ?? []) as ProductItem[]
    }
  )

  // ── Product tab image (reuse same logic as useGameLobby) ──────────────────
  const { getImage } = useGetImage()

  const getProductTabImage = (productCode: number) => getImage(`/images/tabs/${productCode}.png`)

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getBannerImage = (banner: Banner): string => {
    const lang = locale.value
    const v2 = banner.image_json_v2
    const v1 = banner.image_json
    return v2?.[lang] || v2?.["en"] || v1?.[lang] || v1?.["en"] || Object.values(v2 ?? v1 ?? {})[0] || ""
  }

  const getCmsTitle = (item: CmsItem): string => {
    const lang = locale.value
    const titles = item.Setting?.lang ?? {}
    return (titles[lang as keyof typeof titles] as string) || (titles["en"] as string) || ""
  }

  // ── Click handlers ────────────────────────────────────────────────────────
  const handleBannerClick = (banner: Banner) => {
    if (banner.game_code && banner.product_code) {
      openGame(0, banner.product_code, banner.game_code, banner.game_type)
      return
    }
    if (banner.link) {
      window.open(banner.link, "_blank")
    }
  }

  const handleCmsEntranceClick = (entrance: CmsEntranceItem) => {
    const { type, payload } = entrance

    if (type === CMS_ENTRANCE_TYPE_ENUMS.GAME_LINK) {
      openGame(
        Number(payload.integration_id),
        Number(payload.product_code),
        String(payload.game_code || ""),
        Number(payload.game_type)
      )
      return
    }

    if (type === CMS_ENTRANCE_TYPE_ENUMS.CATEGORY_LOBBY) {
      if (payload.game_type) {
        router.push(toProductLobbyRoute(payload.game_type))
      }
      return
    }

    // 內部頁面 (例如優惠活動) — 使用 router.push 進行 SPA 導頁
    if (type === CMS_ENTRANCE_TYPE_ENUMS.INTERNAL_PAGE && payload.link) {
      router.push(payload.link)
      return
    }

    // 自訂連結 — 內部路徑用 router.push，外部 URL 開新分頁
    if (type === CMS_ENTRANCE_TYPE_ENUMS.CUSTOM_LINK && payload.link) {
      if (payload.link.startsWith("/")) {
        router.push(payload.link)
      } else {
        window.open(payload.link, "_blank")
      }
    }
  }

  const handleProviderClick = (provider: ProductItem) => {
    console.log("!! provider", provider)
    const gameTypeId = GAME_TYPE_STRING_TO_ENUMS[String(provider.game_type).replaceAll("_", "").toUpperCase()]
    if (gameTypeId) {
      router.push(toGameLobbyRoute(gameTypeId, provider.product_code))
    }
  }

  return {
    bannerList,
    isBannerLoading,
    homeCmsList,
    isCmsLoading,
    allProductList,
    isAllProductLoading,
    getProductTabImage,
    getBannerImage,
    getCmsTitle,
    handleBannerClick,
    handleCmsEntranceClick,
    handleProviderClick
  }
}
