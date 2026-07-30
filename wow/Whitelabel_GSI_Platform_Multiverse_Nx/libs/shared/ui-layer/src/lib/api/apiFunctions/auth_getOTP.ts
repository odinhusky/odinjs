import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { SMS_OTP_TYPE_ENUMS } from "@shared-lib/constants/enums/smsOtpType"

export interface GetOTP {
  phone_number: string
  country_code?: string
  request_type: SMS_OTP_TYPE_ENUMS
}

export type GetOTPParmasType = GetOTP
export type GetOTPRequestType = GetOTP
export type GetOTPResponseType = EmptyType

export const getOTP = (params: GetOTPParmasType) => {
  return requestFn<GetOTPRequestType, GetOTPResponseType>(ENDPOINT_PATHS.AUTH.GET_OTP, params, {
    name: "getOTP",
    method: "post",
    needToken: false
  })
}
