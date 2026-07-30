import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import { getVipList, type GetVipListResponseType } from "@shared-lib/api/apiFunctions/vip_getVipList"
import { TANSTACK_QUERY_KEY_VIP_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"
import type { ApiResponse } from "@shared-lib/api/types"

function useVIPListInternal({
  options = {}
}: {
  options?: Omit<UseQueryOptions<any, Error, GetVipListResponseType, any[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetVipListResponseType, Error> {
  return useApiQuery<typeof getVipList, GetVipListResponseType>([TANSTACK_QUERY_KEY_VIP_LIST], getVipList, undefined, {
    select: (response: ApiResponse<GetVipListResponseType>): GetVipListResponseType => {
      return response.data ?? []
    },
    ...options
  })
}

export interface UseVIPListParams {
  options?: Omit<UseQueryOptions<any, Error, GetVipListResponseType, any[]>, "queryKey" | "queryFn">
}

export function useVIPList({ options }: UseVIPListParams = {}) {
  const { data: vipList, isLoading, isError, refetch } = useVIPListInternal({ options })

  return {
    vipList,
    isLoading,
    isError,
    refetch
  }
}

// Keep compatibility with existing callers.
export const useAPIListQuery = useVIPList
