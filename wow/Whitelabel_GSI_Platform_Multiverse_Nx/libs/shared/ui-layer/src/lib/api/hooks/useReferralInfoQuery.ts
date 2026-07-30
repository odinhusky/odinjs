import { useQuery } from "@tanstack/vue-query"
import type { ApiResponse } from "../types"
import { getReferralInfo, type GetReferralInfoResponseType } from "../apiFunctions/referral_getReferralInfo"
import { TANSTACK_QUERY_KEY_REFERRAL_INFO } from "../../constants/tanstackQueryKeys"

export function useReferralInfoQuery() {
  return useQuery<GetReferralInfoResponseType | null, Error>({
    queryKey: [TANSTACK_QUERY_KEY_REFERRAL_INFO],
    queryFn: async () => {
      const response = (await getReferralInfo()) as ApiResponse<GetReferralInfoResponseType>
      if (response.status === false) {
        throw new Error(response.msg || `API Error Code: ${response.code}`)
      }

      return response.data ?? null
    },
    staleTime: 30_000
  })
}
