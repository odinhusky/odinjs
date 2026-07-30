import type { PromotionResponseDetail, PromotionResponseItem } from "../api/commonTypes/promotionTypes"
import { PROMOTION_TYPE_ENUMS } from "../constants/enums/promotionType"

export interface PromotionResourceConfig {
  apiBase?: string
  imageBase?: string
  staticResourceUrl?: string
}

export interface PromotionDisplayItem extends PromotionResponseItem {
  detail: PromotionResponseDetail
  imageSrc: string
  contentHtml: string
}

const ABSOLUTE_IMAGE_PATTERN = /^(https?:\/\/|\/\/|data:image\/)/i

const removeTrailingSlash = (value: string) => String(value || "").replace(/\/+$/, "")
const removeLeadingSlash = (value: string) => String(value || "").replace(/^\/+/, "")
const normalizeLocaleCode = (value: string) => String(value || "").toLowerCase().replace("_", "-")

const getPromotionResourceBase = (config: PromotionResourceConfig) =>
  removeTrailingSlash(config.imageBase || config.apiBase || config.staticResourceUrl || "")

const getUrlWithVersion = (url: string, updatedTime?: number | string) => {
  const version = Number(updatedTime)
  if (!url || !Number.isFinite(version)) return url

  const [baseUrl, queryString = ""] = url.split("?")
  const params = new URLSearchParams(queryString)
  if (params.has("updateTime")) return url

  params.delete("v")
  params.set("v", String(version))

  const nextQuery = params.toString()
  return nextQuery ? `${baseUrl}?${nextQuery}` : baseUrl
}

export const buildPromotionImageUrl = (
  image: string | undefined,
  updatedTime: number | string | undefined,
  config: PromotionResourceConfig
) => {
  const rawImage = String(image || "").trim()
  if (!rawImage) return ""

  const withBase = ABSOLUTE_IMAGE_PATTERN.test(rawImage)
    ? rawImage
    : [getPromotionResourceBase(config), removeLeadingSlash(rawImage)].filter(Boolean).join("/")

  return getUrlWithVersion(withBase || rawImage, updatedTime)
}

export const buildPromotionContentHtml = (content: string | undefined, config: PromotionResourceConfig) => {
  const rawContent = String(content || "")
  const apiBase = removeTrailingSlash(config.apiBase || "")
  const resourceBase = getPromotionResourceBase(config)

  if (!apiBase || !resourceBase) return rawContent
  return rawContent.replaceAll(apiBase, resourceBase)
}

export const getPromotionDetailByLocale = (promotion: PromotionResponseItem, locale: string) =>
  promotion.details?.find((detail) => normalizeLocaleCode(detail.lang) === normalizeLocaleCode(locale)) || null

export const getPromotionDetailById = (promotions: PromotionResponseItem[], promotionDetailId: string | number) => {
  const targetId = String(promotionDetailId || "")
  if (!targetId) return null

  for (const promotion of promotions) {
    const detail = promotion.details?.find((item) => String(item.promotion_id) === targetId)
    if (detail) return { promotion, detail }
  }

  return null
}

export const mapPromotionDisplayItems = ({
  promotions,
  locale,
  activeType,
  resourceConfig
}: {
  promotions: PromotionResponseItem[]
  locale: string
  activeType: PROMOTION_TYPE_ENUMS
  resourceConfig: PromotionResourceConfig
}): PromotionDisplayItem[] =>
  promotions
    .map((promotion) => {
      const detail = getPromotionDetailByLocale(promotion, locale)
      if (!detail) return null

      return {
        ...promotion,
        details: [detail],
        detail,
        imageSrc: buildPromotionImageUrl(detail.image, promotion.updated_time, resourceConfig),
        contentHtml: buildPromotionContentHtml(detail.content, resourceConfig)
      }
    })
    .filter((promotion): promotion is PromotionDisplayItem => Boolean(promotion))
    .filter((promotion) => activeType === PROMOTION_TYPE_ENUMS.ALL || promotion.type === activeType)
