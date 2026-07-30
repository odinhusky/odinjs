import { keepPreviousData, useQuery, type UseQueryOptions, type UseQueryReturnType } from "@tanstack/vue-query"
import { computed, toValue, type ComputedRef, type Ref } from "vue"
import type { ApiResponse } from "../types"
import {
  getReferralStatementList,
  type GetReferralStatementListParamTypes,
  type ReferralStatementListResponseType
} from "../apiFunctions/referral_getReferralStatementList"
import { TANSTACK_QUERY_KEY_REFERRAL_STATEMENT_LIST } from "../../constants/tanstackQueryKeys"

export interface UseReferralStatementListQueryParams {
  params: Ref<GetReferralStatementListParamTypes> | ComputedRef<GetReferralStatementListParamTypes>
  options?: Omit<UseQueryOptions<unknown, Error, ReferralStatementListResponseType, unknown[]>, "queryKey" | "queryFn">
}

export function useReferralStatementListQuery({
  params,
  options = {}
}: UseReferralStatementListQueryParams): UseQueryReturnType<ReferralStatementListResponseType, Error> {
  const defaultResponse: ReferralStatementListResponseType = {
    list: [],
    total: 0,
    offset: 0,
    size: 0
  }

  const queryKey = computed(() => [
    TANSTACK_QUERY_KEY_REFERRAL_STATEMENT_LIST,
    toValue(params).offset ?? 0,
    toValue(params).size ?? 10,
    toValue(params).member_account ?? ""
  ])

  return useQuery<ApiResponse<ReferralStatementListResponseType>, Error, ReferralStatementListResponseType, unknown[]>({
    queryKey,
    queryFn: async () => {
      const response = await getReferralStatementList({ ...toValue(params) })
      if (response.status === false) {
        throw new Error(response.msg || `API Error Code: ${response.code}`)
      }

      return response
    },
    placeholderData: keepPreviousData,
    select: (response: ApiResponse<ReferralStatementListResponseType>): ReferralStatementListResponseType => {
      return response.data ?? defaultResponse
    },
    staleTime: 30_000,
    ...options
  })
}
