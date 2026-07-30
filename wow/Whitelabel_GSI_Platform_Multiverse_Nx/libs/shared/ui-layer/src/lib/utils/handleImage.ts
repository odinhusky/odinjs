import type { CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"
import { CMS_ENTRANCE_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsEntranceType"
import { GAME_TYPE_ENUMS } from "@shared-lib/constants/enums/gameType"

interface GameTypeMapItem {
  game_type?: string
}

export const removeTrailingSlash = (url: string): string => {
  return String(url || "").replace(/\/+$/, "")
}

export const withBase = (base: string, path: string): string => {
  if (!path) return ""
  if (/^https?:\/\//i.test(path)) return path
  if (!base) return path
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`
}

export const withImageVersion = (url: string, updatedAt?: number): string => {
  if (!url || !Number.isFinite(Number(updatedAt))) return url
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}v=${Number(updatedAt)}`
}

const isHttpUrl = (value: string): boolean => /^https?:\/\//i.test(value)

const isLocalhostOrigin = (origin: string): boolean => {
  try {
    const hostname = new URL(origin).hostname
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
  } catch {
    return false
  }
}

export const resolveStaticResourceBase = ({
  origin,
  staticResourceUrl,
  staticResourceProxyTarget
}: {
  origin?: string
  staticResourceUrl: string
  staticResourceProxyTarget?: string
}): string => {
  const resourceUrl = removeTrailingSlash(staticResourceUrl)
  if (!resourceUrl) return ""
  if (isHttpUrl(resourceUrl)) return resourceUrl

  const originBase = removeTrailingSlash(origin || "")
  const proxyBase = removeTrailingSlash(staticResourceProxyTarget || "")

  if (!import.meta.dev && originBase && isLocalhostOrigin(originBase) && proxyBase) {
    return withBase(proxyBase, resourceUrl)
  }

  return originBase ? withBase(originBase, resourceUrl) : resourceUrl
}

export const GAME_TYPE_IMAGE_FOLDER: Record<number, string> = {
  1: "SLOT",
  2: "LIVE_CASINO",
  8: "FISHING",
  12: "POKER"
}

export const toGameImageFolder = (gameTypeId: number): string => GAME_TYPE_IMAGE_FOLDER[gameTypeId] ?? ""

export const toGameTypeString = ({
  gameType,
  gameTypeMap
}: {
  gameType: unknown
  gameTypeMap: Record<number, GameTypeMapItem>
}): string => {
  if (typeof gameType === "string") {
    const trimmed = gameType.trim()
    if (!trimmed) return ""

    const parsedId = Number(trimmed)
    if (Number.isFinite(parsedId) && gameTypeMap[parsedId]?.game_type) {
      return String(gameTypeMap[parsedId].game_type || "")
    }

    return trimmed
  }

  if (typeof gameType === "number" && Number.isFinite(gameType)) {
    return String(gameTypeMap[gameType]?.game_type || "")
  }

  return ""
}

export interface CmsImageConfig {
  imageBase: string
  origin: string
  staticResourceUrl: string
  staticResourceProxyTarget?: string
}

export const gameTypeToString = (gameType: number | string | undefined | null): string => {
  if (gameType == null) return ""
  if (typeof gameType === "number") {
    return toGameImageFolder(gameType) || GAME_TYPE_ENUMS[gameType] || String(gameType)
  }
  const parsed = Number(gameType)
  if (Number.isFinite(parsed) && parsed > 0) {
    return toGameImageFolder(parsed) || GAME_TYPE_ENUMS[parsed] || String(gameType)
  }
  return String(gameType)
}

export const buildCmsEntranceImageSrc = (entrance: CmsEntranceItem, config: CmsImageConfig): string => {
  const { imageBase, origin, staticResourceUrl, staticResourceProxyTarget } = config
  const resourceUrl = removeTrailingSlash(staticResourceUrl)
  const originBase = removeTrailingSlash(origin)
  const staticBase = resolveStaticResourceBase({ origin, staticResourceUrl, staticResourceProxyTarget })

  if (entrance.img_path) {
    if (/^https?:\/\//i.test(entrance.img_path)) {
      return entrance.img_path
    }

    if (resourceUrl && entrance.img_path.startsWith(resourceUrl)) {
      return `${originBase}${entrance.img_path}`
    }

    return withBase(removeTrailingSlash(imageBase), entrance.img_path)
  }

  const p = entrance.payload
  if (entrance.type === CMS_ENTRANCE_TYPE_ENUMS.GAME_LINK && p.product_code && p.game_type != null && p.game_code) {
    const gameTypeStr = gameTypeToString(p.game_type)
    const integrationId = p.product_integration_id ?? 1

    return withBase(
      staticBase,
      `/publics/images/games/${integrationId}/${p.product_code}/${gameTypeStr}/${p.game_code}.png`
    )
  }

  return ""
}
