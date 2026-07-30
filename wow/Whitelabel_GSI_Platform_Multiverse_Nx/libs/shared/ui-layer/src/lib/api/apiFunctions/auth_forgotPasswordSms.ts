import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface ForgotPasswordSmsParamsType {
  phone: string
  sms_otp: string
  country_code?: string
}

export type ForgotPasswordSmsRequestType = ForgotPasswordSmsParamsType

export interface ForgotPasswordSmsResponseType {
  token: string
  account: string
}

export const forgotPasswordSms = (params: ForgotPasswordSmsParamsType) => {
  return requestFn<ForgotPasswordSmsRequestType, ForgotPasswordSmsResponseType>(
    ENDPOINT_PATHS.AUTH.FORGOT_PASSWORD_SMS,
    params,
    {
      name: "forgotPasswordSms",
      method: "post",
      needToken: false
    }
  )
}
