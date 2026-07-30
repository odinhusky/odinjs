import { useApiQuery } from "@shared-lib/api/useApiQuery"
import { getUserInfo, type GetUserInfoResponseType } from "@shared-lib/api/apiFunctions/userInfo_getUserInfo"
import { TANSTACK_QUERY_KEY_USER_INFO } from "@shared-lib/constants/tanstackQueryKeys"
import type { ApiResponse } from "@shared-lib/api/types"
import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"

function useUserInfoQuery({
  options = {}
}: {
  options?: Omit<UseQueryOptions<any, Error, GetUserInfoResponseType, any[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetUserInfoResponseType, Error> {
  const query = useApiQuery<typeof getUserInfo, GetUserInfoResponseType>(
    [TANSTACK_QUERY_KEY_USER_INFO],
    getUserInfo,
    undefined,
    {
      select: (response: ApiResponse<GetUserInfoResponseType>): GetUserInfoResponseType => {
        return response.data ?? ({} as GetUserInfoResponseType)
      },
      ...options
    }
  )

  return query
}

export interface UseUserInfoParams {
  options?: Omit<UseQueryOptions<any, Error, GetUserInfoResponseType, any[]>, "queryKey" | "queryFn">
}

export function useUserInfo({ options }: UseUserInfoParams = {}) {
  const { data: userInfo, isLoading, isError, refetch } = useUserInfoQuery({ options })

  return {
    userInfo,
    isLoading,
    isError,
    refetch
  }
}
