import { getMemberAgentBetReport } from "@shared-src/lib/api/apiFunctions/userInfo_getMemberAgentBetReport"
import { TANSTACK_QUERY_KEY_MEMBER_AGENT_BET_REPORT } from "@shared-src/lib/constants/tanstackQueryKeys"
import { formatMoney } from "@shared-src/lib/utils/formatMoney"
import { useApiQuery } from "@shared-src/lib/api/useApiQuery"
import { handleGlobalClick } from "../../utils/handleGlobalClick"

const DEFAULT_SIZE = 10

const resolveDateRange = (range: string[] | null): { startDate: string; endDate: string } | null => {
  if (!range || !range[0]) return null
  const startDate = range[0]
  const endDate = range[1] ?? range[0]
  return { startDate, endDate }
}

export const useBetReportTab = () => {
  const { pushToast } = useToastQueue()
  const { t } = useI18n()
  const { selectedWallet } = useCurrencyInfo()

  const cashCurrencyId = computed(() => Number(selectedWallet.value?.currency_id ?? 0))

  // ── 搜尋狀態 ──
  const page = ref(1)
  const size = ref(DEFAULT_SIZE)
  const offset = computed(() => (page.value - 1) * size.value)
  const totalRecords = ref(0)

  const memberAccount = ref("")
  const dateRange = ref<string[] | null>(null)

  const lastSearchMemberAccount = ref("")
  const lastSearchDateRange = ref<string[] | null>(null)

  // ── 結果資料 ──
  const betReportRows = ref<any[]>([])
  const betReportSummary = ref<any>(null)

  // ── API params（以 lastSearch 驅動）──
  const queryParams = computed(() => {
    const resolved = resolveDateRange(lastSearchDateRange.value)
    if (!resolved || cashCurrencyId.value <= 0) return null
    return {
      currency_id: cashCurrencyId.value,
      str_time: resolved.startDate,
      end_time: resolved.endDate,
      offset: offset.value,
      size: size.value,
      ...(lastSearchMemberAccount.value ? { member_account: lastSearchMemberAccount.value } : {})
    }
  })

  const {
    data: betReportData,
    isFetching,
    refetch
  } = useApiQuery(
    [TANSTACK_QUERY_KEY_MEMBER_AGENT_BET_REPORT, queryParams],
    getMemberAgentBetReport,
    queryParams as any,
    {
      enabled: computed(() => !!queryParams.value),
      select: (res: any) => res.data
    }
  )

  watch(betReportData, (data) => {
    if (!data) return
    betReportRows.value = data.list ?? []
    betReportSummary.value = data.summary ?? null
    totalRecords.value = data.total ?? 0
    if (data.size) {
      page.value = Math.floor(data.offset / data.size) + 1
    }
  })

  // ── 驗證日期 ──
  const validateDate = (): { startDate: string; endDate: string } | null => {
    const resolved = resolveDateRange(dateRange.value)
    if (!resolved) {
      pushToast({ severity: "warn", summary: "Validation", detail: t("placeholder.pleaseSelectDate"), life: 2200 })
      return null
    }
    if (new Date(resolved.startDate) > new Date(resolved.endDate)) {
      pushToast({ severity: "warn", summary: "Validation", detail: t("common.validate.startTimeMustBeBeforeEndTime"), life: 2200 })
      return null
    }
    return resolved
  }

  // ── 搜尋 ──
  const handleSearch = () => {
    handleGlobalClick({
      target: "handleBetReportSearchClick",
      debounceTimer: 200,
      callback: async () => {
        if (!validateDate()) return
        betReportRows.value = []
        betReportSummary.value = null
        page.value = 1
        lastSearchMemberAccount.value = memberAccount.value
        lastSearchDateRange.value = dateRange.value ? [...dateRange.value] : null
        await refetch()
      }
    })
  }

  // ── 分頁 ──
  const handlePageChange = (nextPage: number) => {
    handleGlobalClick({
      target: `handleBetReportPage${nextPage}Click`,
      debounceTimer: 120,
      callback: async () => {
        page.value = nextPage
        await refetch()
      }
    })
  }

  // ── 欄位格式化 ──
  const fmt = (val: any, isAmount = false): string => {
    if (val === null || val === undefined || val === "") return "-"
    return isAmount ? formatMoney(val) : String(val)
  }
  const fmtRate = (val: any): string =>
    val !== null && val !== undefined && val !== "" ? `${val}%` : "-"

  const normalizedRows = computed(() =>
    betReportRows.value.map((row) => ({
      ...row,
      bet_count_display: fmt(row.bet_count),
      win_count_display: fmt(row.win_count),
      bet_amount_display: fmt(row.bet_amount, true),
      valid_bet_amount_display: fmt(row.valid_bet_amount, true),
      payout_display: fmt(row.payout, true),
      profit_display: fmt(row.profit, true),
      profit_rate_display: fmtRate(row.profit_rate),
      bonus_display: fmt(row.bonus, true)
    }))
  )

  const makeSummaryRow = (s: any, label: string) => ({
    member_account: label,
    bet_count_display: fmt(s?.bet_count),
    win_count_display: fmt(s?.win_count),
    bet_amount_display: fmt(s?.bet_amount, true),
    valid_bet_amount_display: fmt(s?.valid_bet_amount, true),
    payout_display: fmt(s?.payout, true),
    profit_display: fmt(s?.profit, true),
    profit_rate_display: fmtRate(s?.profit_rate),
    bonus_display: fmt(s?.bonus, true)
  })

  const pageSummaryRow = computed(() =>
    betReportSummary.value?.page ? makeSummaryRow(betReportSummary.value.page, "本頁合計") : null
  )

  const totalSummaryRow = computed(() =>
    betReportSummary.value?.total ? makeSummaryRow(betReportSummary.value.total, "總合計") : null
  )

  return {
    page,
    size,
    totalRecords,
    memberAccount,
    dateRange,
    lastSearchDateRange,
    isFetching,
    normalizedRows,
    pageSummaryRow,
    totalSummaryRow,
    handleSearch,
    handlePageChange
  }
}

export type BetReportTabReturn = ReturnType<typeof useBetReportTab>
