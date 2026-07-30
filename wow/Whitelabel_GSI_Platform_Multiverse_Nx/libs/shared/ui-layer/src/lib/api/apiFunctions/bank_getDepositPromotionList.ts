import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { DepositRequestType } from "@shared-lib/api/commonTypes/bankTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface DepositPromotionDetailObject {
  title?: string
  name?: string
  content?: string
  description?: string
  text?: string
}

export type DepositPromotionDetailValue = string | DepositPromotionDetailObject | null | undefined
export type DepositPromotionDetails = Record<string, DepositPromotionDetailValue>

export type DepositPromotion = {
  id: number
  offer_type: number
  details: DepositPromotionDetails
  reward: { condition: number; currency_id: number; amount: number; type: number; limit: number; reward_amount: number }
  title: string
}

export interface GetDepositPromotionListRequestType {
  currency: string
  deposit_amount: string | number
  deposit_gateway_id: number
}

export type GetDepositPromotionListResponseType = DepositPromotion[]

export const getDepositPromotionList = (params: DepositRequestType) => {
  const payload = {
    currency: params.currency,
    deposit_amount: params.amount !== "" ? params.amount : 0,
    deposit_gateway_id: params.payment_gateway_id
  }

  return requestFn<GetDepositPromotionListRequestType, GetDepositPromotionListResponseType>(
    ENDPOINT_PATHS.BANK.DEPOSIT_PROMOTION_LIST,
    payload,
    {
      name: "getDepositPromotionList",
      method: "get"
    }
  )
}
