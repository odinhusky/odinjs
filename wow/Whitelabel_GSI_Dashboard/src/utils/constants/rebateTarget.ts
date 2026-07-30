export enum Enums {
  /** 全部 */
  All = 1,

  /** 會員 */
  Member,

  /** 代理 */
  Agent
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.All]: "common.all",
  [Enums.Member]: "common.member",
  [Enums.Agent]: "common.agent"
}
