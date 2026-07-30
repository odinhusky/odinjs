import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface LeaderboardConditions {
  [key: string]: {
    highlight_bet_amount: number
    highlight_payout_multiplier: number
  }
}

export interface LeaderboardDisplaySetting {
  desktop: boolean
  mobile: boolean
  titles: {
    [key: string]: string
  }
}

export interface LeaderboardDisplaySettings {
  [key: string]: LeaderboardDisplaySetting
}

export interface Leaderboard {
  conditions: LeaderboardConditions
  display_settings: LeaderboardDisplaySettings
  id: number
  titles: {
    [key: string]: string
  }
}

export interface GameName {
  game_name: string
  is_custom_image: boolean
  custom_image: string
}

export interface GameNameMap {
  [key: string]: GameName
}

export interface LeaderboardWager {
  bet_amount: number
  currency_id: number
  integration_id: number
  product_code: number
  game_type: number
  game_code: string
  game_info: GameNameMap
  member_account: string
  member_avatar_path: string
  payout_multiplier: number
  prize_amount: number
  settled_at: number
}

export interface LeaderboardResponse {
  leaderboard: Leaderboard
  wagers: LeaderboardWager[]
}

export type GetLeaderboardResponseType = LeaderboardResponse[]

export const getLeaderboardList = () => {
  return requestFn<EmptyType, GetLeaderboardResponseType>(ENDPOINT_PATHS.LEADERBOARD.LIST, null, {
    name: "getLeaderboardList",
    method: "get",
    usePlatform: true
  })
}
