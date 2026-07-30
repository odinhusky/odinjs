import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { FavoriteGameRequest } from "@shared-lib/api/commonTypes/gameTypes"

export type DeleteFavoriteGameParamsType = FavoriteGameRequest
export type DeleteFavoriteGameRequestType = FavoriteGameRequest

export const deleteFavoriteGame = (params: DeleteFavoriteGameParamsType) => {
  return requestFn<DeleteFavoriteGameRequestType, EmptyType>(`${ENDPOINT_PATHS.GAME.FAVORITE}/${params.game_id}`, params, {
    name: "deleteFavoriteGame",
    method: "delete"
  })
}
