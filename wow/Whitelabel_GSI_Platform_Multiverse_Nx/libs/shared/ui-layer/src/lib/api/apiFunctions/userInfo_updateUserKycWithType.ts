import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { KycListWithType } from "@shared-lib/api/commonTypes/userInfoTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type UpdateUserKycWithTypeParamsType = KycListWithType
export type UpdateUserKycWithTypeRequestType = KycListWithType

// 原始對應名稱為 updateUserKycV2
export const updateUserKycWithType = (params: UpdateUserKycWithTypeParamsType) => {
  return requestFn<UpdateUserKycWithTypeRequestType, EmptyType>(ENDPOINT_PATHS.USER_INFO.USER_KYC_WITH_TYPE, params, {
    name: "updateUserKycWithType",
    method: "put"
  })
}
