import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

//#region bank
export interface GetUserBankInfoParamsType {
  id: number
}

export type GetBankCardInfoRequestType = GetUserBankInfoParamsType | undefined

export interface GetBankCardInfoResponseType {
  payment_type_id: number
  payment_gateway_id: number
  payout_method_id?: number
  ewallet_provider_id?: number
  name: string
  bank_name: string
  currency_id: number
  account_number: string
  account_name: string
  crypto_id: number
  bank_id: number
  wallet_address: string
  currency_brand: string
  chain: string
}

export const getBankCardInfo = (params: GetUserBankInfoParamsType) => {
  return requestFn<GetBankCardInfoRequestType, GetBankCardInfoResponseType>(
    `${ENDPOINT_PATHS.BANK.BANK_CARD}/${params.id}`,
    undefined,
    {
      name: "getBankCardInfo",
      method: "get"
    }
  )
}
