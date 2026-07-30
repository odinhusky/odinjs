import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { ShareholderBaseParamsType } from "@shared-lib/api/commonTypes/shareholderTypes"

export type GetTimeRangeTeamOverviewParamsType = ShareholderBaseParamsType
export type GetTimeRangeTeamOverviewRequestType = ShareholderBaseParamsType

export interface GetTimeRangeTeamOverviewResponseType {
  direct_count: number // 直屬下級註冊人數
  direct_first_deposit_count: number // 直屬下級首存人數
  team_first_deposit_count: number // 團隊首存人數
  direct_online_count: number // 直屬下級在線人數
  direct_valid_bet: number // 直屬下級有效投注
  team_valid_bet: number // 團隊有效投注
}

// 取得時間區間團隊概覽
export const getTimeRangeTeamOverView = (params: GetTimeRangeTeamOverviewParamsType) => {
  return requestFn<GetTimeRangeTeamOverviewRequestType, GetTimeRangeTeamOverviewResponseType>(
    ENDPOINT_PATHS.SHAREHOLDER.GET_TIME_RANGE_TEAM_OVERVIEW,
    params,
    {
      name: "getTimeRangeTeamOverView",
      method: "get"
    }
  )
}
