import type * as Response from "../../api/response.type"

const isRecord = (value: unknown): value is { [key: string]: unknown } => {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

const toBonusWalletTransferRule = (value: unknown): Response.BonusWalletTransferRule => {
  if (!isRecord(value)) {
    throw new Error("bonus_wallet_transfer_rule must be an object.")
  }

  return value as Response.BonusWalletTransferRule
}

export const parseBonusWalletTransferRule = (
  value: Response.BonusWalletTransferRuleSetting | undefined
): Response.BonusWalletTransferRule | null => {
  if (value === null || value === undefined) return null

  if (typeof value !== "string") {
    return toBonusWalletTransferRule(value)
  }

  try {
    return toBonusWalletTransferRule(JSON.parse(value))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Invalid bonus_wallet_transfer_rule JSON: ${message}`)
  }
}
