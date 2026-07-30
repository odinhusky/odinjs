export enum Enums {
  /** 無限 */
  Never = 1,

  /** 一個月 */
  Month,

  /** 一周 */
  Week,

  /** 一天 */
  Day
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Never]: "protect_level.infinity",
  [Enums.Month]: "protect_level.month",
  [Enums.Week]: "protect_level.week",
  [Enums.Day]: "protect_level.day"
}
