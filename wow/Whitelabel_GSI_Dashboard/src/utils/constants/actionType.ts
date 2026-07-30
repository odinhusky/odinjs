export enum Enums {
  /** 入款 */
  DEPOSIT = 1,

  /** 出款 */
  WITHDRAWAL = 2,

  /** 人工存款 */
  ADJUSMENT_DEPOSIT = 3,

  /** 人工出款 */
  ADJUSMENT_WITHDRAWAL = 4,

  /** 遊戲交易 */
  // API_TRANSFER = 5,

  /** 出款拒絕 */
  WITHDRAWAL_REJECTED = 6,

  /** 優惠活動 */
  PROMOTON_BONUS = 7,

  /** 返水 */
  REBATE = 8,

  /** 代理 */
  COMMISSION = 9,

  /** 投注紀錄 */
  BETTING_RECORDS = 5
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.DEPOSIT]: "action_type.deposit",
  [Enums.WITHDRAWAL]: "action_type.withdrawal",
  [Enums.ADJUSMENT_DEPOSIT]: "action_type.adjusment_deposit",
  [Enums.ADJUSMENT_WITHDRAWAL]: "action_type.adjusment_withdrawal",
  // [Enums.API_TRANSFER]: "action_type.transfer",
  [Enums.BETTING_RECORDS]: "action_type.betting_records",
  [Enums.WITHDRAWAL_REJECTED]: "action_type.withdrawal_rejected",
  [Enums.PROMOTON_BONUS]: "account_flow_type.promoton_bonus",
  [Enums.REBATE]: "account_flow_type.rebate",
  [Enums.COMMISSION]: "account_flow_type.commission"
}
