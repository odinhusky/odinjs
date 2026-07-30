import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"

export interface MoneyPendingCancelParamTypes {
  order_type: string
  trans_code: string
}

export type MoneyPendingCancelRequestTypes = MoneyPendingCancelParamTypes

export const moneyPendingCancel = (params: MoneyPendingCancelParamTypes) => {
  return requestFn<MoneyPendingCancelRequestTypes, EmptyType>(ENDPOINT_PATHS.REPORT.MONEY_PENDING_CANCEL, params, {
    name: "moneyPendingCancel",
    method: "post"
  })
}
