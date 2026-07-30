import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface CurrencyItemType {
  id: number
  code: string
}

export interface GetAvailCurrencyListResponseType {
  currencies: CurrencyItemType[]
}

export const getAvailableCurrencyList = () => {
  return requestFn<EmptyType, GetAvailCurrencyListResponseType>(ENDPOINT_PATHS.BANK.AVAILABLE_CURRENCY_LIST, null, {
    name: "availCurrencyList",
    method: "get"
  })
}
