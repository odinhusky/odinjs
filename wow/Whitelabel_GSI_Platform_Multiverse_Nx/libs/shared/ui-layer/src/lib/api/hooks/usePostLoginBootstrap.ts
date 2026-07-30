import { useNuxtApp } from "#imports"
import { getUserWalletList } from "@shared-lib/api/apiFunctions/userInfo_getUserWalletList"
import { getAccountInfo } from "@shared-lib/api/apiFunctions/userInfo_getAccountInfo"
import { getFavoriteGameList } from "@shared-lib/api/apiFunctions/game_getFavoriteGameList"
import { giftsList } from "@shared-lib/api/apiFunctions/gift_getGiftList"
import {
  TANSTACK_QUERY_KEY_USER_WALLET_LIST,
  TANSTACK_QUERY_KEY_ACCOUNT_INFO,
  TANSTACK_QUERY_KEY_FAVORITE_GAME_LIST,
  TANSTACK_QUERY_KEY_GIFT_LIST
} from "@shared-lib/constants/tanstackQueryKeys"
import { useWalletStore } from "@shared-lib/stores/wallet"
import { useUserProfileStore } from "@shared-lib/stores/userProfile"
import { useFavoriteGameStore } from "@shared-lib/stores/favoriteGame"
import { useGiftStore } from "@shared-lib/stores/gift"

interface PostLoginBootstrapResult {
  wallet: boolean
  accountInfo: boolean
  favoriteGame: boolean
  gift: boolean
}

export function usePostLoginBootstrap() {
  const { $queryClient } = useNuxtApp()
  const walletStore = useWalletStore()
  const userProfileStore = useUserProfileStore()
  const favoriteGameStore = useFavoriteGameStore()
  const giftStore = useGiftStore()

  const prefetchPostLoginQueries = async () => {
    const [walletResult, accountInfoResult, favoriteGameResult, giftResult] = await Promise.allSettled([
      $queryClient.fetchQuery({
        queryKey: [TANSTACK_QUERY_KEY_USER_WALLET_LIST],
        queryFn: async () => {
          const response = await getUserWalletList()
          if (!response.status) {
            throw new Error(response.msg || `API Error Code: ${response.code}`)
          }
          return response
        }
      }),
      $queryClient.fetchQuery({
        queryKey: [TANSTACK_QUERY_KEY_ACCOUNT_INFO],
        queryFn: async () => {
          const response = await getAccountInfo()
          if (!response.status) {
            throw new Error(response.msg || `API Error Code: ${response.code}`)
          }
          return response
        }
      }),
      $queryClient.fetchQuery({
        queryKey: [TANSTACK_QUERY_KEY_FAVORITE_GAME_LIST],
        queryFn: async () => {
          const response = await getFavoriteGameList()
          if (!response.status) {
            throw new Error(response.msg || `API Error Code: ${response.code}`)
          }
          return response
        }
      }),
      $queryClient.fetchQuery({
        queryKey: [TANSTACK_QUERY_KEY_GIFT_LIST],
        queryFn: async () => {
          const response = await giftsList()
          if (!response.status) {
            throw new Error(response.msg || `API Error Code: ${response.code}`)
          }
          return response
        }
      })
    ])

    if (walletResult.status === "fulfilled") {
      walletStore.setWalletList(walletResult.value.data ?? [])
    }

    if (accountInfoResult.status === "fulfilled") {
      userProfileStore.setProfile(accountInfoResult.value.data)
    }

    if (favoriteGameResult.status === "fulfilled") {
      favoriteGameStore.setFavoriteGameList(favoriteGameResult.value.data ?? [])
    }

    if (giftResult.status === "fulfilled") {
      giftStore.setGiftList(giftResult.value.data ?? [])
    }

    const result: PostLoginBootstrapResult = {
      wallet: walletResult.status === "fulfilled",
      accountInfo: accountInfoResult.status === "fulfilled",
      favoriteGame: favoriteGameResult.status === "fulfilled",
      gift: giftResult.status === "fulfilled"
    }

    return result
  }

  return {
    prefetchPostLoginQueries
  }
}
