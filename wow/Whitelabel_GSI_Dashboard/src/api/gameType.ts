import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, put } from "@/utils/request"

export const getGameTypes = async () => {
  return get<Response.BaseList<Response.GameTypes>>("/game_types/list", null)
}

export const updateGameType = async (params: Request.SetGameType) => {
  return put(`/game_types/${params.game_type}`, params, {
    name: "updateGameType"
  })
}
