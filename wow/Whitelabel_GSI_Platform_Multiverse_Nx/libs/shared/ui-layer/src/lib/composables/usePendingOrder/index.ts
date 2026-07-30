import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"
import { PENDING_SEARCH_TYPE_ENUMS } from "@shared-lib/constants/enums/pendingSearchType"
import { PENDING_STATUS_ENUMS } from "@shared-lib/constants/enums/pendingStatus"
import type { GetMoneyPendingParamTypes as PendingOrderListParams } from "@shared-lib/api/apiFunctions/report_getPendingHistoryList"
import { createDefaultDateRange, parseQueryNumber } from "../useHistory/useHistoryQuery"
import { HISTORY_MAX_ROWS_PER_PAGE, HISTORY_ROWS_PER_PAGE, clampRowsPerPage } from "../useHistory/useHistoryTypes"
import {
  getPendingPaymentMethodKey,
  getPendingStatusLabel,
  getPendingStatusTheme,
  IGNORE_UPLOAD_DETAIL_FUND_TYPES,
  isPendingSearchTypeValue,
  isPendingStatusValue,
  PENDING_STATUS_ALL,
  PENDING_STATUS_OPTIONS,
  PENDING_TAB_CONFIG,
  type PendingTabKey,
  resolvePendingTabFromSearchType,
  resolveSearchTypeFromTab
} from "./usePendingOrderTypes"

export interface PendingOrderRowView {
  id: string
  orderType: PENDING_SEARCH_TYPE_ENUMS
  transCode: string
  isBankTransfer: boolean
  paymentType?: FUND_METHOD_TYPE_ENUMS
  paymentTypeLabel: string
  paymentGatewayName: string
  currencyCode: string
  amount: string
  actualAmount: string
  submitDate: string
  status: PENDING_STATUS_ENUMS
  statusLabel: string
  statusTheme: "base" | "fail" | "success" | "warning" | "info"
  canUpload: boolean
  canCancel: boolean
  needUploadDetailFundType: boolean
  remarkReadOnly: boolean
}

export const usePendingOrder = () => {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const { walletList } = useCurrencyInfo()

  const activeTab = ref<PendingTabKey>("deposit")
  const page = ref(1)
  const rowsPerPage = ref(HISTORY_ROWS_PER_PAGE)
  const selectedStatus = ref<number>(PENDING_STATUS_ALL)
  const dateRange = ref<string[]>(createDefaultDateRange())

  const requestParams = reactive<PendingOrderListParams>({
    search_type: PENDING_SEARCH_TYPE_ENUMS.DEPOSIT,
    start_date: "",
    end_date: "",
    offset: 0,
    size: HISTORY_ROWS_PER_PAGE
  })

  const {
    pendingOrderHistory,
    refetch: refetchPendingOrderHistory,
    isFetching: isPendingOrderFetching
  } = usePendingOrderHistory({
    params: requestParams
  })

  const { cancelPendingOrder, isPending: isCancelPending } = usePendingOrderCancel()

  const tabOptions = computed(() => {
    return Object.entries(PENDING_TAB_CONFIG).map(([key, item]) => ({ key: key as PendingTabKey, label: item.label }))
  })

  const statusOptions = computed(() => [...PENDING_STATUS_OPTIONS])

  const currencyCodeById = (currencyId?: number) => {
    if (!currencyId) return "-"
    const matched = walletList.value.find((item) => Number(item.currency_id) === Number(currencyId))
    return matched?.currency_code || "-"
  }

  const rawRows = computed<PendingOrderRowView[]>(() => {
    const list = (pendingOrderHistory.value?.list || []) as Array<Record<string, unknown>>

    return list.map((item, index) => {
      const status = ((item.status as PENDING_STATUS_ENUMS | undefined) ||
        PENDING_STATUS_ENUMS.PENDING) as PENDING_STATUS_ENUMS
      const orderType = ((item.order_type as PENDING_SEARCH_TYPE_ENUMS | undefined) ||
        resolveSearchTypeFromTab(activeTab.value)) as PENDING_SEARCH_TYPE_ENUMS
      const paymentType = item.payment_type as FUND_METHOD_TYPE_ENUMS | undefined
      const needUploadFlag = item["needUploadDetailFundType"]
      const currencyNumber = Number(item.currency)
      const currencyId = Number.isFinite(currencyNumber) && currencyNumber > 0 ? currencyNumber : undefined
      const needUploadDetailFundType =
        typeof needUploadFlag === "boolean"
          ? needUploadFlag
          : !IGNORE_UPLOAD_DETAIL_FUND_TYPES.includes(paymentType as FUND_METHOD_TYPE_ENUMS)
      const isBankTransfer = paymentType === FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER

      const canCancel =
        status === PENDING_STATUS_ENUMS.PENDING &&
        !(paymentType === FUND_METHOD_TYPE_ENUMS.E_WALLET && orderType === PENDING_SEARCH_TYPE_ENUMS.WITHDRAWAL)
      const canUpload = status !== PENDING_STATUS_ENUMS.CANCEL && needUploadDetailFundType

      return {
        id: `${String(item.trans_code || "")}-${index}`,
        orderType,
        transCode: String(item.trans_code || ""),
        isBankTransfer,
        paymentType,
        paymentTypeLabel: t(getPendingPaymentMethodKey(paymentType)),
        paymentGatewayName: String(item.payment_gateway_name || "-"),
        currencyCode: currencyCodeById(currencyId),
        amount: formatHistoryAmount(String(item.amount || "")),
        actualAmount: formatHistoryAmount(String(item.actual_amount || "")),
        submitDate: formatHistoryDateTime(String(item.submit_date || "")),
        status,
        statusLabel: getPendingStatusLabel(status),
        statusTheme: getPendingStatusTheme(status),
        canUpload,
        canCancel,
        needUploadDetailFundType,
        remarkReadOnly: !canUpload
      }
    })
  })

  const rows = computed(() => {
    if (selectedStatus.value === PENDING_STATUS_ALL) return rawRows.value
    return rawRows.value.filter((item) => Number(item.status) === Number(selectedStatus.value))
  })

  const totalRecords = computed(() => {
    if (selectedStatus.value === PENDING_STATUS_ALL) {
      return pendingOrderHistory.value?.pagination?.total || rawRows.value.length
    }

    return rows.value.length
  })

  const syncQueryToRoute = async () => {
    await router.replace({
      query: {
        search_type: String(resolveSearchTypeFromTab(activeTab.value)),
        start_date: requestParams.start_date,
        end_date: requestParams.end_date,
        page: String(page.value),
        rowsPerPage: String(rowsPerPage.value),
        status: String(selectedStatus.value)
      }
    })
  }

  const hydrateRequestParams = () => {
    const [startDate, endDate] = dateRange.value
    requestParams.search_type = resolveSearchTypeFromTab(activeTab.value)
    requestParams.start_date = startDate || ""
    requestParams.end_date = endDate || ""
    requestParams.offset = (page.value - 1) * requestParams.size
  }

  const loadPendingOrders = async ({ syncQuery = true }: { syncQuery?: boolean } = {}) => {
    hydrateRequestParams()
    await refetchPendingOrderHistory()

    if (syncQuery) {
      await syncQueryToRoute()
    }
  }

  const initFromRoute = () => {
    const querySearchType = parseQueryNumber(route.query.search_type)
    if (querySearchType !== undefined && isPendingSearchTypeValue(querySearchType)) {
      activeTab.value = resolvePendingTabFromSearchType(querySearchType)
    }

    const queryStartDate = Array.isArray(route.query.start_date) ? route.query.start_date[0] : route.query.start_date
    const queryEndDate = Array.isArray(route.query.end_date) ? route.query.end_date[0] : route.query.end_date
    if (typeof queryStartDate === "string" && typeof queryEndDate === "string" && queryStartDate && queryEndDate) {
      dateRange.value = [queryStartDate, queryEndDate]
    }

    const queryPage = parseQueryNumber(route.query.page)
    if (queryPage && queryPage > 0) {
      page.value = queryPage
    }

    const queryRowsPerPage = parseQueryNumber(route.query.rowsPerPage)
    if (queryRowsPerPage && queryRowsPerPage > 0) {
      rowsPerPage.value = clampRowsPerPage(queryRowsPerPage, HISTORY_MAX_ROWS_PER_PAGE)
    }

    const queryStatus = parseQueryNumber(route.query.status)
    if (queryStatus !== undefined && isPendingStatusValue(queryStatus)) {
      selectedStatus.value = queryStatus
    }
  }

  initFromRoute()

  onMounted(async () => {
    await loadPendingOrders({ syncQuery: true })
  })

  const handleSearch = () => {
    handleGlobalClick({
      target: "handlePendingFilterSearchClick",
      debounceTimer: 200,
      callback: async () => {
        page.value = 1
        await loadPendingOrders()
      }
    })
  }

  const handleTabChange = (tab: PendingTabKey) => {
    handleGlobalClick({
      target: `handlePendingTab${tab}Click`,
      debounceTimer: 180,
      callback: async () => {
        activeTab.value = tab
        page.value = 1
        await loadPendingOrders()
      }
    })
  }

  const handlePageChange = (nextPage: number) => {
    handleGlobalClick({
      target: `handlePendingPage${nextPage}ChangeClick`,
      debounceTimer: 120,
      callback: async () => {
        page.value = nextPage
        await loadPendingOrders()
      }
    })
  }

  const handleStatusChange = async (status: number) => {
    selectedStatus.value = status
    page.value = 1
    await syncQueryToRoute()
  }

  const handleCancelOrder = async (row: PendingOrderRowView) => {
    if (!row.canCancel) return

    await cancelPendingOrder({
      order_type: String(row.orderType),
      trans_code: row.transCode
    })

    await loadPendingOrders({ syncQuery: false })
  }

  return {
    activeTab,
    tabOptions,
    statusOptions,
    selectedStatus,
    dateRange,
    page,
    rowsPerPage,
    rows,
    totalRecords,
    isLoading: computed(() => isPendingOrderFetching.value || isCancelPending.value),
    handleTabChange,
    handleSearch,
    handlePageChange,
    handleStatusChange,
    handleCancelOrder,
    reload: loadPendingOrders
  }
}
