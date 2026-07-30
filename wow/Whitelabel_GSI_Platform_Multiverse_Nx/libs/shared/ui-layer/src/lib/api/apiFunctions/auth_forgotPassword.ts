import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface ForgotPasswordParamsType {
  account: string
  email: string
}

export type ForgotPasswordRequestType = ForgotPasswordParamsType
export type ForgotPasswordResponseType = Record<string, never>

export const forgotPassword = (params: ForgotPasswordParamsType) => {
  return requestFn<ForgotPasswordRequestType, ForgotPasswordResponseType>(ENDPOINT_PATHS.AUTH.FORGOT_PASSWORD, params, {
    name: "forgotPassword",
    method: "post",
    needToken: false
  })
}
