import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { GetTotpStatusResponseType } from "@shared-lib/api/commonTypes/authTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export const getTotpStatus = () => {
  return requestFn<EmptyType, GetTotpStatusResponseType>(ENDPOINT_PATHS.AUTH.GET_TOTP_STATUS, null, {
    name: "getTotpStatus",
    method: "get"
  })
}
