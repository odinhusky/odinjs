export enum MENU_ENUMS {
  /** 首頁 */
  HOME = 1,
  /** 站內信 */
  INBOX = 2,
  /** 優惠活動 */
  PROMOTION = 3,
  /** 優惠 */
  PROMOS = 4,
  /** 資訊 */
  PROFILE = 5,
  /** 存款 */
  DEPOSIT = 6,
  /** 出款 */
  WITHDRAWAL = 7,
  /** 存提款 */
  DEPOSIT_WITHDRAWAL = 8,
  /** 歷史紀錄 */
  HISTORY = 9,
  /** 訂單 */
  ORDER = 10,
  /** 修改密碼 */
  PASSWORD = 11,
  /** vip */
  VIP = 12,
  /** blog */
  BLOG = 13,
  /** 下載 */
  DOWNLOAD = 14,
  /** 關於我們 */
  ABOUT_US = 15,
  /** 登入 */
  LOGIN = 16,
  /** 註冊 */
  REGISTER = 17,
  /** 熱門遊戲 */
  HOT = 18,
  /** 遊戲大廳 */
  GAME_LOBBY = 19,
  /** 熱門列表 */
  GAME_LIST = 20,
  /** News */
  NEWS = 21,
  /** 關注我們 */
  FOLLOW_US = 22,
  /** 客服 */
  SUPPORT = 23,
  /** facebook */
  FACEBOOK = 24,
  /** telegram */
  TELEGRAM = 25,
  /** instagram */
  INSTAGRAM = 26,
  /** youtube */
  YOUTUBE = 27,
  /** language */
  LANGUAGE = 28
}

export const MENU_I18N_KEYS: Record<MENU_ENUMS, string> = {
  [MENU_ENUMS.HOME]: "menu.home",
  [MENU_ENUMS.INBOX]: "menu.inbox",
  [MENU_ENUMS.PROMOTION]: "menu.promotion",
  [MENU_ENUMS.PROMOS]: "menu.promos",
  [MENU_ENUMS.PROFILE]: "menu.profile",
  [MENU_ENUMS.DEPOSIT]: "menu.deposit",
  [MENU_ENUMS.WITHDRAWAL]: "menu.withdrawal",
  [MENU_ENUMS.DEPOSIT_WITHDRAWAL]: "menu.deposit_withdrawal",
  [MENU_ENUMS.HISTORY]: "menu.history",
  [MENU_ENUMS.ORDER]: "menu.order",
  [MENU_ENUMS.PASSWORD]: "menu.password",
  [MENU_ENUMS.VIP]: "menu.vip",
  [MENU_ENUMS.BLOG]: "menu.blog",
  [MENU_ENUMS.DOWNLOAD]: "menu.download",
  [MENU_ENUMS.ABOUT_US]: "menu.about_us",
  [MENU_ENUMS.LOGIN]: "menu.login",
  [MENU_ENUMS.REGISTER]: "menu.register",
  [MENU_ENUMS.HOT]: "menu.hot",
  [MENU_ENUMS.GAME_LOBBY]: "menu.game_lobby",
  [MENU_ENUMS.GAME_LIST]: "menu.game_list",
  [MENU_ENUMS.NEWS]: "menu.news",
  [MENU_ENUMS.FOLLOW_US]: "menu.follow_us",
  [MENU_ENUMS.SUPPORT]: "menu.support",
  [MENU_ENUMS.FACEBOOK]: "menu.facebook",
  [MENU_ENUMS.TELEGRAM]: "menu.telegram",
  [MENU_ENUMS.INSTAGRAM]: "menu.instagram",
  [MENU_ENUMS.YOUTUBE]: "menu.youtube",
  [MENU_ENUMS.LANGUAGE]: "menu.language"
}

export const MENU_FRONTEND_KEY: Record<MENU_ENUMS, string> = {
  [MENU_ENUMS.HOME]: "home",
  [MENU_ENUMS.INBOX]: "inbox",
  [MENU_ENUMS.PROMOTION]: "promotion",
  [MENU_ENUMS.PROMOS]: "promos",
  [MENU_ENUMS.PROFILE]: "profile",
  [MENU_ENUMS.DEPOSIT]: "deposit",
  [MENU_ENUMS.WITHDRAWAL]: "withdrawal",
  [MENU_ENUMS.DEPOSIT_WITHDRAWAL]: "deposit",
  [MENU_ENUMS.HISTORY]: "history",
  [MENU_ENUMS.ORDER]: "order",
  [MENU_ENUMS.PASSWORD]: "password",
  [MENU_ENUMS.VIP]: "vip",
  [MENU_ENUMS.BLOG]: "blog",
  [MENU_ENUMS.DOWNLOAD]: "download",
  [MENU_ENUMS.ABOUT_US]: "aboutUs",
  [MENU_ENUMS.LOGIN]: "login",
  [MENU_ENUMS.REGISTER]: "register",
  [MENU_ENUMS.HOT]: "hot",
  [MENU_ENUMS.GAME_LOBBY]: "gameLobby",
  [MENU_ENUMS.GAME_LIST]: "gameList",
  [MENU_ENUMS.NEWS]: "news",
  [MENU_ENUMS.FOLLOW_US]: "followUs",
  [MENU_ENUMS.SUPPORT]: "support",
  [MENU_ENUMS.FACEBOOK]: "facebook",
  [MENU_ENUMS.TELEGRAM]: "telegram",
  [MENU_ENUMS.INSTAGRAM]: "instagram",
  [MENU_ENUMS.YOUTUBE]: "youtube",
  [MENU_ENUMS.LANGUAGE]: "language"
}
