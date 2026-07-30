import type * as CONSTANTS from "@/utils/constants"

// Custom Field Configuration
export type ICustomFieldConfig = {
  type: "input" | "select" | "checkbox"
  key: string
  label?: string
  placeholder?: string
  options?: Array<{ label: string; value: any }>
  rules?: Array<(val: any) => string | boolean>
  clearable?: boolean
  width?: string
  defaultValue?: any
}

export type IQueryConfig = {
  /** 自定義查詢欄位 */
  customFields?: ICustomFieldConfig[]

  /** 每個篩選器的class，便於設定欲佔的尺寸 (預設為: "col-12 col-sm-3 col-md-3 col-lg-2") */
  everyColumnsClass?: string

  /** 首次進入業麵食使否顯示filter */
  filterShowOnLoaded?: boolean

  /** 首次進入頁面時是否自動查詢一次 */
  submitOnLoaded?: boolean

  /** 相同篩選條件是否允許重複送出 */
  allowSameSubmit?: boolean

  /** 是否啟用「重設」按鈕 */
  useReset?: boolean

  /** 是否啟用「查詢」按鈕 */
  useSubmit?: boolean

  /** 是否啟用「匯出」按鈕 */
  useExport?: boolean

  /** 是否啟用「頁碼」 */
  usePagination?: boolean

  /** 時間快選按鈕清單 */
  dateTimeQuickSelectors?: CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums[]

  /** 是否啟用「日期選擇器」 */
  useDatePicker?: boolean

  /**
   * 「日期、時間」是否非必填
   *
   * true: 非必填
   * false: 必填
   */
  dateTimeIsUnnecessary?: boolean

  /** 是否啟用「時間選擇器」 */
  useTimePicker?: boolean

  /** 是否啟用「時間選擇器」 */
  useTimePicker2?: boolean

  /** 初始的時間區間天數間隔(0:代表當天) */
  initialDateRange?: number

  /*日期選擇限制區間*/
  dateRangeLimit?: number

  /** 日期時間選擇器的 label 名稱(i18n key) */
  customDateTimeLabelI18nKey?: string

  /** 日期時間選擇器的 label 名稱(i18n key) */
  customDateTimeLabelI18nKey2?: string

  /** 是否啟用「會員帳號」 */
  useMemberAccount?: boolean

  /** 「會員帳號」的規則 */
  useMemberAccountRules?: Array<(val: string) => string | boolean>

  /** 是否啟用「IP」 */
  useIp?: boolean

  /** 是否啟用「總代帳號」 */
  useGeneralAgentAccount?: boolean

  /** 是否啟用「狀態」 */
  useEnableStatus?: boolean

  /** 是否啟用「存款方式」 */
  useDepositStatus?: boolean

  /** 是否啟用「取款方式」 */
  useWithdrawStatus?: boolean

  /** 是否啟用「凍結狀態」 */
  useFrozenStatus?: boolean

  /** 是否啟用「推薦人」 */
  useRecommender?: boolean

  /** 是否啟用「會員標籤」 */
  useMemberTag?: boolean

  /** 是否啟用「排除會員標籤」 */
  useExcludeMemberTag?: boolean

  /** 是否啟用「會員標籤類型」 */
  useMemberTagType?: boolean

  /** 是否啟用「Email」 */
  useEmail?: boolean

  /** 是否啟用「出款帳號」 */
  usePayoutIdentity?: boolean

  /** 是否啟用「會員層級」 */
  useMemberLevel?: boolean

  /** 是否啟用「排除會員層級」 */
  useExcludeMemberLevel?: boolean

  /** 是否啟用「排除推薦人」 */
  useExcludeRecommender?: boolean

  /** 是否啟用「存款編號」 */
  useDepositNumber?: boolean

  /** 是否啟用「取款編號」 */
  useWithdrawNumber?: boolean

  /** 支付商編號 */
  useRefTransCode?: boolean

  /** 是否啟用「幣別」 */
  useCurrency?: boolean

  /** 是否啟用「產品」 */
  useProduct?: boolean

  /** 是否啟用「產品類型」 */
  useGameType?: boolean

  /** 是否啟用「產品」 */
  useGameCode?: boolean

  /** 是否啟用連動「產品、遊戲名稱」 */
  useGameCodeName?: boolean

  /** 是否啟用「日期類型」 */
  useDateType?: boolean

  /** 是否啟用複選「日期類型」 */
  useMultiDateType?: boolean

  /** 是否啟用複選「日期類型」 */
  useMultiBetReportDateType?: boolean

  /** 是否啟用「調整類型」 */
  useQuotaType?: boolean

  /** 是否啟用「單號」 */
  useOrderNumber?: boolean

  /** 是否啟用「異動原因」 */
  useQuotaModifyReason?: boolean

  /** 是否啟用「名稱」 */
  useName?: boolean

  /** 是否啟用「手機」 */
  usePhone?: boolean

  /** 是否啟用「權限等級」 */
  usePermissionLevel?: boolean

  /** 是否啟用「頁面」 */
  usePagelog?: boolean

  /** 是否啟用「關鍵字」 */
  useKeyword?: boolean

  /** 是否啟用「帳號狀態」 */
  useAccountStatus?: boolean

  /** 是否啟用「總代名稱」 */
  useMasterAgentName?: boolean

  /** 是否啟用「總代」 */
  useGeneralAgent?: boolean

  /** 是否啟用「代理」 */
  useAgent?: boolean

  /** 是否啟用「代理ID」 */
  useAgentId?: boolean

  /** 是否啟用「代理帳號」 */

  useAgentAccountInput?: boolean

  /** 是否啟用「前端狀態」 */
  useFrontendStatus?: boolean

  /** 是否啟用「代理端狀態」 */
  useAgentStatus?: boolean

  /** 是否啟用「遊戲名稱」 */
  useGameName?: boolean

  /** 是否啟用「活動名稱」 */
  useEventName?: boolean

  /** 是否啟用「活動類型」 */
  useEventType?: boolean

  /** 是否啟用「派發狀態」 */
  useDistributionStatus?: boolean

  /** 是否啟用「派發方式」(自動/手動) */
  useSendType?: boolean

  /** 是否啟用「佣金群組」 */
  useCommissionGroup?: boolean

  /** 是否啟用「派發方式」 */
  useRewardType?: boolean

  /** 是否啟用「偵查類型」 */
  useMonitoringType?: boolean

  /** 是否啟用「帳變類型」 */
  useAccountFlowType?: boolean

  /** 是否啟用「交易編號」 */
  useTransactionNumber?: boolean

  /** 是否啟用「站點營運」 */
  useSiteOperationType?: boolean

  /** 是否啟用「代理名稱」 */
  useAgentName?: boolean

  /** 是否啟用「支付商名稱」 */
  usePayerName?: boolean

  /** 是否啟用「金流類型」 */
  useFundMethod?: boolean

  /** 是否啟用「服務」 */
  useService?: boolean

  /** 是否啟用「代理」 */
  useAgentAccount?: boolean

  /** 是否啟用「總代」 */
  useAdminAgentAccount?: boolean

  /** 是否啟用「Aurora 總代」 */
  useAuroraAdminAgentAccount?: boolean

  /** 是否啟用「傭金名稱」 */
  useCommissionName?: boolean

  /** 是否啟用「支付類型」 */
  usePaymentType?: boolean

  /** 是否啟用「存入狀態」 */
  useSaveStatus?: boolean

  /** 是否啟用「首存」 */
  useFirstDeposit?: boolean

  /** 是否啟用「存款時層級」 */
  useTierWhenDepositing?: boolean

  /** 是否啟用「支付商」 */
  usePayer?: boolean

  /** 是否啟用「操作人」 */
  useOperator?: boolean

  /** 是否啟用「出款編號」 */
  useWithdrawalNumber?: boolean

  /** 是否啟用「出款時層級」 */
  useTierWhenWithdrawal?: boolean

  /** 是否啟用「注單編號」 */
  useBetNumber?: boolean

  /**公告類型 */
  useAnnouncementType?: boolean

  /**文檔類型 */
  useDocumentType?: boolean

  /**顯示對象**/
  useDisplayObjectType?: boolean

  /**交易動作**/
  useTradingActionType?: boolean

  /**群組名稱**/
  useGroupName?: boolean

  /**禮金類別**/
  useGiftType?: boolean

  /**禮金名稱**/
  useGiftName?: boolean

  /*帳號*/
  useUsername?: boolean

  /*啟用show/hide*/
  useVisibleBtn?: boolean

  /*啟用帳號*/
  useAccount?: boolean

  /*啟用異動後層級*/
  useMemberLevelAfterChange?: boolean

  /*錢包類型*/
  useWalletType?: boolean

  /*啟用帳號停用 SelfExclude */
  useSelfExclusionStatus?: boolean

  /*啟用合營網域名稱 */
  useCollaborationDomain?: boolean

  /*啟用佣金計算模式 */
  useCalculateType?: boolean

  /*啟用代理返水計算模式 */
  useAgentCommissionCalculationType?: boolean

  /*啟用可否投注 */
  useBettingStatus?: boolean

  /*啟用活動結算狀態 */
  useProgressStatus?: boolean

  /** 是否啟用股東帳號 */
  useShareholderAccount?: boolean

  /** 是否啟用股東級數 */
  useShareholderLevel?: boolean

  /** 是否啟用集成名稱 */
  useIntegration?: boolean

  /** 是否啟用產品代碼 */
  useProductCode?: boolean

  /** 是否啟用遊戲名稱 */
  useProductGameName?: boolean

  /** 是否啟用遊戲代碼 */
  useProductGameCode?: boolean

  /** 是否啟用產品名稱 */
  useProductNames?: boolean

  /** 是否啟用集成開關狀態 */
  useIntegrationStatus?: boolean

  /** 是否啟用產品開關狀態 */
  useProductStatus?: boolean

  /** 是否啟用產品類別 */
  useGameTypeV2?: boolean

  /** 是否啟用產品 */
  useProductCodeV2?: boolean

  /** 是否啟用「免費旋轉狀態」 */
  useFreeRoundStatus?: boolean

  /** 是否啟用「免費旋轉產品」 */
  useFreeRoundProduct?: boolean

  /** 是否啟用「免費旋轉遊戲」 */
  useFreeRoundGame?: boolean

  /** 是否啟用「派獎類型」 */
  usePrizeType?: boolean

  /** 是否啟用「告警狀態」 */
  useWarningStatus?: boolean

  /** 是否啟用「告警類別」 */
  useWarningType?: boolean

  /**總代產品*/
  useAgentGameCode?: boolean
  /*啟用意象標籤 */
  useIntent?: boolean

  [key: string]:
    | boolean
    | string
    | string[]
    | undefined
    | number
    | Array<(val: string) => string | boolean>
    | CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums[]
    | ICustomFieldConfig[]
}

export type IQueryParams = {
  sort: string
  sort_by: CONSTANTS.SORT_BY.Enums
  ip?: string
  productName?: string
  gameType?: string
  dateType?: number
  multiDateType?: number[]
  memberAccount?: string
  generalAgentAccount?: string
  status?: CONSTANTS.STATUS.Enums
  depositStatus?: CONSTANTS.DEPOSIT_STATUS.Enums
  withdrawStatus?: CONSTANTS.WITHDRAW_STATUS.Enums
  accountFlowType?: CONSTANTS.ACCOUNT_FLOW_TYPE.Enums
  frozenStatus?: CONSTANTS.FROZEN_STATUS.Enums
  recommender?: string
  exclude_parent_ids?: number[]
  memberTag?: number
  excludeMemberTag?: number
  memberTagType?: number
  email?: string
  memberLevel?: number
  excludeMemberLevel?: number
  depositNumber?: string
  withdrawNumber?: string
  refTransCode?: string
  start?: number
  end?: number
  types?: number[]
  currency?: number
  quotaType?: CONSTANTS.QUOTA_TYPE.Enums
  orderNumber?: string
  quotaModifyReason?: CONSTANTS.QUOTA_MODIFY_REASON.Enums
  name?: string
  phone?: string
  permissionLevel?: number
  pageLog?: CONSTANTS.PAGE_LOG.Enums
  keyword?: string
  stopOrEnable?: number
  accountStatus?: string
  masterAgentName?: string
  generalAgent?: string
  agentAccount?: string
  frontendStatus?: number
  agentStatus?: number
  product?: string
  gameCode?: number
  gameName?: string[]
  eventName?: string
  eventType?: CONSTANTS.EVENT_TYPE.Enums
  distributionStatus?: CONSTANTS.DISTRIBUTION_STATUS.Enums
  dispatch_type?: CONSTANTS.SEND_TYPE.Enums
  monitoringType?: string
  rewardType?: number
  transactionNumber?: string
  siteOperation?: number
  agentName?: string
  payerName?: string
  fundMethod?: number
  service?: number
  agents?: number
  commissionName?: string
  paymentYype?: number
  saveStatus?: number
  firstDeposit?: number
  tierWhenDepositing?: number
  payer?: number
  operator?: number
  withdrawalNumber?: string
  tierWhenWithdrawal?: number
  account?: string
  betNumber?: string
  commissionGroup?: number
  announcementType?: CONSTANTS.ANNOUNCEMENT_TYPE.Enums
  documentType?: CONSTANTS.DOCUMENTDOWNLOAD_TYPE.Enums
  displayObjectType?: CONSTANTS.DISPLAY_OBJECT_TYPE.Enums
  tradingActionType?: CONSTANTS.TRADING_ACTION_TYPE.Enums
  giftType?: CONSTANTS.GIFT_TYPE.Enums
  giftName?: string
  receiveStatus?: CONSTANTS.RECEIVE_STATUS.Enums
  walletType?: number
  selfExclusionStatus?: CONSTANTS.SELF_EXCLUSION_STATUS.Enums
  collaborationDomain?: string
  calculation_type?: number
  bettingStatus?: CONSTANTS.STATUS.Enums
  progressStatus?: number
  shareholderAccount?: string
  shareholderLevel?: number
  integration?: number
  productCode?: string
  productGameName?: string
  productGameCode?: string
  gameTypeV2?: string
  productCodeV2?: number
  freeRoundStatus?: number
  prizeType?: number
  warningStatus?: number
  warningType?: number
  intent?: CONSTANTS.INTENT.Enums
  [key: string]:
    | string
    | string[]
    | boolean
    | number
    | CONSTANTS.SORT_BY.Enums
    | CONSTANTS.DATE_TYPE.Enums[]
    | CONSTANTS.STATUS.Enums
    | CONSTANTS.EVENT_TYPE.Enums
    | CONSTANTS.DEPOSIT_STATUS.Enums
    | CONSTANTS.WITHDRAW_STATUS.Enums
    | CONSTANTS.ACCOUNT_FLOW_TYPE.Enums
    | CONSTANTS.FROZEN_STATUS.Enums
    | CONSTANTS.QUOTA_TYPE.Enums
    | CONSTANTS.QUOTA_MODIFY_REASON.Enums
    | CONSTANTS.PAGE_LOG.Enums
    | CONSTANTS.EVENT_TYPE.Enums
    | CONSTANTS.DISTRIBUTION_STATUS.Enums
    | CONSTANTS.ANNOUNCEMENT_TYPE.Enums
    | CONSTANTS.DOCUMENTDOWNLOAD_TYPE.Enums
    | CONSTANTS.DISPLAY_OBJECT_TYPE.Enums
    | CONSTANTS.TRADING_ACTION_TYPE.Enums
    | CONSTANTS.GIFT_TYPE.Enums
    | CONSTANTS.RECEIVE_STATUS.Enums
    | CONSTANTS.SELF_EXCLUSION_STATUS.Enums
    | undefined
}
