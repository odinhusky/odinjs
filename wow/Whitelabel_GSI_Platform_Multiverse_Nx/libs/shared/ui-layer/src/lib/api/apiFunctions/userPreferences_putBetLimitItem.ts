import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface PutBetLimitItemParamsType {
  restriction_id: number
  setting_id: number
  currency_id: number
  now_date_time: number
  restrict_amount: number
}

export type PutBetLimitItemRequestType = PutBetLimitItemParamsType

export const putBetLimitItem = (params: PutBetLimitItemParamsType) => {
  return requestFn<PutBetLimitItemRequestType, EmptyType>(ENDPOINT_PATHS.USER_PREFERENCES.BET_LIMIT_STATUS, params, {
    name: "putBetLimitItem",
    method: "put"
  })
}
