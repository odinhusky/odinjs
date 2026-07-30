import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"
import type { PayoutSettingPayload } from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsList"
import type { PostPayoutSettingsParamsType } from "@shared-lib/api/apiFunctions/bank_postPayoutSettings"
import type { PutPayoutSettingsParamsType } from "@shared-lib/api/apiFunctions/bank_putPayoutSettings"
import type { BankCardFormState, OptionItem } from "./types"
import { getPayoutSettingMethodTypeFromPaymentType } from "./utils"

export type PutPayoutSettingsBodyType = Omit<PutPayoutSettingsParamsType, "id">

export interface BankCardValidationMessages {
  enterCardNumberFirst: string
  selectPaymentMethod: string
  selectPaymentProvider: string
}

export const createDefaultForm = (): BankCardFormState => ({
  currency: "",
  payment_type_id: FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER,
  payment_gateway_id: undefined,
  payout_method_id: undefined,
  ewallet_provider_id: undefined,
  name: "",
  bank_name: "",
  account_name: "",
  account_number: "",
  bank_id: undefined,
  crypto_id: undefined,
  wallet_address: ""
})

export const resetFormState = (form: BankCardFormState) => {
  const next = createDefaultForm()
  form.id = undefined
  form.currency = next.currency
  form.payment_type_id = next.payment_type_id
  form.payment_gateway_id = next.payment_gateway_id
  form.payout_method_id = next.payout_method_id
  form.ewallet_provider_id = next.ewallet_provider_id
  form.name = next.name
  form.bank_name = next.bank_name
  form.account_name = next.account_name
  form.account_number = next.account_number
  form.bank_id = next.bank_id
  form.crypto_id = next.crypto_id
  form.wallet_address = next.wallet_address
}

export const resetTypeRelatedFormFields = (form: BankCardFormState) => {
  form.payment_gateway_id = undefined
  form.payout_method_id = undefined
  form.ewallet_provider_id = undefined
  form.bank_name = ""
  form.account_name = ""
  form.account_number = ""
  form.bank_id = undefined
  form.crypto_id = undefined
  form.wallet_address = ""
}

export const clearFormErrors = (errors: Record<string, string>) => {
  Object.keys(errors).forEach((key) => {
    errors[key] = ""
  })
}

export const validateFormState = ({
  form,
  errors,
  showGateway,
  isEWallet,
  isCrypto,
  messages
}: {
  form: BankCardFormState
  errors: Record<string, string>
  showGateway: boolean
  isEWallet: boolean
  isCrypto: boolean
  messages: BankCardValidationMessages
}) => {
  clearFormErrors(errors)

  if (!form.currency) errors.currency = "請選擇幣種"
  if (!form.payment_type_id) errors.payment_type_id = "請選擇類型"
  if (!form.name.trim()) errors.name = "請輸入卡片名稱"
  if (showGateway && !form.payment_gateway_id) errors.payment_gateway_id = messages.selectPaymentMethod
  if (!form.payout_method_id) errors.payment_gateway_id = messages.selectPaymentMethod

  if (Number(form.payment_type_id) === FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER) {
    if (!form.bank_name.trim()) errors.bank_name = "請輸入銀行名稱"
    if (!form.account_name.trim()) errors.account_name = "請輸入帳戶姓名"
    if (!form.account_number.trim()) errors.account_number = messages.enterCardNumberFirst
  }

  if (isEWallet) {
    if (!form.ewallet_provider_id) errors.ewallet_provider_id = messages.selectPaymentProvider
    if (!form.account_name.trim()) errors.account_name = "請輸入帳戶姓名"
    if (!form.account_number.trim()) errors.account_number = "請輸入帳號"
  }

  if (isCrypto) {
    if (!form.crypto_id) errors.crypto_id = "請選擇幣別"
    if (!form.bank_id) errors.bank_id = "請選擇鏈名稱"
    if (!form.wallet_address.trim()) errors.wallet_address = "請輸入錢包地址"
  }

  return Object.values(errors).every((item) => !item)
}

const buildPayoutSettingPayload = ({
  form,
  isEWallet,
  isCrypto,
  bankOptions
}: {
  form: BankCardFormState
  isEWallet: boolean
  isCrypto: boolean
  bankOptions: OptionItem[]
}): PayoutSettingPayload => {
  const payload: PayoutSettingPayload = {}

  if (Number(form.payment_type_id) === FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER) {
    payload.bank_name = form.bank_name.trim()
    payload.account_name = form.account_name.trim()
    payload.account_number = form.account_number.trim()
    if (form.bank_id) payload.bank_id = Number(form.bank_id)
  }

  if (isEWallet) {
    payload.account_name = form.account_name.trim()
    payload.account_number = form.account_number.trim()
  }

  if (isCrypto) {
    payload.crypto_id = Number(form.crypto_id)
    payload.wallet_address = form.wallet_address.trim()
    payload.chain = bankOptions.find((item) => Number(item.value) === Number(form.bank_id))?.label || ""
  }

  return payload
}

export const buildPayoutSettingsCreatePayload = ({
  form,
  isEWallet,
  isCrypto,
  bankOptions
}: {
  form: BankCardFormState
  isEWallet: boolean
  isCrypto: boolean
  bankOptions: OptionItem[]
}): PostPayoutSettingsParamsType => {
  return {
    payout_method_id: Number(form.payout_method_id),
    name: form.name.trim(),
    method_type: getPayoutSettingMethodTypeFromPaymentType(Number(form.payment_type_id)),
    ewallet_provider_id: isEWallet ? Number(form.ewallet_provider_id) : 0,
    payload: buildPayoutSettingPayload({ form, isEWallet, isCrypto, bankOptions })
  }
}

export const buildPayoutSettingsUpdatePayload = ({
  form,
  isEWallet,
  isCrypto,
  bankOptions
}: {
  form: BankCardFormState
  isEWallet: boolean
  isCrypto: boolean
  bankOptions: OptionItem[]
}): PutPayoutSettingsBodyType => {
  return {
    name: form.name.trim(),
    ewallet_provider_id: isEWallet ? Number(form.ewallet_provider_id) : 0,
    payload: buildPayoutSettingPayload({ form, isEWallet, isCrypto, bankOptions })
  }
}
