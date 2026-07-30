import type {
  BonusTransferCondition,
  BonusTransferConditionCode,
  BonusTransferConditionRecord,
  BonusTransferConditionValue,
  BonusTransferStatus,
  BonusWalletTransferRule,
  BonusWalletTransferRuleSetting
} from "@shared-lib/api/commonTypes/bonusWalletTypes"

export type VisibleBonusTransferConditionCode = Exclude<BonusTransferConditionCode, "blocked_label">

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

const toRule = (value: unknown): BonusWalletTransferRule => {
  if (!isRecord(value)) {
    throw new Error("bonus_wallet_transfer_rule must be an object.")
  }
  return value as BonusWalletTransferRule
}

export const parseBonusWalletTransferRule = (
  value: BonusWalletTransferRuleSetting | undefined
): BonusWalletTransferRule | null => {
  if (value === null || value === undefined) return null
  if (typeof value !== "string") {
    return toRule(value)
  }
  try {
    return toRule(JSON.parse(value))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Invalid bonus_wallet_transfer_rule JSON: ${message}`)
  }
}

export const getConfiguredConditionCodes = (
  rule: BonusWalletTransferRule | null
): VisibleBonusTransferConditionCode[] => {
  if (!rule || !rule.enabled) return []

  const codes: VisibleBonusTransferConditionCode[] = ["turnover_or_balance"]

  if (rule.first_deposit_required) codes.push("first_deposit")
  if (Array.isArray(rule.history_deposit_thresholds) && rule.history_deposit_thresholds.length > 0)
    codes.push("history_deposit")
  if (rule.min_vip_level > 0) codes.push("vip")
  if (rule.kyc_required) codes.push("kyc")
  if (rule.active_downline?.enabled) codes.push("active_downline")

  return codes
}

export const normalizeConditionCode = (code: string): string => {
  return code
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase()
}

export const getStatusCondition = (
  status: BonusTransferStatus | null,
  code: VisibleBonusTransferConditionCode
): BonusTransferCondition | null => {
  if (!status) return null
  const list = status.conditions || []
  return (
    list.find((condition) => condition.enabled && normalizeConditionCode(condition.code) === code) || null
  )
}

export const getVisibleConditions = (
  status: BonusTransferStatus | null,
  rule: BonusWalletTransferRule | null
): BonusTransferCondition[] => {
  return getConfiguredConditionCodes(rule)
    .map((code) => getStatusCondition(status, code))
    .filter((c): c is BonusTransferCondition => c !== null)
}

export const isBlockedByLabel = (status: BonusTransferStatus | null): boolean => {
  if (!status) return false
  const blocked = (status.conditions || []).find(
    (condition) => condition.enabled && normalizeConditionCode(condition.code) === "blocked_label"
  )
  return Boolean(blocked && !blocked.passed)
}

const toNumber = (value: BonusTransferConditionValue | undefined): number => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

const getNumberField = (record: BonusTransferConditionRecord | null | undefined, key: string): number => {
  return toNumber(record?.[key])
}

const getStringField = (record: BonusTransferConditionRecord | null | undefined, key: string): string => {
  const value = record?.[key]
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return ""
}

const isConditionRecord = (
  value: BonusTransferConditionValue | undefined
): value is BonusTransferConditionRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

const getRemainingValue = (currentValue: number, requiredValue: number): number => {
  return Math.max(requiredValue - currentValue, 0)
}

export const getConditionProgress = (
  currentValue: number,
  requiredValue: number,
  passed: boolean
): number => {
  if (passed) return 100
  if (requiredValue <= 0) return 0
  return Math.min((currentValue / requiredValue) * 100, 100)
}

export interface ConditionMetric {
  currentValue: number
  requiredValue: number
  remainingValue: number
  progress: number
  currentLabel: string
  requiredLabel: string
  remainingLabel: string
  /** Only meaningful for KYC condition; otherwise an empty string. */
  approvalCurrent?: string
  approvalRequired?: string
}

interface MetricContext {
  statusCurrencyId?: number
  formatAmount?: (value: number) => string
  formatCount?: (value: number) => string
}

const defaultAmountFormatter = (value: number) => value.toLocaleString("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

const defaultCountFormatter = (value: number) => String(value)

const buildAmount = (
  current: number,
  required: number,
  remaining: number,
  passed: boolean,
  formatAmount: (value: number) => string
): ConditionMetric => ({
  currentValue: current,
  requiredValue: required,
  remainingValue: remaining,
  progress: getConditionProgress(current, required, passed),
  currentLabel: formatAmount(current),
  requiredLabel: formatAmount(required),
  remainingLabel: formatAmount(remaining)
})

const buildCount = (
  current: number,
  required: number,
  remaining: number,
  passed: boolean,
  formatCount: (value: number) => string
): ConditionMetric => ({
  currentValue: current,
  requiredValue: required,
  remainingValue: remaining,
  progress: getConditionProgress(current, required, passed),
  currentLabel: formatCount(current),
  requiredLabel: formatCount(required),
  remainingLabel: formatCount(remaining)
})

const turnoverOrBalanceMetric = (
  condition: BonusTransferCondition,
  formatAmount: (value: number) => string
): ConditionMetric => {
  const isBalanceMode = getStringField(condition.current, "comparison_mode") === "balance"
  const currentValue = isBalanceMode
    ? getNumberField(condition.current, "balance")
    : getNumberField(condition.current, "turnover")
  const requiredValue = isBalanceMode
    ? getNumberField(condition.current, "remaining_threshold") ||
      getNumberField(condition.required, "balance_gte_remaining_threshold")
    : getNumberField(condition.current, "audit_turnover")
  const remainingValue = isBalanceMode
    ? getRemainingValue(currentValue, requiredValue)
    : getNumberField(condition.current, "remaining_threshold") || getRemainingValue(currentValue, requiredValue)

  return buildAmount(currentValue, requiredValue, remainingValue, condition.passed, formatAmount)
}

const firstDepositMetric = (
  condition: BonusTransferCondition,
  formatCount: (value: number) => string
): ConditionMetric => {
  const hasFirstDeposit =
    condition.passed ||
    Boolean(getStringField(condition.current, "first_deposit_at")) ||
    getNumberField(condition.current, "first_deposit_id") > 0
  const currentValue = hasFirstDeposit ? 1 : 0
  const requiredValue = 1
  return buildCount(currentValue, requiredValue, getRemainingValue(currentValue, requiredValue), condition.passed, formatCount)
}

const historyDepositMetric = (
  condition: BonusTransferCondition,
  formatAmount: (value: number) => string
): ConditionMetric => {
  const currentValue = getNumberField(condition.current, "total_deposit")
  const requiredValue = getNumberField(condition.required, "minimum_total_deposit")
  return buildAmount(currentValue, requiredValue, getRemainingValue(currentValue, requiredValue), condition.passed, formatAmount)
}

const vipMetric = (
  condition: BonusTransferCondition,
  formatCount: (value: number) => string
): ConditionMetric => {
  const currentValue = getNumberField(condition.current, "member_level")
  const requiredValue = getNumberField(condition.required, "min_vip_level")
  return buildCount(currentValue, requiredValue, getRemainingValue(currentValue, requiredValue), condition.passed, formatCount)
}

const kycMetric = (condition: BonusTransferCondition): ConditionMetric => {
  const approvalCurrent = getStringField(condition.current, "approval_status") || "-"
  const approvalRequired = getStringField(condition.required, "approval_status") || "verified"
  const currentValue = condition.passed ? 1 : 0
  const requiredValue = 1
  return {
    currentValue,
    requiredValue,
    remainingValue: requiredValue - currentValue,
    progress: getConditionProgress(currentValue, requiredValue, condition.passed),
    currentLabel: approvalCurrent,
    requiredLabel: approvalRequired,
    remainingLabel: approvalRequired,
    approvalCurrent,
    approvalRequired
  }
}

const activeDownlineMetric = (
  condition: BonusTransferCondition,
  currencyId: number | undefined,
  formatCount: (value: number) => string
): ConditionMetric => {
  const countsValue = condition.current?.counts
  const countRecords = Array.isArray(countsValue) ? countsValue.filter(isConditionRecord) : []
  const matched =
    countRecords.find((record) => getNumberField(record, "currency_id") === currencyId) || countRecords[0]
  const currentValue = getNumberField(matched, "active_count")
  const requiredValue = getNumberField(condition.required, "min_count")
  return buildCount(currentValue, requiredValue, getRemainingValue(currentValue, requiredValue), condition.passed, formatCount)
}

export const getConditionMetric = (
  condition: BonusTransferCondition,
  context: MetricContext = {}
): ConditionMetric => {
  const formatAmount = context.formatAmount || defaultAmountFormatter
  const formatCount = context.formatCount || defaultCountFormatter
  const normalized = normalizeConditionCode(condition.code)

  if (normalized === "turnover_or_balance") return turnoverOrBalanceMetric(condition, formatAmount)
  if (normalized === "first_deposit") return firstDepositMetric(condition, formatCount)
  if (normalized === "history_deposit") return historyDepositMetric(condition, formatAmount)
  if (normalized === "vip") return vipMetric(condition, formatCount)
  if (normalized === "kyc") return kycMetric(condition)
  if (normalized === "active_downline")
    return activeDownlineMetric(condition, context.statusCurrencyId, formatCount)

  return buildCount(condition.passed ? 1 : 0, 1, condition.passed ? 0 : 1, condition.passed, formatCount)
}
