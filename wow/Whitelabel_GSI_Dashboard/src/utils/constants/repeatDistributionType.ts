export enum Enums {
  /** 重复 */
  repeat = 1,

  /** 不重复 */
  not_repeating
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.repeat]: "repeat_distribution_type.repeat",
  [Enums.not_repeating]: "repeat_distribution_type.not_repeating"
}
