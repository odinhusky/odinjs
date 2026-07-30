export interface ProductItem {
  integration_id: number
  product_code: number
  product_name: string
  game_type: string
  square_image: string
  tab_image: string
  wide_image: string
  updated_at: number
}

export type ProductList = ProductItem[]

export interface GameItem {
  /** 遊戲類型字串（如 "LIVE_CASINO"），用於組合靜態資源圖片路徑 */
  game_type?: string
  // product_name: string
  // updated_at: number
  game_code: string
  game_name: string
  game_type_id: number
  product_code: number
  favorite_count: number
  game_id: number
  hot: boolean
  newly: boolean
  sort: number
  product_name: string
  // Backwards-compat: some code may still refer to `is_favorited`
  is_favorited?: boolean
  // API field: newer responses use `is_favorite`
  is_favorite?: boolean
  custom_image: string
  integration_id: number
  hot_count: number
  integration_created_at: number
  support_currency: string
}

export type GameList = GameItem[]

import type { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"

export interface LaunchGameRequest {
  is_v2: boolean
  game_code: string
  game_type_id: number
  integration_id: number
  product_code: number
  platform: string
  currency: string
  language_code: number
  widget_id?: string
  wallet_type?: WALLET_TYPE_ENUMS
}

export interface LaunchGameResponse {
  game_content: string
  game_url: string
  currencies: string[]
  transfer_account?: string
  transfer_password?: string
}

export interface FavoriteGameRequest {
  game_id: number
}
