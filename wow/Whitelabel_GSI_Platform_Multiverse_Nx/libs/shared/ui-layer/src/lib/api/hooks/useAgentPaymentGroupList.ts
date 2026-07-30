import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getAgentPaymentGroupList,
  type GetAgentPaymentGroupListResponseType
} from "@shared-lib/api/apiFunctions/paymentGroup_getAgentPaymentGroupList"
import { TANSTACK_QUERY_KEY_AGENT_PAYMENT_GROUP_LIST } from "@shared-lib/constants/tanstackQueryKeys/paymentGroupKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

function useAgentPaymentGroupListQuery({
  options = {}
}: {
  options?: Omit<
    UseQueryOptions<unknown, Error, GetAgentPaymentGroupListResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}): UseQueryReturnType<GetAgentPaymentGroupListResponseType, Error> {
  const defaultResponse: GetAgentPaymentGroupListResponseType = {
    list: [],
    pagination: {
      offset: 0,
      size: 0,
      total: 0
    }
  }

  return useApiQuery<typeof getAgentPaymentGroupList, GetAgentPaymentGroupListResponseType>(
    [TANSTACK_QUERY_KEY_AGENT_PAYMENT_GROUP_LIST],
    getAgentPaymentGroupList,
    undefined,
    {
      enabled: false,
      select: (response: ApiResponse<GetAgentPaymentGroupListResponseType>): GetAgentPaymentGroupListResponseType => {
        return response.data ?? defaultResponse
      },
      ...options
    }
  )
}

export interface UseAgentPaymentGroupListParams {
  options?: Omit<
    UseQueryOptions<unknown, Error, GetAgentPaymentGroupListResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}

export function useAgentPaymentGroupList({ options }: UseAgentPaymentGroupListParams = {}) {
  const {
    data: agentPaymentGroupList,
    isLoading,
    isError,
    isFetching,
    refetch
  } = useAgentPaymentGroupListQuery({ options })

  return {
    agentPaymentGroupList,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
