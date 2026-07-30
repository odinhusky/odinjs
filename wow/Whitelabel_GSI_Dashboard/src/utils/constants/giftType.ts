export enum Enums {
  /** 晉級禮金 */
  LevelUp = 1,

  /** 生日禮金 */
  Birthday
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.LevelUp]: "gift_type.level_up",
  [Enums.Birthday]: "gift_type.birthday"
}
