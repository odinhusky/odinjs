import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export const getPaymentImg = (id: number) => {
  return requestFn<EmptyType, string>(`${ENDPOINT_PATHS.BANK.PAYMENT_IMG}/${id}`, null, {
    name: "getPaymentImg",
    method: "get"
  })
}
