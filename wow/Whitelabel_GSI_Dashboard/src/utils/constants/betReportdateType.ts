export enum Enums {
  /** 投注日期 */
  Bet = 0,

  /** 結算日期 */
  Settle = 1,

  All = 2
}

export const I18nKeys: Record<Enums, string> = {
  /** 未定義(全部) */
  [Enums.Bet]: "common.bet_date",
  [Enums.Settle]: "common.settle_date",
  [Enums.All]: "common.all"
}
