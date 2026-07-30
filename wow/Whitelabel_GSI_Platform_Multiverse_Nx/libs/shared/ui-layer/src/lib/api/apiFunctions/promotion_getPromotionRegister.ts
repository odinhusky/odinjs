import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { PromotionResponseItem } from "@shared-lib/api/commonTypes/promotionTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type PromotionReward = {
  amount: string
  condition: string
  currency_id: number
  id: number
  level: number
  limit: string
  negative_profit_condition: string
  negative_profit_type: number
  promotion_id: number
  type: number
}

export type PromotionRegisterItem = PromotionResponseItem & {
  reward: PromotionReward[]
}

export type PromotionRegisterList = PromotionRegisterItem[]

export type GetPromotionRegisterResponseType = PromotionRegisterList

export const getPromotionRegister = () => {
  return requestFn<EmptyType, GetPromotionRegisterResponseType>(ENDPOINT_PATHS.PROMOTION.REGISTER, null, {
    name: "getPromotionRegister",
    method: "get"
  })
}
