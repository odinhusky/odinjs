export enum Enums {
  /** 未派發 */
  NotDistributed = 1,

  /** 拒絕 */
  Reject,

  /** 已派發 */
  Distributed
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.NotDistributed]: "distribution_type.not_distributed",
  [Enums.Reject]: "distribution_type.rejected",
  [Enums.Distributed]: "distribution_type.distributed"
}
