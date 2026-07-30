import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getMoneyHistoryList,
  type GetMoneyHistoryListParamTypes,
  type GetMoneyHistoryListResponseType
} from "@shared-lib/api/apiFunctions/report_getMoneyHistoryList"
import { TANSTACK_QUERY_KEY_MONEY_HISTORY_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"
import { useSetting } from "@shared-lib/api/hooks/useSetting"
import { normalizeDateRangeBoundaryIfNeeded, toRfc3339 } from "@shared-lib/utils/useRfc3339"

function useMoneyHistoryListQuery({
  params,
  options = {}
}: {
  params: GetMoneyHistoryListParamTypes
  options?: Omit<UseQueryOptions<unknown, Error, GetMoneyHistoryListResponseType, unknown[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetMoneyHistoryListResponseType, Error> {
  const { setting: utcOffsetSetting, refetch: refetchSetting } = useSetting<number | undefined>({
    selector: (setting) => setting.utc_offset
  })

  const defaultResponse: GetMoneyHistoryListResponseType = {
    list: [],
    pagination: {
      offset: 0,
      size: params.size,
      total: 0
    }
  }

  const getMoneyHistoryListWithRfc = async (payload?: GetMoneyHistoryListParamTypes) => {
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

    return getMoneyHistoryList(transformedPayload)
  }

  return useApiQuery<typeof getMoneyHistoryList, GetMoneyHistoryListResponseType>(
    [TANSTACK_QUERY_KEY_MONEY_HISTORY_LIST],
    getMoneyHistoryListWithRfc,
    params,
    {
      enabled: false,
      select: (response: ApiResponse<GetMoneyHistoryListResponseType>): GetMoneyHistoryListResponseType => {
        return response.data ?? defaultResponse
      },
      ...options
    }
  )
}

export interface UseMoneyHistoryListParams {
  params: GetMoneyHistoryListParamTypes
  options?: Omit<UseQueryOptions<unknown, Error, GetMoneyHistoryListResponseType, unknown[]>, "queryKey" | "queryFn">
}

export function useMoneyHistoryList({ params, options }: UseMoneyHistoryListParams) {
  const {
    data: moneyHistoryList,
    isLoading,
    isError,
    refetch,
    isFetching
  } = useMoneyHistoryListQuery({ params, options })

  return {
    moneyHistoryList,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
