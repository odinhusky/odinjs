import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface EditBankCardParamsType {
  id: number
  payment_type_id: number
  payment_gateway_id?: number
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
}

export type EditBankCardRequestType = EditBankCardParamsType

export const editBankCard = (params: EditBankCardParamsType) => {
  return requestFn<EditBankCardRequestType, EmptyType>(`${ENDPOINT_PATHS.BANK.BANK_CARD}/${params.id}`, params, {
    name: "editBankCard",
    method: "put"
  })
}
