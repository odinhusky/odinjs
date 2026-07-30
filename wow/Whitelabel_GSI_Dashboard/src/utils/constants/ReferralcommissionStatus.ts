export enum Enums {
  /** 未處理 */
  Unprocessed = 0,

  /** 暫停結算 */
  PauseSettlement = 1,

  /** 已結算 */
  Settled = 2
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Unprocessed]: "settlement_type.unprocessed",
  [Enums.PauseSettlement]: "settlement_type.pause_settlement",
  [Enums.Settled]: "settlement_type.settled"
}
