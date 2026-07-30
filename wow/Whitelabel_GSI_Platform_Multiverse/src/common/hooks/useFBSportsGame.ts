import { useQuasar } from "quasar"
import { getProductAvailableCurrency, launchGame, launchGuestGame } from "src/api/game"
import type * as Request from "src/api/request.type"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useApi } from "src/common/hooks/useApi"
import { useAuth } from "src/common/hooks/useAuth"
import { useFBSportsColor } from "src/common/hooks/useFBSportsColor"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { ERROR_CODE_TYPE, GAME_TYPE, LANGUAGE_CODE, PLATFORM_TYPE, WALLET_TYPE } from "src/common/utils/constants"
import {
  applyFBSportsGuestOptions,
  FB_SPORTS_PRODUCT_CODE,
  resolveFBSportsUrl,
} from "src/common/utils/fbSportsLaunch"
import { useGameDialogStore } from "src/stores/gameDialogStore"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"

export function useFBSportsGame() {
  const $q = useQuasar()
  const { t } = useI18n()
  const { isLogin } = useAuth()
  const { activeWalletCurrencyCode, activeWalletType } = useUserInfo()
  const { nowLang } = useLanguage()
  const { isMobile, isLargeTablet } = useMediaQuery()
  const { setGameTypeUsing } = useGameTypeStore()
  const { applyDefaultColor } = useFBSportsColor()
  const { currencySupportDialog } = useGameDialogStore()

  const isLoading = ref(false)
  const widgetUrl = ref("")
  const useH5Platform = computed(() => isMobile.value || isLargeTablet.value)

  const getAvailableCurrency = async (productCode: string, gameType: string): Promise<string> => {
    const result = await useApi(getProductAvailableCurrency, {
      product_code: productCode,
      game_type: gameType,
    })

    if (result.data?.length) {
      return result.data[0].code
    }

    throw new Error("No available currency")
  }

  const notifyCurrencyRequired = () => {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: t("common.alarm.pleaseUseCurrency"),
      badgeStyle: "opacity: 0",
    })
  }

  const launchFBSportsGame = async (currency?: string | null, lang?: number) => {
    const integration_id = 1
    const product_code = FB_SPORTS_PRODUCT_CODE
    const game_code = ""
    const game_type_id = GAME_TYPE.Enums.SPORTBOOK
    let currentCurrency = currency

    if (isLogin.value) {
      currentCurrency = currentCurrency || activeWalletCurrencyCode.value
    } else if (!currentCurrency) {
      try {
        currentCurrency = await getAvailableCurrency(product_code.toString(), "SPORT_BOOK")
      } catch (error) {
        console.log("取得 FB Sports 可用幣別失敗:", error)
        notifyCurrencyRequired()
        return
      }
    }

    if (!currentCurrency) {
      notifyCurrencyRequired()
      return
    }

    try {
      $q.loading.show()
      isLoading.value = true
      widgetUrl.value = ""
      setGameTypeUsing(game_type_id)

      const basePayload: Request.LaunchGuestGame = {
        game_code,
        product_code,
        game_type_id,
        platform: useH5Platform.value ? PLATFORM_TYPE.Enums.mobile : PLATFORM_TYPE.Enums.web,
        currency: currentCurrency,
        language_code: lang ?? LANGUAGE_CODE.Enums[nowLang.value as keyof typeof LANGUAGE_CODE.Enums],
        wallet_type: isLogin.value ? activeWalletType.value ?? WALLET_TYPE.Enums.Cash : WALLET_TYPE.Enums.Cash,
        integration_id,
        is_v2: true,
      }
      const { code, data } = isLogin.value
        ? await useApi(launchGame, basePayload)
        : await useApi(launchGuestGame, basePayload)

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
        case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_WALLET_TYPE_DISABLE:
          if (isLogin.value) {
            currencySupportDialog.openCurrencySupportDialog({
              currencies: data?.currencies || currentCurrency,
              integrationId: integration_id,
              productCode: product_code,
              gameCode: game_code,
              walletType: WALLET_TYPE.Enums.Cash,
              allowedWalletTypes: [WALLET_TYPE.Enums.Cash],
              bonusSupport: false,
              isAllowSkip: false,
              reOpenGame: false,
            })
          }
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
          {
            const launchUrl = resolveFBSportsUrl(data)
            // 初次進入強制覆蓋色系，不保留供應商記住的前次選擇
            const resolvedUrl = applyDefaultColor(launchUrl, true)
            widgetUrl.value = isLogin.value ? resolvedUrl : applyFBSportsGuestOptions(resolvedUrl)
          }
          break
      }
    } catch (error) {
      console.log("啟動 FB Sports 失敗:", error)
      throw error
    } finally {
      isLoading.value = false
      $q.loading.hide()
    }
  }

  const initFBSportsGame = async () => {
    await launchFBSportsGame()
  }

  return {
    isLoading,
    widgetUrl,
    launchFBSportsGame,
    initFBSportsGame,
  }
}
