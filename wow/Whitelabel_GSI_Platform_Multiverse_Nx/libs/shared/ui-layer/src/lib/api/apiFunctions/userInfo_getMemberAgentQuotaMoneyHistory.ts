import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetMemberAgentQuotaMoneyHistoryParamsType {
  member_account: string
  str_time: string
  end_time: string
  search_type?: number
  size?: string
  offset?: string
}

export type GetMemberAgentQuotaMoneyHistoryRequestType = GetMemberAgentQuotaMoneyHistoryParamsType

export type GetMemberAgentQuotaMoneyHistory = {
  member_account: string
  id: number
  transaction_code: string
  wager_code: string
  product_name: string
  game_name: string
  promotion_title: null
  updated_at: string
  updated_at_unix: string
  currency_code: string
  action_type: number
  wallet_type: number
  amount: string
  before_balance: string
  after_balance: string
  metadata: object
  crypto_id: number
  crypto: string
  crypto_rate: string
  crypto_amount: string
}

export interface GetMemberAgentQuotaMoneyHistoryList {
  list: GetMemberAgentQuotaMoneyHistory[]
  offset: number
  size: number
  total: number
}

export type GetMemberAgentQuotaMoneyHistoryResponseType = GetMemberAgentQuotaMoneyHistoryList

// 取得下級會員額度帳變明細列表
export const getMemberAgentQuotaMoneyHistory = (params: GetMemberAgentQuotaMoneyHistoryParamsType) => {
  return requestFn<GetMemberAgentQuotaMoneyHistoryRequestType, GetMemberAgentQuotaMoneyHistoryResponseType>(
    ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_QUOTA_MONEY_HISTORY,
    params,
    {
      name: "getMemberAgentQuotaMoneyHistory",
      method: "get"
    }
  )
}
