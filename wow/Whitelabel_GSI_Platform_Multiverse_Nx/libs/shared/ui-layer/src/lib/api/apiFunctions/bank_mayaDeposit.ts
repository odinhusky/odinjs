import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { DepositResponseType, MayaBaseType } from "@shared-lib/api/commonTypes/bankTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface MayaDepositRequestType extends MayaBaseType {
  promotion_id: number
}

export type MayaDepositParamsType = MayaDepositRequestType

export const mayaDeposit = (params: MayaDepositParamsType) => {
  return requestFn<MayaDepositRequestType, DepositResponseType>(ENDPOINT_PATHS.BANK.MAYA_DEPOSIT, params, {
    name: "mayaDeposit",
    method: "post"
  })
}
