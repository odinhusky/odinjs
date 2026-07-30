import { ACTION_TYPE_ENUMS } from "@shared-lib/constants/enums/actionType"
import type { GetMoneyHistoryItem } from "@shared-lib/api/apiFunctions/report_getMoneyHistoryList"

export const resolveActionTarget = (item: GetMoneyHistoryItem, locale: string) => {
  if (item.action_type === ACTION_TYPE_ENUMS.BET) {
    const productName = item.product_name || ""
    const gameName = item.game_name ? ` [${item.game_name}]` : ""
    return `${productName}${gameName}`.trim() || "-"
  }

  if (item.promotion_title && typeof item.promotion_title === "object") {
    return item.promotion_title[locale] || Object.values(item.promotion_title)[0] || "-"
  }

  return item.action_target || item.transaction_code || "-"
}

export const resolveActionCode = (item: GetMoneyHistoryItem) => {
  if (item.action_type === ACTION_TYPE_ENUMS.BET) {
    return item.wager_code || ""
  }

  return item.transaction_code || ""
}
