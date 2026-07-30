import { useApiQuery } from "@shared-lib/api/useApiQuery"
import { getAccountInfo, type GetAccountInfoResponseType } from "@shared-lib/api/apiFunctions/userInfo_getAccountInfo"
import { TANSTACK_QUERY_KEY_ACCOUNT_INFO } from "@shared-lib/constants/tanstackQueryKeys"
import type { ApiResponse } from "@shared-lib/api/types"
import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"

function useAccountInfoQuery({
  options = {}
}: {
  options?: Omit<UseQueryOptions<any, Error, GetAccountInfoResponseType, any[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetAccountInfoResponseType, Error> {
  const query = useApiQuery<typeof getAccountInfo, GetAccountInfoResponseType>(
    [TANSTACK_QUERY_KEY_ACCOUNT_INFO],
    getAccountInfo,
    undefined,
    {
      select: (response: ApiResponse<GetAccountInfoResponseType>): GetAccountInfoResponseType => {
        return response.data ?? ({} as GetAccountInfoResponseType)
      },
      ...options
    }
  )

  return query
}

export interface UseAccountInfoParams {
  options?: Omit<UseQueryOptions<any, Error, GetAccountInfoResponseType, any[]>, "queryKey" | "queryFn">
}

export function useAccountInfo({ options }: UseAccountInfoParams = {}) {
  const { data: accountInfo, isLoading, isError, refetch } = useAccountInfoQuery({ options })

  return {
    accountInfo,
    isLoading,
    isError,
    refetch
  }
}
