import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getPendingHistoryList,
  type GetMoneyPendingParamTypes as PendingOrderHistoryParams,
  type GetMoneyPendingListResponseType as PendingOrderHistoryResponse
} from "@shared-lib/api/apiFunctions/report_getPendingHistoryList"
import { TANSTACK_QUERY_KEY_PENDING_ORDER_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"
import { useSetting } from "@shared-lib/api/hooks/useSetting"
import { normalizeDateRangeBoundaryIfNeeded, toRfc3339 } from "@shared-lib/utils/useRfc3339"

function usePendingOrderHistoryQuery({
  params,
  options = {}
}: {
  params: PendingOrderHistoryParams
  options?: Omit<UseQueryOptions<unknown, Error, PendingOrderHistoryResponse, unknown[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<PendingOrderHistoryResponse, Error> {
  const { setting: utcOffsetSetting, refetch: refetchSetting } = useSetting<number | undefined>({
    selector: (setting) => setting.utc_offset
  })

  const defaultResponse: PendingOrderHistoryResponse = {
    list: [],
    pagination: {
      offset: 0,
      size: params.size,
      total: 0
    }
  }

  const getPendingOrderHistoryWithRfc = async (payload?: PendingOrderHistoryParams) => {
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

    return getPendingHistoryList(transformedPayload)
  }

  return useApiQuery<typeof getPendingHistoryList, PendingOrderHistoryResponse>(
    [TANSTACK_QUERY_KEY_PENDING_ORDER_LIST],
    getPendingOrderHistoryWithRfc,
    params,
    {
      enabled: false,
      select: (response: ApiResponse<PendingOrderHistoryResponse>): PendingOrderHistoryResponse => {
        return response.data ?? defaultResponse
      },
      ...options
    }
  )
}

export interface UsePendingOrderHistoryParams {
  params: PendingOrderHistoryParams
  options?: Omit<UseQueryOptions<unknown, Error, PendingOrderHistoryResponse, unknown[]>, "queryKey" | "queryFn">
}

export function usePendingOrderHistory({ params, options }: UsePendingOrderHistoryParams) {
  const {
    data: pendingOrderHistory,
    isLoading,
    isError,
    refetch,
    isFetching
  } = usePendingOrderHistoryQuery({ params, options })

  return {
    pendingOrderHistory,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
