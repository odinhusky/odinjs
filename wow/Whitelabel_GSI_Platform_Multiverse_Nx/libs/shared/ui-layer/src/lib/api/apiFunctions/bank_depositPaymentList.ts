import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { PaymentList } from "@shared-lib/api/commonTypes/bankTypes"

export type DepositPaymentListResponseType = PaymentList

export const depositPaymentList = () => {
  return requestFn<EmptyType, DepositPaymentListResponseType>(ENDPOINT_PATHS.BANK.DEPOSIT_PAYMENT_LIST, null, {
    name: "depositPaymentList",
    method: "get"
  })
}
