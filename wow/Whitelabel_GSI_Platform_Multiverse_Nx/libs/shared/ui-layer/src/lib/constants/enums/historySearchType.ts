/** 歷史紀錄頁面選單列表 */
export enum HISTORY_SEARCH_TYPE_ENUMS {
  /** 全部 */
  ALL = 0,

  /** 存款 => 存款、手動存款 */
  DEPOSIT = 1,

  /** 取款 => 提款、手動提款、拒絕提款 */
  WITHDRAWAL,

  /** 投注記錄 */
  BET_HISTORY,

  /** 獎金 => 優惠、反水、贈金轉帳、VIP獎勵、生日獎勵、代理佣金、合營代理返佣 */
  PROMOTION,

  /** 利息寶 => 利息寶扣款、利息寶本金、利息寶利息 */
  INTEREST_RECORD
}

export const HISTORY_SEARCH_TYPE_I18N_KEYS: Record<HISTORY_SEARCH_TYPE_ENUMS | 0, string> = {
  [HISTORY_SEARCH_TYPE_ENUMS.ALL]: "common.btn.all",
  [HISTORY_SEARCH_TYPE_ENUMS.DEPOSIT]: "common.btn.deposit",
  [HISTORY_SEARCH_TYPE_ENUMS.WITHDRAWAL]: "common.btn.withdrawal",
  [HISTORY_SEARCH_TYPE_ENUMS.BET_HISTORY]: "common.btn.betHistory",
  [HISTORY_SEARCH_TYPE_ENUMS.PROMOTION]: "common.btn.bonus",
  [HISTORY_SEARCH_TYPE_ENUMS.INTEREST_RECORD]: "interest.record"
}

export const HISTORY_SEARCH_I18N_KEYS: Record<HISTORY_SEARCH_TYPE_ENUMS | 0, string> = {
  [HISTORY_SEARCH_TYPE_ENUMS.ALL]: "common.btn.all",
  [HISTORY_SEARCH_TYPE_ENUMS.DEPOSIT]: "common.btn.cash_in",
  [HISTORY_SEARCH_TYPE_ENUMS.WITHDRAWAL]: "common.btn.withdraw",
  [HISTORY_SEARCH_TYPE_ENUMS.BET_HISTORY]: "common.btn.betHistory",
  [HISTORY_SEARCH_TYPE_ENUMS.PROMOTION]: "common.btn.bonus",
  [HISTORY_SEARCH_TYPE_ENUMS.INTEREST_RECORD]: "interest.record"
}

export const HISTORY_SEARCH_I18N_TITLE: Record<HISTORY_SEARCH_TYPE_ENUMS | 0, string> = {
  [HISTORY_SEARCH_TYPE_ENUMS.ALL]: "common.btn.all",
  [HISTORY_SEARCH_TYPE_ENUMS.DEPOSIT]: "menu.depositHistory",
  [HISTORY_SEARCH_TYPE_ENUMS.WITHDRAWAL]: "menu.withdrawalHistory",
  [HISTORY_SEARCH_TYPE_ENUMS.BET_HISTORY]: "common.btn.betHistory",
  [HISTORY_SEARCH_TYPE_ENUMS.PROMOTION]: "menu.bonusHistory",
  [HISTORY_SEARCH_TYPE_ENUMS.INTEREST_RECORD]: "interest.record"
}

export const HISTORY_SEARCH_FP_I18N_TITLE: Record<HISTORY_SEARCH_TYPE_ENUMS | 0, string> = {
  [HISTORY_SEARCH_TYPE_ENUMS.ALL]: "common.btn.all",
  [HISTORY_SEARCH_TYPE_ENUMS.DEPOSIT]: "menu.cashInHistory",
  [HISTORY_SEARCH_TYPE_ENUMS.WITHDRAWAL]: "menu.withdrawHistory",
  [HISTORY_SEARCH_TYPE_ENUMS.BET_HISTORY]: "common.btn.betHistory",
  [HISTORY_SEARCH_TYPE_ENUMS.PROMOTION]: "menu.bonusHistory",
  [HISTORY_SEARCH_TYPE_ENUMS.INTEREST_RECORD]: "interest.record"
}
