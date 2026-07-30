import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, put, patch } from "@/utils/request"
import { queryClient } from "@/query/queryClient"

// 產品類型下拉
export const getProductGameType = async (params?: Request.GetProductGameType) => {
  return get<Response.ProductGameTypeList>("product/game_type/dropdown", params)
}

export type productGameCode = {
  only_actived?: boolean
  currency?: number
  game_type?: number
}
export const getProductDropdown = async (params?: productGameCode) => {
  return queryClient.fetchQuery({
    queryKey: ["product", "dropdown", params ?? {}],
    queryFn: () => get<Response.ProductDropdownList>("product/dropdown", params)
  })
}
// 產品開關列表
export const getProductList = async (params: Request.GetProductList) => {
  const payload: Request.GetProductList = {
    offset: params?.offset,
    size: params?.size,
    title: params?.keyword,
    code: params?.code,
    game_type: params?.game_type
  }
  return get<Response.GetProductList>("/product/list", payload)
}

export const setProductStstus = async (params: Request.SetProductStatus) => {
  return put("/product/status", params)
}

export const setProductCustomImage = async (params: Request.SetProductCustomImage) => {
  return put(`/product/${params.product_id}/custom_image`, params)
}

export const setProductPosition = async (params: Request.setProductPosition) => {
  return patch(`/product/${params.product_id}/position`, params)
}

export const getProductMaintenSetting = async (params: Request.GetProductMaintenSetting) => {
  const payload: Request.GetProductMaintenSetting = {
    product_type: params.product_type,
    product: params.product
  }
  return get<Response.GetProductList>("/product/productMaintenanceSetting", payload)
}
