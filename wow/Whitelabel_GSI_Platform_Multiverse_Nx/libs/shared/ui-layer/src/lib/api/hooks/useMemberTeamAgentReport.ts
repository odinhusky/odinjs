import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "../types"
import {
  getMemberTeamAgentReport,
  type GetMemberTeamAgentReportParamsType,
  type GetMemberTeamAgentReportResponseType
} from "../apiFunctions/userInfo_getMemberTeamAgentReport"
import { TANSTACK_QUERY_KEY_MEMBER_TEAM_AGENT_REPORT } from "../../constants/tanstackQueryKeys"
import { useApiQuery } from "../useApiQuery"
import { useSetting } from "./useSetting"
import { normalizeDateRangeBoundaryIfNeeded, toRfc3339 } from "../../utils/useRfc3339"

function useMemberTeamAgentReportQuery({
  params,
  options = {}
}: {
  params: GetMemberTeamAgentReportParamsType
  options?: Omit<
    UseQueryOptions<unknown, Error, GetMemberTeamAgentReportResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}): UseQueryReturnType<GetMemberTeamAgentReportResponseType, Error> {
  const { setting: utcOffsetSetting, refetch: refetchSetting } = useSetting<number | undefined>({
    selector: (setting) => setting.utc_offset
  })

  const defaultResponse: GetMemberTeamAgentReportResponseType = {
    list: [],
    pagination: {
      offset: params.offset,
      size: params.size,
      total: 0
    }
  }

  const getMemberTeamAgentReportWithRfc = async (payload?: GetMemberTeamAgentReportParamsType) => {
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

    return getMemberTeamAgentReport(transformedPayload)
  }

  return useApiQuery<typeof getMemberTeamAgentReport, GetMemberTeamAgentReportResponseType>(
    [TANSTACK_QUERY_KEY_MEMBER_TEAM_AGENT_REPORT],
    getMemberTeamAgentReportWithRfc,
    params,
    {
      enabled: false,
      select: (
        response: ApiResponse<GetMemberTeamAgentReportResponseType>
      ): GetMemberTeamAgentReportResponseType => {
        return response.data ?? defaultResponse
      },
      ...options
    }
  )
}

export interface UseMemberTeamAgentReportParams {
  params: GetMemberTeamAgentReportParamsType
  options?: Omit<
    UseQueryOptions<unknown, Error, GetMemberTeamAgentReportResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}

export function useMemberTeamAgentReport({ params, options }: UseMemberTeamAgentReportParams) {
  const {
    data: memberTeamAgentReport,
    isLoading,
    isError,
    refetch,
    isFetching
  } = useMemberTeamAgentReportQuery({ params, options })

  return {
    memberTeamAgentReport,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
