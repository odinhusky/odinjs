import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { BaseCurrencyIDDurationType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type GetMemberAgentReportParamsType = BaseCurrencyIDDurationType
export type GetMemberAgentReportRequestType = BaseCurrencyIDDurationType

export interface GetMemberAgentReportResponseType {
  personal: {
    deposit: number
    withdraw: number
    bet_count: number
    bet_amount: number
    valid_bet: number
    prize: number
    profit: number
    rate: number
    bonus: number
  }
  team: {
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
}

// 取得代理報表
export const getMemberAgentReport = (data: GetMemberAgentReportParamsType) => {
  return requestFn<GetMemberAgentReportRequestType, GetMemberAgentReportResponseType>(
    ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_REPORT,
    data,
    {
      name: "getMemberAgentReport",
      method: "get"
    }
  )
}
