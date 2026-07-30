import type { CmsLangTitle } from "src/api/response.type"

// 通用的樣式設定介面
export interface CmsStyleSettings {
  // 通用樣式
  backgroundColor?: string
  textColor?: string
  primaryColor?: string
  secondaryColor?: string
  padding?: number
  marginBottom?: number
  borderStyle?: "square" | "rounded"

  // Slider 專用
  carouselStyle?: "dots" | "arrows"
  autoPlaySeconds?: number

  // Image 專用
  displayStyle?: "grid" | "horizontal"
  displayCount?: number
  rowShow?: number
}

export interface CmsTextPageItem {
  lang: string
  title: string
  content: string
}

export interface CmsTextPayload {
  page: CmsTextPageItem[]
  style?: CmsStyleSettings
}

export interface CmsGamePayload {
  alt_tag?: string
  game_code: string
  game_type: number
  product_code: number
  product_integration_id: number
}

export interface CmsGameTypePayload {
  game_type: number
  cms_product_category_id: number
}

export interface CmsLinkPayload {
  link: string
  opening_method: number
}

export type CmsNestedEntrancePayload = CmsGamePayload | CmsGameTypePayload | CmsLinkPayload

export interface CmsSliderNestedEntrance {
  img: string
  lang: CmsLangTitle
  sort: number
  type: number
  payload: CmsNestedEntrancePayload
  img_path: string
  img_base64?: string
  is_editable: boolean
  updated_time?: number
}

export interface CmsSliderProcessedItem {
  img: string
  lang: CmsLangTitle
  sort: number
  type: number
  payload: CmsNestedEntrancePayload
  img_path: string
  img_base64?: string
  is_editable: boolean
  updated_time?: number
  alt_tag: string
}

export interface CmsSliderPayload {
  nested_entrance: CmsSliderNestedEntrance[]
  style?: CmsStyleSettings
}

// CustomImage 相關型別定義
export interface CmsImageNestedEntrance {
  img: string
  lang: CmsLangTitle
  sort: number
  type: number
  payload: CmsNestedEntrancePayload
  img_path: string
  img_base64?: string
  is_editable: boolean
  updated_time?: number
}

export interface CmsImageProcessedItem {
  img: string
  lang: CmsLangTitle
  sort: number
  type: number
  payload: CmsNestedEntrancePayload
  img_path: string
  img_base64?: string
  is_editable: boolean
  updated_time?: number
  alt_tag: string
  title: string
}

export interface CmsImagePayload {
  row_show?: number
  nested_entrance: CmsImageNestedEntrance[]
  style?: CmsStyleSettings
}

// CustomGameEntrance 相關型別定義
export interface CmsGameEntrancePayload {
  title?: string
  row_num?: number
  row_show?: number
  game_type_id?: number
  product_code?: number
  product_integration_id?: number
  game_type_entrance_type: number // 判斷為單一入口(供應商入口)還是遊戲入口
  style?: CmsStyleSettings
}

// CustomLeaderboard 相關型別定義
export interface CmsLeaderboardStyleSettings extends CmsStyleSettings {
  // 標題區域
  titleColor?: string

  // Tab 樣式（未選中）
  buttonColor?: string

  // Tab 樣式（選中）
  buttonSelectedColor?: string
  textSelectedColor?: string
  underlineSelectedColor?: string

  // 內容區域
  contentBackgroundColor?: string

  // 列表背景色
  listBackgroundColor?: string

  // 動畫設定
  visibleCount?: number
  animationDuration?: number
  infinite?: boolean

  // 圖示
  icon?: string
}

export interface CmsLeaderboardDetail {
  lang: string
  display_title?: string
  tab_title_1?: string
  tab_title_2?: string
}

export interface CmsLeaderboardPayload {
  title?: string
  details?: CmsLeaderboardDetail[]
  style?: CmsLeaderboardStyleSettings
}

// CustomAnnouncement 相關型別定義
export interface CmsAnnouncementStyleSettings extends CmsStyleSettings {
  // 圖示
  icon?: string

  // 輪播間隔（秒）
  autoPlaySeconds?: number
}

export interface CmsAnnouncementDetail {
  lang: string
  content?: string
}

export interface CmsAnnouncementNestedEntrancePayload {
  details?: CmsAnnouncementDetail[]
}

export interface CmsAnnouncementNestedEntrance {
  sort: number
  type: number
  payload: CmsAnnouncementNestedEntrancePayload
}

export interface CmsAnnouncementPayload {
  title?: string
  nested_entrance?: CmsAnnouncementNestedEntrance[]
  style?: CmsAnnouncementStyleSettings
}

// CustomNavbar 相關型別定義
export interface CmsNavbarStyleSettings extends CmsStyleSettings {
  // 選中項目樣式
  selectedTextColor?: string
  selectedBackgroundColor?: string
}

export interface CmsNavbarNestedEntrancePayload {
  title?: string
  lang_titles?: Record<string, string>
  icon?: string
  selected_icon?: string
  link?: string
  opening_method?: number
  game_type?: number
  product_code?: number
}

export interface CmsNavbarNestedEntrance {
  sort: number
  type: number
  payload: CmsNavbarNestedEntrancePayload
}

export interface CmsNavbarPayload {
  title?: string
  nested_entrance?: CmsNavbarNestedEntrance[]
  style?: CmsNavbarStyleSettings
}

export type CmsCustomPayload =
  | CmsTextPayload
  | CmsSliderPayload
  | CmsImagePayload
  | CmsGameEntrancePayload
  | CmsLeaderboardPayload
  | CmsAnnouncementPayload
  | CmsNavbarPayload
  | Record<string, any>
