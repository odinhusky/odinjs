export enum Enums {
  /** 自動存款 */
  AutoDeposit = 1,

  /** 自動提現 */
  AutoWithdraw,
  /** 人工存款 */
  ManualDeposit,

  /** 人工提現 */
  ManualWithdraw
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.ManualDeposit]: "common.manual_deposit",
  [Enums.ManualWithdraw]: "common.manual_withdraw",
  [Enums.AutoDeposit]: "common.auto_deposit",
  [Enums.AutoWithdraw]: "common.auto_withdraw"
}
