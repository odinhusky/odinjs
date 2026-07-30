import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface SetUserAvatarParamsType {
  img: string
}

export type SetUserAvatarRequestType = SetUserAvatarParamsType

export const setUserAvatar = (params: SetUserAvatarParamsType) => {
  return requestFn<SetUserAvatarRequestType, EmptyType>(ENDPOINT_PATHS.USER_INFO.USER_AVATAR, params, {
    name: "setUserAvatar",
    method: "post"
  })
}
