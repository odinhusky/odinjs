export enum Enums {
  /** 另開分頁 */
  NEW_TAB = 0,

  /** 本頁導轉 */
  REDIRECT
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.NEW_TAB]: "common.new_tab",
  [Enums.REDIRECT]: "common.redirect"
}
