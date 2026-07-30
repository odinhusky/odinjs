export enum INTEREST_STATUS_ENUMS {
  /** 進行中 */
  ACTIVE = 1,
  /** 已退還 */
  REFUNDED = 2,
  /** 未派發 */
  NOT_DISPATCHED = 3,
  /** 已拒絕 */
  REJECTED = 4,
  /** 已派發 */
  DISPATCHED = 5,
  /** 系統已派發 */
  SYSTEM_DISPATCHED = 6,
  /** 活動失效 */
  EXPIRED = 7
}

export const INTEREST_STATUS_I18N_KEYS: Record<INTEREST_STATUS_ENUMS, string> = {
  [INTEREST_STATUS_ENUMS.ACTIVE]: "interest.statusActive",
  [INTEREST_STATUS_ENUMS.REFUNDED]: "interest.statusRefunded",
  [INTEREST_STATUS_ENUMS.NOT_DISPATCHED]: "interest.statusNotDispatched",
  [INTEREST_STATUS_ENUMS.REJECTED]: "interest.statusRejected",
  [INTEREST_STATUS_ENUMS.DISPATCHED]: "interest.statusDispatched",
  [INTEREST_STATUS_ENUMS.SYSTEM_DISPATCHED]: "interest.statusSystemDispatched",
  [INTEREST_STATUS_ENUMS.EXPIRED]: "interest.statusExpired"
}
