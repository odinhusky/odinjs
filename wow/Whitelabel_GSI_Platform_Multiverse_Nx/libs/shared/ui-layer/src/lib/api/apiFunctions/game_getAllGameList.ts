import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import{ GameItem } from "@shared-lib/api/commonTypes/gameTypes"
import { EmptyType } from "@shared-lib/api/commonTypes"

export interface AllGameListResponseType {
  FISHING: GameItem[]
  LIVE_CASINO: GameItem[]
  POKER: GameItem[]
  POPULAR: GameItem[]
  SLOT: GameItem[]
}

export const getAllGameList = () => {
  return requestFn<EmptyType, AllGameListResponseType>(ENDPOINT_PATHS.GAME.ALL_LIST, null, {
    name: "getAllGameList",
    method: "get"
  })
}
