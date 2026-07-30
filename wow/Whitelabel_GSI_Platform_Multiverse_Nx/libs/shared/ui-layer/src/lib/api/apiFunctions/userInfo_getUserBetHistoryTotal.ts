import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type UserBetHistoryTotalItem = {
  currency_code: string
  win_loss_amount: string
}

export type GetUserBetHistoryTotalResponseType = {
  login_at: number
  bet_historys: UserBetHistoryTotalItem[]
}

export const getUserBetHistoryTotal = () => {
  return requestFn<EmptyType, GetUserBetHistoryTotalResponseType>(ENDPOINT_PATHS.USER_INFO.BET_HISTORY_TOTAL, null, {
    name: "getUserBetHistoryTotal",
    method: "get"
  })
}
