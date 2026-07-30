export enum Enums {
  /** 自訂頁面 */
  CUSTOM_PAGE = 13,

  /** 首頁 */
  HOME = 1,

  /** NavigationBar */
  NAVIGATION_BAR = 2,

  /** Menu */
  MENU = 3,

  /** H5置底選單 */
  H5_BOTTOM_MENU = 4,

  /** 網站說明頁 */
  WEBSITE_INFORMATION = 5,

  /** Footer設置 */
  FOOTER_SETTINGS = 6,

  /** 懸浮icon */
  FLOATING_ICON = 7,

  /** 聯絡我們 */
  CONTACT_US = 8,

  /** 首頁形象圖設置 */
  INDEXPAGEIMAGE = 9,

  /** 彈窗管理 */
  POPMANAGEMENT = 10,

  /** GCASH */
  GCASHHOME = 11

  /** 類別管理 */
  //CATEGORYMANAGEMENT = 12
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.CUSTOM_PAGE]: "cms.custom_page",
  [Enums.HOME]: "menu.home",
  [Enums.NAVIGATION_BAR]: "menu.navigationBar",
  [Enums.MENU]: "menu.menu",
  [Enums.H5_BOTTOM_MENU]: "menu.h5BottomMenu",
  [Enums.WEBSITE_INFORMATION]: "menu.webIntroduction",
  [Enums.FOOTER_SETTINGS]: "menu.footerSetting",
  [Enums.FLOATING_ICON]: "menu.floatingIcon",
  [Enums.CONTACT_US]: "menu.contactUs",
  [Enums.INDEXPAGEIMAGE]: "menu.indexPageImage",
  [Enums.POPMANAGEMENT]: "menu.popManagement",
  [Enums.GCASHHOME]: "menu.gcashHome"
  //[Enums.CATEGORYMANAGEMENT]: "menu.category_management"
}

export const RouterName: Record<Enums, string> = {
  [Enums.CUSTOM_PAGE]: "CmsCustomPage",
  [Enums.HOME]: "CmsHome",
  [Enums.NAVIGATION_BAR]: "CmsNavigationBar",
  [Enums.MENU]: "CmsMenu",
  [Enums.H5_BOTTOM_MENU]: "CmsH5FooterMenu",
  [Enums.WEBSITE_INFORMATION]: "CmsWebIntroduction",
  [Enums.FOOTER_SETTINGS]: "CmsFooterSetting",
  [Enums.FLOATING_ICON]: "CmsFloatingIcon",
  [Enums.CONTACT_US]: "CmsContactUs",
  [Enums.INDEXPAGEIMAGE]: "CmsIndexPageImage",
  [Enums.POPMANAGEMENT]: "CmsPop",
  [Enums.GCASHHOME]: "CmsGcashHome"
  //[Enums.CATEGORYMANAGEMENT]: "CmsGameTypeManagement"
}
