import { PaginatedList } from "@shared-lib/api/commonTypes"

export interface GetReferralSettingBase {
  size?: number
  offset?: number
  member_account?: string
}

export type ReferralSettings = {
  currency_limit: {
    [key: string]: number
  }
  is_limit_configured: boolean
}

export interface ReferralSettingItem {
  account: string
  direct_member_count: number
  settings: ReferralSettings
  member_id: number
}

export type ReferralSetting = PaginatedList<ReferralSettingItem>

export type ReferralSettingDetail = ReferralSettings

export interface Revenue {
  [key: string]: string
}
