export enum Enums {
  /** 現金制 */
  Cash = 0,

  /** 信用制 */
  Credit = 1
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Cash]: "agent_type.cash",
  [Enums.Credit]: "agent_type.credit"
}
