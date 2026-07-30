import { ref, computed } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useEnvInfoStore } from "src/stores/envStore"
import { getGoogleOAuthUrl } from "src/api/login"
import { useApi } from "src/common/hooks/useApi"

export function useGoogleOAuth() {
  const $q = useQuasar()
  const { t } = useI18n()
  const envStore = useEnvInfoStore()

  const isLoading = ref(false)

  // 檢查是否有啟用 Google OAuth
  const isGoogleOAuthEnabled = computed(() => envStore.envInfo.sso_google_oauth_enabled === 1)

  /**
   * 執行 Google OAuth 登入
   * 1. 呼叫後端 API 取得 OAuth URL
   * 2. 取得連結後跳轉到該連結
   */
  const handleGoogleLogin = async () => {
    try {
      isLoading.value = true

      // 呼叫後端取得 Google OAuth URL，帶入當前網址作為 redirect_url
      const redirectUri = window.location.href
      const { status, data } = await useApi(getGoogleOAuthUrl, { redirect_url: redirectUri })

      if (status && data.auth_url) {
        // 跳轉到 Google OAuth 頁面
        window.location.href = data.auth_url
      }
    } catch (error) {
      console.error("[Google OAuth Error]:", error)
      $q.notify({
        type: "negative",
        message: t("error_message.googleOAuthNotConfigured") || "Google login failed",
        position: "top"
      })
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    isGoogleOAuthEnabled,
    handleGoogleLogin
  }
}
