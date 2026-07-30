import { storeToRefs } from "pinia"
import { useQuasar } from "quasar"
import { getCmsDetail, getFloatIcon } from "src/api/cms"
import type * as Response from "src/api/response.type"
import {
  flatRowToCmsItems,
  processCmsItemList,
  type ProcessCmsItemListDeps,
} from "src/common/apiHooks/cms/processCmsListFromAll"
import { filterUnsupportedCmsItem } from "src/common/apiHooks/cms/filterUnsupportedCmsEntrance"
import { useCmsAllFlatQuery } from "src/common/apiHooks/cms/useCmsAllFlatQuery"
import {
  useDynamicImage,
  DYNAMIC_IMAGE_DISPLAY_SIZE,
  squareCoverTransform,
} from "src/common/composables/useDynamicImage"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useApi } from "src/common/hooks/useApi"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { usePwaInstall } from "src/common/hooks/usePwaInstall"
import {
  CMS_DISPLAY_DEVICE,
  CMS_DISPLAY_LOGIN,
  CMS_ENTRANCE_TYPE,
  CMS_OPENING_METHOD,
  CMS_TYPE,
  CUSTOMER_SERVICES,
  GAME_TYPE,
  LANGUAGE_TYPE,
} from "src/common/utils/constants"
import { useCmsStore } from "src/stores/cmsStore"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import { useUserInfoStore } from "src/stores/userInfoStore"
import { computed, ref } from "vue"
import type { RouteLocationNormalizedLoaded } from "vue-router"
import { useRoute, useRouter } from "vue-router"

function createEmptyCmsListBuckets(): Record<CMS_TYPE.Enums, Response.CmsList> {
  const buckets = {} as Record<CMS_TYPE.Enums, Response.CmsList>
  for (const v of Object.values(CMS_TYPE.Enums)) {
    if (typeof v === "number") {
      buckets[v as CMS_TYPE.Enums] = []
    }
  }
  return buckets
}

interface IEntranceClick {
  entrance: Response.CmsEntranceItem
  isLoginPup?: boolean
  productLobbyRoute?: {
    name: string
    params: any
  }
  cmsHomeRoute?: {
    name: string
    params: any
  }
  cmsCustomPageRoute?: {
    name: string
    params: any
  }
  openingMethod?: number
}

type CmsRouteNameResolver = (did: string) => string | undefined

export function createDidRouteResolver(routeNameMapping: Record<string, string>): CmsRouteNameResolver {
  return (did: string) => routeNameMapping[did]
}

function normalizeRouteParam(value: unknown): string | undefined {
  if (Array.isArray(value)) return value.length ? String(value[0]) : undefined
  if (value == null) return undefined
  return String(value)
}

/**
 * 統一 CMS 入口 active 規則：
 * 1) CUSTOM_PAGE(link_id) → CmsCustomPage/:cmsCustomPageId
 * 2) HOMEPAGE_SECTION(link_id) → CmsHome/:cmsId
 * 3) product lobby(game_type) → route param `gameType`
 * 4) did map(route name)
 */
export function isCmsEntranceActive(
  entrance: Response.CmsEntranceItem | undefined,
  route: RouteLocationNormalizedLoaded,
  resolveRouteNameByDid: CmsRouteNameResolver
) {
  const payload = entrance?.payload
  if (!payload) return false

  const routeName = String(route.name ?? "")

  if (payload.link_id != null && routeName === "CmsCustomPage") {
    return normalizeRouteParam(route.params.cmsCustomPageId) === String(payload.link_id)
  }

  if (payload.link_id != null && routeName === "CmsHome") {
    return normalizeRouteParam(route.params.cmsId) === String(payload.link_id)
  }

  // did 優先：有對應 route name 時直接以路由名比對；對不到才往下 fallback
  // 避免非遊戲入口（promotion / instagram 之類）payload 殘留 game_type 時誤點亮
  if (payload.did) {
    const expectedName = resolveRouteNameByDid(payload.did)
    if (expectedName != null) {
      return routeName === String(expectedName)
    }
  }

  // 只有遊戲類入口（單一遊戲 / 分類大廳）才用 game_type 判斷
  const entranceType = entrance?.type
  const isGameEntrance =
    entranceType === CMS_ENTRANCE_TYPE.Enums.GAME_LINK || entranceType === CMS_ENTRANCE_TYPE.Enums.CATEGORY_LOBBY
  if (isGameEntrance && payload.game_type) {
    if (normalizeRouteParam(route.params.gameType) !== String(payload.game_type)) {
      return false
    }
    // 入口與 route 都有 product_code / productCode 時，要兩者都對上才算 active；
    // ProductLobby 這類無 productCode 的路由只比 game_type，避免分類層級的入口被誤判 inactive。
    const routeProductCode = normalizeRouteParam(route.params.productCode)
    if (payload.product_code && routeProductCode != null) {
      return routeProductCode === String(payload.product_code)
    }
    return true
  }

  return false
}

export function useCms() {
  const { isLogin } = useAuth()
  const userInfoStore = useUserInfoStore()
  const cmsStore = useCmsStore()
  const { setGameTypeUsing } = useGameTypeStore()
  const { cmsDetail } = storeToRefs(cmsStore)
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL, siteKey } = envData()
  const { buildImageUrl, transformCmsHtmlContent } = useDynamicImage()
  const { openGame, getGameImageByCustomPage, getProductSquareImage } = useGame()
  const router = useRouter()
  const route = useRoute()
  const isLoading = ref(false)
  const { nowLang } = useLanguage()
  const { handleCmsLiveChatClick } = useLiveChat()
  const { promptInstall } = usePwaInstall()
  const $q = useQuasar()
  const cmsAllFlatApiQuery = useCmsAllFlatQuery()
  const selectedWebInformationId = ref<number | null>(null)
  const floatIcon = ref<Response.CmsFlotIcon[]>([])

  /** 當前使用者登入／代理身分（CMS display_login 過濾共用） */
  const cmsDisplayLoginContext = computed(() => ({
    isLoggedIn: isLogin.value,
    isMemberAgent: !!(userInfoStore.userInfo?.is_member_agent ?? userInfoStore.userInfo2?.is_member_agent),
  }))

  const filterCmsListByDisplayLogin = (list: Response.CmsList) => {
    const { isLoggedIn, isMemberAgent } = cmsDisplayLoginContext.value
    return list.filter((cmsItem) => {
      const displayLogin = cmsItem.Setting?.payload?.display_login
      if (displayLogin === undefined || displayLogin === CMS_DISPLAY_LOGIN.Enums.NO_RESTRICTIONS) {
        return true
      }
      if (!isLoggedIn) {
        return displayLogin === CMS_DISPLAY_LOGIN.Enums.BEFORE_LOGIN
      }
      switch (displayLogin) {
        case CMS_DISPLAY_LOGIN.Enums.BEFORE_LOGIN:
          return false
        case CMS_DISPLAY_LOGIN.Enums.AFTER_LOGIN:
          return true
        case CMS_DISPLAY_LOGIN.Enums.AFTER_LOGIN_MEMBER:
          return !isMemberAgent
        case CMS_DISPLAY_LOGIN.Enums.AFTER_LOGIN_AGENT:
          return isMemberAgent
        default:
          return true
      }
    })
  }

  function cmsProcessDeps(): Omit<ProcessCmsItemListDeps, "type"> {
    return {
      VITE_APP_DYNAMIC_RESOURCE_URL,
      siteKey,
      $q,
      buildImageUrl,
      getGameImageByCustomPage,
      getProductSquareImage,
    }
  }

  /** vue-query 已扁平化的列（`select` 產物），無業務轉換 */
  const cmsAllFlatRows = computed(() => cmsAllFlatApiQuery.data.value ?? [])

  /**
   * 與舊版 Pinia `cmsListState` 相同 shape：由 `/cms/all`（vue-query）聚合後再跑 `processCmsItemList`。
   * 單一資料來源，版型可直接綁 `cmsListState[CMS_TYPE.xxx]` 或使用下方 computeds。
   */
  const cmsListState = computed<Record<CMS_TYPE.Enums, Response.CmsList>>(() => {
    const rows = cmsAllFlatRows.value
    const depsBase = cmsProcessDeps()
    const next = createEmptyCmsListBuckets()
    const grouped = new Map<CMS_TYPE.Enums, Response.CmsAllFlatRow[]>()
    for (const row of rows) {
      const bucket = grouped.get(row.cmsType)
      if (bucket) {
        bucket.push(row)
      } else {
        grouped.set(row.cmsType, [row])
      }
    }
    for (const [type, typeRows] of grouped) {
      const items = typeRows.flatMap((row) => flatRowToCmsItems(row))
      next[type] = processCmsItemList(items, { type, ...depsBase })
    }
    return next
  })

  /** 依 type 讀取 {@link cmsListState}（與各 `useXxxListCms` hook 一致） */
  function cmsProcessedListByType(type: CMS_TYPE.Enums) {
    return computed(() => cmsListState.value[type] ?? [])
  }

  /** 常用 CMS type 對應列表（給外部直接取用，避免每次傳 enum） */
  const cmsHomeList = cmsProcessedListByType(CMS_TYPE.Enums.HOME)
  const cmsNavigationBarList = cmsProcessedListByType(CMS_TYPE.Enums.NAVIGATION_BAR)
  const cmsMenuList = cmsProcessedListByType(CMS_TYPE.Enums.MENU)
  const cmsH5BottomMenuList = cmsProcessedListByType(CMS_TYPE.Enums.H5_BOTTOM_MENU)
  const cmsWebInformationList = cmsProcessedListByType(CMS_TYPE.Enums.WEBSITE_INFORMATION)
  const cmsFooterSettingsList = cmsProcessedListByType(CMS_TYPE.Enums.FOOTER_SETTINGS)
  const cmsFloatingIconList = cmsProcessedListByType(CMS_TYPE.Enums.FLOATING_ICON)
  const cmsContactUsList = cmsProcessedListByType(CMS_TYPE.Enums.CONTACT_US)
  const cmsPopupList = cmsProcessedListByType(CMS_TYPE.Enums.POPUP)
  const cmsHomeInformationImageList = cmsProcessedListByType(CMS_TYPE.Enums.HOME_INFORMATION_IMAGE)

  async function handleCmsDetail(id: number) {
    isLoading.value = true
    const { status, data } = await useApi(getCmsDetail, id)
    isLoading.value = false

    if (status) {
      const filteredData = filterUnsupportedCmsItem(data)
      if (!filteredData) {
        cmsStore.setCmsDetail(undefined)
        return
      }

      if (filteredData.Setting?.icon_path) {
        filteredData.Setting.icon_path = buildImageUrl(
          filteredData.Setting.icon_path,
          filteredData.Setting.updated_time,
          squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.CMS_ICON)
        )
      }

      if (filteredData.Entrance && Array.isArray(filteredData.Entrance)) {
        filteredData.Entrance.forEach((entrance) => {
          if (entrance.img_path) {
            entrance.img_path = buildImageUrl(
              entrance.img_path,
              entrance.updated_time,
              squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.CMS_ENTRANCE)
            )
          } else {
            const gamePayload = entrance.payload
            if (entrance.type === CMS_ENTRANCE_TYPE.Enums.GAME_LINK) {
              if (gamePayload?.product_code && gamePayload?.game_type) {
                if (gamePayload?.game_code && gamePayload?.product_integration_id) {
                  entrance.img_path = getGameImageByCustomPage({
                    game_type: gamePayload.game_type,
                    product_integration_id: gamePayload.product_integration_id,
                    product_code: gamePayload.product_code,
                    game_code: gamePayload.game_code,
                  })
                } else if (gamePayload?.game_code) {
                  entrance.img_path = getGameImageByCustomPage({
                    game_type: gamePayload.game_type,
                    product_integration_id: 1,
                    product_code: gamePayload.product_code,
                    game_code: gamePayload.game_code,
                  })
                } else {
                  entrance.img_path = getProductSquareImage({
                    updated_at: 0,
                    game_type: gamePayload.game_type,
                    product_code: gamePayload.product_code,
                    siteKey,
                  })
                }
              }
            }
          }
        })
      }

      cmsStore.setCmsDetail(filteredData)
    }
  }

  async function handleCmsFloatIcon() {
    isLoading.value = true
    const { status, data } = await useApi(getFloatIcon, "main")
    isLoading.value = false

    if (status) {
      floatIcon.value = data.list.map((item: Response.CmsFlotIcon) => ({
        language: item.language,
        storage_key: item.storage_key
          ? buildImageUrl(item.storage_key, undefined, squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.CMS_FLOAT_ICON))
          : "",
      }))
    }
  }

  const navigationBarList = computed(() => filterCmsListByDisplayLogin(cmsNavigationBarList.value))

  const webInformationList = computed(() => {
    return cmsWebInformationList.value
  })

  const menuList = computed(() => filterCmsListByDisplayLogin(cmsMenuList.value))

  const cmsFooterLogos = computed(() => {
    if (!cmsFooterSettingsList.value.length) {
      return []
    }
    return cmsFooterSettingsList.value[0].Setting.logo_sort.map((e) =>
      buildImageUrl(
        e,
        cmsFooterSettingsList.value[0].Setting.updated_time,
        squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.FOOTER_LOGO)
      )
    )
  })

  const cmsFooterTextContent = computed(() => {
    if (!cmsFooterSettingsList.value.length) {
      return null
    }

    const pageList = cmsFooterSettingsList.value[0].Page.filter((e) => e.lang === nowLang.value)

    if (pageList.length) {
      pageList[0].content = transformCmsHtmlContent(pageList[0].content)
      return pageList[0]
    }

    return null
  })

  //#region 彈窗管理
  const cmsPopupTitle = computed(() => {
    if (!cmsPopupList.value?.length) {
      return ""
    }

    const title = cmsPopupList.value[0].Setting.lang[nowLang.value as LANGUAGE_TYPE.Enums]

    if (title) {
      return transformCmsHtmlContent(title)
    }
    return ""
  })

  const cmsComfirmButtonLabel = computed(() => {
    if (!cmsPopupList.value?.length) {
      return ""
    }

    return cmsPopupList.value[0].Setting.comfirm_button_lang[nowLang.value as LANGUAGE_TYPE.Enums] || ""
  })

  const cmsRejectButtonLabel = computed(() => {
    if (!cmsPopupList.value?.length) {
      return ""
    }

    return cmsPopupList.value[0].Setting.reject_button_lang[nowLang.value as LANGUAGE_TYPE.Enums] || ""
  })

  const cmsPopupImgs = computed(() => {
    if (!cmsPopupList.value?.length) {
      return []
    }
    return cmsPopupList.value[0].Setting.pop_up_img.map((e) =>
      buildImageUrl(
        e,
        cmsPopupList.value[0].Setting.updated_time,
        squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.POPUP)
      )
    )
  })

  const cmsPopupAgreeList = computed(() => {
    if (!cmsPopupList.value?.length) {
      return []
    }

    return cmsPopupList.value[0].Entrance.filter((e) => e.sort !== 0).map((e, i) => {
      let label = e.lang[nowLang.value as LANGUAGE_TYPE.Enums] || ""
      label = transformCmsHtmlContent(label)
      return {
        label: label,
        value: i,
      }
    })
  })

  const cmsPopupCheckAgree = ref<number[]>([])

  const cmsPopupAgreeAllText = computed(() => {
    if (!cmsPopupList.value?.length) {
      return ""
    }

    const agreeAllList = cmsPopupList.value[0].Entrance.filter((e) => e.sort === 0)

    if (agreeAllList.length) {
      const agreeAllText = agreeAllList[0].lang[nowLang.value as LANGUAGE_TYPE.Enums] || ""
      return transformCmsHtmlContent(agreeAllText)
    }

    return ""
  })

  const cmsPopupCheckAllAgree = computed({
    get() {
      return cmsPopupAgreeList.value.every((item) => cmsPopupCheckAgree.value.includes(item.value))
    },
    set(value: boolean) {
      if (value) {
        cmsPopupCheckAgree.value = cmsPopupAgreeList.value.map((item) => item.value)
      } else {
        cmsPopupCheckAgree.value = []
      }
    },
  })
  //#endregion

  const h5BottomMenuList = computed(() => filterCmsListByDisplayLogin(cmsH5BottomMenuList.value))

  const floatingIconList = computed(() => filterCmsListByDisplayLogin(cmsFloatingIconList.value))

  const webInformationMenuList = computed(() => {
    const websiteInformation = cmsWebInformationList.value || []
    return websiteInformation.map((item) => ({
      id: item.url_id,
      // todo 為相容 set33 及 set49 以外版型，暫時命名為 id2，後續要重新調整命名
      id2: item.id,
      title: item.Page.find((page) => page.lang === nowLang.value)?.title || "",
      // 因應6M88 UFA 系列是將聯絡我們, 負責任遊戲等放在同一頁所以新增content 以利在同一頁跑回圈渲染資料
      content: item.Page.find((page) => page.lang === nowLang.value)?.content || "",
    }))
  })

  const setSelectedWebInformationId = (id: number) => {
    selectedWebInformationId.value = id
  }

  const webInformationData = computed(() => {
    const websiteInformation = cmsWebInformationList.value || []
    if (!websiteInformation.length) return null

    // 先嘗試用 route 判斷
    const routeId = Number(route.params.id)
    let matchedItem = null

    // 先找 url_id
    if (routeId) {
      matchedItem = websiteInformation.find((item) => item.url_id === routeId)
      // 如果 url_id 找不到，再往下找 id
      if (!matchedItem) {
        matchedItem = websiteInformation.find((item) => item.id === routeId)
      }
    }

    // 如果版型以 modal 設計為主，則可以從外部 component 傳入參數
    if (!matchedItem && selectedWebInformationId.value !== null) {
      matchedItem = websiteInformation.find((item) => item.id === selectedWebInformationId.value)
    }

    return matchedItem || websiteInformation[0]
  })

  const webInformationTitle = computed(() => {
    return webInformationData.value?.Page.find((pages: { lang: string }) => pages.lang === nowLang.value)?.title || ""
  })

  const webInformationContent = computed(() => {
    const content = webInformationData.value?.Page.find(
      (pages: { lang: string }) => pages.lang === nowLang.value
    )?.content

    if (content) {
      return transformCmsHtmlContent(content)
    }

    return ""
  })

  async function handleEntrance(item: IEntranceClick) {
    const { payload } = item.entrance
    switch (item.entrance.type) {
      case CMS_ENTRANCE_TYPE.Enums.GAME_LINK:
        const { integration_id, product_code, game_code, game_type } = payload
        // 目前因為cms api 是給game_type 不是game_type_id 所以需要先設定game_type
        setGameTypeUsing(game_type as GAME_TYPE.Enums)
        openGame(integration_id, product_code || 0, game_code, game_type as GAME_TYPE.Enums, item.isLoginPup)
        break
      case CMS_ENTRANCE_TYPE.Enums.CATEGORY_LOBBY:
        if (item.productLobbyRoute) {
          const routeData = router.resolve(item.productLobbyRoute)
          item.openingMethod === 0 ? window.open(routeData.href, "_blank") : router.push(item.productLobbyRoute)
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.CUSTOM_LINK:
        if (payload.link) {
          let link = payload.link
          // 如果沒有包含協議，預設加上 https://
          if (!/^https?:\/\//i.test(link)) {
            link = `https://${link}`
          }
          if (payload.opening_method === CMS_OPENING_METHOD.Enums.NEW_TAB) {
            window.open(link, "_blank")
            return
          }
          window.location.href = link
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.HOMEPAGE_SECTION:
        /**
         * 1. 各版型要新增cmsHome頁面(取代原本的popular)
         * 2. 將原本的資料改成for cmsList
         */
        if (item.cmsHomeRoute) {
          const routeData = router.resolve(item.cmsHomeRoute)
          item.openingMethod === 0 ? window.open(routeData.href, "_blank") : router.push(item.cmsHomeRoute)
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.CUSTOMER_SERVICE_LINK:
        if (payload.link_id) {
          handleCmsLiveChatClick(payload.link_id as CUSTOMER_SERVICES.Enums)
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.CUSTOM_PAGE:
        if (item.cmsCustomPageRoute) {
          const routeData = router.resolve(item.cmsCustomPageRoute)
          item.openingMethod === 0 ? window.open(routeData.href, "_blank") : router.push(item.cmsCustomPageRoute)
        }
        break
      case CMS_ENTRANCE_TYPE.Enums.PWA_INSTALL:
        await promptInstall()
        break

      default:
        break
    }
  }

  const getBreakpoints = computed(() => (cmsItem: Response.CmsItem) => {
    // 目前後台前後端都沒擋 decimal 圖被切到 先4捨5
    const mobileItemsRaw = Number(cmsItem.Setting?.payload?.row_show_mob)
    const pcItemsRaw = Number(cmsItem.Setting?.payload?.row_show_pc)

    const mobileItems = Number.isFinite(mobileItemsRaw) ? Math.round(mobileItemsRaw) : mobileItemsRaw
    const pcItems = Number.isFinite(pcItemsRaw) ? Math.round(pcItemsRaw) : pcItemsRaw

    return {
      300: {
        itemsToShow: mobileItems,
        snapAlign: "start",
      },
      700: {
        itemsToShow: mobileItems,
        snapAlign: "start",
      },
      1024: {
        itemsToShow: pcItems,
        snapAlign: "start",
      },
    }
  })

  const shouldWrapAround = computed(() => (cmsItem: Response.CmsItem) => {
    const totalItems = cmsItem.Entrance.length
    const mobileItems = Number(cmsItem.Setting?.payload?.row_show_mob)
    const pcItems = Number(cmsItem.Setting?.payload?.row_show_pc)

    return totalItems > Math.max(mobileItems, pcItems)
  })

  const shouldDisplayDevice = computed(() => (cmsItem: Response.CmsItem) => {
    const deviceSetting = cmsItem.Setting?.payload?.display_device as CMS_DISPLAY_DEVICE.Enums | undefined
    const isMobile = $q.platform.is.mobile

    if (deviceSetting === undefined) {
      return true
    }

    return deviceSetting === CMS_DISPLAY_DEVICE.Enums.NO_RESTRICTIONS
      ? true
      : deviceSetting === CMS_DISPLAY_DEVICE.Enums.DESKTOP
      ? !isMobile
      : deviceSetting === CMS_DISPLAY_DEVICE.Enums.MOBILE
      ? isMobile
      : false
  })

  const getGridStyle = computed(() => (cmsItem: Response.CmsItem) => {
    const columns = $q.platform.is.mobile
      ? Number(cmsItem.Setting?.payload?.row_show_mob)
      : Number(cmsItem.Setting?.payload?.row_show_pc)

    return {
      "--grid-columns": columns.toString(),
    }
  })

  const fliterDisplayDeviceAndLogin = computed(() => {
    const isMobile = $q.platform.is.mobile
    return menuList.value.filter((item) => {
      const displayDevice = item.Setting?.payload?.display_device
      if (isMobile) {
        return displayDevice !== CMS_DISPLAY_DEVICE.Enums.DESKTOP
      }
      return displayDevice !== CMS_DISPLAY_DEVICE.Enums.MOBILE
    })
  })

  // 2025/06/17 PM 極端客製化需求，ME9 版型，我的功能在 PC 版必須限制為全部 & 手機版資料
  const filterMobileDisplayAndLogin = computed(() => {
    return menuList.value.filter((item) => {
      const displayDevice = item.Setting?.payload?.display_device
      return (
        displayDevice === CMS_DISPLAY_DEVICE.Enums.NO_RESTRICTIONS || displayDevice === CMS_DISPLAY_DEVICE.Enums.MOBILE
      )
    })
  })

  const isCarousel = computed(() => (cmsItem: Response.CmsItem) => {
    return cmsItem.Setting?.payload?.arrangement === 0
  })

  return {
    /** call api 中 */
    isLoading,

    /** cms列表 */
    cmsListState,

    /** 登入／代理身分（display_login 過濾共用） */
    cmsDisplayLoginContext,

    /** 常用 type 對應列表（未過濾 display_login，外部少用） */
    cmsHomeList,
    cmsNavigationBarList,
    cmsMenuList,
    cmsH5BottomMenuList,
    cmsWebInformationList,
    cmsFooterSettingsList,
    cmsFloatingIconList,
    cmsContactUsList,
    cmsPopupList,
    cmsHomeInformationImageList,

    /** cms詳細資料 */
    cmsDetail,

    /** 取得cms詳細資料 */
    handleCmsDetail,

    /** 懸浮 icon 額外 API（非 `/cms/all`）；版型 FloatIcon 區塊可自行 onMounted 呼叫 */
    handleCmsFloatIcon,

    /** cms navigation 清單（已過濾 display_login） */
    navigationBarList,

    /** cms menu 清單（已過濾 display_login） */
    menuList,

    /** cms web information 清單 */
    webInformationList,

    /** cms Footer LOGO清單 */
    cmsFooterLogos,

    /** cms Footer 文字區塊內容 */
    cmsFooterTextContent,

    /** cms h5 bottom Menu清單（已過濾 display_login） */
    h5BottomMenuList,

    /** 懸浮 icon（已過濾 display_login） */
    floatingIconList,

    /** 網站說明頁menu */
    webInformationMenuList,

    /** 設定網站說明頁id */
    setSelectedWebInformationId,

    /** 網站說明資料 */
    webInformationData,

    /** 網站說明標題 */
    webInformationTitle,

    /** 網站說明內容 */
    webInformationContent,

    /** 處理cms 入口點擊 */
    handleEntrance,

    /** 處理cms 入口列表顯示幾組的參數 */
    getBreakpoints,

    /** 如果使用者故意在後台設定顯示數量大於他的上傳數量，則關閉輪播 */
    shouldWrapAround,

    /** 取得cms 應該顯示的裝置 */
    shouldDisplayDevice,

    /** 取得cms 應該顯示的欄位數量 */
    getGridStyle,

    /** menu過濾登入前/後+裝置*/
    fliterDisplayDeviceAndLogin,

    /** 2025/06/17 PM 極端客製化需求，ME9 版型用手機版資料 */
    filterMobileDisplayAndLogin,

    /** 檢查是否為一列輪播 */
    isCarousel,

    /** 彈窗管理標題 */
    cmsPopupTitle,

    /** 彈窗管理確認按鈕標籤 */
    cmsComfirmButtonLabel,

    /** 彈窗管理拒絕按鈕標籤 */
    cmsRejectButtonLabel,

    /** 彈窗管理圖片*/
    cmsPopupImgs,

    /** 彈窗管理同意列表 */
    cmsPopupAgreeList,

    /** 彈窗管理已同意項目 */
    cmsPopupCheckAgree,

    /** 彈窗管理全部同意文字 */
    cmsPopupAgreeAllText,

    /** 彈窗管理全部同意 */
    cmsPopupCheckAllAgree,

    /**懸浮icon */
    floatIcon,
  }
}
