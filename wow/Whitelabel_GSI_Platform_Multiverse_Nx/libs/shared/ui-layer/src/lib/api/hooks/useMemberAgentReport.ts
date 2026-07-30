import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "../types"
import {
  getMemberAgentReport,
  type GetMemberAgentReportParamsType,
  type GetMemberAgentReportResponseType
} from "../apiFunctions/userInfo_getMemberAgentReport"
import { TANSTACK_QUERY_KEY_MEMBER_AGENT_REPORT } from "../../constants/tanstackQueryKeys"
import { useApiQuery } from "../useApiQuery"
import { useSetting } from "./useSetting"
import { normalizeDateRangeBoundaryIfNeeded, toRfc3339 } from "../../utils/useRfc3339"

const ZERO_PERSONAL = {
  deposit: 0,
  withdraw: 0,
  bet_count: 0,
  bet_amount: 0,
  valid_bet: 0,
  prize: 0,
  profit: 0,
  rate: 0,
  bonus: 0
}

const ZERO_TEAM = {
  ...ZERO_PERSONAL,
  member_id: 0,
  member_account: "",
  member_count: 0,
  currency_id: 0
}

function useMemberAgentReportQuery({
  params,
  options = {}
}: {
  params: GetMemberAgentReportParamsType
  options?: Omit<
    UseQueryOptions<unknown, Error, GetMemberAgentReportResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}): UseQueryReturnType<GetMemberAgentReportResponseType, Error> {
  const { setting: utcOffsetSetting, refetch: refetchSetting } = useSetting<number | undefined>({
    selector: (setting) => setting.utc_offset
  })

  const defaultResponse: GetMemberAgentReportResponseType = {
    personal: { ...ZERO_PERSONAL },
    team: { ...ZERO_TEAM }
  }

  const getMemberAgentReportWithRfc = async (payload?: GetMemberAgentReportParamsType) => {
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
    const endTime = toRfc3339(
      normalizeDateRangeBoundaryIfNeeded("end_time", transformedPayload.end_time),
      utcOffset
    )

    if (startTime !== undefined) {
      transformedPayload.start_time = startTime as typeof transformedPayload.start_time
    }
    if (endTime !== undefined) {
      transformedPayload.end_time = endTime as typeof transformedPayload.end_time
    }

    return getMemberAgentReport(transformedPayload)
  }

  return useApiQuery<typeof getMemberAgentReport, GetMemberAgentReportResponseType>(
    [TANSTACK_QUERY_KEY_MEMBER_AGENT_REPORT],
    getMemberAgentReportWithRfc,
    params,
    {
      enabled: false,
      select: (
        response: ApiResponse<GetMemberAgentReportResponseType>
      ): GetMemberAgentReportResponseType => {
        return response.data ?? defaultResponse
      },
      ...options
    }
  )
}

export interface UseMemberAgentReportParams {
  params: GetMemberAgentReportParamsType
  options?: Omit<
    UseQueryOptions<unknown, Error, GetMemberAgentReportResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}

export function useMemberAgentReport({ params, options }: UseMemberAgentReportParams) {
  const {
    data: memberAgentReport,
    isLoading,
    isError,
    refetch,
    isFetching
  } = useMemberAgentReportQuery({ params, options })

  return {
    memberAgentReport,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
