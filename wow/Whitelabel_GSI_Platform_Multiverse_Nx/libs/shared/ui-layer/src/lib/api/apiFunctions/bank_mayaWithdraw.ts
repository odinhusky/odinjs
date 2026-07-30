import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { MayaBaseType } from "@shared-lib/api/commonTypes/bankTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type MayaWithdrawParamsType = MayaBaseType
export type MayaWithdrawRequestType = MayaBaseType

export const mayaWithdraw = (params: MayaWithdrawParamsType) => {
  return requestFn<MayaWithdrawRequestType, EmptyType>(ENDPOINT_PATHS.BANK.MAYA_WITHDRAW, params, {
    name: "mayaWithdraw",
    method: "post"
  })
}
