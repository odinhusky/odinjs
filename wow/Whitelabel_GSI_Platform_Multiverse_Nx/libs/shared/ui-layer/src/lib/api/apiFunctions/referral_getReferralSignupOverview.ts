import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"

export interface ReferralSignupOverviewMetrics {
  currency_id: number
  valid_bet: string
  deposit: string
}

export interface ReferralSignupOverviewRewardsCurrencyRewards {
  currency_id: number
  reward_amount: string
}

export interface ReferralSignupOverviewRewards {
  level_id: number
  active_member_count: number
  currency_rewards: ReferralSignupOverviewRewardsCurrencyRewards[]
  is_reached: boolean
}

export interface ReferralSignupOverviewTranslation {
  description_page: string
  images: string
  language: string
  title: string
}

export interface ReferralSignupOverviewResponseType {
  member_id: number
  metrics: ReferralSignupOverviewMetrics[]
  rewards: ReferralSignupOverviewRewards[]
  translation: ReferralSignupOverviewTranslation[]
}

export const getReferralSignupOverview = () => {
  return requestFn<EmptyType, ReferralSignupOverviewResponseType>(ENDPOINT_PATHS.REFERRAL.SIGNUP_OVERVIEW, null, {
    name: "getReferralSignupOverview",
    method: "get"
  })
}
