import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { GetTotpGenerateResponseType } from "@shared-lib/api/commonTypes/authTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export const getTotpGenerate = () => {
  return requestFn<EmptyType, GetTotpGenerateResponseType>(ENDPOINT_PATHS.AUTH.GET_TOTP_GENERATE, null, {
    name: "getTotpGenerate",
    method: "get"
  })
}
