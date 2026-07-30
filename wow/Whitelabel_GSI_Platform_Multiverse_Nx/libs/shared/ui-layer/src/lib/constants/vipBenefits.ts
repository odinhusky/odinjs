import type { VipRewardBenefit } from "@shared-lib/api/apiFunctions/vip_getVipList"

export interface VipBenefitDefinition {
  label: string
  i18nKey: string
  column: keyof VipRewardBenefit
  useCurrency: boolean
}

export const VIP_BENEFIT_DEFINITIONS: VipBenefitDefinition[] = [
  {
    label: "Upgrade Bonus",
    i18nKey: "vip.upgradeBonus",
    column: "promotion_bonus",
    useCurrency: true
  },
  {
    label: "Birthday Bonus",
    i18nKey: "vip.birthdayBonus",
    column: "birthday_bonus",
    useCurrency: true
  },
  {
    label: "Free Withdraw",
    i18nKey: "vip.freeWithdrawal",
    column: "daily_limit",
    useCurrency: false
  }
]