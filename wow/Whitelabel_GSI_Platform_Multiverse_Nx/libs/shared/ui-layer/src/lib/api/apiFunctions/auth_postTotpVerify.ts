import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { PostTotpEnableRequestType } from "@shared-lib/api/commonTypes/authTypes"

export type PostTotpVerifyParamsType = PostTotpEnableRequestType
export type PostTotpVerifyRequestType = PostTotpEnableRequestType

export const postTotpVerify = (params: PostTotpVerifyParamsType) => {
  return requestFn<PostTotpVerifyRequestType, EmptyType>(ENDPOINT_PATHS.AUTH.POST_TOTP_VERIFY, params, {
    name: "postTotpVerify",
    method: "post"
  })
}
