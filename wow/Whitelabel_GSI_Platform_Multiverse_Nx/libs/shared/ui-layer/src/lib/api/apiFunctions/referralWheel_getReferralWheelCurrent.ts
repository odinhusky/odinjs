import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType, TimeStringType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetReferralWheelCurrent {
  id: number
  agent_id: number
  start_time: TimeStringType
  end_time: TimeStringType
  timezone: number
  status: boolean
  created_at: string
  updated_at: string
}

export type GetReferralWheelCurrentResponseType = GetReferralWheelCurrent

export const getReferralWheelCurrent = () => {
  return requestFn<EmptyType, GetReferralWheelCurrentResponseType>(ENDPOINT_PATHS.REFERRAL_WHEEL.CURRENT, null, {
    name: "getReferralWheelCurrent",
    method: "get"
  })
}
