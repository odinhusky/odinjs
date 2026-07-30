import { FUND_METHOD_TYPE } from "src/common/utils/constants"

export interface BankCardRealNameGateway {
  value: number | string
  is_bank_card_ignored?: boolean
}

export interface BankCardRealNameContext {
  isEnabled: boolean
  paymentTypeId: number
  paymentGateway: BankCardRealNameGateway | undefined
  realName: string
}

export const isBankCardRealNameRequired = (context: BankCardRealNameContext): boolean => {
  if (!context.isEnabled) return false
  if (context.paymentTypeId === FUND_METHOD_TYPE.Enums.BankTransfer) return true
  if (context.paymentTypeId !== FUND_METHOD_TYPE.Enums.EWallet) return false

  return context.paymentGateway !== undefined && context.paymentGateway.is_bank_card_ignored !== true
}

export const isBankCardRealNameSubmissionBlocked = (context: BankCardRealNameContext): boolean => {
  if (!context.isEnabled) return false
  if (context.paymentTypeId === FUND_METHOD_TYPE.Enums.EWallet && context.paymentGateway === undefined) return true
  if (!isBankCardRealNameRequired(context)) return false

  return context.realName.trim() === ""
}

export const resolveBankCardAccountName = (context: BankCardRealNameContext, currentAccountName: string): string => {
  return isBankCardRealNameRequired(context) ? context.realName : currentAccountName
}

export const resolveBankCardAccountNameLabel = (context: BankCardRealNameContext, fallbackLabel: string): string => {
  return isBankCardRealNameRequired(context) ? "real_name" : fallbackLabel
}

export const resolveDisplayedBankCardAccountName = (
  context: BankCardRealNameContext,
  storedAccountName: string
): string => {
  return resolveBankCardAccountName(context, storedAccountName)
}
