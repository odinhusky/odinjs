import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getMoneyHistoryTotal,
  type GetMoneyHistoryTotalParamTypes,
  type GetMoneyHistoryTotalResponseType
} from "@shared-lib/api/apiFunctions/report_getMoneyHistoryTotal"
import { TANSTACK_QUERY_KEY_MONEY_HISTORY_TOTAL } from "@shared-lib/constants/tanstackQueryKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"
import { useSetting } from "@shared-lib/api/hooks/useSetting"
import { normalizeDateRangeBoundaryIfNeeded, toRfc3339 } from "@shared-lib/utils/useRfc3339"

function useMoneyHistoryTotalQuery({
  params,
  options = {}
}: {
  params: GetMoneyHistoryTotalParamTypes
  options?: Omit<UseQueryOptions<unknown, Error, GetMoneyHistoryTotalResponseType, unknown[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetMoneyHistoryTotalResponseType, Error> {
  const { setting: utcOffsetSetting, refetch: refetchSetting } = useSetting<number | undefined>({
    selector: (setting) => setting.utc_offset
  })

  const defaultResponse: GetMoneyHistoryTotalResponseType = {
    valid_bet_amount_total: "0",
    player_profit: "0"
  }

  const getMoneyHistoryTotalWithRfc = async (payload?: GetMoneyHistoryTotalParamTypes) => {
    const requestPayload = payload ?? params

    if (utcOffsetSetting.value === undefined || utcOffsetSetting.value === null) {
      await refetchSetting()
    }

    const utcOffset = Number(utcOffsetSetting.value)

    const transformedPayload = { ...requestPayload }
    const startDate = toRfc3339(
      normalizeDateRangeBoundaryIfNeeded("start_date", transformedPayload.start_date),
      utcOffset
    )
    const endDate = toRfc3339(normalizeDateRangeBoundaryIfNeeded("end_date", transformedPayload.end_date), utcOffset)

    if (startDate !== undefined) {
      transformedPayload.start_date = startDate
    }

    if (endDate !== undefined) {
      transformedPayload.end_date = endDate
    }

    return getMoneyHistoryTotal(transformedPayload)
  }

  return useApiQuery<typeof getMoneyHistoryTotal, GetMoneyHistoryTotalResponseType>(
    [TANSTACK_QUERY_KEY_MONEY_HISTORY_TOTAL],
    getMoneyHistoryTotalWithRfc,
    params,
    {
      enabled: false,
      select: (response: ApiResponse<GetMoneyHistoryTotalResponseType>): GetMoneyHistoryTotalResponseType => {
        return response.data ?? defaultResponse
      },
      ...options
    }
  )
}

export interface UseMoneyHistoryTotalParams {
  params: GetMoneyHistoryTotalParamTypes
  options?: Omit<UseQueryOptions<unknown, Error, GetMoneyHistoryTotalResponseType, unknown[]>, "queryKey" | "queryFn">
}

export function useMoneyHistoryTotal({ params, options }: UseMoneyHistoryTotalParams) {
  const {
    data: moneyHistoryTotal,
    isLoading,
    isError,
    refetch,
    isFetching
  } = useMoneyHistoryTotalQuery({ params, options })

  return {
    moneyHistoryTotal,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
