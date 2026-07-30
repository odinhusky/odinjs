import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { LOGIN_METHOD_ENUMS } from "@shared-lib/constants/enums/loginMethod"
import { LoginResponseType } from "@shared-lib/api/commonTypes/authTypes"

export interface LoginParamsType {
  login_method: LOGIN_METHOD_ENUMS
  username?: string
  password?: string
  phone?: string
  sms_otp?: string
  country?: string
}

export type LoginRequestType = LoginParamsType

export const login = (params: LoginParamsType) => {
  return requestFn<LoginRequestType, LoginResponseType>(ENDPOINT_PATHS.AUTH.LOGIN, params, {
    name: "login",
    method: "post",
    needToken: false
  })
}
