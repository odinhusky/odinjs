import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetMemberAgentBetReportParamsType {
  currency_id: number
  str_time: string
  end_time: string
  member_account?: string
  order_type?: string
  sort_type?: string
  offset: number
  size: number
}

export type GetMemberAgentBetReportRequestType = GetMemberAgentBetReportParamsType

export interface GetMemberAgentBetReportResponseItem {
  bet_amount: string
  bet_count: number
  bonus: string
  member_account: string
  member_id: number
  payout: string
  profit: string
  profit_rate: string
  valid_bet_amount: string
  win_count: number
}

export type GetMemberAgentBetReportResponseList = GetMemberAgentBetReportResponseItem[]

export interface GetMemberAgentBetReportSummaryItemPage {
  bet_amount: string
  bet_count: number
  bonus: string
  payout: string
  profit: string
  profit_rate: string
  valid_bet_amount: string
  win_count: number
}

export type GetMemberAgentBetReportSummaryItemTotal = GetMemberAgentBetReportSummaryItemPage

export interface GetMemberAgentBetReportSummaryItem {
  page: GetMemberAgentBetReportSummaryItemPage
  total: GetMemberAgentBetReportSummaryItemTotal
}

export interface GetMemberAgentBetReportList {
  list: GetMemberAgentBetReportResponseList
  summary: GetMemberAgentBetReportSummaryItem
  offset: number
  size: number
  total: number
}

export type GetMemberAgentBetReportResponseType = GetMemberAgentBetReportList

// 取得投注報表紀錄
export const getMemberAgentBetReport = (params: GetMemberAgentBetReportParamsType) => {
  return requestFn<GetMemberAgentBetReportRequestType, GetMemberAgentBetReportResponseType>(
    ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_BET_REPORT,
    params,
    {
      name: "getMemberAgentBetReport",
      method: "get"
    }
  )
}
