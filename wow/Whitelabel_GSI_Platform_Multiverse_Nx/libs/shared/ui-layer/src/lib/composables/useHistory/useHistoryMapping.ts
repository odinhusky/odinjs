import { ACTION_TYPE_ENUMS } from "@shared-lib/constants/enums/actionType"
import { HISTORY_SEARCH_TYPE_ENUMS } from "@shared-lib/constants/enums/historySearchType"
import { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"
import { HISTORY_UPDATED_BY_TYPE_ENUMS } from "@shared-lib/constants/enums/HistoryUpdatedByType"

export const HISTORY_SEARCH_TO_ACTION_TYPES = (type: HISTORY_SEARCH_TYPE_ENUMS): string[] => {
  const all = Object.values(ACTION_TYPE_ENUMS).filter((value): value is ACTION_TYPE_ENUMS => typeof value === "number")

  if (type === HISTORY_SEARCH_TYPE_ENUMS.DEPOSIT) {
    return all
      .filter((item) => [ACTION_TYPE_ENUMS.DEPOSIT, ACTION_TYPE_ENUMS.ADJUSMENT_DEPOSIT].includes(item))
      .map((item) => String(item))
  }

  if (type === HISTORY_SEARCH_TYPE_ENUMS.WITHDRAWAL) {
    return all
      .filter((item) =>
        [
          ACTION_TYPE_ENUMS.WITHDRAWAL,
          ACTION_TYPE_ENUMS.ADJUSMENT_WITHDRAWAL,
          ACTION_TYPE_ENUMS.WITHDRAWAL_REJECTED
        ].includes(item)
      )
      .map((item) => String(item))
  }

  if (type === HISTORY_SEARCH_TYPE_ENUMS.BET_HISTORY) {
    return [String(ACTION_TYPE_ENUMS.BET)]
  }

  if (type === HISTORY_SEARCH_TYPE_ENUMS.PROMOTION) {
    return all
      .filter(
        (item) =>
          item > ACTION_TYPE_ENUMS.WITHDRAWAL_REJECTED &&
          ![
            ACTION_TYPE_ENUMS.INTEREST_DEDUCTION,
            ACTION_TYPE_ENUMS.INTEREST_PRINCIPAL,
            ACTION_TYPE_ENUMS.INTEREST_EARNINGS
          ].includes(item)
      )
      .map((item) => String(item))
  }

  if (type === HISTORY_SEARCH_TYPE_ENUMS.INTEREST_RECORD) {
    return [
      String(ACTION_TYPE_ENUMS.INTEREST_DEDUCTION),
      String(ACTION_TYPE_ENUMS.INTEREST_PRINCIPAL),
      String(ACTION_TYPE_ENUMS.INTEREST_EARNINGS)
    ]
  }

  return all.map((item) => String(item))
}

export const walletTypeLabelMap: Record<number, string> = {
  [WALLET_TYPE_ENUMS.CASH]: "現金",
  [WALLET_TYPE_ENUMS.BONUS]: "撲滿",
  [WALLET_TYPE_ENUMS.REWARD]: "贈金"
}

export const actionTypeLabelMap: Partial<Record<ACTION_TYPE_ENUMS, string>> = {
  [ACTION_TYPE_ENUMS.DEPOSIT]: "存款",
  [ACTION_TYPE_ENUMS.ADJUSMENT_DEPOSIT]: "手動存款",
  [ACTION_TYPE_ENUMS.WITHDRAWAL]: "出金",
  [ACTION_TYPE_ENUMS.ADJUSMENT_WITHDRAWAL]: "手動出金",
  [ACTION_TYPE_ENUMS.WITHDRAWAL_REJECTED]: "拒絕提款",
  [ACTION_TYPE_ENUMS.BET]: "下注",
  [ACTION_TYPE_ENUMS.PROMOTION]: "優惠",
  [ACTION_TYPE_ENUMS.REBATE]: "返水",
  [ACTION_TYPE_ENUMS.INTEREST_DEDUCTION]: "利息寶扣款",
  [ACTION_TYPE_ENUMS.INTEREST_PRINCIPAL]: "利息寶本金",
  [ACTION_TYPE_ENUMS.INTEREST_EARNINGS]: "利息寶利息"
}

export const betMethodLabelMap: Record<number, string> = {
  [HISTORY_UPDATED_BY_TYPE_ENUMS.All]: "全部",
  [HISTORY_UPDATED_BY_TYPE_ENUMS.Member]: "會員",
  [HISTORY_UPDATED_BY_TYPE_ENUMS.Ai]: "Ai"
}
