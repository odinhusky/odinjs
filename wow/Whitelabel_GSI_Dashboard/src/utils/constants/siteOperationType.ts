export enum Enums {
  /** 關閉 */
  Close = 0,

  /** 營運中 */
  InOperation
}

export const I18nKeys: Record<Enums | 0, string> = {
  [Enums.InOperation]: "site_operation_type.in_operation",
  [Enums.Close]: "site_operation_type.close"
}
