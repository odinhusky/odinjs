export enum Enums {
  /** 自訂排序 */
  CUSTOM = 0,

  /** 隨機排序 */
  RANDOM
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.CUSTOM]: "cms.custom_sorting",
  [Enums.RANDOM]: "cms.random_sorting"
}
