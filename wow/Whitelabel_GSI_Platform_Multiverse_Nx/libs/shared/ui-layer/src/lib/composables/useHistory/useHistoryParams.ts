import { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"
import { HISTORY_UPDATED_BY_TYPE_ENUMS } from "@shared-lib/constants/enums/HistoryUpdatedByType"
import type { GetMoneyHistoryListParamTypes } from "@shared-lib/api/apiFunctions/report_getMoneyHistoryList"
import type { GetMoneyHistoryTotalParamTypes } from "@shared-lib/api/apiFunctions/report_getMoneyHistoryTotal"
import { HISTORY_SEARCH_TO_ACTION_TYPES } from "./useHistoryMapping"
import {
  HISTORY_TAB_CONFIG,
  type HistoryFilterState,
  type HistoryTabKey
} from "./useHistoryTypes"

interface HydrateHistoryParamsPayload {
  activeTab: { value: HistoryTabKey }
  filterState: HistoryFilterState
  page: { value: number }
  selectedCurrencyId: { value: number }
  requestParams: GetMoneyHistoryListParamTypes
  totalParams: GetMoneyHistoryTotalParamTypes
}

export const hydrateHistoryParams = ({
  activeTab,
  filterState,
  page,
  selectedCurrencyId,
  requestParams,
  totalParams
}: HydrateHistoryParamsPayload) => {
  const currentTab = HISTORY_TAB_CONFIG[activeTab.value]
  const [startDate, endDate] = filterState.dateRange

  requestParams.search_type = HISTORY_SEARCH_TO_ACTION_TYPES(currentTab.searchType)
  requestParams.start_date = startDate || ""
  requestParams.end_date = endDate || ""
  requestParams.offset = (page.value - 1) * requestParams.size
  requestParams.wallet_types = filterState.walletType ? [filterState.walletType as WALLET_TYPE_ENUMS] : []
  requestParams.currency_id = String(selectedCurrencyId.value)
  requestParams.updated_by =
    activeTab.value === "bet" && filterState.betMethod !== HISTORY_UPDATED_BY_TYPE_ENUMS.All
      ? String(filterState.betMethod)
      : undefined

  totalParams.start_date = startDate || ""
  totalParams.end_date = endDate || ""
  totalParams.wallet_types = requestParams.wallet_types
  totalParams.currency_id = String(selectedCurrencyId.value)
  totalParams.updated_by = requestParams.updated_by
}
