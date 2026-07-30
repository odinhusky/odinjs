export enum Enums {
  /** 已派發 */
  Done = 1,

  /** 已取消 */
  Cancel = 2,

  /** 已阻擋 */
  Block = 3
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Done]: "reward_status.done",
  [Enums.Cancel]: "reward_status.cancelled",
  [Enums.Block]: "reward_status.blocked"
}
