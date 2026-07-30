import { FUND_METHOD_TYPE_ENUMS, FUND_METHOD_TYPE_I18N_KEYS } from "@shared-lib/constants/enums/fundMethodType"
import type { EwalletProvider } from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsEwalletProviderList"
import type { BankCardItemType } from "@shared-lib/api/apiFunctions/bank_getBankCardList"
import type { GetBankCardInfoResponseType } from "@shared-lib/api/apiFunctions/bank_getBankCardInfo"
import type {
  PayoutSettingItem,
  PayoutSettingMethodType,
  PayoutSettingPayload
} from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsList"
import type { PaymentGateway } from "@shared-lib/api/apiFunctions/bank_getPaymentTypeList"
import type {
  AgentPaymentGatewayItem,
  PlayerPaymentGatewayGroupItem
} from "@shared-lib/api/apiFunctions/paymentGroup_getPlayerPaymentGatewayGroups"
import type { UserWalletItem } from "@shared-lib/api/apiFunctions/userInfo_getUserWalletList"
import {
  BANK_CARD_METHOD_TYPE,
  CRYPTO_WALLET_METHOD_TYPE,
  CUSTOM_LABEL_PROVIDERS,
  EWALLET_METHOD_TYPE,
  MOCK_PAYMENT_GATEWAYS,
  PAYMENT_TYPE_BY_PAYOUT_METHOD_TYPE
} from "./constants"
import type { CurrencyOption, MockStoreState, OptionItem, PaymentGatewayOption } from "./types"

export const parseEnvBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value
  return ["true", "1", "yes", "on"].includes(String(value).trim().toLowerCase())
}

const getPositiveNumber = (value: unknown): number | null => {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null
}

const getDisplayText = (value: unknown): string => {
  if (value === null || value === undefined) return ""
  return String(value).trim()
}

const isPayoutSettingMethodType = (value: unknown): value is PayoutSettingMethodType => {
  const numberValue = Number(value)
  return (
    numberValue === BANK_CARD_METHOD_TYPE ||
    numberValue === EWALLET_METHOD_TYPE ||
    numberValue === CRYPTO_WALLET_METHOD_TYPE
  )
}

export const normalizePayoutSettingMethodType = (value: unknown): PayoutSettingMethodType | null => {
  return isPayoutSettingMethodType(value) ? (Number(value) as PayoutSettingMethodType) : null
}

export const getPayoutSettingMethodTypeFromPaymentType = (paymentTypeId: number): PayoutSettingMethodType => {
  if (Number(paymentTypeId) === FUND_METHOD_TYPE_ENUMS.E_WALLET) return EWALLET_METHOD_TYPE
  if (
    Number(paymentTypeId) === FUND_METHOD_TYPE_ENUMS.CRYPTO_WALLET ||
    Number(paymentTypeId) === FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT
  ) {
    return CRYPTO_WALLET_METHOD_TYPE
  }

  return BANK_CARD_METHOD_TYPE
}

const normalizePaymentType = (value: unknown): FUND_METHOD_TYPE_ENUMS | null => {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? (numberValue as FUND_METHOD_TYPE_ENUMS) : null
}

const resolveGatewayMethodType = (
  group: PlayerPaymentGatewayGroupItem,
  gateway: AgentPaymentGatewayItem
): PayoutSettingMethodType => {
  const explicitMethodType =
    normalizePayoutSettingMethodType(gateway.method_type) || normalizePayoutSettingMethodType(group.method_type)
  if (explicitMethodType) return explicitMethodType

  const paymentType = normalizePaymentType(
    gateway.payment_type_id || gateway.type || group.payment_type_id || group.type
  )
  if (paymentType) return getPayoutSettingMethodTypeFromPaymentType(paymentType)

  return Number(group.currency_type) === 2 ? CRYPTO_WALLET_METHOD_TYPE : BANK_CARD_METHOD_TYPE
}

const resolveGatewayPaymentType = (
  group: PlayerPaymentGatewayGroupItem,
  gateway: AgentPaymentGatewayItem,
  methodType: PayoutSettingMethodType
): FUND_METHOD_TYPE_ENUMS => {
  return (
    normalizePaymentType(gateway.payment_type_id || gateway.type || group.payment_type_id || group.type) ||
    PAYMENT_TYPE_BY_PAYOUT_METHOD_TYPE[methodType]
  )
}

const resolveGroupCurrencyCode = (currencyId: number, walletList: UserWalletItem[]): string => {
  return walletList.find((wallet) => Number(wallet.currency_id) === currencyId)?.currency_code || String(currencyId)
}

const getMatchedProviderName = (providerNameMap: Record<number, string>, providerId: unknown): string => {
  const id = getPositiveNumber(providerId)
  if (!id) return ""
  return providerNameMap[id] || String(id)
}

export const normalizeCurrencyOptions = (walletList: UserWalletItem[]): CurrencyOption[] => {
  const currencyByCode = new Map<string, CurrencyOption>()

  walletList.forEach((item) => {
    const code = String(item.currency_code || "").trim()
    if (!code || currencyByCode.has(code)) return

    currencyByCode.set(code, {
      id: Number(item.currency_id),
      code
    })
  })

  return Array.from(currencyByCode.values())
}

export const normalizeTypeLabel = (typeId: number, translate: (key: string) => string) => {
  const key = FUND_METHOD_TYPE_I18N_KEYS[Number(typeId) as FUND_METHOD_TYPE_ENUMS]
  return key ? translate(key) : String(typeId)
}

export const normalizeTypeOptions = (paymentTypes: number[], translate: (key: string) => string) => {
  return paymentTypes.map((type) => ({
    label: normalizeTypeLabel(type, translate),
    value: Number(type)
  }))
}

export const normalizeGateways = (gateways: PaymentGateway[]) => {
  return gateways.map((item) => ({
    type: Number(item.type || 0),
    value: Number(item.id),
    label: item.name,
    payout_method_id: Number(item.id),
    method_type: getPayoutSettingMethodTypeFromPaymentType(Number(item.type || 0)),
    payment_gateway_name: item.payment_gateway_name,
    pg_code: item.pg_code
  }))
}

export const normalizeGatewayGroups = (
  groups: PlayerPaymentGatewayGroupItem[],
  walletList: UserWalletItem[]
): PaymentGatewayOption[] => {
  return groups
    .flatMap((group) => {
      const currencyId = Number(group.currency)
      const currencyCode = resolveGroupCurrencyCode(currencyId, walletList)

      return (group.agent_payment_gateways || []).map((gateway) => {
        const methodType = resolveGatewayMethodType(group, gateway)
        const paymentType = resolveGatewayPaymentType(group, gateway, methodType)
        const gatewayId = getPositiveNumber(gateway.payment_gateway_id) || getPositiveNumber(gateway.id)
        const payoutMethodId = getPositiveNumber(gateway.payout_method_id) || getPositiveNumber(group.payout_method_id)

        if (!gatewayId || !payoutMethodId) return null

        return {
          type: paymentType,
          value: gatewayId,
          label: getDisplayText(gateway.name || group.name),
          currency_code: currencyCode,
          currency_id: currencyId,
          method_type: methodType,
          payout_method_id: payoutMethodId,
          payment_gateway_name: gateway.payment_gateway_name,
          pg_code: gateway.pg_code
        }
      })
    })
    .filter((item): item is PaymentGatewayOption => item !== null)
    .sort((a, b) => a.label.localeCompare(b.label) || Number(a.value) - Number(b.value))
}

export const normalizeTypeOptionsFromGateways = (
  gateways: PaymentGatewayOption[],
  translate: (key: string) => string
): OptionItem[] => {
  const typeIds = Array.from(new Set(gateways.map((gateway) => Number(gateway.type)).filter(Boolean)))
  return normalizeTypeOptions(typeIds, translate)
}

export const normalizeEwalletProviderOptions = (providers: EwalletProvider[]): OptionItem[] => {
  return providers
    .filter((provider) => getPositiveNumber(provider.id))
    .map((provider) => ({
      label: getDisplayText(provider.name || provider.code || provider.id),
      value: Number(provider.id)
    }))
}

export const createEwalletProviderNameMap = (providers: EwalletProvider[]): Record<number, string> => {
  return providers.reduce<Record<number, string>>((result, provider) => {
    const id = getPositiveNumber(provider.id)
    if (!id) return result

    return {
      ...result,
      [id]: getDisplayText(provider.name || provider.code || id)
    }
  }, {})
}

export const shouldUseCustomLabel = (paymentGatewayName?: string, pgCode?: string): boolean => {
  if (!paymentGatewayName || !pgCode) return false

  return CUSTOM_LABEL_PROVIDERS.some(
    (provider) => provider.payment_gateway_name === paymentGatewayName && provider.pg_code === pgCode
  )
}

export const toMockPaymentGatewayPayload = () => {
  return MOCK_PAYMENT_GATEWAYS.map((item) => ({
    id: Number(item.value),
    name: item.label,
    type: item.type,
    method_type: item.method_type,
    payout_method_id: item.payout_method_id,
    payment_gateway_name: item.payment_gateway_name,
    pg_code: item.pg_code
  }))
}

export const resolveCurrencyCodeById = (currencyId: number | undefined, source: CurrencyOption[]) => {
  if (!currencyId) return ""
  const matched = source.find((item) => Number(item.id) === Number(currencyId))
  return matched?.code || ""
}

export const resolveCurrencyIdByCode = (currencyCode: string | undefined, source: CurrencyOption[]) => {
  if (!currencyCode) return undefined
  const matched = source.find((item) => item.code === currencyCode)
  return matched ? Number(matched.id) : undefined
}

export const isVirtualType = (typeId: number) =>
  Number(typeId) === FUND_METHOD_TYPE_ENUMS.CRYPTO_WALLET ||
  Number(typeId) === FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT

export const isBankType = (typeId: number) => Number(typeId) === FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER

export const isEWalletType = (typeId: number) => Number(typeId) === FUND_METHOD_TYPE_ENUMS.E_WALLET

export const isCryptoType = (typeId: number) => isVirtualType(typeId)

export const resolveCurrencyCodeByIdFromSources = ({
  currencyId,
  availableCurrencies,
  walletList
}: {
  currencyId?: number
  availableCurrencies: CurrencyOption[]
  walletList: UserWalletItem[]
}) => {
  return (
    availableCurrencies.find((item) => Number(item.id) === Number(currencyId || 0))?.code ||
    walletList.find((item) => Number(item.currency_id) === Number(currencyId || 0))?.currency_code ||
    ""
  )
}

export const resolveCurrencyIdByCodeFromSources = ({
  currencyCode,
  availableCurrencies,
  walletList
}: {
  currencyCode?: string
  availableCurrencies: CurrencyOption[]
  walletList: UserWalletItem[]
}) => {
  return (
    Number(
      availableCurrencies.find((item) => item.code === currencyCode)?.id ||
        walletList.find((item) => item.currency_code === currencyCode)?.currency_id ||
        0
    ) || undefined
  )
}

export const resolveHeaderCurrencyCodeFromSources = ({
  selectedWallet,
  availableCurrencies,
  walletList
}: {
  selectedWallet: UserWalletItem | null | undefined
  availableCurrencies: CurrencyOption[]
  walletList: UserWalletItem[]
}) => {
  return selectedWallet?.currency_code || availableCurrencies[0]?.code || walletList[0]?.currency_code || ""
}

export const resolveHeaderCurrencyIdFromSources = ({
  selectedWallet,
  availableCurrencies,
  walletList
}: {
  selectedWallet: UserWalletItem | null | undefined
  availableCurrencies: CurrencyOption[]
  walletList: UserWalletItem[]
}) => {
  const headerCode = resolveHeaderCurrencyCodeFromSources({ selectedWallet, availableCurrencies, walletList })
  return (
    Number(
      selectedWallet?.currency_id ||
        resolveCurrencyIdByCodeFromSources({
          currencyCode: headerCode,
          availableCurrencies,
          walletList
        }) ||
        availableCurrencies[0]?.id ||
        walletList[0]?.currency_id ||
        0
    ) || undefined
  )
}

const getPayoutSettingGateway = (
  setting: PayoutSettingItem,
  gateways: PaymentGatewayOption[]
): PaymentGatewayOption | undefined => {
  const payoutMethodId = getPositiveNumber(setting.payout_method_id)
  if (payoutMethodId) {
    const matched = gateways.find((gateway) => Number(gateway.payout_method_id) === payoutMethodId)
    if (matched) return matched
  }

  const methodType = normalizePayoutSettingMethodType(setting.method_type)
  if (!methodType) return undefined

  const paymentType = PAYMENT_TYPE_BY_PAYOUT_METHOD_TYPE[methodType]
  return gateways.find((gateway) => Number(gateway.type) === Number(paymentType))
}

const getPayoutSettingPayload = (setting: PayoutSettingItem): PayoutSettingPayload => {
  return setting.payload || {}
}

export const toBankCardItemFromPayoutSetting = ({
  setting,
  gateways,
  providerNameMap,
  walletList
}: {
  setting: PayoutSettingItem
  gateways: PaymentGatewayOption[]
  providerNameMap: Record<number, string>
  walletList: UserWalletItem[]
}): BankCardItemType | null => {
  const id = getPositiveNumber(setting.id)
  const methodType = normalizePayoutSettingMethodType(setting.method_type)
  if (!id || !methodType) return null

  const payload = getPayoutSettingPayload(setting)
  const gateway = getPayoutSettingGateway(setting, gateways)
  const paymentType = gateway?.type || PAYMENT_TYPE_BY_PAYOUT_METHOD_TYPE[methodType]
  const currencyId =
    getPositiveNumber(gateway?.currency_id) ||
    getPositiveNumber(walletList.find((wallet) => wallet.currency_code === gateway?.currency_code)?.currency_id) ||
    0
  const currencyCode =
    getDisplayText(gateway?.currency_code) ||
    walletList.find((wallet) => Number(wallet.currency_id) === currencyId)?.currency_code ||
    ""
  const ewalletProviderId = getPositiveNumber(setting.ewallet_provider_id) || 0
  const ewalletProviderName = getMatchedProviderName(providerNameMap, ewalletProviderId)

  return {
    id,
    name: getDisplayText(setting.name),
    bank_name:
      methodType === EWALLET_METHOD_TYPE ? ewalletProviderName : getDisplayText(payload.bank_name || payload.chain),
    account_number: getDisplayText(payload.account_number),
    account_name: getDisplayText(payload.account_name),
    currency_id: currencyId,
    payment_type_id: paymentType,
    payment_gateway_id: getPositiveNumber(gateway?.value) || undefined,
    payment_gateway_name: gateway?.label,
    payout_method_id: getPositiveNumber(setting.payout_method_id) || undefined,
    ewallet_provider_id: ewalletProviderId || undefined,
    ewallet_provider_name: ewalletProviderName || undefined,
    pg_code: gateway?.pg_code,
    currency_code: currencyCode,
    branch: "",
    bank_id: Number(payload.bank_id || 0),
    crypto_id: getPositiveNumber(payload.crypto_id) || undefined,
    deleted: false,
    created_at: setting.created_at || "",
    chain: getDisplayText(payload.chain),
    currency_brand: "",
    crypto_rate: 0,
    wallet_address: getDisplayText(payload.wallet_address)
  }
}

export const toCardInfoResponse = (item: BankCardItemType, mockStore: MockStoreState): GetBankCardInfoResponseType => {
  return {
    payment_type_id: item.payment_type_id,
    payment_gateway_id: Number(item.payment_gateway_id || 0),
    name: item.name,
    bank_name: item.bank_name,
    currency_id: item.currency_id,
    account_number: item.account_number,
    account_name: item.account_name,
    crypto_id: Number(item.crypto_id || mockStore.cryptoIds[item.id] || 0),
    bank_id: item.bank_id,
    ewallet_provider_id: item.ewallet_provider_id,
    wallet_address: item.wallet_address,
    currency_brand: item.currency_brand,
    chain: item.chain
  }
}
