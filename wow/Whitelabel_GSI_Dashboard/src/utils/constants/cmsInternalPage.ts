export enum Enums {
  /** 註冊 */
  REGISTER = 1,

  /** 首頁 */
  HOMEPAGE = 2,

  /** 忘記密碼 */
  FORGET_PASSWORD = 3,

  /** 會員公告 */
  ANNOUNCEMENT = 4,

  /** 產品大廳-各供應商入口 */
  PRODUCT_HALL = 5,

  /** VIP */
  VIP = 6,

  /** 基本資料 */
  BASIC_INFORMATION = 7,

  /** 出款設定 */
  WITHDRAWAL_SETTING = 8,

  /** 修改密碼 */
  CHANGE_PASSWORD = 9,

  /** 站內信 */
  SITE_MESSAGE = 10,

  /** 歷史紀錄 */
  HISTORY = 11,

  /** 存款 */
  DEPOSIT = 12,

  /** 出款 */
  WITHDRAWAL = 13,

  /** 處理中訂單 */
  PROCESSING_ORDER = 14,

  /** 代理詳情 */
  AFFILIATE_DETAIL = 15,

  /** 優惠活動 */
  PROMOTION = 16,

  /** APP下載頁面 */
  APP_DOWNLOAD = 17,

  /** 網站資訊 */
  WEBSITE_INFORMATION = 18,

  /** 領取禮金 */
  RECEIVE_BONUS = 19,

  /** KYC */
  KYC = 20,

  /** NEWS */
  NEWS = 21,

  /** 聯絡我們 */
  CONTACT_US = 22,

  /** 合營代理 */
  AGENT_COLLABORATION_STRATEGY = 23,

  /** 會員代理  */
  MEMBER_STRATEGY = 24,

  /** 代理詳情 */
  STRATEGY_DETAIL = 25,

  /** 上級反水 */
  REFERRAL_REBATE = 26,

  /** 會員層級 */
  MEMBER_LEVEL = 27,

  /** 內部彈窗 */
  INTERNAL_POP = 28,

  /** 股東盤 */
  SHAREHOLDER_STRATEGY = 29,

  /** ai */
  AI_AGENT = 30,

  /** 聊天室 */
  CHAT_ROOM = 31,

  /** saba */
  SABA_PAGE = 32,

  /** betby */
  BETBY_PAGE = 34,

  /** lucky */
  LUCKY_PAGE = 35,

  /** 公告中心 */
  ANNOUNCEMENT_CENTER = 37,

  /** FB專區 */
  FB_PAGE = 38
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.REGISTER]: "menu.register",
  [Enums.HOMEPAGE]: "menu.home",
  [Enums.FORGET_PASSWORD]: "menu.forgetPassword",
  [Enums.ANNOUNCEMENT]: "menu.member_announcement",
  [Enums.PRODUCT_HALL]: "menu.product_lobby",
  [Enums.VIP]: "menu.vip",
  [Enums.BASIC_INFORMATION]: "menu.basicInformation",
  [Enums.WITHDRAWAL_SETTING]: "menu.withdrawalSettings",
  [Enums.CHANGE_PASSWORD]: "common.change_password",
  [Enums.SITE_MESSAGE]: "menu.siteMessage",
  [Enums.HISTORY]: "menu.historicalRecord",
  [Enums.DEPOSIT]: "common.deposit_flow_type",
  [Enums.WITHDRAWAL]: "common.withdrawal_flow_type",
  [Enums.PROCESSING_ORDER]: "menu.order",
  [Enums.AFFILIATE_DETAIL]: "menu.agentDetails",
  [Enums.PROMOTION]: "common.promotion",
  [Enums.APP_DOWNLOAD]: "menu.download",
  [Enums.WEBSITE_INFORMATION]: "menu.websiteInformation",
  [Enums.RECEIVE_BONUS]: "menu.getMoney",
  [Enums.KYC]: "menu.kyc",
  [Enums.NEWS]: "menu.news",
  [Enums.CONTACT_US]: "menu.contactUs",
  [Enums.AGENT_COLLABORATION_STRATEGY]: "menu.collaboration_management",
  [Enums.MEMBER_STRATEGY]: "permission_menu.affiliate_management",
  [Enums.STRATEGY_DETAIL]: "menu.agentDetails",
  [Enums.REFERRAL_REBATE]: "menu.referral_commission_management",
  [Enums.MEMBER_LEVEL]: "menu.member_level",
  [Enums.INTERNAL_POP]: "menu.internal_popup",
  [Enums.SHAREHOLDER_STRATEGY]: "menu.shareholder_proxy",
  [Enums.AI_AGENT]: "menu.ai_agent",
  [Enums.CHAT_ROOM]: "menu.chat_room",
  [Enums.SABA_PAGE]: "menu.saba_page",
  [Enums.BETBY_PAGE]: "menu.betby_page",
  [Enums.LUCKY_PAGE]: "menu.lucky_page",
  [Enums.ANNOUNCEMENT_CENTER]: "menu.announcement_center",
  [Enums.FB_PAGE]: "menu.fb_page"
}
