import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import { FIVE_MINUTES } from "../../constants/durationTime"
import { TANSTACK_QUERY_KEY_PROMOTION_LIST } from "../../constants/tanstackQueryKeys"
import { getPromotionList, type GetPromotionListResponseType } from "../apiFunctions/promotion_getPromotionList"
import type { ApiResponse } from "../types"
import { useApiQuery } from "../useApiQuery"

type PromotionListQueryOptions = Omit<
  UseQueryOptions<ApiResponse<GetPromotionListResponseType>, Error, GetPromotionListResponseType, any[]>,
  "queryKey" | "queryFn"
>

export function usePromotionListQuery(
  options: PromotionListQueryOptions = {}
): UseQueryReturnType<GetPromotionListResponseType, Error> {
  return useApiQuery<typeof getPromotionList, GetPromotionListResponseType>(
    [TANSTACK_QUERY_KEY_PROMOTION_LIST],
    getPromotionList,
    undefined,
    {
      staleTime: FIVE_MINUTES,
      select: (response: ApiResponse<GetPromotionListResponseType>): GetPromotionListResponseType => response.data ?? [],
      ...options
    }
  )
}
