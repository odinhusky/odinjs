import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { FavoriteGameRequest } from "@shared-lib/api/commonTypes/gameTypes"

export type FavoriteGameParamsType = FavoriteGameRequest
export type FavoriteGameRequestType = FavoriteGameRequest

export const favoriteGame = (params: FavoriteGameParamsType) => {
  return requestFn<FavoriteGameRequestType, EmptyType>(ENDPOINT_PATHS.GAME.FAVORITE, params, {
    name: "favoriteGame",
    method: "post"
  })
}
