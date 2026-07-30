export const enum Enums {
  /*首頁*/

  A_M_HOME_MANAGEMENT = 3300000,

  A_F_HOME_SETTING = 3300100,
  A_A_HOME_SETTING_VIEW = 3300101,

  A_F_CHECKSUM_VERIFICATION = 3300200,
  A_A_CHECKSUM_VERIFICATION_VIEW = 3300201,

  /** 帳號管理 */
  S_M_ACCOUNT_MANAGEMENT = 1010000,
  M_M_ACCOUNT_MANAGEMENT = 2010000,
  A_M_ACCOUNT_MANAGEMENT = 3500000,

  /** 管理者帳號管理 */
  S_F_BACKOFFICE_ACCOUNT = 1010100,
  M_F_BACKOFFICE_ACCOUNT = 2010100,
  A_F_BACKOFFICE_ACCOUNT = 3500100,

  /** 管理者帳號管理_VIEW */
  S_A_BACKOFFICE_ACCOUNT_VIEW = 1010101,
  M_A_BACKOFFICE_ACCOUNT_VIEW = 2010101,
  A_A_BACKOFFICE_ACCOUNT_VIEW = 3500101,

  /** 管理者帳號管理_EDIT */
  S_A_BACKOFFICE_ACCOUNT_EDIT = 1010102,
  M_A_BACKOFFICE_ACCOUNT_EDIT = 2010102,
  A_A_BACKOFFICE_ACCOUNT_EDIT = 3500102,

  /** 權限設定 */
  S_F_PERMISSION_SETTING = 1010200,
  M_F_PERMISSION_SETTING = 2010200,
  A_F_PERMISSION_SETTING = 3500200,

  /** 權限設定_VIEW */
  S_A_PERMISSION_SETTING_VIEW = 1010201,
  M_A_PERMISSION_SETTING_VIEW = 2010201,
  A_A_PERMISSION_SETTING_VIEW = 3500201,

  /** 權限設定_EDIT */
  S_A_PERMISSION_SETTING_EDIT = 1010202,
  M_A_PERMISSION_SETTING_EDIT = 2010202,
  A_A_PERMISSION_SETTING_EDIT = 3500202,

  /** 操作紀錄 */
  S_F_USER_ACTION_LOG = 1010300,
  M_F_USER_ACTION_LOG = 2010300,
  A_F_USER_ACTION_LOG = 3450300,

  /** 操作紀錄_VIEW */
  S_A_USER_ACTION_LOG_VIEW = 1010301,
  M_A_USER_ACTION_LOG_VIEW = 2010301,
  A_A_USER_ACTION_LOG_VIEW = 3450301,

  /** 操作紀錄_EDIT */
  S_A_USER_ACTION_LOG_EDIT = 1010302,
  M_A_USER_ACTION_LOG_EDIT = 2010302,
  A_A_USER_ACTION_LOG_EDIT = 3450302,

  /** 會員管理 */
  A_M_MEMBER_MANAGEMENT = 3340000,

  /** 會員列表 */
  A_F_MEMBER_LIST = 3340300,
  A_A_MEMBER_LIST_VIEW = 3340301,
  A_A_MEMBER_LIST_EDIT = 3340302,

  /** 會員層級 */
  A_F_MEMBER_LEVEL = 3340400,
  A_A_MEMBER_LEVEL_VIEW = 3340401,
  A_A_MEMBER_LEVEL_EDIT = 3340402,

  /** 會員額度調整 */
  A_F_MEMBER_QUOTA = 3340500,
  A_A_MEMBER_QUOTA_VIEW = 3340501,
  A_A_MEMBER_QUOTA_EDIT = 3340502,

  /** 會員標籤管理 */
  A_F_MEMBER_TAGS = 3340100,
  A_A_MEMBER_TAGS_VIEW = 3340101,
  A_A_MEMBER_TAGS_EDIT = 3340102,

  /** 會員KYC管理 */
  A_F_MEMBER_KYC = 3340600,
  A_A_MEMBER_KYC_VIEW = 3340601,
  A_A_MEMBER_KYC_EDIT = 3340602,
  A_A_MEMBER_KYC_UNLOCK = 3340603,

  /** Member audit adjustment */
  A_F_MEMBER_AUDIT_ADJUSTMENT = 3340700,
  A_A_MEMBER_AUDIT_ADJUSTMENT_VIEW = 3340701,
  A_A_MEMBER_AUDIT_ADJUSTMENT_EDIT = 3340702,

  /** 禮金明細 */
  A_M_GIFT = 3430000,
  A_F_GIFT_DETAIL = 3430100,
  A_A_GIFT_DETAIL_VIEW = 3430101,
  A_A_GIFT_DETAIL_EDIT = 3430102,

  /** 出入款審核 */
  A_M_TRANSACTION_MANAGEMENT = 3320000,

  /** 會員存款 */
  A_F_DEPOSIT_VERIFY = 3320100,
  A_A_DEPOSIT_VERIFY_VIEW = 3320101,
  A_A_DEPOSIT_VERIFY_EDIT = 3320102,

  /** 會員出款 */
  A_F_WITHDRAWAL_VERIFY = 3320200,
  A_A_WITHDRAWAL_VERIFY_VIEW = 3320201,
  A_A_WITHDRAWAL_VERIFY_EDIT = 3320202,

  /** 佣金管理 */
  A_M_REBATE_MANAGEMENT = 3440000,

  /** 佣金設定 */
  A_F_REBATE_SETUP = 3440100,
  A_A_REBATE_SETUP_VIEW = 3440101,
  A_A_REBATE_SETUP_EDIT = 3440102,

  /** 佣金明細 */
  A_F_REBATE_DETAIL = 3440200,
  A_A_REBATE_DETAIL_VIEW = 3440201,
  A_A_REBATE_DETAIL_EDIT = 3440202,

  /** 優惠管理 */
  A_M_PROMOTION_MANAGEMENT = 3390000,

  /** 優惠設定 */
  A_F_PROMOTION_SETTINGS = 3390100,
  A_A_PROMOTION_SETTINGS_VIEW = 3390101,
  A_A_PROMOTION_SETTINGS_EDIT = 3390102,

  /** 優惠審核 */
  A_F_PROMOTION_VERIFY = 3390200,
  A_A_PROMOTION_VERIFY_VIEW = 3390201,
  A_A_PROMOTION_VERIFY_EDIT = 3390202,

  /** 會員代理 */
  A_M_AFFILIATE_MANAGEMENT = 3350000,

  /** 代理佣金設定 */
  A_F_AFFILIATE_SETUP = 3350100,
  A_A_AFFILIATE_SETUP_VIEW = 3350101,
  A_A_AFFILIATE_SETUP_EDIT = 3350102,

  /** 代理佣金明細 */
  A_F_AFFILIATE_DETAIL = 3350200,
  A_A_AFFILIATE_DETAIL_VIEW = 3350201,
  A_A_AFFILIATE_DETAIL_EDIT = 3350202,

  /** 代理佣金報表 */
  A_F_AFFILIATE_REPORT = 3350300,
  A_A_AFFILIATE_REPORT_VIEW = 3350301,
  A_A_AFFILIATE_REPORT_EDIT = 3350302,

  /** 系統設定 */
  M_M_SYSTEM_MANAGEMENT = 2090000,
  A_M_SYSTEM_MANAGEMENT = 3510000,

  /** 語系設定 */
  M_F_LOCALIZATION_SETTINGS = 2090100,
  M_A_LOCALIZATION_SETTINGS_VIEW = 2090101,
  M_A_LOCALIZATION_SETTINGS_EDIT = 2090102,
  A_F_LOCALIZATION_SETTINGS = 3520100,
  A_A_LOCALIZATION_SETTINGS_VIEW = 3520101,
  A_A_LOCALIZATION_SETTINGS_EDIT = 3520102,

  /** IP白名單設定 */
  M_F_IP_WHITELIST_SETTINGS = 2090200,
  M_A_IP_WHITELIST_SETTINGS_VIEW = 2090201,
  M_A_IP_WHITELIST_SETTINGS_EDIT = 2090202,
  A_F_IP_WHITELIST_SETTINGS = 3500300,
  A_A_IP_WHITELIST_SETTINGS_VIEW = 3500301,
  A_A_IP_WHITELIST_SETTINGS_EDIT = 3500302,

  /** 備註設置 */
  A_F_NOTE_SETTINGS = 3520200,
  A_A_NOTE_SETTINGS_VIEW = 3520201,
  A_A_NOTE_SETTINGS_EDIT = 3520202,

  /** 版型設定 */
  A_F_TEMPLATE_SETTINGS = 3470700,
  A_A_TEMPLATE_SETTINGS_VIEW = 3470701,
  A_A_TEMPLATE_SETTINGS_EDIT = 3470702,

  /** 網站設置 */
  A_M_WEBSITE_MANAGEMENT = 3520000,

  /**版面設定 */
  A_M_LAYOUT_SETTINGS = 3470000,

  /** Banner設置 */
  A_F_BANNER_SETTINGS = 3470100,
  A_A_BANNER_SETTINGS_VIEW = 3470101,
  A_A_BANNER_SETTINGS_EDIT = 3470102,

  /** 產品入口圖設置 */
  A_F_PRODUCT_ENTRANCE_SETTINGS = 3470300,
  A_A_PRODUCT_ENTRANCE_SETTINGS_VIEW = 3470301,
  A_A_PRODUCT_ENTRANCE_SETTINGS_EDIT = 3470302,

  /** 網站設定 */
  A_F_WEB_SETTINGS = 3520300,
  A_A_WEB_SETTINGS_VIEW = 3520301,
  A_A_WEB_SETTINGS_EDIT = 3520302,

  /** 網站圖片設定 */
  A_F_WEBIMAGE_SETTINGS = 3520400,
  A_A_WEBIMAGE_SETTINGS_VIEW = 3520401,
  A_A_WEBIMAGE_SETTINGS_EDIT = 3520402,

  /** CMS設定 */
  A_F_CMS_SETTINGS = 3470200,
  A_A_CMS_SETTINGS_VIEW = 3470201,
  A_A_CMS_SETTINGS_EDIT = 3470202,

  /** seo相關設定 */
  A_M_WEBSITE_ANALYTICS_MANAGEMENT = 3520500,
  A_M_WEBSITE_ANALYTICS_VIEW = 3520501,
  A_M_WEBSITE_ANALYTICS_EDIT = 3520502,

  /** DNS設定 */
  A_F_DNS_SETTING = 3520600,
  A_A_DNS_SETTING_VIEW = 3520601,
  A_A_DNS_SETTING_EDIT = 3520602,

  /** 產品熱門遊戲排序 */
  A_F_POPULAR_GAME_SORT = 3470400,
  A_A_POPULAR_GAME_SORT_VIEW = 3470401,
  A_A_POPULAR_GAME_SORT_EDIT = 3470402,

  /** 首頁熱門SLOTS設置 */
  A_F_HOME_POP_SLOT_SETTINGS = 3470500,
  A_A_HOME_POP_SLOT_SETTINGS_VIEW = 3470501,
  A_A_HOME_POP_SLOT_SETTINGS_EDIT = 3470502,

  /** 首頁動態列設置 */
  A_F_HOME_DYNAMIC_PANEL_SETTINGS = 3470600,
  A_A_HOME_DYNAMIC_PANEL_SETTINGS_VIEW = 3470601,
  A_A_HOME_DYNAMIC_PANEL_SETTINGS_EDIT = 3470602,

  /** 產品管理 */
  S_M_PRODUCT_MANAGEMENT = 1070000,
  M_M_PRODUCT_MANAGEMENT = 2070000,
  A_M_PRODUCT_MANAGEMENT = 3490000,

  /** 產品開關 */
  S_F_PRODUCT_SWITCH = 1070100,
  S_A_PRODUCT_SWITCH_VIEW = 1070101,
  S_A_PRODUCT_SWITCH_EDIT = 1070102,
  M_F_PRODUCT_SWITCH = 2070100,
  M_A_PRODUCT_SWITCH_VIEW = 2070101,
  M_A_PRODUCT_SWITCH_EDIT = 2070102,
  A_F_PRODUCT_SWITCH = 3490100,
  A_A_PRODUCT_SWITCH_VIEW = 3490101,
  A_A_PRODUCT_SWITCH_EDIT = 3490102,

  /** 遊戲入口設置 */
  S_F_GAME_ENTRANCE_SETTINGS = 1070200,
  S_A_GAME_ENTRANCE_SETTINGS_VIEW = 1070201,
  S_A_GAME_ENTRANCE_SETTINGS_EDIT = 1070202,
  A_F_GAME_ENTRANCE_SETTINGS = 3490200,
  A_A_GAME_ENTRANCE_SETTINGS_VIEW = 3490201,
  A_A_GAME_ENTRANCE_SETTINGS_EDIT = 3490202,

  /** 排序設置 */
  A_F_GAME_ENTRANCE_SORTS = 3490300,
  A_A_GAME_ENTRANCE_SORTS_VIEW = 3490301,
  A_A_GAME_ENTRANCE_SORTS_EDIT = 3490302,

  /** 產品維護設置 */
  S_F_PRODUCT_MAINTENANCE_SETTINGS = 1070300,
  S_A_PRODUCT_MAINTENANCE_SETTINGS_VIEW = 1070301,
  S_A_PRODUCT_MAINTENANCE_SETTINGS_EDIT = 1070302,

  /** 總代管理 */
  S_M_MASTER_MANAGEMENT = 1060000,
  S_F_MASTER_MANAGEMENT = 1060100,
  S_A_MASTER_MANAGEMENT_VIEW = 1060101,
  S_A_MASTER_MANAGEMENT_EDIT = 1060102,

  /** 代理管理 */
  S_M_AGENT_MANAGEMENT = 1020000,
  M_M_AGENT_MANAGEMENT = 2020000,

  /** 代理營運管理 */
  S_F_AGENCY_OPERATIONS_MANAGEMENT = 1020100,
  S_A_AGENCY_OPERATIONS_MANAGEMENT_VIEW = 1020101,
  S_A_AGENCY_OPERATIONS_MANAGEMENT_EDIT = 1020102,

  /** 代理管理 */
  M_F_AGENCY_MANAGEMENT = 2020100,
  M_A_AGENCY_MANAGEMENT_VIEW = 2020101,
  M_A_AGENCY_MANAGEMENT_EDIT = 2020102,

  /** 金流管理 */
  S_M_PAYMENT_MANAGEMENT = 1080000,
  M_M_PAYMENT_MANAGEMENT = 2080000,
  A_M_PAYMENT_MANAGEMENT = 3330000,

  A_F_GATEWAY_CONNECTION = 3330300, // Function 金流商戶管理
  A_A_GATEWAY_CONNECTION_VIEW = 3330301, // Action 金流商戶管理_VIEW
  A_A_GATEWAY_CONNECTION_EDIT = 3330302, // Action 金流商戶管理_EDIT
  A_F_CRYPTO_EXCHANGE_SETTING = 3330400, // Function 虛擬貨幣出款匯率設定
  A_A_CRYPTO_EXCHANGE_SETTING_VIEW = 3330401, // Action 虛擬貨幣出款匯率設定_VIEW
  A_A_CRYPTO_EXCHANGE_SETTING_EDIT = 3330402, // Action 虛擬貨幣出款匯率設定_EDIT
  A_F_PAYMENT_TYPE_SETTING = 3330500, // Function 支付類型管理
  A_A_PAYMENT_TYPE_SETTING_VIEW = 3330501, // Action 支付類型管理_VIEW
  A_A_PAYMENT_TYPE_SETTING_EDIT = 3330502, // Action 支付類型管理_EDIT
  A_F_PAYMENT_QUICK_AMOUNT_SETTING = 3330700, // Function 快選金額設定
  A_A_PAYMENT_QUICK_AMOUNT_SETTING_VIEW = 3330701, // Action 快選金額設定_VIEW
  A_A_PAYMENT_QUICK_AMOUNT_SETTING_EDIT = 3330702, // Action 快選金額設定_EDIT

  /** 金流功能 */
  S_F_CASH_FLOW = 1080100,
  S_A_CASH_FLOW_VIEW = 1080101,
  S_A_CASH_FLOW_EDIT = 1080102,
  M_F_CASH_FLOW = 2080100,
  M_A_CASH_FLOW_VIEW = 2080101,
  M_A_CASH_FLOW_EDIT = 2080102,
  A_F_CASH_FLOW = 3330100,
  A_A_CASH_FLOW_VIEW = 3330101,
  A_A_CASH_FLOW_EDIT = 3330102,

  /** 會員出款風控 */
  A_F_WITHDRAWAL_RISK = 3330200,
  A_A_WITHDRAWAL_RISK_VIEW = 3330201,
  A_A_WITHDRAWAL_RISK_EDIT = 3330202,

  /** 公告管理 */
  S_M_ANNOUCEMENT_MANAGEMENT = 1030000,
  M_M_ANNOUCEMENT_MANAGEMENT = 2030000,

  /** 公告管理功能 */
  S_F_ANNOUCEMENT_MANAGEMENT = 1030100,
  S_A_ANNOUCEMENT_MANAGEMENT_VIEW = 1030101,
  S_A_ANNOUCEMENT_MANAGEMENT_EDIT = 1030102,

  /** 最新公告功能 */
  M_F_NEWEST_ANNOUCEMENT = 2030100,
  M_A_NEWEST_ANNOUCEMENT_VIEW = 2030101,
  M_A_NEWEST_ANNOUCEMENT_EDIT = 2030102,

  /** Cache管理(一鍵清緩存功能) */
  S_M_CACHE_MANAGEMENT = 1100000,
  S_F_CACHE_MANAGEMENT = 1100100,
  S_A_CACHE_MANAGEMENT_VIEW = 1100101,
  S_A_CACHE_MANAGEMENT_EDIT = 1100102,

  /** 清理緩存 (代理端) */
  A_M_CACHE_MANAGEMENT_NEW = 3580000,
  A_F_CACHE_MANAGEMENT_NEW = 3580100,
  A_A_CACHE_MANAGEMENT_VIEW_NEW = 3580101,
  A_A_CACHE_MANAGEMENT_EDIT_NEW = 3580102,

  /**歷史紀錄 */
  A_M_HISTORY_MANAGEMENT = 3450000,

  /** 統計報表 */
  S_M_STATISTIC_REPORT = 1040000,
  M_M_STATISTIC_REPORT = 2040000,
  A_M_STATISTIC_REPORT = 3460000,

  /** 現金報表功能 */
  S_F_CASH_REPORT = 1040100,
  S_A_CASH_REPORT_VIEW = 1040101,
  S_A_CASH_REPORT_EDIT = 1040102,
  S_A_CASH_REPORT_EXPORT = 1040103,
  M_F_CASH_REPORT = 2040100,
  M_A_CASH_REPORT_VIEW = 2040101,
  M_A_CASH_REPORT_EDIT = 2040102,
  M_A_CASH_REPORT_EXPORT = 2040103,
  A_F_CASH_REPORT = 3460300,
  A_A_CASH_REPORT_VIEW = 3460301,
  A_A_CASH_REPORT_EDIT = 3460302,
  A_A_CASH_REPORT_EXPORT = 3460303,

  /** 產品投注報表功能 */
  S_F_PRODUCT_BET_REPORT = 1040200,
  S_A_PRODUCT_BET_REPORT_VIEW = 1040201,
  S_A_PRODUCT_BET_REPORT_EDIT = 1040202,
  S_A_PRODUCT_BET_REPORT_EXPORT = 1040203,
  M_F_PRODUCT_BET_REPORT = 2040200,
  M_A_PRODUCT_BET_REPORT_VIEW = 2040201,
  M_A_PRODUCT_BET_REPORT_EDIT = 2040202,
  M_A_PRODUCT_BET_REPORT_EXPORT = 2040203,
  A_F_PRODUCT_BET_REPORT = 3460600,
  A_A_PRODUCT_BET_REPORT_VIEW = 3460601,
  A_A_PRODUCT_BET_REPORT_EDIT = 3460602,
  A_A_PRODUCT_BET_REPORT_EXPORT = 3460603,

  /** 總代投注報表功能 */
  S_F_MASTER_BET_REPORT = 1040300,
  S_A_MASTER_BET_REPORT_VIEW = 1040301,
  S_A_MASTER_BET_REPORT_EDIT = 1040302,
  S_A_MASTER_BET_REPORT_EXPORT = 1040303,

  /** 代理投注報表功能 */
  M_F_AGENT_BET_REPORT = 2040300,
  M_A_AGENT_BET_REPORT_VIEW = 2040301,
  M_A_AGENT_BET_REPORT_EDIT = 2040302,
  M_A_AGENT_BET_REPORT_EXPORT = 2040303,

  /** 代理佣金報表功能 */
  M_F_AGENT_COMMISSION_REPORT = 2090300,
  M_A_AGENT_COMMISSION_REPORT_VIEW = 2090301,
  M_A_AGENT_COMMISSION_EDIT = 2090303,
  M_A_AGENT_COMMISSION_REPORT_EXPORT = 2090302,

  /** 用戶報表功能 */
  S_F_USER_REPORT = 1040400,
  S_A_USER_REPORT_VIEW = 1040401,
  S_A_USER_REPORT_EDIT = 1040402,
  S_A_USER_REPORT_EXPORT = 1040403,
  M_F_USER_REPORT = 2040400,
  M_A_USER_REPORT_VIEW = 2040401,
  M_A_USER_REPORT_EDIT = 2040402,
  M_A_USER_REPORT_EXPORT = 2040403,
  A_F_USER_REPORT = 3460700,
  A_A_USER_REPORT_VIEW = 3460701,
  A_A_USER_REPORT_EDIT = 3460702,
  A_A_USER_REPORT_EXPORT = 3460703,

  /** 存款紀錄查詢功能 */
  A_F_DEPOSIT_RECORD_INQUIRY = 3040200,
  A_A_DEPOSIT_RECORD_INQUIRY_VIEW = 3040201,
  A_A_DEPOSIT_RECORD_INQUIRY_EDIT = 3040202,
  A_A_DEPOSIT_RECORD_INQUIRY_EXPORT = 3040203,

  /** 出款紀錄查詢功能 */
  A_F_WITHDRAWAL_RECORD_INQUIRY = 3040300,
  A_A_WITHDRAWAL_RECORD_INQUIRY_VIEW = 3040301,
  A_A_WITHDRAWAL_RECORD_INQUIRY_EDIT = 3040302,
  A_A_WITHDRAWAL_RECORD_INQUIRY_EXPORT = 3040303,

  /** 帳變明細功能 */
  A_F_ACCOUNT_FLOW_REPORT = 3450100,
  A_A_ACCOUNT_FLOW_REPORT_VIEW = 3450101,
  A_A_ACCOUNT_FLOW_REPORT_EDIT = 3450102,
  A_A_ACCOUNT_FLOW_REPORT_EXPORT = 3450103,

  /** 投注報表功能 */
  A_F_BET_REPORT = 3460400,
  A_A_BET_REPORT_VIEW = 3460401,
  A_A_BET_REPORT_EDIT = 3460402,
  A_A_BET_REPORT_EXPORT = 3460403,

  /** 投注記錄查詢功能 */
  A_F_BET_RECORD_INQUIRY = 3450200,
  A_A_BET_RECORD_INQUIRY_VIEW = 3450201,
  A_A_BET_RECORD_INQUIRY_EDIT = 3450202,
  A_A_BET_RECORD_INQUIRY_EXPORT = 3450203,

  /** 會員投注報表功能 */
  A_F_MEMBER_BET_REPORT = 3460500,
  A_A_MEMBER_BET_REPORT_VIEW = 3460501,
  A_A_MEMBER_BET_REPORT_EDIT = 3460502,
  A_A_MEMBER_BET_REPORT_EXPORT = 3460503,

  /**每日綜合報表 */
  A_F_OVERVIEW_REPORT = 3460100, // Function 每日綜合報表
  A_A_OVERVIEW_REPORT_VIEW = 3460101, // Action 每日綜合報表_VIEW
  A_A_OVERVIEW_REPORT_EDIT = 3460102, // Action 每日綜合報表_EDIT
  A_A_OVERVIEW_REPORT_EXPORT = 3460103, // Action 每日綜合報表_EXPORT

  /**免費遊戲報表 */
  A_F_FREE_ROUND_REPORT = 3420200, // Function 每日綜合報表
  A_A_FREE_ROUND_REPORT_VIEW = 3420201, // Action 每日綜合報表_VIEW
  A_A_FREE_ROUND_REPORT_EDIT = 3420202, // Action 每日綜合報表_EDIT
  A_A_FREE_ROUND_REPORT_EXPORT = 3420203, // Action 每日綜合報表_EXPORT

  /** 代理報表報表 */
  A_F_MEMBER_OVERVIEW_REPORT = 3460800, // Function 代理報表報表
  A_A_MEMBER_OVERVIEW_REPORT_VIEW = 3460801, // Action 代理報表報表_VIEW
  A_A_MEMBER_OVERVIEW_REPORT_EDIT = 3460802, // Action 代理報表報表_EDIT
  A_A_MEMBER_OVERVIEW_REPORT_EXPORT = 3460803, // Action 代理報表報表_EXPORT

  /** 訊息中心 */
  A_M_MESSAGE_CENTER = 3480000,
  A_F_NEWEST_ANNOUCEMENT = 3480100,
  A_A_NEWEST_ANNOUCEMENT_VIEW = 3480101,
  A_A_NEWEST_ANNOUCEMENT_EDIT = 3480102,
  A_F_MEMBER_ANNOUCEMENT = 3480200,
  A_A_MEMBER_ANNOUCEMENT_VIEW = 3480201,
  A_A_MEMBER_ANNOUCEMENT_EDIT = 3480202,
  A_F_MONITORING_SETTINGS = 3510200,
  A_A_MONITORING_SETTINGS_VIEW = 3510201,
  A_A_MONITORING_SETTINGS_EDIT = 3510202,
  A_F_NOTIFICATION_RECORD = 3510300,
  A_A_NOTIFICATION_RECORD_VIEW = 3510301,
  A_A_NOTIFICATION_RECORD_EDIT = 3510302,
  A_F_WARNING_SETTINGS = 3510100,
  A_A_WARNING_SETTINGS_VIEW = 3510101,
  A_A_WARNING_SETTINGS_EDIT = 3510102,

  /** 站內信功能 */
  A_M_MESSAGE_MANAGEMENT = 3570000,
  A_F_MESSAGE_NOTIFICATION = 3570100,
  A_F_MESSAGE_NOTIFICATION_VIEW = 3570101,
  A_F_MESSAGE_NOTIFICATION_EDIT = 3570102,
  A_F_MESSAGE_INQUIRE = 3570200,
  A_F_MESSAGE_INQUIRE_VIEW = 3570201,
  A_F_MESSAGE_INQUIRE_EDIT = 3570202,

  /** 文檔下載 */
  S_M_FILE_MANAGEMENT = 1050000,
  S_F_DOCUMENT_DOWNLOAD = 1050100,
  S_A_DOCUMENT_DOWNLOAD_VIEW = 1050101,
  S_A_DOCUMENT_DOWNLOAD_EDIT = 1050102,
  M_M_FILE_MANAGEMENT = 2050000,
  M_F_DOCUMENT_DOWNLOAD = 2050100,
  M_A_DOCUMENT_DOWNLOAD_VIEW = 2050101,
  M_A_DOCUMENT_DOWNLOAD_EDIT = 2050102,
  A_M_FILE_MANAGEMENT = 3530000,
  A_F_DOCUMENT_DOWNLOAD = 3530100,
  A_A_DOCUMENT_DOWNLOAD_VIEW = 3530101,
  A_A_DOCUMENT_DOWNLOAD_EDIT = 3050102,

  A_M_COLLABORATION = 3380000, // Menu 合營代理
  A_F_COLLABORATION_SETTING = 3380100,
  A_A_COLLABORATION_SETTING_VIEW = 3380101, // Action 合營代理設定_VIEW
  A_A_COLLABORATION_SETTING_EDIT = 3380102, // Action 合營代理設定_EDIT
  A_F_COLLABORATION_SETTLEMENT = 3380200, // Fuction 合營代理審核
  A_A_COLLABORATION_SETTLEMENT_VIEW = 3380201, // Action 合營代理審核_VIEW
  A_A_COLLABORATION_SETTLEMENT_EDIT = 3380202, // Action 合營代理審核_EDIT
  A_F_COLLABORATION_SETTLEMENT_DETAIL = 3380300, // Fuction 合營代理明細
  A_A_COLLABORATION_SETTLEMENT_DETAIL_VIEW = 3380301, // Action 合營代理明細_VIEW

  A_M_REFERRAL_REBATE_MANAGEMENT = 3360000, // Menu 上級佣金管理
  A_F_REFERRAL_REBATE_SETUP = 3360100, // Function 上級佣金設定
  A_A_REFERRAL_REBATE_SETUP_VIEW = 3360101, // Action 上級佣金設定_VIEW
  A_A_REFERRAL_REBATE_SETUP_EDIT = 3360102, // Action 上級佣金設定_EDIT
  A_F_REFERRAL_REBATE_DETAIL = 3360200, // Function 上級佣金明細
  A_A_REFERRAL_REBATE_DETAIL_VIEW = 3360201, // Action 上級佣金明細_VIEW
  A_A_REFERRAL_REBATE_DETAIL_EDIT = 3360202, // Action 上級佣金明細_EDIT

  A_M_SHAREHOLDER_MANAGEMENT = 3370000, // Menu 股東盤佣金管理
  A_F_SHAREHOLDER_SETUP = 3370300, // Function 股東盤佣金設定
  A_A_SHAREHOLDER_SETUP_VIEW = 3370301, // Action 股東盤佣金設定_VIEW
  A_A_SHAREHOLDER_SETUP_EDIT = 3370302, // Action 股東盤佣金設定_EDIT
  A_F_SHAREHOLDER_DETAIL = 3370100, // Function 股東盤佣金明細
  A_A_SHAREHOLDER_DETAIL_VIEW = 3370101, // Action 股東盤佣金明細_VIEW
  A_A_SHAREHOLDER_DETAIL_EDIT = 3370102, // Action 股東盤佣金明細_EDIT
  A_F_SHAREHOLDER_PARTICIPANT = 3370200, // Function 股東盤參與者
  A_A_SHAREHOLDER_PARTICIPANT_VIEW = 3370201, // Action 股東盤參與者_VIEW
  A_A_SHAREHOLDER_PARTICIPANT_EDIT = 3370202, // Action 股東盤參與者_EDIT

  S_F_AURORA_OVERVIEW_REPORT = 1040500,
  S_A_AURORA_OVERVIEW_REPORT_VIEW = 1040501, // Action Aurora代理報表_VIEW
  S_A_AURORA_OVERVIEW_REPORT_EDIT = 1040502, // Action Aurora代理報表_EDIT
  S_A_AURORA_OVERVIEW_REPORT_EXPORT = 1040503, // Action Aurora代理報表_EXPORT

  S_M_AURORA_AGENT_MANAGEMENT = 1090000, // Menu AURORA代理管理
  S_F_AURORA_AGENT_MANAGEMENT = 1090100, // Function AURORA代理管理
  S_A_AURORA_AGENT_MANAGEMENT_VIEW = 1090101, // Action AURORA代理管理_VIEW
  S_A_AURORA_AGENT_MANAGEMENT_EDIT = 1090102, // Action AURORA代理管理_EDIT

  A_M_REFERRAL_SIGNUP_MANAGEMENT = 3400000, // Menu 推薦註冊管理
  A_F_REFERRAL_SIGNUP_SETTING = 3400100,
  A_A_REFERRAL_SIGNUP_SETTING_VIEW = 3400101,
  A_A_REFERRAL_SIGNUP_SETTING_EDIT = 3400102,
  A_F_REFERRAL_SIGNUP_DETAIL = 3400200,
  A_A_REFERRAL_SIGNUP_DETAIL_VIEW = 3400201,
  A_A_REFERRAL_SIGNUP_DETAIL_EDIT = 3400202,

  A_F_MEMBER_AGENT_QUOTA = 3340200, // Function 會員代理額度調整
  A_A_MEMBER_AGENT_QUOTA_VIEW = 3340201, // Action 會員代理額度調整_VIEW
  A_A_MEMBER_AGENT_QUOTA_EDIT = 3340202, // Action 會員代理額度調整_EDIT
  A_M_REFERRAL_WHEEL_MANAGEMENT = 3410000, // Menu 轉盤管理
  A_F_REFERRAL_WHEEL_SETTINGS = 3410100, // Function 轉盤設定
  A_A_REFERRAL_WHEEL_SETTINGS_VIEW = 3410101, // Action 轉盤設定_VIEW
  A_A_REFERRAL_WHEEL_SETTINGS_EDIT = 3410102, // Action 轉盤設定_EDIT

  A_M_FREE_ROUND_MANAGEMENT = 3420000, // Menu 免費旋轉管理
  A_F_FREE_ROUND_SETTING = 3420100, // Function 免費旋轉設定
  A_A_FREE_ROUND_SETTING_VIEW = 3420101, // Action 免費旋轉設定_VIEW
  A_A_FREE_ROUND_SETTING_EDIT = 3420102, // Action 免費旋轉設定_EDIT

  A_M_AI_MANAGEMENT = 3310000, //Menu AI管理
  A_F_AI_AGENT = 3210100, //Function AI AGENT設定
  A_A_AI_AGENT_VIEW = 3210101, //Action AI AGENT_VIEW設定
  A_A_AI_AGENT_EDIT = 3210102, //  Action AI AGENT_EDIT設定
  A_F_AI_VOICE_BOT = 3310100, // Function AI_VOICE_BOT設定
  A_A_AI_VOICE_BOT_VIEW = 3310101, // Action AI_VOICE_BOT設定_VIEW
  A_A_AI_VOICE_BOT_EDIT = 3310102, // Action AI_VOICE_BOT設定_EDIT
  A_F_AI_CRM = 3210300, // Function CRM設定
  A_A_AI_CRM_VIEW = 3210301, // Action AI_CRM設定_VIEW
  A_A_AI_CRM_EDIT = 3210302, //  Action AI_CRM設定_EDIT
  A_F_AI_KOL = 3310200, //  Function KOL設定
  A_A_AI_KOL_VIEW = 3310201, //  Action AI_KOL設定_VIEW
  A_A_AI_KOL_EDIT = 3310202, //  Action AI_KOL設定_EDIT
  A_F_AI_HELPER = 3210500, // Function,// AI_HELPER設定
  A_A_AI_HELPER_VIEW = 3210501, // Action AI_HELPER設定_VIEW
  A_A_AI_HELPER_EDIT = 3210502, // Action AI_HELPER設定_EDIT
  A_F_AI_ADS = 3310300, // Function AI_ADS設定
  A_A_AI_ADS_VIEW = 3310301, // Action AI_ADS設定_VIEW
  A_A_AI_ADS_EDIT = 3310302,
  A_F_AI_MATE_CONNECTION = 3310400, // Function AI Mate設定
  A_A_AI_MATE_CONNECTION_VIEW = 3310401, // Action AI Mate設定_VIEW
  A_A_AI_MATE_CONNECTION_EDIT = 3310402, // Action AI Mate設定_EDIT

  /** 利息寶管理 */
  A_M_INTEREST_MANAGEMENT = 3540000, // Menu 利息寶
  A_F_INTEREST_ACTIVITY_SETTING = 3540100, // Function 利息寶活動設定
  A_A_INTEREST_ACTIVITY_SETTING_VIEW = 3540101, // Action 利息寶活動設定_VIEW
  A_A_INTEREST_ACTIVITY_SETTING_EDIT = 3540102, // Action 利息寶活動設定_EDIT
  A_F_INTEREST_REVIEW = 3540200, // Function 利息寶審核
  A_A_INTEREST_REVIEW_VIEW = 3540201, // Action 利息寶審核_VIEW
  A_A_INTEREST_REVIEW_EDIT = 3540202, // Action 利息寶審核_EDIT
  A_F_INTEREST_RECORD = 3540300, // Function 利息寶明細
  A_A_INTEREST_RECORD_VIEW = 3540301, // Action 利息寶明細_VIEW
  A_A_INTEREST_RECORD_EDIT = 3540302, // Action 利息寶明細_EDIT
  A_F_INTEREST_DESCRIPTION = 3540400, // Function 利息寶廣宣與說明
  A_A_INTEREST_DESCRIPTION_VIEW = 3540401, // Action 利息寶廣宣與說明_VIEW
  A_A_INTEREST_DESCRIPTION_EDIT = 3540402, // Action 利息寶廣宣與說明_EDIT
  /** JACKPOT 管理 */
  A_M_JACKPOT_MANAGEMENT = 3550000,
  A_F_JACKPOT_CONFIGURATION = 3550100,
  A_A_JACKPOT_CONFIGURATION_VIEW = 3550101,
  A_A_JACKPOT_CONFIGURATION_EDIT = 3550102,
  A_F_JACKPOT_WINNING_RECORDS = 3550200,
  A_A_JACKPOT_WINNING_RECORDS_VIEW = 3550201,
  A_A_JACKPOT_WINNING_RECORDS_EDIT = 3550202
}

export const I18nKeys: Partial<Record<Enums, string>> = {
  [Enums.S_M_ACCOUNT_MANAGEMENT]: "permission_menu.account_management",
  [Enums.M_M_ACCOUNT_MANAGEMENT]: "permission_menu.account_management",
  [Enums.A_M_ACCOUNT_MANAGEMENT]: "permission_menu.account_management",
  [Enums.S_F_BACKOFFICE_ACCOUNT]: "permission_menu.backoffice_account",
  [Enums.M_F_BACKOFFICE_ACCOUNT]: "permission_menu.backoffice_account",
  [Enums.A_F_BACKOFFICE_ACCOUNT]: "permission_menu.backoffice_account",
  [Enums.S_F_PERMISSION_SETTING]: "permission_menu.permission_setting",
  [Enums.M_F_PERMISSION_SETTING]: "permission_menu.permission_setting",
  [Enums.A_F_PERMISSION_SETTING]: "permission_menu.permission_setting",
  [Enums.S_F_USER_ACTION_LOG]: "permission_menu.user_action_log",
  [Enums.M_F_USER_ACTION_LOG]: "permission_menu.user_action_log",
  [Enums.A_F_USER_ACTION_LOG]: "permission_menu.user_action_log",
  [Enums.A_M_MEMBER_MANAGEMENT]: "permission_menu.member_management",
  [Enums.A_F_MEMBER_LIST]: "permission_menu.member_list",
  [Enums.A_F_MEMBER_LEVEL]: "permission_menu.member_level",
  [Enums.A_F_MEMBER_QUOTA]: "permission_menu.member_quota",
  [Enums.A_F_MEMBER_TAGS]: "permission_menu.member_tags",
  [Enums.A_F_MEMBER_KYC]: "menu.kyc_verification",
  [Enums.A_F_MEMBER_AUDIT_ADJUSTMENT]: "member_audit_adjustment",
  [Enums.A_A_MEMBER_AUDIT_ADJUSTMENT_VIEW]: "member_audit_adjustment",
  [Enums.A_A_MEMBER_AUDIT_ADJUSTMENT_EDIT]: "member_audit_adjustment",

  [Enums.A_M_GIFT]: "permission_menu.gift",
  [Enums.A_F_GIFT_DETAIL]: "permission_menu.gift_detail",

  [Enums.A_M_TRANSACTION_MANAGEMENT]: "permission_menu.transaction_management",
  [Enums.A_F_DEPOSIT_VERIFY]: "permission_menu.deposit_verify",
  [Enums.A_F_WITHDRAWAL_VERIFY]: "permission_menu.withdrawal_verify",

  [Enums.A_M_REBATE_MANAGEMENT]: "permission_menu.rebate_management",
  [Enums.A_F_REBATE_SETUP]: "permission_menu.rebate_setup",
  [Enums.A_F_REBATE_DETAIL]: "permission_menu.rebate_detail",

  [Enums.A_M_PROMOTION_MANAGEMENT]: "permission_menu.promotion_management",
  [Enums.A_F_PROMOTION_SETTINGS]: "permission_menu.promotion_settings",
  [Enums.A_F_PROMOTION_VERIFY]: "permission_menu.promotion_verify",

  [Enums.A_M_AFFILIATE_MANAGEMENT]: "permission_menu.affiliate_management",
  [Enums.A_F_AFFILIATE_SETUP]: "permission_menu.affiliate_setup",
  [Enums.A_F_AFFILIATE_DETAIL]: "permission_menu.affiliate_detail",
  [Enums.A_F_AFFILIATE_REPORT]: "permission_menu.affiliate_report",

  [Enums.M_M_SYSTEM_MANAGEMENT]: "permission_menu.alert_management",
  [Enums.A_M_SYSTEM_MANAGEMENT]: "permission_menu.alert_management",
  [Enums.M_F_LOCALIZATION_SETTINGS]: "permission_menu.localization_settings",
  [Enums.A_F_LOCALIZATION_SETTINGS]: "permission_menu.localization_settings",
  [Enums.M_F_IP_WHITELIST_SETTINGS]: "menu.backend_whitelist_settings",
  [Enums.A_F_IP_WHITELIST_SETTINGS]: "menu.backend_whitelist_settings",
  [Enums.A_F_NOTE_SETTINGS]: "permission_menu.note_settings",
  [Enums.A_F_TEMPLATE_SETTINGS]: "permission_menu.template_settings",

  [Enums.A_M_WEBSITE_MANAGEMENT]: "permission_menu.website_management",
  [Enums.A_M_LAYOUT_SETTINGS]: "menu.layout_settings",
  [Enums.A_F_BANNER_SETTINGS]: "menu.banner_settings",
  [Enums.A_F_PRODUCT_ENTRANCE_SETTINGS]: "menu.product_entrance_picture_settings",
  [Enums.A_F_POPULAR_GAME_SORT]: "menu.popular_games_sort",
  [Enums.A_F_HOME_POP_SLOT_SETTINGS]: "menu.home_page_popular_slots_sorting",
  [Enums.A_F_HOME_DYNAMIC_PANEL_SETTINGS]: "menu.home_page_dynamic_column_settings",
  [Enums.A_F_WEB_SETTINGS]: "menu.website_information_settings",
  [Enums.A_F_WEBIMAGE_SETTINGS]: "menu.website_image_settings",
  [Enums.A_F_CMS_SETTINGS]: "menu.page_management",
  [Enums.A_M_WEBSITE_ANALYTICS_MANAGEMENT]: "menu.tracking_code_configuration",
  [Enums.A_F_DNS_SETTING]: "menu.dns_settings",

  [Enums.S_M_PRODUCT_MANAGEMENT]: "menu.product",
  [Enums.M_M_PRODUCT_MANAGEMENT]: "menu.product",
  [Enums.A_M_PRODUCT_MANAGEMENT]: "menu.product",
  [Enums.S_F_PRODUCT_SWITCH]: "menu.product",
  [Enums.M_F_PRODUCT_SWITCH]: "menu.product",
  [Enums.A_F_PRODUCT_SWITCH]: "menu.product",
  [Enums.S_F_GAME_ENTRANCE_SETTINGS]: "menu.game_entrance_settings",
  [Enums.A_F_GAME_ENTRANCE_SETTINGS]: "menu.game_entrance_settings",
  [Enums.S_F_PRODUCT_MAINTENANCE_SETTINGS]: "menu.game_entrance_settings",
  [Enums.A_F_GAME_ENTRANCE_SORTS]: "menu.sort_settings",

  [Enums.S_M_MASTER_MANAGEMENT]: "menu.general_agency_management",
  [Enums.S_F_MASTER_MANAGEMENT]: "menu.general_agency_management",

  [Enums.S_M_AGENT_MANAGEMENT]: "menu.agency_management",
  [Enums.M_M_AGENT_MANAGEMENT]: "menu.agency_management",
  [Enums.S_F_AGENCY_OPERATIONS_MANAGEMENT]: "menu.agency_operations_management",
  [Enums.M_F_AGENCY_MANAGEMENT]: "menu.agency_operations_management",

  [Enums.S_M_PAYMENT_MANAGEMENT]: "menu.cash_flow",
  [Enums.M_M_PAYMENT_MANAGEMENT]: "menu.cash_flow",
  [Enums.A_M_PAYMENT_MANAGEMENT]: "menu.cash_flow",
  [Enums.S_F_CASH_FLOW]: "menu.cash_flow",
  [Enums.M_F_CASH_FLOW]: "menu.cash_flow",
  [Enums.A_F_CASH_FLOW]: "menu.cash_flow",
  [Enums.A_F_WITHDRAWAL_RISK]: "menu.risk_control_settings",

  [Enums.A_F_GATEWAY_CONNECTION]: "menu.cash_flow_merchant_management", // Function 金流商戶管理
  [Enums.A_A_GATEWAY_CONNECTION_VIEW]: "menu.cash_flow_merchant_management", // Action 金流商戶管理_VIEW
  [Enums.A_A_GATEWAY_CONNECTION_EDIT]: "menu.cash_flow_merchant_management", // Action 金流商戶管理_EDIT
  [Enums.A_F_CRYPTO_EXCHANGE_SETTING]: "menu.crypto_exchange_rate_settings", // Function 虛擬貨幣出款匯率設定
  [Enums.A_A_CRYPTO_EXCHANGE_SETTING_VIEW]: "menu.crypto_exchange_rate_settings", // Action 虛擬貨幣出款匯率設定_VIEW
  [Enums.A_A_CRYPTO_EXCHANGE_SETTING_EDIT]: "menu.crypto_exchange_rate_settings", // Action 虛擬貨幣出款匯率設定_EDIT
  [Enums.A_F_PAYMENT_TYPE_SETTING]: "menu.payment_type_management", // Function 支付類型管理
  [Enums.A_A_PAYMENT_TYPE_SETTING_VIEW]: "menu.payment_type_management", // Action 支付類型管理_VIEW
  [Enums.A_A_PAYMENT_TYPE_SETTING_EDIT]: "menu.payment_type_management", // Action 支付類型管理_EDIT
  [Enums.A_F_PAYMENT_QUICK_AMOUNT_SETTING]: "quick_select_amount_setting", // Function 快選金額設定
  [Enums.A_A_PAYMENT_QUICK_AMOUNT_SETTING_VIEW]: "quick_select_amount_setting", // Action 快選金額設定_VIEW
  [Enums.A_A_PAYMENT_QUICK_AMOUNT_SETTING_EDIT]: "quick_select_amount_setting", // Action 快選金額設定_EDIT

  [Enums.S_M_CACHE_MANAGEMENT]: "menu.cache_management",
  [Enums.S_F_CACHE_MANAGEMENT]: "menu.cache_management",

  [Enums.A_M_CACHE_MANAGEMENT_NEW]: "menu.cache_clear",
  [Enums.A_F_CACHE_MANAGEMENT_NEW]: "menu.cache_clear",

  [Enums.S_M_ANNOUCEMENT_MANAGEMENT]: "menu.announcement_management",
  [Enums.M_M_ANNOUCEMENT_MANAGEMENT]: "menu.announcement_management",
  [Enums.S_F_ANNOUCEMENT_MANAGEMENT]: "menu.announcement_management",
  [Enums.M_F_NEWEST_ANNOUCEMENT]: "menu.newest_announcement",

  [Enums.S_M_STATISTIC_REPORT]: "account_management.statistic_report",
  [Enums.M_M_STATISTIC_REPORT]: "account_management.statistic_report",
  [Enums.A_M_STATISTIC_REPORT]: "account_management.statistic_report",
  [Enums.A_M_HISTORY_MANAGEMENT]: "menu.history_records",
  [Enums.S_F_CASH_REPORT]: "account_management.cash_report",
  [Enums.M_F_CASH_REPORT]: "account_management.cash_report",
  [Enums.A_F_CASH_REPORT]: "account_management.cash_report",
  [Enums.S_F_PRODUCT_BET_REPORT]: "account_management.product_bet_report",
  [Enums.M_F_PRODUCT_BET_REPORT]: "account_management.product_bet_report",
  [Enums.A_F_PRODUCT_BET_REPORT]: "account_management.product_bet_report",
  [Enums.S_F_MASTER_BET_REPORT]: "account_management.master_bet_report",
  [Enums.M_F_AGENT_BET_REPORT]: "account_management.agent_bet_report",
  [Enums.M_F_AGENT_COMMISSION_REPORT]: "menu.agent_commission_report",
  [Enums.S_F_USER_REPORT]: "account_management.user_report",
  [Enums.M_F_USER_REPORT]: "account_management.user_report",
  [Enums.A_F_USER_REPORT]: "account_management.user_report",
  [Enums.A_F_DEPOSIT_RECORD_INQUIRY]: "account_management.deposit_record_inquiry",
  [Enums.A_F_WITHDRAWAL_RECORD_INQUIRY]: "account_management.withdrawal_record_inquiry",
  [Enums.A_F_ACCOUNT_FLOW_REPORT]: "account_management.account_flow_report",
  [Enums.A_F_BET_REPORT]: "account_management.bet_report",
  [Enums.A_F_BET_RECORD_INQUIRY]: "account_management.bet_record_inquiry",
  [Enums.A_F_MEMBER_BET_REPORT]: "menu.member_bet_report",
  [Enums.A_F_OVERVIEW_REPORT]: "menu.daily_comprehensive_report",
  [Enums.A_F_FREE_ROUND_REPORT]: "menu.free_game_details",
  [Enums.A_F_MEMBER_OVERVIEW_REPORT]: "menu.team_agent_report",

  [Enums.A_M_MESSAGE_CENTER]: "menu.announcement_management",
  [Enums.A_F_NEWEST_ANNOUCEMENT]: "menu.newest_announcement",
  [Enums.A_F_MEMBER_ANNOUCEMENT]: "menu.member_announcement",
  [Enums.A_F_MONITORING_SETTINGS]: "menu.monitoring_settings",
  [Enums.A_F_NOTIFICATION_RECORD]: "menu.notification_record",
  [Enums.A_F_WARNING_SETTINGS]: "menu.alert_settings",

  [Enums.A_M_MESSAGE_MANAGEMENT]: "menu.message_management",
  [Enums.A_F_MESSAGE_NOTIFICATION]: "menu.system_messages",
  [Enums.A_F_MESSAGE_INQUIRE]: "menu.member_inquiries",

  [Enums.S_M_FILE_MANAGEMENT]: "account_management.file_download",
  [Enums.S_F_DOCUMENT_DOWNLOAD]: "account_management.file_download",
  [Enums.M_M_FILE_MANAGEMENT]: "account_management.file_download",
  [Enums.M_F_DOCUMENT_DOWNLOAD]: "account_management.file_download",
  [Enums.A_M_FILE_MANAGEMENT]: "account_management.file_download",
  [Enums.A_F_DOCUMENT_DOWNLOAD]: "account_management.file_download",

  [Enums.A_F_COLLABORATION_SETTING]: "menu.collaboration_setting",
  [Enums.A_F_COLLABORATION_SETTLEMENT]: "menu.collaboration_review",
  [Enums.A_F_COLLABORATION_SETTLEMENT_DETAIL]: "menu.collaboration_detail",
  [Enums.A_M_COLLABORATION]: "menu.collaboration_management",

  [Enums.A_M_REFERRAL_REBATE_MANAGEMENT]: "menu.referral_commission_management",
  [Enums.A_F_REFERRAL_REBATE_SETUP]: "menu.referral_commission_setup",
  [Enums.A_F_REFERRAL_REBATE_DETAIL]: "menu.referral_commission_detail",

  [Enums.A_M_HOME_MANAGEMENT]: "menu.home",
  [Enums.A_F_HOME_SETTING]: "menu.dashboard",
  [Enums.A_F_CHECKSUM_VERIFICATION]: "common.version_verification",
  [Enums.A_A_CHECKSUM_VERIFICATION_VIEW]: "common.version_verification",

  [Enums.A_M_REFERRAL_SIGNUP_MANAGEMENT]: "menu.invitation_bonus",
  [Enums.A_F_REFERRAL_SIGNUP_SETTING]: "menu.invitation_bonus_settings",
  [Enums.A_F_REFERRAL_SIGNUP_DETAIL]: "menu.send_rewards_list",

  [Enums.A_F_MEMBER_AGENT_QUOTA]: "menu.agent_quota",
  [Enums.A_A_MEMBER_AGENT_QUOTA_VIEW]: "menu.agent_quota",
  [Enums.A_A_MEMBER_AGENT_QUOTA_EDIT]: "menu.agent_quota",
  [Enums.A_M_SHAREHOLDER_MANAGEMENT]: "menu.shareholder_proxy",
  [Enums.A_F_SHAREHOLDER_SETUP]: "menu.commission_rate_setting",
  [Enums.A_F_SHAREHOLDER_DETAIL]: "menu.commission_details",
  [Enums.A_F_SHAREHOLDER_PARTICIPANT]: "menu.account_settings",

  [Enums.A_M_REFERRAL_WHEEL_MANAGEMENT]: "menu.invitation_roulette",
  [Enums.A_F_REFERRAL_WHEEL_SETTINGS]: "menu.invitation_roulette",
  [Enums.A_A_REFERRAL_WHEEL_SETTINGS_VIEW]: "menu.invitation_roulette",
  [Enums.A_A_REFERRAL_WHEEL_SETTINGS_EDIT]: "menu.invitation_roulette",

  [Enums.A_M_FREE_ROUND_MANAGEMENT]: "menu.free_round",
  [Enums.A_F_FREE_ROUND_SETTING]: "menu.free_round",
  [Enums.A_A_FREE_ROUND_SETTING_VIEW]: "menu.free_round",
  [Enums.A_A_FREE_ROUND_SETTING_EDIT]: "menu.free_round",

  [Enums.A_M_AI_MANAGEMENT]: "menu.ai_features",
  [Enums.A_F_AI_VOICE_BOT]: "menu.ai_voice_bot",
  [Enums.A_F_AI_KOL]: "menu.ai_kol",
  [Enums.A_F_AI_ADS]: "menu.ads_marketing_service",
  [Enums.A_F_AI_MATE_CONNECTION]: "menu.ai_mate_connection",

  [Enums.A_M_INTEREST_MANAGEMENT]: "menu.interest_treasure",
  [Enums.A_F_INTEREST_ACTIVITY_SETTING]: "menu.interest_treasure",
  [Enums.A_A_INTEREST_ACTIVITY_SETTING_VIEW]: "menu.interest_treasure",
  [Enums.A_A_INTEREST_ACTIVITY_SETTING_EDIT]: "menu.interest_treasure",
  [Enums.A_F_INTEREST_REVIEW]: "menu.audit_checklist",
  [Enums.A_A_INTEREST_REVIEW_VIEW]: "menu.audit_checklist",
  [Enums.A_A_INTEREST_REVIEW_EDIT]: "menu.audit_checklist",
  [Enums.A_F_INTEREST_RECORD]: "menu.Interest_treasure_record",
  [Enums.A_A_INTEREST_RECORD_VIEW]: "menu.Interest_treasure_record",
  [Enums.A_A_INTEREST_RECORD_EDIT]: "menu.Interest_treasure_record",
  [Enums.A_F_INTEREST_DESCRIPTION]: "menu.advertising_and_description_settings",
  [Enums.A_A_INTEREST_DESCRIPTION_VIEW]: "menu.advertising_and_description_settings",
  [Enums.A_A_INTEREST_DESCRIPTION_EDIT]: "menu.advertising_and_description_settings",
  [Enums.A_M_JACKPOT_MANAGEMENT]: "menu.jackpot",
  [Enums.A_F_JACKPOT_CONFIGURATION]: "menu.jackpot_configuration",
  [Enums.A_F_JACKPOT_WINNING_RECORDS]: "menu.jackpot_winning_records"
}
