export enum Enums {
  /** 活躍 */
  Active = 1,

  /** 非活躍 */
  Closed
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.Active]: "common.free_round_active",
  [Enums.Closed]: "common.free_round_closed"
}
