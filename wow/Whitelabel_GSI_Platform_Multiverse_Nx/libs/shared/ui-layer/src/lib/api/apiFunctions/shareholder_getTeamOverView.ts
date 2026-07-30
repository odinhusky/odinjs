import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { ShareholderCurrencyBaseParamsType } from "@shared-lib/api/commonTypes/shareholderTypes"

export type GetTeamOverViewParamsType = ShareholderCurrencyBaseParamsType
export type GetTeamOverViewRequestType = ShareholderCurrencyBaseParamsType

export interface GetTeamOverViewResponseType {
  direct_count: string // 直屬總人數
  team_member_count: string // 總人數
  total_received_commission: string // 直屬總佣金
}

// 取得團隊概覽
export const getTeamOverView = (params: GetTeamOverViewParamsType) => {
  return requestFn<GetTeamOverViewRequestType, GetTeamOverViewResponseType>(
    ENDPOINT_PATHS.SHAREHOLDER.GET_TEAM_OVERVIEW,
    params,
    {
      name: "getTeamOverView",
      method: "get"
    }
  )
}
