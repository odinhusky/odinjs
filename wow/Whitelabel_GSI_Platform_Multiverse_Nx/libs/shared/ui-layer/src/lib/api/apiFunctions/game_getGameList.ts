import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { GameList } from "@shared-lib/api/commonTypes/gameTypes"
import { INTEGRATION_ID_ENUMS } from "@shared-lib/constants/enums/integrationId"
import { GAME_TAG_TYPE_ENUMS } from "@shared-lib/constants/enums/gameTagType"

export interface GameListParamsType {
  game_type_id: number
  integration_id?: INTEGRATION_ID_ENUMS
  product_code?: number
  currency_id?: number
  search_type?: GAME_TAG_TYPE_ENUMS
  is_favorited?: boolean
  newly?: boolean
  hot?: boolean
}

export type GameListRequestType = GameListParamsType
export type GameListResponseType = GameList

export const getGameList = (params: GameListParamsType) => {
  return requestFn<GameListRequestType, GameListResponseType>(ENDPOINT_PATHS.GAME.LIST, params, {
    name: "getGameList",
    method: "get",
    forceBearerUndefinedWhenNoToken: true
  })
}
