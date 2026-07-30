export enum Enums {
  /** 遊戲連結 */
  GAME_LINK = 1,

  /** 分類大廳 */
  CATEGORY_LOBBY = 2,

  /** 自訂連結 */
  CUSTOM_LINK = 3,

  /** 首頁區塊 */
  HOMEPAGE_SECTION = 4,

  /** 內部頁面 */
  INTERNAL_PAGE = 5,

  /** 客服連結 */
  CUSTOMER_SERVICE_LINK = 6,

  /** 自訂頁面 */
  CUSTOM_PAGE = 7
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.GAME_LINK]: "cms.game_link",
  [Enums.CATEGORY_LOBBY]: "cms.category_lobby",
  [Enums.CUSTOM_LINK]: "cms.custom_link",
  [Enums.HOMEPAGE_SECTION]: "cms.homepage_section",
  [Enums.INTERNAL_PAGE]: "cms.internal_page",
  [Enums.CUSTOMER_SERVICE_LINK]: "cms.customer_service_link",
  [Enums.CUSTOM_PAGE]: "cms.custom_page"
}
