export enum Enums {
  /** 停用 */
  UnFrozen = 0,
  /** 啟用 */
  Frozen
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.UnFrozen]: "common.un_frozen",
  [Enums.Frozen]: "common.frozen"
}
