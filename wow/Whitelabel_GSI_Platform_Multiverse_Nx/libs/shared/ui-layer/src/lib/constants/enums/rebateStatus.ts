export enum REBATE_STATUS_ENUMS {
  /** 未領取 */
  NOT_COLLECTED = 0,

  /** 已領取 */
  COLLECTED = 1,

  /** 拒絕 */
  REJECTED = 2
}

export const REBATE_STATUS_I18N_KEYS: Record<REBATE_STATUS_ENUMS, string> = {
  [REBATE_STATUS_ENUMS.NOT_COLLECTED]: "collaboration.not_collected",
  [REBATE_STATUS_ENUMS.COLLECTED]: "collaboration.collected",
  [REBATE_STATUS_ENUMS.REJECTED]: "collaboration.rejected"
}
