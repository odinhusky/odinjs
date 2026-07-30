import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { UploadRemark } from "@shared-lib/api/commonTypes/bankTypes"

export type DepositRemarkResponseType = UploadRemark

export const depositRemark = (transCode: string) => {
  return requestFn<EmptyType, DepositRemarkResponseType>(`${ENDPOINT_PATHS.BANK.DEPOSIT_REMARK}/${transCode}`, null, {
    name: "depositRemark",
    method: "get"
  })
}
