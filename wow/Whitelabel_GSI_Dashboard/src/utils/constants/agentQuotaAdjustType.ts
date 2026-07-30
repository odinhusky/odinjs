export enum Enums {
  /** 全部 */
  All = 0,

  /** 增加 */
  Add = 1,

  /** 減少 */
  Remove = 2
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.Add]: "btn.add_quota",
  [Enums.Remove]: "btn.remove_quota"
}
