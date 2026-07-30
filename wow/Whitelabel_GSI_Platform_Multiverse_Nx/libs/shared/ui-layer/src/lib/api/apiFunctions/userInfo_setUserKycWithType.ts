import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { KycListWithType } from "@shared-lib/api/commonTypes/userInfoTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type SetUserKycWithTypeParamsType = KycListWithType
export type SetUserKycWithTypeRequestType = KycListWithType

// 原始對應名稱為 setUserKycV2
export const setUserKycWithType = (data: SetUserKycWithTypeParamsType) => {
  return requestFn<SetUserKycWithTypeRequestType, EmptyType>(ENDPOINT_PATHS.USER_INFO.USER_KYC_WITH_TYPE, data, {
    name: "setUserKycWithType",
    method: "post"
  })
}
