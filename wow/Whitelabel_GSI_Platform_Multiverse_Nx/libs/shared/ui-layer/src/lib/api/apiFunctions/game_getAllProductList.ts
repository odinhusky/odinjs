import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import{ ProductList } from "@shared-lib/api/commonTypes/gameTypes"

export type GetAllProductListResponseType = ProductList

export const getAllProductList = () => {
  return requestFn<EmptyType, GetAllProductListResponseType>(ENDPOINT_PATHS.GAME.ALL_PRODUCT_LIST, null, {
    name: "getAllProductList",
    method: "get"
  })
}
