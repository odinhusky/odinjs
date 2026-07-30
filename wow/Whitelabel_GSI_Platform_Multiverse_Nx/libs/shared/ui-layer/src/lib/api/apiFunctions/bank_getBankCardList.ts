import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

//#region bank
export interface GetBankCardListParamsType {
  currency_id?: string
  payment_type_id?: string
  payment_gateway_id?: string
}

export interface BankCardItemType {
  id: number
  name: string
  bank_name: string
  account_number: string
  account_name: string
  currency_id: number
  payment_type_id: number
  payment_gateway_id?: number
  payment_gateway_name?: string
  payout_method_id?: number
  ewallet_provider_id?: number
  ewallet_provider_name?: string
  pg_code?: string
  currency_code: string
  branch: string
  bank_id: number
  crypto_id?: number
  deleted: boolean
  created_at: string
  chain: string
  currency_brand: string
  crypto_rate: number
  wallet_address: string
}

export type GetBankCardListRequestType = GetBankCardListParamsType | undefined

export interface GetBankCardListResponseType {
  list: BankCardItemType[]
}

export const getBankCardList = (params?: GetBankCardListParamsType) => {
  return requestFn<GetBankCardListRequestType, GetBankCardListResponseType>(ENDPOINT_PATHS.BANK.BANK_CARD, params, {
    name: "getBankCardList",
    method: "get"
  })
}
