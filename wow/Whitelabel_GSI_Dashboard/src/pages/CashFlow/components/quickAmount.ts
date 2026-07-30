import Decimal from "decimal.js"
import { SERVICE_TYPE } from "@/utils/constants"

export type QuickAmountValue = string | number | null | undefined

export type QuickAmountRange = {
  min: QuickAmountValue
  max: QuickAmountValue
}

export type QuickAmountValidationParams = {
  amounts: QuickAmountValue[]
  serviceType: number
  depositRange: QuickAmountRange
  withdrawRange: QuickAmountRange
}

export type QuickAmountValidationResult = {
  isValid: boolean
  messageI18nKey: string
  quickAmounts: string[]
}

const emptyMessageI18nKey = ""

function sanitizeQuickAmount(value: QuickAmountValue): string {
  if (value === null || value === undefined) {
    return ""
  }

  return String(value).replace(/,/g, "").trim()
}

function parseQuickAmount(value: QuickAmountValue): Decimal | null {
  const sanitizedValue = sanitizeQuickAmount(value)
  if (!sanitizedValue || sanitizedValue === "--") {
    return null
  }

  try {
    const decimalValue = new Decimal(sanitizedValue)
    if (!decimalValue.isFinite()) {
      return null
    }

    return decimalValue
  } catch {
    return null
  }
}

function isBlankQuickAmount(value: QuickAmountValue): boolean {
  const sanitizedValue = sanitizeQuickAmount(value)
  return !sanitizedValue || sanitizedValue === "--"
}

function resolveQuickAmountRange(params: QuickAmountValidationParams): QuickAmountRange {
  if (params.serviceType === SERVICE_TYPE.Enums.WithdrawalFlow) {
    return params.withdrawRange
  }

  return params.depositRange
}

export function isQuickAmountSupportedService(serviceType: number): boolean {
  return serviceType === SERVICE_TYPE.Enums.DepositFlow || serviceType === SERVICE_TYPE.Enums.WithdrawalFlow
}

export function getQuickAmountHintI18nKey(serviceType: number): string {
  if (serviceType === SERVICE_TYPE.Enums.WithdrawalFlow) {
    return "quick_select_withdraw_hint"
  }

  return "quick_select_deposit_hint"
}

export function normalizeQuickAmount(value: QuickAmountValue): string {
  const decimalValue = parseQuickAmount(value)
  if (!decimalValue) {
    return ""
  }

  return decimalValue.toDecimalPlaces(2, Decimal.ROUND_DOWN).toFixed(2)
}

export function normalizeQuickAmounts(amounts: QuickAmountValue[]): string[] {
  return amounts
    .map(normalizeQuickAmount)
    .filter((amount) => amount !== "")
    .sort((currentAmount, nextAmount) => new Decimal(currentAmount).comparedTo(new Decimal(nextAmount)))
}

export function validateQuickAmountsWithinLimit(params: QuickAmountValidationParams): QuickAmountValidationResult {
  const enteredAmounts = params.amounts.filter((amount) => !isBlankQuickAmount(amount))
  const quickAmounts = normalizeQuickAmounts(params.amounts)
  const messageI18nKey = getQuickAmountHintI18nKey(params.serviceType)

  if (!isQuickAmountSupportedService(params.serviceType)) {
    return {
      isValid: true,
      messageI18nKey: emptyMessageI18nKey,
      quickAmounts
    }
  }

  if (enteredAmounts.length !== quickAmounts.length) {
    return {
      isValid: false,
      messageI18nKey,
      quickAmounts
    }
  }

  const range = resolveQuickAmountRange(params)
  const min = parseQuickAmount(range.min) || new Decimal(0)
  const max = parseQuickAmount(range.max) || new Decimal(0)
  const hasOutsideAmount = quickAmounts.some((amount) => {
    const quickAmount = new Decimal(amount)
    const isLowerThanMin = quickAmount.lessThan(min)
    const isGreaterThanMax = max.greaterThan(0) && quickAmount.greaterThan(max)

    return isLowerThanMin || isGreaterThanMax
  })

  return {
    isValid: !hasOutsideAmount,
    messageI18nKey: hasOutsideAmount ? messageI18nKey : emptyMessageI18nKey,
    quickAmounts
  }
}
