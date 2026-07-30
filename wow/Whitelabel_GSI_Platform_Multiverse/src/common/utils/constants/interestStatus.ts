export enum Enums {
  /** 進行中 */
  Active = 1,
  /** 已退還 */
  Refunded = 2,
  /** 未派發 */
  NotDispatched = 3,
  /** 已拒絕 */
  Rejected = 4,
  /** 已派發 */
  Dispatched = 5,
  /** 系統已派發 */
  SystemDispatched = 6,
  /** 活動失效 */
  Expired = 7
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Active]: "interest.statusActive",
  [Enums.Refunded]: "interest.statusRefunded",
  [Enums.NotDispatched]: "interest.statusNotDispatched",
  [Enums.Rejected]: "interest.statusRejected",
  [Enums.Dispatched]: "interest.statusDispatched",
  [Enums.SystemDispatched]: "interest.statusSystemDispatched",
  [Enums.Expired]: "interest.statusExpired"
}
