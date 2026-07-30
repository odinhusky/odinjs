import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface AddBankCardParamsType {
  id?: number
  payment_type_id: number
  payment_gateway_id?: number
  payment_gateway_name?: string
  pg_code?: string
  name?: string
  account_number?: string
  account_name?: string
  currency: string
  branch?: string
  bank_id?: number | string
  crypto_id?: number | string
  bank_name?: string
  wallet_address?: string
  currency_brand?: string
  chain?: string
  rate?: number
}

export type AddBankCardRequestType = AddBankCardParamsType

export const addBankCard = (params: AddBankCardParamsType) => {
  return requestFn<AddBankCardRequestType, EmptyType>(ENDPOINT_PATHS.BANK.BANK_CARD, params, {
    name: "addBankCard",
    method: "post"
  })
}
