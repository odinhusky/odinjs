export enum Enums {
  /** 終身累計 */
  LIFETIME = 1,

  /** 自定義期間 */
  CUSTOM_PERIOD = 2
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.LIFETIME]: "count_basis.lifetime",
  [Enums.CUSTOM_PERIOD]: "count_basis.custom_period"
}

export const Options = [
  { label: I18nKeys[Enums.LIFETIME], value: Enums.LIFETIME },
  { label: I18nKeys[Enums.CUSTOM_PERIOD], value: Enums.CUSTOM_PERIOD }
]
