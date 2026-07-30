import type { Router, RouteLocationNormalizedLoaded } from "vue-router"
import { HISTORY_UPDATED_BY_TYPE_ENUMS } from "@shared-lib/constants/enums/HistoryUpdatedByType"
import {
  clampRowsPerPage,
  DEFAULT_DATE_TYPE,
  HISTORY_TAB_CONFIG,
  type HistoryFilterState,
  type HistoryTabKey
} from "./useHistoryTypes"
import { parseQueryNumber, parseWalletTypesQuery, resolveTabFromSearchType } from "./useHistoryQuery"

interface InitHistoryQueryPayload {
  route: RouteLocationNormalizedLoaded
  filterState: HistoryFilterState
  activeTab: { value: HistoryTabKey }
  page: { value: number }
  initialRowsPerPage?: { value: number }
  initialCurrencyId: { value: number | null }
}

export const initHistoryQuery = ({
  route,
  filterState,
  activeTab,
  page,
  initialRowsPerPage,
  initialCurrencyId
}: InitHistoryQueryPayload) => {
  const searchType = parseQueryNumber(route.query.search_type)
  if (searchType !== undefined) {
    activeTab.value = resolveTabFromSearchType(searchType)
  }

  const queryStartDate = Array.isArray(route.query.start_date) ? route.query.start_date[0] : route.query.start_date
  const queryEndDate = Array.isArray(route.query.end_date) ? route.query.end_date[0] : route.query.end_date
  if (typeof queryStartDate === "string" && typeof queryEndDate === "string" && queryStartDate && queryEndDate) {
    filterState.dateRange = [queryStartDate, queryEndDate]
  }

  const queryPage = parseQueryNumber(route.query.page)
  if (queryPage && queryPage > 0) {
    page.value = queryPage
  }

  const queryRowsPerPage = parseQueryNumber(route.query.rowsPerPage)
  if (initialRowsPerPage && queryRowsPerPage && queryRowsPerPage > 0) {
    initialRowsPerPage.value = clampRowsPerPage(queryRowsPerPage)
  }

  const queryWalletTypes = parseWalletTypesQuery(route.query.walletTypes)
  filterState.walletType = (queryWalletTypes[0] as number) || 0

  const queryBetMethod = parseQueryNumber(route.query.updated_by)
  if (queryBetMethod === HISTORY_UPDATED_BY_TYPE_ENUMS.Member || queryBetMethod === HISTORY_UPDATED_BY_TYPE_ENUMS.Ai) {
    filterState.betMethod = queryBetMethod
  }

  const queryCurrencyId = parseQueryNumber(route.query.currency_id)
  if (queryCurrencyId !== undefined) {
    initialCurrencyId.value = queryCurrencyId
  }
}

interface SyncHistoryQueryPayload {
  router: Router
  activeTab: { value: HistoryTabKey }
  filterState: HistoryFilterState
  selectedCurrencyId: { value: number }
  page: { value: number }
  requestParams: {
    start_date?: string
    end_date?: string
    size: number
    wallet_types: unknown[]
  }
}

export const syncHistoryQueryToRoute = async ({
  router,
  activeTab,
  filterState,
  selectedCurrencyId,
  page,
  requestParams
}: SyncHistoryQueryPayload) => {
  await router.replace({
    query: {
      search_type: String(HISTORY_TAB_CONFIG[activeTab.value].searchType),
      updated_by: String(filterState.betMethod),
      currency_id: String(selectedCurrencyId.value),
      start_date: requestParams.start_date,
      end_date: requestParams.end_date,
      page: String(page.value),
      rowsPerPage: String(requestParams.size),
      dateType: String(DEFAULT_DATE_TYPE),
      walletTypes: JSON.stringify(requestParams.wallet_types)
    }
  })
}
