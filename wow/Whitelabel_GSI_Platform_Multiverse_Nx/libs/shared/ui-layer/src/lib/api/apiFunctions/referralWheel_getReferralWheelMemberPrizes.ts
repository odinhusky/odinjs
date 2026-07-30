import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetReferralWheelMemberPrizesParamsType {
  referral_wheel_id: number
}

export type GetReferralWheelMemberPrizesRequestType = GetReferralWheelMemberPrizesParamsType

export interface GetReferralWheelMemberPrizeItem {
  id: number
  referral_wheel_id: number
  member_id: number
  member_account: string
  prize_id: number
  prize_name: string
  currency_id: number
  amount: string
  created_at: string
  updated_at: string
}

export type GetReferralWheelMemberPrizes = GetReferralWheelMemberPrizeItem[]

export type GetReferralWheelMemberPrizesResponseType = GetReferralWheelMemberPrizes

export const getReferralWheelMemberPrizes = (params: GetReferralWheelMemberPrizesParamsType) => {
  return requestFn<GetReferralWheelMemberPrizesRequestType, GetReferralWheelMemberPrizesResponseType>(
    ENDPOINT_PATHS.REFERRAL_WHEEL.MEMBER_PRIZES,
    params,
    {
      name: "getReferralWheelMemberPrizes",
      method: "get"
    }
  )
}
