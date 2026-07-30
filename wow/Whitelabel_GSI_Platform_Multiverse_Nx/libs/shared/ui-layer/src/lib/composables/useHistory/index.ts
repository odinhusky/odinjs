import { ACTION_TYPE_ENUMS } from "@shared-lib/constants/enums/actionType"
import { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"
import { HISTORY_UPDATED_BY_TYPE_ENUMS } from "@shared-lib/constants/enums/HistoryUpdatedByType"
import type { GetMoneyHistoryItem } from "@shared-lib/api/apiFunctions/report_getMoneyHistoryList"
import type { GetMoneyHistoryListParamTypes } from "@shared-lib/api/apiFunctions/report_getMoneyHistoryList"
import type { GetMoneyHistoryTotalParamTypes } from "@shared-lib/api/apiFunctions/report_getMoneyHistoryTotal"
import {
  actionTypeLabelMap,
  betMethodLabelMap,
  HISTORY_SEARCH_TO_ACTION_TYPES,
  walletTypeLabelMap
} from "./useHistoryMapping"
import { hydrateHistoryParams } from "./useHistoryParams"
import { createDefaultDateRange } from "./useHistoryQuery"
import { initHistoryQuery, syncHistoryQueryToRoute } from "./useHistoryRoute"
import { resolveActionCode, resolveActionTarget } from "./useHistoryResolver"
import {
  ALL_CURRENCY_CODE,
  HISTORY_ROWS_PER_PAGE,
  HISTORY_TAB_CONFIG,
  type HistoryFilterState,
  type HistoryTabKey
} from "./useHistoryTypes"

export const useHistory = () => {
  const { locale } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const { walletOptions, walletList, selectedCurrencyCode } = useCurrencyInfo()

  const activeTab = ref<HistoryTabKey>("deposit")
  const page = ref(1)
  const initialCurrencyId = ref<number | null>(null)
  const isCurrencyDefaultResolved = ref(false)
  const isInitialLoadDone = ref(false)
  const initialRowsPerPage = ref(HISTORY_ROWS_PER_PAGE)

  const filterState = reactive<HistoryFilterState>({
    currencyCode: ALL_CURRENCY_CODE,
    walletType: 0,
    betMethod: HISTORY_UPDATED_BY_TYPE_ENUMS.All,
    dateRange: createDefaultDateRange()
  })

  initHistoryQuery({
    route,
    filterState,
    activeTab,
    page,
    initialRowsPerPage,
    initialCurrencyId
  })

  const requestParams = reactive<GetMoneyHistoryListParamTypes>({
    search_type: HISTORY_SEARCH_TO_ACTION_TYPES(HISTORY_TAB_CONFIG[activeTab.value].searchType),
    start_date: "",
    end_date: "",
    offset: 0,
    size: initialRowsPerPage.value,
    wallet_types: []
  })

  const totalParams = reactive<GetMoneyHistoryTotalParamTypes>({
    start_date: "",
    end_date: "",
    currency_id: "0"
  })

  const {
    moneyHistoryList,
    refetch: refetchMoneyHistoryList,
    isFetching: isMoneyHistoryListFetching
  } = useMoneyHistoryList({
    params: requestParams
  })

  const {
    moneyHistoryTotal,
    refetch: refetchMoneyHistoryTotal,
    isFetching: isMoneyHistoryTotalFetching
  } = useMoneyHistoryTotal({
    params: totalParams
  })

  const tabOptions = computed(() => {
    return Object.entries(HISTORY_TAB_CONFIG).map(([key, item]) => ({ key: key as HistoryTabKey, label: item.label }))
  })

  const walletTypeOptions = computed(() => {
    return [
      { label: "全部", value: 0 },
      { label: "現金", value: WALLET_TYPE_ENUMS.CASH },
      { label: "撲滿", value: WALLET_TYPE_ENUMS.BONUS },
      { label: "贈金", value: WALLET_TYPE_ENUMS.REWARD }
    ]
  })

  const betMethodOptions = computed(() => {
    return [
      { label: "全部", value: HISTORY_UPDATED_BY_TYPE_ENUMS.All },
      { label: "會員", value: HISTORY_UPDATED_BY_TYPE_ENUMS.Member },
      { label: "Ai", value: HISTORY_UPDATED_BY_TYPE_ENUMS.Ai }
    ]
  })

  const walletOptionsWithAll = computed(() => {
    return [
      {
        label: "全部",
        value: ALL_CURRENCY_CODE,
        currencyCode: ALL_CURRENCY_CODE,
        currencyId: 0,
        balance: 0
      },
      ...walletOptions.value
    ]
  })

  const selectedCurrencyId = computed(() => {
    if (!filterState.currencyCode || filterState.currencyCode === ALL_CURRENCY_CODE) return 0

    const selectedWallet = walletList.value.find((item) => item.currency_code === filterState.currencyCode)
    return Number(selectedWallet?.currency_id ?? 0)
  })

  const normalizedRows = computed(() => {
    const list = (moneyHistoryList.value?.list || []) as GetMoneyHistoryItem[]

    return list.map((item) => {
      const target = resolveActionTarget(item, locale.value)
      const actionCode = resolveActionCode(item)
      const actionTarget = target !== "-" && actionCode && target !== actionCode ? `${target} (${actionCode})` : target

      return {
        id: item.id,
        updatedAt: formatHistoryDateTime(item.updated_at),
        currencyCode: formatHistoryCurrencyCode(item.currency_code),
        walletTypeLabel: walletTypeLabelMap[item.wallet_type] || "-",
        actionTypeLabel: actionTypeLabelMap[item.action_type as ACTION_TYPE_ENUMS] || "-",
        actionTarget: actionTarget || actionCode || "-",
        betMethodLabel: betMethodLabelMap[item.updated_by ?? HISTORY_UPDATED_BY_TYPE_ENUMS.Member] || "會員",
        amount: formatHistoryAmount(item.amount),
        beforeBalance: formatHistoryAmount(item.before_balance),
        afterBalance: formatHistoryAmount(item.after_balance),
        transactionCode: item.transaction_code || "-",
        wagerCode: item.wager_code || "-"
      }
    })
  })

  const totalRecords = computed(() => {
    if ((moneyHistoryList.value?.list || []).length > 0) {
      return moneyHistoryList.value?.pagination?.total || normalizedRows.value.length
    }

    return normalizedRows.value.length
  })
  const shouldFetchBetTotal = computed(() => activeTab.value === "bet" && selectedCurrencyId.value !== 0)
  const validBetAmount = computed(() =>
    shouldFetchBetTotal.value ? moneyHistoryTotal.value?.valid_bet_amount_total || "0" : "-"
  )
  const winLossAmount = computed(() =>
    shouldFetchBetTotal.value ? moneyHistoryTotal.value?.player_profit || "0" : "0"
  )
  const selectedNoDataType = computed(() => HISTORY_TAB_CONFIG[activeTab.value].noDataType)

  const loadHistory = async ({ syncQuery = true }: { syncQuery?: boolean } = {}) => {
    hydrateHistoryParams({
      activeTab,
      filterState,
      page,
      selectedCurrencyId,
      requestParams,
      totalParams
    })

    await refetchMoneyHistoryList()

    if (shouldFetchBetTotal.value) {
      await refetchMoneyHistoryTotal()
    }

    if (syncQuery) {
      await syncHistoryQueryToRoute({
        router,
        activeTab,
        filterState,
        selectedCurrencyId,
        page,
        requestParams
      })
    }
  }

  watch(
    walletOptionsWithAll,
    (options) => {
      if (!options?.length) return

      if (initialCurrencyId.value !== null) {
        const matchedWallet = walletList.value.find((item) => Number(item.currency_id) === initialCurrencyId.value)
        filterState.currencyCode = String(matchedWallet?.currency_code || ALL_CURRENCY_CODE)
        initialCurrencyId.value = null
        isCurrencyDefaultResolved.value = true
      }

      if (
        !isCurrencyDefaultResolved.value &&
        filterState.currencyCode === ALL_CURRENCY_CODE &&
        selectedCurrencyCode.value
      ) {
        filterState.currencyCode = selectedCurrencyCode.value
        isCurrencyDefaultResolved.value = true
      }

      if (!filterState.currencyCode) {
        filterState.currencyCode = ALL_CURRENCY_CODE
      }

      if (!isInitialLoadDone.value) {
        isInitialLoadDone.value = true
        void loadHistory({ syncQuery: true })
      }
    },
    { immediate: true }
  )

  const handleSearch = () => {
    handleGlobalClick({
      target: "handleHistoryFilterSearchClick",
      debounceTimer: 200,
      callback: async () => {
        page.value = 1
        await loadHistory()
      }
    })
  }

  const handleTabChange = (tab: HistoryTabKey) => {
    handleGlobalClick({
      target: `handleHistoryTab${tab}Click`,
      debounceTimer: 180,
      callback: async () => {
        activeTab.value = tab
        page.value = 1
        await loadHistory()
      }
    })
  }

  const handlePageChange = (nextPage: number) => {
    handleGlobalClick({
      target: `handleHistoryPage${nextPage}ChangeClick`,
      debounceTimer: 120,
      callback: async () => {
        page.value = nextPage
        await loadHistory()
      }
    })
  }

  return {
    activeTab,
    tabOptions,
    filterState,
    walletOptions: walletOptionsWithAll,
    walletTypeOptions,
    betMethodOptions,
    page,
    rowsPerPage: requestParams.size,
    totalRecords,
    rows: normalizedRows,
    selectedNoDataType,
    validBetAmount,
    winLossAmount,
    isLoading: computed(() => isMoneyHistoryListFetching.value || isMoneyHistoryTotalFetching.value),
    handleTabChange,
    handleSearch,
    handlePageChange
  }
}
