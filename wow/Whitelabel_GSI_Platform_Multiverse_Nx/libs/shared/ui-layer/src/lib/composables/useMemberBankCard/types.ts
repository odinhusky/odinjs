import type { BankCardItemType } from "@shared-lib/api/apiFunctions/bank_getBankCardList"
import type { PayoutSettingMethodType } from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsList"
import type { PaymentGateway } from "@shared-lib/api/apiFunctions/bank_getPaymentTypeList"

export interface CurrencyOption {
  id: number
  code: string
}

export interface PaymentTypePayload {
  payment_type: number[]
  supported_payment_gateway: PaymentGateway[]
}

export interface MockStoreState {
  initialized: boolean
  lastId: number
  cards: BankCardItemType[]
  cryptoIds: Record<number, number>
}

export interface CustomLabelProvider {
  payment_gateway_name: string
  pg_code: string
}

export interface OptionItem {
  label: string
  value: string | number
}

export interface PaymentGatewayOption extends OptionItem {
  type: number
  currency_code?: string
  currency_id?: number
  method_type?: PayoutSettingMethodType
  payout_method_id?: number
  payment_gateway_name?: string
  pg_code?: string
}

export interface BankCardFormState {
  id?: number
  currency: string
  payment_type_id: number
  payment_gateway_id?: number
  payout_method_id?: number
  ewallet_provider_id?: number
  name: string
  bank_name: string
  account_name: string
  account_number: string
  bank_id?: number
  crypto_id?: number
  wallet_address: string
}

export interface BankCardCreateSeed {
  currency?: string
  currencyId?: number
  paymentTypeId?: number
  paymentGatewayId?: number
  payoutMethodId?: number | null
}
