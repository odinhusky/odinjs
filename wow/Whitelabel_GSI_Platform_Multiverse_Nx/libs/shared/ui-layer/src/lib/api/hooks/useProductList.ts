import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getProductList,
  type GetProductListParamsType,
  type GetProductListResponseType
} from "@shared-lib/api/apiFunctions/game_getProductList"
import { TANSTACK_QUERY_KEY_PRODUCT_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

function useProductListQuery({
  params,
  options = {}
}: {
  params: GetProductListParamsType
  options?: Omit<UseQueryOptions<unknown, Error, GetProductListResponseType, unknown[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetProductListResponseType, Error> {
  return useApiQuery<typeof getProductList, GetProductListResponseType>(
    [TANSTACK_QUERY_KEY_PRODUCT_LIST],
    getProductList,
    params,
    {
      enabled: false,
      select: (response: ApiResponse<GetProductListResponseType>): GetProductListResponseType => {
        return response.data ?? []
      },
      ...options
    }
  )
}

export interface UseProductListParams {
  params: GetProductListParamsType
  options?: Omit<UseQueryOptions<unknown, Error, GetProductListResponseType, unknown[]>, "queryKey" | "queryFn">
}

export function useProductList({ params, options }: UseProductListParams) {
  const { data: productList, isLoading, isError, isFetching, refetch } = useProductListQuery({ params, options })

  return {
    productList,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
