export enum Enums {
  /** 全部 */
  All = 0,

  /** 代理額度下發 */
  QuotaGrant = 1,

  /** 代理額度回收 */
  QuotaReclaim = 2,

  /** 餘額下發 */
  BalanceGrant = 3,

  /** 餘額回收 */
  BalanceReclaim = 4
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.All]: "menu.all",
  [Enums.QuotaGrant]: "action_type.quotaGrant",
  [Enums.QuotaReclaim]: "action_type.quotaReclaim",
  [Enums.BalanceGrant]: "action_type.balanceGrant",
  [Enums.BalanceReclaim]: "action_type.balanceReclaim"
}

/** 異動項目：代理額度 */
export const QUOTA_TYPES: number[] = [Enums.QuotaGrant, Enums.QuotaReclaim]

/** 下級視角為加款（顯示 +、綠色）的類型 */
export const POSITIVE_TYPES: number[] = [Enums.QuotaGrant, Enums.BalanceGrant]

/** 查詢區間上限（月） */
export const MAX_RANGE_MONTHS = 2
