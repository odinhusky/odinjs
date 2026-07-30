import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { PaymentList } from "@shared-lib/api/commonTypes/bankTypes"

export type WithdrawalPaymentListResponseType = PaymentList

export const withdrawPaymentList = () => {
  return requestFn<EmptyType, WithdrawalPaymentListResponseType>(ENDPOINT_PATHS.BANK.WITHDRAW_PAYMENT_LIST, null, {
    name: "withdrawPaymentList",
    method: "get"
  })
}
