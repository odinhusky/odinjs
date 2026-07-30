import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getAgentPaymentGroup,
  type GetAgentPaymentGroupParamsType,
  type GetAgentPaymentGroupResponseType
} from "@shared-lib/api/apiFunctions/paymentGroup_getAgentPaymentGroup"
import { TANSTACK_QUERY_KEY_AGENT_PAYMENT_GROUP_DETAIL } from "@shared-lib/constants/tanstackQueryKeys/paymentGroupKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

function useAgentPaymentGroupQuery({
  params,
  options = {}
}: {
  params: GetAgentPaymentGroupParamsType
  options?: Omit<
    UseQueryOptions<unknown, Error, GetAgentPaymentGroupResponseType | null, unknown[]>,
    "queryKey" | "queryFn"
  >
}): UseQueryReturnType<GetAgentPaymentGroupResponseType | null, Error> {
  return useApiQuery<typeof getAgentPaymentGroup, GetAgentPaymentGroupResponseType | null>(
    [TANSTACK_QUERY_KEY_AGENT_PAYMENT_GROUP_DETAIL, params.id],
    getAgentPaymentGroup,
    params,
    {
      enabled: false,
      select: (response: ApiResponse<GetAgentPaymentGroupResponseType>): GetAgentPaymentGroupResponseType | null => {
        return response.data ?? null
      },
      ...options
    }
  )
}

export interface UseAgentPaymentGroupParams {
  params: GetAgentPaymentGroupParamsType
  options?: Omit<
    UseQueryOptions<unknown, Error, GetAgentPaymentGroupResponseType | null, unknown[]>,
    "queryKey" | "queryFn"
  >
}

export function useAgentPaymentGroup({ params, options }: UseAgentPaymentGroupParams) {
  const {
    data: agentPaymentGroup,
    isLoading,
    isError,
    isFetching,
    refetch
  } = useAgentPaymentGroupQuery({
    params,
    options
  })

  return {
    agentPaymentGroup,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
