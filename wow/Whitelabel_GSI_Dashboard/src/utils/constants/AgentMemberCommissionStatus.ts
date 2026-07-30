export enum Enums {
  /** 待處理 */
  Pending = 0,

  /** 未啟用 */
  Inactive = 1,

  /** 已結算 */
  Settled = 2
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Pending]: "reward_status.pendings",
  [Enums.Inactive]: "reward_status.inactive",
  [Enums.Settled]: "settlement_type.settled"
}
