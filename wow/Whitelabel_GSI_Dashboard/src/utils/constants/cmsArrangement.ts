export enum Enums {
  /** 多列滑動 */
  MULTIPLE_ROWS_SCROLL = 0,

  /** 多列 */
  MULTIPLE_COLUMNS = 1
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.MULTIPLE_ROWS_SCROLL]: "cms.multiple_rows_scroll",
  [Enums.MULTIPLE_COLUMNS]: "cms.multiple_columns"
}
