import { ref, computed, nextTick, onMounted, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { launchGame, launchGuestGame, getProductAvailableCurrency } from "src/api/game"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useApi } from "src/common/hooks/useApi"
import { useAuth } from "src/common/hooks/useAuth"
import { useGameDialogStore } from "src/stores/gameDialogStore"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import { useLanguage } from "src/common/composables/useLanguage"
import {
  LANGUAGE_CODE,
  LANGUAGE_TYPE,
  PLATFORM_TYPE,
  GAME_TYPE,
  ERROR_CODE_TYPE,
  WALLET_TYPE,
} from "src/common/utils/constants"
import type * as Request from "src/api/request.type"

// ============================================================================
// v8.1 API 類型定義
// ============================================================================

/** 重複投注資訊 */
interface RepeatBetCouponInfo {
  /** 重複投注單號 */
  betNumber: number
  /** 遊戲類型: 0 = Non Tournament, 6 = Tournament */
  gameType: number
}

/** 初始路由配置 */
interface InitialRoute {
  /** 路由路徑 */
  path: string
  /** 查詢參數 */
  qs?: Record<string, any>
  /** Hash 數據（SEO 友好 URL） */
  hashData?: string
}

/** zIndex 配置 */
interface ZIndexConfig {
  /** 投注單關閉時的 zIndex，預設 1990 */
  closed?: number
  /** 投注單開啟時的 zIndex，預設 1990 */
  opened?: number
  /** 投注單完全展開時的 zIndex，預設 1990 */
  fullOpened?: number
}

/**
 * Digitain v8.1 統一啟動參數
 * @see SportsBook Frontend Integration API v8.1
 */
interface DigitainBootParams {
  // ===== 必需參數 =====
  /** Sport URL provided by Digitain System */
  server: string
  /** DOM 容器 ID */
  containerId: string
  /** 用戶授權 Token，未登入時為 "-" */
  token: string
  /** 嵌入域名列表 */
  parent: string[]
  /** 合作夥伴識別碼 */
  sportPartner: string

  // ===== 可選參數 =====
  /** 主題配置: "default" | "alternative" */
  projectTheme?: "default" | "alternative"
  /** 預設語言 ISO 代碼 */
  defaultLanguage?: string
  /** 視圖類型，僅 Mobile 有效，值為 "asian" 時使用亞洲盤 */
  view?: "asian"
  /** 底部導航欄，僅 Mobile 有效，預設 false */
  bottomNavBar?: boolean
  /** 賠率格式列表: 0=Decimal, 1=Fractional, 2=American, 3=Hong Kong, 4=Malay, 5=Indo */
  oddsFormatList?: number[]
  /** 預設賠率格式 */
  oddsFormat?: number
  /** zIndex 配置 */
  zIndex?: ZIndexConfig
  /** 初始路由 */
  initialRoute?: InitialRoute
  /** URL 結構類型: 1=集成方創建, 2=Digitain創建（需要 sportMainPath） */
  urlStructureType?: 1 | 2
  /** 體育主路徑（urlStructureType=2 時必需） */
  sportMainPath?: string
  /** 登入函數名稱（字符串） */
  login?: string
  /** 投注單預訂號 */
  betslipBookNumber?: number
  /** 投注單複製連結 URL 模板 */
  betslipCopyLinkUrl?: string
  /** 重複投注資訊 */
  repeatBetCouponInfo?: RepeatBetCouponInfo
  /** 頂部固定元素高度（僅 Mobile），單位 px */
  topFixedElementHeight?: number
}

/**
 * v8.1 事件監聽類型
 * type 3: 路由變化
 * type 4: 額外數據
 * type 5: 顯示存款彈窗
 * type 6: 更新餘額
 */
interface SportAppEventData {
  type: 3 | 4 | 5 | 6
  message?: any
}

/**
 * v8.1 事件派發類型
 * type 1: 銷毀
 * type 2: 主題變更
 * type 3: 路由變化
 * type 4: 開啟投注單
 * type 5: 更新獎金資訊
 * type 6: 更新頂部固定元素高度
 */
interface SportAppDispatchData {
  type: 1 | 2 | 3 | 4 | 5 | 6
  message?: any
}

/** Digitain App 實例類型 (v8.1) */
interface DigitainAppInstance {
  /** 監聽事件 */
  addEventListener: (
    event: "sportAppEventDispatch" | "updateUserBalance",
    callback: (data: { data: SportAppEventData }) => void
  ) => void
  /** 派發事件 */
  dispatchEvent: (event: "sportAppEventListener", data: SportAppDispatchData) => void
}

/** 支援的視圖類型 */
type DigitainViewName =
  | "Mobile"
  | "AsianView"
  | "EuropeanView"
  | "EsportView"
  | "LatinoView"
  | "ModernView"
  | "SimpleEast"

// 聲明全局 Bootstrapper 類型 (v8.1 只有 boot 方法)
declare global {
  interface Window {
    Bootstrapper?: {
      boot: (params: DigitainBootParams, options: { name: DigitainViewName }) => Promise<DigitainAppInstance>
    }
    /** 登入回調函數（由 Digitain SDK 調用） */
    digitainLoginCallback?: () => void
  }
}

// ============================================================================
// Composable
// ============================================================================

export function useDigitainGame() {
  const $q = useQuasar()
  const { t } = useI18n()
  const { isLogin } = useAuth()
  const { activeWalletCurrencyCode, activeWalletType } = useUserInfo()
  const { setGameTypeUsing } = useGameTypeStore()
  const { currencySupportDialog } = useGameDialogStore()
  const { nowLang } = useLanguage()

  // ===== 響應式狀態 =====
  const isLoading = ref(false)
  const widgetUrl = ref<string>()
  const digitainDom = ref<HTMLElement | null>(null)
  const token = ref<string | null>(null)
  const sportPartner = ref<string | null>(null)
  const serverUrl = ref<string | null>(null)
  const digitainAppInstance = ref<DigitainAppInstance | null>(null)
  const screenWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1920)

  // ===== 計算屬性 =====

  /**
   * 判斷是否使用 Mobile View
   * 條件：手機裝置 或 螢幕寬度 < 1024px
   */
  const useMobileView = computed(() => {
    return $q.platform.is.mobile || $q.platform.is.nativeMobile || screenWidth.value < 1024
  })

  /**
   * 取得當前視圖名稱
   * - 螢幕 < 1024 或手機：Mobile
   * - 其他：AsianView
   */
  const currentViewName = computed<DigitainViewName>(() => {
    return useMobileView.value ? "Mobile" : "AsianView"
  })

  /**
   * 透過 nowLang 取得 Digitain 對應的語系代碼
   * @see Language Codes (v8.1 文檔附錄)
   */
  const digitainLangCode = computed(() => {
    const langMap: { [key in LANGUAGE_TYPE.Enums]: string } = {
      [LANGUAGE_TYPE.Enums.EN]: "en",
      [LANGUAGE_TYPE.Enums.TH]: "th",
      [LANGUAGE_TYPE.Enums.ID]: "id",
      [LANGUAGE_TYPE.Enums.VI]: "vn", // v8.1 使用 vn
      [LANGUAGE_TYPE.Enums.CN]: "zh",
      [LANGUAGE_TYPE.Enums.TW]: "zh-CHT", // v8.1 使用 zh-CHT
      [LANGUAGE_TYPE.Enums.JP]: "ja",
      [LANGUAGE_TYPE.Enums.KO]: "ko",
      [LANGUAGE_TYPE.Enums.SP]: "es",
      [LANGUAGE_TYPE.Enums.BR]: "br", // v8.1 使用 br
      [LANGUAGE_TYPE.Enums.BM]: "my", // Burmese
      [LANGUAGE_TYPE.Enums.BN]: "bn", // Bengali
      [LANGUAGE_TYPE.Enums.AR]: "ar",
      // Digitain Hindi 支援未確認，先 fallback 為 en
      [LANGUAGE_TYPE.Enums.HI]: "en",
    }

    return langMap[nowLang.value as keyof typeof langMap] || "en"
  })

  // ===== 螢幕寬度監聽 =====
  const handleResize = () => {
    screenWidth.value = window.innerWidth
  }

  // ===== URL 解析 =====

  /**
   * 從 game_url 解析 token 和 sportPartner
   */
  function parseDataFromUrl(url: string | undefined): boolean {
    if (!url) {
      token.value = null
      sportPartner.value = null
      serverUrl.value = null
      return false
    }

    try {
      const urlObj = new URL(url)
      token.value = urlObj.searchParams.get("token")
      sportPartner.value = urlObj.searchParams.get("sportPartner")
      serverUrl.value = urlObj.origin

      return !!(token.value && sportPartner.value)
    } catch (error) {
      console.error("[Digitain] 解析 URL 參數失敗:", error)
      token.value = null
      sportPartner.value = null
      serverUrl.value = null
      return false
    }
  }

  // ===== 事件處理 (v8.1) =====

  /**
   * 設置 v8.1 事件監聽
   */
  function setupEventListeners(app: DigitainAppInstance) {
    // 統一事件監聽器 (v8.1)
    app.addEventListener("sportAppEventDispatch", ({ data }) => {
      const { type, message } = data

      switch (type) {
        case 3:
          // 路由變化
          console.log("[Digitain] 路由變化:", message)
          break
        case 4:
          // 額外數據（賽事資訊）
          console.log("[Digitain] 賽事資訊:", message)
          break
        case 5:
          // 顯示存款彈窗
          console.log("[Digitain] 存款彈窗觸發")
          // 可以在這裡導航到存款頁面
          break
        case 6:
          // 更新餘額 (僅 EuropeanView)
          console.log("[Digitain] 餘額更新:", message)
          break
      }
    })

    // 餘額更新事件 (非 EuropeanView)
    app.addEventListener("updateUserBalance", ({ data }) => {
      console.log("[Digitain] 用戶餘額更新:", data)
    })
  }

  /**
   * 設置全局登入回調函數
   * v8.1 中 login 參數為函數名稱字符串
   */
  function setupLoginCallback() {
    window.digitainLoginCallback = () => {
      console.log("[Digitain] 登入回調觸發")
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: t("common.alarm.pleaseLogin"),
        badgeStyle: "opacity: 0",
      })
    }
  }

  // ===== 初始化與銷毀 =====

  /**
   * 初始化 Digitain Renderer (v8.1)
   * 根據螢幕寬度選擇 Mobile 或 AsianView
   */
  function initializeDigitainRenderer() {
    isLoading.value = true

    if (!token.value || !sportPartner.value || !digitainDom.value) {
      console.warn("[Digitain] 缺少必要參數，無法初始化")
      isLoading.value = false
      return
    }

    // 設置登入回調
    setupLoginCallback()

    const setupDigitainRenderer = async () => {
      const viewName = currentViewName.value
      console.log(`[Digitain] 初始化 ${viewName}，螢幕寬度: ${screenWidth.value}px`)

      if (!window.Bootstrapper) {
        console.error("[Digitain] Bootstrapper 未定義，請確保已載入 SDK")
        isLoading.value = false
        return
      }

      try {
        // v8.1 統一參數配置
        const params: DigitainBootParams = {
          // 必需參數
          server: serverUrl.value!,
          containerId: "digitain-container",
          token: token.value!,
          parent: [window.location.hostname],
          sportPartner: sportPartner.value!,

          // 可選參數
          projectTheme: "default",
          defaultLanguage: digitainLangCode.value,
          oddsFormatList: [0, 1, 2], // Decimal, Fractional, American
          oddsFormat: 0, // 預設 Decimal
          zIndex: {
            closed: 9999,
            opened: 9999,
            fullOpened: 9999,
          },
          login: "digitainLoginCallback", // 登入回調函數名稱
        }

        // Mobile 專用參數（僅 Mobile view 適用）
        if (viewName === "Mobile") {
          console.log("[Digitain] 使用 Mobile 專用參數")
          params.view = "asian" // 使用亞洲盤視圖樣式
          params.bottomNavBar = false
          // topFixedElementHeight 僅適用於 Mobile，且值必須 > 0
          // 如果網站有固定 Header，設置其高度；沒有則不傳入此參數
          // params.topFixedElementHeight = 60
        }

        // v8.1 只使用 Bootstrapper.boot
        const app = await window.Bootstrapper.boot(params, { name: viewName })

        digitainAppInstance.value = app
        setupEventListeners(app)
        console.log(`[Digitain] ${viewName} 初始化成功`)
      } catch (error) {
        console.error("[Digitain] 初始化失敗:", error)
      }

      isLoading.value = false
    }

    // 加載 Digitain Bootstrapper SDK
    const script = document.createElement("script")
    script.src = `${serverUrl.value}/js/partner/bootstrapper.min.js`
    script.async = true
    script.onload = () => {
      console.log("[Digitain] SDK 載入成功")
      setupDigitainRenderer()
    }
    script.onerror = () => {
      console.error("[Digitain] SDK 載入失敗")
      isLoading.value = false
    }
    document.body.appendChild(script)
  }

  /**
   * 清理 Digitain Renderer (v8.1)
   * 使用事件派發方式銷毀
   */
  function cleanupDigitainRenderer() {
    // v8.1: 使用事件派發銷毀
    if (digitainAppInstance.value) {
      try {
        digitainAppInstance.value.dispatchEvent("sportAppEventListener", {
          type: 1, // Destroy
          message: null,
        })
        console.log("[Digitain] 已發送銷毀事件")
      } catch (error) {
        console.error("[Digitain] 銷毀失敗:", error)
      }
      digitainAppInstance.value = null
    }

    // 移除 SDK 腳本
    const scripts = document.querySelectorAll('script[src*="bootstrapper"]')
    scripts.forEach((script) => script.remove())

    // 清空容器
    if (digitainDom.value) {
      digitainDom.value.innerHTML = ""
    }

    // 移除登入回調
    delete window.digitainLoginCallback

    // 重置狀態
    token.value = null
    sportPartner.value = null
    serverUrl.value = null
  }

  // ===== 事件派發 API (v8.1) =====

  /**
   * 切換主題
   * @param theme - "default" | "alternative"
   */
  function setProjectTheme(theme: "default" | "alternative") {
    if (digitainAppInstance.value) {
      digitainAppInstance.value.dispatchEvent("sportAppEventListener", {
        type: 2, // Project theme change
        message: { projectTheme: theme },
      })
      console.log(`[Digitain] 主題已切換為: ${theme}`)
    }
  }

  /**
   * 變更路由
   * @param route - 路由配置
   */
  function changeRoute(route: InitialRoute) {
    if (digitainAppInstance.value) {
      digitainAppInstance.value.dispatchEvent("sportAppEventListener", {
        type: 3, // Routing change
        message: route,
      })
      console.log("[Digitain] 路由已變更:", route)
    }
  }

  /**
   * 開啟投注單
   * @param activeTab - 1: 主投注單, 2: 我的投注
   */
  function openBetSlip(activeTab: 1 | 2 = 1) {
    if (digitainAppInstance.value) {
      digitainAppInstance.value.dispatchEvent("sportAppEventListener", {
        type: 4, // Open Bet Slip
        message: { betslipActiveTab: activeTab },
      })
      console.log(`[Digitain] 開啟投注單 Tab: ${activeTab}`)
    }
  }

  /**
   * 更新獎金資訊
   */
  function updateBonusInfo() {
    if (digitainAppInstance.value) {
      digitainAppInstance.value.dispatchEvent("sportAppEventListener", {
        type: 5, // Update Bonus Info
        message: null,
      })
      console.log("[Digitain] 獎金資訊已更新")
    }
  }

  /**
   * 更新頂部固定元素高度 (僅 Mobile)
   * @param height - 高度（像素）
   */
  function updateTopFixedElementHeight(height: number) {
    if (digitainAppInstance.value && useMobileView.value) {
      digitainAppInstance.value.dispatchEvent("sportAppEventListener", {
        type: 6, // Update Top Fixed Element Height
        message: { topFixedElementHeight: height },
      })
      console.log(`[Digitain] 頂部高度已更新: ${height}px`)
    }
  }

  // ===== 遊戲啟動 =====

  /**
   * Digitain 專用的 launchGame
   */
  const launchDigitainGame = async (
    product_code: number,
    game_code = "",
    game_type_id: number,
    currency?: string | null,
    lang?: number
  ) => {
    const integration_id = 1

    let currentCurrency = currency
    if (isLogin.value) {
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
    } else {
      // 未登入狀態：使用 getProductAvailableCurrency 取得可用幣別
      if (!currency) {
        try {
          currentCurrency = await getAvailableCurrency(product_code.toString(), "SPORT_BOOK")
        } catch (error) {
          console.log("[Digitain] 取得可用幣別失敗:", error)
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: t("common.alarm.pleaseUseCurrency"),
            badgeStyle: "opacity: 0",
          })
          return
        }
      }
    }

    try {
      $q.loading.show()
      isLoading.value = true

      // 清空之前的狀態
      widgetUrl.value = ""
      digitainDom.value = null
      setGameTypeUsing(game_type_id)

      const basePayload: Request.LaunchGuestGame = {
        game_code,
        product_code,
        game_type_id,
        platform: useMobileView.value ? PLATFORM_TYPE.Enums.mobile : PLATFORM_TYPE.Enums.web,
        currency: currentCurrency ?? "",
        language_code: lang ?? LANGUAGE_CODE.Enums[nowLang.value as keyof typeof LANGUAGE_CODE.Enums],
        wallet_type: isLogin.value ? activeWalletType.value ?? WALLET_TYPE.Enums.Cash : WALLET_TYPE.Enums.Cash,
        integration_id,
        is_v2: true,
      }
      const { code, data } = isLogin.value
        ? await useApi(launchGame, basePayload)
        : await useApi(launchGuestGame, basePayload)

      const gameUrl: string | undefined = data?.game_url

      switch (code) {
        case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_CURRENCY_NOT_SUPPORT:
          currencySupportDialog.openCurrencySupportDialog({
            currencies: data?.currencies,
            integrationId: integration_id,
            productCode: product_code,
            gameCode: game_code,
            walletType: basePayload.wallet_type,
            bonusSupport: data?.bonus_support ?? true,
            closeFunction: () => {
              window.history.back()
            },
            reOpenGame: false,
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
          console.log("[Digitain] game_url:", gameUrl)
          widgetUrl.value = gameUrl

          const isParsed = parseDataFromUrl(gameUrl)
          if (!isParsed) {
            console.log("[Digitain] 無法解析 URL 參數，使用 fallback iframe")
            isLoading.value = false
            return
          }

          // 初始化 Digitain Renderer
          isLoading.value = false
          digitainDom.value = document.getElementById("digitain-container")
          nextTick(() => {
            initializeDigitainRenderer()
          })
          break
      }
      console.log("[Digitain] 遊戲啟動成功")
    } catch (error) {
      console.log("[Digitain] 遊戲啟動失敗:", error)
      throw error
    } finally {
      $q.loading.hide()
    }
  }

  /**
   * 獲取產品可用幣別（未登入狀態使用）
   */
  const getAvailableCurrency = async (product_code: string, game_type: string): Promise<string> => {
    try {
      const params: Request.ProductAvailableCurrency = {
        product_code,
        game_type,
      }

      const result = await useApi(getProductAvailableCurrency, params)

      if (result.data && result.data.length > 0) {
        return result.data[0].code
      }

      throw new Error("No available currency")
    } catch (error) {
      throw error
    }
  }

  /**
   * 初始化 Digitain 遊戲
   * 在頁面進入時自動呼叫
   */
  const initDigitainGame = async () => {
    const PRODUCT_CODE = 1164 // Digitain 代碼

    try {
      await launchDigitainGame(PRODUCT_CODE, "", GAME_TYPE.Enums.SPORTBOOK)
    } catch (error) {
      console.log("[Digitain] 初始化遊戲失敗:", error)
      throw error
    }
  }

  // ===== 生命週期 =====

  // 監聽螢幕寬度變化
  if (typeof window !== "undefined") {
    onMounted(() => {
      window.addEventListener("resize", handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener("resize", handleResize)
    })
  }

  // ===== 返回 =====
  return {
    /** 是否正在載入 */
    isLoading,

    /** Digitain 專區使用的 URL */
    widgetUrl,

    /** 是否使用 Mobile View (螢幕 < 1024px 或手機) */
    useMobileView,

    /** 當前視圖名稱 */
    currentViewName,

    /** Digitain App 實例 */
    digitainAppInstance,

    /** 螢幕寬度 */
    screenWidth,

    /** Digitain 專區啟動遊戲 */
    launchDigitainGame,

    /** 初始化 Digitain Renderer */
    initializeDigitainRenderer,

    /** 清理 Digitain Renderer */
    cleanupDigitainRenderer,

    /** 初始化 Digitain 遊戲 */
    initDigitainGame,

    // ===== v8.1 事件派發 API =====

    /** 切換主題 */
    setProjectTheme,

    /** 變更路由 */
    changeRoute,

    /** 開啟投注單 */
    openBetSlip,

    /** 更新獎金資訊 */
    updateBonusInfo,

    /** 更新頂部固定元素高度 (僅 Mobile) */
    updateTopFixedElementHeight,
  }
}
