export enum Enums {
  /** 存款 */
  DepositFlow = 1,

  /** 出款 */
  WithdrawalFlow = 2,

  // /** 存款/出款 */
  // DepositAndWithdrawalFlow = 3
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.DepositFlow]: "service_type.deposit_flow",
  [Enums.WithdrawalFlow]: "service_type.withdrawal_flow",
  // [Enums.DepositAndWithdrawalFlow]: "service_type.deposit_and_withdrawal_flow"
}
