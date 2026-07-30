import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { UserKycResponseList } from "@shared-lib/api/commonTypes/userInfoTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type GetUserKycWithTypeOnboardingResponseType = UserKycResponseList

// 原始對應名稱為 getUserKycV2Onboarding
export const getUserKycWithTypeOnboarding = () => {
  return requestFn<EmptyType, GetUserKycWithTypeOnboardingResponseType>(
    ENDPOINT_PATHS.USER_INFO.USER_KYC_WITH_TYPE_ONBOARDING,
    null,
    {
      name: "getUserKycWithTypeOnboarding",
      method: "get"
    }
  )
}
