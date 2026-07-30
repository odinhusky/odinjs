import { useApiQuery } from "@shared-lib/api/useApiQuery"
import { getUserWalletList, type GetUserWalletListResponseType } from "@shared-lib/api/apiFunctions/userInfo_getUserWalletList"
import { TANSTACK_QUERY_KEY_USER_WALLET_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import { useAuthStore } from "@shared-lib/stores/auth"
import type { ApiResponse } from "@shared-lib/api/types"
import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import { computed, toValue } from "vue"

function useUserWalletListQuery(params?: {
  options?: Omit<UseQueryOptions<any, Error, GetUserWalletListResponseType, any[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetUserWalletListResponseType, Error> {
  const authStore = useAuthStore()
  const options = params?.options
  // 注意：舊 Vue 專案的登入判斷是 access_token && !isOnBoarding。
  // 若日後本 repo 加入 onboarding/KYC 短效 token，這裡也要排除 isOnBoarding，避免錢包 API 帶短效 token 請求。
  const walletQueryEnabled = computed(() => authStore.isLoggedIn && Boolean(toValue(options?.enabled ?? true)))

  const query = useApiQuery<typeof getUserWalletList, GetUserWalletListResponseType>(
    [TANSTACK_QUERY_KEY_USER_WALLET_LIST],
    getUserWalletList,
    undefined,
    {
      ...options,
      select: (response: ApiResponse<GetUserWalletListResponseType>): GetUserWalletListResponseType => {
        return response.data ?? []
      },
      enabled: walletQueryEnabled
    }
  )

  return query
}

export interface UseUserWalletListParams {
  options?: Omit<UseQueryOptions<any, Error, GetUserWalletListResponseType, any[]>, "queryKey" | "queryFn">
}

export function useUserWalletList(params?: UseUserWalletListParams) {
  const { data: userWalletList, isLoading, isError, refetch } = useUserWalletListQuery({ options: params?.options })

  return {
    userWalletList,
    isLoading,
    isError,
    refetch
  }
}
