import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetMiniGameAuthKeyResponseType {
  auth_key: string
}

// 未登入開啟mini game
export const getMiniGameAuthKey = () => {
  return requestFn<EmptyType, GetMiniGameAuthKeyResponseType>(ENDPOINT_PATHS.MINI_GAME.AUTH_KEY, null, {
    name: "getMiniGameAuthKey",
    method: "get"
  })
}
