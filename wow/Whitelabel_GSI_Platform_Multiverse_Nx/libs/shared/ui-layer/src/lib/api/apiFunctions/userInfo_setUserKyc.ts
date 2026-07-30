import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface SetUserKycParamstType {
  imgs?: string[]
}

export type SetUserKycRequestType = SetUserKycParamstType

export const setUserKyc = (params: SetUserKycParamstType) => {
  return requestFn<SetUserKycRequestType, EmptyType>(ENDPOINT_PATHS.USER_INFO.USER_KYC, params, {
    name: "setUserKyc",
    method: "post"
  })
}
