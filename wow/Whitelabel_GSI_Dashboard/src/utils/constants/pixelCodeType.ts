export enum Enums {
  /** head 區塊自訂代碼 */
  HEAD = "head",

  /**  body 起始區自訂代碼 */
  BODY_START = "body_start",

  /**  body 結尾區自訂代碼 */
  BODY_END = "body_end",

  /**  轉換追蹤事件代碼(首頁) */
  EVENT_HOMEPAGE = "event_homepage",

  /**  轉換追蹤事件代碼(存款) */
  EVENT_DEPOSIT = "event_deposit",

  /**  轉換追蹤事件代碼(註冊) */
  EVENT_REGISTER = "event_register",

  /**  轉換追蹤事件代碼(註冊成功) */
  EVENT_REGISTER_SUCCESS = "event_register_success"
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.HEAD]: "seo.global",
  [Enums.BODY_START]: "seo.body_start",
  [Enums.BODY_END]: "seo.body_end",
  [Enums.EVENT_HOMEPAGE]: "seo.event_homepage",
  [Enums.EVENT_DEPOSIT]: "seo.event_deposit",
  [Enums.EVENT_REGISTER]: "seo.event_register",
  [Enums.EVENT_REGISTER_SUCCESS]: "seo.event_register_success"
}
