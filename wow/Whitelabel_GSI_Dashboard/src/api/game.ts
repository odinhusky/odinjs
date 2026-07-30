import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, put } from "@/utils/request"
import { queryClient } from "@/query/queryClient"

// 遊戲名稱下拉
export const getGameNameDropdown = async (params?: Request.GetGameNameDropdown) => {
  return queryClient.fetchQuery({
    queryKey: ["game", "dropdown", params ?? {}],
    queryFn: () => get<Response.GameNameList>("/game/dropdown", params)
  })
}

// 遊戲入口設置
export const getGameList = async (params?: Request.GetGameList) => {
  const payload: Request.GetGameList = {
    offset: params?.offset,
    size: params?.size,
    product_code: params?.product_code,
    name: params?.keyword,
    game_type: params?.game_type
  }
  return get<Response.BaseList<Response.GameList>>("/game/list", payload)
}

export const setGameStstus = async (params: Request.SetGameStatus) => {
  return put("/game/status", params)
}

export const setGameHot = async (params: Request.SetGameHot) => {
  return put("/game/hot", params)
}

export const setGameNewly = async (params: Request.SetGameNew) => {
  return put("/game/newly", params)
}

export const updateGameSort = async (params: Request.SetGameSort) => {
  return put(`/game/sort/${params.id}`, params, {
    name: "updateGameSort"
  })
}

export const updateGameCustomImage = async (params: Request.SetGameCustomImage) => {
  return put("/game/custom_image", params, {
    name: "updateGameCustomImage"
  })
}
