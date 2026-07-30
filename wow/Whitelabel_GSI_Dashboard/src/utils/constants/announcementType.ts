export enum Enums {
  /** 一般公告類型 */
  ANNOUNCEMENT_TYPE_GENERAL = 1,

  /** 公告類型遊戲 */
  ANNOUNCEMENT_TYPE_GAME = 2,

  /** 公告類型功能 */
  ANNOUNCEMENT_TYPE_FUNCTION = 3
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.ANNOUNCEMENT_TYPE_GENERAL]: "display_object_type.announcement type general",
  [Enums.ANNOUNCEMENT_TYPE_GAME]: "display_object_type.announcement_type_game",
  [Enums.ANNOUNCEMENT_TYPE_FUNCTION]: "display_object_type.announcement_type_function"
}
