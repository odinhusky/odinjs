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

export const ImageName: Record<Enums, string> = {
  [Enums.SLIDER]: "slider",
  [Enums.TEXT]: "",
  [Enums.IMAGE]: "image",
  [Enums.GAME_ENTRANCE]: "game-entrance",
  [Enums.ANNOUNCEMENT]: "announcement.png",
  [Enums.LEADERBOARD]: "leaderboard.png",
  [Enums.NAVBAR]: "navbar.png"
}
export const Label: Record<Enums, string> = {
  [Enums.SLIDER]: "",
  [Enums.TEXT]: "cms.title_text",
  [Enums.IMAGE]: "",
  [Enums.GAME_ENTRANCE]: "",
  [Enums.ANNOUNCEMENT]: "cms.announcement",
  [Enums.LEADERBOARD]: "cms.leaderboard",
  [Enums.NAVBAR]: "cms.navbar"
}
export const AltTag: Record<Enums, boolean> = {
  [Enums.SLIDER]: true,
  [Enums.TEXT]: false,
  [Enums.IMAGE]: true,
  [Enums.GAME_ENTRANCE]: false,
  [Enums.ANNOUNCEMENT]: false,
  [Enums.LEADERBOARD]: false,
  [Enums.NAVBAR]: false
}
export const OpeningMethod: Record<Enums, boolean> = {
  [Enums.SLIDER]: true,
  [Enums.TEXT]: false,
  [Enums.IMAGE]: true,
  [Enums.GAME_ENTRANCE]: false,
  [Enums.ANNOUNCEMENT]: false,
  [Enums.LEADERBOARD]: false,
  [Enums.NAVBAR]: false
}
export const UseFakeDialog: Record<Enums, boolean> = {
  [Enums.SLIDER]: false,
  [Enums.TEXT]: true,
  [Enums.IMAGE]: false,
  [Enums.GAME_ENTRANCE]: false,
  [Enums.ANNOUNCEMENT]: false,
  [Enums.LEADERBOARD]: false,
  [Enums.NAVBAR]: false
}
export const DialogWidth: Record<Enums, string> = {
  [Enums.SLIDER]: "58rem",
  [Enums.TEXT]: "",
  [Enums.IMAGE]: "58rem",
  [Enums.GAME_ENTRANCE]: "31.25rem",
  [Enums.ANNOUNCEMENT]: "31.25rem",
  [Enums.LEADERBOARD]: "31.25rem",
  [Enums.NAVBAR]: "31.25rem"
}
