/* eslint-disable */
import { ref, computed, nextTick } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { launchGame, launchGuestGame, getProductAvailableCurrency } from "src/api/game"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useApi } from "src/common/hooks/useApi"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useEnvInfoStore } from "src/stores/envStore"
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
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import type * as Request from "src/api/request.type"

// 宣告 BTRenderer 全域類型
declare global {
  interface Window {
    BTRenderer: any
  }
  const BTRenderer: any
}

// 站點客製選項；全部 optional，未提供時行為與原本完全相同
export interface UseBetByGameOptions {
  /** 取得當下 BTRenderer betslipZIndex；未提供時維持既有 default 1 */
  betslipZIndex?: () => number | undefined
  /** 取得當下投注單登入行為；未提供時維持既有 please-login notification */
  onLogin?: () => (() => void) | undefined
  /** 取得當下是否隱藏 mobile 收合投注單 launcher；回傳 undefined 時不帶入該 SDK option */
  hideMobileClosedBetslip?: () => boolean | undefined
}

export function useBetByGame(options?: UseBetByGameOptions) {
  const $q = useQuasar()
  const { t } = useI18n()
  const { isLogin } = useAuth()
  const { activeWalletCurrencyCode, activeWalletType } = useUserInfo()
  const { isMain } = useEnv()
  // Betcapy(agent_code: BCY1)為專線,需帶入專屬 Betby 版型
  const { isBCYM, currentAgentCode } = useAgentCode()
  const { nowLang } = useLanguage()
  const { isMobile } = useMediaQuery()
  const { setGameTypeUsing } = useGameTypeStore()
  const { currencySupportDialog } = useGameDialogStore()

  const isLoading = ref(false)
  const widgetUrl = ref<string>()
  const betbyDom = ref<HTMLElement | null>(null)
  const btInstance = ref<any>(null)
  // SDK onBetSlipStateChange 回報的投注單開合狀態
  const isBetSlipOpen = ref(false)
  // 收合投注單的 optimistic guard：toggle 送出後、SDK 尚未回報 closed 前，不得重複 toggle
  const closeInFlight = ref(false)

  const resetBetSlipState = () => {
    isBetSlipOpen.value = false
    closeInFlight.value = false
  }

  const showNotification = (message: string, type: "warning" | "negative" = "warning") => {
    $q.notify({
      color: type === "warning" ? "red-5" : "negative",
      textColor: "white",
      icon: type === "warning" ? "warning" : "error",
      message,
      badgeStyle: "opacity: 0",
      position: type === "negative" ? "top" : undefined,
      timeout: type === "negative" ? 1000 : undefined,
    })
  }

  // 透過 nowLang 取得 BetBy 對應的語系代碼
  const BTLangCode = computed(() => {
    const langMap: { [key in LANGUAGE_TYPE.Enums]: string } = {
      [LANGUAGE_TYPE.Enums.EN]: "en",
      [LANGUAGE_TYPE.Enums.TH]: "th",
      [LANGUAGE_TYPE.Enums.ID]: "id",
      [LANGUAGE_TYPE.Enums.VI]: "vi",
      [LANGUAGE_TYPE.Enums.CN]: "zh",
      [LANGUAGE_TYPE.Enums.TW]: "zh-Hant",
      [LANGUAGE_TYPE.Enums.JP]: "ja",
      [LANGUAGE_TYPE.Enums.KO]: "ko",
      [LANGUAGE_TYPE.Enums.SP]: "es",
      [LANGUAGE_TYPE.Enums.BR]: "pt-br",
      [LANGUAGE_TYPE.Enums.BM]: "en",
      [LANGUAGE_TYPE.Enums.BN]: "en",
      [LANGUAGE_TYPE.Enums.AR]: "ar",
      // BetBy Hindi 支援未確認，先 fallback 為 en
      [LANGUAGE_TYPE.Enums.HI]: "en",
    }

    return langMap[nowLang.value as keyof typeof langMap] || "en"
  })

  // 從 URL 解析 token 和 brand_id
  const parseBetByUrl = (url: string): { token: string | null; brandId: string | null } => {
    try {
      const urlObj = new URL(url)
      const token = urlObj.searchParams.get("token")
      const brandMatch = url.match(/\/brand\/([^\/]+)\/sportsbook/)
      const brandId = brandMatch ? brandMatch[1] : null
      return { token, brandId }
    } catch (error) {
      console.error("解析 BetBy URL 失敗:", error)
      return { token: null, brandId: null }
    }
  }

  // 加載 BetBy 腳本
  const loadBetByScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 檢查腳本是否已加載
      if (window.BTRenderer) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = isMain.value
        ? "https://gscplus.sptpub.com/bt-renderer.min.js"
        : "https://ui.invisiblesport.com/bt-renderer.min.js"
      script.async = true
      script.onload = () => {
        console.log("BetBy Renderer 腳本加載成功")
        resolve()
      }
      script.onerror = () => {
        console.error("BetBy Renderer 腳本加載失敗")
        reject(new Error("Failed to load BetBy script"))
      }
      document.body.appendChild(script)
    })
  }

  // 設置 BetBy Renderer
  const setupBTRenderer = (brandId: string, token: string | null = null) => {
    if (btInstance.value) {
      const previousInstance = btInstance.value
      btInstance.value = null
      previousInstance.kill()
    }
    // reinitialize 時清掉舊 renderer 的投注單狀態
    resetBetSlipState()

    if (!betbyDom.value) {
      console.error("BetBy DOM 元素未找到")
      return
    }

    console.log(`初始化 BetBy Renderer - 語系: ${BTLangCode.value}`)

    // [BetBy Theme] 追蹤訊息：方便確認專屬版型是否帶入
    const betbyThemeName = isBCYM.value ? "gscplusb" : undefined
    console.log(
      `[BetBy Theme] agentCode: ${currentAgentCode.value} / isBCYM: ${isBCYM.value} / themeName: ${
        betbyThemeName ?? "(未帶入)"
      }`
    )

    if (!window.BTRenderer) {
      throw new Error("BTRenderer is not loaded")
    }

    // 每次 initialize / relaunch 都取 caller 當下的 hide condition，避免 sidebar 已開啟時 launcher 閃現
    const hideClosedBetslip = options?.hideMobileClosedBetslip?.()

    btInstance.value = new window.BTRenderer().initialize({
      brand_id: brandId,
      token: token,
      // 僅 Betcapy(agent_code: BCY1)專線帶入專屬版型,避免影響其他站點色系
      ...(betbyThemeName ? { themeName: betbyThemeName } : {}),
      onTokenExpired: async () => {
        return new Promise<string | null>(async (resolve) => {
          try {
            console.log("BetBy token 過期，重新獲取...")
            const { token: newToken } = await fetchGameUrlAndToken(
              1244,
              "",
              GAME_TYPE.Enums.SPORTBOOK,
              activeWalletCurrencyCode.value,
              undefined
            )
            console.log("新 token 獲取成功")
            resolve(newToken)
          } catch (error) {
            console.error("重新獲取 token 失敗:", error)
            resolve(null)
          }
        })
      },
      lang: BTLangCode.value || "en",
      target: betbyDom.value,
      betSlipOffsetTop: 59,
      betSlipOffsetBottom: 64,
      stickyTop: 0,
      betslipZIndex: options?.betslipZIndex?.() ?? 1,
      ...(typeof hideClosedBetslip === "boolean" ? { hideMobileClosedBetslip: hideClosedBetslip } : {}),
      onRouteChange: () => {},
      onLogin: () => {
        const onLogin = options?.onLogin?.()
        if (onLogin) {
          onLogin()
          return
        }
        showNotification(t("common.alarm.pleaseLogin"))
      },
      onRegister: () => {},
      onSessionRefresh: () => {
        window.location.reload()
        return Promise.resolve()
      },
      onBetSlipStateChange: (state?: { isOpen?: boolean }) => {
        // payload 非 { isOpen: boolean } 時僅記錄，不以 truthy object 猜狀態
        if (typeof state?.isOpen !== "boolean") {
          console.log("BetBy onBetSlipStateChange 非預期 payload:", state)
          return
        }
        isBetSlipOpen.value = state.isOpen
        if (!state.isOpen) {
          closeInFlight.value = false
        }
      },
      onRecharge: () => showNotification(t("common.alarm.insufficientBalance")),
    })
  }

  /**
   * 以 SDK public API 隱藏／恢復 H5 投注單：
   * 先以 hideMobileClosedBetslip 切換收合 launcher/bar 的可見性，
   * hidden === true 且面板為展開時，才 guarded 呼叫一次 toggleBetSlip 收合；
   * hidden === false 只恢復 launcher，不主動展開投注單。
   */
  const setBetSlipHidden = (hidden: boolean) => {
    if (!btInstance.value) return

    btInstance.value.updateOptions({ hideMobileClosedBetslip: hidden })

    if (!hidden || !isBetSlipOpen.value || closeInFlight.value) return

    closeInFlight.value = true
    try {
      const result = btInstance.value.action("toggleBetSlip")
      if (result && typeof result.catch === "function") {
        result.catch((error: unknown) => {
          closeInFlight.value = false
          console.error("BetBy toggleBetSlip 失敗:", error)
        })
      }
    } catch (error) {
      closeInFlight.value = false
      console.error("BetBy toggleBetSlip 失敗:", error)
    }
  }

  // 清理 BetBy Renderer
  const cleanupBetByRenderer = () => {
    if (btInstance.value) {
      btInstance.value.kill()
      btInstance.value = null
    }
    resetBetSlipState()
  }

  // 獲取可用幣別（統一處理登入和未登入）
  const resolveCurrency = async (product_code: number, currency?: string | null): Promise<string> => {
    if (isLogin.value) {
      const resolved = currency || activeWalletCurrencyCode.value
      console.log("已登入，使用幣別:", resolved)
      if (!resolved) {
        showNotification(t("common.alarm.pleaseUseCurrency"))
        throw new Error("No currency available")
      }
      return resolved
    }

    // 未登入：取得可用幣別
    if (currency) return currency

    try {
      const params: Request.ProductAvailableCurrency = {
        product_code: product_code.toString(),
        game_type: "SPORT_BOOK",
      }
      const result = await useApi(getProductAvailableCurrency, params)
      if (result.data && result.data.length > 0) {
        return result.data[0].code
      }
      throw new Error("No available currency")
    } catch (error) {
      console.error("取得可用幣別失敗:", error)
      showNotification(t("common.alarm.pleaseUseCurrency"))
      throw error
    }
  }

  /**
   * 調用 launch API 並解析出 token 和 brandId
   */
  const fetchGameUrlAndToken = async (
    product_code: number,
    game_code: string,
    game_type_id: number,
    currency: string | null | undefined,
    lang: number | undefined
  ): Promise<{ gameUrl: string; token: string | null; brandId: string }> => {
    // 取得幣別
    const currentCurrency = await resolveCurrency(product_code, currency)

    const payload: Request.LaunchGuestGame = {
      game_code,
      product_code,
      game_type_id,
      platform: isMobile.value ? PLATFORM_TYPE.Enums.mobile : PLATFORM_TYPE.Enums.web,
      currency: currentCurrency,
      language_code: lang ?? LANGUAGE_CODE.Enums[nowLang.value as keyof typeof LANGUAGE_CODE.Enums],
      wallet_type: isLogin.value ? activeWalletType.value ?? WALLET_TYPE.Enums.Cash : WALLET_TYPE.Enums.Cash,
      integration_id: 1,
      is_v2: true,
    }

    const { code, data } = isLogin.value ? await useApi(launchGame, payload) : await useApi(launchGuestGame, payload)

    // 該遊戲目前不支援贈金錢包時，讓玩家選擇現金錢包後由 BetBy 重新掛載。
    switch (code) {
      case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_CURRENCY_NOT_SUPPORT:
        currencySupportDialog.openCurrencySupportDialog({
          currencies: data?.currencies,
          integrationId: 1,
          productCode: product_code,
          gameCode: game_code,
          walletType: isLogin.value ? payload.wallet_type : undefined,
          bonusSupport: data?.bonus_support ?? true,
          closeFunction: () => window.history.back(),
          reOpenGame: false,
        })
        throw new Error("Currency not supported")

      case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_WALLET_TYPE_DISABLE:
        if (isLogin.value) {
          currencySupportDialog.openCurrencySupportDialog({
            currencies: data?.currencies || currentCurrency,
            integrationId: 1,
            productCode: product_code,
            gameCode: game_code,
            walletType: WALLET_TYPE.Enums.Cash,
            allowedWalletTypes: [WALLET_TYPE.Enums.Cash],
            bonusSupport: false,
            isAllowSkip: false,
            reOpenGame: false,
          })
        }
        throw new Error("Wallet type disabled")

      case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_GSMD_OFFLINE:
        showNotification(`${t("error_message.P_LAUNCH_GAME_GSMD_OFFLINE")} (${code})`, "negative")
        throw new Error("Game offline")

      case ERROR_CODE_TYPE.Enums.SUCCESS:
        if (!data?.game_url) {
          throw new Error("Betby Game URL not found")
        }
        break

      default:
        throw new Error(`Launch game failed with code: ${code}`)
    }

    const gameUrl = data.game_url
    const { token, brandId } = parseBetByUrl(gameUrl)

    if (!brandId) {
      throw new Error("無法從遊戲 URL 解析出 brand_id")
    }

    console.log("解析 URL 成功 - brandId:", brandId, "token:", token ? "存在" : "不存在")

    return { gameUrl, token, brandId }
  }

  /**
   * 執行 launch game
   */
  const executeLaunch = async (
    product_code: number,
    game_code: string,
    game_type_id: number,
    currency: string | null | undefined,
    lang: number | undefined,
    skipScriptLoad: boolean
  ) => {
    try {
      $q.loading.show()
      isLoading.value = true

      // 重置原有狀態
      widgetUrl.value = ""
      betbyDom.value = null
      setGameTypeUsing(game_type_id)

      // 調用 API 並解析 token
      const { gameUrl, token, brandId } = await fetchGameUrlAndToken(
        product_code,
        game_code,
        game_type_id,
        currency,
        lang
      )

      // 設置遊戲 URL
      widgetUrl.value = gameUrl

      betbyDom.value = document.getElementById("betby-sportsbook")
      if (!betbyDom.value) {
        console.error("找不到 BetBy DOM 元素")
        return
      }

      // 設置 BTRenderer
      if (!skipScriptLoad || !window.BTRenderer) {
        await loadBetByScript()
      }
      await nextTick()

      // 安裝 BTRenderer
      setupBTRenderer(brandId, token)

      console.log("BetBy 遊戲啟動成功")
    } catch (error) {
      console.error("啟動 BetBy 遊戲失敗:", error)
      throw error
    } finally {
      isLoading.value = false
      $q.loading.hide()
    }
  }

  /**
   * BetBy 專用的 launchGame（初次啟動，需加載腳本）
   */
  const launchBetByGame = async (
    product_code: number,
    game_code = "",
    game_type_id: number,
    currency?: string | null,
    lang?: number
  ) => {
    await executeLaunch(product_code, game_code, game_type_id, currency, lang, false)
  }

  /**
   * 重新啟動 BetBy 遊戲（不重新加載腳本，但重新調用 API）
   */
  const relaunchBetByGame = async (
    product_code = 1244,
    game_code = "",
    game_type_id = GAME_TYPE.Enums.SPORTBOOK,
    currency?: string | null,
    lang?: number
  ) => {
    await executeLaunch(product_code, game_code, game_type_id, currency, lang, true)
  }

  /**
   * 在頁面進入時自動呼叫 BetBy 遊戲啟動
   * 使用固定的 BetBy 參數
   */
  const initBetByGame = async () => {
    await launchBetByGame(1244, "", GAME_TYPE.Enums.SPORTBOOK)
  }

  return {
    isLoading,
    widgetUrl,
    launchBetByGame,
    relaunchBetByGame,
    cleanupBetByRenderer,
    initBetByGame,
    isBetSlipOpen,
    setBetSlipHidden,
  }
}
