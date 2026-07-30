import { getMemberAgentWagerList } from "@shared-src/lib/api/apiFunctions/userInfo_getMemberAgentWagerList"
import type {
  GetMemberAgentWagerListItemData,
  GetMemberAgentWagerListItemSummary
} from "@shared-src/lib/api/apiFunctions/userInfo_getMemberAgentWagerList"
import { useMemberAgentWagerDetail } from "@shared-src/lib/api/hooks/useMemberAgentWagerDetail"
import { TANSTACK_QUERY_KEY_MEMBER_AGENT_WAGER_LIST } from "@shared-src/lib/constants/tanstackQueryKeys"
import { formatMoney } from "@shared-src/lib/utils/formatMoney"
import { useApiQuery } from "@shared-src/lib/api/useApiQuery"
import { handleGlobalClick } from "../../utils/handleGlobalClick"
import type {
  BetRecordDateTypeMode,
  BetRecordMobileSummaryRow,
  BetRecordSummaryRow
} from "./types"

const DEFAULT_SIZE = 10

const resolveDateRange = (range: string[] | null): { startDate: string; endDate: string } | null => {
  if (!range || !range[0]) return null
  const startDate = range[0]
  const endDate = range[1] ?? range[0]
  return { startDate, endDate }
}

const mapDateType = (mode: BetRecordDateTypeMode): number[] => {
  switch (mode) {
    case "all":
      return [2]
    case "settlementDate":
      return [1]
    case "betDate":
    default:
      return [0]
  }
}

const fmt = (val: unknown, isAmount = false): string => {
  if (val === null || val === undefined || val === "") return "-"
  return isAmount ? formatMoney(val as string | number) : String(val)
}

export const useBetRecordQuery = () => {
  const { pushToast } = useToastQueue()
  const { t } = useI18n()
  const { selectedWallet } = useCurrencyInfo()
  const { fetchWagerDetail, isPending: isDetailPending } = useMemberAgentWagerDetail()

  const cashCurrencyId = computed(() => Number(selectedWallet.value?.currency_id ?? 0))

  // ── 搜尋狀態 ──
  const page = ref(1)
  const size = ref(DEFAULT_SIZE)
  const offset = computed(() => (page.value - 1) * size.value)
  const totalRecords = ref(0)

  const memberAccount = ref("")
  const wagerCode = ref("")
  const dateRange = ref<string[] | null>(null)
  const dateTypeMode = ref<BetRecordDateTypeMode>("betDate")

  const lastSearchMemberAccount = ref("")
  const lastSearchWagerCode = ref("")
  const lastSearchDateRange = ref<string[] | null>(null)
  const lastSearchDateTypeMode = ref<BetRecordDateTypeMode>("betDate")

  // ── 結果資料 ──
  const rows = ref<GetMemberAgentWagerListItemData[]>([])
  const summary = ref<GetMemberAgentWagerListItemSummary | null>(null)

  // detail 開啟狀態
  const openingWagerCode = ref<string>("")

  // ── API params（由 lastSearch 驅動） ──
  const queryParams = computed(() => {
    const resolved = resolveDateRange(lastSearchDateRange.value)
    if (!resolved || cashCurrencyId.value <= 0) return null
    return {
      currency_id: cashCurrencyId.value,
      str_time: resolved.startDate,
      end_time: resolved.endDate,
      offset: offset.value,
      size: size.value,
      date_type: mapDateType(lastSearchDateTypeMode.value),
      ...(lastSearchMemberAccount.value ? { member_account: lastSearchMemberAccount.value } : {}),
      ...(lastSearchWagerCode.value ? { wager_code: lastSearchWagerCode.value } : {})
    }
  })

  const {
    data: wagerListData,
    isFetching,
    refetch
  } = useApiQuery(
    [TANSTACK_QUERY_KEY_MEMBER_AGENT_WAGER_LIST, queryParams],
    getMemberAgentWagerList,
    queryParams as any,
    {
      enabled: computed(() => !!queryParams.value),
      select: (res: any) => res.data
    }
  )

  watch(wagerListData, (data) => {
    if (!data) return
    rows.value = data.list ?? []
    summary.value = data.summary ?? null
    totalRecords.value = data.total ?? 0
    if (data.size) {
      page.value = Math.floor(data.offset / data.size) + 1
    }
  })

  // ── 驗證日期 ──
  const validateDate = (): { startDate: string; endDate: string } | null => {
    const resolved = resolveDateRange(dateRange.value)
    if (!resolved) {
      pushToast({
        severity: "warn",
        summary: "Validation",
        detail: t("placeholder.pleaseSelectDate"),
        life: 2200
      })
      return null
    }
    if (new Date(resolved.startDate) > new Date(resolved.endDate)) {
      pushToast({
        severity: "warn",
        summary: "Validation",
        detail: t("common.validate.startTimeMustBeBeforeEndTime"),
        life: 2200
      })
      return null
    }
    return resolved
  }

  // ── 搜尋 ──
  const handleSearch = () => {
    handleGlobalClick({
      target: "handleBetRecordQuerySearchClick",
      debounceTimer: 200,
      callback: async () => {
        if (!validateDate()) return
        rows.value = []
        summary.value = null
        page.value = 1
        lastSearchMemberAccount.value = memberAccount.value.trim()
        lastSearchWagerCode.value = wagerCode.value.trim()
        lastSearchDateRange.value = dateRange.value ? [...dateRange.value] : null
        lastSearchDateTypeMode.value = dateTypeMode.value
        await refetch()
      }
    })
  }

  // ── 分頁 ──
  const handlePageChange = (nextPage: number) => {
    handleGlobalClick({
      target: `handleBetRecordQueryPage${nextPage}Click`,
      debounceTimer: 120,
      callback: async () => {
        page.value = nextPage
        await refetch()
      }
    })
  }

  // ── 取得行 / 摘要顯示 ──
  const normalizedRows = computed(() =>
    rows.value.map((row) => ({
      ...row,
      _rowKey: row.wager_code,
      gaming_site_display: fmt(row.gaming_site_title) !== "-" ? row.gaming_site_title : fmt(row.gaming_site),
      status_display: fmt(row.status_title) !== "-" ? row.status_title : fmt(row.status),
      created_at_display: fmt(row.created_at),
      settled_at_display: fmt(row.settled_at),
      channel_code_display: fmt(row.channel_code),
      product_display: fmt(row.product_title),
      game_display: fmt(row.game_title),
      bet_amount_display: fmt(row.bet_amount, true),
      valid_bet_amount_display: fmt(row.valid_bet_amount, true),
      payout_display: fmt(row.payout, true),
      profit_display: fmt(row.profit, true),
      bonus_display: "-"
    }))
  )

  const buildSummaryRow = (
    label: string,
    src: GetMemberAgentWagerListItemSummary["page"] | undefined
  ): BetRecordSummaryRow => ({
    label,
    bet_amount_display: fmt(src?.bet_amount, true),
    valid_bet_amount_display: fmt(src?.valid_bet_amount, true),
    payout_display: fmt(src?.payout, true),
    profit_display: fmt(src?.profit, true),
    bonus_display: "-"
  })

  const pageSummaryRow = computed<BetRecordSummaryRow | null>(() =>
    summary.value?.page ? buildSummaryRow("本頁總計", summary.value.page) : null
  )

  const totalSummaryRow = computed<BetRecordSummaryRow | null>(() =>
    summary.value?.total ? buildSummaryRow("搜尋結果總計", summary.value.total) : null
  )

  // H5 金額總計卡片用：項目 / 本頁總計 / 搜尋結果總計
  const mobileSummaryRows = computed<BetRecordMobileSummaryRow[]>(() => {
    const pg = summary.value?.page
    const tt = summary.value?.total
    const make = (
      label: string,
      pageVal: string | undefined,
      totalVal: string | undefined,
      isAmount = true
    ): BetRecordMobileSummaryRow => ({
      label,
      pageValue: fmt(pageVal, isAmount),
      totalValue: fmt(totalVal, isAmount)
    })
    return [
      make("投注金額", pg?.bet_amount, tt?.bet_amount),
      make("有效投注", pg?.valid_bet_amount, tt?.valid_bet_amount),
      make("派彩", pg?.payout, tt?.payout),
      make("盈虧", pg?.profit, tt?.profit),
      make("活動獎金", undefined, undefined)
    ]
  })

  const hasRows = computed(() => rows.value.length > 0)
  const isEmpty = computed(() => !isFetching.value && rows.value.length === 0)

  // ── 開啟第三方派彩詳細頁 ──
  const handleOpenDetail = (row: GetMemberAgentWagerListItemData) => {
    if (!row?.wager_code) return
    handleGlobalClick({
      target: `handleBetRecordOpenDetail`,
      debounceTimer: 200,
      callback: async () => {
        openingWagerCode.value = row.wager_code
        // 預先開啟空白分頁避免 popup blocker
        const newWindow = window.open("", "_blank")
        try {
          const detail = await fetchWagerDetail({
            wager_code: row.wager_code,
            product_code: row.product_code
          })
          if (detail?.content) {
            if (newWindow) {
              newWindow.location.href = detail.content
            } else {
              window.open(detail.content, "_blank")
            }
          } else {
            newWindow?.close()
            pushToast({
              severity: "warn",
              summary: "Detail",
              detail: t("common.noData"),
              life: 2200
            })
          }
        } catch (_err) {
          newWindow?.close()
        } finally {
          openingWagerCode.value = ""
        }
      }
    })
  }

  // ── 跨 tab 入口（從投注報表 drill-down） ──
  const applyDrillDown = (account: string, range: string[] | null) => {
    memberAccount.value = account ?? ""
    wagerCode.value = ""
    if (range && range[0]) {
      dateRange.value = [...range]
    }
    handleSearch()
  }

  return {
    // state
    page,
    size,
    totalRecords,
    memberAccount,
    wagerCode,
    dateRange,
    dateTypeMode,
    lastSearchDateRange,
    isFetching,
    isDetailPending,
    openingWagerCode,
    // computed
    normalizedRows,
    pageSummaryRow,
    totalSummaryRow,
    mobileSummaryRows,
    hasRows,
    isEmpty,
    // actions
    handleSearch,
    handlePageChange,
    handleOpenDetail,
    applyDrillDown
  }
}

export type BetRecordQueryReturn = ReturnType<typeof useBetRecordQuery>
