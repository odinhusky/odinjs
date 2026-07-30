import type { DepositPaymentDetailResponseType } from "@shared-lib/api/apiFunctions/bank_depositPaymentDetail"
import type {
  AgentPaymentGatewayItem,
  PlayerPaymentGatewayGroupItem
} from "@shared-lib/api/apiFunctions/paymentGroup_getPlayerPaymentGatewayGroups"
import type { UserWalletItem } from "@shared-lib/api/apiFunctions/userInfo_getUserWalletList"
import { CURRENCY_TYPE_ENUMS } from "../../constants/enums/currencyType"

export interface DepositCategoryOption {
  labelKey: string
  value: CURRENCY_TYPE_ENUMS
}

export interface DepositPaymentGroupOption {
  currencyCode: string
  currencyId: number
  currencyType: CURRENCY_TYPE_ENUMS
  id: number
  imgUrl: string
  logo_image_id: number
  maxAmount: string
  minAmount: string
  name: string
  rangeOptions: DepositPaymentGroupRangeOption[]
  rangeText: string
  sortPriority: number
}

export interface DepositPaymentGroupRangeOption {
  id: number
  label: string
  maxAmount: string
  minAmount: string
}

export interface DepositGatewayMatch {
  gateway: AgentPaymentGatewayItem
  gatewayId: number
  group: PlayerPaymentGatewayGroupItem
  groupId: number
}

export interface DepositGatewayMatchParams {
  amount: string
  paymentGroups: PlayerPaymentGatewayGroupItem[]
  selectedCurrency: string
  selectedGroupId: number
  walletList: UserWalletItem[]
}

interface DepositCategoryConfig extends DepositCategoryOption {
  currencyType: CURRENCY_TYPE_ENUMS
}

interface NumericField {
  raw: string
  value: number
}

const UNLIMITED_AVAILABLE_AMOUNT = -1

const DEPOSIT_CATEGORY_CONFIGS: readonly DepositCategoryConfig[] = [
  {
    labelKey: "fiat_currency",
    value: CURRENCY_TYPE_ENUMS.FIAT,
    currencyType: CURRENCY_TYPE_ENUMS.FIAT
  },
  {
    labelKey: "member.bank.Crypto",
    value: CURRENCY_TYPE_ENUMS.CRYPTO,
    currencyType: CURRENCY_TYPE_ENUMS.CRYPTO
  }
]

const getDisplayText = (value: unknown): string => {
  if (value === null || value === undefined) return ""
  return String(value).trim()
}

const getPositiveNumber = (value: unknown): number | null => {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null
}

const parseRequiredNumber = (value: unknown, fieldName: string): number => {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) {
    throw new Error(`Invalid deposit payment gateway group field: ${fieldName}`)
  }
  return numberValue
}

const parseRequiredNumericField = (value: unknown, fieldName: string): NumericField => {
  return {
    raw: getDisplayText(value),
    value: parseRequiredNumber(value, fieldName)
  }
}

const formatRangeAmount = (field: NumericField): string => {
  return field.value.toLocaleString("en-US", { maximumFractionDigits: 2 })
}

const getSortedGroups = (groups: PlayerPaymentGatewayGroupItem[]): PlayerPaymentGatewayGroupItem[] => {
  return [...groups]
    .filter((group) => group.agent_payment_gateways.length > 0)
    .sort((a, b) => a.sort_priority - b.sort_priority || a.name.localeCompare(b.name) || a.id - b.id)
}

const getSortedGateways = (gateways: AgentPaymentGatewayItem[]): AgentPaymentGatewayItem[] => {
  return [...gateways].sort((a, b) => a.sort_priority - b.sort_priority || a.name.localeCompare(b.name) || a.id - b.id)
}

const isCurrencyType = (value: unknown): value is CURRENCY_TYPE_ENUMS => {
  return Number(value) === CURRENCY_TYPE_ENUMS.FIAT || Number(value) === CURRENCY_TYPE_ENUMS.CRYPTO
}

const getCategoryConfig = (category: CURRENCY_TYPE_ENUMS): DepositCategoryConfig | undefined => {
  return DEPOSIT_CATEGORY_CONFIGS.find((config) => config.value === category)
}

const mapCategoryConfigToOption = (config: DepositCategoryConfig): DepositCategoryOption => ({
  labelKey: config.labelKey,
  value: config.value
})

const getCurrencyType = (group: PlayerPaymentGatewayGroupItem): CURRENCY_TYPE_ENUMS => {
  if (!isCurrencyType(group.currency_type)) {
    throw new Error(`Invalid deposit payment gateway group field: currency_type`)
  }
  return Number(group.currency_type) as CURRENCY_TYPE_ENUMS
}

export const resolveDepositCurrencyCode = (currencyId: number, walletList: UserWalletItem[]): string => {
  return walletList.find((wallet) => Number(wallet.currency_id) === Number(currencyId))?.currency_code || String(currencyId)
}

const isGroupForCurrency = (
  group: PlayerPaymentGatewayGroupItem,
  selectedCurrency: string,
  walletList: UserWalletItem[]
): boolean => {
  return resolveDepositCurrencyCode(Number(group.currency), walletList) === selectedCurrency
}

const isGroupForCategory = (group: PlayerPaymentGatewayGroupItem, selectedCategory: CURRENCY_TYPE_ENUMS): boolean => {
  const config = getCategoryConfig(selectedCategory)
  return Boolean(config && getCurrencyType(group) === config.currencyType)
}

const getGroupRange = (group: PlayerPaymentGatewayGroupItem): { max: NumericField; min: NumericField } | null => {
  const fields = group.agent_payment_gateways.map((gateway) => ({
    max: parseRequiredNumericField(gateway.max_amount, "max_amount"),
    min: parseRequiredNumericField(gateway.min_amount, "min_amount")
  }))

  if (fields.length === 0) return null

  return fields.reduce(
    (result, item) => ({
      max: item.max.value > result.max.value ? item.max : result.max,
      min: item.min.value < result.min.value ? item.min : result.min
    }),
    fields[0]!
  )
}

export const getDepositGroupRangeText = (group: PlayerPaymentGatewayGroupItem): string => {
  const range = getGroupRange(group)
  return range ? `${formatRangeAmount(range.min)} ~ ${formatRangeAmount(range.max)}` : ""
}

const getDepositGatewayRangeOption = (gateway: AgentPaymentGatewayItem): DepositPaymentGroupRangeOption => {
  const min = parseRequiredNumericField(gateway.min_amount, "min_amount")
  const max = parseRequiredNumericField(gateway.max_amount, "max_amount")

  return {
    id: Number(gateway.id),
    label: `${formatRangeAmount(min)} - ${formatRangeAmount(max)}`,
    maxAmount: max.raw,
    minAmount: min.raw
  }
}

export const getInitialDepositCurrency = (
  paymentGroups: PlayerPaymentGatewayGroupItem[],
  walletList: UserWalletItem[],
  preferredCurrency: string
): string => {
  const supportedCurrencies = getDepositCurrencyOptions(paymentGroups, walletList)
  if (preferredCurrency && supportedCurrencies.includes(preferredCurrency)) return preferredCurrency
  return supportedCurrencies[0] || ""
}

export const shouldShowDepositCurrencySelector = (supportedCurrencies: string[]): boolean => {
  return supportedCurrencies.length > 1
}

export const getDepositCategoryOptions = (
  paymentGroups: PlayerPaymentGatewayGroupItem[],
  selectedCurrency: string,
  walletList: UserWalletItem[]
): DepositCategoryOption[] => {
  if (!selectedCurrency) return []

  const availableTypes = new Set(
    paymentGroups
      .filter((group) => isGroupForCurrency(group, selectedCurrency, walletList))
      .filter((group) => group.agent_payment_gateways.length > 0)
      .map(getCurrencyType)
  )

  return DEPOSIT_CATEGORY_CONFIGS.filter((config) => availableTypes.has(config.currencyType)).map(mapCategoryConfigToOption)
}

export const getDepositCurrencyOptions = (
  paymentGroups: PlayerPaymentGatewayGroupItem[],
  walletList: UserWalletItem[]
): string[] => {
  const sortedGroups = getSortedGroups(paymentGroups)

  return sortedGroups.reduce<string[]>((result, group) => {
    const currencyCode = resolveDepositCurrencyCode(Number(group.currency), walletList)
    if (!currencyCode || result.includes(currencyCode)) return result
    return [...result, currencyCode]
  }, [])
}

export const getInitialDepositCategory = (
  paymentGroups: PlayerPaymentGatewayGroupItem[],
  selectedCurrency: string,
  walletList: UserWalletItem[]
): CURRENCY_TYPE_ENUMS | "" => {
  return getDepositCategoryOptions(paymentGroups, selectedCurrency, walletList)[0]?.value || ""
}

export const shouldShowDepositCategorySelector = (categoryOptions: DepositCategoryOption[]): boolean => {
  return categoryOptions.length > 1
}

export const getDepositPaymentGroupOptions = (
  paymentGroups: PlayerPaymentGatewayGroupItem[],
  selectedCurrency: string,
  selectedCategory: CURRENCY_TYPE_ENUMS,
  walletList: UserWalletItem[],
  logoMap: Record<number, string>
): DepositPaymentGroupOption[] => {
  if (!selectedCurrency) return []

  return getSortedGroups(paymentGroups)
    .filter((group) => isGroupForCurrency(group, selectedCurrency, walletList))
    .filter((group) => isGroupForCategory(group, selectedCategory))
    .map((group) => {
      const logoImageId = getPositiveNumber(group.logo_image_id) || 0
      const groupRange = getGroupRange(group)

      return {
        currencyCode: resolveDepositCurrencyCode(Number(group.currency), walletList),
        currencyId: Number(group.currency),
        currencyType: getCurrencyType(group),
        id: Number(group.id),
        imgUrl: logoMap[logoImageId] || getDisplayText(group.icon_path),
        logo_image_id: logoImageId,
        maxAmount: groupRange?.max.raw || "0",
        minAmount: groupRange?.min.raw || "0",
        name: getDisplayText(group.name),
        rangeOptions: getSortedGateways(group.agent_payment_gateways).map(getDepositGatewayRangeOption),
        rangeText: groupRange ? `${formatRangeAmount(groupRange.min)} ~ ${formatRangeAmount(groupRange.max)}` : "",
        sortPriority: Number(group.sort_priority)
      }
    })
}

const getDepositAmount = (amount: string): number | null => {
  const numberValue = Number(amount.replace(/,/g, ""))
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null
}

const isGatewayEligible = (gateway: AgentPaymentGatewayItem, amount: number): boolean => {
  const minAmount = parseRequiredNumber(gateway.min_amount, "min_amount")
  const maxAmount = parseRequiredNumber(gateway.max_amount, "max_amount")
  const availableAmount = parseRequiredNumber(gateway.available_amount, "available_amount")

  return (
    amount >= minAmount &&
    amount <= maxAmount &&
    (availableAmount === UNLIMITED_AVAILABLE_AMOUNT || amount <= availableAmount)
  )
}

export const findDepositGatewayMatch = ({
  amount,
  paymentGroups,
  selectedCurrency,
  selectedGroupId,
  walletList
}: DepositGatewayMatchParams): DepositGatewayMatch | null => {
  const depositAmount = getDepositAmount(amount)
  if (depositAmount === null || !selectedCurrency || !selectedGroupId) return null

  const group =
    getSortedGroups(paymentGroups).find((item) => {
      return Number(item.id) === selectedGroupId && isGroupForCurrency(item, selectedCurrency, walletList)
    }) || null

  if (!group) return null

  const gateway = getSortedGateways(group.agent_payment_gateways).find((item) => isGatewayEligible(item, depositAmount)) || null
  if (!gateway) return null

  return {
    gateway,
    gatewayId: Number(gateway.id),
    group,
    groupId: Number(group.id)
  }
}

export const isDepositBankTransferDetail = (detail: DepositPaymentDetailResponseType | null): boolean => {
  if (!detail) return false
  return Boolean(getDisplayText(detail.bank_name) || getDisplayText(detail.bank_account) || getDisplayText(detail.bank_account_name))
}

export const isDepositBlockchainDetail = (detail: DepositPaymentDetailResponseType | null): boolean => {
  if (!detail) return false
  return Boolean(getDisplayText(detail.chain) && getDisplayText(detail.wallet_address))
}

export const shouldRequireDepositUpload = (detail: DepositPaymentDetailResponseType | null): boolean => {
  return isDepositBankTransferDetail(detail) || isDepositBlockchainDetail(detail)
}
