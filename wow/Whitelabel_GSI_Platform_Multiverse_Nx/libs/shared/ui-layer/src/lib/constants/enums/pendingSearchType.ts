export enum PENDING_SEARCH_TYPE_ENUMS {
  /** 全部 */
  ALL = 0,

  /** 存款 */
  DEPOSIT = 1,

  /** 出款 */
  WITHDRAWAL = 2
}

export const PENDING_SEARCH_TYPE_I18N_KEYS: Record<PENDING_SEARCH_TYPE_ENUMS, string> = {
  [PENDING_SEARCH_TYPE_ENUMS.ALL]: "common.btn.all",
  [PENDING_SEARCH_TYPE_ENUMS.DEPOSIT]: "common.btn.deposit",
  [PENDING_SEARCH_TYPE_ENUMS.WITHDRAWAL]: "common.btn.withdrawal"
}

export const FP_I18N_KEYS: Record<PENDING_SEARCH_TYPE_ENUMS, string> = {
  [PENDING_SEARCH_TYPE_ENUMS.ALL]: "common.btn.all",
  [PENDING_SEARCH_TYPE_ENUMS.DEPOSIT]: "common.btn.cash_in",
  [PENDING_SEARCH_TYPE_ENUMS.WITHDRAWAL]: "common.btn.withdraw"
}

export const PENDING_SEARCH_TYPE_I18N_TITLES: Record<PENDING_SEARCH_TYPE_ENUMS, string> = {
  [PENDING_SEARCH_TYPE_ENUMS.ALL]: "common.btn.all",
  [PENDING_SEARCH_TYPE_ENUMS.DEPOSIT]: "menu.depositPendingStatus",
  [PENDING_SEARCH_TYPE_ENUMS.WITHDRAWAL]: "menu.withdrawalPendingStatus"
}

export const FP_I18N_TITLES: Record<PENDING_SEARCH_TYPE_ENUMS, string> = {
  [PENDING_SEARCH_TYPE_ENUMS.ALL]: "common.btn.all",
  [PENDING_SEARCH_TYPE_ENUMS.DEPOSIT]: "menu.pendingCashInStatus",
  [PENDING_SEARCH_TYPE_ENUMS.WITHDRAWAL]: "menu.withdrawPendingStatus"
}
