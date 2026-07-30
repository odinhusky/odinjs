import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { LOGIN_METHOD_ENUMS } from "@shared-lib/constants/enums/loginMethod"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { LoginResponseType } from "@shared-lib/api/commonTypes/authTypes"

export interface LoginByTokenParamsType {
  login_method: LOGIN_METHOD_ENUMS
  username?: string
  password?: string
  phone?: string
  sms_otp?: string
  country?: string
}

export type LoginByTokenRequestType = LoginByTokenParamsType

export const loginByToken = (login_token: string) => {
  return requestFn<EmptyType, LoginResponseType>(`${ENDPOINT_PATHS.AUTH.LOGIN}/${login_token}`, null, {
    name: "loginByToken",
    method: "post",
    needToken: false
  })
}
