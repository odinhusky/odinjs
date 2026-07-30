import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { GetTotpStatusResponseType } from "@shared-lib/api/commonTypes/authTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type GetTotpStatusOnboardingResponseType = GetTotpStatusResponseType

export const getTotpStatusOnboarding = () => {
  return requestFn<EmptyType, GetTotpStatusOnboardingResponseType>(
    ENDPOINT_PATHS.AUTH.GET_TOTP_STATUS_ONBOARDING,
    null,
    {
      name: "getTotpStatusOnboarding",
      method: "get"
    }
  )
}
