export enum Enums {
  /** 自動入款 */
  Auto = 2,

  /** 人工入款 */
  Manual = 1
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Manual]: "common.manual_deposit",
  [Enums.Auto]: "common.auto_deposit"
}
