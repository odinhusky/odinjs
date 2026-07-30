import { useEnv } from "src/common/hooks/useEnv"

// 可直接使用的資源路徑：base64、完整 http(s) URL、或 protocol-relative URL
const DIRECT_RESOURCE_PATH_REGEX = /^(data:image\/|https?:\/\/|\/\/)/i
const HTTP_URL_REGEX = /^https?:\/\//i
const TRAILING_SLASH_REGEX = /\/$/
const LEADING_SLASH_REGEX = /^\/+/
const HASH_SPLIT_REGEX = /#/
const UPDATE_TIME_QUERY_PARAM_REGEX = /(?:[?&])updateTime=/i
const VERSION_QUERY_PARAM_REGEX = /([?&])v=[^&#]*/gi
const QUESTION_AND_REGEX = /\?&/
const TRAILING_QUERY_SEPARATOR_REGEX = /[?&]$/

const IMAGE_TRANSFORM_PARAM_KEYS = ["format", "width", "height", "fit"] as const
/** 第一個 ? 之後誤用 ? 當參數分隔（例如 ?updateTime=1?updateTime=2）→ 改為 & */
const MALFORMED_QUERY_SEPARATOR_REGEX = /\?([^=&#?]+=)/g
const CANONICAL_STATIC_RESOURCE_ORIGIN = "https://staticresource.gpsriowdl.com"
const CANONICAL_STATIC_RESOURCE_HOST = "staticresource.gpsriowdl.com"
const IMAGE_RESOURCE_HOST_PREFIX_REGEX = /^(?:wowdata|staticresource)\./i

export interface DynamicImageTransformParams {
  format?: string
  width?: number
  height?: number
  fit?: string
}

export interface DynamicImageSrcSetEntry {
  width: number
  height?: number
}

const DEFAULT_IMAGE_TRANSFORM: DynamicImageTransformParams = {
  format: "webp",
}

/** 常見 UI 顯示尺寸（px），供 buildImageUrl transform 使用 */
export const DYNAMIC_IMAGE_DISPLAY_SIZE = {
  /** CSS 約 40px；請求 80 以覆蓋 mobile 2x DPR，避免「低解析度」警告 */
  CMS_ICON: 80,
  CMS_FLOAT_ICON: 60,
  CMS_ENTRANCE: 166,
  AVATAR_SM: 32,
  AVATAR_MD: 52,
  GAME_SQUARE: 166,
  GAME_TAB: 48,
  FOOTER_LOGO: 120,
  POPUP: 320,
  PROMOTION_CARD: 640,
  BANNER: 768,
  VIP_BADGE: 120,
  LOGO_WIDE_MOBILE_WIDTH: 235,
  LOGO_WIDE_MOBILE_HEIGHT: 56,
  LOGO_WIDE_DESKTOP_WIDTH: 280,
  LOGO_WIDE_DESKTOP_HEIGHT: 70,
  LOGO_SQUARE_MOBILE: 96,
  LOGO_SQUARE_DESKTOP: 128,
  FAVICON: 32,
} as const

export function squareCoverTransform(size: number): DynamicImageTransformParams {
  return { width: size, height: size, fit: "cover" }
}

export function coverImageTransform(width: number, height: number): DynamicImageTransformParams {
  return { width, height, fit: "cover" }
}

/** Banner cover 高度（與 768×320 相同比例） */
export function bannerCoverHeight(width: number): number {
  return Math.round((width * 320) / DYNAMIC_IMAGE_DISPLAY_SIZE.BANNER)
}

/** 依 viewport 寬度選擇 banner CDN transform（供 src fallback / 非 srcset 場景） */
export function bannerTransformForViewportWidth(viewportWidth: number): DynamicImageTransformParams {
  const bannerWidth =
    viewportWidth <= 767 ? 404 : viewportWidth <= 999 ? 889 : viewportWidth <= 1439 ? 923 : 1200

  return coverImageTransform(bannerWidth, bannerCoverHeight(bannerWidth))
}

const IMG_TAG_REGEX = /<img\b([^>]*?)>/gi
const HTML_ATTR_REGEX = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/**
 * 依環境 dynamicResourceUrl 取出 path，並統一掛在 canonical static resource origin。
 * 例如 wowdata.gsiwl.com/gsi/dev/devm → staticresource.gpsriowdl.com/gsi/dev/devm
 */
export function resolveCanonicalDynamicResourceBaseUrl(dynamicResourceUrl?: string): string {
  if (!dynamicResourceUrl) return CANONICAL_STATIC_RESOURCE_ORIGIN

  const trimmed = dynamicResourceUrl.replace(TRAILING_SLASH_REGEX, "")
  if (!trimmed) return CANONICAL_STATIC_RESOURCE_ORIGIN

  if (HTTP_URL_REGEX.test(trimmed)) {
    try {
      const pathname = new URL(trimmed).pathname.replace(TRAILING_SLASH_REGEX, "")
      return pathname ? `${CANONICAL_STATIC_RESOURCE_ORIGIN}${pathname}` : CANONICAL_STATIC_RESOURCE_ORIGIN
    } catch {
      return CANONICAL_STATIC_RESOURCE_ORIGIN
    }
  }

  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  return `${CANONICAL_STATIC_RESOURCE_ORIGIN}${normalizedPath}`
}

const shouldRewriteImageResourceHost = (hostname: string): boolean => {
  if (hostname.toLowerCase() === CANONICAL_STATIC_RESOURCE_HOST) return false
  return IMAGE_RESOURCE_HOST_PREFIX_REGEX.test(hostname)
}

/**
 * 將 wowdata / 非 canonical 的 staticresource 圖片域名改寫為 staticresource.gpsriowdl.com，
 * 避免各環境設定不同時無法走 CDN transform。
 */
export function rewriteLegacyImageResourceHost(url: string): string {
  if (!url || /^data:/i.test(url)) return url

  const rewriteHost = (hostname: string, pathname: string, search: string, hash: string, protocol?: string) => {
    if (!shouldRewriteImageResourceHost(hostname)) return null

    const nextProtocol = protocol ?? "https:"
    return `${nextProtocol}//${CANONICAL_STATIC_RESOURCE_HOST}${pathname}${search}${hash}`
  }

  if (url.startsWith("//")) {
    try {
      const urlObj = new URL(`https:${url}`)
      const rewritten = rewriteHost(urlObj.hostname, urlObj.pathname, urlObj.search, urlObj.hash, "//")
      return rewritten ?? url
    } catch {
      return url
    }
  }

  if (!HTTP_URL_REGEX.test(url)) return url

  try {
    const urlObj = new URL(url)
    const rewritten = rewriteHost(urlObj.hostname, urlObj.pathname, urlObj.search, urlObj.hash, urlObj.protocol)
    return rewritten ?? url
  } catch {
    return url
  }
}

/**
 * 正規化圖片資源 query：
 * - 修正誤用 `?` 重複拼接參數（常見於 updateTime）
 * - 同一 key 只保留最後一個值（updateTime / v 等 cache bust）
 */
export function normalizeImageResourceQuery(url: string): string {
  if (!url || /^data:/i.test(url)) return url

  const [urlWithoutHash = "", hashFragment] = url.split(HASH_SPLIT_REGEX)
  const questionMarkIndex = urlWithoutHash.indexOf("?")
  if (questionMarkIndex < 0) return url

  const baseUrl = urlWithoutHash.slice(0, questionMarkIndex)
  let existingQuery = urlWithoutHash.slice(questionMarkIndex + 1)

  // 後端 / 上游偶發用 ? 連續拼接：a.jpg?updateTime=1?updateTime=2
  existingQuery = existingQuery.replace(MALFORMED_QUERY_SEPARATOR_REGEX, "&$1")

  const params = new URLSearchParams(existingQuery)
  const deduped = new URLSearchParams()
  for (const key of [...new Set(params.keys())]) {
    const values = params.getAll(key)
    const lastValue = values[values.length - 1]
    if (lastValue !== undefined && lastValue !== "") {
      // 若值本身仍嵌著未切乾淨的 updateTime=...，只取最後一段數字／token
      const nestedUpdateTime = lastValue.match(/(?:^|[?&])updateTime=([^?&]*)/gi)
      if (key.toLowerCase() === "updatetime" && nestedUpdateTime?.length) {
        const nestedLast = nestedUpdateTime[nestedUpdateTime.length - 1]?.replace(/^.*?=/i, "") ?? lastValue
        deduped.set(key, nestedLast)
      } else {
        deduped.set(key, lastValue)
      }
    }
  }

  const queryString = deduped.toString()
  const nextUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl
  return hashFragment ? `${nextUrl}#${hashFragment}` : nextUrl
}

export function parseHtmlImgDimension(value?: string): number | undefined {
  if (!value) return undefined
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

export function extractUploadPathFromApiUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    if (!/^api-/i.test(urlObj.hostname)) return null
    const path = urlObj.pathname.replace(LEADING_SLASH_REGEX, "")
    return path.startsWith("uploads/") ? path : null
  } catch {
    return null
  }
}

function parseHtmlAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  for (const match of attrString.matchAll(HTML_ATTR_REGEX)) {
    attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? ""
  }
  return attrs
}

function buildTransformFromImgAttributes(attrs: Record<string, string>): DynamicImageTransformParams {
  const width = parseHtmlImgDimension(attrs.width)
  const height = parseHtmlImgDimension(attrs.height)
  const transform: DynamicImageTransformParams = {}

  if (width) transform.width = width
  if (height) transform.height = height
  if (width || height) transform.fit = "cover"

  return transform
}

/**
 * 構建動態資源圖片 URL
 * @param imagePath 圖片路徑（可能是相對路徑或絕對路徑）
 * @param version 版本號（可選，用於緩存控制）
 * @param transform CDN 圖片轉換參數（可選，預設 format=webp）
 * @returns 完整的圖片 URL
 */
export function useDynamicImage() {
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL, VITE_APP_BASE_API } = envData()
  const canonicalDynamicResourceBaseUrl = resolveCanonicalDynamicResourceBaseUrl(VITE_APP_DYNAMIC_RESOURCE_URL)

  const buildImageUrl = (
    imagePath: string,
    version?: string | number,
    transform?: DynamicImageTransformParams
  ): string => {
    if (!imagePath) {
      return ""
    }

    if (DIRECT_RESOURCE_PATH_REGEX.test(imagePath)) {
      // 已是可用 URL，不再拼接 dynamic resource base URL
      return finalizeUrl(imagePath, version, transform)
    }

    // 統一清理 base/path 的斜線，避免拼接出現雙斜線
    const normalizedDynamicUrl = canonicalDynamicResourceBaseUrl.replace(TRAILING_SLASH_REGEX, "")
    const cleanPath = imagePath.replace(LEADING_SLASH_REGEX, "")

    if (!normalizedDynamicUrl) {
      return finalizeUrl(cleanPath, version, transform)
    }

    try {
      if (HTTP_URL_REGEX.test(normalizedDynamicUrl)) {
        const urlObj = new URL(normalizedDynamicUrl)
        const baseFirstSegment = urlObj.pathname.replace(LEADING_SLASH_REGEX, "").split("/")[0]
        // 若 path 已包含與 dynamic base URL 相同的第一層路徑（例如 gsi/...），
        // 表示它其實已是從網域根目錄開始的絕對路徑，避免再重複拼接一層 base path
        if (baseFirstSegment) {
          const rootSegmentRegex = new RegExp(`^${escapeRegExp(baseFirstSegment)}/`)
          if (rootSegmentRegex.test(cleanPath)) {
            return finalizeUrl(`${urlObj.origin}/${cleanPath}`, version, transform)
          }
        }
      }
    } catch (e) {
      // 忽略解析錯誤
    }

    return finalizeUrl(`${normalizedDynamicUrl}/${cleanPath}`, version, transform)
  }

  const applyImageTransformParams = (url: string, transform: DynamicImageTransformParams): string => {
    if (!url) return url
    // data: URL 不支援 CDN 圖片轉換參數
    if (/^data:/i.test(url)) return url

    const normalizedUrl = normalizeImageResourceQuery(url)
    const [urlWithoutHash = "", hashFragment] = normalizedUrl.split(HASH_SPLIT_REGEX)
    const questionMarkIndex = urlWithoutHash.indexOf("?")
    const baseUrl = questionMarkIndex >= 0 ? urlWithoutHash.slice(0, questionMarkIndex) : urlWithoutHash
    const existingQuery = questionMarkIndex >= 0 ? urlWithoutHash.slice(questionMarkIndex + 1) : ""
    const params = new URLSearchParams(existingQuery)

    for (const key of IMAGE_TRANSFORM_PARAM_KEYS) {
      const value = transform[key]
      if (value !== undefined && value !== null && value !== "" && !params.has(key)) {
        params.set(key, String(value))
      }
    }

    const queryString = params.toString()
    const nextUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl
    return hashFragment ? `${nextUrl}#${hashFragment}` : nextUrl
  }

  const finalizeUrl = (
    url: string,
    version?: string | number,
    transform?: DynamicImageTransformParams
  ): string =>
    applyImageTransformParams(
      addVersion(normalizeImageResourceQuery(rewriteLegacyImageResourceHost(url)), version),
      {
        ...DEFAULT_IMAGE_TRANSFORM,
        ...transform,
      }
    )

  const addVersion = (url: string, version?: string | number): string => {
    if (version === undefined) return url
    // data: URL（含 base64）附加 ?v= 會插在 payload 後，瀏覽器無法解析；內嵌資料亦無需 cache bust
    if (/^data:/i.test(url)) return url
    // 先拆出 hash（#...），避免 query 調整時破壞 hash 內容
    const [urlWithoutHash = "", hashFragment] = url.split(HASH_SPLIT_REGEX)
    // 清掉既有 v 參數與殘留分隔符，避免出現 ?v=1&v=2 或 ?v=?v= 的重複版本問題
    const normalizedUrl = urlWithoutHash
      .replace(VERSION_QUERY_PARAM_REGEX, "$1")
      .replace(QUESTION_AND_REGEX, "?")
      .replace(TRAILING_QUERY_SEPARATOR_REGEX, "")
    // 若後端已提供 updateTime（例如 ?updateTime=...），視為 cache bust 來源，避免再疊加 v
    if (UPDATE_TIME_QUERY_PARAM_REGEX.test(normalizedUrl)) {
      return hashFragment ? `${normalizedUrl}#${hashFragment}` : normalizedUrl
    }
    const separator = normalizedUrl.includes("?") ? "&" : "?"
    const nextUrl = `${normalizedUrl}${separator}v=${version}`
    return hashFragment ? `${nextUrl}#${hashFragment}` : nextUrl
  }

  const resolveCmsHtmlImageSrc = (src: string, transform: DynamicImageTransformParams): string => {
    const trimmedSrc = src.trim()
    if (!trimmedSrc || /^data:/i.test(trimmedSrc)) return trimmedSrc

    const uploadPath = extractUploadPathFromApiUrl(trimmedSrc)
    if (uploadPath) {
      return buildImageUrl(uploadPath, undefined, transform)
    }

    if (/^\/?uploads\//i.test(trimmedSrc)) {
      return buildImageUrl(trimmedSrc, undefined, transform)
    }

    if (/^https?:\/\//i.test(trimmedSrc) && isTransformableCmsImageUrl(trimmedSrc)) {
      return buildImageUrl(trimmedSrc, undefined, transform)
    }

    if (!/^https?:\/\//i.test(trimmedSrc)) {
      return buildImageUrl(trimmedSrc, undefined, transform)
    }

    return trimmedSrc
  }

  const isTransformableCmsImageUrl = (url: string): boolean => {
    if (extractUploadPathFromApiUrl(url)) return true

    try {
      const urlObj = new URL(url)
      const host = urlObj.hostname

      if (/^api-/i.test(host) && urlObj.pathname.includes("/uploads/")) return true
      if (/staticresource\.|wowdata\./i.test(host)) return true

      if (VITE_APP_BASE_API && url.startsWith(VITE_APP_BASE_API)) return true

      if (VITE_APP_DYNAMIC_RESOURCE_URL) {
        const dynamicOrigin = new URL(VITE_APP_DYNAMIC_RESOURCE_URL).origin
        if (url.startsWith(dynamicOrigin)) return true
      }
    } catch {
      return false
    }

    return false
  }

  const buildImageSrcSet = (
    imagePath: string,
    version?: string | number,
    entries: DynamicImageSrcSetEntry[] = []
  ): string => {
    if (!imagePath || !entries.length) return ""

    const uniqueEntries = [...new Map(entries.map((entry) => [entry.width, entry])).values()].sort(
      (a, b) => a.width - b.width
    )

    return uniqueEntries
      .map(({ width, height }) => {
        const url = buildImageUrl(imagePath, version, coverImageTransform(width, height ?? bannerCoverHeight(width)))
        return `${url} ${width}w`
      })
      .join(", ")
  }

  const transformCmsHtmlContent = (html: string): string => {
    if (!html) return html

    const normalizedHtml = VITE_APP_BASE_API
      ? html.replaceAll(VITE_APP_BASE_API, canonicalDynamicResourceBaseUrl)
      : html

    return normalizedHtml.replace(IMG_TAG_REGEX, (fullMatch, attrPart) => {
      const attrs = parseHtmlAttributes(attrPart)
      const src = attrs.src
      if (!src) return fullMatch

      const nextSrc = resolveCmsHtmlImageSrc(src, buildTransformFromImgAttributes(attrs))
      if (nextSrc === src) return fullMatch

      return fullMatch.replace(src, nextSrc)
    })
  }

  return {
    buildImageUrl,
    buildImageSrcSet,
    transformCmsHtmlContent,
  }
}
