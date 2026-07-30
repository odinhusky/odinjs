export type BonusWalletTransferEligibilityMode = "turnover" | "balance"

export interface BonusWalletTransferRemainingBalanceThreshold {
  currency_id: string
  amount: string
}

export interface BonusWalletTransferHistoryDepositThreshold {
  currency_id: number
  amount: number
}

export interface BonusWalletTransferSingleTransferLimit {
  currency_id: string
  amount: string
}

export interface BonusWalletTransferActiveDownlineCondition {
  currency_id: number
  min_total_deposit: number
  min_total_valid_bet: number
}

export interface BonusWalletTransferActiveDownline {
  enabled: boolean
  min_count: number
  conditions: BonusWalletTransferActiveDownlineCondition[]
}

export interface BonusWalletTransferRule {
  enabled: boolean
  eligibility_mode: BonusWalletTransferEligibilityMode
  first_deposit_required: boolean
  history_deposit_thresholds: BonusWalletTransferHistoryDepositThreshold[]
  min_vip_level: number
  kyc_required: boolean
  active_downline?: BonusWalletTransferActiveDownline
  blocked_label_ids?: number[]
  remaining_balance_thresholds?: BonusWalletTransferRemainingBalanceThreshold[]
  single_transfer_limits?: BonusWalletTransferSingleTransferLimit[]
}

export type BonusWalletTransferRuleSetting = BonusWalletTransferRule | string | null

export type BonusTransferConditionCode =
  | "active_downline"
  | "blocked_label"
  | "first_deposit"
  | "history_deposit"
  | "kyc"
  | "turnover_or_balance"
  | "vip"

export type BonusTransferConditionValue =
  | boolean
  | number
  | string
  | null
  | BonusTransferConditionValue[]
  | { [key: string]: BonusTransferConditionValue }

export type BonusTransferConditionRecord = Record<string, BonusTransferConditionValue>

export interface BonusTransferCondition {
  code: BonusTransferConditionCode | string
  enabled: boolean
  passed: boolean
  current?: BonusTransferConditionRecord | null
  required?: BonusTransferConditionRecord | null
}

export type BonusTransferAmount = string | number

export interface BonusTransferStatus {
  blocked_reason: string
  cash_wallet_balance: BonusTransferAmount
  conditions: BonusTransferCondition[] | null
  currency_id: number
  eligible: boolean
  enabled: boolean
  max_transfer_amount: BonusTransferAmount
  reward_wallet_balance: BonusTransferAmount
}

export interface GetBonusTransferStatusRequest {
  currency_id: number
}

export interface PostBonusTransferRequest {
  currency_id: number
  amount: number
}
