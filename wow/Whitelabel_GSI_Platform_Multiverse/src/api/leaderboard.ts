import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const getLeaderboardList = () => {
  return requestApi<null, Response.LeaderboardResponse[]>(`/platform/v1/player/leaderboard`, null, {
    name: "getLeaderboardList",
    method: "get",
    usePlatform: true
  })
}
