import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

interface TgUser {
  id: number
  first_name: string
  last_name: string
  username: string
  language_code: string
  allows_write_to_pm: boolean
}

export interface TgWebAppLoginParamsType {
  serial_code: string
  user: TgUser
  chat_instance: string
  chat_type: string
  auth_date: string
  hash: string
  [key: string]: string | TgUser
}

export type TgWebAppLoginRequestType = TgWebAppLoginParamsType

export interface TgWebAppLoginResponseType {
  launch_url?: string
  access_token?: string
}

export const tgWebAppLogin = (params: TgWebAppLoginParamsType) => {
  return requestFn<TgWebAppLoginRequestType, TgWebAppLoginResponseType>(ENDPOINT_PATHS.AUTH.TG_WEB_APP_LOGIN, params, {
    name: "tgWebAppLogin",
    method: "post"
  })
}
