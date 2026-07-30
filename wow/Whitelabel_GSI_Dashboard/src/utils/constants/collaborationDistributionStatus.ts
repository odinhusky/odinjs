export enum Enums {
  /** 未派發 */
  NotDistributed = 0,
  /** 已派發 */
  Distributed = 1,
  /** 拒絕 */
  Reject = 2
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  [Enums.NotDistributed]: "distribution_type.not_distributed",
  [Enums.Distributed]: "distribution_type.distributed",
  [Enums.Reject]: "distribution_type.rejected"
}
