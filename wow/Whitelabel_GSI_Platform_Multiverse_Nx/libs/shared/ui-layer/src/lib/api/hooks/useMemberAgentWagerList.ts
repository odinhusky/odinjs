import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "../types"
import {
  getMemberAgentWagerList,
  type GetMemberAgentWagerListParamsType,
  type GetMemberAgentWagerListResponseType
} from "../apiFunctions/userInfo_getMemberAgentWagerList"
import { TANSTACK_QUERY_KEY_MEMBER_AGENT_WAGER_LIST } from "../../constants/tanstackQueryKeys"
import { useApiQuery } from "../useApiQuery"
import { useSetting } from "./useSetting"
import { normalizeDateRangeBoundaryIfNeeded, toRfc3339 } from "../../utils/useRfc3339"

const ZERO_SUMMARY = {
  bet_amount: "0",
  payout: "0",
  profit: "0",
  valid_bet_amount: "0",
  total: 0
}

function useMemberAgentWagerListQuery({
  params,
  options = {}
}: {
  params: GetMemberAgentWagerListParamsType
  options?: Omit<
    UseQueryOptions<unknown, Error, GetMemberAgentWagerListResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}): UseQueryReturnType<GetMemberAgentWagerListResponseType, Error> {
  const { setting: utcOffsetSetting, refetch: refetchSetting } = useSetting<number | undefined>({
    selector: (setting) => setting.utc_offset
  })

  const defaultResponse: GetMemberAgentWagerListResponseType = {
    list: [],
    summary: {
      page: { ...ZERO_SUMMARY },
      total: { ...ZERO_SUMMARY }
    },
    offset: params.offset,
    size: params.size,
    total: 0
  }

  const getMemberAgentWagerListWithRfc = async (payload?: GetMemberAgentWagerListParamsType) => {
    const requestPayload = payload ?? params

    if (utcOffsetSetting.value === undefined || utcOffsetSetting.value === null) {
      await refetchSetting()
    }

    const utcOffset = Number(utcOffsetSetting.value)

    const transformedPayload = { ...requestPayload }
    const startTime = toRfc3339(
      normalizeDateRangeBoundaryIfNeeded("str_time", transformedPayload.str_time),
      utcOffset
    )
    const endTime = toRfc3339(
      normalizeDateRangeBoundaryIfNeeded("end_time", transformedPayload.end_time),
      utcOffset
    )

    if (startTime !== undefined) {
      transformedPayload.str_time = startTime
    }

    if (endTime !== undefined) {
      transformedPayload.end_time = endTime
    }

    return getMemberAgentWagerList(transformedPayload)
  }

  return useApiQuery<typeof getMemberAgentWagerList, GetMemberAgentWagerListResponseType>(
    [TANSTACK_QUERY_KEY_MEMBER_AGENT_WAGER_LIST],
    getMemberAgentWagerListWithRfc,
    params,
    {
      enabled: false,
      select: (
        response: ApiResponse<GetMemberAgentWagerListResponseType>
      ): GetMemberAgentWagerListResponseType => {
        return response.data ?? defaultResponse
      },
      ...options
    }
  )
}

export interface UseMemberAgentWagerListParams {
  params: GetMemberAgentWagerListParamsType
  options?: Omit<
    UseQueryOptions<unknown, Error, GetMemberAgentWagerListResponseType, unknown[]>,
    "queryKey" | "queryFn"
  >
}

export function useMemberAgentWagerList({ params, options }: UseMemberAgentWagerListParams) {
  const {
    data: memberAgentWagerList,
    isLoading,
    isError,
    refetch,
    isFetching
  } = useMemberAgentWagerListQuery({ params, options })

  return {
    memberAgentWagerList,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
