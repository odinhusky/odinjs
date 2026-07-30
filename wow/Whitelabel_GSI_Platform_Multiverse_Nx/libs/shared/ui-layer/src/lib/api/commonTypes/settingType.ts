import type { BonusWalletTransferRuleSetting } from "@shared-lib/api/commonTypes/bonusWalletTypes"
import { AGENT_TYPE_ENUMS } from "@shared-lib/constants/enums/agentType"
import { REGISTER_METHOD_ENUMS } from "@shared-lib/constants/enums/registerMethod"
import { OPEN_LOBBY_MODE_ENUMS } from "@shared-lib/constants/enums/openLobbyMode"
import { WITHDRAWAL_PASSWORD_ENUMS } from "@shared-lib/constants/enums/withdrawalPassword"
import { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"
import { KYC_ENABLED_ENUMS } from "@shared-lib/constants/enums/kycEnabled"
import { AUTH_REQUIRED_ENUMS } from "@shared-lib/constants/enums/authRequired"
import { VIP_REWARDS_SWITCH_ENUMS } from "@shared-lib/constants/enums/vipRewardsSwitch"

export interface ISetting {
  agent_code: string
  agent_type: AGENT_TYPE_ENUMS
  bo_default_language: string
  bo_language: string
  default_language: string
  language: string
  register_method: REGISTER_METHOD_ENUMS
  customer_support_links: string
  customer_services: string
  digital_analytics: string
  max_search_range: number
  member_bank_edit: number
  member_bank_register: number
  utc_offset: number
  withdraw_payment: string[]
  international_calling_code: string
  open_lobby_mode: OPEN_LOBBY_MODE_ENUMS
  withdrawal_password: WITHDRAWAL_PASSWORD_ENUMS
  wallet_type_bonus_flag: boolean
  wallet_type_order: WALLET_TYPE_ENUMS
  age_confirmation: number
  kyc_setting: string
  withdraw_kyc_verify: number
  open_register_promotion: number
  open_sub_ad: number
  ai_agent: number
  ai_helper: number
  gs1_small_game: number
  upload_details: number
  vip_rewards: VIP_REWARDS_SWITCH_ENUMS
  saba_widget_id: string
  member_self_bet_restriction_enabled?: number
  member_kyc_verify: KYC_ENABLED_ENUMS
  auth_required: AUTH_REQUIRED_ENUMS
  sso_google_oauth_enabled?: number
  sso_telegram_oauth_enabled?: number
  /** CMS 自定義首頁 ID；有值時首頁應重新導向至 /cmsCustomPage/{homepage_cms_id} */
  homepage_cms_id?: number
  bonus_wallet_transfer_rule?: BonusWalletTransferRuleSetting
}
