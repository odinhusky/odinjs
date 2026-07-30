import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { BaseCurrencyIDDurationWithOffsetAndSizeType, BaseList } from "@shared-lib/api/commonTypes"

export type GetMemberTeamAgentReportParamsType = BaseCurrencyIDDurationWithOffsetAndSizeType
export type GetMemberTeamAgentReportRequestType = BaseCurrencyIDDurationWithOffsetAndSizeType

export interface GetMemberTeamAgentReportResponseItem {
  deposit: number
  withdraw: number
  bet_count: number
  bet_amount: number
  valid_bet: number
  prize: number
  profit: number
  rate: number
  bonus: number
  member_id: number
  member_account: string
  member_count: number
  currency_id: number
}

export type GetMemberTeamAgentReportResponseList = GetMemberTeamAgentReportResponseItem[]

export type GetMemberTeamAgentReportResponseType = BaseList<GetMemberTeamAgentReportResponseList>

// 取得團隊代理報表
export const getMemberTeamAgentReport = (data: GetMemberTeamAgentReportParamsType) => {
  return requestFn<GetMemberTeamAgentReportRequestType, GetMemberTeamAgentReportResponseType>(
    ENDPOINT_PATHS.USER_INFO.MEMBER_TEAM_AGENT_REPORT,
    data,
    {
      name: "getMemberTeamAgentReport",
      method: "get"
    }
  )
}
