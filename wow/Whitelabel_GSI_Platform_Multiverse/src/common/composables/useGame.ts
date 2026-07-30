import { openURL, useQuasar } from "quasar"
import {
  deleteFavoriteGame,
  favoriteGame,
  getAllGameList,
  getAllProductList,
  getFavoriteGameList,
  getGameList,
  getGameTypeList,
  getProductList,
  launchGame,
} from "src/api/game"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useLanguage } from "src/common/composables/useLanguage"
import { buildGameLobbyRouteParams } from "src/common/composables/useProviderGameLobbyRoute"
import { useDynamicImage, DYNAMIC_IMAGE_DISPLAY_SIZE, squareCoverTransform } from "src/common/composables/useDynamicImage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useApi } from "src/common/hooks/useApi"
import { useAuth } from "src/common/hooks/useAuth"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useEnv } from "src/common/hooks/useEnv"
import { useFBSportsColor } from "src/common/hooks/useFBSportsColor"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useEventBus } from "src/common/hooks/useEventBus"
import {
  ERROR_CODE_TYPE,
  ALERT_DIALOG_TYPE,
  GAME_TYPE,
  INTEGRATION_ID,
  LANGUAGE_CODE,
  OPEN_GAME_MODE,
  OPEN_LOBBY_MODE,
  PLATFORM_TYPE,
  GAME_TAG_TYPE,
  WALLET_TYPE,
} from "src/common/utils/constants"
import { FB_SPORTS_PRODUCT_CODE } from "src/common/utils/fbSportsLaunch"
import { injectStrict } from "src/common/utils/injectTyped"
import { useGameDialogStore } from "src/stores/gameDialogStore"
import { useGameStore } from "src/stores/gameStore"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import { useProductStore } from "src/stores/productStore"
import { EventBusKey } from "src/symbols"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter, useRoute } from "vue-router"
import { useCommon } from "src/common/hooks/useCommon"

export type IGetGameTypeImage = Response.GameTypeItem & {
  siteKey?: string
  imgType?: string
  siteFunc?: () => string
}

export interface IGetProductSquareImage {
  square_image?: string
  updated_at: number
  game_type: GAME_TYPE.Enums | string
  product_code: number
  siteKey?: string
  imgType?: string
}

export interface IGetProductWideImage {
  wide_image: string
  updated_at: number
  game_type: GAME_TYPE.Enums | string
  product_code: number
  siteKey?: string
}
export interface IGetProductTabImage {
  tab_image?: string
  updated_at?: number
  product_code: number
  siteKey?: string
}

enum ProductTabTheme {
  Light = "light",
  Dark = "dark",
  Special = "special",
}

const PRODUCT_TAB_THEME_MAP: Record<string, ProductTabTheme> = {
  bmm_set_obtd: ProductTabTheme.Light,
  okbet: ProductTabTheme.Light,
  okbet_blackGold: ProductTabTheme.Dark,
  okbet_green: ProductTabTheme.Light,
  okbet_red: ProductTabTheme.Dark,
  okbet_redBlack: ProductTabTheme.Dark,
  set_DBO88: ProductTabTheme.Dark,
  set_amuse: ProductTabTheme.Dark,
  set_ed3: ProductTabTheme.Dark,
  set_ed8888: ProductTabTheme.Dark,
  set_r017: ProductTabTheme.Dark,
  set_r022: ProductTabTheme.Special,
  set_r023: ProductTabTheme.Special,
  set_r024: ProductTabTheme.Dark,
  set_r025: ProductTabTheme.Dark,
  set_r027: ProductTabTheme.Dark,
  set_r029: ProductTabTheme.Dark,
  set_r030: ProductTabTheme.Dark,
  set_r031: ProductTabTheme.Dark,
}

const STATIC_GAME_IMAGE_TYPE_BY_ALIAS: Record<string, string> = {
  "1": "SLOT",
  slot: "SLOT",
  slots: "SLOT",
  SLOT: "SLOT",
  "2": "LIVE_CASINO",
  casino: "LIVE_CASINO",
  livecasino: "LIVE_CASINO",
  live_casino: "LIVE_CASINO",
  LIVECASINO: "LIVE_CASINO",
  LIVE_CASINO: "LIVE_CASINO",
  "3": "SPORTBOOK",
  sportbook: "SPORTBOOK",
  sport_book: "SPORTBOOK",
  sports: "SPORTBOOK",
  SPORTBOOK: "SPORTBOOK",
  SPORT_BOOK: "SPORTBOOK",
  "4": "VIRTUALSPORT",
  virtualsport: "VIRTUALSPORT",
  virtual_sport: "VIRTUALSPORT",
  vsport: "VIRTUALSPORT",
  VIRTUALSPORT: "VIRTUALSPORT",
  VIRTUAL_SPORT: "VIRTUALSPORT",
  "5": "LOTTERY",
  lottery: "LOTTERY",
  LOTTERY: "LOTTERY",
  "6": "CARDBOARD",
  cardboard: "CARDBOARD",
  CARDBOARD: "CARDBOARD",
  "7": "P2P",
  p2p: "P2P",
  P2P: "P2P",
  "8": "FISHING",
  fishing: "FISHING",
  FISHING: "FISHING",
  "9": "OTHER",
  other: "OTHER",
  OTHER: "OTHER",
  "10": "COCKFIGHTING",
  cockfighting: "COCKFIGHTING",
  cock_fighting: "COCKFIGHTING",
  COCKFIGHTING: "COCKFIGHTING",
  COCK_FIGHTING: "COCKFIGHTING",
  "11": "ESPORT",
  esport: "ESPORT",
  ESPORT: "ESPORT",
  "12": "POKER",
  poker: "POKER",
  POKER: "POKER",
  "13": "CASINO_PREMIUM",
  casino_premium: "CASINO_PREMIUM",
  CASINO_PREMIUM: "CASINO_PREMIUM",
}

export interface IGetGameImage {
  custom_image: string
  game_type_id: number
  integration_id: number
  product_code: number
  game_code: string
}

export interface IGetGameImageByCustomPage {
  game_type: GAME_TYPE.Enums | string
  product_integration_id: number
  product_code: number
  game_code: string
}

export function useGame() {
  const $q = useQuasar()
  const router = useRouter()
  const route = useRoute()
  const { t } = useI18n()
  const { isLogin, auth } = useAuth()
  const { isFA11, isFA21, isZPL1, isARG1 } = useAgentCode()
  const { applyDefaultColor, applyDefaultColorToContent } = useFBSportsColor()
  const { activeWalletCurrencyCode, activeWalletType } = useUserInfo()
  const gameDialogStore = useGameDialogStore()
  const { storedGameTypeState, setGameTypeList, setGameTypeMap, setGameTypeUsing } = useGameTypeStore()
  const { productState } = useProductStore()
  const { gameState, initAllGameList, updateAllGameList, updateFavoriteList } = useGameStore()
  const { envData } = useEnv()
  const { buildImageUrl } = useDynamicImage()
  const { VITE_APP_STATIC_RESOURCE_URL, open_lobby_mode } = envData()
  const eventbus = injectStrict(EventBusKey)
  const isLoading = ref(false)
  const { nowLang } = useLanguage()
  const { isMobile, isDesktop } = useMediaQuery()
  const { eventEmit } = useEventBus()
  const { genEnumToArray } = useCommon()

  //#region func: gameType
  const gameTypeState = storedGameTypeState

  async function initGameTypeList() {
    isLoading.value = true
    const { status, data } = await useApi(getGameTypeList)
    isLoading.value = false
    if (!status || !data || data.length === 0) {
      setGameTypeList([])
      setGameTypeMap({})
      return
    }

    const tempList: Response.GameTypeList = []
    const tempMap: Response.GameTypeMap = {}

    data.forEach((item: Response.GameTypeItem) => {
      const obj = {
        id: item.id,
        label: GAME_TYPE.I18nKeys[item.id as GAME_TYPE.Enums],
        frontendKey: GAME_TYPE.FrontendKey[item.id as GAME_TYPE.Enums],
        game_type: item.game_type,
        use_pc_image: item.use_pc_image,
        use_h5_image: item.use_h5_image,
        pc_image: item.pc_image,
        h5_image: item.h5_image,
        updated_at: item.updated_at,
      }
      tempList.push(obj)
      tempMap[item.id] = obj
    })
    setGameTypeList(tempList)
    setGameTypeMap(tempMap)
  }

  //#endregion

  //#region func: product

  async function getProducts(GameTypeId: GAME_TYPE.Enums, isHandleLoadingControl = true) {
    setGameTypeUsing(GameTypeId)
    // const { game_type } = gameTypeState.map[GameTypeId]
    const payload: Request.ProductList = {
      game_type_id: GameTypeId,
    }

    try {
      if (isHandleLoadingControl) {
        $q.loading.show()
        isLoading.value = true
      }

      const { status, data } = await useApi(getProductList, payload)

      if (isHandleLoadingControl) {
        $q.loading.hide()
        isLoading.value = false
      }

      if (!status || !data || !data.length) {
        productState.list.length = 0
        gameState.list.length = 0
        gameState.gamesMap[GAME_TAG_TYPE.Enums.All].length = 0
        gameState.gamesMap[GAME_TAG_TYPE.Enums.New].length = 0
        gameState.gamesMap[GAME_TAG_TYPE.Enums.Hot].length = 0
        gameState.gamesMap[GAME_TAG_TYPE.Enums.Favorites].length = 0
        return
      }

      productState.list = [...data]
    } catch (error) {
      productState.list.length = 0
      if (isHandleLoadingControl) {
        $q.loading.hide()
        isLoading.value = false
      }
    }
  }

  async function getAllProducts() {
    try {
      $q.loading.show()
      isLoading.value = true
      const { status, data } = await useApi(getAllProductList)
      isLoading.value = false
      $q.loading.hide()

      if (!status || !data || !data.length) {
        productState.allList.length = 0
        return
      }

      productState.allList = [...data]
    } catch (error) {
      productState.allList.length = 0
      $q.loading.hide()
      isLoading.value = false
    }
  }

  function handleProductClick(integration_id: INTEGRATION_ID.Enums, product_code: number, pup = false, lang?: number) {
    productState.using = product_code
    const gameTypeCategory = GAME_TYPE.Category[gameTypeState.using]

    if (gameTypeCategory === GAME_TYPE.CategoryEnums.LobbyOpen) {
      openGame(integration_id, product_code, "", gameTypeState.using, pup, null, lang)
    } else {
      if (open_lobby_mode === OPEN_LOBBY_MODE.Enums.NEW_TAB) {
        const routeUrl = router.resolve({
          name: "GameLobby",
          params: buildGameLobbyRouteParams(gameTypeState.using, product_code, integration_id)
        })
        window.open(routeUrl.href, "_blank")
        return
      }
      router.push({
        name: "GameLobby",
        params: buildGameLobbyRouteParams(gameTypeState.using, product_code, integration_id)
      })
    }
  }

  function getGameTypeImage(item: IGetGameTypeImage): string {
    if (isMobile.value && item.use_h5_image && item.h5_image) {
      return buildImageUrl(item.h5_image, item.updated_at)
    }

    if (isDesktop.value && item.use_pc_image && item.pc_image) {
      return buildImageUrl(item.pc_image, item.updated_at)
    }

    if (item.siteFunc) {
      return item.siteFunc()
    }

    if (item.siteKey) {
      return `${VITE_APP_STATIC_RESOURCE_URL}/images/gameType/${item.siteKey}/${item.frontendKey}.${
        item.imgType ? item.imgType : "png"
      }`
    }

    return ""
  }

  function resolveGameTypeKey(rawGameType: GAME_TYPE.Enums | string | undefined): string | undefined {
    if (typeof rawGameType === "string" && rawGameType) return rawGameType
    const id = rawGameType as GAME_TYPE.Enums
    return gameTypeState.map[id]?.game_type || GAME_TYPE.FrontendKey[id]
  }

  function resolveStaticGameImageType(rawGameType: GAME_TYPE.Enums | string | undefined): string | undefined {
    const gameType = resolveGameTypeKey(rawGameType)
    if (!gameType) return gameType
    return STATIC_GAME_IMAGE_TYPE_BY_ALIAS[String(gameType)] || gameType
  }

  function getProductSquareImage(item: IGetProductSquareImage): string {
    if (item.square_image) {
      return buildImageUrl(item.square_image, item.updated_at, squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.GAME_SQUARE))
    }
    const gameType = resolveGameTypeKey(item.game_type)

    if (item.siteKey) {
      return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/${item.siteKey}/${gameType}/${item.product_code}.${
        item.imgType ? item.imgType : "png"
      }`
    }

    return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/${gameType}/${item.product_code}.png`
  }

  function getProductWideImage(item: IGetProductWideImage): string {
    if (item.wide_image) {
      return buildImageUrl(item.wide_image, item.updated_at)
    }
    const gameType = resolveGameTypeKey(item.game_type)

    if (item.siteKey) {
      return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/${item.siteKey}/${gameType}/${item.product_code}.png`
    }

    return `${VITE_APP_STATIC_RESOURCE_URL}/images/products/${gameType}/${item.product_code}.png`
  }

  function getProductTabImage(item: IGetProductTabImage): string {
    if (item.tab_image) {
      return buildImageUrl(item.tab_image, item.updated_at, squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.GAME_TAB))
    }

    const theme = item.siteKey ? PRODUCT_TAB_THEME_MAP[item.siteKey] ?? ProductTabTheme.Dark : ProductTabTheme.Dark
    return `${VITE_APP_STATIC_RESOURCE_URL}/images/tabs/webp/${theme}/${item.product_code}.webp`
  }

  //#endregion

  //#region func: game

  type tagItem = {
    icon: string
    iconName: string
    label: string
    value: GAME_TAG_TYPE.Enums
  }

  const gameTagList = computed(() => {
    const result: tagItem[] = []
    genEnumToArray(GAME_TAG_TYPE.Enums).forEach((e) => {
      const val = e as GAME_TAG_TYPE.Enums
      const tag: tagItem = {
        label: t(GAME_TAG_TYPE.I18nKeys[val]),
        value: val,
        icon: GAME_TAG_TYPE.BtnIcons[val],
        iconName: GAME_TAG_TYPE.BtnIcoSName[val],
      }
      result.push(tag)
    })

    return result
  })

  async function getGames(
    integration_id: INTEGRATION_ID.Enums,
    GameTypeId: GAME_TYPE.Enums,
    product_code: number,
    isHandleLoadingControl = true
  ) {
    setGameTypeUsing(GameTypeId)
    productState.using = product_code
    // const { game_type } = gameTypeState.map[GameTypeId]
    const payload: Request.GameList = {
      game_type_id: GameTypeId,
      product_code,
      integration_id,
    }
    try {
      if (isHandleLoadingControl) {
        $q.loading.show()
        isLoading.value = true
      }

      const { status, data } = await useApi(getGameList, payload)
      isLoading.value = false

      if (isHandleLoadingControl) {
        $q.loading.hide()
        isLoading.value = false
      }

      if (!status || !data || !data.length) {
        gameState.list.length = 0
        return
      }

      gameState.list = [...data]
    } catch (error) {
      gameState.list.length = 0
      if (isHandleLoadingControl) {
        $q.loading.hide()
        isLoading.value = false
      }
    }
  }

  async function getAllGames() {
    try {
      $q.loading.show()
      isLoading.value = true
      const { status, data } = await useApi(getAllGameList)
      isLoading.value = false
      $q.loading.hide()

      if (!status || !data) {
        initAllGameList()
        return
      }
      updateAllGameList(data)
    } catch (error) {
      initAllGameList()
      $q.loading.hide()
      isLoading.value = false
    }
  }

  interface ICustomGameOpen {
    product_code?: number
    openMethod?: OPEN_GAME_MODE.Enums
    game_code?: string
    game_type?: string
  }

  const customGameOpenList: (ICustomGameOpen & { openMethod: OPEN_GAME_MODE.Enums; routeName: string | undefined })[] =
    [
      {
        product_code: 1049, // EVOPLAY
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1164, // Digitain
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_NEW_TAB,
        routeName: "DigitainPage", // 手機版時使用此 route
      },
      {
        product_code: 1166, // NoLimitCity
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1167, // big time gaming （ASIA）
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1168, // Netent（ASIA）
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1169, // Red Tiger（ASIA）
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1174, // Netent (LATAM)
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1175, // Red Tiger (LATAM)
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1176, // no limit city (LATAM)
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1177, // big time gaming(LATAM)
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1199, // Red TigerPHP（FP專用）
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1200, // Netent PHP（FP專用）
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1201, // big time gamingPHP（FP專用）
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1202, // no limit city PHP（FP專用）
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1216, // Red TigerPHP2（anibet專用）
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1217, // Netent PHP2（anibet專用）
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1218, // big time gamingPHP2（anibet專用）
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1219, // no limit city PHP2（anibet專用）
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      {
        product_code: 1166, // NoLimitCity
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_NEW_TAB,
        routeName: undefined,
      },
      {
        product_code: 1228, // CMD sport
        openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_HREF,
        routeName: undefined,
      },
      // {
      //   product_code: 1244, // Betby
      //   openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_ROUTE,
      //   routeName: "BetByPage"
      // },
      // {
      //   product_code: 1270, // Lucky
      //   openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_ROUTE,
      //   routeName: "LuckyPage"
      // },
    ]

  function customGameOpenMethod(item: ICustomGameOpen): {
    openMethod: OPEN_GAME_MODE.Enums
    routeName: string | undefined
  } {
    if (isFA11.value || isFA21.value || isZPL1.value || isARG1.value) {
      return { openMethod: OPEN_GAME_MODE.Enums.FORCE_USE_GAME_DIALOG, routeName: undefined }
    }

    const match = customGameOpenList.find((config) => {
      return Object.entries(config).every(([key, value]) => {
        if (key === "openMethod" || key === "routeName") return true
        return item[key as keyof ICustomGameOpen] === value
      })
    })

    if (match) {
      return {
        openMethod: match.openMethod,
        routeName: match.routeName,
      }
    }

    return { openMethod: OPEN_GAME_MODE.Enums.DEFAULT, routeName: undefined }
  }

  async function openGame(
    integration_id: number,
    product_code: number,
    game_code = "",
    game_type_id?: string | number,
    pup = false,
    currency?: string | null,
    lang?: number,
    useDialogIframe = false,
    walletType?: WALLET_TYPE.Enums,
    supportCurrency?: string | string[] | null
  ) {
    const gameOpenMethodCondition = customGameOpenMethod({
      product_code: Number(product_code),
      game_code,
    })

    // 強制以「自定義的route page」開啟遊戲
    if (gameOpenMethodCondition.openMethod === OPEN_GAME_MODE.Enums.FORCE_USE_ROUTE) {
      // 未登入且該route不需要登入，則直接前往該routeName
      const toRoute = router.resolve({ name: gameOpenMethodCondition.routeName })
      if (toRoute && !toRoute.meta.needAuth) {
        if (route.name !== gameOpenMethodCondition.routeName) {
          router.push({
            name: gameOpenMethodCondition.routeName,
          })
        }
        return
      }
    }

    if (!isLogin.value) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: t("common.alarm.pleaseLogin"),
        badgeStyle: "opacity: 0",
      })
      if (!pup) {
        router.push({ name: "Login" })
      } else {
        eventbus.emit("openLogin", true)
      }
      return
    }

    let currentCurrency = currency

    if (!currency) {
      currentCurrency = activeWalletCurrencyCode.value
    }

    if (!currentCurrency) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: t("common.alarm.pleaseUseCurrency"),
        badgeStyle: "opacity: 0",
      })
      return
    }

    const currentWalletType = walletType ?? activeWalletType.value

    if (currentWalletType === null) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: t("common.alarm.pleaseUseCurrency"),
        badgeStyle: "opacity: 0",
      })
      return
    }

    const payload: Request.LaunchGame = {
      is_v2: true,
      game_code,
      product_code: Number(product_code),
      game_type: gameTypeState.map[gameTypeState.using]?.game_type ?? "",
      game_type_id: gameTypeState.using,
      integration_id: integration_id ?? INTEGRATION_ID.Enums.GSCP,
      platform: isMobile.value ? PLATFORM_TYPE.Enums.mobile : PLATFORM_TYPE.Enums.web,
      currency: currentCurrency,
      // amuse 特規，強制使用 en，其他各版型則為使用者選擇的語言
      language_code: lang ?? LANGUAGE_CODE.Enums[nowLang.value as keyof typeof LANGUAGE_CODE.Enums],
      wallet_type: currentWalletType,
    }
    console.log("[launchGame] payload:", payload)

    try {
      $q.loading.show()
      isLoading.value = true
      const { code, data, msg } = await useApi(launchGame, payload)
      isLoading.value = false
      $q.loading.hide()

      switch (code) {
        case ERROR_CODE_TYPE.Enums.P_USER_PREFERENCES_EXCLUSION:
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_COLLECTION_AMOUNT_MEET_LIMIT:
          const codeTransferI18n = {
            [ERROR_CODE_TYPE.Enums.P_USER_PREFERENCES_EXCLUSION]: "member.profile.exclusionPeriodCannotPlayGame",
            [ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_COLLECTION_AMOUNT_MEET_LIMIT]:
              "member.profile.CumulativeBettingAmountReachedMaximum",
          }
          eventEmit("openAlertDialog", {
            type: ALERT_DIALOG_TYPE.Enums.EMPTY,
            show: true,
            titleI18n: "",
            contentI18n: codeTransferI18n[code] || `${msg}${code ? " (" + code + ")" : ""}`,
            footerBtnTextI18n: "common.btn.submit",
          })
          break
        case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_CURRENCY_NOT_SUPPORT:
          gameDialogStore.currencySupportDialog.openCurrencySupportDialog({
            currencies: data?.currencies,
            supportCurrency,
            integrationId: integration_id,
            productCode: payload.product_code,
            gameCode: payload.game_code,
            walletType: currentWalletType ?? undefined,
            bonusSupport: data?.bonus_support ?? true,
          })
          break
        case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_WALLET_TYPE_DISABLE:
          gameDialogStore.currencySupportDialog.openCurrencySupportDialog({
            currencies: data?.currencies,
            supportCurrency: currentCurrency,
            integrationId: integration_id,
            productCode: payload.product_code,
            gameCode: payload.game_code,
            walletType: WALLET_TYPE.Enums.Cash,
            allowedWalletTypes: [WALLET_TYPE.Enums.Cash],
            bonusSupport: false,
          })
          break
        case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_GSMD_OFFLINE:
          $q.notify({
            type: "negative",
            position: "top",
            message: `${t("error_message.P_LAUNCH_GAME_GSMD_OFFLINE")} (${code})`,
            icon: "warning",
            timeout: 1000,
          })
          break
        case ERROR_CODE_TYPE.Enums.SUCCESS:
          // FB 體育需依代理商補上預設版面色系參數（ZPL1 為淺色）
          const isFBSports = payload.product_code === FB_SPORTS_PRODUCT_CODE
          // 初次進入強制覆蓋色系，不保留供應商記住的前次選擇
          const game_url = isFBSports ? applyDefaultColor(data?.game_url || "", true) : data?.game_url || ""
          const game_content = isFBSports ? applyDefaultColorToContent(data?.game_content || "", true) : data?.game_content || ""
          const gameTarget = game_url || game_content

          switch (gameOpenMethodCondition.openMethod) {
            case OPEN_GAME_MODE.Enums.FORCE_USE_GAME_DIALOG:
              // 強制以「遊戲彈窗 + iframe」開啟遊戲
              gameDialogStore.launchGameDialog.showDialog()
              gameDialogStore.launchGameDialog.gameUrl = game_url
              gameDialogStore.launchGameDialog.gameContent = game_content
              break
            case OPEN_GAME_MODE.Enums.FORCE_USE_NEW_TAB:
              // 強制以「另開新分頁」開啟遊戲
              // Digitain 特殊處理：手機版使用 Asian View 頁面
              if (
                payload.product_code === 1164 &&
                ($q.platform.is.mobile || $q.platform.is.nativeMobile) &&
                gameOpenMethodCondition.routeName
              ) {
                // 手機版 Digitain 跳轉到 Asian View 頁面
                if (route.name !== gameOpenMethodCondition.routeName) {
                  router.push({
                    name: gameOpenMethodCondition.routeName,
                  })
                }
              } else {
                // PC 版或其他遊戲：直接開新分頁
                if (gameTarget) {
                  openURL(gameTarget, undefined, {
                    menubar: false,
                    toolbar: false,
                    noreferrer: false,
                  })
                } else {
                  console.error("[openGame] missing game target in FORCE_USE_NEW_TAB", {
                    payload,
                    code,
                    msg,
                    data,
                  })
                }
              }
              break
            case OPEN_GAME_MODE.Enums.FORCE_USE_HREF:
              // 強制以「本頁跳轉」開啟遊戲
              if (gameTarget) {
                window.location.href = gameTarget
              } else {
                console.error("[openGame] missing game target in FORCE_USE_HREF", {
                  payload,
                  code,
                  msg,
                  data,
                })
              }
              break
            case OPEN_GAME_MODE.Enums.FORCE_USE_ROUTE:
              // 強制以「找對應的route name」開啟遊戲
              if (gameOpenMethodCondition.routeName) {
                // 若當前非 gameOpenMethodCondition.routeName 頁面，則前往
                if (route.name !== gameOpenMethodCondition.routeName) {
                  router.push({
                    name: gameOpenMethodCondition.routeName,
                  })
                }
              }
              break
            default:
              // 跑預設開啟遊戲方式的邏輯
              if (!game_url && !game_content) {
                console.error("[openGame] both game_url and game_content are empty", {
                  payload,
                  code,
                  msg,
                  data,
                })
              }
              if (game_url) {
                if (($q.platform.is.mobile || $q.platform.is.nativeMobile) && !game_url.startsWith("http://")) {
                  gameDialogStore.launchGameDialog.showDialog()
                  gameDialogStore.launchGameDialog.gameUrl = game_url
                  gameDialogStore.launchGameDialog.gameContent = game_content
                } else {
                  openURL(game_url, undefined, {
                    menubar: false,
                    toolbar: false,
                    noreferrer: false,
                  })
                }
              }
              if (game_content) {
                gameDialogStore.launchGameDialog.showDialog()
                gameDialogStore.launchGameDialog.gameUrl = game_url
                gameDialogStore.launchGameDialog.gameContent = game_content
              }
          }
          break
        default:
          break
      }
    } catch (error) {
      console.error("[openGame] unexpected error", {
        error,
        payload,
      })
      $q.loading.hide()
      isLoading.value = false
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "Internal Server Error",
        badgeStyle: "opacity: 0",
      })
    }
  }

  async function getFavoriteGames(
    { isHandleLoadingControl = true }: { isHandleLoadingControl?: boolean } = { isHandleLoadingControl: true }
  ) {
    if (!isLogin.value) return
    try {
      if (isHandleLoadingControl) {
        $q.loading.show()
        isLoading.value = true
      }
      const { status, data } = await useApi(getFavoriteGameList)

      if (isHandleLoadingControl) {
        $q.loading.hide()
        isLoading.value = false
      }

      if (status) {
        updateFavoriteList(data)
      }
    } catch (error) {
      if (isHandleLoadingControl) {
        $q.loading.hide()
        isLoading.value = false
      }
    }
  }

  async function addfavoriteGame(game: Response.GameItem, pup?: boolean) {
    if (!isLogin.value) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: t("common.alarm.pleaseLogin"),
        badgeStyle: "opacity: 0",
      })
      if (pup) {
        eventbus.emit("openLogin", true)
        return
      }
      router.push({ name: "Login" })
      return
    }

    if (isLoading.value) return
    const payload: Request.FavoriteGame = {
      game_id: game.game_id,
    }
    isLoading.value = true
    const { status } = await useApi(favoriteGame, payload)
    isLoading.value = false
    if (status) {
      // await getFavoriteGames()
      game.is_favorite = true
      game.favorite_count = game.favorite_count + 1

      // Update game in gamesMap for all tag types
      ;(Object.values(GAME_TAG_TYPE.Enums).filter((v) => typeof v === "number") as GAME_TAG_TYPE.Enums[]).forEach(
        (tagType) => {
          const gameList = gameState.gamesMap[tagType]
          if (gameList) {
            const foundGame = gameList.find((g) => g.game_id === game.game_id)
            if (foundGame) {
              foundGame.is_favorite = true
              foundGame.favorite_count = foundGame.favorite_count + 1
            }
          }
        }
      )

      // Update game in allGameList arrays
      Object.values(gameState.allGameList).forEach((gameList) => {
        const foundGame = gameList.find((g) => g.game_id === game.game_id)
        if (foundGame) {
          foundGame.is_favorite = true
          foundGame.favorite_count = foundGame.favorite_count + 1
        }
      })

      // Update game in other lists
      const foundInList = gameState.list.find((g) => g.game_id === game.game_id)
      if (foundInList) {
        foundInList.is_favorite = true
        foundInList.favorite_count = foundInList.favorite_count + 1
      }

      const foundInAllProvider = gameState.allProviderGameList.find((g) => g.game_id === game.game_id)
      if (foundInAllProvider) {
        foundInAllProvider.is_favorite = true
        foundInAllProvider.favorite_count = foundInAllProvider.favorite_count + 1
      }
    }
  }

  async function removefavoriteGame(game: Response.GameItem, pup?: boolean) {
    if (!isLogin.value) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: t("common.alarm.pleaseLogin"),
        badgeStyle: "opacity: 0",
      })
      if (pup) {
        eventbus.emit("openLogin", true)
        return
      }
      router.push({ name: "Login" })
      return
    }

    if (isLoading.value) return
    const payload: Request.FavoriteGame = {
      game_id: game.game_id,
    }
    isLoading.value = true
    const { status } = await useApi(deleteFavoriteGame, payload)
    isLoading.value = false

    if (status) {
      // await getFavoriteGames()
      game.is_favorite = false
      game.favorite_count = game.favorite_count > 0 ? game.favorite_count - 1 : game.favorite_count

      // Update game in gamesMap for all tag types to ensure reactivity
      ;(Object.values(GAME_TAG_TYPE.Enums).filter((v) => typeof v === "number") as GAME_TAG_TYPE.Enums[]).forEach(
        (tagType) => {
          const gameList = gameState.gamesMap[tagType]
          if (gameList) {
            const foundGame = gameList.find((g) => g.game_id === game.game_id)
            if (foundGame) {
              foundGame.is_favorite = false
              foundGame.favorite_count =
                foundGame.favorite_count > 0 ? foundGame.favorite_count - 1 : foundGame.favorite_count
            }
          }
        }
      )

      // Update game in allGameList arrays to ensure reactivity
      Object.values(gameState.allGameList).forEach((gameList) => {
        const foundGame = gameList.find((g) => g.game_id === game.game_id)
        if (foundGame) {
          foundGame.is_favorite = false
          foundGame.favorite_count =
            foundGame.favorite_count > 0 ? foundGame.favorite_count - 1 : foundGame.favorite_count
        }
      })

      // Update game in other lists
      const foundInList = gameState.list.find((g) => g.game_id === game.game_id)
      if (foundInList) {
        foundInList.is_favorite = false
        foundInList.favorite_count =
          foundInList.favorite_count > 0 ? foundInList.favorite_count - 1 : foundInList.favorite_count
      }

      const foundInAllProvider = gameState.allProviderGameList.find((g) => g.game_id === game.game_id)
      if (foundInAllProvider) {
        foundInAllProvider.is_favorite = false
        foundInAllProvider.favorite_count =
          foundInAllProvider.favorite_count > 0
            ? foundInAllProvider.favorite_count - 1
            : foundInAllProvider.favorite_count
      }
    }
  }

  function getGameImage(item: IGetGameImage): string {
    if (item.custom_image) {
      return buildImageUrl(item.custom_image)
    }
    const gameType = resolveStaticGameImageType(item.game_type_id)

    return `${VITE_APP_STATIC_RESOURCE_URL}/publics/images/games/${item.integration_id}/${item.product_code}/${gameType}/${item.game_code}.png`
  }

  function getGameImageByCustomPage(item: IGetGameImageByCustomPage): string {
    const gameType = resolveStaticGameImageType(item.game_type)

    return `${VITE_APP_STATIC_RESOURCE_URL}/publics/images/games/${item.product_integration_id}/${item.product_code}/${gameType}/${item.game_code}.png`
  }

  //#endregion

  return {
    /** 遊戲類型資訊 */
    gameTypeState,

    /** 初始化遊戲類型列表 */
    initGameTypeList,

    /** 產品資訊 */
    productState,

    /** 取得產品列表 */
    getProducts,

    /** 取得產品列表 */
    getAllProducts,

    /** 產品點擊（跳頁） */
    handleProductClick,

    /** 遊戲類型圖片 */
    getGameTypeImage,

    /** 取得產品圖片(方) */
    getProductSquareImage,

    /** 取得產品圖片(寬) */
    getProductWideImage,

    /** 取得產品圖片(Tab) */
    getProductTabImage,

    /** 遊戲資訊 */
    gameState,

    /** 取得所有game type項目的遊戲類型  包括got, favirite */
    initAllGameList,

    /** 遊戲標籤列表 */
    gameTagList,

    /** 取得遊戲列表 */
    getGames,

    /** 取得所有遊戲列表 */
    getAllGames,

    /** 取的收藏ID清單 */
    getFavoriteGames,

    /** 開啟遊戲 */
    openGame,

    /** 收藏遊戲 */
    addfavoriteGame,

    /** 移除收藏遊戲 */
    removefavoriteGame,

    /** 取得遊戲圖片 */
    getGameImage,

    /** 取得自定義頁面 CMS 防呆圖片 */
    getGameImageByCustomPage,

    /** 手機版啟動遊戲彈窗 */
    launchGameDialog: gameDialogStore.launchGameDialog,

    /** 幣別不支援彈窗 */
    currencySupportDialog: gameDialogStore.currencySupportDialog,

    /** 加密貨幣錢包彈窗（amopay 等加密支付） */
    cryptoWalletDialog: gameDialogStore.cryptoWalletDialog,
  }
}
