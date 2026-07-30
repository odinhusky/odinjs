import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface ReferralInfo {
  url: string
  code: string
}

export type GetReferralInfoResponseType = ReferralInfo

export const getReferralInfo = () => {
  return requestFn<EmptyType, GetReferralInfoResponseType>(ENDPOINT_PATHS.REFERRAL.INFO, null, {
    name: "getReferralInfo",
    method: "get"
  })
}
