import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { ProductList } from "@shared-lib/api/commonTypes/gameTypes"

export interface GetProductListParamsType {
  game_type?: string | number
  game_type_id: number
  currency?: string
}

export type GetProductListRequestType = GetProductListParamsType
export type GetProductListResponseType = ProductList

export const getProductList = (params: GetProductListParamsType) => {
  return requestFn<GetProductListRequestType, GetProductListResponseType>(ENDPOINT_PATHS.GAME.PRODUCT_LIST, params, {
    name: "getGameTypeList",
    method: "get",
    forceBearerUndefinedWhenNoToken: true
  })
}
