import { HISTORY_SEARCH_TYPE_ENUMS } from "@shared-lib/constants/enums/historySearchType"

export type HistoryTabKey = "deposit" | "withdraw" | "bet" | "promotion" | "interest"

export interface HistoryFilterState {
  currencyCode: string
  walletType: number | 0
  betMethod: number
  dateRange: string[]
}

export const HISTORY_TAB_CONFIG: Record<
  HistoryTabKey,
  { label: string; searchType: HISTORY_SEARCH_TYPE_ENUMS; noDataType: "empty" | "gift" | "card" }
> = {
  deposit: { label: "存款", searchType: HISTORY_SEARCH_TYPE_ENUMS.DEPOSIT, noDataType: "empty" },
  withdraw: { label: "出金", searchType: HISTORY_SEARCH_TYPE_ENUMS.WITHDRAWAL, noDataType: "empty" },
  bet: { label: "投注歷史", searchType: HISTORY_SEARCH_TYPE_ENUMS.BET_HISTORY, noDataType: "empty" },
  promotion: { label: "獎金", searchType: HISTORY_SEARCH_TYPE_ENUMS.PROMOTION, noDataType: "empty" },
  interest: { label: "交易紀錄", searchType: HISTORY_SEARCH_TYPE_ENUMS.INTEREST_RECORD, noDataType: "empty" }
}

export const HISTORY_ROWS_PER_PAGE = 8
export const HISTORY_MAX_ROWS_PER_PAGE = 100
export const DEFAULT_DATE_TYPE = 1
export const ALL_CURRENCY_CODE = "__all__"

export const clampRowsPerPage = (value: number, max = HISTORY_MAX_ROWS_PER_PAGE) => {
  if (!Number.isFinite(value)) return HISTORY_ROWS_PER_PAGE
  if (value < 1) return 1
  if (value > max) return max
  return Math.floor(value)
}
