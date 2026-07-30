import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { PasswordBaseParamsType } from "@shared-lib/api/commonTypes/userInfoTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type SetUserPasswordParamsType = PasswordBaseParamsType
export type SetUserPasswordRequestType = SetUserPasswordParamsType

export const setUserPassword = (params: SetUserPasswordParamsType) => {
  return requestFn<SetUserPasswordRequestType, EmptyType>(ENDPOINT_PATHS.USER_INFO.USER_PASSWORD, params, {
    name: "setUserPassword",
    method: "put"
  })
}
