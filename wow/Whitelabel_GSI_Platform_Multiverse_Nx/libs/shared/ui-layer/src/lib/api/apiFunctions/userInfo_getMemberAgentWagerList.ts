import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetMemberAgentWagerListParamsType {
  currency_id: number
  str_time: string
  end_time: string
  member_account?: string
  wager_code?: string
  date_type?: number[] // 0: 投注日期, 1: 結算日期, 2: 全選
  offset: number
  size: number
}

export type GetMemberAgentWagerListRequestType = GetMemberAgentWagerListParamsType

export interface GetMemberAgentWagerListItemData {
  bet_amount: string
  channel_code: string
  created_at: string
  game_title: string
  gaming_site: number
  gaming_site_title: string
  member_account: string
  payload: { [key: string]: any }
  payout: string
  product_code: number
  product_title: string
  profit: string
  settled_at: string
  status: number
  status_title: string
  valid_bet_amount: string
  wager_code: string
}

export interface GetMemberAgentWagerListItemSummaryPage {
  bet_amount: string
  payout: string
  profit: string
  total: number
  valid_bet_amount: string
}

export type GetMemberAgentWagerListItemSummaryTotal = GetMemberAgentWagerListItemSummaryPage

export interface GetMemberAgentWagerListItemSummary {
  page: GetMemberAgentWagerListItemSummaryPage
  total: GetMemberAgentWagerListItemSummaryTotal
}

export interface GetMemberAgentWagerList {
  list: GetMemberAgentWagerListItemData[]
  summary: GetMemberAgentWagerListItemSummary
  offset: number
  size: number
  total: number
}

export type GetMemberAgentWagerListResponseType = GetMemberAgentWagerList

// 取得投注紀錄查詢
export const getMemberAgentWagerList = (data: GetMemberAgentWagerListParamsType) => {
  return requestFn<GetMemberAgentWagerListRequestType, GetMemberAgentWagerListResponseType>(
    ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_WAGER_LIST,
    data,
    {
      name: "getMemberAgentWagerList",
      method: "get"
    }
  )
}
