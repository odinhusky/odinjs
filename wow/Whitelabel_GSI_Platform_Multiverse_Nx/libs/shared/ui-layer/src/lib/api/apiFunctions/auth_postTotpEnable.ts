import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { PostTotpEnableRequestType } from "@shared-lib/api/commonTypes/authTypes"

export type PostTotpEnableParamsType = PostTotpEnableRequestType

export const postTotpEnable = (params: PostTotpEnableRequestType) => {
  return requestFn<PostTotpEnableRequestType, EmptyType>(ENDPOINT_PATHS.AUTH.POST_TOTP_ENABLE, params, {
    name: "postTotpEnable",
    method: "post"
  })
}
