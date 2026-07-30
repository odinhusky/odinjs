export enum Enums {
  /** 有效投注 */
  ValidBet = 1,

  /** 盈虧 */
  WinLose,

  /** 淨遊戲收入 */
  NetGamingRevenue
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.ValidBet]: "member.referralRebate.latestTotalValidBetAmount",
  [Enums.WinLose]: "member.referralRebate.latestTotalProfit",
  [Enums.NetGamingRevenue]: "member.referralRebate.latestTotalNetGamingRevenue"
}
