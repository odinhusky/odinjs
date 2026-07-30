import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getLatestWinList,
  type GetLatestWinListParamsType,
  type GetLatestWinListResponseType
} from "@shared-lib/api/apiFunctions/rank_getLatestWinList"
import { TANSTACK_QUERY_KEY_LATEST_WIN_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

function useLatestWinListQuery({
  params,
  options = {}
}: {
  params: GetLatestWinListParamsType
  options?: Omit<UseQueryOptions<unknown, Error, GetLatestWinListResponseType, unknown[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetLatestWinListResponseType, Error> {
  return useApiQuery<typeof getLatestWinList, GetLatestWinListResponseType>(
    [TANSTACK_QUERY_KEY_LATEST_WIN_LIST],
    getLatestWinList,
    params,
    {
      enabled: false,
      select: (response: ApiResponse<GetLatestWinListResponseType>): GetLatestWinListResponseType => {
        return response.data ?? []
      },
      ...options
    }
  )
}

export interface UseLatestWinListParams {
  params: GetLatestWinListParamsType
  options?: Omit<UseQueryOptions<unknown, Error, GetLatestWinListResponseType, unknown[]>, "queryKey" | "queryFn">
}

export function useLatestWinList({ params, options }: UseLatestWinListParams) {
  const { data: latestWinList, isLoading, isError, isFetching, refetch } = useLatestWinListQuery({ params, options })

  return {
    latestWinList,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
