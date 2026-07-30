export enum Enums {
  /** 是 */
  Yes = 1,
  /** 否 */
  No
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.Yes]: "first_deposit_type.yes",
  [Enums.No]: "first_deposit_type.no"
}
