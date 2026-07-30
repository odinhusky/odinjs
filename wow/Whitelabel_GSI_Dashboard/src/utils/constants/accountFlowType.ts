export const enum Enums {
  /** 入款 */
  DEPOSIT = 1,

  /** 出款 */
  WITHDRAWAL = 2,

  /** 人工入款 */
  ADJUSMENT_DEPOSIT = 3,

  /** 人工出款 */
  ADJUSMENT_WITHDRAWAL = 4,

  /** 投注/派彩 */
  // API_TRANSFER = 5,

  /** 投注紀錄 */
  BETTING_RECORDS = 5,

  /** 出款取消 */
  WITHDRAWAL_REJECTED = 6,

  /** 優惠活動 */
  PROMOTON_BONUS = 7,

  /** 返水 */
  REBATE = 8,

  /** 贈金轉帳 */
  BONUS_WALLET_TRANSFER = 9,

  /*VIP獎勵 */
  VIP_BONUS = 10,

  /*生日獎勵 */
  BIRTHDAY_BONUS = 11,

  // 代理佣金
  COMMISSION = 12,

  // 合營代理返佣
  AFFILIATE_AGENT_REBATE = 13,

  // 上級返佣
  REFERRAL_REBATE = 14,

  // 禮金
  BONUS_GIFT = 15,

  // 股東代理
  SHAREHOLDERS_SETTING = 17,

  // 推薦註冊禮金
  REFERRAL_SIGNUP_BONUS = 18,

  //免費遊戲
  FREE_ROUND_BETTING_RECORDS = 19,

  // 利息寶扣款
  INTEREST_DEDUCTION = 20,

  // 利息寶本金
  INTEREST_PRINCIPAL = 21,

  // 利息寶獎金
  INTEREST_BONUS = 22,

  /** Manual audit adjustment */
  MANUAL_AUDIT_ADJUSTMENT = 23
}

export const I18nKeys: Record<Enums, string> = {
  /** 未定義(全部) */
  [Enums.DEPOSIT]: "account_flow_type.deposit",
  [Enums.WITHDRAWAL]: "account_flow_type.withdrawal",
  [Enums.ADJUSMENT_DEPOSIT]: "account_flow_type.adjusment_deposit",
  [Enums.ADJUSMENT_WITHDRAWAL]: "account_flow_type.adjusment_withdrawal",
  // [Enums.API_TRANSFER]: "account_flow_type.api_transfer",
  [Enums.BETTING_RECORDS]: "account_flow_type.betting_records",
  [Enums.WITHDRAWAL_REJECTED]: "account_flow_type.withdrawal_rejected",
  [Enums.PROMOTON_BONUS]: "account_flow_type.promoton_bonus",
  [Enums.REBATE]: "account_flow_type.rebate",
  [Enums.BONUS_WALLET_TRANSFER]: "account_flow_type.bonus_wallet_trans",
  [Enums.VIP_BONUS]: "account_flow_type.vip_bonus",
  [Enums.BIRTHDAY_BONUS]: "account_flow_type.birthday_bonus",
  [Enums.COMMISSION]: "account_flow_type.commission",
  [Enums.AFFILIATE_AGENT_REBATE]: "account_flow_type.affiliate_agent_rebate",
  [Enums.REFERRAL_REBATE]: "account_flow_type.referral_rebate",
  [Enums.BONUS_GIFT]: "account_flow_type.bouns_gift",
  [Enums.SHAREHOLDERS_SETTING]: "account_flow_type.profit_sharing_commission",
  [Enums.REFERRAL_SIGNUP_BONUS]: "account_flow_type.referral_signup_bonus",
  [Enums.FREE_ROUND_BETTING_RECORDS]: "account_flow_type.free_round",
  [Enums.INTEREST_DEDUCTION]: "account_flow_type.interest_deduction",
  [Enums.INTEREST_PRINCIPAL]: "account_flow_type.interest_principal",
  [Enums.INTEREST_BONUS]: "account_flow_type.interest_bonus",
  [Enums.MANUAL_AUDIT_ADJUSTMENT]: "manual_audit_adjustment"
}

export const AUDIT_RELATED_ACCOUNT_FLOW_TYPES: Enums[] = [
  Enums.BONUS_WALLET_TRANSFER,
  Enums.BIRTHDAY_BONUS,
  Enums.AFFILIATE_AGENT_REBATE,
  Enums.SHAREHOLDERS_SETTING,
  Enums.REFERRAL_SIGNUP_BONUS,
  Enums.REFERRAL_REBATE,
  Enums.COMMISSION,
  Enums.VIP_BONUS,
  Enums.BONUS_GIFT,
  Enums.REBATE,
  Enums.PROMOTON_BONUS,
  Enums.DEPOSIT,
  Enums.WITHDRAWAL,
  Enums.ADJUSMENT_DEPOSIT,
  Enums.MANUAL_AUDIT_ADJUSTMENT,
  Enums.INTEREST_BONUS
]
