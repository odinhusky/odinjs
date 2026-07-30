import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { GetOAuthUrlRequestType, GetOAuthUrlResponseType } from "@shared-lib/api/commonTypes/authTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type GetTelegramOAuthUrlParamsType = GetOAuthUrlRequestType
export type GetTelegramOAuthUrlRequestType = GetOAuthUrlRequestType
export type GetTelegramOAuthUrlResponseType = GetOAuthUrlResponseType

export const getTelegramOAuthUrl = (params: GetTelegramOAuthUrlParamsType) => {
  return requestFn<GetTelegramOAuthUrlRequestType, GetTelegramOAuthUrlResponseType>(
    ENDPOINT_PATHS.AUTH.GET_TELEGRAM_OAUTH_URL,
    params,
    {
      name: "getTelegramOAuthUrl",
      method: "post",
      needToken: false
    }
  )
}
