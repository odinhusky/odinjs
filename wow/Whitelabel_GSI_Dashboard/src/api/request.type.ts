import type {
  SORT_BY,
  ANNOUNCEMENT_MEMBER_TYPE,
  ANNOUNCEMENT_DISPLAY_TYPE,
  EVENT_TYPE,
  GENDER,
  LANGUAGE_TYPE,
  CURRENCY_TYPE,
  PROMOTION_REWARD_TYPE,
  DISTRIBUTION_STATUS,
  SETTLEMENT_CYCLE,
  GIFT_TYPE,
  RECEIVE_STATUS,
  PIXEL_CODE_TYPE,
  S3_STORAGE_CATEGORY,
  GAME_TYPE,
  CUSTOMER_SERVICES,
  CMS_TYPE,
  CMS_ARRANGEMENT,
  CMS_ENTRANCE_SORT,
  CMS_ENTRANCE_TYPE,
  CMS_PAGE_COMPONENT_TYPE,
  CMS_DISPLAY_LOGIN,
  CMS_DISPLAY_DEVICE,
  CMS_OPENING_METHOD,
  CMS_VIEW_SHOW,
  CMS_INTERNALPAGE,
  OPEN_LOBBY_MODE,
  KYC_TYPE,
  BONUS_WALLET_TYPE,
  REBATE_TARGET,
  ACTIVE_STATUS_TYPE,
  PRIZE_TYPE,
  COUNT_BASIS
} from "@/utils/constants"
import {
  REWARD_TYPE,
  PROMO_TIME,
  CATEGORY_TYPE,
  COLLABORATION_REWARD_TYPE,
  WITHDRAWAL_PASSWORD,
  KYC_STATUS_CODE
} from "@/utils/constants"
import type { BonusWalletTransferRule } from "@/api/response.type"
import { subDays } from "date-fns"
import type { StringLiteralLike } from "typescript"

export type BaseRequest = {
  sort?: string
  sort_by?: SORT_BY.Enums
  offset?: number
  size?: number
}

export type UploadFileToS3 = {
  file: File
  storage_category: S3_STORAGE_CATEGORY.Enums
  expiration?: number
}

export type PostS3Download = {
  file_name?: string
  object_key: string
  expiration?: number
}

export type GetDashboard = {
  currency_id: number
  start_time: number | string
  end_time: number | string
}

export type GetMemberList = BaseRequest & {
  memberAccount?: string
  enable?: number
  frozenStatus?: number
  recommender?: string
  exclude_parent_ids?: number[]
  memberTag?: number
  not_label?: number
  memberLevel?: number
  not_level?: number
  start: number
  end: number
  selfExclusionStatus: string
  activeStatus: ACTIVE_STATUS_TYPE.Enums
  gaming_site: number
  order_type?: string
  sort_type?: number
  currency_id?: number
  phone?: string
  uid?: string
  identity?: number
  register_method?: number
  email?: string
  payout_identity?: string
}

export type GetMemberLevelSettings = BaseRequest

export type MemberLevelLangTitle = {
  [key in LANGUAGE_TYPE.Enums]: string
}

export type CurrencyValue = {
  [key: string]: string | number | null
}

export type WithdrawLimit = {
  min: string | number
  max: string | number
}
export type SingleWithdrawLimit = {
  [key: string]: WithdrawLimit
}

export type AddMemberLevel = {
  img: string
  titles: MemberLevelLangTitle
  promotion_valid_bet: CurrencyValue
  promotion_deposit: CurrencyValue
  valid_bet_amount: CurrencyValue
  promotion_bonus: CurrencyValue
  birthday_bonus: CurrencyValue
  deposit_amount: CurrencyValue
  single_withdraw_limit: SingleWithdrawLimit
  total_withdraw_limit: CurrencyValue
  withdraw_count: number
  deposit_method: CurrencyValue
  withdraw_method: CurrencyValue
  remark: string
  distribution_level: number
  level_up_tags: number
  ratio: number
  promotion_type: number
  condition: {
    [key: string]: {
      deposit_amount?: string | number
      valid_bet_amount?: string | number
    }
  }
  reward: {
    [key: string]: {
      promotion_bonus?: string | number
      promotion_birthday_bonus?: string | number
      birthday_bonus?: string | number
    }
  }
  mode: string
}

export type updateMemberLevel = AddMemberLevel & {
  id: number
  img: string
  lang: MemberLevelLangTitle
  promotion_valid_bet: CurrencyValue
  promotion_deposit: CurrencyValue
  valid_bet_amount: CurrencyValue
  promotion_bonus: CurrencyValue
  birthday_bonus: CurrencyValue
  deposit_amount: CurrencyValue
  single_withdraw_limit: SingleWithdrawLimit
  total_withdraw_limit: CurrencyValue
  withdraw_count: Number
  deposit_method: CurrencyValue
  withdraw_method: CurrencyValue
  remark: string
  distribution_level: number
  level_up_tags: number
  ratio: number
  promotion_type: number
}

export type GetDepositAndWithdrawalList = BaseRequest & {
  depositNumber?: string
  withdrawalNumber?: string
  memberAccount?: string
  paymentType?: number
  payer?: number
  tierWhenDepositing?: number
  currency?: number
  firstDeposit?: boolean
  saveStatus?: number
  operator?: string
  start: number
  end: number
  dateType: number
  selfExclusionStatus: string
  remark?: string
  ref_trans_code?: string
  recommender?: string
}
export type GetDepositAndWithdrawalDetail = {
  id?: number
}

export type GetMemberLevelModify = BaseRequest & {
  memberAccount?: string
  recommender?: string
  memberLevel?: number
  memberTag?: number
  enable?: number
}

export type GetMemberLevelHistory = BaseRequest & {
  memberAccount?: string
  memberLevel?: number
  start?: number
  end?: number
}

export type GetMemberLevelHistoryDetails = BaseRequest &
  GetMemberLevelHistory & {
    id: number
  }

export type GetMemberLevelRewardList = BaseRequest & {
  memberAccount?: string
  currency?: string
  start?: number
  end?: number
}

export type GetMemberLevelRewardDetails = BaseRequest & {
  id?: number
  start?: number
  end?: number
}

export type GetMemberQuota = BaseRequest & {
  member_account?: string
  start?: string
  end?: string
  startDateTime?: string // ISO 8601 格式: "yyyy-MM-dd'T'HH:mm:ss" (例如: "2024-01-01T00:00:00")
  endDateTime?: string // ISO 8601 格式: "yyyy-MM-dd'T'HH:mm:ss" (例如: "2024-01-31T23:59:59")
  modify_type?: number
  modify_reason?: number
  currency?: string
  order_number?: string
}
export type MemberQuotaList = {
  memberAccount?: string
  quotaType?: number
  quotaModifyReason?: number
  currency?: string
  orderNumber?: string
  wallet_type?: number
  start?: string
  end?: string
  offset: number
  size: number
}

export type GetAuditAdjustmentBalance = {
  account: string
  currency_id: CURRENCY_TYPE.Enums
  wallet_type: BONUS_WALLET_TYPE.Enums
  [property: string]: unknown
}

export type CreateAuditAdjustmentItem = {
  audit_balance: string
  currency_id: CURRENCY_TYPE.Enums
  member_account: string
  remark?: string
  /**
   * 1 or 3.
   */
  wallet_type: BONUS_WALLET_TYPE.Enums
  [property: string]: unknown
}

export type CreateAuditAdjustment = CreateAuditAdjustmentItem[]

export type GetAuditAdjustmentRecords = BaseRequest & {
  /**
   * Member account.
   */
  memberAccount?: string
  /**
   * Currency ID.
   */
  currency?: CURRENCY_TYPE.Enums
  /**
   * Timestamp from query date picker.
   */
  end: number | string
  /**
   * Timestamp from query date picker.
   */
  start: number | string
  /**
   * 1 or 3.
   */
  wallet_type?: BONUS_WALLET_TYPE.Enums
  [property: string]: unknown
}

export type AuditAdjustmentRecordsPayload = {
  /**
   * Member account.
   */
  account?: string
  /**
   * Currency ID.
   */
  currency_id?: CURRENCY_TYPE.Enums
  /**
   * RFC3339.
   */
  end_date: number | string
  offset?: number
  size?: number
  /**
   * RFC3339.
   */
  start_date: number | string
  /**
   * 1 or 3.
   */
  wallet_type?: BONUS_WALLET_TYPE.Enums
  [property: string]: unknown
}

export type GetAuditAdjustmentRecordsExport = Omit<GetAuditAdjustmentRecords, "offset" | "size">

export type AuditAdjustmentRecordsExportPayload = Omit<AuditAdjustmentRecordsPayload, "offset" | "size">

export type ValidateAuditAdjustment = {
  /**
   * CSV file.
   */
  file: File
  [property: string]: unknown
}

export type GetMemberKycList = BaseRequest & {
  memberAccount?: string
  orderNumber?: string
  type?: string | number
  status?: number
  start: number
  end: number
  start2: number
  end2: number
}

export type MemberRewardListDistribution = BaseRequest & {
  id: string
}

export type GetMemberTagList = BaseRequest & {
  id?: number
  memberTagType?: number
  enable?: boolean
  name?: string
  remark?: string
  offset: number
  size: number
}

export type GetMemberTagDetail = BaseRequest & {
  id?: number
  memberTagType?: number
  enableStatus?: boolean
  name?: string
  remark?: string
}

export type ImageItem = {
  id: number
  member_id: number
  img: string
  created_at: string
  created_by: number
}

export type AddMemberAccount = {
  // 前端寫死
  [key: string]: any
  enabled: boolean
  block: boolean
  label: number[]
}

export type GetMemberDetail = {
  id?: number
  account?: string
  password?: string
  ref_id?: number
  member_level?: number
  enabled?: boolean
  block?: boolean
  fullname?: string
  nickname?: string
  dob?: string
  gender?: GENDER.Enums
  phone?: string
  email?: string
  contacts?: { contact1: string; contact2: string }
  label?: number[]
  country?: string
  imgs: ImageItem[]
}

export type UpdateMemberBlock = {
  ids: number[]
  block: boolean
}

export type GetSingleDocumentDownload = BaseRequest & {
  id?: number
}
export type downloadListItem = {
  file_path: string
  file_name: string
  folder_name: string
}

export type GetdocumentDownloadList = BaseRequest & {
  id?: number
  documentType?: number
  displayObjectType?: number
  enable?: boolean
  keyword?: string
  start?: string
  end?: string
  actions: number
  file_list?: downloadListItem[]
}

export type GetdocumentDownloadDetail = BaseRequest & {
  id?: number
  desc?: string
  enabled?: boolean
  file?: string
  file_type?: number
  target?: number
  title?: string
  file_start_time?: string
  file_end_time?: string
  target_audience?: string[]
}

export type GetCashReportList = BaseRequest & {
  id: number
  currency: number
  agentAccount: number
  adminAgentAccount?: string
  start: string
  end: string
  offset: number
  size: number
  total_deposit: string
  total_withdrawal_amount: string
  total_entry_exit: string
  wallet_type: BONUS_WALLET_TYPE.Enums
}

export type GetCashReportDetail = BaseRequest & {
  id: number
  currencyId: number
  memberId: number
  agentAccount?: string
  date: string
  offset: number
  size: number
  action_type: number
  trans_code: string
  wallet_type: BONUS_WALLET_TYPE.Enums
}

export type GetMemberOverviewPersonal = BaseRequest & {
  currency: number
  start: string
  end: string
  agentAccount: string
}

export type GetMemberOverviewList = BaseRequest & {
  currency: number
  start: string
  end: string
  offset: number
  size: number
  agentAccount: string
  startDateTime?: string // ISO 8601 格式: "yyyy-MM-dd'T'HH:mm:ss" (例如: "2024-01-01T00:00:00")
  endDateTime?: string // ISO 8601 格式: "yyyy-MM-dd'T'HH:mm:ss" (例如: "2024-01-31T23:59:59")
}

export type GetMemberOverviewDetail = GetMemberOverviewPersonal & {
  member_id: number
}

export type GetDepositReportList = BaseRequest & {
  id: number
  depositNumber: string
  currency: number
  type: number
  memberAccount: string
  saveStatus: string
  dateType: number
  start: number
  end: number
  multiDateType: number[]
}

export type GetWithdrawalReportList = BaseRequest & {
  id: number
  withdrawalNumber: string
  currency: number
  type: number
  memberAccount: string
  saveStatus: string
  dateType: number
  start: number
  end: number
  multiDateType: number[]
}

export type GetProductBetReportList = BaseRequest & {
  id: number
  agentAccount: number
  product_type?: string
  product?: string
  product_id?: number
  product_code?: number
  product_title?: string
  currency_id?: number
  adminAgentAccount?: string
  member_id?: number
  currency?: number
  date: string
  code?: string
  game_type?: number
  offset: number
  size: number
  start?: number
  end?: number
  total_deposit: string
  total_withdrawal_amount: string
  total_entry_exit: string
  gameProductCode: string
  gameName: string[]
  wallet_type?: BONUS_WALLET_TYPE.Enums
}

export type GetProductBetReportDetail = BaseRequest & {
  id: number
}

export type GetBetReportList = BaseRequest & {
  id: number
  currency?: number
  currency_id?: number
  product_code?: number
  game_type?: number
  code: string
  dateType: number
  start: number
  end: number
  date: string
  total_deposit: string
  total_withdrawal_amount: string
  total_entry_exit: string
  multiDateType?: number[]
  wallet_type?: BONUS_WALLET_TYPE.Enums
}

export type GetMemberBetReportDetail = BaseRequest & {
  id: number
  currency?: number
  currency_id?: number
  member_id?: number
  product_code?: number
  start: number
  end: number
  date: number
  offset: number
  size: number
  betNumber: number
  dateType: number
  game_type?: string
  code?: number
  settled_start: string
  settled_end: string
  wallet_type: number
}

export type GetBetReportDetail = BaseRequest & {
  id: number
}

export type MasterAgentBetReportList = BaseRequest & {
  id: number
  adminAgentAccount?: string
  product_type?: string
  product?: string
  start: string
  end: string
  currency?: number
  date: string
  master_agent_account?: string
  agent_account?: string
  game_type?: string
  code?: number
  total_deposit: string
  total_withdrawal_amount: string
  total_entry_exit: string
}

export type GetAgentBetReportList = BaseRequest & {
  id: number
  agentAccount?: string
  product_type?: string
  product?: string
  start: string
  end: string
  currency?: number
  date: string
  master_agent_account?: string
  agent_account?: string
  game_type?: string
  code?: number
  product_code?: number
  total_deposit: string
  total_withdrawal_amount: string
  total_entry_exit: string
}

export type GetMemberBetReportList = BaseRequest & {
  currency?: number
  currency_id: number
  member_id: number
  memberTag?: number
  not_label?: number
  wallet_type?: BONUS_WALLET_TYPE.Enums
  recommender?: string
  start?: string
  start_date: string
  end?: string
  end_date: string
  order_type?: string
  sort_type?: number
}

export type GetDailyOverviewtReportList = BaseRequest & {
  currency?: number
  currency_id: number
  start?: string
  start_date: string
  gaming_site?: number
  end?: string
  end_date: string
}

export type GetDailyOverviewtReportExport = BaseRequest & {
  currency?: number
  currency_id: number
  start?: string
  start_date: string
  end?: string
  end_date: string
}

export type GetAdminAccount = BaseRequest & {
  id?: number
  account?: string
  name?: string
  enable?: number
  frozenStatus?: number
  permissionLevel?: number
  phone?: number
  email?: number
  offset: number
  size: number
}

export type GetAdminAccountDetail = {
  id?: number
  password?: string
  enabled?: boolean
  is_ban?: boolean
  role_id?: number
  name?: string
  phone?: string
  email?: string
  remark?: string
}
export type AddAdminAccount = {
  account: string
  password: string
  enabled: boolean
  is_ban: boolean
  name: string
  phone: string
  email: string
  remark: string
  verify_binding: boolean
  role_id: number
}

export type AddAuroraAgent = {
  agent_code: string
  agent_name: string
}

export type AddAdminProxy = {
  agent_code: string
  name: string
}

export type GetAdminAccountPermission = {
  name?: string
}
export type GetAdminAccountPermissionDetail = {
  id: number
}

export type GetUserActionLog = BaseRequest & {
  id?: number
  username?: string
  name?: string
  pageLog?: string
  start?: number
  end?: number
  keyword?: string
  actions?: number
}

export type GetProductGameType = {
  game_type?: number
  currency?: number
  only_actived?: boolean
}

export type GetGameNameDropdown = {
  product_code?: number
  game_type?: number
  currency_id?: number
}

export type GetProductList = BaseRequest & {
  game_type?: number
  code?: string
  title?: string
  keyword?: string
  lan: string
}

export type SetProductStatus = {
  product_code: number
  game_type: number
  status: boolean
}

export type ProductCustomImageForm = {
  enable_tab_image: number
  enable_square_image: number
  enable_wide_image: number
  tab_image_code: string
  square_image_code: string
  wide_image_code: string
}

export type SetProductCustomImage = {
  product_id: number
  enable_tab_image: boolean
  enable_square_image: boolean
  enable_wide_image: boolean
  tab_image_code: string
  square_image_code: string
  wide_image_code: string
}

export type setProductPosition = {
  product_id: number
  position: number
}

export type GetGameList = BaseRequest & {
  ids?: string
  gameName?: number[]
  name?: string
  keyword?: string
  gameCode?: number
  product_code?: number
  game_type?: number
  code?: number
}

export type GetGameListV2 = BaseRequest & {
  integration_id?: number
  product_code?: string
  product_name?: string
  game_type?: number
  currency_id?: number
  currency?: number
  integration_status?: number
  status?: boolean
  lan: string
}

export type UpdateProductCashMaxBet = {
  ids: number[]
  cash_max_bet: number
}

export type UpdateProductBonusSupport = {
  ids: number[]
  bonus_support: boolean
}

export type UpdateProductBonusMaxBet = {
  ids: number[]
  bonus_max_bet: number
}

export type GetProductListV2 = BaseRequest & {
  game_type?: number
  code?: string
  title?: string
  keyword?: string
  lan?: string
  integration_id: number | string
  product_code: number | string
}
export type GetProductGameList = BaseRequest & {
  code?: string
  name?: string
  game_type?: number
  status?: boolean
  lan?: string
  integration_id?: number
  product_code?: string
  keyword?: string
}

export type ProductCustomImageFormV2 = {
  is_custom_image: any
  custom_image: string
  path?: File | string
  game_name: string
}

export type ProductCustomFormV2 = {
  integration_id: string | number
  product_code: string | number
  game_type?: string | number
  game_code: string | number
  customize: {
    language_code: string
    is_custom_image: boolean
    custom_image: string
    path?: File | string
  }[]
}

export type UploadProductImages = {
  integration_id: string | number
  product_code: string | number
  game_type?: string | number
  language_code: string
  image: File
}

export type SetGameTypeFormV2 = {
  use_tab_image: boolean
  use_square_image: boolean
  use_wide_image: boolean
  tab_image?: string
  square_image?: string
  wide_image?: string
  tab_path?: File | string
  square_path?: File | string
  wide_path?: File | string
  product_name: string
}

export type GetAgentProductListV2 = BaseRequest & {
  agent_id?: number
  integration_id?: number
  product_code?: string
  product_name?: string
  game_type?: number
  currency_id?: number
  currency?: number
  integration_status?: number
  status?: boolean
  is_active?: boolean
  lan: string
}

export type GetEntranceMapList = BaseRequest & {
  integration_id?: number
  product_code?: string
  product_name?: string
  code?: string
  game_type?: number
  lan?: string
}

export type ProductSort = BaseRequest & {
  game_type?: GAME_TYPE.Enums
  product_name?: string
  keyword?: string
  lan: string
  product_code?: number
  integration_id?: number
}

export type SetGameTypeV2 = {
  game_type: number
  integration_id: number
  product_code: number
  position: number
}

export type SetGameStatus = {
  ids: number[]
  status: boolean
}

export type SetGameHot = {
  ids: number[]
  hot: boolean
}

export type SetGameNew = {
  ids: number[]
  newly: boolean
}

export type SetGameSort = {
  id: number
  sort: number
}

export type SetGameCustomImageForm = {
  id: number
  is_custom_image: number
  custom_image: string
}

export type SetGameCustomImage = {
  id: number
  is_custom_image: boolean
  custom_image: string
}

export type SetGameTypeForm = {
  game_type: string
  use_pc_image: number
  use_h5_image: number
  pc_image: string
  h5_image: string
  position: number
}

export type SetGameType = {
  game_type?: string
  use_pc_image?: boolean
  use_h5_image?: boolean
  pc_image?: string
  h5_image?: string
  position?: number
}

export type GetProductGameSetting = BaseRequest & {
  id?: number
  product_type?: string
  product?: string
  route_switch?: number
  activated_quantity?: number
  personnel_switch?: number
}

export type GetProductMaintenSetting = BaseRequest & {
  id?: number
  product_type?: string
  product?: string
  activated_quantity?: number
  status?: number
  maintainence_period?: number
  action?: number
}

export type GetGeneralAgencyManagementList = BaseRequest & {
  id?: number
  display_name?: string
  genaralAgentAccount?: string
  enabled?: boolean
  enable?: boolean
  is_ban?: boolean
  accountStatus?: boolean
  title?: string
  masterAgentName?: string
  mobile?: string
  phone?: string
  email?: string
}

export type GetSingleGeneralAgencyManagement = BaseRequest & {
  id?: number
  password?: string
  confirm_password?: string
  master_agent_name?: string
  contact_person?: string
  mobile?: string
  email?: string
  phone?: string
  remark?: string
  enable_or_disable?: boolean
  account_frozen?: boolean
  binding?: boolean
  currency?: string
  product?: string[]
}

export type updateSingleGeneralAgencyManagement = BaseRequest & {
  id?: number
  master_agent_ID?: string
  master_agent_account?: string
  master_agent_name?: string
  contact_person?: string
  password?: string
  confirm_password?: string
  email?: string
  phone?: string
  remark?: string
  enable_or_disable?: boolean
  account_frozen?: boolean
  binding?: boolean
  currency?: number[]
  product?: number[]
}

export type GetAgencyOperationsManagementList = BaseRequest & {
  id: number
  master_agent_name: string
  agent_account: string
  agent_name: string
  website_name: string
  frontend_URL: string
  frontend_active_disable: number
  bo_active_disable: number
}

export type GetAccountFlowList = BaseRequest & {
  id: number
  date: number
  memberAccount: string
  accountFlowType: number[]
  auditRelatedTypes?: boolean
  account_flow_time: string
  account_flow_number: number
  account_flow_object: string
  account_flow_before_amount: string
  account_flow_after_amount: string
  amount: string
  ip: string
  currency: string
  start: string
  end: string
  total_deposit: string
  total_withdrawal_amount: string
  total_entry_exit: string
  wallet_type: BONUS_WALLET_TYPE.Enums
}

export type GetBetRecordList = BaseRequest & {
  currency?: number
  dateType?: number
  start?: number
  end?: number
  code?: string
  game_type?: number
  memberAccount?: string
  betNumber?: string
  multiDateType?: number[]
  wallet_type?: BONUS_WALLET_TYPE.Enums
  gaming_site: number
}

export type GetUserReportGeneralAgentExport = {
  date: string
}

export type GetUserReportList = BaseRequest & {
  id: number
  date: string
  agentAccount: number
  adminAgentAccount?: string
  start: number
  end: number
  online_count: string
  register_count: string
  login_count: string
  pc_login_count: string
  android_login_count: string
  ios_login_count: string
  h5_login_count: string
  total_deposit: string
  total_withdrawal_amount: string
  total_entry_exit: string
}

export type GetDayReportList = BaseRequest & {
  id: number
  date: number
  total_deposit: string
  total_withdrawal_amount: string
  total_entry_exit: string
}

export type GetDayReportDetail = BaseRequest & {
  id: number
  date: number
  total_deposit: string
  total_withdrawal_amount: string
  total_entry_exit: string
}

export type GetAnnouncementList = BaseRequest & {
  id: number
  announcementType: number
  displayObjectType: number
  title: string
  start: number
  end: number
  enable: boolean
  announcement_start_time: string
  announcement_end_time: string
  sequence: number
}

export type GetMemberAnnouncementList = BaseRequest & {
  id: number
  announcementType: number
  displayObjectType: number
  keyword: string
  start: number
  end: number
}

export type AddMemberAnnouncementDetailItem = {
  lang: string
  title: string
  content: string
  image: string
  image_path: string
  imageFileName?: string
}

export type AddMemberAnnouncement = {
  id?: number
  type: ANNOUNCEMENT_MEMBER_TYPE.Enums
  start_time: number | string
  end_time: number | string
  enable: number
  details: AddMemberAnnouncementDetailItem[]
  target_member_ids: number[]
  show_member_ids: number[]
  member_mode: string
  display_options: ANNOUNCEMENT_DISPLAY_TYPE.Enums[]
}

export type GetSingleAnnouncementDetail = BaseRequest & {
  id: number
}

export type GetAnnouncementDetail = BaseRequest & {
  id: number
  desc: string
  announcementType: number
  type: number
  file: string
  target: string
  title: string
  enabled: number
  announcement_start_time: string
  announcement_end_time: string
  agent_name_group: string[]
  img_url: string
}

export type GetGatewayList = BaseRequest & {
  id?: number
  name: string
  type: number
  currency: number
  enable?: boolean
  display?: boolean
  deposit?: boolean
  withdraw?: boolean
  master_id?: number
  agent_id?: number
  service?: number
  adminAgentAccount?: number
  agentAccount?: number
  support_method_type?: number
}

export type GetGatewayDetail = {
  id: number
}

export type SetGatewayInfo = {
  id: number
  name: string
  remark: string
  display: boolean
  logo_image_id: number
  bank_info: BankInfo
  config: Config
  crypto_info: CryptoInfo
  extra_remark: ExtraRemark[]
  enable?: boolean
}

export interface Config {
  audit_rate: number
  deposit_max: string
  deposit_min: string
  enable_first_deposit_check: boolean
  fee_amount: number
  fee_rate: number
  fee_type: number
  first_deposit_min: string
  quick_amounts?: string[]
  usdt_rate: number
  withdraw_max: string
  withdraw_min: string
  [property: string]: any
}

export interface GatewayConfig {
  audit_rate?: number
  deposit_max?: string
  deposit_min?: string
  enable_first_deposit_check?: boolean
  fee_amount?: number
  fee_rate?: number
  fee_type?: number
  first_deposit_min?: string
  quick_amounts?: string[]
  usdt_rate?: number | string
  withdraw_max?: string
  withdraw_min?: string
  [property: string]: any
}

export interface SetAgentGatewayInfoConfig {
  deposit_min: string
  deposit_max: string
  withdraw_min: string
  withdraw_max: string
  audit_rate: number
  fee_type: number
  fee_amount: number
  fee_rate: number
  first_deposit_min: string
  enable_first_deposit_check: boolean
  quick_amounts?: string[]
  usdt_rate: number
  [property: string]: any
}

export type SetAgentGatewayInfo = {
  id?: number
  display: boolean
  name: string
  remark: string
  logo_image_id: number
  config: SetAgentGatewayInfoConfig
  bank_info?: GatewayBankInfo
  crypto_info?: GatewayCryptoInfo
  /**
   * 不管有沒有改動都必填
   */
  extra_remark: ExtraRemark[]
  [property: string]: any
}

export interface BankInfo {
  /**
   * 銀行帳號
   */
  account: string
  /**
   * 圖片編號，先使用 /v1/payment/upload/image 上傳圖片取得編號
   */
  image_id: number | string
  /**
   * 分行名稱
   */
  name: string
  [property: string]: any
}

/** GET payment/gateway/bank 查詢參數 */
export interface GetThirdGatewayBankQuery {
  /** 須指定渠道之取款（第三方支付等）時帶入；銀行轉帳、虛擬貨幣轉帳請勿帶 */
  payment_gateway_id?: string
  /** 未選擇渠道時帶入取款類型（銀行轉帳或虛擬貨幣轉帳） */
  payment_type_id?: string
}

export interface GatewayBankInfo {
  /**
   * 銀行帳號
   */
  account?: string
  /**
   * 圖片編號，先使用 /v1/payment/upload/image 上傳圖片取得編號
   */
  image_id?: number
  /**
   * 分行名稱
   */
  name?: string
  [property: string]: any
}

export interface CryptoInfo {
  /**
   * 協議
   */
  chain: string
  /**
   * 圖片編號，先使用 /v1/payment/upload/image 上傳圖片取得編號
   */
  image_id: number
  /**
   * 錢包地址
   */
  wallet_address: string
  [property: string]: any
}

export interface GatewayCryptoInfo {
  /**
   * 協議
   */
  chain?: string
  /**
   * 圖片編號，先使用 /v1/payment/upload/image 上傳圖片取得編號
   */
  image_id?: number
  /**
   * 錢包地址
   */
  wallet_address?: string
  [property: string]: any
}

export interface ExtraRemark {
  titles?: Title[]
  /**
   * 1:存款備註, 2:提款備註
   */
  type?: number
  [property: string]: any
}

export interface Title {
  lang?: string
  title?: string
  [property: string]: any
}

export type SetGatewayMasterIds = {
  id: number
  disable_master_ids?: number[]
  enable_master_ids?: number[]
  disable_agent_ids?: number[]
  enable_agent_ids?: number[]
}

export type UploadPaymentImage = {
  image: File
}

export type GatewayExtraContent = {
  lang: string // 表示语言代码，如 "en", "cn"
  title: string // 表示该语言下的标题内容
}

export type GatewayExtraItem = {
  id?: number
  type: number
  titles: GatewayExtraContent[]
}
export type GatewayItemDetail = {
  /**
   * 稽核倍率
   */
  audit_rate: string
  bank_info?: BankInfo
  /**
   * 虛擬幣幣別
   */
  crypto?: number
  crypto_info?: CryptoInfo
  /**
   * 支援幣別，參照 /v1/agent/payment/currency
   */
  currency: number
  /**
   * 最大存款限額，0 代表無限制
   */
  deposit_max: string
  /**
   * 最小存款限額
   */
  deposit_min: string
  /**
   * 是否在前端顯示
   */
  display: boolean
  /**
   * 是否開啟檢查最低首存，false 關閉 , true 開啟
   */
  enable_first_deposit_check?: boolean
  extra_remark?: ExtraRemark[]
  /**
   * 手續費
   */
  fee_amount: string
  /**
   * 手續費倍率
   */
  fee_rate: string
  /**
   * 手續費類型，1. 手續費, 2. 手續費倍率
   */
  fee_type: number
  /**
   * 首存最小存款限額
   */
  first_deposit_min?: string
  logo_image_id?: number
  /**
   * 支付通道名稱
   */
  name: string
  /**
   * 商戶渠道，非三方不帶
   */
  payment_gateway_channel_code?: string
  /**
   * 商戶名稱，非三方不帶
   */
  payment_gateway_name?: string
  quick_amounts?: string[]
  /**
   * 備註
   */
  remark: string
  /**
   * 服務
   * 1=存款, 2=出款
   */
  support_method_type: number
  /**
   * 支付方式類型，1: 銀行轉帳 2:三方支付 3: 虛擬幣轉帳, 6: 額外通道, 7:虛擬幣三方
   */
  type: number
  /**
   * usdt匯率
   */
  usdt_rate: string
  /**
   * 最小出款限額，0 代表無限制
   */
  withdraw_max: string
  /**
   * 最小出款限額
   */
  withdraw_min: string
  [property: string]: any
}

export type cashFlowItem = {
  id: number
  name: string
  method: number
  currency: number
  service: number
  count: number
  status: number
  remark: string
}

export type GetCashFlowList = cashFlowItem[]

export type GetPromotionList = BaseRequest & {
  title?: string
  type?: EVENT_TYPE.Enums
  currency_id?: CURRENCY_TYPE.Enums
  enable?: boolean
  start_date?: number
  end_date?: number
  currency?: CURRENCY_TYPE.Enums
  wallet_type?: BONUS_WALLET_TYPE.Enums
  prizeType?: PRIZE_TYPE.Enums
  start?: number
  end?: number
  status?: string
}

export type PromotionInfo = {
  lang: LANGUAGE_TYPE.Enums
  title: string
  content: string
  image: string
  storage_key?: string
}

export type PromotionRewardItem = {
  amount: number | string
  condition: number | string
  currency: string
  free_round_setting?: FreeRoundSettingItem[]
  level?: number
  limit?: number | string
  negative_profit_condition?: number
  negative_profit_type?: number
  type: number
  max_level?: number
  repeatable?: boolean
}

export type DepositLifetimeConditionCurrency = {
  currency: string
  condition: string | number
  amount: string | number
  limit?: string | number
}

export type DepositLifetimeConditionFreeGame = {
  condition: string | number
  freeRoundSetting: FreeRoundSettingItem
  dateRange?: {
    from?: string
    fromHms?: string
    to?: string
    toHms?: string
  }
}

export type DepositLifetimeCondition = {
  id: string
  hitCount?: string | number
  minCount?: string | number
  maxCount?: string | number
  repeatable?: boolean
  expanded?: boolean
  currencies: DepositLifetimeConditionCurrency[]
  freeGame?: DepositLifetimeConditionFreeGame
}

export type FreeRoundSettingItem = {
  begin_date: number
  bet_per_line: string
  total_bet_amount?: string
  currency_id: number
  end_date: number
  game_code: string
  product_code: number
  remark?: string
  rounds: number | string
  wallet_type: BONUS_WALLET_TYPE.Enums
}

export type PromotionLevelItem = {
  level: number
  currency: { currency: string; currency_id: number; condition: string | number; amount: string | number }[]
}
export interface promotionGatewayItem {
  type: number
  id: number
  name: string
  currency: number
}

export type AddPromotionItem = {
  allow_same_ip?: boolean
  audit_rate: number
  audit_rate_source: number
  auto_payout: boolean
  block_label_ids: number[]
  category: number
  count_basis?: COUNT_BASIS.Enums
  end_date: string
  game_type?: number[]
  info: PromotionInfo[]
  member_levels: number[]
  offer_type?: number
  payment_gateway: number[]
  prize_type: number
  product_code?: number[]
  reward: PromotionRewardItem[]
  levelData?: PromotionLevelItem[]
  settlement_target?: number
  settlement_type?: number
  settlement_week?: number
  show: boolean
  start_date: string
  type: number
  wallet_type: number
  rewardType?: number
  filteredGatewayList?: promotionGatewayItem[]
  choice_game_type?: number
  bankCardTags?: number[]
  electronicWallet?: number[]
  ExternalChannelTags?: number[]
  cryptoWalletTags?: number[]
  cryptoWalletThirdTags?: number[]
  show_component?: boolean
  mode?: string
  reward_range_mode?: boolean
  depositLifetimeMode?: "specifiedCount" | "specifiedRange"
  depositLifetimeSpecifiedCount?: DepositLifetimeCondition[]
  depositLifetimeSpecifiedRange?: DepositLifetimeCondition[]
}

export type UpdatePromotionItem = AddPromotionItem & {
  id?: number
}

export type UpdatePromotionItemStatus = {
  id: number
  enabled: boolean
}

export type GetPromotionReviewList = BaseRequest & {
  title?: string
  type?: EVENT_TYPE.Enums
  currency_id?: CURRENCY_TYPE.Enums
  status?: DISTRIBUTION_STATUS.Enums
  start_date?: string
  end_date?: string
  currency?: CURRENCY_TYPE.Enums
  wallet_type?: BONUS_WALLET_TYPE.Enums
  prizeType?: PRIZE_TYPE.Enums
  memberAccount: string
  start?: number
  end?: number
}

export type GetPromotionGatewayList = BaseRequest & {
  display: boolean
}

export type InvitationBonusInfo = {
  language: LANGUAGE_TYPE.Enums
  title: string
  description_page: string
  images: string
}
export type InvitationBonusLevel = {
  level_name: string
  level: number
  active_member_count: number | string
  rewards: {
    currency_id: number
    reward_amount: number | string
  }[]
}[]
export type AddInvitationBonusItem = {
  content_setting: PromotionInfo[]
  settlement_enabled: boolean
  start_date: string | number
  end_date: string | number
  period_start_at: string | number
  period_end_at: string | number
  payout_method: number
  turnover_rate: number
  i18n: InvitationBonusInfo[]
  labels: number[]
  levelData: InvitationBonusLevel
  levels: InvitationBonusLevel
  metrics: {
    currency_id: number
    valid_bet: number | string
    deposit: number | string
  }[]
}

export type UpdateInvitationBonusItem = AddInvitationBonusItem & {
  id?: number
}

export type GetInvitationBonusList = BaseRequest & {
  settlement_enabled?: boolean | number
  start_time?: number | string
  end_time?: number | string
  start?: number | string
  end?: number | string
  status?: string
}

export type GetInvitationBonusEventList = BaseRequest & {
  payout_method?: number
  rewardType?: number
  start_time?: number | string
  end_time?: number | string
  start?: number | string
  end?: number | string
  status?: string
}
export type GetInvitationBonusDetail = BaseRequest & {
  campaign_id: number
  event_id: number
  entry_id: number
  parent_id: number
  active_member_count: number
}

export type CollaborationContent = {
  lang: LANGUAGE_TYPE.Enums
  title: string
  detail: string
  image: string
}
export type CollaborationBasic = {
  // started_at: string
  // ended_at: string
  // auto_payout: number
  // reward_type: number
  show: number
  settlement_type?: SETTLEMENT_CYCLE.Enums
  settlement_week?: number
  // audit_rate: number
  rebate: number
  calculation_type: number
  // dispatched_time: string
  // dispatched_week: number
}
export type CurrencySetting = {
  currency_id: number
  currency_code: string
  deposit_amount: number
  valid_bet_amount: number
}
export type CollaborationLevelItem = {
  active_members: number
  commission_rate: number
  net_profit: {
    currency_id: number
    currency: string
    amount: string | number
  }[]
  platform_fee: {
    currency_id: number
    currency: string
    amount: string | number
  }[]
}
export type AddCollaborationItem = {
  mode: string
  content_settings: CollaborationContent[]
  basic_setting: CollaborationBasic
  active_member_settings: CurrencySetting[]
  levelData: CollaborationLevelItem[]
  rebate_settings: CollaborationLevelItem[]
  // game_type: number[]
  // product_code: number[]
  // choice_game_type: number
  // label_settings: number[]
}

export type UpdateCollaborationItem = AddCollaborationItem & {
  id?: number
}

export type CollaborationReviewItem = {
  id: number
  start: number
  end: number
  member_id: number
  memberAccount: string
  level: number
  active_member_count: number
  currency_id: number
  currency: number
  net_profit: number
  rebate_amount: number
  rewardType: number
  label_count: number
  reason: string
  status: number | string
  operator_name: string
  updated_at: string
  offset: number
  size: number
}

export type GetMonitoringSettingList = BaseRequest & {
  id: number
}

export type GetNotificationRecordList = BaseRequest & {
  monitoringType?: number
  start?: number
  end?: number
  keyword?: string
}

export type GetBankSettingItemList = BaseRequest & {
  id: string
  type: number
  bank: string
  branch: string
  card_no: string
  currency: number
  account_name: string
  bank_card_id: number
  wallet_address: string
  currency_brand: string
  chain: string
  bank_id: number
  payment_gateway_id: number
}

export type GetBankSettingItem = BaseRequest & {
  id: string
  bank_card_id: number
}

export type GetElectronicWalletItem = BaseRequest & {
  id: number
  payment_provider: string
  wallet_address: string
  currency: number
  verify_information: string
  created_on: number
  frequently_used_accounts: string
}

export type GetVirtualCurrencyItem = BaseRequest & {
  id: number
  withdrawal_wallet: string
  wallet_address: string
  currency: number
  verify_information: string
  created_on: number
  frequently_used_accounts: string
}

export type GetMemberTransactionReport = BaseRequest & {
  id: number
  dateType: number
  currency: number
  paymentType: number
  tradingActionType: number
  transactionNumber: number
  wallet_type: number
  start: string
  end: string
  offset: number
  size: number
}

export type GetMemberBettingReport = BaseRequest & {
  id: number
  member_id: string
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
  total_bet_amount: number
  total_validate_bet: number
  total_winlose: number
  total_winrate_count: number
  total_bonus: number
}

export type GetAgencyManagementList = BaseRequest & {
  id: number
  agentId: string
  agentAccount: string
  agentName: string
  contact_person: string
  created_on: number
  frontend_URL: string
  siteOperationType: number
  enable: number
  verify_binding: number
  phone: string
  email: string
  accountStatus: number
}

export type GetAgencyManagementDetail = {
  id: number
  password: string
  title: string
  contact: string
  mobile: string
  email: string
  remark: string
  enabled: boolean
  is_ban: boolean
  unbind_2fa: boolean
  currency_ids: number[]
}

export type GetAuroraAgentList = BaseRequest & {
  auroraAdminAgentAccount: string
}

export type GetMemberLevelDetail = {
  id: number
}

export type GetSingleCashFlowList = {
  id: number
  agent_id: string
  agent_account: string
  agent_name: string
  contact_person: string
}

export type GetAgentMemberCommissionSetting = BaseRequest & {
  id: number
  commissionName: string
  memberAccount: string
  enable: boolean
  calculation_type?: number
  settle_cycle: string
  wallet_type: BONUS_WALLET_TYPE.Enums
}

export type GetAgentMemberCommissionSettingDetail = {
  id: number
}

export type GetAgentMemberCommissionReview = BaseRequest & {
  id: number
  currency: number
  reward_type: number
  name: string
  valid_time_start: number
  valid_time_end: number
  settle_cycle: string
  reward_count: number
  block_reward_count: number
  actions?: number
}

export type GetAgentMemberCommissionReviewDetail = BaseRequest & {
  id: number
  member_account: string
  currency: number
  commission_flow_type: number
  block_tags_num: number
  status: number
}

export type GetAgentMemberCommissionDetailDetail = BaseRequest & {
  id: number
  rebate_level: string
  commissionName: string
  calculation_type?: number
  dispatch_type?: number
  memberAccount: string
  commission_id: number
  statement_id: number
  account: string
  currency_id?: number
  detail_id?: number | string
  start: number
  end: number
  wallet_type: BONUS_WALLET_TYPE.Enums
}

export type GetAgentMemberCommissionStatementDetails = BaseRequest & {
  statement_id: number
  currency_id?: number
}

export type PostAgentMemberCommissionStatementAction = {
  statement_id: number
}

export type PostAgentMemberCommissionStatementDetailAction = {
  statement_id: number
  detail_id: number | string
}

export type GetAgentRelationshipSetting = BaseRequest & {
  id: number
  senior_member: string
  member_account: string
  actions?: number
}
export type GetAgentRelationshipSettingDetail = {
  id: number
}

export type GetAgentMemberCommissionDetail = BaseRequest & {
  id: number
  account: string
  commission_id: number
  statement_id?: number
}

export type GetAgentMemberCommissionReport = BaseRequest & {
  id: number
  commissionName: string
  memberAccount: string
  calculation_type?: number
  member_id: number
  currency_id: number
  currency: number
  commission_id: number
  statement_id: number
  account: string
  date: string
  grand_parent_account: string
  parent_account: string
  start: number
  end: number
}

export type GetAgentMemberCommissionReportNested = BaseRequest & {
  commission_id: number
  grand_parent_account: string
  currency_id: number
  member_id: number
  date: string
  start: number
  end: number
}

export type GetAgentMemberCommissionReportDetail = BaseRequest & {
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

export type GetIpWhiteList = BaseRequest & {
  id?: number
  ip?: string
  remark?: string
}

export type GetNoteSettingList = BaseRequest & {
  id?: number
  keyword?: string
}

export type GetMemberRemarkList = BaseRequest & {
  member_id?: number
  content?: string
  creation_date?: number
  add_personnel?: string
}

export type GetMemberOperationReportList = BaseRequest & {
  member_id?: number | string
  start?: number
  end?: number
}

export type GetMemberCommisionReport = BaseRequest & {
  id: number
  commissionGroup: number
  currency: number
  game_type: number
  commission_amount: number
  reward_type: number
  status: number
  member_tag: string
  start: number
  end: number
  rewardType: number
  lang?: string
}

export type GetMemberCommisionReportDetail = BaseRequest & {
  id: number
  bet_number: string
  bet_date: number
  settlement_date: number
  status: number
  currency: number
  product: string
  game: string
  bet_amount: number
  validate_bet: number
  winlose: number
  winrate_count: string
  event_amount: number
  total_bet_amount: number
  total_validate_bet: number
  total_winlose: number
  total_winrate_count: number
  total_bonus: number
}

export type GetCommissionDetailList = BaseRequest & {
  groupName?: string
  currency?: string
  rewardType?: number
  wallet_type: BONUS_WALLET_TYPE.Enums
  calculate_type?: number
  start: number
  end: number
}

export type GetCommissionDetailDetail = BaseRequest & {
  id?: number
  group_name?: string
  currency?: string
  event_id?: number
  entry_id?: number
  start: number
  end: number
}
export type postCommssionDistributeAll = BaseRequest & {
  id?: string
  currency_id?: string
  dispatch_type?: string
}

export type postCommssionMandatoryDistribution = BaseRequest & {
  id?: number
  event_id?: number
  entry_id?: number
  force?: boolean
}

export type GetCommissionSetting = BaseRequest & {
  id?: number
}
export type GetCommissionSettingList = BaseRequest & {
  id?: number | string
  groupName?: string
  rewardType?: number
  period_type?: number
  audit_rate?: number
  dispatch_type?: number
  days_of_week?: number
  enable?: boolean
  titles: any // 動態格式: 可能是 array 或 object
  dispatch_threshold: { currency_id: number; threshold: number }[]
  dispatch_amount_limit: { currency_id: number; amount?: string }[]
  level_ids: number[]
  label_ids: number[]
  rebate_rate_config: { game_type: string; product_code: number; currency_id: number; rate: string }[]
  start_at?: string
  end_at?: string
  wallet_type: BONUS_WALLET_TYPE.Enums
  calculate_type: number
  lang?: string
  start: number
  end: number
}

export type GetReferralCommissionSettingList = BaseRequest & {
  groupName?: string
  rewardType?: number
  period_type?: number
  audit_rate?: number
  dispatch_type?: number
  days_of_week?: number
  enabled?: boolean
  rebate_target?: REBATE_TARGET.Enums
  dispatch_threshold: { currency_id: number; threshold: number | string }[]
  dispatch_amount_limit: { currency_id: number; amount: number | string }[]
  label_ids: number[]
  rebate_rate_config: { game_type: string; product_code: number; currency_id: number; rate: string }[]
  level: number
  calculate_type: number
  wallet_type: number
}

export type TypeNewBannerForm = {
  title: string
  start_date: string | number
  end_date: string | number
  images: Record<string, string>
  position: number
  game_type?: string
  product_code?: string
  link: string
  opening_method: number
}

export type AgentCommissionRewardItem = {
  currency: number | string
  amount: number | string
}
export type AgentCommissionCurrencyLimitItem = {
  currency: number | string
  currency_id: number | string
  limit: number | string
}

export type AgentCommissionEligibility = {
  deposit: {
    mode: "accumulated" | "single"
    currency_threshold: { [currency_id: string]: string }
  }
  valid_bet_amount: {
    currency_threshold: { [currency_id: string]: string }
  }
}

export type AddAgentCommissionItem = {
  // info: agentCommissionInfo[]
  name: string
  member_ids: number[]
  block_label_ids: number[]
  member_levels: number[]
  currency_limit: AgentCommissionCurrencyLimitItem[]
  currency_limit_data: AgentCommissionCurrencyLimitItem[]
  commission_limit: AgentCommissionRewardItem[]
  commission_limit_data: AgentCommissionRewardItem[]
  rewardType?: PROMOTION_REWARD_TYPE.Enums
  settlement_type?: SETTLEMENT_CYCLE.Enums
  calculation_type?: number
  settlement_week?: number
  payout_method: number
  billing_type: string
  wallet_type: BONUS_WALLET_TYPE.Enums
  eligibility: AgentCommissionEligibility
}

export type UpdateAgentCommissionItem = AddAgentCommissionItem & {
  id?: number
}

export type agentCommissionInfo = {
  lang: LANGUAGE_TYPE.Enums
  title: string
}

export type GetGiftDetailList = BaseRequest & {
  memberAccount?: string
  currency?: CURRENCY_TYPE.Enums
  giftName?: GIFT_TYPE.Enums
  receiveStatus?: RECEIVE_STATUS.Enums
  dateType?: number
  event_id?: number
  start_date?: string
  end_date?: string
  start?: number
  end?: number
  wallet_type?: BONUS_WALLET_TYPE.Enums
}

export type GetCmsList = {
  type: CMS_TYPE.Enums
}

export type UpdateCmsItemSort = {
  id: number
  type: CMS_TYPE.Enums
  title: string
  sort: number
}

export type UpdateCmsItemStatus = {
  id: number
  enabled: boolean
  type: CMS_TYPE.Enums
}

export type UpdateCmsItemPopup = {
  type: number
  popup: boolean
}

export type CmsLangTitle = Partial<Record<LANGUAGE_TYPE.Enums, string>>

export type CmsSettingItem = {
  lang: CmsLangTitle
  contact_lang: CmsLangTitle
  icon: string
  selected_icon: string
  arrangement: CMS_ARRANGEMENT.Enums
  entrance_sort: CMS_ENTRANCE_SORT.Enums
  display_login: CMS_DISPLAY_LOGIN.Enums
  display_device: CMS_DISPLAY_DEVICE.Enums
  view_all: CMS_VIEW_SHOW.Enums
  opening_method: CMS_OPENING_METHOD.Enums
  row_show_pc: number
  row_show_mob: number
  logo_sort: string[]
  img_lang: CmsLangTitle
  icon_lang: CmsLangTitle
  contact_img_lang: CmsLangTitle
  pop_up_img: string[]
  comfirm_button_lang: CmsLangTitle
  reject_button_lang: CmsLangTitle
  pop_up_content: string
  arrangement_row_pc: number
  arrangement_row_mob: number
  product_entrance_type: number | string
  product_integration_id: number | string
  product_type: number | string
  product_code: number | string
  style?: Record<string, any>
}

export type CmsEntranceItem = {
  type: CMS_ENTRANCE_TYPE.Enums | CMS_PAGE_COMPONENT_TYPE.Enums
  payload: {
    sort?: number // 排序由小到大
    nested_entrance?: CmsEntranceItem[] // 嵌套 entrance
    page?: CmsPageItem[] // 嵌套 page
    row_show?: number // 每列數量
    row_num?: number // 列數
    alt_tag?: string
    title?: string
    content?: string // 內容文字
    game_type_entrance_type?: GAME_TYPE.ENTRANCE_TYPE // 呈現方式 , 1-供應商入口、 2-遊戲入口
    game_type_id?: GAME_TYPE.Enums | number
    product_code?: number
    game_type?: GAME_TYPE.Enums | number
    game_code?: string
    link?: string
    opening_method?: CMS_OPENING_METHOD.Enums
    link_id?: CMS_INTERNALPAGE.Enums
    did?: string
    cms_product_category_id?: number
    product_entrance_type?: number | string
    product_integration_id?: number | string
    style?: Record<string, any> // 每個元件獨立的樣式設定
    // 公告相關欄位
    announcement_type?: number // 公告類型
    display_options?: number[] // 顯示模式
    member_mode?: string // 顯示對象模式 ("true" 全部會員 / "false" 單一會員)
    show_member_ids?: number[] // 指定顯示會員 ID
    start_time?: string // 公告開始時間
    end_time?: string // 公告結束時間
    details?: Array<{
      lang: string
      title: string
      content: string
      image: string
      image_path?: string
      imageFileName?: string
      display_title?: string // 排行榜顯示標題
      tab_title?: string // 排行榜分頁標題
      tab_title_1?: string // 排行榜分頁標題 1
      tab_title_2?: string // 排行榜分頁標題 2
    }> // 多語系內容
    // 排行榜相關欄位
    tab_title?: string // 分頁標題
    display_title?: string // 顯示標題
    bet_amount_threshold?: number // 投注金額門檻
    currencies?: string[] // 幣種
    payout_amount_threshold?: number // 派彩金額門檻
    multiplier_threshold?: number // 中獎倍數門檻
    robot_enabled?: boolean // 機器人啟用
    image_display?: string[] // 圖片顯示設定 (player_avatar, game_image)
    pc_display_columns?: string[] // PC 版本顯示欄位
    h5_display_columns?: string[] // H5 版本顯示欄位
    payout_highlight_threshold?: number // 派獎金額高亮門檻
    multiplier_highlight_threshold?: number // 倍率高亮門檻
    // 導航欄相關欄位
    lang_titles?: Record<string, string> // 多語系標題
    icon?: string // 預設圖標
    iconFileName?: string // 圖標檔名
    selected_icon?: string // 選中圖標
    selectedIconFileName?: string // 選中圖標檔名
    display_login?: number // 登入前/後顯示 (0: 全部, 1: 登入前, 2: 登入後)
    link_type?: number // 連結類型
    currentLang?: string // 當前選中的語言標籤
  }
  lang: CmsLangTitle
  imgFileName?: string
  img: string
  img_path?: string
  img_base64?: string
  is_editable: boolean
  sort: number
}

export type CmsPageItem = {
  lang: LANGUAGE_TYPE.Enums
  title: string
  content: string
}

export type CmsForm = {
  id?: number
  type: CMS_TYPE.Enums
  url_id?: number
  title: string
  setting: CmsSettingItem
  entrance: CmsEntranceItem[]
  page: CmsPageItem[]
  is_editable: boolean
}

export type KycSettingLangItem = {
  code: LANGUAGE_TYPE.Enums
  title: string
  description: string
}

export type KycSetting = {
  id?: number | null
  display: boolean
  type: KYC_TYPE.Enums
  lang: KycSettingLangItem[]
}

export type PutPixelCodes = {
  pixel_codes: {
    type: PIXEL_CODE_TYPE.Enums
    content: string
    is_enabled: boolean
  }[]
}

export type PatchPixelCodes = {
  type: PIXEL_CODE_TYPE.Enums
  is_enabled: boolean
}

export type PutSiteVerification = {
  file_name: string
  storage_key: string
}

export type DeleteSiteVerification = {
  id: number
}

export type PutSettings = {
  // require_withdrawal_password: WITHDRAWAL_PASSWORD.Enums
  open_lobby_mode: OPEN_LOBBY_MODE.Enums
  customer_services: {
    [CUSTOMER_SERVICES.Enums.Unus]: {
      appID: string
      compID: string
      enable: boolean
    }
    [CUSTOMER_SERVICES.Enums.TextLiveChat]: {
      appID: string
      enable: boolean
    }
    [CUSTOMER_SERVICES.Enums.Tawk]: {
      appID: string
      compID: string
      enable: boolean
    }
  }
  kyc_setting: KycSetting[]
  wallet_type_list: BONUS_WALLET_TYPE.Enums[]
  wallet_type_order?: BONUS_WALLET_TYPE.Enums
  bet_limit?: Array<{ currency_id: number; limit: string }>
  bonus_wallet_transfer_rule?: BonusWalletTransferRule
  withdraw_kyc_verify: number
  max_pending_deposit: number
  slide_captcha_enabled: number
  register_otp?: number
  login_otp?: number
  freeround_wallet_type?: BONUS_WALLET_TYPE.Enums | null
  freeround_turnover_rate?: number
}

export type ProductManage = BaseRequest & {
  game_type: GAME_TYPE.Enums
  product_code: number
  keyword: string
  lan: string
}

export type webSiteLanguageSetting = BaseRequest & {
  client: {
    languages: CmsLangTitle[]
    default_language: LANGUAGE_TYPE.Enums
  }
  agent: {
    languages: CmsLangTitle[]
    default_language: LANGUAGE_TYPE.Enums
  }
}

export type webSiteRegSetting = BaseRequest & {
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
export type webSiteRegSettingRule = BaseRequest & {
  id: number
  column_rule: {
    enabled: boolean
    maxLength: number
    minLength: number
    requireNumber: boolean
    requireUpperLowerCase: boolean
    requireSpecialChar: boolean
  }
}

export type GetCollaborationDomain = BaseRequest & {
  member_id: number
  title: string
  offset: number
  size: number
}

export type AiKolCreateImg = {
  account: string
  language_code: string | number
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
}

export type BindAiMate = {
  email: string
  reseller_code: string
}

export type adMarketing = BaseRequest & {
  marketing_budget: number
  country: number
}

export type ShareholderProxyLevelItem = {
  level: number
  required_members: number | string
  rate: number | string
}

export type ShareholderCurrencySetting = {
  currency_id: number
  currency_code: string
  total_deposit: number | string
  total_valid_bet: number | string
  commission_cap: number | string
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
  rate_base: number
}

export type UpdateShareholderProxyItem = AddShareholderProxyItem & {
  id?: number
}

export type getShareholdersAccountSettings = BaseRequest & {
  account?: string
  member_id?: number
  tier?: number
  start_time?: string
  end_time?: string
  start?: number
  end?: number
  status?: string
}

export type GetShareholdersDetailList = BaseRequest & {
  memberAccount?: string
  currency?: string
  start: number
  end: number
}

export type GetShareholdersDetails = BaseRequest & {
  id?: number | string
  group_name?: string
  currency?: string
  event_id?: number
  entry_id?: number
  start: number
  end: number
}
export type ShareholdersCancell = BaseRequest & {
  id?: string
  currency_id?: string
  dispatch_type?: string
}

export type ShareholdersDistribution = BaseRequest & {
  id?: number
  event_id?: number | string
  entry_id?: number | string
  force?: boolean
}
export type GetShareholderNested = BaseRequest & {
  event_id?: number
  entry_id?: number
  start: number
  end: number
}

export type GetShareholderStatistics = {
  currency_id?: number
  game_type?: number
  valid_bet?: number | string
  prize_amount: number | string
  profit: number | string
}

export type GetAuroraOverviewReportList = BaseRequest & {
  auroraAdminAgentAccount: string
  start: number
  end: number
}

export type GetMemberAgentQuotaList = BaseRequest & {
  code: string
  account: string
  currency_id: number
  type: number
  start: number
  end: number
}

export type GetMemberAgentQuota = BaseRequest & {
  member_account: string
  currency_id: number
}

export type EditMemberAgentQuota = BaseRequest & {
  member_account: string
  currency_id: number
  type: number
  amount: number
}
export type GetReferralWheel = {
  date?: string
}

export type GetReferralWheelSpinCountLog = {
  member_account?: string
  action?: string
  referral_wheel_id?: string
  start_time?: string
  end_time?: string
}

export type PutReferralWheelMemberSpinCount = {
  spin_count: number
  referral_wheel_id: number
  remark: string
}

export type GetReferralWheelMember = {
  member_account?: string
  size?: string
  page?: string
}
export type GetAgentWagerGameHistory = BaseRequest & {
  code: string
  productCode: number
}

export type GetFreeRound = {
  begin_date?: number
  currency_id?: number
  end_date?: number
  game_code?: string
  member_account?: string
  offset?: number
  product_code?: string
  size?: number
  status?: number
}

export type GetFreeRoundGamesBetScales = {
  currency_id: number
  game_code: string
  product_code: number
  wallet_type: BONUS_WALLET_TYPE.Enums
}

export type AddFreeRound = {
  begin_date: string
  bet_per_line: string
  currency_id: number
  end_date: string
  game_code: string
  member_id: number
  product_code: number
  remark: string
  rounds: number
  total_bet_amount: string
  wallet_type: BONUS_WALLET_TYPE.Enums
}

export type CancelFreeRound = {
  bonus_code: string
  wallet_type: BONUS_WALLET_TYPE.Enums
}

export type getWarningList = BaseRequest & {
  id?: number
  setting_id?: number
  agent_id?: number
  currency_id?: number
  schedule_type?: number
  schedule_trigger_time?: string
  alert_interval_hour?: string
  alert_interval_min?: string
  lower_limit?: number | string
  upper_limit?: number | string
  notification_message?: string
  is_enabled?: boolean
  last_executed_at: undefined | string
  exclude_list: {
    setting_id: number
    member_id: number
    member_account: string
  }[]
}
export type getWarningDetail = BaseRequest & {
  id: number
  setting_id: number
  created_at?: string
  member_account?: string
  memberAccount?: string
  reason_type?: number
  status?: number
  start?: number | string
}

export type GetCryptoExchangeRateList = {
  offset: number
  size: number
}

export type SetCryptoExchangeRate = {
  crypto_id: number
  currency_id: number
  rate: string
  enabled: boolean
}

export type GetGatewaySetting = {
  /**
   * is crypto = true, currency_id = crypto_id
   */
  currency_id: number
  /**
   * is crypto = true, currency_id = crypto_id
   */
  is_crypto?: boolean
  /**
   * 1=存款, 2=出款
   */
  method_type: number
  /**
   * 2:三方支付, 6: 額外通道, 7:虛擬幣三方
   */
  type: number
}

export type GetGatewayMerchant = {
  /**
   * 金流類型, 1: 轉帳, 2: 三方, 3: 虛擬幣轉帳 7:虛擬幣三方
   */
  type?: number
}

export type GetGatewayConnection = {
  offset: number
  payment_gateway_name?: string
  size: number
  /**
   * 金流類型, 1: 轉帳, 2: 三方, 3: 虛擬幣轉帳, 7:虛擬幣三方
   */
  type?: number
}

export type GetGatewayConfig = {
  /**
   * 商戶名稱
   */
  payment_gateway_name?: string[]
}

export type PostGatewayConnection = {
  /**
   * 名稱
   */
  name: string
  /**
   * 根據 取得商戶欄位設定 呈現
   */
  payload: Record<string, any>
  /**
   * 金流商戶名稱
   */
  payment_gateway_name: string
  /**
   * 金流類型, 1: 轉帳, 2: 三方, 3: 虛擬幣轉帳, 6: 外部通道, 7:虛擬幣三方
   */
  type: number
}

export type GetGatewayConnectionByPaymentGatewayName = {
  /**
   * 金流商戶名稱
   */
  payment_gateway_name: string
  /**
   * 金流商戶渠道
   */
  payment_gateway_channel_code: string
}

export type PutGatewayConnection = {
  /**
   * 名稱
   */
  name: string
  /**
   * 金流商戶名稱
   */
  payment_gateway_name: string
  /**
   * 根據 取得商戶欄位設定 呈現
   */
  payload: Record<string, any>
  /**
   * 金流類型, 1: 轉帳, 2: 三方, 3: 虛擬幣轉帳, 6: 外部通道, 7:虛擬幣三方
   */
  type: number
}

export type DeleteGatewayConnection = {
  /**
   * 金流商戶渠道
   */
  payment_gateway_channel_code: string
  /**
   * 金流商戶名稱
   */
  payment_gateway_name: string
}

export type GetAIVoiceBotList = BaseRequest & {
  start: string
  end: string
  intent: number
  enable: boolean
}

export type DialOut = BaseRequest & {
  voice_type: string
  to_number: string
}

export type GetGscpBalance = {
  currency_id: number
}

// 利息寶
export type GetInterestActivityList = BaseRequest & {
  end_time?: string
  name?: StringLiteralLike
  title?: string
  start_time?: string
  start?: number | string
  end?: number | string
  status?: number
  is_auto_dispatch?: number
}

export type AddInterestActivityInfo = {
  /**
   * 圖片路徑
   */
  image?: string
  /**
   * 語系
   */
  lang?: string
  /**
   * 會員顯示名稱
   */
  title?: string
}

export type AddInterestActivityPlan = {
  /**
   * 存放天數
   */
  days: number
  /**
   * 利息
   */
  interest_rate: string
  /**
   * 額度(本金)
   */
  principal: string
}

export type AddInterestActivity = {
  /**
   * 稽核倍數
   */
  audit_rate: string
  currency_id: number | null
  /**
   * Y-m-d H:i:s
   */
  end_time: string
  info: AddInterestActivityInfo[]
  /**
   * 派發方式 1: 手動, 2: 自動
   */
  is_auto_dispatch: number
  /**
   * 利息上限
   */
  maximum_interest_limit: number
  /**
   * 活動名稱
   */
  name: string
  plans: AddInterestActivityPlan[]
  /**
   * Y-m-d H:i:s
   */
  start_time: string
}

export type UpdateInterestActivityInfo = {
  /**
   * 圖片路徑
   */
  image?: string
  /**
   * 語系
   */
  lang?: string
  /**
   * 會員顯示名稱
   */
  title?: string
}

export type UpdateInterestActivityPlan = {
  id: number
  interest_rate: string
}

export type UpdateInterestActivity = {
  /**
   * 稽核倍數
   */
  audit_rate: string
  info: UpdateInterestActivityInfo[]
  /**
   * 派發方式 0: 手動, 1: 自動
   */
  is_auto_dispatch: number
  /**
   * 利息上限
   */
  maximum_interest_limit: number
  /**
   * 活動名稱
   */
  name: string
  plans?: UpdateInterestActivityPlan[]
}

// 審核清單
export type GetInterestApplicationAuditing = BaseRequest & {
  currency_id?: string
  currency?: number
  /**
   * Y-m-d H:i:s
   */
  end_time?: string
  name?: string
  title?: string
  /**
   * Y-m-d H:i:s
   */
  start_time?: string
  start?: number | string
  end?: number | string
}

export type DispatchInterestApplication = {
  application_ids: number[]
}

export type RejectInterestApplication = {
  remark: string
}

// 利息寶紀錄
export type GetInterestApplicationRefunded = BaseRequest & {
  currency_id?: number
  currency?: number
  /**
   * Y-m-d H:i:s
   */
  end_time?: string
  name?: string
  title?: string
  /**
   * Y-m-d H:i:s
   */
  start_time?: string
  start?: number | string
  end?: number | string
}

export type PostInterestDescription = {
  description: string
  image_path: string
  lang: string
}[]
// ========== AI-KOL API Request Types ==========
export type CreateKOLRequest = {
  name: string
  nationality?: string
  locale?: string
  timezone?: string
  visual: {
    body_info: {
      height: number
      weight: number
      age: number
      gender: "female" | "male" | "non-binary"
    }
    body_description?: string[]
    clothing_styles?: string[]
    scenes_pref?: string[]
    poses_pref?: string[]
  }
  life: {
    traits?: string[]
    speech_style?: string[]
    catchphrases?: string[]
  }
  content_style: {
    caption_tones?: string[]
    photo_topics?: string[]
  }
  cadence?: {
    lambda_per_day?: number
    quiet_hours?: [number, number][]
  }
  hard_do_not?: {
    topics?: string[]
    words?: string[]
    guidelines?: string
  }
}

export type CreatePostRequest = {
  owner_key: string
  kol_id?: number
  kol_name?: string
  scene_override?: Record<string, unknown>
  caption_override?: Record<string, unknown>
  schedule_at?: string
  background?: {
    prompt?: string
    reference_image_url?: string
  }
  pose?: {
    prompt?: string
    reference_image_url?: string
  }
  clothing?: {
    prompt?: string
    reference_image_url?: string
  }
  facial_expression?: {
    prompt?: string
    reference_image_url?: string
  }
}

// ========== DNS API Request Types ==========
export type SaveDnsSettings = {
  // 儲存變更的請求體，根據實際需求定義
  [key: string]: any
}

export type ApplyDnsCert = {
  domain_list: string[]
}

// ========== Email API Request Types ==========
export interface GetEmailTemplate {
  /**
   * Template type (1: forgot password).
   */
  type: number
}

export interface PutEmailSmtpConfig {
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

export interface PutEmailTemplate {
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
