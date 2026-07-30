import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface ReferralWheelPrizeItem {
  id: number
  agent_id: number
  prize_name: string
  currency_id: number
  amount: string
  is_random_amount: boolean
  status: boolean
  sort_order: number
  created_at: string
  updated_at: string
  // 前端自訂義渲染欄位
  is_thank_you: boolean
  color: string
  textColor: string
  icon: string
  name: string
}

export type ReferralWheelPrizeList = ReferralWheelPrizeItem[]

export type GetReferralWheelPrizeResponseType = ReferralWheelPrizeList

export const getReferralWheelPrize = () => {
  return requestFn<EmptyType, GetReferralWheelPrizeResponseType>(ENDPOINT_PATHS.REFERRAL_WHEEL.PRIZE, null, {
    name: "getReferralWheelPrize",
    method: "get"
  })
}
