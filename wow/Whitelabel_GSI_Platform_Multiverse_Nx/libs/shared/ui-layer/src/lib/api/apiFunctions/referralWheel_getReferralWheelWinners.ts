import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetReferralWheelWinnerItem {
  account: string
  amount: string
  time: string
}

export type GetReferralWheelWinners = GetReferralWheelWinnerItem[]

export type GetReferralWheelWinnersResponseType = GetReferralWheelWinners

export const getReferralWheelWinners = () => {
  return requestFn<EmptyType, GetReferralWheelWinnersResponseType>(ENDPOINT_PATHS.REFERRAL_WHEEL.WINNERS, null, {
    name: "getReferralWheelWinners",
    method: "get"
  })
}
