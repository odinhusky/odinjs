import type {
  ANNOUNCEMENT_TYPE,
  ANNOUNCEMENT_MEMBER_TYPE,
  ANNOUNCEMENT_DISPLAY_TYPE,
  COMMISSION_GROUP,
  CURRENCY_TYPE,
  EVENT_TYPE,
  GENDER,
  GIFT_TYPE,
  MEMBER_LEVEL,
  MONITORING_CYCLE,
  MONITORING_TYPE,
  REWARD_STATUS,
  REWARD_TYPE,
  LANGUAGE_TYPE,
  CATEGORY_TYPE,
  PROMO_TIME,
  PROMOTION_REWARD_TYPE,
  PIXEL_CODE_TYPE,
  MEMBER_TAG_TYPE,
  DISTRIBUTION_STATUS,
  GAME_TYPE,
  SETTLEMENT_CYCLE,
  RECEIVE_STATUS,
  REGISTER_METHOD,
  REGISTER_TYPE,
  AGENT_TYPE,
  CMS_ARRANGEMENT,
  CMS_ENTRANCE_SORT,
  CMS_ENTRANCE_TYPE,
  CMS_PAGE_COMPONENT_TYPE,
  CMS_DISPLAY_LOGIN,
  CMS_DISPLAY_DEVICE,
  CMS_OPENING_METHOD,
  CMS_VIEW_SHOW,
  OPEN_LOBBY_MODE,
  WITHDRAWAL_PASSWORD,
  KYC_TYPE,
  KYC_STATUS_CODE,
  BONUS_WALLET_TYPE,
  REBATE_TARGET,
  ACTIVE_STATUS_TYPE,
  INPUT_TYPE,
  AI_HELPER_EVENT,
  PRIZE_TYPE,
  COUNT_BASIS
} from "@/utils/constants"
import { ANNOUNCEMENT_OBJECT, CMS_TYPE } from "@/utils/constants"
import type * as Request from "src/api/request.type"

export type BaseList<T> = {
  list: T
  pagination?: {
    size: number
    offset: number
    total: number
  }
}

export type BaseResponse<T> = {
  code: number
  msg: string
  data: T
  pagination?: {
    size: number
    offset: number
    total: number
  }
  total?: unknown
  sub_total?: unknown
  status: boolean
}

export type GetS3UploadUrl = {
  upload_url: string
  object_key: string
  expires_at: string
}

export type UploadFileToS3 = {
  status: boolean
  data: {
    file: File
    objectKey: string
    expiresAt: string
  } | null
  msg?: string | null
}

export type PostS3Download = {
  download_url: string
  expiresAt: string
}

export type GetCurrencyList = {
  [key: string]: number
}

export type EligibilityMode = "turnover" | "balance"

export type RemainingBalanceThreshold = {
  currency_id: number
  amount: string
}

export type HistoryDepositThreshold = {
  currency_id: number
  amount: number
}

export type SingleTransferLimit = {
  currency_id: number
  amount: string
}

export type ActiveDownlineCondition = {
  currency_id: number
  min_total_deposit: number
  min_total_valid_bet: number
}

export type ActiveDownline = {
  enabled: boolean
  min_count: number
  conditions: ActiveDownlineCondition[]
}

export type BonusWalletTransferRule = {
  active_downline: ActiveDownline
  blocked_label_ids: number[]
  eligibility_mode: EligibilityMode
  enabled: boolean
  first_deposit_required: boolean
  history_deposit_thresholds: HistoryDepositThreshold[]
  kyc_required: boolean
  min_vip_level: number
  remaining_balance_thresholds: RemainingBalanceThreshold[]
  single_transfer_limits: SingleTransferLimit[]
}

export type BonusWalletTransferRuleResponse = BonusWalletTransferRule | string

export type PixelCode = {
  type: PIXEL_CODE_TYPE.Enums
  content: string
  is_enabled: boolean
}

export type GetPixelCodes = {
  list: PixelCode[]
}

export type SiteVerificationItem = {
  file_name: string
  id: number
  storage_key: string
  uploaded_at: string
}
export type GetSiteVerification = {
  list: SiteVerificationItem[]
}

export type GetSettings = {
  bo_default_language: string
  bo_language: string
  default_language: string
  language: string
  register_method: REGISTER_METHOD.Enums
  agent_type: AGENT_TYPE.Enums
  utc_offset: number
  member_bank_edit: number
  member_bank_register: number
  customer_services: string
  open_lobby_mode: OPEN_LOBBY_MODE.Enums
  withdrawal_password: WITHDRAWAL_PASSWORD.Enums
  kyc_setting: string
  wallet_type_list: BONUS_WALLET_TYPE.Enums[]
  wallet_type_order: BONUS_WALLET_TYPE.Enums
  bet_limit?: Array<{ currency_id: number; limit: string }>
  bonus_wallet_transfer_rule: BonusWalletTransferRuleResponse
  freeround_wallet_type: BONUS_WALLET_TYPE.Enums
  freeround_turnover_rate: number
  age_confirmation: number
  withdraw_kyc_verify: number
  max_pending_deposit: number
  is_bulk_data: number
  agent_code: string
  bo_ai_helper: number
  payment_deposit_allowed_type?: number[] | string
  payment_withdraw_allowed_type?: number[] | string
  auto_be_shareholder: number
  auto_be_member_agent: number
  password_error_count: number
  password_error_count_reset_minutes: number
  sso_google_oauth_enabled: number
  sso_telegram_oauth_enabled: number
  slide_captcha_enabled: number
  register_otp?: number
  login_otp?: number
}

export type GetLanSettings = {
  default_language: LANGUAGE_TYPE.Enums
  languages: CmsLangTitle[]
}

export type GetRegSettings = {
  id: number
  column_name: string
  lang: CmsLangTitle
  player_register_required: boolean
  player_register_display: boolean
  player_center_required: boolean
  player_center_display: boolean
  player_center_edit: boolean
  agent_create_required: boolean
  agent_create_display: boolean
  agent_edit_required: boolean
  agent_edit_display: boolean
  agent_edit_edit: boolean
  relational_id: number
  sort: number
  disable: boolean
}

export type ChartItem = {
  date: string
  bet_amount: string
  profit: string
  profit_rate: string
  bet_amount_growth_rate: string
  profit_growth_rate: string
}

export type TrafficDataItem = {
  view_count: number
  login_count: number
  bet_count: number
}

export type TrafficRankItem = {
  agent_id: number
  agent_code: string
  agent_title: string
  view_count: number
  login_count: number
  bet_count: number
}

export type CashDataItem = {
  deposit: string
  withdraw: string
  net: string
}

export type CashRankItem = {
  agent_id: number
  agent_code: string
  agent_title: string
  deposit: string
  profit: string
}

export type BetRankItem = {
  agent_id: number
  agent_code: string
  agent_title: string
  valid_bet_amount: string
  profit: string
}

export type ProductDataItem = {
  product_code: number
  product_title: string
  player_count: number
  valid_bet_amount: string
  profit: string
}

export type ProductRankItem = {
  product_code: number
  product_title: string
  bet_count: number
  valid_bet_amount: string
  profit: string
}

export type GetDashboard = {
  chart: ChartItem[]
  traffic_data: TrafficDataItem[]
  cash_data: CashDataItem[]
  product_data: ProductDataItem[]
  traffic_rank: TrafficRankItem[]
  cash_rank: CashRankItem[]
  bet_rank: BetRankItem[]
  product_rank: ProductRankItem[]
}

export type AddEditImg = {
  image: string
}

export type GetPendingTransactions = {
  pending_deposit_count: number
  pending_withdraw_count: number
}

export type GetPaymentTypeList = {
  [key: string]: string
}

export type AgentDropDownListItem = {
  id: number
  label: string
}

export type GetAgentDropdownList = AgentDropDownListItem[]

export type MemberWallet = {
  audit_turnover: string
  balance: string
  currency_code: string
  currency_id: number
  /** 代理額度 */
  remaining_agent_quota: number
  turnover: string
}

export type MemberItem = {
  id: number
  account: string
  /** 推薦人帳號 */
  ref_account: string
  /** 最近登入時間 (ISO string) */
  last_login: string
  /** 建立時間 (ISO string) */
  created_at: string
  member_level: number
  /** 標籤數量 */
  labels: number
  /** 是否啟用 */
  enabled: boolean
  /** 是否屏蔽 */
  block: boolean
  /** 活躍狀態，1: Active 2: Inactive */
  active_status: string
  /** 會員停用帳號狀態 */
  self_exclusion_status: string
  wallets: MemberWallet[]
  has_withdrawal_pass?: boolean
  /** 身份 0:會員, 1:會員代理 */
  identity: number
  register_method?: REGISTER_METHOD.Enums
  register_type?: REGISTER_TYPE.Enums
  telegram_id?: string
  google_id?: string
  gaming_site?: number
}

export type GetMemberList = MemberItem[]

export type GetMemberDetail = MemberItem & {
  realName?: string
  nickName?: string
  birthDay?: number
  gender?: GENDER.Enums
  phone?: string
  email?: string
  communicationSoftware1?: string
  communicationSoftware2?: string
}

export type ImageItem = {
  id: number
  member_id: number
  img: string
  created_at: string
  created_by: number
}
export type MemberInformationItem = {
  id: number
  [key: string]: any
  enabled: boolean
  is_ban: boolean
  last_login_time: string
  registration_time: string
  register_method: string
  last_ip: string
  last_deposit_time: string
  last_withdrawal_time: string
  referral_code: string
  label: number[]
  blockDepositTags: number[]
  blockWithdrawalTags: number[]
  blockPromotionTags: number[]
  agent_id: number
  img: ImageItem[]
  has_withdrawal_pass: boolean
  kycs: KycItem[]
  approval_status: number
  self_exclusion_at: number
  member_exclusion_at: number
}
export type GetMemberInformation = MemberInformationItem[]

export type MemberLevelLangTitle = {
  [key in LANGUAGE_TYPE.Enums]: string
}

export type CurrencyValue = {
  [key: string]: string | number
}

export type WithdrawLimit = {
  min: string | number
  max: string | number
}
export type SingleWithdrawLimit = {
  [key: string]: WithdrawLimit
}

export type MemberLevelItem = {
  id: number
  agent_id: number
  img: string
  remark: string
  titles: MemberLevelLangTitle
  promotion_valid_bet: CurrencyValue
  promotion_deposit: CurrencyValue
  valid_bet_amount: CurrencyValue
  deposit_amount: CurrencyValue
  promotion_bonus: CurrencyValue
  birthday_bonus: CurrencyValue
  single_withdraw_limit: SingleWithdrawLimit
  total_withdraw_limit: CurrencyValue
  withdraw_count: number
  deposit_method: CurrencyValue
  withdraw_method: CurrencyValue
  is_default: boolean
  condition: CurrencyValue
  reward: CurrencyValue
  img_base64: string
  promotion_type: number
}
export type GetMemberLevelList = MemberLevelItem[]

export type MemberLevelSettingItem = {
  settlement_type: SETTLEMENT_CYCLE.Enums.Daily
  settlement_week: number
  auto_payout: boolean
  is_repeat: boolean
  can_skip: boolean
  promotion_condition: number
  audit_rate: number
  block_lebel: number[]
  wallet_type: number
}
export type GetMemberLevelSetting = MemberLevelSettingItem

export type LevelName = {
  en: string
  "zh-tw": string
  [property: string]: string
}

export type PromotionFreeRoundItem = {
  currency_id: number
  game_code: string
  game_name: string
  product_code: number
  product_name: string
  rounds: number
}

export type DepositAndWithdrawalItem = {
  id: number
  member_id: number
  member_account: string
  member_name: string
  level_id: number
  level_name: LevelName | string
  payment_gateway_name: string
  payment_type: number
  currency: string
  amount: number
  deduction_fee: number
  promotion_amount: number
  audit_amount: number
  actual_amount: number
  is_first: boolean
  status: number
  submit_date: number
  verified_date: number
  review_date: string
  operator: string
  trans_code: string
  remark_template: number
  remark: string | number
  payment_type_id: number
  ref_trans_code?: string
  // 加密貨幣相關
  crypto?: string
  crypto_amount?: string
  crypto_id?: number
  crypto_rate?: string
  // 標籤數
  label_count?: number
  // 三方狀態; 1:pending, 2:success, 3:failed
  third_party_status?: number
  third_party_updated_date?: string
  // 贈活相關
  promotion_free_round_items?: PromotionFreeRoundItem[]
  // 1:現金, 2:免費遊戲
  promotion_prize_type?: string
  images: {
    base64: string
    path: string
    upload_at: string
  }[]
}

export type GetDepositAndWithdrawalList = DepositAndWithdrawalItem[]

export type DepositAndWithdrawalDetailItem = {
  id: number
  member_id: number
  level_id: number
  payment_type: number
  payment_gateway_name: string
  currency: string
  amount: number
  deduction_fee: number
  promotion_amount: number
  audit_amount: number
  actual_amount: number
  is_first: boolean
  status: number
  verified_date: number
  submit_date: number
  review_date: string
  operator: string
  trans_code: string
  bank_detail: {
    bank_account: string | number
  }
  remark: {
    id: number
    desc: string
  }
  crypto_detail: {
    crypto: string
    chain: string
    wallet_address: string
  }
  images: {
    base64: string
    path: string
    upload_at: string
  }[]
}

export type MemberLevelModifyItem = {
  id: number
  member_account: string
  recommender: string
  member_level: MEMBER_LEVEL.Enums
  member_level_id: number
  birthday: string
  member_tag: number
  member_status: number
  distribution_level: number
}

export type GetMemberLevelModify = MemberLevelModifyItem[]

export type MemberLevelHistoryItem = {
  id: number
  modify_date: number
  operator: string
  member_level: number
  modify_type: number
  modify_reason: string
}

export type GetMemberLevelHistory = MemberLevelHistoryItem[]

export type MemberLevelHistoryDetailsItem = {
  id: number
  member_account: string
  recommender: string
  member_origin_level: MEMBER_LEVEL.Enums
  member_level: MEMBER_LEVEL.Enums
  birthday: number
  member_tag: number
  status: boolean
}

export type GetMemberLevelHistoryDetails = MemberLevelHistoryDetailsItem[]

export type MemberLevelRewardListItem = {
  id: number
  settle_cycle_start: number
  settle_cycle_end: number
  level_name: string
  level_up_count: number
  birthday_count: number
  block_count: number
  distribute_type: number
}
export type GetMemberLevelRewardList = MemberLevelRewardListItem[]

export type MemberLevelRewardDetailsItem = {
  id: number
  member_account: string
  member_level: MEMBER_LEVEL.Enums
  gift_type: GIFT_TYPE.Enums
  currency: CURRENCY_TYPE.Enums
  amount: number
  block_tags_num: number
  status: REWARD_STATUS.Enums
}
export type GetMemberLevelRewardDetails = MemberLevelRewardDetailsItem[]

export type MemberQuotaItem = {
  id: number
  order_number: string
  update_time: number
  member_account: string
  modify_type: number
  currency: string
  modify_reason: number
  modify_amount: number
  check_amount: number
  operator: string
  remark: string
  list: object[]
}

export type GetMemberQuota = MemberQuotaItem[]

export type AuditAdjustmentFlexibleData = unknown[] | boolean | number | Record<string, unknown> | null | string

export type AuditAdjustmentBalanceValue = number | string

export type AuditAdjustmentBalance =
  | AuditAdjustmentBalanceValue
  | {
      audit_balance?: AuditAdjustmentBalanceValue
      balance?: AuditAdjustmentBalanceValue
      remaining_audit_balance?: AuditAdjustmentBalanceValue
      remaining_balance?: AuditAdjustmentBalanceValue
      [property: string]: unknown
    }
  | undefined

export type AuditAdjustmentMutation = AuditAdjustmentFlexibleData | undefined

export type AuditAdjustmentRecordPagination = {
  offset: number
  size: number
  total: number
  [property: string]: unknown
}

export type AuditAdjustmentRecordItem = {
  after_audit_balance: string
  before_audit_balance: string
  created_at: string
  currency_id: CURRENCY_TYPE.Enums
  member_account: string
  operator_account: string
  trans_code: string
  wallet_type: BONUS_WALLET_TYPE.Enums
  [property: string]: unknown
}

export type AuditAdjustmentRecords = {
  list: AuditAdjustmentRecordItem[]
  pagination: AuditAdjustmentRecordPagination
  [property: string]: unknown
}

export type AuditAdjustmentRecordsExport = {
  export_uuid: string
  [property: string]: unknown
}

export type AuditAdjustmentValidateResult = {
  account: string
  result: boolean
  [property: string]: unknown
}

export type MemberKycItem = {
  number: string
  member_account: string
  registered_at: string
  document_type: number
  reviewed_at: string
  reviewer: string
  reviewer_comment: string
  created_at: string
  updated_at: string
  status: number
}

export type GetMemberKyc = MemberKycItem[]

export type MemberKycDetailItem = {
  number: string
  member_account: string
  phone_number: string
  email: string
  status: number
  internal_note: string
  reviewer_comment: string
  profile: {
    fullName: string
    first_name: string
    middle_name: string
    last_name: string
    nationality: string
    date_of_birth: string
    place_of_birth: string
    document_type: string
    document_number: string
    document_expiry: string
    source_of_income: string
    nature_of_work: string
  }
  addresses: {
    Type: string
    address_line_1: string
    address_line_2: string
  }
  documents: {
    Type: string
    side: string
    storage_key: string
  }
  trace_id: string
  reviewer_id: string | number
  currentAddress: string
  permanentAddress: string
  expired_at: {
    from: string
    fromHms: string
    dateTime: string
  }
}

export type GetMemberKycDetail = MemberKycDetailItem[]

export type TagItem = {
  type: number
  name: string
  id: number
}

export type MemberTags = {
  id: number
  name: string
  type: MEMBER_TAG_TYPE.Enums
  remark: string
  enabled: boolean
}

export type MemberTagItem = {
  id: number
  member_tag_type: number
  name: string
  enabled: boolean
  remark: string
  list: TagItem[]
}

export type GetMemberTagList = MemberTagItem[]

export type documentDownloadDetailItem = {
  id: number
  file_type: number
  target: number
  title: string
  desc: string
  file_start_time: string
  file_end_time: string
  enabled: boolean
  file: string
  target_audience: []
  agent_name_group: string[]
}

export type downloadListItem = {
  file_path: string
  file_name: string
  folder_name: string
}

export type documentDownloadItem = {
  id: number
  desc?: string
  enabled?: boolean
  file?: string
  file_type?: number
  target?: number
  title?: string
  file_start_time?: string
  file_end_time?: string
  sequence?: number
  target_audience?: string[]
  file_list?: downloadListItem[]
}

export type GetdocumentDownloadList = documentDownloadItem[]

export type cashReportDetail = {
  agent_account: string
  agent_name: string
  currency: string
  deposit_amount: number
  withdrawal_amount: number
  total_amount: number
}

export type cashReportItemDetail = {
  date: string
  currency_id: number
  currency: string
  deposit: string
  withdraw: string
  profit: string
  member_id: number
  member_account: string
  wallet_type: BONUS_WALLET_TYPE.Enums
}

export type GetCashReportItem = {
  list: cashReportItemDetail[]
  pagination: {
    size: number
    offset: number
    total: number
  }
  summary: {
    page: {
      deposit: string
      withdraw: string
      profit: string
    }
    total: {
      deposit: string
      withdraw: number
      profit: string
    }
  }
}

export type GetMemberOverviewPersonalItem = {
  personal: {
    deposit: number
    withdraw: number
    bet_count: number
    bet_amount: number
    valid_bet: number
    prize: number
    profit: number
    rate: number
    bonus: number
  }
  team: {
    deposit: number
    withdraw: number
    bet_count: number
    bet_amount: number
    valid_bet: number
    prize: number
    profit: number
    rate: number
    bonus: number
    member_id: number
    member_account: string
    member_count: number
    currency_id: number
  }
}

export type MemberOverviewItemDetail = {
  deposit: number
  withdraw: number
  bet_count: number
  bet_amount: number
  valid_bet: number
  prize: number
  profit: number
  rate: number
  bonus: number
  member_id: number
  member_account: string
  member_count: number
  currency_id: number
}

export type GetMemberOverviewItem = {
  list: MemberOverviewItemDetail[]
  pagination: {
    offset: number
    size: number
    total: number
  }
}

export type MemberOverviewWalletDetailItem = {
  wallet_type: number
  player_count: number
  bet_count: number
  win_count: number
  deposit: number
  withdraw: number
  bet_amount: number
  valid_bet: number
  prize: number
  profit: number
  rate: number
  bonus: number
}

export type MemberOverviewTeamWalletDetailItem = MemberOverviewWalletDetailItem & {
  member_id: number
  member_account: string
  member_count: number
  currency_id: number
}

export type GetMemberOverviewDetail = {
  personal: MemberOverviewWalletDetailItem[]
  team: MemberOverviewTeamWalletDetailItem[]
}

export type GetMemberOverviewTeamDetail = {
  list: MemberOverviewTeamWalletDetailItem[]
}

export type GetAgentCashReportAgentMemberItem = {
  list: cashReportItemDetail[]
  pagination: {
    size: number
    offset: number
    total: number
  }
  summary: {
    page: {
      total_deposit: string
      total_withdraw: string
    }
    total: {
      total_deposit: string
      total_withdraw: string
    }
  }
}

export type GetCashDetailList = cashReportDetail[]

export type depositReportItem = {
  id: number
  deposit_number: string
  agent_account: string
  agent_name: string
  member_account: string
  submit_date: string
  currency: string
  payment_gateway_name: string
  payment_type: number
  amount: string
  deduction_fee: string
  promotion_amount: string
  audit_amount: string
  actual_amount: string
  status: number
  verified_date: string
}

export type GetDepositReportList = {
  list: depositReportItem[]
  pagination: {
    size: number
    offset: number
    total: number
  }
  summary: {
    page: {
      amount: string
      deduction_fee: string
      promotion_amount: string
      audit_amount: string
      actual_amount: string
    }
    total: {
      amount: string
      deduction_fee: string
      promotion_amount: string
      audit_amount: string
      actual_amount: string
    }
  }
}

export type withdrawalReportItem = {
  id: number
  withdrawal_number: string
  master_agent_account: string
  master_agent_name: string
  agent_account: string
  agent_name: string
  member_account: string
  submit_date: string
  currency: string
  payment_gateway_name: string
  payment_type: number
  amount: string
  deduction_fee: string
  actual_amount: string
  promotion_amount: string
  status: number
  verified_date: string
}

export type GetWithdrawalReportList = {
  list: withdrawalReportItem[]
  pagination: {
    size: number
    offset: number
    total: number
  }
  summary: {
    page: {
      amount: string
      deduction_fee: string
      promotion_amount: string
      actual_amount: string
    }
    total: {
      amount: string
      deduction_fee: string
      promotion_amount: string
      actual_amount: string
    }
  }
}

export type productBetReportItem = {
  id: number
  product: number
  currency: string
  bet_people_count: number
  order_amount: number
  jackpot_amount: number
  bet_amount: number
  valid_bet_amount: number
  payout: number
  winlose_amount: number
  winrate_count: string
  event_amount: number
  detail?: productBetReportDetailItem[]
}

export type GetProductBetReportList = {
  list: productBetReportItem[]
  pagination: {
    size: number
    offset: number
    total: number
  }
  summary: {
    page: {
      player_count: string
      bet_count: string
      win_count: string
      bet_amount: string
      valid_bet_amount: string
      payout: string
      profit: string
      profit_rate: string
      bonus: string
    }
    total: {
      player_count: string
      bet_count: string
      win_count: string
      bet_amount: string
      valid_bet_amount: string
      payout: string
      profit: string
      profit_rate: string
      bonus: string
    }
  }
}

export type productBetReportDetailItem = {
  agent_name: string
  bet_amount: string
  bet_count: number
  bonus: number
  member_account: string
  profit: number
  profit_rate: number
  valid_bet_amount: number
  payout: number
  win_count: number
}
export type GetProductBetReportDetail = {
  list: productBetReportDetailItem[]
  pagination: {
    size: number
    offset: number
    total: number
  }
  summary: {
    page: {
      bet_amount: string
      bet_count: number
      bonus: string
      profit: string
      profit_rate: string
      valid_bet_amount: string
      payout: string
      win_count: number
    }
    total: {
      bet_amount: string
      bet_count: number
      bonus: string
      profit: string
      profit_rate: string
      valid_bet_amount: string
      payout: string
      win_count: number
    }
  }
}

export type ProductDetail = {
  bet_amount: string
  bet_count: number
  bonus: string
  currency: string
  member_id: number
  member_account: string
  currency_id: number
  player_count: number
  product_id: number
  product_title: string
  profit: string
  profit_rate: string
  valid_bet_amount: string
  payout: string
  win_count: number
}

export type GetBetReportProductDetail = {
  list: ProductDetail[]
  pagination: {
    size: number
    offset: number
    total: number
  }
  summary: {
    page: {
      bet_count: number
      player_count: number
      win_count: number
      payout: number
    }
    total: {
      bet_count: number
      player_count: number
      win_count: number
      payout: number
    }
  }
}

export type memberBetReportDetailItem = {
  id: number
  created_at: string
  settled_at: string
  status: number
  provider_product_id: number
  product_line_id: number
  bet_amount: string
  valid_bet_amount: string
  prize_amount: string
  payload: any
  product_code: any
}
export type GetMemberBetReportDetail = {
  list: memberBetReportDetailItem[]
  pagination: {
    size: number
    offset: number
    total: number
  }
  summary: {
    page: {
      bet_amount: string
      bet_count: number
      bonus: string
      profit: string
      profit_rate: string
      valid_bet_amount: string
      prize_amount: string
      win_count: number
    }
    total: {
      bet_amount: string
      bet_count: number
      bonus: string
      profit: string
      profit_rate: string
      valid_bet_amount: string
      prize_amount: string
      win_count: number
    }
  }
}

export type betReportItem = {
  id: number
  currency: string
  player_count: number
  bet_count: number
  order_amount: number
  win_count: number
  bet_amount: number
  valid_bet_amount: number
  payout: number
  profit: number
  profit_rate: string
  bonus: number
  detail?: productBetReportDetailItem[]
}

export type GetBetReportList = {
  list: betReportItem[]
  pagination: {
    size: number
    offset: number
    total: number
  }
  summary: {
    page: {
      bet_amount: string
      bet_count: number
      bonus: string
      profit: string
      profit_rate: string
      valid_bet_amount: string
      payout: string
      win_count: number
    }
    total: {
      bet_amount: string
      bet_count: number
      bonus: string
      profit: string
      profit_rate: string
      valid_bet_amount: string
      payout: string
      win_count: number
    }
  }
}

export type betReportDetailItem = {
  account: string
  agent_name: string
  bet_people_count: number
  order_amount: number
  jackpot_amount: number
  bet_amount: number
  valid_bet_amount: number
  winlose_amount: number
  winrate_count: string
  event_amount: number
}

export type GetBetReportDetail = betReportDetailItem[]

export type masterAgentBetReportItem = {
  id: number
  master_agent_account: string
  master_agent_name: string
  currency: CURRENCY_TYPE.Enums
  bet_people_count: number
  quantity_count: number
  jackpot_count: number
  bet_amount: number
  valid_bet_amount: number
  winlose_amount: number
  winrate_count: string
  event_amount: number
}

export type GetMasterAgentBetReportList = masterAgentBetReportItem[]

export type agentBetReportItem = {
  id: number
  agent_id: string
  agent_code: string
  agent_title: string
  currency_id: number
  currency: CURRENCY_TYPE.Enums
  player_count: number
  bet_count: number
  win_count: number
  bet_amount: number
  valid_bet_amount: number
  profit: number
  profit_rate: string
  bonus: number
}

export type GetAgentBetReportList = agentBetReportItem[]

export type MemberBetReportItem = {
  member_id: number
  member_account: string
  currency_id: number
  currency: string
  bet_count: number
  win_count: number
  bet_amount: string
  valid_bet_amount: string
  payout: string
  profit: string
  profit_rate: string
  bonus: string
  prom_amount?: string
  prom_type?: string | number | number[]
  ngr_profit?: string
}

export type GetMemberBetReportList = {
  list: MemberBetReportItem[]
  pagination: {
    size: number
    offset: number
    total: number
  }
  summary: {
    page: {
      bet_count: number
      win_count: number
      bet_amount: string
      valid_bet_amount: string
      payout: string
      profit: string
      profit_rate: string
      bonus: string
    }
    total: {
      bet_count: number
      win_count: number
      bet_amount: string
      valid_bet_amount: string
      payout: string
      profit: string
      profit_rate: string
      bonus: string
    }
  }
}

export type DailyOverviewtSetting = {
  multiplier: number
  fields: string[]
}

export type DailyOverviewtReportItem = {
  date: string
  new_users: number
  first_depositors_count: number
  first_deposit_amount: number
  avg_first_deposit_amount: number
  retained_deposit_users: number
  depositors_count: number
  deposit_count: number
  deposit_amount: number
  avg_deposit_amount: number
  avg_deposit_count: number
  withdrawers_count: number
  withdrawal_count: number
  withdrawal_amount: number
  avg_withdrawal_amount: number
  avg_withdrawal_count: number
  turnover: number
  bettors_amount: number
  bet_count: number
  bet_amount: number
  avg_betting_amount: number
  avg_betting_count: number
  payout_amount: number
  ggr: number
  promo_spend: number
  net_ggr: number
  d_ggr: number
  unique_logins: number
  unique_bets: number
  register_from_google: number
  register_from_telegram: number
  login_from_google: number
  login_from_telegram: number
  reward_wallet_bettors_amount: number
  reward_wallet_bet_count: number
  reward_wallet_bet_amount: number
  reward_wallet_average_betting_amount: number
  reward_wallet_average_betting_count: number
  reward_wallet_payout_amount: number
  reward_wallet_ggr: number
}

export type GetDailyOverviewtReportList = DailyOverviewtReportItem[]

export type adminAccountItem = {
  id: number
  account: string
  name: string
  role_id: number | string
  enabled: boolean
  is_ban: boolean
  phone: string
  email: string
  password: string
  remark: string
  ga_binded: boolean
}

export type GetAdminAccount = adminAccountItem[]

export type adminAccountPermissionItem = {
  id: number
  name: string
  perm_count: number
  status: number
  remark: string
}

export type GetAdminAccountDetail = adminAccountItem & {
  phone?: string
  email?: string
  password?: string
  remark?: string
}

export type GetAdminAccountPermission = adminAccountPermissionItem[]

export type GetAdminAccountPermissionDetail = adminAccountPermissionItem & {
  permission_list?: object
}

export type adminUserActionLogItem = {
  id: number
  account: string
  name: string
  pageLog: string
  operation: string
  update_time: number
  actions: number
}

export type GetUserActionLog = adminUserActionLogItem[]

export type ProductGameType = {
  id: number
  game_type: string
}
export type ProductGameTypeList = ProductGameType[]

export type ProductDropdown = {
  product_code: number
  product_name: string
  game_type: string
  currency: string
  game_type_id: number
  integration_id: number
}
export type ProductDropdownList = ProductDropdown[]

export type ProductItem = {
  id: number
  name: string
  code: number
  currency_id: number
  provider_id: number
  game_type: number
  status: number
  is_active: boolean
  created_at: string
  updated_at: string
  quote_count: number
  product_id: number
  agent_product_id: number
  is_custom_image: boolean
  custom_image_path: string
  position: number
  sort: number
  origin_position?: number
  tab_image: string
  square_image: string
  wide_image: string
  use_square_image: boolean
  use_tab_image: boolean
  use_wide_image: boolean
}

export type GetProductList = ProductItem[]

export type GameNameItem = {
  id: number
  game_code: string
  game_name: string
  product_code: number
  game_type: string
}
export type GameNameList = GameNameItem[]

export type GameItem = {
  id: number
  default_game_id: number
  agent_id: number
  status: number
  created_at: string
  updated_at: string
  game_type: GAME_TYPE.Enums
  name: string
  code: string
  product_name: string
  custom_image: string
  hot: number
  is_custom_image: boolean
  newly: number
  sort: number
  product_code: number
}

export type GameList = GameItem[]

export type AgentProductItem = {
  id: number
  agent_product_id: number
  integration_id: number
  integration_name: string
  product_code: number
  product_name: string
  game_type: GAME_TYPE.Enums
  currency_id: CURRENCY_TYPE.Enums
  integration_status: boolean
  status: boolean
  turnover_rate: number
  cash_max_bet: number | string | null
  bonus_support: boolean
  bonus_max_bet: number | string | null
  entrance_type: number
  allow_entrance_type: number
}

export type AgentProductList = AgentProductItem[]

export type GameTypeItem = {
  game_type: number
  use_pc_image: boolean
  use_h5_image: boolean
  pc_image: string
  h5_image: string
  position: number
  origin_position: number
  updated_at: number
}

export type GameTypes = GameTypeItem[]

export type productGameSettingItem = {
  id: number
  agent_id: number
  status: number
  newly: number
  hot: number
  sort: number
  origin_sort?: number
  name: string
  code: string
  product_name: string
  game_type: number
  provider_id: number
  is_custom_image: boolean
  custom_image: string
  integration_id: number
  product_code: string
}

export type GetProductGameSetting = productGameSettingItem[]

export type productMaintenSettingItem = {
  id: number
  product_type: string
  product: string
  activated_quantity: number
  status: number
  maintainence_period: number
  actions: number
}

export type GetProductMaintenSetting = productMaintenSettingItem[]

export type generalAgencyManagementListItem = {
  id: number
  master_agent_ID: string
  master_agent_account: string
  master_agent_name: string
  contact: string
  created_on: number
  active: number
}

export type GetGeneralAgencyManagementList = {
  list: generalAgencyManagementListItem[]
  pagination: {
    size: number
    offset: number
    total: number
  }
}

export type GetSingleGeneralAgencyManagementItem = {
  id: number
  master_agent_ID: string
  master_agent_account: string
  master_agent_name: string
  password: string
  confirm_password: string
  contact_person: string
  phone: string
  email: string
  remark: string
  enable_or_disable: number
  account_frozen: number
  binding: number
  currency: number[]
  disableArray: number[]
  product: number[]
}

export type agencyOperationsManagementListItem = {
  id: number
  master_agent_name: string
  agent_account: string
  agent_name: string
  website_name: string
  frontend_URL: string
  frontend_active_disable: number
  bo_active_disable: number
}

export type GetAgencyOperationsManagementList = agencyOperationsManagementListItem[]

export type betRecordItem = {
  id: number
  bet_number: string
  member_account: string
  bet_date: number
  end_date: number
  status: number
  currency: number
  product: string
  games: string
  bet_amount: string
  valid_bet_amount: string
  payout: string
  winrate_count: string
  winlose_amount: string
  event_amount: string
  game_site: string
}

export type GetBetRecordList = betRecordItem[]

export type accountFlowItem = {
  id: number
  member_id: number
  member_account: string
  member_name: {
    label: string
    key_number: number
  }
  amount: string
  currency: string
  wager_code: number
  trans_code: string
  wallet_trans_type_id: number
  wallet_type: number
  promotion_id: number
  product_code: number
  game_code: string
  metadata: any
  before_balance: string
  after_balance: string
  audit_balance: string
  before_audit_balance: string
  after_audit_balance: string
  currency_id: number
  updated_at: string
}

export type GetAccountFlowList = accountFlowItem[]

export type userReportItemDetail = {
  id: number
  date: number
  online_count: string
  register_count: string
  login_count: string
  pc_login_count: string
  android_login_count: string
  ios_login_count: string
  h5_login_count: string
  register_from_google_count: string
  register_from_telegram_count: string
  login_from_google_count: string
  login_from_telegram_count: string
}

export type GetUserReportItem = {
  list: userReportItemDetail[]
  pagination: {
    size: number
    offset: number
    total: number
  }
  summary: {
    page: {
      view_count: string
      register_count: string
      login_count: string
      pc_login_count: string
      android_login_count: string
      ios_login_count: string
      h5_login_count: string
    }
    total: {
      view_count: string
      register_count: string
      login_count: string
      pc_login_count: string
      android_login_count: string
      ios_login_count: string
      h5_login_count: string
    }
  }
}

export type dayReportItem = {
  id: number
  date: number
  active_player: string
  new_rigister: string
}

export type GetDayReportList = dayReportItem[]

export type dayReportDateDetailItem = {
  id: number
  currency: string
  deposit_amount: string
  withdrawal_amount: string
  bet_amount: string
  valid_bet: string
  winlose_amount: string
  event_amount: string
  net_deposit: string
}

export type dayReportRegistDetailItem = {
  id: number
  member_account: string
  member_name: string
  created_on: number
}

export type GetDayReportDateDetailList = dayReportDateDetailItem[]
export type GetDayReportRegistDetailList = dayReportRegistDetailItem[]

export type getMemberAnnouncementType = {
  type: number
  name: ANNOUNCEMENT_MEMBER_TYPE.Enums
}

export type announcementItem = {
  agent_id: number
  enable: boolean
  end_time: string
  id: number
  sorts: number
  origin_sorts?: number
  start_time: string
  title: MemberLevelLangTitle
  type: ANNOUNCEMENT_MEMBER_TYPE.Enums
}

export type GetAnnouncementList = announcementItem[]

export type MemberAnnouncementDetailItem = {
  lang: string
  title: string
  content: string
  image: string
  image_path: string
  imageFileName?: string
}

export type TargetMemberItem = {
  account: string
  id: number
  name: string
}
export type GetMemberAnnouncementDetail = {
  id: number
  agent_id: number
  type: ANNOUNCEMENT_MEMBER_TYPE.Enums
  start_time: number | string
  end_time: number | string
  enable: number
  details: MemberAnnouncementDetailItem[]
  target_members: TargetMemberItem[]
  display_options: ANNOUNCEMENT_DISPLAY_TYPE.Enums[]
}

export type memberAnnouncementItem = {
  id: number
  type: ANNOUNCEMENT_TYPE.Enums
  title: string
  desc: string
  announcement_start_time: string
  announcement_end_time: string
}

export type GetMemberAnnouncementList = memberAnnouncementItem[]

export type GatewayItem = {
  id: number
  name: string
  type: number
  enable: boolean
  display: boolean
  deposit: boolean
  withdraw: boolean
  currency: number
  remark: string
  master_count: number
  agent_count: number
  operational_status: boolean
  logo_image_id: number
  payment_gateway_name?: string
  payment_gateway_channel_code?: string
  payment_method: number
}

export type GetGatewayList = GatewayItem[]

export type GatewatItemDetail = {
  id: number
  name: string
  type: number
  enable: boolean
  display: boolean
  deposit: boolean
  withdraw: boolean
  currency: number
  crypto: number
  remark: string
  master_ids: number[]
  agent_ids: number[]
  support_bank: number[]
  operational_status: boolean
  logo_image_id: number
  payment_gateway_name?: string
  payment_gateway_channel_code?: string
  payment_method: number
  support_method_type: number
  bank_info: ResponseGatewayBankInfo
  crypto_info: ResponseGatewayCryptoInfo
  config: GatewayDetailConfig
  extra_remark: GatewayExtraItem[]
}

export type GatewayDetailConfig = {
  audit_rate: string
  deposit_max: string
  deposit_min: string
  fee_amount: string
  fee_rate: string
  fee_type: number
  quick_amounts: string[]
  usdt_rate: string
  withdraw_max: string
  withdraw_min: string
  first_deposit_min?: string
  enable_first_deposit_check?: boolean
}

export type ResponseGatewayBankInfo = {
  account: string
  image_id: number
  name: string
}

export type ResponseGatewayCryptoInfo = {
  chain: string
  image_id: number
  wallet_address: string
}

export type GatewayExtraItem = {
  id?: number
  titles?: GatewayExtraTitle[]
  type?: number
}

export type GatewayExtraTitle = {
  lang: string
  title: string
}

export type PaymentImage = {
  image_id: number
}
export type ProductImage = {
  path: string
}

export type cashFlowItem = {
  id: number
  name: string
  method: number
  currency: CURRENCY_TYPE.Enums
  service: number
  count: number
  status: number
  remark: string
}

export type GetCashFlowList = cashFlowItem[]

export type cashFlowManagementItem = {
  id: number
  name: string
  method: number
  currency: CURRENCY_TYPE.Enums
  service: number
  count: number
  status: number[]
  front_end_display: number
}

export type GetCashFlowManagementList = cashFlowManagementItem[]

export type EventInfo = {
  event_name: string
  img_url: string
  description: string
}
export type I18nTab<T> = {
  english: T
  thai: T
  india: T
  vietnam: T
  simple: T
  traditional: T
}

export type i18nKeys = keyof I18nTab<undefined>

export type CurrencyAmountInfo = {
  money?: number
  multiple?: number
  max?: string
}

export type CurrencyAmount<T> = {
  PHP: T
  KVND: T
  SGD: T
  MYR: T
  CNY: T
  THB: T
  USD: T
  KRW: T
  HKD: T
  IDR: T
}

// TODO:調整欄位跟detail一樣
export type generalPromotionListItem = {
  id: number
  event_info: I18nTab<EventInfo>
  event_type: EVENT_TYPE.Enums
  distribution_type: REWARD_TYPE.Enums
  event_start: string
  event_end: string
  currency: string[]
  active: boolean
  rewardType: number
  frentEndDisplay: boolean
  promoTime: number
  blockDepositTags: number[]
  blockWithdrawalTags: number[]
  blockPromotionTags: number[]
  memberLevelTags: number[]
  bankCardTags: number[]
  electronicWallet: number[]
  thirdPayment: number[]
  singleDepositThreshold: CurrencyAmount<CurrencyAmountInfo>
  promotionAmount: CurrencyAmount<CurrencyAmountInfo>
  auditMultiple: number
}

export type PromotionLangTitle = MemberLevelLangTitle

export type GetPromotionListItem = {
  id: number
  sorts: number
  title: PromotionLangTitle
  type: EVENT_TYPE.Enums
  auto_payout: boolean
  start_date: string
  end_date: string
  currencies: string[]
  enabled: boolean
}

export type GetPromotionList = GetPromotionListItem[]

export type PromotionDetail = {
  promotions_id?: number
  lang: LANGUAGE_TYPE.Enums
  title: string
  content: string
  image: string
}

export type FreeRoundSettingItem = {
  currency_id: number
  product_code: number
  game_code: string
  bet_per_line: string
  total_bet_amount?: string
  begin_date: number | string
  end_date: number | string
  rounds: number
  remark: string
  wallet_type?: BONUS_WALLET_TYPE.Enums
}

export type PromotionRewardItem = {
  promotions_id: number
  currency_id: number
  condition: string
  type: PROMOTION_REWARD_TYPE.Enums
  amount: string
  limit: string
  free_round_setting: FreeRoundSettingItem[]
  level?: number
  max_level?: number
  repeatable?: boolean
}

export type PromotionBlockLebel = {
  promotions_id: number
  label_id: number
}

export type PromotionMemberLevel = {
  promotions_id: number
  level_id: number
}

export type GetPromotionDetail = {
  id: number
  agent_id: number
  sorts: number
  type: EVENT_TYPE.Enums
  prize_type: PRIZE_TYPE.Enums
  category: CATEGORY_TYPE.Enums
  offer_type: PROMO_TIME.Enums
  enabled: boolean
  show: boolean
  count_basis?: COUNT_BASIS.Enums
  start_date: string
  end_date: string
  allow_same_ip: boolean
  auto_payout: boolean
  audit_rate: string
  audit_rate_source: number
  created_at: string
  updated_at: string
  details: PromotionDetail[]
  reward: PromotionRewardItem[]
  block_lebel: PromotionBlockLebel[]
  member_level: PromotionMemberLevel[]
  settlement_type: SETTLEMENT_CYCLE.Enums
  settlement_week: number
  game_type_json: string
  product_code_json: string
  wallet_type: BONUS_WALLET_TYPE.Enums
  reward_range_mode?: boolean
  eligibility?: {
    deposit: {
      mode: "accumulated" | "single"
      currency_threshold: { [currency_id: string]: string }
    }
    valid_bet_amount: {
      currency_threshold: { [currency_id: string]: string }
    }
  }
}

export type PromotionReviewBlockLabel = {
  id: number
  name: string
  type: MEMBER_TAG_TYPE.Enums
  remark: string
}

export type GetPromotionReviewItem = {
  id: number
  promotion_id: number
  promotion_title: string
  promotion_type: EVENT_TYPE.Enums
  member_id: number
  member_account: string
  currency_id: CURRENCY_TYPE.Enums
  start_date: string
  end_date: string
  is_auto: boolean
  amount: string
  audit_rate: string
  client_ip: string
  reason: number
  status: DISTRIBUTION_STATUS.Enums
  block_label_count: number
  currency: string
  block_label: PromotionReviewBlockLabel[]
  wallet_type: BONUS_WALLET_TYPE.Enums
}

export type GetPromotionReviewList = GetPromotionReviewItem[]

export type GetInvitationBonus = {
  settlement_enabled: boolean
  start_date: string
  end_date: string
  payout_method: number
  turnover_rate: number
  i18n: I18nTab<EventInfo>
  labels: number[]
  levels: {
    level_name: string
    level: number
    active_member_count: number | string
    rewards: {
      currency_id: number
      reward_amount: number | string
    }[]
  }[]
  metrics: {
    currency_id: number
    valid_bet: number | string
    deposit: number | string
  }[]
}

export type GetInvitationBonusDetail = {
  campaign_id: number
  event_id: number
  id: number
  blocked_count: number
}

export type monitoringSettingItem = {
  id: number
  monitoring_type: MONITORING_TYPE.Enums
  monitoring_cycle: MONITORING_CYCLE.Enums
  time: string
  enable_disable: number
}

export type GetMonitoringSettingList = monitoringSettingItem[]

export type notificationRecordItem = {
  id: number
  monitoring_type: MONITORING_TYPE.Enums
  warning_message: string
  time: string
}

export type GetNotificationRecordList = notificationRecordItem[]

export type bankSettingItem = {
  id: number
  bank: string
  card_number: string
  currency: CURRENCY_TYPE.Enums
  account_name: string
  created_on: number
  frequently_used_accounts: string
}

export type GetBankSettingList = bankSettingItem[]

export type electronicWalletItem = {
  id: number
  payment_provider: string
  wallet_address: string
  currency: CURRENCY_TYPE.Enums
  verify_information: string
  created_on: number
  frequently_used_accounts: string
}

export type GetElectronicWalletList = electronicWalletItem[]

export type virtualCurrencyItem = {
  id: number
  withdrawal_wallet: string
  wallet_address: string
  currency: CURRENCY_TYPE.Enums
  verify_information: string
  created_on: number
  frequently_used_accounts: string
}

export type GetVirtualCurrencyList = virtualCurrencyItem[]

export type AddWithdraw = {
  type: number
  bankName: string
  subBankName: string
  cardNumber: string
  currency: string
  accountName: string
}

export type EditWithdraw = {
  id: number
  type: number
  walletPath: string
  currency: string
  verifyInfo1: string
  verifyInfo2: string
  verifyInfo3: string
}

export type DeleteWithdraw = {
  id: number
}

export type EditQuota = {
  id: number
  member_id: number
  currency_id: number
  promotion_id: number
  reason_id: number
  amount: number
  remark: string
  trans_code: string
  account: string
  type: string
  member_account_list: Object[]
  wallet_type: number
}

export type memberTransactionReportItem = {
  id: number
  deposit_and_withdrawal_number: string
  application_time: number
  currency: string
  motion: number
  payment_provider: string
  fund_method: number
  withdrawal_amounts: string
  total_deposits: string
  approval_time: number
  auditors: string
  deposit_amount: number
  withdrawal_amount: number
  total_amount: number
}

export type GetMemberTransactionReport = memberTransactionReportItem[]

export type memberBettingReportItem = {
  id: number
  bet_number: string
  bet_date: number
  settlement_date: number
  status: number
  currency: string
  product: string
  game: string
  bet_amount: number
  validate_bet: number
  winlose: number
  winrate_count: string
  event_amount: number
}

export type GetMemberBettingReport = memberBettingReportItem[]

export type agencyManagementListItem = {
  id: number
  agent_code: string
  parent_id: number
  display_name: string
  password: string
  confirm_password: string
  layer_id: number
  title: string
  contact: string
  mobile: string
  email: string
  remark: string
  enabled: boolean
  is_ban: boolean
  external_cdn: boolean
  is_running: boolean
  unbind_2fa: boolean
  created_at: string
  user_id: number
  currency_ids: number[]
  disableArray: number[]
  product_code_list: string[]
}

export type GetAgencyManagementList = agencyManagementListItem[]

export type GetAuroraAgentList = {
  agent_code: string
  agent_name: string
  private_key: string
  created_at: string
}

export type MemberLevelDetail = {
  level_name: {
    [key: string]: string | undefined
  }
  remark: string
  level_up_settings: {
    currency: CURRENCY_TYPE.Enums
    valid_betting: number
    deposit_amount: number
    level_up_reward: number
    birthday_reward: number
  }[]
  withdraw_settings: {
    currency: CURRENCY_TYPE.Enums
    single_limit_min: number
    single_limit_max: number
    single_day_limit: number
    withdraw_num: number
  }[]
}

export type GetMemberLevelDetail = MemberLevelDetail

export type singleCashFlowItem = {
  id: number
  agent_id: string
  agent_account: string
  agent_name: string
  contact_person: string
}
export type GetSingleCashFlowList = singleCashFlowItem[]

export type AgentMemberCommissionSettingItem = {
  id: number
  commission_name: string
  billing_type: string
  calculation_type?: number
  enable: number
  zero_level_count: number
}

export type GetAgentMemberCommissionSetting = AgentMemberCommissionSettingItem[]

export type AgentMemberCommissionSettingListDetailItem = {
  id: number
  account: string
  member_count: number
}

export type GetAgentMemberCommissionSettingListDetail = AgentMemberCommissionSettingListDetailItem[]

export type AgentMemberCommissionSettingDetailItem = {
  id: number
  commission_name: string
  settlement_cycle: string
  every_week: number
  every_mounth: number
  season: number
  half_year: number
  effect_time: number
  reward_type: number
  audit_multiple: number
  blockDepositTags: number[]
  blockWithdrawalTags: number[]
  blockPromotionTags: number[]
  memberLevelTags: number[]
  currency: string[]
  promotionAmount: CurrencyAmount<CurrencyAmountInfo>
  game_type: number
  lv: number
  audit_multiple_lv: number
  other_type: number
  lv_settings: object[]
}

export type GetAgentMemberCommissionSettingDetail = AgentMemberCommissionSettingDetailItem[]

export type AgentMemberCommissionReviewItem = {
  id: number
  currency: CURRENCY_TYPE.Enums
  reward_type: number
  name: string
  valid_time_start: number
  valid_time_end: number
  settle_cycle: string
  reward_count: number
  block_reward_count: number
}

export type GetAgentMemberCommissionReview = AgentMemberCommissionReviewItem[]

export type AgentMemberCommissionReviewDetailItem = {
  id: number
  member_account: string
  currency: CURRENCY_TYPE.Enums
  commission_flow_type: number
  block_tags_num: number
  status: number
}

export type GetAgentMemberCommissionReviewDetail = AgentMemberCommissionReviewDetailItem[]

export type AgentRelationshipSettingItem = {
  id: number
  senior_member: string
  member_account: string
  member_level: number
  member_count: number
}

export type GetAgentRelationshipChainSetting = AgentRelationshipSettingItem[]

export type AgentRelationshipSettingDetailItem = {
  id: number
  member_list: object[]
}

export type GetAgentRelationshipChainSettingDetail = AgentRelationshipSettingDetailItem[]

export type AgentMemberCommissionAmountItem = {
  currency_id: number
  limit: number
  amount: number
}

export type AgentMemberCommissionDetailItem = {
  id: number
  detail_id?: number | string
  rebate_level?: string
  calculation_type?: number
  name?: string
  billing_date?: string
  billing_cyle?: string
  billing_type?: string
  status?: number
  cashback_count?: number
  statement_id?: number
  commission_id?: number
  payout_method?: number
  account?: string
  next_level_count?: number
  member_count?: number
  ratio?: number | string
  amount?: number | string
  updated_at?: string
  amounts?: AgentMemberCommissionAmountItem[]
}

export type AgentMemberCommissionDetail = AgentMemberCommissionDetailItem[]

// /platform/v1/agent/commission/statements
export type AgentCommissionStatementItem = {
  billing_cyle: string
  billing_date: string
  billing_type: string
  cashback_count: number
  commission_id: number
  name: string
  statement_id: number
  status: number
}

export type GetAgentCommissionStatements = {
  list: AgentCommissionStatementItem[]
  offset: number
  size: number
  total: number
}

// /platform/v1/agent/commission/reports/members
export type AgentCommissionReportsMembersItem = {
  commission_id?: number
  currency_id?: number
  limit?: number
  member_account?: string
  member_id?: number
  member_path?: string
  next_level_member_count?: number
  next_level_total_bet?: string
  next_level_total_profit?: string
  next_level_total_valid_bet?: string
  total_bet?: string
  total_member_count?: number
  total_profit?: string
  total_valid_bet?: string
}

export type GetAgentCommissionReportsMembers = {
  list: AgentCommissionReportsMembersItem[]
}

export type AgentMemberCommissionStatementDetailItem = {
  id?: number | string
  detail_id?: number | string
  member_account: string
  next_level_count?: number
  member_count?: number
  limit?: number | string
  amount: number | string
  updated_at?: string
  status?: number
  currency_id?: number
  dispatch_type?: number
}

export type AgentMemberCommissionStatementDetail = AgentMemberCommissionStatementDetailItem[]

export type AgentMemberCommissionReportItem = {
  date: string
  parent_account: string
  path: string
  commission_id: number
  commission_name: string
  calculation_type?: number
  next_level_member_count: number
  limit: number
  currency_id: number
  next_level_total_bet: number
  next_level_total_valid_be: number
  next_level_total_profit: number
  total_member_count: number
  total_bet: number
  total_valid_bet: number
  total_profit: number
}

export type GetAgentMemberCommissionReport = AgentMemberCommissionReportItem[]

export type AgentMemberCommissionReportDetailItem = {
  id: number
  account: string
  MYR: number
  USD: number
  THB: number
  BRL: number
  VND: number
  RMB: number
  JPN: number
  PHP: number
}

export type GetAgentMemberCommissionReportDetail = AgentMemberCommissionReportDetailItem[]

export type AgencyManagementAddInfoItem = {
  id: number
  agent_id: string
  agency_account_number: string
  confirm_password: string
  agent_name: string
  password: string
  contact_person: string
  phone: string
  email: string
  remark: string
  enable_or_disable: number
  verify_binding: number
  status: number
}

export type GetAgencyManagementAddInfo = AgencyManagementAddInfoItem[]

export type GeneralAgencyManagementAddInfoItem = {
  id: number
  agent_id: string
  agency_account_number: string
  confirm_password: string
  password: string
  agent_name: string
  contact_person: string
  phone: string
  email: string
  remark: string
}

export type GetGeneralAgencyManagementAddInfo = GeneralAgencyManagementAddInfoItem[]

export type IpWhiteListItem = {
  id: number
  group_name: string
  creation_date: number
  enable_or_disable: number
  remark: string
  ip_list: string
}

export type GetIpWhiteList = IpWhiteListItem[]

export type WhiteIpItem = {
  id: number
  ip_address: string
  agent_id: number
  remark: string
  created_at: string
}

export type WhiteIpList = WhiteIpItem[]

export type NoteSettingItem = {
  id: number
  title: string
  context: string
}

export type GetNoteSettingList = NoteSettingItem[]

export type MemberRemarkItem = {
  id: number
  content: string
  creation_date: number
  add_personnel: string
}

export type GetMemberRemarkList = MemberRemarkItem[]

export type MemberOperationReportItem = {
  id: number
  project: string
  motion: string
  content: string
  creation_date: number
  ip: string
  device: string
}

export type GetMemberOperationReportList = MemberOperationReportItem[]

export type MemberCommisionReportItem = {
  id: number
  settlement_date: number
  commission_group: COMMISSION_GROUP.Enums
  settle_cycle: string
  currency: CURRENCY_TYPE.Enums
  product_type: number
  effective_sales_volume: number
  ratio: number
  commission_amount: number
  reward_type: number
  dispatch_date: number
  status: REWARD_STATUS.Enums
  member_tag: string
}

export type GetMemberCommisionReport = MemberCommisionReportItem[]

export type MemberCommisionReportDetailItem = {
  id: number
  bet_number: string
  bet_date: number
  settlement_date: number
  status: number
  currency: CURRENCY_TYPE.Enums
  product: string
  game: string
  bet_amount: number
  validate_bet: number
  winlose: number
  winrate_count: string
  event_amount: number
}

export type GetMemberCommisionReportDetail = MemberCommisionReportDetailItem[]

export interface Values {
  label: string
  value: number | string
}

export interface GetGameSiteList {
  title: string
  value: number
}

export type BaseMemberColumn = Record<string, string>

export interface MemberColumn {
  column_name: string
  customize: boolean
  lang: CmsLangTitle
  required: boolean
  edit: boolean
  type: INPUT_TYPE.Enums
  values: Values[]
}

export type MemberColumnList = MemberColumn[]

export type adminAgentItem = {
  id?: number
  agent_code?: string
  parent_id?: number
  display_name?: string
  layer_id?: number
  title?: string
  contact?: string
  mobile?: number
  email?: string
  remark?: string
  enabled?: true
  is_running?: true
  created_at?: string
  is_ban?: boolean
}

export type GetAdminAgentList = adminAgentItem[]

export type generalAgentItem = {
  id?: number
  agent_code?: string
  parent_id?: number
  display_name?: string
  user_account?: string
  layer_id?: number
  title?: string
  contact?: string
  mobile?: number
  email?: string
  remark?: string
  enabled?: true
  is_running?: true
  created_at?: string
  is_ban?: boolean
}

export type GetGeneralAgentList = generalAgentItem[]

export type MemberInfoLevelItem = {
  lang: MemberLevelLangTitle
  img: string
  withdraw_count: number
  remark: string
  level_up_tags: number
  promotion_type: number
  condition: CurrencyValue
  reward: CurrencyValue
  valid_bet_amount: CurrencyValue
  promotion_bonus: CurrencyValue
  birthday_bonus: CurrencyValue
  deposit_amount: CurrencyValue
  deposit_bank_card: CurrencyValue
  deposit_electronic_wallet: CurrencyValue
  deposit_third_payment: CurrencyValue
  deposit_audit_ratio: CurrencyValue
  single_withdraw_limit: SingleWithdrawLimit
  total_withdraw_limit: CurrencyValue
  withdraw_bank_card: CurrencyValue
  withdraw_electronic_wallet: CurrencyValue
  withdraw_third_payment: CurrencyValue
  withdraw_audit_ratio: CurrencyValue
}

export type commissionDetailListItem = {
  id: number | string
  name: string
  valid_time: string
  reward_type: number
  level_names: string
  member_count: number
  block_label_count: number
  enable: boolean
  days_of_week?: number
  titles: { label: LANGUAGE_TYPE.Enums; value: number }[]
  dispatch_threshold: { currency_id: number; threshold: number }[]
  dispatch_amount_limit: { currency_id: number; amount: string }[]
  level_ids: string[]
  label_ids: string[]
  rebate_rate_config: { game_type: string; product_id: number; currency_id: number; rate: string }[]
  start_at?: string
  end_at?: string
  wallet_type: number
}

export type GetCommissionDetailList = {
  list: commissionDetailListItem[]
  pagination: {
    size: number
    offset: number
    total: number
  }
}

export type commissionSettingListItem = {
  id: number | string
  name: string
  valid_time: string
  reward_type: number
  level_names: string
  member_count: number
  block_label_count: number
  enable: boolean
  days_of_week?: number
  titles: { label: LANGUAGE_TYPE.Enums; value: number }[]
  dispatch_threshold: { currency_id: number; threshold: number }[]
  dispatch_amount_limit: { currency_id: number; amount: string }[]
  level_ids: string[]
  label_ids: string[]
  rebate_rate_config: { game_type: string; product_id: number; currency_id: number; rate: string }[]
  start_at?: string
  end_at?: string
  wallet_type: number
}

export type GetCommissionSettingList = {
  list: commissionSettingListItem[]
  pagination: {
    size: number
    offset: number
    total: number
  }
}

export type ReferralCommissionSettingListItem = {
  id: number | string
  name: string
  valid_time: string
  reward_type: number
  level_names: string
  member_count: number
  block_label_count: number
  enabled: boolean
  days_of_week?: number
  titles: { label: LANGUAGE_TYPE.Enums; value: number }[]
  dispatch_threshold: { currency_id: number; threshold: number }[]
  dispatch_amount_limit: { currency_id: number; amount: string }[]
  level_ids: string[]
  label_ids: string[]
  rebate_rate_config: { game_type: string; product_id: number; currency_id: number; rate: string }[]
}

export type GetReferralCommissionSettingList = {
  list: ReferralCommissionSettingListItem[]
  pagination: {
    size: number
    offset: number
    total: number
  }
}

export type ReferralRebateGroups = {
  period_type: number
  audit_rate: number
  dispatch_type: number
  days_of_week?: number
  enabled: boolean
  rebate_target: REBATE_TARGET.Enums
  label_ids: number[]
  dispatch_threshold: { currency_id: number; threshold: number | string }[]
  dispatch_amount_limit: { currency_id: number; amount: number | string }[]
  rebate_rate_config: {
    game_type: string
    product_code?: number
    product_id?: number
    currency_id: number
    rate: string
  }[][]
  calculate_type: number
  wallet_type: number
  level?: number
}

export type giftDetailItem = {
  id: number
  member_id: number
  member_account: string
  type: GIFT_TYPE.Enums
  status: RECEIVE_STATUS.Enums
  options: {
    amount: number[]
    currency: number[]
  }
  created_at: string
  received_at: string
  wallet_type: BONUS_WALLET_TYPE.Enums
  recevied: {
    amount: number
    currency_id: number
  }
}

export type GetGiftDetailList = giftDetailItem[]

export type GetAccountFlowType = {
  id: number
  wallet_trans_type: string
}
export type GetAccountFlowTypeList = GetAccountFlowType[]

export type WithdrawSettingItem = {
  id: number
  payment_type_id: number
  name: string
  branch: string
  bank_name: string
  account_number: string
  currency_id: number
  account_name: string
  bank_card_id: number
  wallet_address: string
  currency_brand: string
  chain: string
  payment_gateway_id: number
  bank_id: number
}

export type CmsItem = {
  id: number
  sort: number
  updated_time: number
  title: string
  enabled: boolean
  icon_path: string
  display_login: CMS_DISPLAY_LOGIN.Enums
  did: string
  is_editable: boolean
  is_popup: boolean
}

export type CmsList = CmsItem[]

export type CmsLangTitle = Partial<Record<LANGUAGE_TYPE.Enums, string>>

export type CmsSettingItem = {
  lang: CmsLangTitle
  contact_lang: CmsLangTitle
  icon_path: string
  icon_base64: string
  selected_icon_path: string
  selected_icon_base64: string
  img_lang: CmsLangTitle
  icon_lang: CmsLangTitle
  contact_img_lang: CmsLangTitle
  payload: {
    arrangement: CMS_ARRANGEMENT.Enums
    entrance_sort: CMS_ENTRANCE_SORT.Enums
    display_login: CMS_DISPLAY_LOGIN.Enums
    display_device: CMS_DISPLAY_DEVICE.Enums
    view_all: CMS_VIEW_SHOW.Enums
    opening_method: CMS_OPENING_METHOD.Enums
    row_show_pc: number
    row_show_mob: number
    arrangement_pc_row: number
    arrangement_mob_row: number
    arrangement_row_pc: number
    arrangement_row_mob: number
    product_entrance_type: number
    product_integration_id: number
    product_type: number
    product_code: number
  }
  logo_sort: string[]
  updated_time: number
  pop_up_img: string[]
  comfirm_button_lang: CmsLangTitle
  reject_button_lang: CmsLangTitle
  pop_up_content: string
}

export type CmsEntranceItem = {
  lang: CmsLangTitle
  img?: string
  img_path: string
  img_base64: string
  type: CMS_ENTRANCE_TYPE.Enums | CMS_PAGE_COMPONENT_TYPE.Enums
  updated_time: number
  payload: {
    nested_entrance?: CmsEntranceItem[] // 嵌套 entrance
    page?: CmsPageItem[] // 嵌套 page
    row_show?: number // 每列數量
    row_num?: number // 列數
    alt_tag?: string
    title?: string
    game_type_entrance_type?: GAME_TYPE.ENTRANCE_TYPE // 呈現方式 , 1-供應商入口、 2-遊戲入口
    product_code?: number
    game_code?: string
    game_type?: GAME_TYPE.Enums | number
    link?: string
    opening_method?: CMS_OPENING_METHOD.Enums
    link_id?: CMS_ENTRANCE_TYPE.Enums
    cms_product_category_id?: number
  }
}

export type CmsPageItem = {
  lang: LANGUAGE_TYPE.Enums
  title: string
  content: string
}

export type CmsDetail = {
  url_id: number
  title: string
  setting: CmsSettingItem
  entrance: CmsEntranceItem[]
  page: CmsPageItem[]
  is_editable: boolean
}

export type CustomerServiceLink = {
  id: number
  title: string
}

export type CustomerServiceLinkList = CustomerServiceLink[]

export type KycItem = {
  id: number
  member_id: number
  img: string
  type: KYC_TYPE.Enums
  status: KYC_STATUS_CODE.Enums
  correspondence: number
  created_at: string
  created_by: number
}

export type exportItem = {
  export_uuid: string
  path: string
}

export type GiftQuota = {
  id: number
  list: {
    id?: number
    account?: string
    amount?: number
  }
  currency_id: number
  wallet_type: number
  name: string
  amount: number
  rate: number | string

  dispatched_at: {
    from: string
    fromHms: string
    dateTime: string
  }

  expired_at: {
    from: string
    fromHms: string
    dateTime: string
  }
}

export interface Kol {
  id?: number
  kolId?: number | string
  name: string
  owner_key?: string
  locale: string
  timezone: string
  nationality: string
  visual: KolVisual
  life: KolLife
  content_style: KolContentStyle
  cadence: KolCadence
  hard_do_not: KolRestrictions
  next_post_at?: string
  preview_image_url?: string
  thumb?: string
}

export interface KolVisual {
  body_info: BodyInfo
  body_description: string[]
  clothing_styles: string[]
  scenes_pref: string[]
  poses_pref: string[]
}

export interface BodyInfo {
  height: number
  weight: number
  age: number
  gender: "female" | "male"
}

export interface KolLife {
  traits: string[]
  speech_style: string[]
  catchphrases: string[]
}

export interface KolContentStyle {
  caption_tones: string[]
  photo_topics: string[]
}

export interface KolCadence {
  lambda_per_day: number
  quiet_hours: [number, number][]
}

export interface KolRestrictions {
  topics: string[]
  words: string[]
  guidelines: string
}

export interface UploadTempResponse {
  file_id: string
  file_url: string
  file_name: string
  file_size: number
  content_type: string
}

export type GetKolsExamples = Kol[]

export type AiKolAccount = {
  kols: {
    account: string
    remark: string
    followers: number
    following: number
    posts: number
  }[]
}
export type AiKolSystemInfo = {
  system_info: {
    total_message_count: number
    total_ai_response_count: number
    total_follower_request_count: number
    chatbot_fee: number
    status: number
  }
  follower_growth: {
    date: string
    follower_growth_data: {
      account: string
      followers: number
    }[]
  }
}
export type AiKolAnalysisInfo = {
  analysis_info: {
    kol: {
      account: string
      followers: number
      following: number
      posts: number
    }
    reach_count: number
    impression: number
    engagement_rate: number
  }
  posts: {
    account: string
    post_id: number
    date: string
    like_count: number
    comment_count: number
    reach_count: number
  }[]
  chats: {
    individual: {
      username: string
      chat_id: number
      kol_message_count: number
      user_message_count: number
      cost: number
    }[]
  }
  message: {
    sender_type: string
    sender_name: string
    content: number
    sent_at: string
  }[]
}

export type AiKolPost = {
  account: string
  language_code: string | number
  post: number
  background_image_b64: string
  pose_image_b64: string
  outfit_image_b64: string
  expression_image_b64: string
  background_prompt: string
  pose_prompt: string
  outfit_prompt: string
  expression_prompt: string
  image_path: string
  full_image_path: string
  description: string
  captions: {
    add_prompt: string
    caption: string
    post_id: string
  }[]
}

export type AiMateSetting = {
  is_bound: boolean
  ai_mate_user_id: string
  api_key: string
  api_secret: string
  is_secret_revealed: boolean
}

export interface AIHelperEvent {
  [key: string]: any
  event: AI_HELPER_EVENT.Enums
}

export interface AICompleteGiftDetailSingle {
  account: string
  name: string
  amount: number | string
  rate: number | string
}

export interface AICompleteGiftDetailBatch {
  accounts: string[]
  name: string
  amount: number | string
  rate: number | string
}

export type AICompleteGiftDetail = AICompleteGiftDetailSingle | AICompleteGiftDetailBatch

export interface AICompletePromotionDetail {
  detail: {
    title: string
    content: string
  }[]
  rewards: {
    currency: string
    condition: string
    type: number
    amount: string
    limit: string
  }[]
  wallet_type: number
  start_date: string
  end_date: string
  audit_rate: string
}

export type ShareholderProxyLevelItem = {
  level: number
  required_members: number
  rate: number | string
}

export type ShareholderCurrencySetting = {
  currency_id: number
  total_deposit: number
  total_valid_bet: number
  commission_cap: number
}
export type ShareholderInfo = {
  language: LANGUAGE_TYPE.Enums
  description_page: string
}
export type AddShareholderProxyItem = {
  settlement_enabled: boolean
  show_agent_details: boolean
  payout_method: number
  turnover_rate: number
  i18n: ShareholderInfo[]
  settlement_cycle?: SETTLEMENT_CYCLE.Enums
  settlement_day?: number
  levelData: ShareholderProxyLevelItem[]
  metrics: ShareholderCurrencySetting[]
  base_rate: number
  rate_decay: number
  active_levels: ShareholderProxyLevelItem[]
}

export type GetShareholderStatistics = {
  currency_id?: number
  game_type?: number
  valid_bet?: number | string
  prize_amount: number | string
  profit: number | string
}

export type GetAuroraOverviewReportItem = {
  date: string
  agent_code: string
  new_users: number
  first_depositors_count: number
  first_deposit_amount: string
  retained_deposit_users: number
  depositors_count: number
  deposit_count: number
  deposit_amount: string
  withdrawers_count: number
  withdrawal_count: number
  withdrawal_amount: string
  bettors_amount: number
  bet_count: number
  bet_amount: string
  payout_amount: string
  ggr: string
  promo_spend: string
}

export type GetAuroraOverviewReportList = GetAuroraOverviewReportItem[]

export type GetMemberStatisticsItem = {
  currency_id: CURRENCY_TYPE.Enums
  total_deposit: string
  total_profit: string
  total_withdraw: string
}

export type GetMemberStatistics = GetMemberStatisticsItem[]
export type GetMemberAgentQuotaItem = {
  code: string
  member_id: number
  member_account: string
  currency_id: number
  currency_code: string
  amount: string
  type: number
  created_at: string
  created_by: number
  created_by_account: string
}

export type GetMemberAgentQuotaList = GetMemberAgentQuotaItem[]
export type GetReferralWheel = {
  id: number
  agent_id: number
  start_time: string
  end_time: string
  timezone: number
  status: boolean
  created_at: string
  updated_at: string
}

export type ExportReferralWheel = {
  export_uuid: string
}

export type GetReferralWheelSpinCountLogItem = {
  member_account: string
  action: number
  referral_wheel_id: number
  start_time: string
  end_time: string
  spin_count_before: number
  spin_count: number
  spin_count_after: number
  remark: string
  created_at: string
  created_by: string
}

export type GetReferralWheelSpinCountLog = {
  list: GetReferralWheelSpinCountLogItem[]
  pagination: {
    size: number
    offset: number
    total: number
  }
}

export type GetReferralWheelListItem = {
  referral_wheel_id: number
  start_time: string
  end_time: string
}

export type GetReferralWheelList = GetReferralWheelListItem[]

export type current_wheelItem = {
  id: number
  agent_id: number
  start_time: string
  end_time: string
  timezone: number
  status: boolean
  created_at: string
  updated_at: string
}

export type referralWheelMemberData = {
  member_account: string
  member_id: number
  max_spin_count: number
  used_spin_count: number
}

export type GetReferralWheelMember = {
  current_wheel: current_wheelItem
  data: referralWheelMemberData[]
}
export type CryptoExchangeRateItem = {
  AgentID: number
  crypto_id: number
  crypto_name: string
  currency_id: number
  currency_name: string
  enabled: boolean
  rate: string
}

export type GetCryptoExchangeRateList = CryptoExchangeRateItem[]

export type GetFreeRoundItem = {
  begin_date?: number
  bonus_code?: string
  created_at?: number
  currency_id?: number
  end_date?: number
  game_code?: string
  member_account?: string
  member_id?: number
  product_code?: number
  remark?: string
  rounds?: number
  rounds_played?: number
  status?: number
  update_at?: number
  update_by?: string
  wallet_type?: number
}

export type GetFreeRound = {
  list: GetFreeRoundItem[]
  pagination: {
    size: number
    offset: number
    total: number
  }
}

export type GetFreeRoundStatus = [
  {
    id: number
    name: string
  }
]

export type GetFreeRoundProductGameList = {
  game_code: string
  game_name: string
}

export type GetFreeRoundProductItem = {
  game_list?: GetFreeRoundProductGameList[]
  product_code?: number
  product_name?: string
}

export type GetFreeRoundProduct = {
  products: GetFreeRoundProductItem[]
}

export type GetFreeRoundGamesBetScales = {
  betPerLineScales: string[]
  totalBetScales: string[]
}

export type getWarningList = {
  id?: number
  agent_id?: number
  currency_id?: number
  schedule_type?: number
  schedule_trigger_time?: string
  lower_limit?: number | string
  upper_limit?: number | string
  notification_message?: string
  is_enabled?: boolean
  last_executed_at: undefined | string
  exclude_list?: {
    setting_id: number
    member_id: number
    member_account: string
  }[]
}
export type getWarningDetail = {
  id?: number
  setting_id?: number
  created_at?: string
  member_account?: string
  reason_type?: number
  status?: number
  payload: {
    limit_value: string
  }
}

export type GatewaySettingItem = {
  /**
   * 渠道預設最高金額限制
   */
  max_amount?: string
  /**
   * 渠道預設最低金額限制
   */
  min_amount?: string
  /**
   * 設定名稱
   */
  name?: string
  /**
   * 商戶渠道號, "default"為預設渠道, 前端忽略不顯示
   */
  payment_gateway_channel_code?: string
  /**
   * 商戶名稱
   */
  payment_gateway_name?: string
}

export type GetGatewaySetting = GatewaySettingItem[]

export type GatewayMerchantItem = {
  name: string
  type: number
}

export type GetGatewayMerchant = GatewayMerchantItem[]

export type GatewayConnectionItem = {
  name: string
  payment_gateway_channel_code: string
  payment_gateway_name: string
  type: number
}

export type GetGatewayConnection = BaseList<GatewayConnectionItem[]>

export type GatewayConfigField = {
  column_name: string
  column_type: string
  default_value: string
  is_editable: boolean
  is_required: boolean
  is_show: boolean
}

export type GetGatewayConfig = Record<string, GatewayConfigField>

export type GatewayConnectionDetail = {
  name: string
  payload: Record<string, any>
  payment_gateway_channel_code: string
  payment_gateway_name: string
  type: number
}

export type GatewayChannelItem = {
  code: string
  currency_id: number
  is_crypto: boolean
  max_amount: string
  min_amount: string
  name: string
}

export type GetGatewayChannel = GatewayChannelItem[]
export type VoiceBotInfoItem = {
  voice_type: string
  language: string
  audio_url: string
  text_url: { [key: string]: string }
  to_number: string
  call_id: string
  start_time: string
  end_time: string
  call_duration: string
  intent: string
}

export type GetAIVoiceBotList = VoiceBotInfoItem[]

export type VoiceBotItem = {
  voice_type: string
  example_voice_url: string
}

export type GetVoiceBotList = VoiceBotItem[]

export type VoiceBotLanguageItem = {
  name: number
  code: string
}

export type GetVoiceBotLanguageList = VoiceBotLanguageItem[]

export type GscpBalanceItem = {
  currency_id: number
  current_balance: string
  currency_code: string
}

export type GetGscpBalance = GscpBalanceItem[]

export type GetInterestActivityList = GetInterestActivityListData[]

export type GetInterestActivityListData = {
  currency_id: number
  end_time: string
  id: number
  is_auto_dispatch: number
  name: string
  start_time: string
}

export type GetInterestActivityDetailInfo = {
  image?: string
  lang?: string
  title?: string
}

export type GetInterestActivityDetailPlan = {
  days: number
  id: number
  interest_rate: string
  principal: string
}

export type GetInterestActivityDetailData = {
  audit_rate: string
  created_at: string
  currency_id: number
  deleted_at: null | string
  end_time: string
  id: number
  info: GetInterestActivityDetailInfo[]
  is_auto_dispatch: number
  maximum_interest_limit: number
  name: string
  plans: GetInterestActivityDetailPlan[]
  start_time: string
  updated_at: string
}

export type GetInterestActivityDetail = {
  code: number
  data: GetInterestActivityDetailData
  msg: string
  timestamp: number
  trace_id: string
}

export type GetInterestApplicationAuditingList = {
  currency_code?: string
  currency_id?: number
  dispatched_count?: number
  end_time?: string
  /**
   * 活動id
   */
  id?: number
  name?: string
  start_time?: string
}

export type GetInterestApplicationAuditingPagination = {
  offset: number
  size: number
  total: number
}

export type GetInterestApplicationAuditingData = {
  list: GetInterestApplicationAuditingList[]
  pagination: GetInterestApplicationAuditingPagination
}

export type GetInterestApplicationAuditing = {
  code: number
  data: GetInterestApplicationAuditingData
  msg: string
  timestamp: number
  trace_id: string
}

export type GetInterestActivityApplicationAuditingList = {
  account?: string
  /**
   * 存放本金
   */
  principal?: string
  /**
   * 存放天數
   */
  stored_days?: number
  /**
   * 利率
   */
  interest_rate?: string
  /**
   * 預計利息
   */
  current_expected_interest?: string
  /**
   * 派發時間
   */
  complete_time?: string
  /**
   * 1:手動 2:自動
   */
  dispatch_type?: number
  /**
   * application_id
   */
  id?: number
  /**
   * 1:進行中 2:已退還 3:未派發 4:已拒絕 5:已派發 6:系統已派發 7:活動失效
   */
  status?: number
}

export type GetInterestActivityApplicationAuditingData = {
  list: GetInterestActivityApplicationAuditingList[]
  pagination?: {
    offset: number
    size: number
    total: number
  }
}

export type GetInterestActivityApplicationAuditing = {
  code: number
  data: GetInterestActivityApplicationAuditingData
  msg: string
  timestamp: number
  trace_id: string
}

export type GetInterestApplicationRefundedList = {
  currency_code: string
  currency_id: number
  end_time: string
  /**
   * activity_id
   */
  id: number
  name: string
  refunded_count: number
  start_time: string
}

export type GetInterestApplicationRefundedPagination = {
  offset: number
  size: number
  total: number
}

export type GetInterestApplicationRefundedData = {
  list: GetInterestApplicationRefundedList[]
  pagination: GetInterestApplicationRefundedPagination
}

export type GetInterestApplicationRefunded = {
  code: number
  data: GetInterestApplicationRefundedData
  msg: string
  timestamp: number
  trace_id: string
}

export type GetInterestActivityApplicationRefunded = {
  /**
   * 錯誤代碼
   */
  code: number
  /**
   * 資料
   */
  data?: string[] | boolean | number | { [key: string]: any } | null | string
  /**
   * 訊息
   */
  msg: string
}

export type GetInterestDescription = {
  code: number
  data: GetInterestDescriptionData[]
  msg: string
  timestamp: number
  trace_id: string
}

export type GetInterestDescriptionData = {
  description: string
  image_path: string
  lang: string
}
// ========== AI-KOL API Response Types ==========
export type PostStatus = "FAILED" | "QUEUED" | "GENERATING" | "READY"

export type AiKolPostItem = {
  id: number
  kol_name: string
  status: PostStatus
  caption: string
  image_url: string
  created_at: string
  generated_at: string
  creation_cost_usd: number
  error_code?: number
  error_message?: string
}

export type CreatePostResponse = {
  post_id: number
  status: string
}

export type GetAiKolPosts = AiKolPostItem[]

// Checksum 相关类型定义
export type ChecksumLogItem = {
  /** 代理 ID */
  agent_id: number
  /** Hash 值 */
  hash_value: string
  /** 日誌 ID */
  id: number
  /** 操作人員（system: 系統驗證, 其他: 操作人員） */
  operator: string
  /** 驗證結果 */
  verification_result: boolean
  /** 驗證時間 */
  verified_at: string
  /** 版本 */
  version: string
}

export type GetChecksumLogs = BaseList<ChecksumLogItem[]>

export interface VerifyChecksum {
  code: number
  data: {
    agent_id: number
    hash_value: string
    id: number
    operator: string
    verification_result: boolean
    verified_at: string
    version: string
    [property: string]: any
  }
  msg: string
  timestamp: number
  trace_id: string
}

export type DnsDomainItem = {
  domain_name: string
  cdn_point: string
  cname_name: string
  cname_value: string
  primary_domain: string
}

export type GetDnsDomainList = DnsDomainItem[]

// ========== DNS API Response Types ==========
export type SaveDnsSettingsResponse = {
  // 儲存變更的回應，根據實際需求定義
  [key: string]: any
}

export type GetCdnStatusResponse = {
  external_cdn: boolean
}

export type GetCertStatusResponse = {
  cert_id: number
  status: string
}

export type CertValidationInfo = {
  domain_name: string
  cname_name: string
  cname_value: string
}

export type GetCertValidationResponse = {
  cert_id: number
  validation_info: CertValidationInfo[]
}

export type ApplyDnsCertResponse = DnsDomainItem[]

// ========== Email API Response Types ==========
export interface EmailSmtpConfig {
  /**
   * Host
   */
  host: string
  /**
   * app key
   */
  password: string
  /**
   * Port
   */
  port: number
  /**
   * SMTP type, 1: Gmail; 2: Outlook; 3: iCloud.
   */
  type: number
  /**
   * email
   */
  username: string
}

export interface GetEmailSmtpConfig {
  code: number
  data: EmailSmtpConfig
  msg: string
  timestamp: number
  trace_id: string
}

export interface EmailTemplateData {
  /**
   * Email content.
   */
  content: string
  /**
   * Email subject.
   */
  subject: string
  /**
   * Template type, 1: forgot password.
   */
  type: number
}

export interface GetEmailTemplate {
  code: number
  data: EmailTemplateData
  msg: string
  timestamp: number
  trace_id: string
}

export type EmailMutationData = unknown[] | boolean | number | Record<string, unknown> | null | string

export interface PutEmailSmtpConfig {
  /**
   * Error code.
   */
  code: number
  /**
   * Data.
   */
  data?: EmailMutationData
  /**
   * Message.
   */
  msg: string
}

export interface PutEmailTemplate {
  /**
   * Error code.
   */
  code: number
  /**
   * Data.
   */
  data?: EmailMutationData
  /**
   * Message.
   */
  msg: string
}
