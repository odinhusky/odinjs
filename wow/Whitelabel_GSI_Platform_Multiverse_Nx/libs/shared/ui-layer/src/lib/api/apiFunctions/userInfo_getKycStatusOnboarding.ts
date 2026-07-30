import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { GetKYCStatusBaseResponseType } from "@shared-lib/api/commonTypes/userInfoTypes"

export type GetKYCStatusOnboardingResponseType = GetKYCStatusBaseResponseType

export const getKycStatusOnboarding = () => {
  return requestFn<EmptyType, GetKYCStatusOnboardingResponseType>(
    ENDPOINT_PATHS.USER_INFO.KYC_STATUS_ONBOARDING,
    null,
    {
      name: "getKycStatusOnboarding",
      method: "get"
    }
  )
}
