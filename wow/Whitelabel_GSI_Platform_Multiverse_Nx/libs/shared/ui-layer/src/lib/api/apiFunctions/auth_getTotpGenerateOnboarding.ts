import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { GetTotpGenerateResponseType } from "@shared-lib/api/commonTypes/authTypes"

export const getTotpGenerateOnboarding = () => {
  return requestFn<EmptyType, GetTotpGenerateResponseType>(ENDPOINT_PATHS.AUTH.GET_TOTP_GENERATE_ONBOARDING, null, {
    name: "getTotpGenerateOnboarding",
    method: "get"
  })
}
