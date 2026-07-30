import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { DepositRequestType, DepositResponseType } from "@shared-lib/api/commonTypes/bankTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type DepositParamsType = DepositRequestType

export const deposit = (params: DepositParamsType) => {
  return requestFn<DepositRequestType, DepositResponseType>(ENDPOINT_PATHS.BANK.DEPOSIT, params, {
    name: "deposit",
    method: "post"
  })
}
