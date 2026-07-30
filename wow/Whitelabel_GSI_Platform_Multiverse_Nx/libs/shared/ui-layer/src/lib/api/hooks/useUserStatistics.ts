import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import { getUserStatistics, type GetUserStatisticsResponseType } from "@shared-lib/api/apiFunctions/vip_getUserStatistics"
import { TANSTACK_QUERY_KEY_VIP_USER_STATISTICS } from "@shared-lib/constants/tanstackQueryKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"
import type { ApiResponse } from "@shared-lib/api/types"

function useUserStatisticsQuery({
  currencyId,
  options = {}
}: {
  currencyId: number
  options?: Omit<UseQueryOptions<any, Error, GetUserStatisticsResponseType, any[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetUserStatisticsResponseType, Error> {
  return useApiQuery<typeof getUserStatistics, GetUserStatisticsResponseType>(
    [TANSTACK_QUERY_KEY_VIP_USER_STATISTICS, currencyId],
    getUserStatistics,
    currencyId,
    {
      enabled: Boolean(currencyId),
      select: (response: ApiResponse<GetUserStatisticsResponseType>): GetUserStatisticsResponseType => {
        return response.data ?? ({} as GetUserStatisticsResponseType)
      },
      ...options
    }
  )
}

export interface UseUserStatisticsParams {
  currencyId: number
  options?: Omit<UseQueryOptions<any, Error, GetUserStatisticsResponseType, any[]>, "queryKey" | "queryFn">
}

export function useUserStatistics({ currencyId, options }: UseUserStatisticsParams) {
  const {
    data: userStatistics,
    isLoading,
    isError,
    refetch
  } = useUserStatisticsQuery({
    currencyId,
    options
  })

  return {
    userStatistics,
    isLoading,
    isError,
    refetch
  }
}
