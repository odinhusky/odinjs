export enum Enums {
  ELECTRONUC_WALLET = 1,
  APPLE_PAY,
  MONEY_TRANSFER
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.ELECTRONUC_WALLET]: "fund_method_type.electronic_wallet",
  [Enums.APPLE_PAY]: "fund_method_type.apple_pay",
  [Enums.MONEY_TRANSFER]: "fund_method_type.money_transfer"
}
