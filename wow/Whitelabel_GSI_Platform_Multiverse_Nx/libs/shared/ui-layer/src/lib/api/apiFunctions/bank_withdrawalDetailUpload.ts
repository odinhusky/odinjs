import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { UploadDetailUpload } from "@shared-lib/api/commonTypes/bankTypes"

export type WithdrawalDetailUploadParamsType = UploadDetailUpload
export type WithdrawalDetailUploadRequestType = UploadDetailUpload

export const withdrawalDetailUpload = (params: WithdrawalDetailUploadParamsType) => {
  return requestFn<WithdrawalDetailUploadRequestType, EmptyType>(ENDPOINT_PATHS.BANK.WITHDRAW_DETAIL_UPLOAD, params, {
    name: "withdrawalDetailUpload",
    method: "post"
  })
}
