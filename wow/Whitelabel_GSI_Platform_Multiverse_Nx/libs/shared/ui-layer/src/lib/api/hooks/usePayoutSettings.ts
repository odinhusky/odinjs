import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getPayoutSettings,
  type GetPayoutSettingsParamsType,
  type GetPayoutSettingsResponseType
} from "@shared-lib/api/apiFunctions/bank_getPayoutSettings"
import { TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_DETAIL } from "@shared-lib/constants/tanstackQueryKeys/payoutSettingsKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

function usePayoutSettingsQuery({
  params,
  options = {}
}: {
  params: GetPayoutSettingsParamsType
  options?: Omit<
    UseQueryOptions<unknown, Error, GetPayoutSettingsResponseType | null, unknown[]>,
    "queryKey" | "queryFn"
  >
}): UseQueryReturnType<GetPayoutSettingsResponseType | null, Error> {
  return useApiQuery<typeof getPayoutSettings, GetPayoutSettingsResponseType | null>(
    [TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_DETAIL, params.id],
    getPayoutSettings,
    params,
    {
      enabled: false,
      select: (response: ApiResponse<GetPayoutSettingsResponseType>): GetPayoutSettingsResponseType | null => {
        return response.data ?? null
      },
      ...options
    }
  )
}

export interface UsePayoutSettingsParams {
  params: GetPayoutSettingsParamsType
  options?: Omit<
    UseQueryOptions<unknown, Error, GetPayoutSettingsResponseType | null, unknown[]>,
    "queryKey" | "queryFn"
  >
}

export function usePayoutSettings({ params, options }: UsePayoutSettingsParams) {
  const { data: payoutSettings, isLoading, isError, isFetching, refetch } = usePayoutSettingsQuery({ params, options })

  return {
    payoutSettings,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
