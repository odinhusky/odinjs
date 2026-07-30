import { useApiQuery } from "@shared-lib/api/useApiQuery"
import { giftsList, type GetGiftListResponseType } from "@shared-lib/api/apiFunctions/gift_getGiftList"
import { TANSTACK_QUERY_KEY_GIFT_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import type { ApiResponse } from "@shared-lib/api/types"
import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"

function useGiftListQuery({
  options = {}
}: {
  options?: Omit<UseQueryOptions<any, Error, GetGiftListResponseType, any[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetGiftListResponseType, Error> {
  const query = useApiQuery<typeof giftsList, GetGiftListResponseType>(
    [TANSTACK_QUERY_KEY_GIFT_LIST],
    giftsList,
    undefined,
    {
      select: (response: ApiResponse<GetGiftListResponseType>): GetGiftListResponseType => {
        return response.data ?? []
      },
      ...options
    }
  )

  return query
}

export interface UseGiftListParams {
  options?: Omit<UseQueryOptions<any, Error, GetGiftListResponseType, any[]>, "queryKey" | "queryFn">
}

export function useGiftList({ options }: UseGiftListParams = {}) {
  const { data: giftList, isLoading, isError, refetch } = useGiftListQuery({ options })

  return {
    giftList,
    isLoading,
    isError,
    refetch
  }
}
