/** 這隻應該要棄用了，新的改到leaderboard去了 by Odin */

import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const getLatestWinList = (params: Request.GetRankList) => {
  return requestApi<Request.GetRankList, Response.RankItem[]>(`/v1/player/bet/latest_win_list`, params, {
    name: "getLatestWinList",
    method: "get"
  })
}

export const getLatestBetList = (params: Request.GetRankList) => {
  return requestApi<Request.GetRankList, Response.RankItem[]>(`/v1/player/bet/latest_bet_list`, params, {
    name: "getLatestBetList",
    method: "get"
  })
}
