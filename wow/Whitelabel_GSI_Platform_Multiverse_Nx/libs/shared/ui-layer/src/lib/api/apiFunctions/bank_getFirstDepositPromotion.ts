import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetFirstDepositPromotionRequestType {
  currency_id: number
  pop_out_type: number
}

export interface FirstDepositPromotionResponseType {
  integration_id: number
  game_code: string
  game_name?: string
  product_code: number
  product_name?: string
  game_type?: string
  game_type_id: number
  currency_code: string
  channel_code?: string
  rounds: number
}

export type GetFirstDepositPromotionResponseType = null | FirstDepositPromotionResponseType

export const getFirstDepositPromotion = (params: GetFirstDepositPromotionRequestType) => {
  return requestFn<GetFirstDepositPromotionRequestType, GetFirstDepositPromotionResponseType>(
    ENDPOINT_PATHS.BANK.FIRST_DEPOSIT_PROMOTION,
    params,
    {
      name: "getFirstDepositPromotion",
      method: "get"
    }
  )
}
