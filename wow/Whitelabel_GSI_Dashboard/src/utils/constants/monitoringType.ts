export enum Enums {
  All = 0,
  /** 會員盈利異常 */
  MemberProfitAbnormality = 1,
  /** 會員歷史盈利異常 */
  MemberHistoryProfitAbnormality = 2,
  /** 產品虧損異常 */
  ProductWinLoseAbnormality = 3,
  /** 產品歷史虧損異常 */
  ProductHistoryWinLoseAbnormality = 4,
  /** 產品額度不足 */
  ProductInsufficientBalance = 5,
  /** 出款警示 */
  WithdrawalWarning = 6
}

export const I18nKeys: Record<Enums | 0, string> = {
  [Enums.All]: "common.all",
  [Enums.MemberProfitAbnormality]: "common.member_profit_abnormality",
  [Enums.MemberHistoryProfitAbnormality]: "common.member_history_profit_abnormality",
  [Enums.ProductWinLoseAbnormality]: "common.product_winlose_abnormality",
  [Enums.ProductHistoryWinLoseAbnormality]: "common.product_history_winlose_abnormality",
  [Enums.ProductInsufficientBalance]: "common.product_insufficient_balance",
  [Enums.WithdrawalWarning]: "common.Member_large_withdrawal_warning"
}
