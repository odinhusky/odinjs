export enum Enums {
  /**建立時間 */
  Created = 1,
  /** 派發時間 */
  Distribution = 2,
  /** 領取 */
  Collection = 3,
  /** 逾期 */
  Overdue = 4
}

export const I18nKeys: Record<Enums, string> = {
  /** 未定義(全部) */
  [Enums.Created]: "common.created_on",
  [Enums.Distribution]: "common.distribution_time",
  [Enums.Collection]: "common.collection_time",
  [Enums.Overdue]: "common.overdue_time"
}
