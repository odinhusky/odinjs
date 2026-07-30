import type { Composer } from "vue-i18n"
import { BONUS_WALLET_TYPE } from "@/utils/constants"

export type FreeRoundWalletTypeOption = {
  label: string
  value: BONUS_WALLET_TYPE.Enums
  disable: boolean
}

export const FREE_ROUND_WALLET_TYPES: readonly BONUS_WALLET_TYPE.Enums[] = [
  BONUS_WALLET_TYPE.Enums.GENERALLY,
  BONUS_WALLET_TYPE.Enums.REWARD
]

export function isRewardWalletEnabled(walletTypeList: readonly number[]): boolean {
  return walletTypeList.includes(BONUS_WALLET_TYPE.Enums.REWARD)
}

export function normalizeFreeRoundWalletType(walletType: unknown): BONUS_WALLET_TYPE.Enums {
  const normalizedWalletType = Number(walletType)

  if (FREE_ROUND_WALLET_TYPES.includes(normalizedWalletType as BONUS_WALLET_TYPE.Enums)) {
    return normalizedWalletType as BONUS_WALLET_TYPE.Enums
  }

  return BONUS_WALLET_TYPE.Enums.GENERALLY
}

export function normalizeSelectableFreeRoundWalletType(
  walletType: unknown,
  walletTypeList: readonly number[]
): BONUS_WALLET_TYPE.Enums {
  const normalizedWalletType = normalizeFreeRoundWalletType(walletType)

  if (normalizedWalletType === BONUS_WALLET_TYPE.Enums.REWARD && !isRewardWalletEnabled(walletTypeList)) {
    return BONUS_WALLET_TYPE.Enums.GENERALLY
  }

  return normalizedWalletType
}

export function normalizeSelectableFreeRoundWalletTypeWhenReady(
  walletType: unknown,
  walletTypeList: readonly number[],
  walletTypeListReady: boolean
): BONUS_WALLET_TYPE.Enums {
  const normalizedWalletType = normalizeFreeRoundWalletType(walletType)

  if (!walletTypeListReady) {
    return normalizedWalletType
  }

  return normalizeSelectableFreeRoundWalletType(normalizedWalletType, walletTypeList)
}

export function getFreeRoundWalletTypeOptions(
  walletTypeList: readonly number[],
  t: Composer["t"]
): FreeRoundWalletTypeOption[] {
  const rewardEnabled = isRewardWalletEnabled(walletTypeList)

  return FREE_ROUND_WALLET_TYPES.map((walletType) => ({
    label: t(BONUS_WALLET_TYPE.I18nKeys[walletType]),
    value: walletType,
    disable: walletType === BONUS_WALLET_TYPE.Enums.REWARD && !rewardEnabled
  }))
}
