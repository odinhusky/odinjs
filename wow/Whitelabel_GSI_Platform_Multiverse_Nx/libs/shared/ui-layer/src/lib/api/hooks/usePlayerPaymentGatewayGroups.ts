import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getPlayerPaymentGatewayGroups,
  type GetPlayerPaymentGatewayGroupsParamsType,
  type GetPlayerPaymentGatewayGroupsResponseType
} from "@shared-lib/api/apiFunctions/paymentGroup_getPlayerPaymentGatewayGroups"
import { TANSTACK_QUERY_KEY_PLAYER_PAYMENT_GATEWAY_GROUPS } from "@shared-lib/constants/tanstackQueryKeys/paymentGroupKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

function usePlayerPaymentGatewayGroupsQuery({
  params,
  options = {}
}: {
  params: GetPlayerPaymentGatewayGroupsParamsType
  options?: Omit<
    UseQueryOptions<unknown, Error, GetPlayerPaymentGatewayGroupsResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}): UseQueryReturnType<GetPlayerPaymentGatewayGroupsResponseType, Error> {
  return useApiQuery<typeof getPlayerPaymentGatewayGroups, GetPlayerPaymentGatewayGroupsResponseType>(
    [TANSTACK_QUERY_KEY_PLAYER_PAYMENT_GATEWAY_GROUPS, params.payment_method],
    getPlayerPaymentGatewayGroups,
    params,
    {
      enabled: false,
      select: (
        response: ApiResponse<GetPlayerPaymentGatewayGroupsResponseType>
      ): GetPlayerPaymentGatewayGroupsResponseType => {
        return response.data ?? []
      },
      ...options
    }
  )
}

export interface UsePlayerPaymentGatewayGroupsParams {
  params: GetPlayerPaymentGatewayGroupsParamsType
  options?: Omit<
    UseQueryOptions<unknown, Error, GetPlayerPaymentGatewayGroupsResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}

export function usePlayerPaymentGatewayGroups({ params, options }: UsePlayerPaymentGatewayGroupsParams) {
  const {
    data: playerPaymentGatewayGroups,
    isLoading,
    isError,
    isFetching,
    refetch
  } = usePlayerPaymentGatewayGroupsQuery({ params, options })

  return {
    playerPaymentGatewayGroups,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
