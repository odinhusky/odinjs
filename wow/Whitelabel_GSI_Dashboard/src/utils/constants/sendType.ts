export enum Enums {
  /** 自動 */
  Auto = 1,

  /** 手動 */
  Manual
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Auto]: "send_type.auto",
  [Enums.Manual]: "send_type.manual"
}
