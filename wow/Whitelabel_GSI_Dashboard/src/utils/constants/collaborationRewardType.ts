export enum Enums {
  /** 手動派發 */
  Manual = 0,
  /** 自動派發 */
  Auto = 1
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Manual]: "reward_type.manual",
  [Enums.Auto]: "reward_type.auto"
}
