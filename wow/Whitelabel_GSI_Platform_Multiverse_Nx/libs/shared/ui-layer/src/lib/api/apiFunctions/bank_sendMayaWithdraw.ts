import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"

export interface SendMayaWithdraw {
  currency: string
  amount: string
}

export type SendMayaWithdrawParamsType = SendMayaWithdraw
export type SendMayaWithdrawRequestType = SendMayaWithdraw


// 取得maya連結資訊
export const sendMayaWithdraw = (params: SendMayaWithdrawParamsType) => {
  return requestFn<SendMayaWithdrawRequestType, EmptyType>(ENDPOINT_PATHS.BANK.SEND_MAYA_WITHDRAW, params, {
    name: "sendMayaWithdraw",
    method: "post"
  })
}
