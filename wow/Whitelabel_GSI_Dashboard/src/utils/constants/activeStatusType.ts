export enum Enums {
  /** 活躍 */
  Active = 1,

  /** 非活躍 */
  Inactive
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.Active]: "common.self_active",
  [Enums.Inactive]: "common.self_inactive"
}
