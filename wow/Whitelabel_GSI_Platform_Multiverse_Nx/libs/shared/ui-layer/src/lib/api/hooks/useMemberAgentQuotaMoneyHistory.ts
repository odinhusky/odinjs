import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import {
  getMemberAgentQuotaMoneyHistory,
  type GetMemberAgentQuotaMoneyHistoryParamsType,
  type GetMemberAgentQuotaMoneyHistoryResponseType
} from "../apiFunctions/userInfo_getMemberAgentQuotaMoneyHistory"
import type { ApiResponse } from "../types"
import { TANSTACK_QUERY_KEY_MEMBER_AGENT_QUOTA_MONEY_HISTORY } from "../../constants/tanstackQueryKeys"
import { useApiQuery } from "../useApiQuery"

function useMemberAgentQuotaMoneyHistoryQuery({
  params,
  options = {}
}: {
  params: GetMemberAgentQuotaMoneyHistoryParamsType
  options?: Omit<
    UseQueryOptions<unknown, Error, GetMemberAgentQuotaMoneyHistoryResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}): UseQueryReturnType<GetMemberAgentQuotaMoneyHistoryResponseType, Error> {
  const defaultResponse: GetMemberAgentQuotaMoneyHistoryResponseType = {
    list: [],
    offset: Number(params.offset || 0),
    size: Number(params.size || 10),
    total: 0
  }

  return useApiQuery<typeof getMemberAgentQuotaMoneyHistory, GetMemberAgentQuotaMoneyHistoryResponseType>(
    [TANSTACK_QUERY_KEY_MEMBER_AGENT_QUOTA_MONEY_HISTORY],
    getMemberAgentQuotaMoneyHistory,
    params,
    {
      enabled: false,
      select: (response: ApiResponse<GetMemberAgentQuotaMoneyHistoryResponseType>) => {
        return response.data ?? defaultResponse
      },
      ...options
    }
  )
}

export interface UseMemberAgentQuotaMoneyHistoryParams {
  params: GetMemberAgentQuotaMoneyHistoryParamsType
  options?: Omit<
    UseQueryOptions<unknown, Error, GetMemberAgentQuotaMoneyHistoryResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}

export function useMemberAgentQuotaMoneyHistory({ params, options }: UseMemberAgentQuotaMoneyHistoryParams) {
  const {
    data: memberAgentQuotaMoneyHistory,
    isLoading,
    isError,
    refetch,
    isFetching
  } = useMemberAgentQuotaMoneyHistoryQuery({ params, options })

  return {
    memberAgentQuotaMoneyHistory,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
