import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { BaseList } from "@shared-lib/api/commonTypes"
import { REPORT_DATE_TYPES_ENUMS } from "@shared-lib/constants/enums/reportDateTypes"
import { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"
import { ACTION_TYPE_ENUMS } from "@shared-lib/constants/enums/actionType"

export interface GetMoneyHistoryListParamTypes {
  search_type: string[]
  start_date: string
  end_date: string
  offset: number
  size: number
  dateType?: REPORT_DATE_TYPES_ENUMS
  wallet_types: WALLET_TYPE_ENUMS[]
  updated_by?: string
  currency_id?: string
}

export type GetMoneyHistoryListRequestTypes = GetMoneyHistoryListParamTypes

export interface GetMoneyHistoryItem {
  id: number
  game_name?: string
  product_name?: string
  promotion_title?: {
    [key: string]: string
  } | null
  transaction_code?: string
  wager_code?: string
  updated_at?: string
  currency_code?: string
  action_type?: ACTION_TYPE_ENUMS
  amount?: string
  before_balance?: string
  after_balance?: string
  action_target?: string
  wallet_type: WALLET_TYPE_ENUMS
  updated_by?: number
}

export type GetMoneyHistoryList = GetMoneyHistoryItem[]

export type GetMoneyHistoryListResponseType = BaseList<GetMoneyHistoryList>

export const getMoneyHistoryList = (params: GetMoneyHistoryListParamTypes) => {
  return requestFn<GetMoneyHistoryListRequestTypes, GetMoneyHistoryListResponseType>(
    ENDPOINT_PATHS.REPORT.MONEY_HISTORY_LIST,
    params,
    {
      name: "getMoneyHistoryList",
      method: "get"
    }
  )
}
