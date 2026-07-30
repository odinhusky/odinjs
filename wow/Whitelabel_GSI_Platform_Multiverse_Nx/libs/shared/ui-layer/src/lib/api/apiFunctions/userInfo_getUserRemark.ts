import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetUserRemarkResponseType {
  remark: string
}

export const getUserRemark = () => {
  return requestFn<EmptyType, GetUserRemarkResponseType>(ENDPOINT_PATHS.USER_INFO.USER_REMARK, null, {
    name: "getUserRemark",
    method: "get"
  })
}
