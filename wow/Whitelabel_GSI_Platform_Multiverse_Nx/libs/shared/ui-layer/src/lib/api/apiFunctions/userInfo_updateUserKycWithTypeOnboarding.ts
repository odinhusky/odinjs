import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { KycListWithType } from "@shared-lib/api/commonTypes/userInfoTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type UpdateUserKycWithTypeOnboardingParamsType = KycListWithType
export type UpdateUserKycWithTypeOnboardingRequestType = KycListWithType

// 原始對應名稱為 updateUserKycV2Onboarding
export const updateUserKycWithTypeOnboarding = (params: UpdateUserKycWithTypeOnboardingParamsType) => {
  return requestFn<UpdateUserKycWithTypeOnboardingRequestType, EmptyType>(
    ENDPOINT_PATHS.USER_INFO.USER_KYC_WITH_TYPE_ONBOARDING,
    params,
    {
      name: "updateUserKycWithTypeOnboarding",
      method: "put"
    }
  )
}
