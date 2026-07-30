export enum Enums {
  /** 自動出款 */
  Auto = 2,

  /** 人工出款 */
  Manual = 1
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Manual]: "common.manual_withdraw",
  [Enums.Auto]: "common.auto_withdraw"
}
