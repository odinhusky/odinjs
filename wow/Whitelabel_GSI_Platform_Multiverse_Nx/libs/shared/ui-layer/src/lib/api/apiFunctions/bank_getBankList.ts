import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetBankListParamsType {
  payment_gateway_id?: number
  payment_type_id?: number
}

export interface BankItemType {
  id: number
  name: string
}

export type GetBankListRequestType = GetBankListParamsType | undefined

export interface GetBankListResponseType {
  list: BankItemType[]
}

export const getBankList = (params?: GetBankListParamsType) => {
  return requestFn<GetBankListRequestType, GetBankListResponseType>(ENDPOINT_PATHS.BANK.BANK_LIST, params, {
    name: "getBankList",
    method: "get"
  })
}
