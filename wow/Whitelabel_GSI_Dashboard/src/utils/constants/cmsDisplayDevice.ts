export enum Enums {
  /** 不限制 */
  NO_RESTRICTIONS = 0,

  /** PC */
  DESKTOP,

  /** Mobile */
  MOBILE
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.NO_RESTRICTIONS]: "common.all",
  [Enums.DESKTOP]: "common.desktop",
  [Enums.MOBILE]: "common.mobile"
}
