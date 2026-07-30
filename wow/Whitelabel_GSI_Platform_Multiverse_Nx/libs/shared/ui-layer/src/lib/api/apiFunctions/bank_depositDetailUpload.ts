import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { UploadDetailUpload } from "@shared-lib/api/commonTypes/bankTypes"

export type DepositDetailUploadParamsType = UploadDetailUpload
export type DepositDetailUploadRequestType = UploadDetailUpload

export const depositDetailUpload = (params: DepositDetailUploadParamsType) => {
  return requestFn<DepositDetailUploadRequestType, EmptyType>(ENDPOINT_PATHS.BANK.DEPOSIT_DETAIL_UPLOAD, params, {
    name: "depositDetailUpload",
    method: "post"
  })
}
