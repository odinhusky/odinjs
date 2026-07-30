import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getMemberSummary,
  type GetMemberSummaryParamsType,
  type GetMemberSummaryResponseType
} from "@shared-lib/api/apiFunctions/userInfo_getMemberSummary"
import { TANSTACK_QUERY_KEY_MEMBER_SUMMARY } from "@shared-lib/constants/tanstackQueryKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"
import { useSetting } from "@shared-lib/api/hooks/useSetting"
import { normalizeDateRangeBoundaryIfNeeded, toRfc3339 } from "@shared-lib/utils/useRfc3339"

function useMemberSummaryQuery({
  params,
  options = {}
}: {
  params: GetMemberSummaryParamsType
  options?: Omit<UseQueryOptions<unknown, Error, GetMemberSummaryResponseType, unknown[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetMemberSummaryResponseType, Error> {
  const { setting: utcOffsetSetting, refetch: refetchSetting } = useSetting<number | undefined>({
    selector: (setting) => setting.utc_offset
  })

  const defaultResponse: GetMemberSummaryResponseType = {
    bet_count: 0,
    bet_amount: "0",
    bonus: "0",
    deposit: "0",
    login_at: "",
    member_id: 0,
    prize: "0",
    profit: "0",
    valid_bet: "0",
    withdraw: "0",
    metrics: []
  }

  const getMemberSummaryWithRfc = async (payload?: GetMemberSummaryParamsType) => {
    const requestPayload = payload ?? params

    if (utcOffsetSetting.value === undefined || utcOffsetSetting.value === null) {
      await refetchSetting()
    }

    const utcOffset = Number(utcOffsetSetting.value)

    const transformedPayload = { ...requestPayload }
    const startTime = toRfc3339(
      normalizeDateRangeBoundaryIfNeeded("start_time", transformedPayload.start_time),
      utcOffset
    )
    const endTime = toRfc3339(normalizeDateRangeBoundaryIfNeeded("end_time", transformedPayload.end_time), utcOffset)

    if (startTime !== undefined) {
      transformedPayload.start_time = startTime
    }

    if (endTime !== undefined) {
      transformedPayload.end_time = endTime
    }

    return getMemberSummary(transformedPayload)
  }

  return useApiQuery<typeof getMemberSummary, GetMemberSummaryResponseType>(
    [TANSTACK_QUERY_KEY_MEMBER_SUMMARY],
    getMemberSummaryWithRfc,
    params,
    {
      enabled: false,
      select: (response: ApiResponse<GetMemberSummaryResponseType>): GetMemberSummaryResponseType => {
        return response.data ?? defaultResponse
      },
      ...options
    }
  )
}

export interface UseMemberSummaryParams {
  params: GetMemberSummaryParamsType
  options?: Omit<UseQueryOptions<unknown, Error, GetMemberSummaryResponseType, unknown[]>, "queryKey" | "queryFn">
}

export function useMemberSummary({ params, options }: UseMemberSummaryParams) {
  const { data: memberSummary, isLoading, isError, refetch, isFetching } = useMemberSummaryQuery({ params, options })

  return {
    memberSummary,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
