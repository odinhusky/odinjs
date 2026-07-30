export enum Enums {
  /** 自動派發 */
  Auto = 1,

  /** 手動派發 */
  Manual
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Auto]: "reward_type.auto",
  [Enums.Manual]: "reward_type.manual"
}
