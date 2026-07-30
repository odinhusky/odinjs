import * as ERROR_CODE_TYPE from "@shared-lib/constants/enums/errorCodeTypes"
import { toGameLobbyRoute } from "@shared-lib/constants/routePath"
import type { LaunchGameParamsType } from "@shared-lib/api/apiFunctions/game_launchGame"
import { useLaunchGame } from "@shared-lib/api/hooks/useLaunchGame"
import { OPEN_GAME_MODE_ENUMS } from "@shared-lib/constants/enums/openGameMode"
import { WALLET_TYPE_ENUMS, WALLET_TYPE_I18N_KEYS } from "@shared-lib/constants/enums/walletType"
import { useAlertDialog } from "./useAlertDialog"
import { useRequireLogin } from "./useRequireLogin"
import {
  buildGameWalletGroups,
  resolveDefaultSelection,
  useGameWalletSelectDialog
} from "./useGameWalletSelectDialog"

interface CustomGameOpenConfig {
  product_code?: number
  game_code?: string
  game_type_id?: number
  openMethod: OPEN_GAME_MODE_ENUMS
  routePath?: string
}

const CUSTOM_GAME_OPEN_LIST: CustomGameOpenConfig[] = [
  { product_code: 1049, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1164, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_NEW_TAB },
  { product_code: 1166, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1167, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1168, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1169, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1174, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1175, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1176, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1177, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1199, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1200, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1201, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1202, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1216, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1217, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1218, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1219, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF },
  { product_code: 1228, openMethod: OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF }
]

const resolveLanguageCode = (locale: string) => {
  const normalized = (locale || "").toLowerCase()
  if (normalized.startsWith("zh")) return 1
  if (normalized.startsWith("en")) return 2
  if (normalized.startsWith("vi")) return 3
  return 1
}

export const useOpenGame = () => {
  const route = useRoute()
  const router = useRouter()
  const { locale, t } = useI18n()
  const { ensureLoggedIn } = useRequireLogin()
  const { pushToast } = useToastQueue()
  const { openAlertDialog } = useAlertDialog()
  const { openGameWalletSelectDialog } = useGameWalletSelectDialog()
  const { selectedWallet, walletList } = useCurrencyInfo()
  const { launch: launchGame } = useLaunchGame()

  const isMobileClient = () => {
    if (!process.client) return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)
  }

  const openNewTabTarget = (target: string) => {
    if (!process.client || !target) return false
    const popup = window.open(target, "_blank", "menubar=no,toolbar=no,noreferrer=no")
    return Boolean(popup)
  }

  const openGameDialogLike = (gameUrl: string, gameContent: string, pup = false) => {
    const target = gameUrl || gameContent
    if (!process.client || !target) return false

    if (pup) {
      return openNewTabTarget(target)
    }

    if (gameUrl) {
      window.location.href = gameUrl
      return true
    }

    const popup = window.open("", "_blank", "noopener,noreferrer")
    if (!popup) return false
    popup.document.open()
    popup.document.write(gameContent)
    popup.document.close()
    return true
  }

  const customGameOpenMethod = (payload: LaunchGameParamsType) => {
    const match = CUSTOM_GAME_OPEN_LIST.find((config) => {
      return Object.entries(config).every(([key, value]) => {
        if (key === "openMethod" || key === "routePath") return true
        return payload[key as keyof LaunchGameParamsType] === value
      })
    })

    if (!match) {
      return {
        openMethod: OPEN_GAME_MODE_ENUMS.DEFAULT,
        routePath: ""
      }
    }

    return {
      openMethod: match.openMethod,
      routePath: String(match.routePath || "")
    }
  }

  const openGame = async (
    integrationId: number,
    productCode: number,
    gameCode = "",
    typeId: number,
    pup = false,
    lang?: number,
    currency?: string,
    walletType?: WALLET_TYPE_ENUMS
  ) => {
    const currentCurrency = String(currency || selectedWallet.value?.currency_code || "")
    const payload = buildLaunchGamePayload({
      integrationId,
      productCode,
      typeId,
      gameCode,
      currency: currentCurrency,
      languageCode: typeof lang === "number" ? lang : resolveLanguageCode(String(locale.value || "")),
      walletType
    })

    const gameOpenMethodCondition = customGameOpenMethod(payload)

    if (
      gameOpenMethodCondition.openMethod === OPEN_GAME_MODE_ENUMS.FORCE_USE_ROUTE &&
      gameOpenMethodCondition.routePath
    ) {
      const toRoute = router.resolve(gameOpenMethodCondition.routePath)
      if (toRoute && !toRoute.meta?.needAuth) {
        if (route.path !== gameOpenMethodCondition.routePath) {
          await navigateTo(gameOpenMethodCondition.routePath)
        }
        return
      }
    }

    const isLoggedIn = await ensureLoggedIn({
      redirectPath: String(route.fullPath || toGameLobbyRoute(typeId, productCode))
    })
    if (!isLoggedIn) {
      return
    }

    if (!currentCurrency) {
      pushToast({
        severity: TOAST_SEVERITY_ENUMS.ERROR,
        summary: "Currency Required",
        detail: "請先選擇幣別",
        life: 2500
      })
      return
    }

    const response = await launchGame(payload)

    switch (response.code) {
      case ERROR_CODE_TYPE.Enums.P_USER_PREFERENCES_EXCLUSION:
        openAlertDialog({
          title: "Notice",
          message: "exclusionPeriodCannotPlayGame",
          confirmText: "OK"
        })
        return

      case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_COLLECTION_AMOUNT_MEET_LIMIT:
        openAlertDialog({
          title: "Notice",
          message: "CumulativeBettingAmountReachedMaximum",
          confirmText: "OK"
        })
        return

      case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_CURRENCY_NOT_SUPPORT: {
        const currencies = Array.isArray(response.data?.currencies) ? response.data.currencies : []
        if (!currencies.length) {
          pushToast({
            severity: TOAST_SEVERITY_ENUMS.ERROR,
            summary: "Game Launch Failed",
            detail: response.msg || "Currency is not supported",
            life: 2200
          })
          return
        }

        const groups = buildGameWalletGroups(
          currencies.map((item) => String(item)),
          walletList.value,
          (wt) => t(WALLET_TYPE_I18N_KEYS[wt] || "")
        )

        if (!groups.length) {
          pushToast({
            severity: TOAST_SEVERITY_ENUMS.ERROR,
            summary: "Game Launch Failed",
            detail: response.msg || "No matching wallet for supported currencies",
            life: 2200
          })
          return
        }

        const defaultSelection = resolveDefaultSelection(
          groups,
          String(selectedWallet.value?.currency_code || "")
        )

        openGameWalletSelectDialog({
          title: "轉出贈金錢包",
          message: "此款遊戲僅支援下列幣別投注，請選擇要優先投注的幣別",
          confirmText: "立刻遊玩",
          cancelText: "取消",
          groups,
          defaultSelection,
          onConfirm: async (selection) => {
            await openGame(
              integrationId,
              productCode,
              gameCode,
              typeId,
              pup,
              lang,
              selection.currencyCode,
              selection.walletType
            )
          }
        })
        return
      }

      case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_GSMD_OFFLINE:
        pushToast({
          severity: TOAST_SEVERITY_ENUMS.ERROR,
          summary: "System Maintenance",
          detail: `${response.msg || "Service unavailable"} (${response.code})`,
          life: 2200
        })
        return

      case ERROR_CODE_TYPE.Enums.SUCCESS: {
        const game_url = String(response.data?.game_url || "")
        const game_content = String(response.data?.game_content || "")
        const gameTarget = game_url || game_content

        switch (gameOpenMethodCondition.openMethod) {
          // 強制以「遊戲彈窗 + iframe」開啟遊戲
          case OPEN_GAME_MODE_ENUMS.FORCE_USE_GAME_DIALOG: {
            const opened = openGameDialogLike(game_url, game_content, pup)
            if (!opened) {
              console.error("[openGame] missing game target in FORCE_USE_GAME_DIALOG", {
                payload,
                data: response.data,
                code: response.code,
                msg: response.msg
              })
            }
            return
          }

          // 強制以「另開新分頁」開啟遊戲
          // Digitain 特殊處理：手機版使用 Asian View 頁面
          case OPEN_GAME_MODE_ENUMS.FORCE_USE_NEW_TAB:
            // 手機版 Digitain 跳轉到 Asian View 頁面
            if (payload.product_code === 1164 && isMobileClient() && gameOpenMethodCondition.routePath) {
              if (route.path !== gameOpenMethodCondition.routePath) {
                await navigateTo(gameOpenMethodCondition.routePath)
              }
              return
            }

            if (!gameTarget || !openNewTabTarget(gameTarget)) {
              console.error("[openGame] missing game target in FORCE_USE_NEW_TAB", {
                payload,
                data: response.data,
                code: response.code,
                msg: response.msg
              })
            }
            return

          // 強制以「本頁跳轉」開啟遊戲
          case OPEN_GAME_MODE_ENUMS.FORCE_USE_HREF:
            if (process.client && gameTarget) {
              window.location.href = gameTarget
            } else {
              console.error("[openGame] missing game target in FORCE_USE_HREF", {
                payload,
                data: response.data,
                code: response.code,
                msg: response.msg
              })
            }
            return

          // 強制以「找對應的route name」開啟遊戲
          case OPEN_GAME_MODE_ENUMS.FORCE_USE_ROUTE:
            // 若當前非 gameOpenMethodCondition.routeName 頁面，則前往
            if (gameOpenMethodCondition.routePath && route.path !== gameOpenMethodCondition.routePath) {
              await navigateTo(gameOpenMethodCondition.routePath)
            }
            return

          default:
            // 跑預設開啟遊戲方式的邏輯
            if (!game_url && !game_content) {
              console.error("[openGame] both game_url and game_content are empty", {
                payload,
                data: response.data,
                code: response.code,
                msg: response.msg
              })
              await navigateTo(toGameLobbyRoute(typeId, productCode))
              return
            }

            if (game_url) {
              if (isMobileClient() && !game_url.startsWith("http://")) {
                const openedInDialog = openGameDialogLike(game_url, game_content, pup)
                if (!openedInDialog) {
                  console.error("[openGame] failed to open mobile dialog target", {
                    payload,
                    data: response.data,
                    code: response.code,
                    msg: response.msg
                  })
                }
              } else {
                openNewTabTarget(game_url)
              }
            }

            if (game_content) {
              openGameDialogLike(game_url, game_content, pup)
            }
            return
        }
      }

      default:
        pushToast({
          severity: TOAST_SEVERITY_ENUMS.ERROR,
          summary: "Game Launch Failed",
          detail: response.msg || `Error code: ${String(response.code)}`,
          life: 2200
        })
        return
    }
  }

  return {
    openGame
  }
}
