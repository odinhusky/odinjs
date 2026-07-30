import { requestFn } from "../axiosInterceptors"
import { EmptyType } from "../commonTypes"
import { ENDPOINT_PATHS } from "../endpointPaths"

export interface ReferralRebateGroupResponseType {
  rebate_target: number
}

export const getReferralRebateGroup = () => {
  return requestFn<EmptyType, ReferralRebateGroupResponseType>(ENDPOINT_PATHS.REFERRAL_REBATE.GROUP, null, {
    name: "getReferralRebateGroup",
    method: "get"
  })
}
