import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export const getReferralWheelStatus = () => {
  return requestFn<EmptyType, boolean>(ENDPOINT_PATHS.REFERRAL_WHEEL.STATUS, null, {
    name: "getReferralWheelStatus",
    method: "get"
  })
}
