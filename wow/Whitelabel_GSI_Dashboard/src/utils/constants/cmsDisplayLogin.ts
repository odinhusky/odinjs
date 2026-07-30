export enum Enums {
  /** 不限制 */
  NO_RESTRICTIONS = 0,

  /** 登入前 */
  BEFORE_LOGIN,

  /** 登入後 */
  AFTER_LOGIN,

  // 登入後-會員
  AFTER_LOGIN_MEMBER,

  // 登入後-代理
  AFTER_LOGIN_AGENT
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.NO_RESTRICTIONS]: "cms.no_restrictions",
  [Enums.BEFORE_LOGIN]: "cms.before_login",
  [Enums.AFTER_LOGIN]: "cms.after_login",
  [Enums.AFTER_LOGIN_MEMBER]: "cms.after_login_member",
  [Enums.AFTER_LOGIN_AGENT]: "cms.after_login_agent"
}
