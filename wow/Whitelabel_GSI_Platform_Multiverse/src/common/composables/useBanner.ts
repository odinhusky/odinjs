import { getBannerList } from "src/api/banner"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import {
  bannerTransformForViewportWidth,
  useDynamicImage,
  type DynamicImageSrcSetEntry,
} from "src/common/composables/useDynamicImage"
import { useLanguage } from "src/common/composables/useLanguage"
import { useApi } from "src/common/hooks/useApi"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { bannerMatchesContext } from "src/common/utils/bannerContext"
import { BANNER_OPENING_METHOD, BANNER_POSITION, GAME_TYPE } from "src/common/utils/constants"
import {
  getEarlyHomeBannerList,
  hasEarlyHomeBannerPrefetch,
  peekEarlyHomeBannerList,
  setEarlyHomeBannerPrefetch,
} from "src/common/utils/earlyHomeBanner"
import { useBannerStore } from "src/stores/bannerStore"
import { useLanguageStore } from "src/stores/languageStore"
import { computed } from "vue"
import { useRouter } from "vue-router"

interface IPreloadCallbacks {
  onProgress?: (loaded: number, total: number) => void
  onComplete?: (allLoaded: boolean) => void
  onSingleLoad?: (url: string) => void
  onSingleError?: (url: string) => void
}

export type BannerListLoadResult = { status: "success" } | { status: "failure" } | { status: "stale" }

export const BANNER_SRCSET_WIDTHS = [404, 670, 889, 923, 1200] as const

export const BANNER_IMAGE_SIZES = {
  FULL_WIDTH: "(max-width: 767px) calc(100vw - 16px), (max-width: 999px) 889px, (max-width: 1439px) 923px, 1200px",
  /** 1 / 2 / 3 欄 swiper，含左右 padding（避免 100vw 高估導致選到 889w） */
  SWIPER_MULTI:
    "(max-width: 499px) calc(100vw - 30px), (max-width: 1023px) calc((100vw - 40px) / 2), calc((100vw - 30px) / 3)",
  /**
   * set_r022 等：>=1024 常駐 left drawer（244px）+ 1/2/3 欄 swiper
   * Mobile Lighthouse 約 382 CSS px → DPR 後對應 670w；Desktop 約 360 CSS px → 404w
   */
  SWIPER_MULTI_WITH_DRAWER:
    "(max-width: 499px) calc(100vw - 30px), (max-width: 1023px) calc((100vw - 40px) / 2), calc((100vw - 274px) / 3)",
} as const

const BANNER_SRCSET_ENTRIES: DynamicImageSrcSetEntry[] = BANNER_SRCSET_WIDTHS.map((width) => ({ width }))

let latestBannerRequestId = 0

const EARLY_HOME_BANNER_SITE_KEYS = new Set(["set_r022"])

function isValidDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value))
}

function isBannerWithinDisplayDate(banner: Response.Banner, nowTime: number): boolean {
  if (banner.start_date) {
    if (!isValidDate(banner.start_date)) return false
    if (nowTime < Date.parse(banner.start_date)) return false
  }

  if (banner.end_date) {
    if (!isValidDate(banner.end_date)) return false
    if (nowTime > Date.parse(banner.end_date)) return false
  }

  return true
}

function compareBannerSorts(a: Response.Banner, b: Response.Banner): number {
  const leftSort = typeof a.sorts === "number" ? a.sorts : Number.MAX_SAFE_INTEGER
  const rightSort = typeof b.sorts === "number" ? b.sorts : Number.MAX_SAFE_INTEGER

  if (leftSort !== rightSort) {
    return leftSort - rightSort
  }

  return (a.id ?? 0) - (b.id ?? 0)
}

const LCP_BANNER_PRELOAD_ATTR = "data-lcp-banner-preload"

function removeLcpBannerPreloadLinks() {
  if (typeof document === "undefined") return
  document.head.querySelectorAll(`link[${LCP_BANNER_PRELOAD_ATTR}]`).forEach((node) => node.remove())
}

/**
 * 在 banner API 回傳後儘早 preload 首張 LCP 圖，縮短 resource load delay。
 * 使用 imagesrcset / imagesizes 讓瀏覽器選對 DPR 尺寸。
 */
export function preloadLcpBannerImage(options: {
  href: string
  imagesrcset?: string
  imagesizes?: string
}) {
  if (typeof document === "undefined" || !options.href) return

  removeLcpBannerPreloadLinks()

  const link = document.createElement("link")
  link.rel = "preload"
  link.as = "image"
  link.href = options.href
  link.setAttribute(LCP_BANNER_PRELOAD_ATTR, "true")
  link.setAttribute("fetchpriority", "high")
  if (options.imagesrcset) {
    link.setAttribute("imagesrcset", options.imagesrcset)
  }
  if (options.imagesizes) {
    link.setAttribute("imagesizes", options.imagesizes)
  }
  document.head.appendChild(link)
}

export function clearLcpBannerPreload() {
  removeLcpBannerPreloadLinks()
}

function resolveBannerImageSourceForLang(banner: Response.Banner, lang: string) {
  const imageJsonPath = banner.image_json?.[lang]
  if (typeof imageJsonPath === "string" && imageJsonPath) {
    return { path: imageJsonPath, version: banner.updated_time }
  }

  const imageJsonV2 = banner.image_json_v2?.[lang]
  if (typeof imageJsonV2 === "string" && imageJsonV2) {
    return { path: imageJsonV2, version: banner.updated_time }
  }
  if (imageJsonV2 && typeof imageJsonV2 === "object" && imageJsonV2.data) {
    return { path: imageJsonV2.data, version: banner.updated_time }
  }

  const storageKeyPath = banner.storage_keys?.[lang]
  if (typeof storageKeyPath === "string" && storageKeyPath) {
    return { path: storageKeyPath, version: banner.updated_time }
  }

  return undefined
}

function buildUsableHomeBannerList(data: Response.BannerList, lang: string): Response.BannerList {
  const nowTime = Date.now()
  const position = BANNER_POSITION.Enums.Home

  return (data ?? [])
    .filter((banner) => {
      return (
        banner.enabled !== false &&
        bannerMatchesContext(banner, { position }) &&
        isBannerWithinDisplayDate(banner, nowTime) &&
        Boolean(resolveBannerImageSourceForLang(banner, lang))
      )
    })
    .sort(compareBannerSorts)
}

/**
 * env 就緒後立刻 prefetch 首頁 banner + LCP preload（重用既有 API / 圖片工具）。
 * 目前僅 set_r022。
 */
export function startEarlyHomeBannerPrefetch(siteKey?: string) {
  if (!siteKey || !EARLY_HOME_BANNER_SITE_KEYS.has(siteKey)) return
  if (typeof window === "undefined") return
  if (hasEarlyHomeBannerPrefetch()) return

  const { setStoreBannerList } = useBannerStore()
  const langStore = useLanguageStore()
  const { buildImageUrl, buildImageSrcSet } = useDynamicImage()
  const { width } = useMediaQuery()

  const promise = (async (): Promise<Response.BannerList | null> => {
    const { status, data } = await useApi(getBannerList, {
      position: BANNER_POSITION.Enums.Home,
    })
    if (!status || !Array.isArray(data) || !data.length) return null

    const lang = langStore.lang || langStore.defaultLang || "en"
    const list = buildUsableHomeBannerList(data, lang)
    if (!list.length) return null

    setStoreBannerList(list)

    const first = list[0]
    const source = first ? resolveBannerImageSourceForLang(first, lang) : undefined
    if (source) {
      preloadLcpBannerImage({
        href: buildImageUrl(source.path, source.version, bannerTransformForViewportWidth(width.value)),
        imagesrcset: buildImageSrcSet(source.path, source.version, BANNER_SRCSET_ENTRIES) || undefined,
        imagesizes: BANNER_IMAGE_SIZES.SWIPER_MULTI_WITH_DRAWER,
      })
    }

    return list
  })().catch(() => null)

  setEarlyHomeBannerPrefetch(promise)
}

export function useBanner() {
  const { bannerState, setStoreBannerList } = useBannerStore()
  const { getLanguage } = useLanguage()
  const { buildImageUrl, buildImageSrcSet } = useDynamicImage()
  const { width } = useMediaQuery()
  const router = useRouter()

  const bannerList = computed<Response.BannerList>(() => {
    return bannerState.list
  })

  const resolveBannerImageSource = (banner: Response.Banner) => {
    return resolveBannerImageSourceForLang(banner, getLanguage())
  }

  const getBannerImagePath = (banner: Response.Banner): string | undefined => {
    return resolveBannerImageSource(banner)?.path
  }

  const getBannerImage = (banner: Response.Banner) => {
    const source = resolveBannerImageSource(banner)
    if (!source) {
      return
    }

    return buildImageUrl(source.path, source.version, bannerTransformForViewportWidth(width.value))
  }

  const getBannerImageSrcSet = (banner: Response.Banner) => {
    const source = resolveBannerImageSource(banner)
    if (!source) {
      return ""
    }

    return buildImageSrcSet(source.path, source.version, BANNER_SRCSET_ENTRIES)
  }

  /** prefetch 已 resolve 時同步 hydrate，縮短空窗 */
  function hydrateHomeBannerFromEarlyCache() {
    const earlyList = peekEarlyHomeBannerList()
    if (!earlyList?.length) return false
    setStoreBannerList(earlyList)
    return true
  }

  async function handleBannerList(
    position: BANNER_POSITION.Enums,
    gameType?: GAME_TYPE.Enums,
    productCode?: number
  ): Promise<BannerListLoadResult> {
    if (position === BANNER_POSITION.Enums.Home && gameType === undefined && productCode === undefined) {
      const earlyList = await getEarlyHomeBannerList()
      if (earlyList?.length) {
        setStoreBannerList(earlyList)
        return { status: "success" }
      }
    }

    const requestId = ++latestBannerRequestId
    const params: Request.ReqBannerList = {
      position,
    }

    if (gameType !== undefined) {
      params.game_type = gameType
    }

    if (productCode !== undefined) {
      params.product_code = productCode
    }

    setStoreBannerList([])

    const { status, data } = await useApi(getBannerList, params)

    if (requestId !== latestBannerRequestId) {
      return { status: "stale" }
    }

    if (!status) {
      setStoreBannerList([])
      return { status: "failure" }
    }

    const nowTime = Date.now()
    const usableBannerList = (data ?? [])
      .filter((banner) => {
        return (
          banner.enabled !== false &&
          bannerMatchesContext(banner, { position, gameType, productCode }) &&
          isBannerWithinDisplayDate(banner, nowTime) &&
          Boolean(getBannerImagePath(banner))
        )
      })
      .sort(compareBannerSorts)

    setStoreBannerList(usableBannerList)
    return { status: "success" }
  }

  const handleBannerRedirect = (banner: Response.Banner) => {
    if (!banner.link?.trim()) {
      return
    }

    const bannerLink = banner.link.trim()
    // 判斷是否為完整的 URL
    const isFullUrl = /^https?:\/\//i.test(bannerLink)
    // 判斷是否為相對路徑
    const normalizedLink = bannerLink.startsWith("/") ? bannerLink : `/${bannerLink}`

    switch (banner.opening_method) {
      // 另開新視窗
      case BANNER_OPENING_METHOD.Enums.NewTab:
        if (isFullUrl) {
          window.open(bannerLink, "_blank")
        } else {
          window.open(`${window.location.origin}${normalizedLink}`, "_blank")
        }
        break

      // 當前頁面跳轉
      case BANNER_OPENING_METHOD.Enums.Redirect:
        if (isFullUrl) {
          // 直接跳轉
          window.location.href = bannerLink
        } else {
          // 路由判斷，判斷是 route name 或相對路徑
          try {
            if (bannerLink.startsWith("/") || bannerLink.includes("/")) {
              router.push(bannerLink)
            } else {
              router.push({ name: bannerLink })
            }
          } catch (error) {
            router.push(normalizedLink)
          }
        }
        break
    }
  }

  /**
   * 預加載圖片
   * @param imageUrls 圖片URL數組
   * @param callbacks 回調函數
   */
  const preloadImages = (imageUrls: string[], callbacks?: IPreloadCallbacks) => {
    const totalCount = imageUrls.filter((url) => Boolean(url)).length

    if (totalCount === 0) {
      callbacks?.onComplete?.(true)
      return
    }

    let loadedCount = 0
    let errorCount = 0

    const checkComplete = () => {
      const finished = loadedCount + errorCount
      callbacks?.onProgress?.(loadedCount, totalCount)

      if (finished === totalCount) {
        const allLoaded = errorCount === 0
        callbacks?.onComplete?.(allLoaded)
      }
    }

    imageUrls.forEach((url) => {
      if (url) {
        const img = new Image()
        img.src = url

        img.onload = () => {
          loadedCount++
          callbacks?.onSingleLoad?.(url)
          checkComplete()
        }

        img.onerror = () => {
          errorCount++
          callbacks?.onSingleError?.(url)
          checkComplete()
        }
      }
    })
  }

  return {
    bannerList,
    handleBannerList,
    hydrateHomeBannerFromEarlyCache,
    handleBannerRedirect,
    getBannerImage,
    getBannerImageSrcSet,
    preloadImages,
    preloadLcpBannerImage,
    clearLcpBannerPreload,
  }
}
