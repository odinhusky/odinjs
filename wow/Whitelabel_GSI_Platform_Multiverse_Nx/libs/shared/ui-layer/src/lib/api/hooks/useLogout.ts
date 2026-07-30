import { useNuxtApp } from "#imports"
import { logout as logoutApi, type LogoutResponseType } from "@shared-lib/api/apiFunctions/auth_logout"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import type { ApiResponse } from "@shared-lib/api/types"
import { useAuthStore } from "@shared-lib/stores/auth"
import { useUserProfileStore } from "@shared-lib/stores/userProfile"
import { useWalletStore } from "@shared-lib/stores/wallet"
import { useFavoriteGameStore } from "@shared-lib/stores/favoriteGame"
import { useGiftStore } from "@shared-lib/stores/gift"
import { ROUTE_PATH } from "@shared-lib/constants/routePath"
import {
  TANSTACK_QUERY_KEY_USER_WALLET_LIST,
  TANSTACK_QUERY_KEY_ACCOUNT_INFO,
  TANSTACK_QUERY_KEY_FAVORITE_GAME_LIST,
  TANSTACK_QUERY_KEY_GIFT_LIST
} from "@shared-lib/constants/tanstackQueryKeys"

export interface UseLogoutOptionsType {
  onSuccess?: (response: ApiResponse<LogoutResponseType>) => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useLogout(options: UseLogoutOptionsType = {}) {
  const { $queryClient } = useNuxtApp()
  const authStore = useAuthStore()
  const userProfileStore = useUserProfileStore()
  const walletStore = useWalletStore()
  const favoriteGameStore = useFavoriteGameStore()
  const giftStore = useGiftStore()

  const clearLocalState = () => {
    authStore.clearAuth()
    userProfileStore.clearProfile()
    walletStore.clearWalletList()
    favoriteGameStore.clearFavoriteGameList()
    giftStore.clearGiftList()

    $queryClient.removeQueries({ queryKey: [TANSTACK_QUERY_KEY_USER_WALLET_LIST] })
    $queryClient.removeQueries({ queryKey: [TANSTACK_QUERY_KEY_ACCOUNT_INFO] })
    $queryClient.removeQueries({ queryKey: [TANSTACK_QUERY_KEY_FAVORITE_GAME_LIST] })
    $queryClient.removeQueries({ queryKey: [TANSTACK_QUERY_KEY_GIFT_LIST] })
  }

  const mutation = useApiMutation(logoutApi, {
    onSuccess: async (response: ApiResponse<any>) => {
      const logoutResponse = response as ApiResponse<LogoutResponseType>
      clearLocalState()
      await navigateTo(ROUTE_PATH.HOME, { replace: true })
      await options.onSuccess?.(logoutResponse)
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const mutateAsync = async () => {
    try {
      return (await mutation.mutateAsync(undefined)) as ApiResponse<LogoutResponseType>
    } catch (error) {
      clearLocalState()
      await navigateTo(ROUTE_PATH.HOME, { replace: true })
      throw error
    }
  }

  return {
    logout: mutateAsync,
    clearLocalState,
    mutate: mutation.mutate,
    mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
