export enum Enums {
  /** 未領取 */
  unaccalimed = 1,

  /** 已領取 */
  received = 2,

  /** 取消 */
  cancel = 3,

  /** 逾期 */
  overdue = 4
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.unaccalimed]: "receive_status.unaccalimed",
  [Enums.received]: "receive_status.received",
  [Enums.cancel]: "receive_status.cancel",
  [Enums.overdue]: "receive_status.overdue"
}
