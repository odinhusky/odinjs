import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { GetOAuthUrlRequestType, GetOAuthUrlResponseType } from "@shared-lib/api/commonTypes/authTypes"

export type GetGoogleOAuthUrlParamsType = GetOAuthUrlRequestType
export type GetGoogleOAuthUrlRequestType = GetOAuthUrlRequestType
export type GetGoogleOAuthUrlResponseType = GetOAuthUrlResponseType

export const getGoogleOAuthUrl = (params: GetGoogleOAuthUrlParamsType) => {
  return requestFn<GetGoogleOAuthUrlRequestType, GetGoogleOAuthUrlResponseType>(
    ENDPOINT_PATHS.AUTH.GET_GOOGLE_OAUTH_URL,
    params,
    {
      name: "getGoogleOAuthUrl",
      method: "post",
      needToken: false
    }
  )
}
