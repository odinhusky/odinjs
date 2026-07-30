export enum Enums {
  /** 未結算 */
  Unsettlement = 1,

  /** 已結算 */
  Settled = 2,

  /** 已撤銷 */
  VOID = 3,

  /** 派彩中 */
  TIP = 4
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.Unsettlement]: "settlement_type.un_settlement",
  [Enums.TIP]: "settlement_type.tip",
  [Enums.Settled]: "settlement_type.settled",
  [Enums.VOID]: "settlement_type.void"
}
