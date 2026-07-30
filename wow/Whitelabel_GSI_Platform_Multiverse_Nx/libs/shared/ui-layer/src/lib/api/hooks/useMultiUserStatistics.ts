import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import {
  getMultiUserStatistics,
  type UserStatisticsList,
  type GetMultiUserStatisticsResponseType
} from "@shared-lib/api/apiFunctions/vip_getMultiUserStatistics"
import { TANSTACK_QUERY_KEY_VIP_MULTI_USER_STATISTICS } from "@shared-lib/constants/tanstackQueryKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"
import type { ApiResponse } from "@shared-lib/api/types"

function useMultiUserStatisticsQuery({
  options = {}
}: {
  options?: Omit<UseQueryOptions<any, Error, UserStatisticsList, any[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<UserStatisticsList, Error> {
  return useApiQuery<typeof getMultiUserStatistics, GetMultiUserStatisticsResponseType, UserStatisticsList>(
    [TANSTACK_QUERY_KEY_VIP_MULTI_USER_STATISTICS],
    getMultiUserStatistics,
    undefined,
    {
      select: (response: ApiResponse<GetMultiUserStatisticsResponseType>): UserStatisticsList => {
        return response.data?.list ?? []
      },
      ...options
    }
  )
}

export interface UseMultiUserStatisticsParams {
  options?: Omit<UseQueryOptions<any, Error, UserStatisticsList, any[]>, "queryKey" | "queryFn">
}

export function useMultiUserStatistics({ options }: UseMultiUserStatisticsParams = {}) {
  const { data: userStatisticsList, isLoading, isError, refetch } = useMultiUserStatisticsQuery({ options })

  return {
    userStatisticsList,
    isLoading,
    isError,
    refetch
  }
}
