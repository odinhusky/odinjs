import { ref, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { launchGame, launchGuestGame, getProductAvailableCurrency } from "src/api/game"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useApi } from "src/common/hooks/useApi"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnvInfoStore } from "src/stores/envStore"
import { useGameDialogStore } from "src/stores/gameDialogStore"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_CODE, PLATFORM_TYPE, GAME_TYPE, ERROR_CODE_TYPE, WALLET_TYPE } from "src/common/utils/constants"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import type * as Request from "src/api/request.type"

export function useLuckyGame() {
  const $q = useQuasar()
  const { t } = useI18n()
  const { isLogin } = useAuth()
  const { activeWalletCurrencyCode, activeWalletType } = useUserInfo()
  const { envInfo } = useEnvInfoStore()
  const { nowLang } = useLanguage()
  const { isMobile, isLargeTablet } = useMediaQuery()
  const { setGameTypeUsing } = useGameTypeStore()
  const { currencySupportDialog } = useGameDialogStore()

  const isLoading = ref(false)
  const widgetUrl = ref<string>()

  function parseDataFromHtml(htmlContent: string | undefined, key: string): string | null {
    if (!htmlContent) return null

    // 解析 new LuckySports().init() 的參數
    const initRegex = /new\s+LuckySports\(\)\.init\s*\(\s*(\{[\s\S]*?\})\s*\)/
    const initMatch = htmlContent.match(initRegex)

    if (!initMatch) return null

    try {
      const initObjectString = initMatch[1]

      // 匹配字符串值（單引號或雙引號）
      const stringRegex = new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`)
      const stringMatch = initObjectString.match(stringRegex)

      return stringMatch ? stringMatch[1] : null
    } catch (error) {
      console.error("解析 LuckySports init 參數失敗:", error)
      return null
    }
  }

  /**
   * Lucky 專用的 launchGame
   */
  const launchLuckyGame = async (
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

    try {
      $q.loading.show()
      isLoading.value = true

      // 清空之前的 URL
      widgetUrl.value = ""
      setGameTypeUsing(game_type_id)

      const basePayload: Request.LaunchGuestGame = {
        game_code,
        product_code,
        game_type_id,
        platform: isMobile.value ? PLATFORM_TYPE.Enums.mobile : PLATFORM_TYPE.Enums.web,
        currency: currentCurrency ?? "",
        language_code: lang ?? LANGUAGE_CODE.Enums[nowLang.value as keyof typeof LANGUAGE_CODE.Enums],
        wallet_type: isLogin.value ? activeWalletType.value ?? WALLET_TYPE.Enums.Cash : WALLET_TYPE.Enums.Cash,
        integration_id,
        is_v2: true,
      }
      const { code, status, data } = isLogin.value
        ? await useApi(launchGame, basePayload)
        : await useApi(launchGuestGame, basePayload)
      const gameContent: string | undefined = data?.game_content

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
          // 從 game_content 的 HTML 原始碼中提取 token 出來
          const accessToken = parseDataFromHtml(gameContent, "token")
          if (accessToken) {
            widgetUrl.value = `https://sprodm.uni247.xyz/?access_token=${accessToken}`
          }
          isLoading.value = false
          break
      }
    } catch (error) {
      console.log("啟動 Lucky 遊戲失敗:", error)
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
   * 在頁面進入時自動呼叫 Lucky 遊戲啟動
   * 使用固定的 Lucky 參數
   */
  const initLuckyGame = async () => {
    const PRODUCT_CODE = 1270 // Lucky 代碼

    try {
      await launchLuckyGame(PRODUCT_CODE, "", GAME_TYPE.Enums.SPORTBOOK)
    } catch (error) {
      console.log("初始化 Lucky 遊戲失敗:", error)
      throw error
    }
  }

  return {
    /** 是否正在載入 */
    isLoading,

    /** Lucky 專區使用的 iframe */
    launchLuckyGame,
    widgetUrl,

    /** 初始化 Lucky 遊戲 */
    initLuckyGame,
  }
}
