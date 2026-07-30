export enum Enums {
  /** 註冊日期 */
  FromBeginning = 1,

  /** 指定日期 */
  FromCurrent = 2
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.FromBeginning]: "level_up_condition_since.from_beginning",
  [Enums.FromCurrent]: "level_up_condition_since.from_current"
}
