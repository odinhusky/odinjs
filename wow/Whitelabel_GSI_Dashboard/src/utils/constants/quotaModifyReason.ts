export enum Enums {
  /** 額度異常補存 */
  AbnormalCompensation = 1,
  /** 優惠活動 */
  Promotion,

  /** 返水 */
  Rebate,

  /** 額度異常扣除 */
  AbnormalDeduct,

  /** 代理調整 */
  AgentQuotaAdjustment,

  /** 儲值額度*/
  StoredValueLimit,

  /** 優惠金額 */
  PromotionAmount,

  /** 額度調整 */
  QuotaAdjustment
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.AbnormalCompensation]: "common.abnormal_compensation",
  [Enums.Promotion]: "common.promotion",
  [Enums.Rebate]: "common.rebate",
  [Enums.AbnormalDeduct]: "common.abnormal_deduct",
  [Enums.AgentQuotaAdjustment]: "common.agent_adjustment",
  [Enums.StoredValueLimit]: "common.stored_value_limit",
  [Enums.PromotionAmount]: "common.promotion_amount",
  [Enums.QuotaAdjustment]: "common.quota_adjustment"
}
