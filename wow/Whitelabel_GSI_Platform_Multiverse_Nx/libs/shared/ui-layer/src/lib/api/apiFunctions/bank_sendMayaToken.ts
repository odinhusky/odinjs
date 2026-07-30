import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"

export interface SendMayaToken {
  payment_gateway_name: string
  code: string
}

export type SendMayaTokenParamsType = SendMayaToken
export type SendMayaTokenRequestType = SendMayaToken


// 取得maya連結資訊
export const sendMayaToken = (params: SendMayaTokenParamsType) => {
  return requestFn<SendMayaTokenRequestType, EmptyType>(ENDPOINT_PATHS.BANK.SEND_MAYA_TOKEN, params, {
    name: "sendMayaToken",
    method: "post"
  })
}
