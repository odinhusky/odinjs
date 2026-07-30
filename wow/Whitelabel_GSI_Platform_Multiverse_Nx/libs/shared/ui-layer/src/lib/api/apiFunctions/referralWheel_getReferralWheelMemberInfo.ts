import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetReferralWheelMemberInfoParamsType {
  referral_wheel_id: number
}

export type GetReferralWheelMemberInfoRequestType = GetReferralWheelMemberInfoParamsType

export interface ReferralWheelBonusItem {
  total_amount: string
  currency_id: number
}

export interface ReferralWheelBonusSpinInfo {
  id: number
  referral_wheel_id: number
  member_id: number
  member_account: string
  max_spin_count: number
  used_spin_count: number
  last_spin_at: string
  created_at: string
  updated_at: string
}

export interface GetReferralWheelMemberInfo {
  bonus: ReferralWheelBonusItem[]
  spin_info: ReferralWheelBonusSpinInfo
}

export type GetReferralWheelMemberInfoResponseType = GetReferralWheelMemberInfo

export const getReferralWheelMemberInfo = (params: GetReferralWheelMemberInfoParamsType) => {
  return requestFn<GetReferralWheelMemberInfoRequestType, GetReferralWheelMemberInfoResponseType>(
    ENDPOINT_PATHS.REFERRAL_WHEEL.MEMBER_INFO,
    params,
    {
      name: "getReferralWheelMemberInfo",
      method: "get"
    }
  )
}
