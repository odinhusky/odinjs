import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query"
import { computed, type Ref } from "vue"
import type { ApiResponse } from "../types"
import {
  getReferralSummary,
  type ReferralSummaryResponseType
} from "../apiFunctions/referral_getReferralSummary"
import { TANSTACK_QUERY_KEY_REFERRAL_SUMMARY } from "../../constants/tanstackQueryKeys"

export function useReferralSummaryQuery(
  currencyId: Ref<string | number | null | undefined>
): UseQueryReturnType<ReferralSummaryResponseType, Error> {
  const defaultResponse: ReferralSummaryResponseType = {
    member_count: 0,
    total_valid_betted_amount: "0",
    total_profit: "0"
  }

  return useQuery<ReferralSummaryResponseType, Error>({
    queryKey: computed(() => [TANSTACK_QUERY_KEY_REFERRAL_SUMMARY, currencyId.value ?? ""]),
    queryFn: async () => {
      const normalizedCurrencyId = currencyId.value === null || currencyId.value === undefined ? undefined : String(currencyId.value)
      const response = (await getReferralSummary(normalizedCurrencyId)) as ApiResponse<ReferralSummaryResponseType>
      if (response.status === false) {
        throw new Error(response.msg || `API Error Code: ${response.code}`)
      }

      return response.data ?? defaultResponse
    },
    staleTime: 30_000
  })
}
