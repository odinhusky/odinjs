import { computed, ref } from "vue"
import { useI18n, useRoute, useRouter, useRuntimeConfig } from "#imports"
import { usePromotionListQuery } from "../api/hooks/usePromotionListQuery"
import { PROMOTION_TYPE_ENUMS, PROMOTION_TYPE_I18N_KEYS } from "../constants/enums/promotionType"
import { ROUTE_PATH } from "../constants/routePath"
import {
  buildPromotionContentHtml,
  buildPromotionImageUrl,
  getPromotionDetailById,
  mapPromotionDisplayItems,
  type PromotionDisplayItem
} from "./promotionFlowHelpers"

export interface PromotionTypeOption {
  label: string
  value: PROMOTION_TYPE_ENUMS
}

export interface PromotionDetailDisplayItem {
  promotionId: number
  title: string
  contentHtml: string
  imageSrc: string
}

const removeTrailingSlash = (value: string) => String(value || "").replace(/\/+$/, "")

export function usePromotionFlow() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const activeType = ref(PROMOTION_TYPE_ENUMS.ALL)

  const resourceConfig = computed(() => {
    const staticResourceUrl = String(runtimeConfig.public.staticResourceUrl || "")
    const staticResourceBase =
      typeof window !== "undefined" && staticResourceUrl.startsWith("/")
        ? `${removeTrailingSlash(window.location.origin)}${staticResourceUrl}`
        : staticResourceUrl

    return {
      apiBase: String(runtimeConfig.public.apiBase || ""),
      imageBase: String(runtimeConfig.public.imageBase || ""),
      staticResourceUrl: staticResourceBase
    }
  })

  const { data, isLoading, isFetching, isError, error, refetch } = usePromotionListQuery()
  const rawPromotions = computed(() => data.value ?? [])

  const typeOptions = computed<PromotionTypeOption[]>(() =>
    Object.values(PROMOTION_TYPE_ENUMS)
      .filter((value): value is PROMOTION_TYPE_ENUMS => typeof value === "number")
      .map((value) => {
        const i18nKey = PROMOTION_TYPE_I18N_KEYS[value]
        return {
          value,
          label: t(i18nKey)
        }
      })
  )

  const promotionList = computed<PromotionDisplayItem[]>(() =>
    mapPromotionDisplayItems({
      promotions: rawPromotions.value,
      locale: String(locale.value),
      activeType: activeType.value,
      resourceConfig: resourceConfig.value
    })
  )

  const promotionDetail = computed<PromotionDetailDisplayItem | null>(() => {
    const routeId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
    const result = getPromotionDetailById(rawPromotions.value, String(routeId || ""))
    if (!result) return null

    const { promotion, detail } = result
    return {
      promotionId: detail.promotion_id,
      title: detail.title,
      contentHtml: buildPromotionContentHtml(detail.content, resourceConfig.value),
      imageSrc: buildPromotionImageUrl(detail.image, promotion.updated_time, resourceConfig.value)
    }
  })

  const pageTitle = computed(() => t("menu.promotion"))

  const emptyText = computed(() => t("tableHeader.no_data"))

  const detailRoute = (promotionDetailId: string | number) => `${ROUTE_PATH.PROMOTION}/${promotionDetailId}`

  const changeType = (type: PROMOTION_TYPE_ENUMS) => {
    activeType.value = type
  }

  const openPromotionDetail = (promotionDetailId: string | number) => {
    if (!promotionDetailId) return
    router.push(detailRoute(promotionDetailId))
  }

  const backToPromotionList = () => {
    router.push(ROUTE_PATH.PROMOTION)
  }

  return {
    activeType,
    emptyText,
    error,
    isError,
    isFetching,
    isLoading,
    pageTitle,
    promotionDetail,
    promotionList,
    rawPromotions,
    typeOptions,
    backToPromotionList,
    changeType,
    detailRoute,
    openPromotionDetail,
    refetch
  }
}
