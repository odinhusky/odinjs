import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"

export type LogoutResponseType = Record<string, never>

export const logout = () => {
  return requestFn<EmptyType, LogoutResponseType>(ENDPOINT_PATHS.AUTH.LOGOUT, null, {
    name: "logout",
    method: "post"
  })
}
