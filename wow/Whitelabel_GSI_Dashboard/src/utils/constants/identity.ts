export enum Enums {
  /** 會員 */
  MEMBER = 0,
  /** 代理 */
  AGENT = 1
}

export const I18nKeys: Record<Enums, string> = {
  /** 未定義(全部) */
  [Enums.MEMBER]: "common.member",
  [Enums.AGENT]: "common.agent"
}
