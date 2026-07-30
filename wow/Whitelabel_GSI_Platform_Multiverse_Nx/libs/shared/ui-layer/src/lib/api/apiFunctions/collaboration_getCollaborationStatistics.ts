import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetCollaborationStatisticsParamsType {
  lang: string
  currency_id: number
}

export type GetCollaborationStatisticsRequestType = GetCollaborationStatisticsParamsType

export interface GetCollaborationStatisticsResponseType {
  banner: string
  banner_path?: string
  active_member_count: number
  valid_bet_amount: number
  referral_code: string
  title: string
  detail: string
}

export const getCollaborationStatistics = (params: GetCollaborationStatisticsParamsType) => {
  return requestFn<GetCollaborationStatisticsRequestType, GetCollaborationStatisticsResponseType>(
    ENDPOINT_PATHS.COLLABORATION.STATISTICS,
    params,
    {
      name: "getCollaborationStatistics",
      method: "get"
    }
  )
}
