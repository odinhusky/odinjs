import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { KycRecordResponseList } from "@shared-lib/api/commonTypes/userInfoTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type UserKycRecordResponseType = KycRecordResponseList

export const userKycRecord = () => {
  return requestFn<EmptyType, UserKycRecordResponseType>(ENDPOINT_PATHS.USER_INFO.USER_KYC_RECORD, null, {
    name: "userKycRecord",
    method: "get"
  })
}
