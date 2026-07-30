import { computed } from "vue"
import { useRouter } from "#imports"
import { getTelegramOAuthUrl } from "@shared-lib/api/apiFunctions/auth_getTelegramOAuthUrl"
import { tgWebAppLogin, type TgWebAppLoginParamsType } from "@shared-lib/api/apiFunctions/auth_tgWebAppLogin"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import { useSetting } from "@shared-lib/api/hooks/useSetting"
import { ROUTE_PATH } from "@shared-lib/constants/routePath"

type RecordString = Record<string, string>

export function useTelegramMiniApp() {
  const router = useRouter()

  const { setting: isTelegramEnabledSetting } = useSetting<boolean>({
    selector: (setting) => (setting.sso_telegram_oauth_enabled ?? 0) === 1
  })

  const telegramOAuthMutation = useApiMutation(getTelegramOAuthUrl)
  const telegramMiniAppMutation = useApiMutation(tgWebAppLogin)

  const isTelegramLoginEnabled = computed(() => Boolean(isTelegramEnabledSetting.value))
  const isLoading = computed(() => telegramOAuthMutation.isPending.value || telegramMiniAppMutation.isPending.value)
  const isTelegramMiniApp = computed(() => {
    if (typeof window === "undefined") return false
    return Boolean((window as any)?.Telegram?.WebApp)
  })

  const parseQueryParams = (queryString: string): RecordString => {
    if (!queryString) return {}

    try {
      if (queryString.includes("__")) {
        return queryString.split("__").reduce((result, item) => {
          const [key, value] = item.split("=")

          if (key && value) {
            result[key] = value
          }

          return result
        }, {} as RecordString)
      }

      const searchParams = new URLSearchParams(queryString)
      const result: RecordString = {}

      searchParams.forEach((value, key) => {
        result[key] = value
      })

      return result
    } catch {
      return {}
    }
  }

  const handleTelegramWebLogin = async () => {
    if (!isTelegramLoginEnabled.value || isLoading.value) return

    const redirectUri = window.location.href
    const response = await telegramOAuthMutation.mutateAsync({ redirect_url: redirectUri })
    const authUrl = response.data?.auth_url

    if (authUrl) {
      window.location.href = authUrl
    }
  }

  const handleMiniAppLogin = async () => {
    if (!isTelegramLoginEnabled.value || isLoading.value || typeof window === "undefined") return false

    const webApp = (window as any)?.Telegram?.WebApp
    const initDataRaw = webApp?.initData
    const initData = webApp?.initDataUnsafe
    const user = initData?.user

    if (!webApp || !initDataRaw || !initData || !user || !initData?.hash) return false

    const payload: TgWebAppLoginParamsType = {
      serial_code: initDataRaw,
      user: {
        id: Number(user.id),
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        username: user.username ?? "",
        language_code: user.language_code ?? "",
        allows_write_to_pm: Boolean(user.allows_write_to_pm)
      },
      chat_instance: String(initData.chat_instance ?? ""),
      chat_type: String(initData.chat_type ?? ""),
      auth_date: String(initData.auth_date ?? ""),
      hash: String(initData.hash)
    }

    const response = await telegramMiniAppMutation.mutateAsync(payload)
    const launchUrl = response.data?.launch_url

    if (!launchUrl) return false

    const url = new URL(launchUrl, window.location.origin)
    const mergedQuery: RecordString = Object.fromEntries(url.searchParams.entries())
    const startParam = String(initData.start_param ?? "")

    Object.assign(mergedQuery, parseQueryParams(startParam))

    await router.replace({
      path: ROUTE_PATH.HOME,
      query: mergedQuery
    })

    return true
  }

  return {
    isLoading,
    isTelegramMiniApp,
    isTelegramLoginEnabled,
    handleTelegramWebLogin,
    handleMiniAppLogin
  }
}
