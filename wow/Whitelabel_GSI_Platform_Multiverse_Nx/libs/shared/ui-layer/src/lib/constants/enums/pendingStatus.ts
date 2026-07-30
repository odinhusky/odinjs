export enum PENDING_STATUS_ENUMS {
  /** 待處理 */
  PENDING = 1,

  /** 確認 */
  CONFIRMED = 2,

  /** 拒絕 */
  REJECTED = 3,

  /** 取消 */
  CANCEL = 4
}

export const PENDING_STATUS_I18N_KEYS: Record<PENDING_STATUS_ENUMS, string> = {
  [PENDING_STATUS_ENUMS.PENDING]: "report.pending",
  [PENDING_STATUS_ENUMS.CONFIRMED]: "report.confirmed",
  [PENDING_STATUS_ENUMS.REJECTED]: "report.rejected",
  [PENDING_STATUS_ENUMS.CANCEL]: "report.cancel"
}
