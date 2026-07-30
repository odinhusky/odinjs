import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { UploadRemark } from "@shared-lib/api/commonTypes/bankTypes"

export type WithdrawalRemarkResponseType = UploadRemark

export const withdrawalRemark = (transCode: string) => {
  return requestFn<EmptyType, WithdrawalRemarkResponseType>(
    `${ENDPOINT_PATHS.BANK.WITHDRAW_REMARK}/${transCode}`,
    null,
    {
      name: "withdrawRemark",
      method: "get"
    }
  )
}
