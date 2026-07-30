export enum Enums {
  // AGENT
  // 登入頁面
  A_PAGE_LOGIN = 30001,

  // 主控台
  PAGE_AGENT_DASHBOARD = 30101,

  // 管理者帳號管理
  PAGE_AGENT_SUB_ACCOUNT = 30201,

  // 權限設定
  A_PAGE_PERMISSIONS = 30301,

  // 會員列表
  A_PAGE_MEMBER = 30401,

  // 會員層級
  A_PAGE_MEMBER_LEVEL = 30501,

  // 會員額度調整
  A_PAGE_MEMBER_BALANCES = 30601,

  // 會員標籤管理
  A_PAGE_MEMBER_LABEL = 30701,

  // 禮包管理
  A_PAGE_GIFTS = 30801,

  // 優惠活動
  A_PAGE_PROMOTIONS = 31001,

  // 優惠活動審核
  A_PAGE_PROMOTIONS_REVIEW = 31002,

  // Banner設置
  A_PAGE_BANNERS = 31601,

  // CMS
  A_PAGE_CMS = 31101,

  // Product
  A_PAGE_PRODUCT = 32501
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.A_PAGE_LOGIN]: "menu.login_page",
  [Enums.PAGE_AGENT_DASHBOARD]: "menu.dashBoard",
  [Enums.PAGE_AGENT_SUB_ACCOUNT]: "menu.account_management",
  [Enums.A_PAGE_PERMISSIONS]: "menu.permission_setting",
  [Enums.A_PAGE_MEMBER]: "menu.member_list",
  [Enums.A_PAGE_MEMBER_LEVEL]: "menu.member_level",
  [Enums.A_PAGE_MEMBER_BALANCES]: "menu.member_quota",
  [Enums.A_PAGE_MEMBER_LABEL]: "menu.account_management",
  [Enums.A_PAGE_GIFTS]: "menu.gift_details",
  [Enums.A_PAGE_PROMOTIONS]: "menu.promotion",
  [Enums.A_PAGE_PROMOTIONS_REVIEW]: "menu.promotion_review",
  [Enums.A_PAGE_BANNERS]: "menu.banner_settings",
  [Enums.A_PAGE_CMS]: "menu.cms",
  [Enums.A_PAGE_PRODUCT]: "menu.product"
}
