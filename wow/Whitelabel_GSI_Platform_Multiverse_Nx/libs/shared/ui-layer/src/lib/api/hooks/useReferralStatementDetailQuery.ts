import { keepPreviousData, useQuery, type UseQueryOptions, type UseQueryReturnType } from "@tanstack/vue-query"
import { computed, toValue, type ComputedRef, type Ref } from "vue"
import type { ApiResponse } from "../types"
import {
  getReferralStatementDetail,
  type GetReferralStatementDetailListParamTypes,
  type ReferralStatementDetailListResponseType
} from "../apiFunctions/referral_getReferralStatementDetail"
import { TANSTACK_QUERY_KEY_REFERRAL_STATEMENT_DETAIL } from "../../constants/tanstackQueryKeys"

export interface UseReferralStatementDetailQueryParams {
  statementId: Ref<number | null> | ComputedRef<number | null>
  params: Ref<GetReferralStatementDetailListParamTypes> | ComputedRef<GetReferralStatementDetailListParamTypes>
  options?: Omit<
    UseQueryOptions<unknown, Error, ReferralStatementDetailListResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}

export function useReferralStatementDetailQuery({
  statementId,
  params,
  options = {}
}: UseReferralStatementDetailQueryParams): UseQueryReturnType<ReferralStatementDetailListResponseType, Error> {
  const defaultResponse: ReferralStatementDetailListResponseType = {
    list: [],
    total: 0,
    offset: 0,
    size: 0,
    page_summary: {
      cashback_count: 0,
      revenue_total: {}
    }
  }

  const queryKey = computed(() => [
    TANSTACK_QUERY_KEY_REFERRAL_STATEMENT_DETAIL,
    toValue(statementId),
    toValue(params).offset ?? 0,
    toValue(params).size ?? 10,
    toValue(params).member_account ?? ""
  ])

  const enabled = computed(() => toValue(statementId) !== null)

  return useQuery<
    ApiResponse<ReferralStatementDetailListResponseType>,
    Error,
    ReferralStatementDetailListResponseType,
    unknown[]
  >({
    queryKey,
    enabled,
    queryFn: async () => {
      const id = toValue(statementId)
      if (id === null) {
        throw new Error("statementId 必填")
      }

      const response = await getReferralStatementDetail(id, { ...toValue(params) })
      if (response.status === false) {
        throw new Error(response.msg || `API Error Code: ${response.code}`)
      }

      return response
    },
    placeholderData: keepPreviousData,
    select: (
      response: ApiResponse<ReferralStatementDetailListResponseType>
    ): ReferralStatementDetailListResponseType => {
      return response.data ?? defaultResponse
    },
    staleTime: 30_000,
    ...options
  })
}
