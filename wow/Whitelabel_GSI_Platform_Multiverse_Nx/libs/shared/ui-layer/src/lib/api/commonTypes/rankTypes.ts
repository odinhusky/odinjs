import { GAME_TYPE_ENUMS } from "@shared-lib/constants/enums/gameType"

export interface GetRankListRequestType {
  currency_id?: number
  game_type?: number
}

export interface RankResponseItem {
  id: number
  game_name: string
  member_account: string
  bet_amount: string
  prize_amount: string
  created_at: string
  game_code: string
  game_type: GAME_TYPE_ENUMS
  product_code: number
  settled_at: string
  custom_image: string
  updated_at: number
  game_type_id?: GAME_TYPE_ENUMS
  integration_id: number
  avatar_path?: string
  show_avatar?: boolean
}

export type RankResponseList = RankResponseItem[]
