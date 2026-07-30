import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface ResetPasswordParamsType {
  token: string
  account?: string
  password: string
  confirm_password: string
}

export type ResetPasswordRequestType = ResetPasswordParamsType
export type ResetPasswordResponseType = Record<string, never>

export const resetPassword = (params: ResetPasswordParamsType) => {
  return requestFn<ResetPasswordRequestType, ResetPasswordResponseType>(ENDPOINT_PATHS.AUTH.RESET_PASSWORD, params, {
    name: "resetPassword",
    method: "put",
    needToken: false
  })
}
