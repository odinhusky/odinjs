import { computed } from "vue"
import { getGoogleOAuthUrl } from "@shared-lib/api/apiFunctions/auth_getGoogleOAuthUrl"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import { useSetting } from "@shared-lib/api/hooks/useSetting"

export function useGoogleOAuth() {
  const { setting: isGoogleOAuthEnabledSetting } = useSetting<boolean>({
    selector: (setting) => (setting.sso_google_oauth_enabled ?? 0) === 1
  })

  const oauthMutation = useApiMutation(getGoogleOAuthUrl)

  const isGoogleOAuthEnabled = computed(() => Boolean(isGoogleOAuthEnabledSetting.value))
  const isLoading = computed(() => oauthMutation.isPending.value)

  const handleGoogleLogin = async () => {
    if (!isGoogleOAuthEnabled.value || isLoading.value) return

    const redirectUri = window.location.href
    const response = await oauthMutation.mutateAsync({ redirect_url: redirectUri })
    const authUrl = response.data?.auth_url

    if (authUrl) {
      window.location.href = authUrl
    }
  }

  return {
    isLoading,
    isGoogleOAuthEnabled,
    handleGoogleLogin
  }
}
