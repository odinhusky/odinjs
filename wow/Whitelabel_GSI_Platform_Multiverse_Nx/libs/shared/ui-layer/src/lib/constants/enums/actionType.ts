/** 後端真正的紀錄類型 */
export enum ACTION_TYPE_ENUMS {
  // 入款
  DEPOSIT = 1,

  // 出款
  WITHDRAWAL = 2,

  // 手動存款
  ADJUSMENT_DEPOSIT = 3,

  // 手動提款
  ADJUSMENT_WITHDRAWAL = 4,

  // 投注
  BET = 5,

  // 拒絕提款
  WITHDRAWAL_REJECTED = 6,

  // 優惠
  PROMOTION = 7,

  //反水
  REBATE = 8,

  //贈金轉帳
  BONUS_WALLET_TRANSFER = 9,

  //VIP獎勵
  VIP_BONUS = 10,

  //生日獎勵
  BIRTHDAY_BONUS = 11,

  //代理佣金
  AGENT_COMMISSION = 12,

  //合營代理返佣
  AGENT_COLLABORATION_COMMISSION = 13,

  // 上級返佣
  REFERRAL_REBATE = 14,

  // 禮金
  BONUS_GIFT = 15,

  // 股東盤存款
  SHAREHOLDER_DEPOSIT = 17,

  // 利息寶扣款
  INTEREST_DEDUCTION = 20,

  // 利息寶本金
  INTEREST_PRINCIPAL = 21,

  // 利息寶利息
  INTEREST_EARNINGS = 22
}

export const ACTION_TYPE_I18N_KEYS: Record<ACTION_TYPE_ENUMS | 0, string> = {
  0: "common.btn.all",
  [ACTION_TYPE_ENUMS.DEPOSIT]: "action_type.deposit",
  [ACTION_TYPE_ENUMS.WITHDRAWAL]: "action_type.withdrawal",
  [ACTION_TYPE_ENUMS.ADJUSMENT_DEPOSIT]: "action_type.adjusmentDeposit",
  [ACTION_TYPE_ENUMS.ADJUSMENT_WITHDRAWAL]: "action_type.adjusmentWithdrawal",
  [ACTION_TYPE_ENUMS.BET]: "action_type.betRecord",
  [ACTION_TYPE_ENUMS.WITHDRAWAL_REJECTED]: "action_type.withdrawalRejected",
  [ACTION_TYPE_ENUMS.PROMOTION]: "action_type.promotion",
  [ACTION_TYPE_ENUMS.REBATE]: "action_type.rebate",
  [ACTION_TYPE_ENUMS.BONUS_WALLET_TRANSFER]: "action_type.bonusWalletTransfer",
  [ACTION_TYPE_ENUMS.VIP_BONUS]: "action_type.vipBonus",
  [ACTION_TYPE_ENUMS.BIRTHDAY_BONUS]: "action_type.birthdayBonus",
  [ACTION_TYPE_ENUMS.AGENT_COMMISSION]: "action_type.affiliateCommission",
  [ACTION_TYPE_ENUMS.AGENT_COLLABORATION_COMMISSION]: "action_type.agentCommission",
  [ACTION_TYPE_ENUMS.REFERRAL_REBATE]: "action_type.referral_rebate",
  [ACTION_TYPE_ENUMS.BONUS_GIFT]: "action_type.bonus_gift",
  [ACTION_TYPE_ENUMS.SHAREHOLDER_DEPOSIT]: "action_type.shareholderDeposit",
  [ACTION_TYPE_ENUMS.INTEREST_DEDUCTION]: "action_type.interestDeduction",
  [ACTION_TYPE_ENUMS.INTEREST_PRINCIPAL]: "action_type.interestPrincipal",
  [ACTION_TYPE_ENUMS.INTEREST_EARNINGS]: "action_type.interestEarnings"
}

export const ACTION_TYPE_FP_I18N_KEYS: Record<ACTION_TYPE_ENUMS | 0, string> = {
  0: "common.btn.all",
  [ACTION_TYPE_ENUMS.DEPOSIT]: "common.btn.cash_in",
  [ACTION_TYPE_ENUMS.WITHDRAWAL]: "common.btn.withdraw",
  [ACTION_TYPE_ENUMS.ADJUSMENT_DEPOSIT]: "action_type.manualCashIn",
  [ACTION_TYPE_ENUMS.ADJUSMENT_WITHDRAWAL]: "action_type.adjusmentWithdraw",
  [ACTION_TYPE_ENUMS.BET]: "action_type.betRecord",
  [ACTION_TYPE_ENUMS.WITHDRAWAL_REJECTED]: "action_type.withdrawRejected",
  [ACTION_TYPE_ENUMS.PROMOTION]: "action_type.promotion",
  [ACTION_TYPE_ENUMS.REBATE]: "action_type.rebate",
  [ACTION_TYPE_ENUMS.BONUS_WALLET_TRANSFER]: "action_type.bonusWalletTransfer",
  [ACTION_TYPE_ENUMS.VIP_BONUS]: "action_type.vipBonus",
  [ACTION_TYPE_ENUMS.BIRTHDAY_BONUS]: "action_type.birthdayBonus",
  [ACTION_TYPE_ENUMS.AGENT_COMMISSION]: "action_type.affiliateCommission",
  [ACTION_TYPE_ENUMS.AGENT_COLLABORATION_COMMISSION]: "action_type.agentCommission",
  [ACTION_TYPE_ENUMS.REFERRAL_REBATE]: "action_type.referral_rebate",
  [ACTION_TYPE_ENUMS.BONUS_GIFT]: "action_type.bonus_gift",
  [ACTION_TYPE_ENUMS.SHAREHOLDER_DEPOSIT]: "action_type.shareholderDeposit",
  [ACTION_TYPE_ENUMS.INTEREST_DEDUCTION]: "action_type.interestDeduction",
  [ACTION_TYPE_ENUMS.INTEREST_PRINCIPAL]: "action_type.interestPrincipal",
  [ACTION_TYPE_ENUMS.INTEREST_EARNINGS]: "action_type.interestEarnings"
}
