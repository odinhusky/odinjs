export enum Enums {
  /**全部 */
  ALL = 0,
  /** 未接通 */
  NO_ANSWER = 1,
  /** 願意 */
  POSITIVE = 2,
  /** 不願意 */
  NEGATIVE = 3,
  /** 考慮中 */
  CONSIDER = 4
}

export const I18nKeys: Record<Enums, string> = {
  /** 未定義(全部) */
  [Enums.ALL]: "common.all",
  [Enums.NO_ANSWER]: "common.no_answer",
  [Enums.POSITIVE]: "common.positive",
  [Enums.NEGATIVE]: "common.negative",
  [Enums.CONSIDER]: "common.consider"
}
