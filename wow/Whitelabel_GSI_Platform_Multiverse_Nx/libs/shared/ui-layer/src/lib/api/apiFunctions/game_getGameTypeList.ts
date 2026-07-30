import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { GAME_TYPE_ENUMS } from "@shared-lib/constants/enums/gameType"

export interface GameTypeItem {
  id: GAME_TYPE_ENUMS
  game_type: string
  use_pc_image: boolean
  use_h5_image: boolean
  pc_image: string
  h5_image: string
  updated_at: number
  label?: string
  frontendKey?: string
}

export type GameTypeList = GameTypeItem[]

export type GetGameTypeListResponseType = GameTypeList

export const getGameTypeList = () => {
  return requestFn<EmptyType, GetGameTypeListResponseType>(ENDPOINT_PATHS.GAME.TYPE_LIST, null, {
    name: "getGameTypeList",
    method: "get"
  })
}
