import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface PostLaunchMiniGameParamsType {
  currency_id: number
}

export type PostLaunchMiniGameRequestType = PostLaunchMiniGameParamsType

export interface PostLaunchMiniGameResponseType {
  auth_key: string
  gs1_data: {
    username: string
    player_id: string
    session_token: string
    gs1_player_id: number
  }
}

// 已登入開啟mini game
export const postLaunchMiniGame = (params: PostLaunchMiniGameRequestType) => {
  return requestFn<PostLaunchMiniGameRequestType, PostLaunchMiniGameResponseType>(
    ENDPOINT_PATHS.MINI_GAME.LAUNCH,
    params,
    {
      name: "postLaunchMiniGame",
      method: "post"
    }
  )
}
