import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { KycListWithType } from "@shared-lib/api/commonTypes/userInfoTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type SetUserKycWithTypeOnboardingParamsType = KycListWithType
export type SetUserKycWithTypeOnboardingRequestType = KycListWithType

// 原始對應名稱為 setUserKycV2Onboarding
export const setUserKycWithTypeOnboarding = (data: SetUserKycWithTypeOnboardingParamsType) => {
  return requestFn<SetUserKycWithTypeOnboardingRequestType, EmptyType>(
    ENDPOINT_PATHS.USER_INFO.USER_KYC_WITH_TYPE_ONBOARDING,
    data,
    {
      name: "setUserKycWithTypeOnboarding",
      method: "post"
    }
  )
}
