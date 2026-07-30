export enum CMS_PAGE_COMPONENT_TYPE_ENUMS {
  /** 輪播圖 */
  SLIDER = 101,

  /** 標題文字 */
  TEXT = 102,

  /** 圖片 */
  IMAGE = 103,

  /** 遊戲入口 */
  GAME_ENTRANCE = 104,

  /** 公告 */
  ANNOUNCEMENT = 105,

  /** 排行榜 */
  LEADERBOARD = 106,

  /** 導航欄 */
  NAVBAR = 107
}

export const CMS_PAGE_COMPONENT_TYPE_I18N_KEYS: Record<CMS_PAGE_COMPONENT_TYPE_ENUMS, string> = {
  [CMS_PAGE_COMPONENT_TYPE_ENUMS.SLIDER]: "cms.slider",
  [CMS_PAGE_COMPONENT_TYPE_ENUMS.TEXT]: "cms.text",
  [CMS_PAGE_COMPONENT_TYPE_ENUMS.IMAGE]: "cms.image",
  [CMS_PAGE_COMPONENT_TYPE_ENUMS.GAME_ENTRANCE]: "cms.game_entrance",
  [CMS_PAGE_COMPONENT_TYPE_ENUMS.ANNOUNCEMENT]: "cms.announcement",
  [CMS_PAGE_COMPONENT_TYPE_ENUMS.LEADERBOARD]: "cms.leaderboard",
  [CMS_PAGE_COMPONENT_TYPE_ENUMS.NAVBAR]: "cms.navbar"
}
