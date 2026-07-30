import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { GetKYCStatusBaseResponseType } from "@shared-lib/api/commonTypes/userInfoTypes"

export type GetKYCStatusResponseType = GetKYCStatusBaseResponseType

export const getKycStatus = () => {
  return requestFn<EmptyType, GetKYCStatusResponseType>(ENDPOINT_PATHS.USER_INFO.KYC_STATUS, null, {
    name: "getKycStatus",
    method: "get"
  })
}
