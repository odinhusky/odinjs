export enum Enums {
  /** 當下日期尚未超過阻擋日期 */
  Excluded = "Excluded",
  /** 空值、當下日期已超過阻擋日期 */
  Active = "Active"
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Excluded]: "common.self_excluded",
  [Enums.Active]: "common.self_active"
}
