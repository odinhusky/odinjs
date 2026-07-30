import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface PostReferralWheelSpinParamsType {
  currency_id: number
}

export type PostReferralWheelSpinRequestType = PostReferralWheelSpinParamsType

export interface PostReferralWheelSpinResponseType {
  is_winning: boolean
  winning: {
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
}

export const postReferralWheelSpin = (params: PostReferralWheelSpinParamsType) => {
  return requestFn<PostReferralWheelSpinRequestType, PostReferralWheelSpinResponseType>(
    ENDPOINT_PATHS.REFERRAL_WHEEL.SPIN,
    params,
    {
      name: "postReferralWheelSpin",
      method: "post"
    }
  )
}
