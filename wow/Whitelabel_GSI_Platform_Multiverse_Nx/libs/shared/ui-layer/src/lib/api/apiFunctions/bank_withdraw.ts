import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"

export type WithdrawRequestDynamicValue = string | number | string[] | null | undefined

export interface WithdrawRequestType {
  amount: string
  group_id: number
  payment_gateway_id?: number | null
  payment_type_id: number
  currency: string
  id: number
  [key: string]: WithdrawRequestDynamicValue
  bank_id: number
  remaining_turnover: string
  withdrawal_password: string
  balance: string
  crypto_rate?: string | number
  images: string[]
}

export const withdraw = (params: WithdrawRequestType) => {
  return requestFn<WithdrawRequestType, EmptyType>(ENDPOINT_PATHS.BANK.WITHDRAW, params, {
    name: "withdraw",
    method: "post"
  })
}
