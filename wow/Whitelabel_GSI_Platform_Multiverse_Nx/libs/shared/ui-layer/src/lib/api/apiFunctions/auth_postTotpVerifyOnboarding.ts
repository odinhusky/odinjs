import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { PostTotpEnableRequestType } from "@shared-lib/api/commonTypes/authTypes"

export type PostTotpVerifyOnboardingParamsType = PostTotpEnableRequestType
export type PostTotpVerifyOnboardingRequestType = PostTotpEnableRequestType

export const postTotpVerifyOnboarding = (params: PostTotpVerifyOnboardingParamsType) => {
  return requestFn<PostTotpVerifyOnboardingRequestType, EmptyType>(
    ENDPOINT_PATHS.AUTH.POST_TOTP_VERIFY_ONBOARDING,
    params,
    {
      name: "postTotpVerifyOnboarding",
      method: "post"
    }
  )
}
