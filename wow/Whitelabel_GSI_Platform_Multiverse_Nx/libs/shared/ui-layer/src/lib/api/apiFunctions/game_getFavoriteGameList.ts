import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"

export type GetFavoriteGameListResponseType = number[]

export const getFavoriteGameList = () => {
  return requestFn<EmptyType, GetFavoriteGameListResponseType>(ENDPOINT_PATHS.GAME.FAVORITE_LIST, null, {
    name: "getFavoriteGameList",
    method: "get"
  })
}
