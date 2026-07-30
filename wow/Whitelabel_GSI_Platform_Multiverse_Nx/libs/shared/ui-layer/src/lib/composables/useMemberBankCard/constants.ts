import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"
import type { PayoutSettingMethodType } from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsList"
import type { CustomLabelProvider, OptionItem, PaymentGatewayOption } from "./types"

export const WITHDRAW_PAYMENT_METHOD = 2
export const BANK_CARD_METHOD_TYPE: PayoutSettingMethodType = 1
export const EWALLET_METHOD_TYPE: PayoutSettingMethodType = 2
export const CRYPTO_WALLET_METHOD_TYPE: PayoutSettingMethodType = 3

export const PAYMENT_TYPE_BY_PAYOUT_METHOD_TYPE: Record<PayoutSettingMethodType, FUND_METHOD_TYPE_ENUMS> = {
  [BANK_CARD_METHOD_TYPE]: FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER,
  [EWALLET_METHOD_TYPE]: FUND_METHOD_TYPE_ENUMS.E_WALLET,
  [CRYPTO_WALLET_METHOD_TYPE]: FUND_METHOD_TYPE_ENUMS.CRYPTO_WALLET
}

export const BANK_GATEWAY_TYPE_SET = new Set<number>([
  FUND_METHOD_TYPE_ENUMS.E_WALLET,
  FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT
])

export const CUSTOM_LABEL_PROVIDERS: readonly CustomLabelProvider[] = [
  { payment_gateway_name: "gspay_gold_brl_starpagobr", pg_code: "starpagobr" },
  { payment_gateway_name: "gspay_gold_brl_toppaybrori", pg_code: "toppaybrori" }
]

export const MOCK_PAYMENT_TYPES: number[] = [
  FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER,
  FUND_METHOD_TYPE_ENUMS.E_WALLET,
  FUND_METHOD_TYPE_ENUMS.CRYPTO_WALLET,
  FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT
]

export const MOCK_PAYMENT_GATEWAYS: PaymentGatewayOption[] = [
  {
    type: FUND_METHOD_TYPE_ENUMS.E_WALLET,
    value: 201,
    label: "Bigpayz Internet Banking",
    payout_method_id: 201,
    method_type: EWALLET_METHOD_TYPE,
    payment_gateway_name: "bigpayz_ewallet",
    pg_code: "bigpayz"
  },
  {
    type: FUND_METHOD_TYPE_ENUMS.E_WALLET,
    value: 202,
    label: "StarPago BR",
    payout_method_id: 202,
    method_type: EWALLET_METHOD_TYPE,
    payment_gateway_name: "gspay_gold_brl_starpagobr",
    pg_code: "starpagobr"
  },
  {
    type: FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT,
    value: 701,
    label: "CoinPay",
    payout_method_id: 701,
    method_type: CRYPTO_WALLET_METHOD_TYPE,
    payment_gateway_name: "coinpay_crypto_payment",
    pg_code: "coinpay"
  },
  {
    type: FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT,
    value: 702,
    label: "FastChain",
    payout_method_id: 702,
    method_type: CRYPTO_WALLET_METHOD_TYPE,
    payment_gateway_name: "fastchain_crypto_payment",
    pg_code: "fastchain"
  }
]

export const MOCK_BANK_OPTIONS_BY_TYPE: Record<number, OptionItem[]> = {
  [FUND_METHOD_TYPE_ENUMS.E_WALLET]: [
    { value: 501, label: "GCash" },
    { value: 502, label: "Maya Wallet" },
    { value: 503, label: "Touch n Go" }
  ],
  [FUND_METHOD_TYPE_ENUMS.CRYPTO_WALLET]: [
    { value: 601, label: "TRC20" },
    { value: 602, label: "ERC20" },
    { value: 603, label: "BEP20" }
  ],
  [FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT]: [
    { value: 611, label: "Polygon" },
    { value: 612, label: "Arbitrum" },
    { value: 613, label: "Base" }
  ]
}

export const MOCK_CRYPTO_OPTIONS: OptionItem[] = [
  { value: 301, label: "USDT" },
  { value: 302, label: "USDC" },
  { value: 303, label: "BTC" }
]
