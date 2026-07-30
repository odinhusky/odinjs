import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { PostTotpEnableRequestType } from "@shared-lib/api/commonTypes/authTypes"

export type PostTotpEnableOnboardingParamsType = PostTotpEnableRequestType
export type PostTotpEnableOnboardingRequestType = PostTotpEnableRequestType

export const postTotpEnableOnboarding = (params: PostTotpEnableOnboardingParamsType) => {
  return requestFn<PostTotpEnableOnboardingRequestType, EmptyType>(
    ENDPOINT_PATHS.AUTH.POST_TOTP_ENABLE_ONBOARDING,
    params,
    {
      name: "postTotpEnableOnboarding",
      method: "post"
    }
  )
}
