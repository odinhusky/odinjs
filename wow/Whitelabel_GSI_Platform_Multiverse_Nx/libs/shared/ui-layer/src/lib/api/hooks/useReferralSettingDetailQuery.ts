import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query"
import { computed, type Ref } from "vue"
import type { ApiResponse } from "../types"
import {
  getReferralSettingDetail,
  type GetReferralSettingDetailResponseType
} from "../apiFunctions/referral_getReferralSettingDetail"
import { TANSTACK_QUERY_KEY_REFERRAL_SETTING_DETAIL } from "../../constants/tanstackQueryKeys"

export function useReferralSettingDetailQuery(
  memberId: Ref<number | null>
): UseQueryReturnType<GetReferralSettingDetailResponseType, Error> {
  const defaultResponse: GetReferralSettingDetailResponseType = {
    currency_limit: {},
    is_limit_configured: false
  }

  return useQuery<GetReferralSettingDetailResponseType, Error>({
    queryKey: computed(() => [TANSTACK_QUERY_KEY_REFERRAL_SETTING_DETAIL, memberId.value]),
    queryFn: async () => {
      const response = (await getReferralSettingDetail(memberId.value!)) as ApiResponse<GetReferralSettingDetailResponseType>
      if (response.status === false) {
        throw new Error(response.msg || `API Error Code: ${response.code}`)
      }

      return response.data ?? defaultResponse
    },
    enabled: computed(() => memberId.value !== null),
    staleTime: 0
  })
}
