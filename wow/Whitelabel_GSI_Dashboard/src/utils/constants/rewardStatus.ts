export enum Enums {
  /** 已派發 */
  Done = 1,

  /** 未派發 */
  Pending
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Done]: "reward_status.done",
  [Enums.Pending]: "reward_status.pending"
}
