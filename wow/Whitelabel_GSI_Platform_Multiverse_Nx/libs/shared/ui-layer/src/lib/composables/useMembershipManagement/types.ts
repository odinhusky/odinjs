export type BetRecordDateTypeMode = "betDate" | "settlementDate" | "all"

export const BET_RECORD_DATE_TYPE_MODE_OPTIONS: { label: string; value: BetRecordDateTypeMode }[] = [
  { label: "投注日期", value: "betDate" },
  { label: "結算日期", value: "settlementDate" },
  { label: "全部", value: "all" }
]

export interface BetRecordSummaryRow {
  label: string
  bet_amount_display: string
  valid_bet_amount_display: string
  payout_display: string
  profit_display: string
  bonus_display: string
}

export interface BetRecordMobileSummaryRow {
  label: string
  pageValue: string
  totalValue: string
}

export interface AgentReportSummaryCardData {
  account: string
  teamCount: string
}

export interface AgentReportSelfRow {
  label: string
  bet_count_display: string
  deposit_display: string
  withdraw_display: string
  bet_amount_display: string
  valid_bet_display: string
  prize_display: string
  profit_display: string
  rate_display: string
  bonus_display: string
}

export interface AgentReportTeamRow {
  member_id: number
  member_account: string
  member_count_display: string
  bet_count_display: string
  deposit_display: string
  withdraw_display: string
  bet_amount_display: string
  valid_bet_display: string
  prize_display: string
  profit_display: string
  rate_display: string
  bonus_display: string
}

export interface AgentReportMobileSummaryRow {
  label: string
  pageValue: string
  totalValue: string
}

export interface QuotaMoneyHistoryRow {
  id: number | string
  _rowKey: string
  member_account: string
  updated_at_display: string
  action_type_display: string
  action_target_display: string
  amount_display: string
  before_balance_display: string
  after_balance_display: string
  currency_code: string
  transaction_code: string
  wager_code: string
}
