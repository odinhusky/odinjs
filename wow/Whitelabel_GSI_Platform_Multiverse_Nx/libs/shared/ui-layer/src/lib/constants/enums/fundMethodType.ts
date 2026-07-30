export enum FUND_METHOD_TYPE_ENUMS {
  /** 銀行轉帳 */
  BANK_TRANSFER = 1,

  /** 電子錢包 */
  E_WALLET = 2,

  /** 虛擬貨幣錢包 - 銀行轉帳 */
  CRYPTO_WALLET = 3,

  /** 虛擬貨幣錢包 - 三方 */
  CRYPTO_PAYMENT = 7,

  /** ApplePay */
  APPLE_PAY = 4,

  /** Paypal */
  PAYPAL = 5,

  /** Maya支付 */
  EXTERNAL_CHANNEL_TRANSFER = 6
}

/** 後端的 key */
export enum BACKEND_KEYS_ENUMS {
  /** 銀行轉帳 */
  BANK_TRANSFER = "BankTransfer",

  /** 電子錢包 */
  E_WALLET = "EWallet",

  /** 虛擬貨幣錢包 */
  CRYPTO_WALLET = "CryptoWallet",

  /** 虛擬貨幣錢包 */
  CRYPTO_PAYMENT = "CryptoPayment",

  /** ApplePay */
  APPLE_PAY = "ApplePay",

  /** Paypal */
  PAYPAL = "Paypal",

  /** Maya支付 */
  EXTERNAL_CHANNEL_TRANSFER = "ExternalChannelTransfer"
}

export const FUND_METHOD_TYPE_LABEL: Record<FUND_METHOD_TYPE_ENUMS, string> = {
  [FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER]: "BankTransfer",
  [FUND_METHOD_TYPE_ENUMS.E_WALLET]: "EWallet",
  [FUND_METHOD_TYPE_ENUMS.CRYPTO_WALLET]: "CryptoWallet",
  [FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT]: "CryptoPayment",
  [FUND_METHOD_TYPE_ENUMS.APPLE_PAY]: "ApplePay",
  [FUND_METHOD_TYPE_ENUMS.PAYPAL]: "PayPal",
  [FUND_METHOD_TYPE_ENUMS.EXTERNAL_CHANNEL_TRANSFER]: "ExternalChannelTransfer"
}

export const FUND_METHOD_TYPE_I18N_KEYS: Record<FUND_METHOD_TYPE_ENUMS, string> = {
  [FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER]: "fund_method_type.money_transfer",
  [FUND_METHOD_TYPE_ENUMS.E_WALLET]: "fund_method_type.electronic_wallet",
  [FUND_METHOD_TYPE_ENUMS.CRYPTO_WALLET]: "fund_method_type.crypto_wallet_trans",
  [FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT]: "fund_method_type.crypto_wallet_third",
  [FUND_METHOD_TYPE_ENUMS.APPLE_PAY]: "fund_method_type.apple_pay",
  [FUND_METHOD_TYPE_ENUMS.PAYPAL]: "fund_method_type.paypal",
  [FUND_METHOD_TYPE_ENUMS.EXTERNAL_CHANNEL_TRANSFER]: "fund_method_type.external_channel_transfer"
}

export const FUND_METHOD_TYPE_ICON_CLASS: Record<FUND_METHOD_TYPE_ENUMS, string> = {
  [FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER]: "fas fa-landmark",
  [FUND_METHOD_TYPE_ENUMS.E_WALLET]: "fas fa-wallet",
  [FUND_METHOD_TYPE_ENUMS.CRYPTO_WALLET]: "fab fa-bitcoin",
  [FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT]: "fab fa-bitcoin",
  [FUND_METHOD_TYPE_ENUMS.APPLE_PAY]: "fa-brands fa-cc-apple-pay",
  [FUND_METHOD_TYPE_ENUMS.PAYPAL]: "fa-brands fa-paypal",
  [FUND_METHOD_TYPE_ENUMS.EXTERNAL_CHANNEL_TRANSFER]: "fa-brands fa-cc-maya"
}
