import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"

export interface GetMoneyHistoryTotalParamTypes {
  start_date: string
  end_date: string
  offset?: number
  size?: number
  wallet_types?: WALLET_TYPE_ENUMS[]
  updated_by?: string
  currency_id: string
}

export type GetMoneyHistoryTotalRequestTypes = GetMoneyHistoryTotalParamTypes

export type GetMoneyHistoryTotalResponseType = {
  valid_bet_amount_total: string
  player_profit: string
}

export const getMoneyHistoryTotal = (params: GetMoneyHistoryTotalParamTypes) => {
  return requestFn<GetMoneyHistoryTotalRequestTypes, GetMoneyHistoryTotalResponseType>(
    ENDPOINT_PATHS.REPORT.MONEY_HISTORY_TOTAL,
    params,
    {
      name: "getMoneyHistoryTotal",
      method: "get"
    }
  )
}
