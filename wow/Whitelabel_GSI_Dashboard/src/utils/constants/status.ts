export enum Enums {
  /** 停用 */
  Disable = 0,
  /** 啟用 */
  Enable = 1
}

export const I18nKeys: Record<Enums, string> = {
  /** 未定義(全部) */
  [Enums.Disable]: "common.disable",
  [Enums.Enable]: "common.enable"
}
