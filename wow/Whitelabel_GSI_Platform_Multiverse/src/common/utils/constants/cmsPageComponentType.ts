export enum Enums {
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

export const I18nKeys: Record<Enums, string> = {
  [Enums.SLIDER]: "cms.slider",
  [Enums.TEXT]: "cms.text",
  [Enums.IMAGE]: "cms.image",
  [Enums.GAME_ENTRANCE]: "cms.game_entrance",
  [Enums.ANNOUNCEMENT]: "cms.announcement",
  [Enums.LEADERBOARD]: "cms.leaderboard",
  [Enums.NAVBAR]: "cms.navbar"
}
