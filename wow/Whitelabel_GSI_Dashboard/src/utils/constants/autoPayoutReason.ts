export enum Enums {
  /** 沒有原因 */
  None = 0,
  /** 標籤阻擋 */
  BlockLabel,
  /** 同IP重複註冊 */
  SameIP
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  [Enums.None]: "- -",
  [Enums.BlockLabel]: "auto_payout_reason.block_label",
  [Enums.SameIP]: "auto_payout_reason.same_ip"
}
