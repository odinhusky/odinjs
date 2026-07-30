import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getPayoutSettingsEwalletProviderList,
  type GetPayoutSettingsEwalletProviderListResponseType
} from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsEwalletProviderList"
import { TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_EWALLET_PROVIDER_LIST } from "@shared-lib/constants/tanstackQueryKeys/payoutSettingsKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

function usePayoutSettingsEwalletProviderListQuery(params?: {
  options?: Omit<
    UseQueryOptions<unknown, Error, GetPayoutSettingsEwalletProviderListResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}): UseQueryReturnType<GetPayoutSettingsEwalletProviderListResponseType, Error> {
  const options = params?.options

  return useApiQuery<typeof getPayoutSettingsEwalletProviderList, GetPayoutSettingsEwalletProviderListResponseType>(
    [TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_EWALLET_PROVIDER_LIST],
    getPayoutSettingsEwalletProviderList,
    undefined,
    {
      enabled: false,
      select: (
        response: ApiResponse<GetPayoutSettingsEwalletProviderListResponseType>
      ): GetPayoutSettingsEwalletProviderListResponseType => {
        return response.data ?? []
      },
      ...options
    }
  )
}

export interface UsePayoutSettingsEwalletProviderListParams {
  options?: Omit<
    UseQueryOptions<unknown, Error, GetPayoutSettingsEwalletProviderListResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}

export function usePayoutSettingsEwalletProviderList(params?: UsePayoutSettingsEwalletProviderListParams) {
  const {
    data: ewalletProviderList,
    isLoading,
    isError,
    isFetching,
    refetch
  } = usePayoutSettingsEwalletProviderListQuery({ options: params?.options })

  return {
    ewalletProviderList,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
