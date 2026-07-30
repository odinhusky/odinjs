import { ref, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { launchGame, launchGuestGame, getProductAvailableCurrency } from "src/api/game"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useApi, type UseApiReturnType } from "src/common/hooks/useApi"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnvInfoStore } from "src/stores/envStore"
import { useGameDialogStore } from "src/stores/gameDialogStore"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_CODE, ERROR_CODE_TYPE, GAME_TYPE, WALLET_TYPE } from "src/common/utils/constants"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import type { SabaEvent, SabaEventCallback } from "src/types/sabaEvent"

export function useSabaGame() {
  const $q = useQuasar()
  const { t } = useI18n()
  const { isLogin } = useAuth()
  const { activeWalletCurrencyCode, activeWalletType } = useUserInfo()
  const { envInfo } = useEnvInfoStore()
  const { nowLang } = useLanguage()
  const { isLargeTablet } = useMediaQuery()
  const { currencySupportDialog } = useGameDialogStore()

  const isLoading = ref(false)
  const widgetUrls = ref<string[]>([])
  const eventCallbacks = ref<SabaEventCallback[]>([])

  // 處理 Saba 事件
  const handleSabaEvent = (event: SabaEvent, sourceFrame?: MessageEventSource | null) => {
    switch (event.eventCode) {
      case "R001":
      case "R001_2":
      case "R001_3":
        console.log(`用戶登入後點擊事件 ${event.eventCode}:`, event)
        if (event.redirectUrl && sourceFrame) {
          ;(sourceFrame as Window).location.href = event.redirectUrl
        }
        break

      case "U001":
        // 用戶未儲值
        console.log("用戶未儲值:", event)
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: t("common.alarm.pleaseTopUp"),
          badgeStyle: "opacity: 0",
        })
        break

      case "U002":
        // 用戶餘額不足
        console.log("用戶餘額不足:", event)
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: t("common.alarm.insufficientBalance"),
          badgeStyle: "opacity: 0",
        })
        break

      case "U003":
      case "U003_2":
      case "U003_3":
        console.log("用戶未登入:", event)
        // 用戶未登入
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: t("common.alarm.pleaseLogin"),
          badgeStyle: "opacity: 0",
        })
        break

      case "S001":
        // Record iframe size
        console.log("S001 事件 - iframe 尺寸調整:", event.size)
        break

      default:
        break
    }
  }

  const onSabaEvent = (callback: SabaEventCallback) => {
    eventCallbacks.value.push(callback)

    return () => {
      const index = eventCallbacks.value.indexOf(callback)
      if (index > -1) {
        eventCallbacks.value.splice(index, 1)
      }
    }
  }

  const clearSabaEventCallbacks = () => {
    eventCallbacks.value = []
  }

  onUnmounted(() => {
    clearSabaEventCallbacks()
  })

  // postMessage 事件監聽
  const processSabaMessage = (event: MessageEvent) => {
    try {
      const data = event.data as SabaEvent

      if (!data || typeof data !== "object" || !data.eventCode) {
        return
      }

      eventCallbacks.value.forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.log("Saba event callback error:", error)
        }
      })

      // 處理內建事件邏輯
      handleSabaEvent(data, event.source)
    } catch (error) {
      console.log("處理 Saba 訊息時發生錯誤:", error)
    }
  }

  // 解析 saba_widget_id（處理後端回傳的 JSON 字串）
  const parseSabaWidgetId = (): { classic_id?: string; card_id?: string; DynamicCards?: string } => {
    try {
      if (typeof envInfo.saba_widget_id === "string") {
        return JSON.parse(envInfo.saba_widget_id)
      } else if (envInfo.saba_widget_id && typeof envInfo.saba_widget_id === "object") {
        return envInfo.saba_widget_id as any
      }
    } catch (error) {
      console.log("解析 saba_widget_id 失敗:", error)
    }
    return {}
  }

  function launchGameInterceptor(
    payload: Request.LaunchGame | Request.LaunchGuestGame,
    response: UseApiReturnType<Response.LaunchGame>,
    integration_id: number
  ) {
    switch (response.code) {
      case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_CURRENCY_NOT_SUPPORT:
        currencySupportDialog.openCurrencySupportDialog({
          currencies: response.data?.currencies,
          integrationId: integration_id,
          productCode: payload.product_code,
          gameCode: payload.game_code,
          walletType: "wallet_type" in payload ? payload.wallet_type : undefined,
          bonusSupport: response.data?.bonus_support ?? true,
          closeFunction: () => {
            window.history.back()
          },
          reOpenGame: false,
        })

        return { keepContinue: false }
      case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_GSMD_OFFLINE:
        $q.notify({
          type: "negative",
          position: "top",
          message: `${t("error_message.P_LAUNCH_GAME_GSMD_OFFLINE")} (${response.code})`,
          icon: "warning",
          timeout: 1000,
        })
        return { keepContinue: false }
      case ERROR_CODE_TYPE.Enums.SUCCESS:
        return { keepContinue: true }
      default:
        return { keepContinue: false }
    }
  }

  /**
   * Saba 專用的 launchGame 呼叫
   * 需要呼叫兩次 API：
   * 1. 第一次：platform = 'widget'
   *   1.1 檢查是否為手機版或平板，isLargeTablet.value = true 則 widget_id 使用預設不用傳
   *   1.2 反之，則為 PC 版，widget_id 使用 envInfo.saba_widget_id.DynamicCards
   * 2. 第二次固定為經典式：platform = 'widget'，傳 widget_id = envInfo.saba_widget_id.classic_id
   */
  const launchSabaGame = async (
    product_code: number,
    game_code = "",
    game_type_id: number,
    currency?: string | null,
    lang?: number
  ) => {
    const integration_id = 1
    const game_type = "SPORT_BOOK"

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
          currentCurrency = await getAvailableCurrency(product_code.toString(), game_type)
        } catch (error) {
          console.log("取得可用幣別失敗:", error)
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

    // 解析 saba_widget_id（後端回傳 JSON 字串，需要前端自己解析）
    const parsedWidgetId = parseSabaWidgetId()

    const basePayload: Request.LaunchGuestGame = {
      game_code,
      product_code,
      game_type_id,
      platform: "widget" as string, // 強制使用 'widget'
      currency: currentCurrency ?? "",
      language_code: lang ?? LANGUAGE_CODE.Enums[nowLang.value as keyof typeof LANGUAGE_CODE.Enums],
      wallet_type: isLogin.value ? activeWalletType.value ?? WALLET_TYPE.Enums.Cash : WALLET_TYPE.Enums.Cash,
      widget_id: parsedWidgetId.card_id || "",
      integration_id,
      is_v2: true,
    }

    try {
      $q.loading.show()
      isLoading.value = true

      // 清空之前的 URLs
      widgetUrls.value = []

      // 第一次 call：根據設備類型決定 widget_id
      // 如果是大型平板或手機版，傳 widget_id = card_id(預設)
      // 如果是 PC 版，使用 DynamicCards
      let firstPayload: Request.LaunchGuestGame
      if (isLargeTablet.value) {
        // 大型平板/手機版：傳 widget_id = card_id(預設)
        firstPayload = { ...basePayload }
      } else {
        // PC 版：使用 DynamicCards
        firstPayload = {
          ...basePayload,
          widget_id: parsedWidgetId.DynamicCards || "",
        }
      }

      const firstResult = isLogin.value
        ? await useApi(launchGame, firstPayload)
        : await useApi(launchGuestGame, firstPayload)
      const firstUrl: string | undefined = firstResult.data?.game_url

      const { keepContinue: firstKeepContinue } = launchGameInterceptor(firstPayload, firstResult, integration_id)
      if (!firstKeepContinue) {
        return
      }
      widgetUrls.value.push(firstUrl)

      // 第二次 call：widget_id = classic_id(經典式)
      const secondPayload: Request.LaunchGuestGame = {
        ...basePayload,
        widget_id: parsedWidgetId.classic_id || "",
      }

      const secondResult = isLogin.value
        ? await useApi(launchGame, secondPayload)
        : await useApi(launchGuestGame, secondPayload)
      const secondUrl: string | undefined = secondResult.data?.game_url
      const { keepContinue: secondKeepContinue } = launchGameInterceptor(secondPayload, secondResult, integration_id)
      if (!secondKeepContinue) {
        return
      }
      widgetUrls.value.push(secondUrl)
      isLoading.value = false

      // 返回第二次呼叫的結果作為主要結果
      return secondResult
    } catch (error) {
      console.log("啟動 Saba 遊戲失敗:", error)
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

      // 統一拿陣列中的第一筆資料
      if (result.data && result.data.length > 0) {
        return result.data[0].code
      }

      throw new Error("No available currency")
    } catch (error) {
      throw error
    }
  }

  /**
   * 在頁面進入時自動呼叫 Saba 遊戲啟動
   * 使用固定的 Saba 參數
   */
  const initSabaGame = async () => {
    const SABA_PRODUCT_CODE = 1046 // Saba 代碼

    try {
      await launchSabaGame(SABA_PRODUCT_CODE, "", GAME_TYPE.Enums.SPORTBOOK)
    } catch (error) {
      console.log("初始化 Saba 遊戲失敗:", error)
      throw error
    }
  }

  return {
    /** 是否正在載入 */
    isLoading,

    /** Saba 專區使用的 iframe */
    launchSabaGame,
    widgetUrls,

    /** 初始化 Saba 遊戲 */
    initSabaGame,

    /** 事件監聽相關 */
    onSabaEvent,
    clearSabaEventCallbacks,
    processSabaMessage,
  }
}
