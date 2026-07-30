/**
 * CMS 自定義頁面相關型別定義
 * 對應後台 `/cmsCustomPage/:id` 路由使用的入口區塊 payload 型別
 */

import type { CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"

/** 通用樣式設定 */
export interface CmsStyleSettings {
  backgroundColor?: string
  textColor?: string
  primaryColor?: string
  secondaryColor?: string
  padding?: number
  marginBottom?: number
  borderStyle?: "square" | "rounded"
  /** Slider 專用 */
  carouselStyle?: "dots" | "arrows"
  autoPlaySeconds?: number
  /** Image 專用 */
  displayStyle?: "grid" | "horizontal"
  displayCount?: number
  rowShow?: number
}

/** GAME_ENTRANCE (type=104) 區塊的 payload */
export interface CmsGameEntrancePayload {
  title?: string
  /** 每行顯示幾行 */
  row_num?: number
  /** 每行幾個 */
  row_show?: number
  game_type_id?: number
  product_code?: number
  product_integration_id?: number
  /** 1=SINGLE_ENTRY（供應商入口）/ 2=GAME_LIST（遊戲入口） */
  game_type_entrance_type: number
  style?: CmsStyleSettings
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDER (type=101)
// ─────────────────────────────────────────────────────────────────────────────

export interface CmsSliderPayload {
  style?: CmsStyleSettings
  nested_entrance?: CmsEntranceItem[]
}

// ─────────────────────────────────────────────────────────────────────────────
// TEXT (type=102)
// ─────────────────────────────────────────────────────────────────────────────

export interface CmsTextPageItem {
  lang: string
  title?: string
  content: string
}

export interface CmsTextPayload {
  style?: CmsStyleSettings
  page?: CmsTextPageItem[]
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE (type=103)
// ─────────────────────────────────────────────────────────────────────────────

export interface CmsImagePayload {
  style?: CmsStyleSettings
  row_show?: number
  nested_entrance?: CmsEntranceItem[]
}

// ─────────────────────────────────────────────────────────────────────────────
// ANNOUNCEMENT (type=105)
// ─────────────────────────────────────────────────────────────────────────────

export interface CmsAnnouncementStyleSettings extends CmsStyleSettings {
  icon?: string
  autoPlaySeconds?: number
}

export interface CmsAnnouncementDetail {
  lang: string
  content: string
}

export interface CmsAnnouncementNestedEntrance {
  payload?: {
    details?: CmsAnnouncementDetail[]
  }
}

export interface CmsAnnouncementPayload {
  style?: CmsAnnouncementStyleSettings
  nested_entrance?: CmsAnnouncementNestedEntrance[]
}

// ─────────────────────────────────────────────────────────────────────────────
// LEADERBOARD (type=106)
// ─────────────────────────────────────────────────────────────────────────────

export interface CmsLeaderboardStyleSettings extends CmsStyleSettings {
  buttonColor?: string
  buttonSelectedColor?: string
  titleColor?: string
  textSelectedColor?: string
  underlineSelectedColor?: string
  icon?: string
  visibleCount?: number
  animationDuration?: number
  infinite?: boolean
}

export interface CmsLeaderboardDetail {
  lang: string
  display_title?: string
  tab_title_1?: string
  tab_title_2?: string
}

export interface CmsLeaderboardPayload {
  title?: string
  style?: CmsLeaderboardStyleSettings
  details?: CmsLeaderboardDetail[]
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR (type=107)
// ─────────────────────────────────────────────────────────────────────────────

export interface CmsNavbarStyleSettings extends CmsStyleSettings {
  selectedTextColor?: string
  selectedBackgroundColor?: string
  displayCount?: number
}

export interface CmsNavbarNestedEntrancePayload {
  title?: string
  icon?: string
  selected_icon?: string
  opening_method?: number
  lang_titles?: Record<string, string>
  link?: string
  link_id?: number
  game_code?: string
  product_code?: number
  game_type?: number
  integration_id?: number
  product_integration_id?: number
}

export interface CmsNavbarNestedEntrance {
  payload?: CmsNavbarNestedEntrancePayload
  lang?: Record<string, string>
  type?: number
  sort?: number
  img_path?: string
  updated_time?: number
}

export interface CmsNavbarPayload {
  style?: CmsNavbarStyleSettings
  nested_entrance?: CmsNavbarNestedEntrance[]
}
