export enum Enums {
  None = 0,
  /** 申請日 */
  Apply = 1,

  /** 核准日 */
  Review = 2
}

export const I18nKeys: Record<Enums, string> = {
  /** 未定義(全部) */
  [Enums.None]: "common.none",
  [Enums.Apply]: "common.apply_date",
  [Enums.Review]: "common.review_date"
}
