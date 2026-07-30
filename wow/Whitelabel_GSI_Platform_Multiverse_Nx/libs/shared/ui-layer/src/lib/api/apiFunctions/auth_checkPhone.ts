import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface CheckPhoneParamsType {
  phone_number: string
}

export type CheckPhoneRequestType = CheckPhoneParamsType

export const checkPhone = (params: CheckPhoneParamsType) => {
  return requestFn<CheckPhoneRequestType, EmptyType>(ENDPOINT_PATHS.AUTH.CHECK_PHONE, params, {
    name: "checkPhone",
    method: "post",
    needToken: false
  })
}
