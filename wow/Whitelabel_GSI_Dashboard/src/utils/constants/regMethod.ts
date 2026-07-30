export enum Enums {
  /** 另開分頁 */
  ACCOUNT = 0,

  /** 本頁導轉 */
  MOBILE = 1
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.ACCOUNT]: "website_settings_reg.account_registration_login",
  [Enums.MOBILE]: "website_settings_reg.mobile_registration_ogin"
}
