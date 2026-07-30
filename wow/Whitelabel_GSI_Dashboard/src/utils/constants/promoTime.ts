export enum Enums {
  /** 每次存款 */
  EveryTime = 1,

  /** 僅限一次 */
  Once,

  /** 僅限首存 */
  FirstTime
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.EveryTime]: "promo_time.every_time",
  [Enums.Once]: "promo_time.only_once",
  [Enums.FirstTime]: "promo_time.only_first_time"
}
