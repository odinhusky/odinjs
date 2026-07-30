export enum CALCULATE_TYPE_ENUMS {
  /** 有效投注 */
  VALID_BET = 1,

  /** 盈虧 */
  WIN_LOSE = 2,

  /** 淨遊戲收入 */
  NET_GAMING_REVENUE = 3
}

export const CALCULATE_TYPE_I18N_KEYS: Record<CALCULATE_TYPE_ENUMS, string> = {
  [CALCULATE_TYPE_ENUMS.VALID_BET]: "member.referralRebate.latestTotalValidBetAmount",
  [CALCULATE_TYPE_ENUMS.WIN_LOSE]: "member.referralRebate.latestTotalProfit",
  [CALCULATE_TYPE_ENUMS.NET_GAMING_REVENUE]: "member.referralRebate.latestTotalNetGamingRevenue"
}
