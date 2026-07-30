export enum Enums {
  /** 銀行轉帳 */
  MoneyTransfer = 1,

  /** 第三方支付 */
  ThirdPartyPayment = 2,

  /** 虛擬貨幣錢包(轉帳) */
  CryptoWallet = 3,

  /** ApplePay */
  ApplePay = 4,

  /** Paypal */
  Paypal = 5,

  /** 其他通道 */
  ExternalChannelTransfer = 6,

  /** 虛擬貨幣錢包(三方) */
  CryptoWalletThird = 7
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.MoneyTransfer]: "fund_method_type.money_transfer",
  [Enums.ThirdPartyPayment]: "fund_method_type.third_party_payment",
  [Enums.CryptoWallet]: "fund_method_type.crypto_wallet_trans",
  [Enums.ApplePay]: "fund_method_type.apple_pay",
  [Enums.Paypal]: "fund_method_type.paypal",
  [Enums.ExternalChannelTransfer]: "fund_method_type.external_channel_transfer",
  [Enums.CryptoWalletThird]: "fund_method_type.crypto_wallet_third"
}
