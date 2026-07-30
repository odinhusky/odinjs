export enum Enums {
  /** 已領取 */
  received = 1,

  /** 未領取 */
  unaccalimed = 2,

  /** 取消 */
  cancel = 3
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.received]: "receive_status.received",
  [Enums.unaccalimed]: "receive_status.unaccalimed",
  [Enums.cancel]: "receive_status.cancel"
}
