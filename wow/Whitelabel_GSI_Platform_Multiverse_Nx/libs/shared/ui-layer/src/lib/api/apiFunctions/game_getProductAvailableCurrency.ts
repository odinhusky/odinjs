import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface ProductAvailableCurrencyParamsType {
  product_code: string
  game_type_id?: number // 和 game_type 兩者至少填一
  integration_id?: string
  game_type?: string // 和 game_type_id 兩者至少填一
}

export type ProductAvailableCurrencyRequestType = ProductAvailableCurrencyParamsType

export type ProductAvailableCurrencyItem = {
  currency_id: number
  code: string
}

export type ProductAvailableCurrencyList = ProductAvailableCurrencyItem[]

export type ProductAvailableCurrencyResponseType = ProductAvailableCurrencyList

// 未登入時，允許拿特規的幣別，讓 Saba 專區能正常 call launchGuestGame API
export const getProductAvailableCurrency = (params: ProductAvailableCurrencyParamsType) => {
  return requestFn<ProductAvailableCurrencyRequestType, ProductAvailableCurrencyResponseType>(
    ENDPOINT_PATHS.GAME.PRODUCT_AVAILABLE_CURRENCY,
    params,
    {
      name: "getProductAvailableCurrency",
      method: "get"
    }
  )
}
