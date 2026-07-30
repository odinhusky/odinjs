import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface PaymentGatewayItemType {
  id: number
  name: string
  type: number
}

export type GetPaymentGatewayListResponseType = PaymentGatewayItemType[]

export const getPaymentGatewayList = () => {
  return requestFn<EmptyType, GetPaymentGatewayListResponseType>(ENDPOINT_PATHS.BANK.PAYMENT_GATEWAY_LIST, null, {
    name: "paymentGatewayList",
    method: "get"
  })
}
