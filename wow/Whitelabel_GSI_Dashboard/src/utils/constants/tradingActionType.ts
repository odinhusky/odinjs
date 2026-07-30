export enum Enums {
  /** 存款 */
  Deposit = 1,

  /** 出款 */
  Withdrawal = 2,

  /** 人工存款 */
  ManualDeposit = 3,

  /** 人工出款 */
  ManualWithdrawal = 4
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.Deposit]: "account_flow_type.deposit",
  [Enums.Withdrawal]: "account_flow_type.withdrawal",
  [Enums.ManualDeposit]: "account_flow_type.adjusment_deposit",
  [Enums.ManualWithdrawal]: "account_flow_type.adjusment_withdrawal"
}
