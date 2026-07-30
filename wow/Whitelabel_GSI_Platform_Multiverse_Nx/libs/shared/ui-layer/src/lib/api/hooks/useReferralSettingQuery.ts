import { keepPreviousData, useQuery, type UseQueryOptions, type UseQueryReturnType } from "@tanstack/vue-query"
import { computed, toValue, type ComputedRef, type Ref } from "vue"
import type { ApiResponse } from "../types"
import { getReferralSetting, type GetReferralSettingResponseType } from "../apiFunctions/referral_getReferralSetting"
import type { GetReferralSettingBase } from "../commonTypes/referralTypes"
import { TANSTACK_QUERY_KEY_REFERRAL_SETTING } from "../../constants/tanstackQueryKeys"

export interface UseReferralSettingQueryParams {
  params: Ref<GetReferralSettingBase> | ComputedRef<GetReferralSettingBase>
  options?: Omit<UseQueryOptions<unknown, Error, GetReferralSettingResponseType, unknown[]>, "queryKey" | "queryFn">
}

export function useReferralSettingQuery({
  params,
  options = {}
}: UseReferralSettingQueryParams): UseQueryReturnType<GetReferralSettingResponseType, Error> {
  const defaultResponse: GetReferralSettingResponseType = {
    list: [],
    total: 0,
    offset: 0,
    size: 0
  }

  const queryKey = computed(() => [
    TANSTACK_QUERY_KEY_REFERRAL_SETTING,
    toValue(params).offset ?? 0,
    toValue(params).size ?? 10,
    toValue(params).member_account ?? ""
  ])

  return useQuery<ApiResponse<GetReferralSettingResponseType>, Error, GetReferralSettingResponseType, unknown[]>({
    queryKey,
    queryFn: async () => {
      const response = await getReferralSetting({ ...toValue(params) })
      if (response.status === false) {
        throw new Error(response.msg || `API Error Code: ${response.code}`)
      }

      return response
    },
    placeholderData: keepPreviousData,
    select: (response: ApiResponse<GetReferralSettingResponseType>): GetReferralSettingResponseType => {
      return response.data ?? defaultResponse
    },
    staleTime: 30_000,
    ...options
  })
}
