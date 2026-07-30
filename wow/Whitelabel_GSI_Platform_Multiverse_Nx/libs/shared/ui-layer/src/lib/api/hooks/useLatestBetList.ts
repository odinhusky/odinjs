import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getLatestBetList,
  type GetLatestBetListParamsType,
  type GetLatestBetListResponseType
} from "@shared-lib/api/apiFunctions/rank_getLatestBetList"
import { TANSTACK_QUERY_KEY_LATEST_BET_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

function useLatestBetListQuery({
  params,
  options = {}
}: {
  params: GetLatestBetListParamsType
  options?: Omit<UseQueryOptions<unknown, Error, GetLatestBetListResponseType, unknown[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetLatestBetListResponseType, Error> {
  return useApiQuery<typeof getLatestBetList, GetLatestBetListResponseType>(
    [TANSTACK_QUERY_KEY_LATEST_BET_LIST],
    getLatestBetList,
    params,
    {
      enabled: false,
      select: (response: ApiResponse<GetLatestBetListResponseType>): GetLatestBetListResponseType => {
        return response.data ?? []
      },
      ...options
    }
  )
}

export interface UseLatestBetListParams {
  params: GetLatestBetListParamsType
  options?: Omit<UseQueryOptions<unknown, Error, GetLatestBetListResponseType, unknown[]>, "queryKey" | "queryFn">
}

export function useLatestBetList({ params, options }: UseLatestBetListParams) {
  const { data: latestBetList, isLoading, isError, isFetching, refetch } = useLatestBetListQuery({ params, options })

  return {
    latestBetList,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
