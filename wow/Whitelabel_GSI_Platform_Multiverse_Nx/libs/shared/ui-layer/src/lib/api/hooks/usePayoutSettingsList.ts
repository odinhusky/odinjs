import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getPayoutSettingsList,
  type GetPayoutSettingsListParamsType,
  type GetPayoutSettingsListResponseType
} from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsList"
import { TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_LIST } from "@shared-lib/constants/tanstackQueryKeys/payoutSettingsKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

function usePayoutSettingsListQuery({
  params,
  options
}: {
  params: GetPayoutSettingsListParamsType
  options?: Omit<UseQueryOptions<unknown, Error, GetPayoutSettingsListResponseType, unknown[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetPayoutSettingsListResponseType, Error> {
  const defaultResponse: GetPayoutSettingsListResponseType = {
    list: []
  }

  return useApiQuery<typeof getPayoutSettingsList, GetPayoutSettingsListResponseType>(
    [TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_LIST, params.method_type],
    getPayoutSettingsList,
    params,
    {
      enabled: false,
      select: (response: ApiResponse<GetPayoutSettingsListResponseType>): GetPayoutSettingsListResponseType => {
        return response.data ?? defaultResponse
      },
      ...options
    }
  )
}

export interface UsePayoutSettingsListParams {
  params: GetPayoutSettingsListParamsType
  options?: Omit<UseQueryOptions<unknown, Error, GetPayoutSettingsListResponseType, unknown[]>, "queryKey" | "queryFn">
}

export function usePayoutSettingsList({ params, options }: UsePayoutSettingsListParams) {
  const {
    data: payoutSettingsList,
    isLoading,
    isError,
    isFetching,
    refetch
  } = usePayoutSettingsListQuery({
    params,
    options
  })

  return {
    payoutSettingsList,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
