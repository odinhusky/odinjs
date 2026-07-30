import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { PromotionResponseList } from "@shared-lib/api/commonTypes/promotionTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type GetPromotionListResponseType = PromotionResponseList

export const getPromotionList = () => {
  return requestFn<EmptyType, GetPromotionListResponseType>(ENDPOINT_PATHS.PROMOTION.LIST, null, {
    name: "getPromotionList",
    method: "get"
  })
}
