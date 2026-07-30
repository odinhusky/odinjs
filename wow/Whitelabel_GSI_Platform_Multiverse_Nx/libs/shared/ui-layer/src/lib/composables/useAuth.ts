import { useAuthStore } from "@shared-lib/stores/auth"
import { usePinia } from "#imports"

export const useAuth = () => {
  const authStore = useAuthStore(usePinia())

  return {
    get access_token() {
      return authStore.token ?? ""
    },
    setAccessToken: (token: string) => {
      authStore.setToken(token)
    },
    reset: () => {
      authStore.clearAuth()
    }
  }
}
