import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { UserKycResponseList } from "@shared-lib/api/commonTypes/userInfoTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type GetUserKycResponseType = UserKycResponseList

// 原始對應名稱為 getUserKycV2
export const getUserKycWithType = () => {
  return requestFn<EmptyType, GetUserKycResponseType>(ENDPOINT_PATHS.USER_INFO.USER_KYC_WITH_TYPE, null, {
    name: "getUserKycWithType",
    method: "get"
  })
}
