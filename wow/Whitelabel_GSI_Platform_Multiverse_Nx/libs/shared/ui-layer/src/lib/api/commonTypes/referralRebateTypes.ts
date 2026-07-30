import { Pagination } from "@shared-lib/api/commonTypes"

export interface ReferralRebateStatementsItem {
  account: string
  tier: number
  rate: number
  currency_id: number
  valid_bet_amount: string
  game_type: number
  deposit_amount: string
  profit: string
  revenue_amount: string
}

export interface ReferralRebateStatementsList {
  list: ReferralRebateStatementsItem[]
  pagination: Pagination & {
    page: number
  }
}
