import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { REGISTER_METHOD_ENUMS } from "@shared-lib/constants/enums/registerMethod"

export interface RegisterSmsParamsType {
  register_method: REGISTER_METHOD_ENUMS
  phone: string
  sms_otp: string
  country: string
}

export type RegisterSmsRequestType = RegisterSmsParamsType

export const registerSms = (params: RegisterSmsParamsType) => {
  return requestFn<RegisterSmsRequestType, EmptyType>(ENDPOINT_PATHS.AUTH.REGISTER, params, {
    name: "registerSms",
    method: "post",
    needToken: false
  })
}
