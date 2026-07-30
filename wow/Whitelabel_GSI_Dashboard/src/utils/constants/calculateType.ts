export enum Enums {
  /** 有效投注 */
  ValidBet = 1,

  /** 盈虧 */
  WinLose,

  /** 淨遊戲收入 */
  NetGamingRevenue
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.ValidBet]: "table_header.valid_bet_amount",
  [Enums.WinLose]: "table_header.winlose",
  [Enums.NetGamingRevenue]: "table_header.net_gaming_revenue"
}

export const DistributionThresholdI18nKeys: Record<Enums, string> = {
  [Enums.ValidBet]: "edit_form.distribution_threshold",
  [Enums.WinLose]: "edit_form.distribution_threshold_win",
  [Enums.NetGamingRevenue]: "edit_form.distribution_threshold_ngr"
}
