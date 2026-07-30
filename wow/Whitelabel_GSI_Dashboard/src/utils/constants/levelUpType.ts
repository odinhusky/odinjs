export enum Enums {
  /** 全幣別達成 */
  All = 1,

  /** 單一幣別達成 */
  Single
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.All]: "level_up_type.achieved_in_all_currencies",
  [Enums.Single]: "level_up_type.single_currency_achieved"
}
