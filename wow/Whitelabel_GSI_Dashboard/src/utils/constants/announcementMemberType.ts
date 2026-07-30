export enum Enums {
  /** 活動消息 */
  ACTIVE_MESSAGE = 1,

  /** 遊戲消息 */
  GAME_NEWS = 2,

  /** 功能更新 */
  FEATURE_UPDATE = 3,

  /**網站公告 */
  WEBSITE_ANNOUNCE = 4
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.ACTIVE_MESSAGE]: "display_object_type.active_message",
  [Enums.GAME_NEWS]: "display_object_type.game_news",
  [Enums.FEATURE_UPDATE]: "display_object_type.feature_update",
  [Enums.WEBSITE_ANNOUNCE]: "display_object_type.website_announce"
}
