export enum ANNOUNCEMENT_MEMBER_TYPE_ENUMS {
  /** 全部 */
  ALL = 0,

  /** 活動消息 */
  ACTIVE_MESSAGE = 1,

  /** 遊戲消息 */
  GAME_NEWS = 2,

  /** 功能更新 */
  FEATURE_UPDATE = 3,

  /**網站公告 */
  WEBSITE_ANNOUNCE = 4
}

export const ANNOUNCEMENT_MEMBER_TYPE_I18N_KEYS: Record<ANNOUNCEMENT_MEMBER_TYPE_ENUMS, string> = {
  [ANNOUNCEMENT_MEMBER_TYPE_ENUMS.ALL]: "announce_all_time",
  [ANNOUNCEMENT_MEMBER_TYPE_ENUMS.ACTIVE_MESSAGE]: "announcement.active_message",
  [ANNOUNCEMENT_MEMBER_TYPE_ENUMS.GAME_NEWS]: "announcement.game_news",
  [ANNOUNCEMENT_MEMBER_TYPE_ENUMS.FEATURE_UPDATE]: "announcement.feature_update",
  [ANNOUNCEMENT_MEMBER_TYPE_ENUMS.WEBSITE_ANNOUNCE]: "announcement.website_announce"
}
