export enum Enums {
  /** 日結算 */
  Daily = 1,

  /** 週結算 */
  Weekly,

  /** 月結算 */
  Monthly
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Daily]: "settlement_cycle.daily",
  [Enums.Weekly]: "settlement_cycle.weekly",
  [Enums.Monthly]: "settlement_cycle.monthly"
}
