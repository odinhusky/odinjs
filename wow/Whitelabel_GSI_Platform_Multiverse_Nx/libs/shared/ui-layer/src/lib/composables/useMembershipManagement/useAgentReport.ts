import { getMemberAgentReport } from "@shared-src/lib/api/apiFunctions/userInfo_getMemberAgentReport"
import type { GetMemberAgentReportResponseType } from "@shared-src/lib/api/apiFunctions/userInfo_getMemberAgentReport"
import { getMemberTeamAgentReport } from "@shared-src/lib/api/apiFunctions/userInfo_getMemberTeamAgentReport"
import type {
  GetMemberTeamAgentReportResponseItem,
  GetMemberTeamAgentReportResponseType
} from "@shared-src/lib/api/apiFunctions/userInfo_getMemberTeamAgentReport"
import {
  TANSTACK_QUERY_KEY_MEMBER_AGENT_REPORT,
  TANSTACK_QUERY_KEY_MEMBER_TEAM_AGENT_REPORT
} from "@shared-src/lib/constants/tanstackQueryKeys"
import { formatMoney } from "@shared-src/lib/utils/formatMoney"
import { useApiQuery } from "@shared-src/lib/api/useApiQuery"
import { handleGlobalClick } from "../../utils/handleGlobalClick"
import type {
  AgentReportMobileSummaryRow,
  AgentReportSelfRow,
  AgentReportSummaryCardData,
  AgentReportTeamRow
} from "./types"

const DEFAULT_SIZE = 10
const MAX_RANGE_DAYS = 31

const pad = (n: number) => String(n).padStart(2, "0")
const formatDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

const last7Days = (): string[] => {
  const today = new Date()
  const start = new Date()
  start.setDate(today.getDate() - 6)
  return [formatDate(start), formatDate(today)]
}

const resolveDateRange = (range: string[] | null): { startDate: string; endDate: string } | null => {
  if (!range || !range[0]) return null
  const startDate = range[0]
  const endDate = range[1] ?? range[0]
  return { startDate, endDate }
}

const dayDiff = (start: string, end: string): number => {
  const a = new Date(start).getTime()
  const b = new Date(end).getTime()
  if (isNaN(a) || isNaN(b)) return 0
  return Math.floor((b - a) / 86_400_000) + 1
}

const fmt = (val: unknown, isAmount = false): string => {
  if (val === null || val === undefined || val === "") return "-"
  return isAmount ? formatMoney(val as string | number) : String(val)
}

const fmtRate = (val: unknown): string =>
  val !== null && val !== undefined && val !== "" ? `${val}%` : "-"

export const useAgentReport = () => {
  const { pushToast } = useToastQueue()
  const { t } = useI18n()
  const { selectedWallet, walletOptions } = useCurrencyInfo()
  const { accountInfo } = useAccountInfo()

  const selfAccount = computed(() => accountInfo.value?.account ?? "")
  const cashCurrencyId = computed(() => Number(selectedWallet.value?.currency_id ?? 0))

  // ── 搜尋狀態 ──
  const page = ref(1)
  const size = ref(DEFAULT_SIZE)
  const offset = computed(() => (page.value - 1) * size.value)
  const totalRecords = ref(0)

  const currencyId = ref<number | null>(null)
  const dateRange = ref<string[] | null>(last7Days())

  const lastSearchCurrencyId = ref<number | null>(null)
  const lastSearchDateRange = ref<string[] | null>(null)

  // ── 結果資料 ──
  const personalOverview = ref<GetMemberAgentReportResponseType | null>(null)
  const teamRows = ref<GetMemberTeamAgentReportResponseItem[]>([])

  const isSearching = ref(false)

  // 預設帶入現金幣別
  watch(
    cashCurrencyId,
    (id) => {
      if (id && currencyId.value === null) currencyId.value = id
    },
    { immediate: true }
  )

  const currencyOptions = computed(() =>
    walletOptions.value.map((w) => ({
      label: w.label,
      value: w.currencyId
    }))
  )

  // ── personal overview query ──
  const personalParams = computed(() => {
    const resolved = resolveDateRange(lastSearchDateRange.value)
    if (!resolved || !lastSearchCurrencyId.value) return null
    return {
      currency_id: lastSearchCurrencyId.value,
      start_time: resolved.startDate,
      end_time: resolved.endDate
    }
  })

  const {
    data: personalData,
    isFetching: isFetchingPersonal,
    refetch: refetchPersonal
  } = useApiQuery(
    [TANSTACK_QUERY_KEY_MEMBER_AGENT_REPORT, personalParams],
    getMemberAgentReport,
    personalParams as any,
    {
      enabled: computed(() => !!personalParams.value),
      select: (res: any) => res.data
    }
  )

  watch(personalData, (data) => {
    if (data) personalOverview.value = data
  })

  // ── team list query ──
  const teamParams = computed(() => {
    const resolved = resolveDateRange(lastSearchDateRange.value)
    if (!resolved || !lastSearchCurrencyId.value) return null
    return {
      currency_id: lastSearchCurrencyId.value,
      start_time: resolved.startDate,
      end_time: resolved.endDate,
      offset: offset.value,
      size: size.value
    }
  })

  const {
    data: teamData,
    isFetching: isFetchingTeam,
    refetch: refetchTeam
  } = useApiQuery(
    [TANSTACK_QUERY_KEY_MEMBER_TEAM_AGENT_REPORT, teamParams],
    getMemberTeamAgentReport,
    teamParams as any,
    {
      enabled: computed(() => !!teamParams.value),
      select: (res: any) => res.data
    }
  )

  watch(teamData, (data: GetMemberTeamAgentReportResponseType | undefined) => {
    if (!data) return
    teamRows.value = data.list ?? []
    totalRecords.value = data.pagination?.total ?? 0
    if (data.pagination?.size) {
      page.value = Math.floor(data.pagination.offset / data.pagination.size) + 1
    }
  })

  // ── 驗證 ──
  const validate = (): { startDate: string; endDate: string } | null => {
    if (!currencyId.value) {
      pushToast({
        severity: "warn",
        summary: "Validation",
        detail: t("placeholder.pleaseSelect"),
        life: 2200
      })
      return null
    }
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
    if (dayDiff(resolved.startDate, resolved.endDate) > MAX_RANGE_DAYS) {
      pushToast({
        severity: "warn",
        summary: "Validation",
        detail: t("common.validate.dateRangeMax31Days"),
        life: 2200
      })
      return null
    }
    return resolved
  }

  // ── 搜尋 ──
  const handleSearch = () => {
    handleGlobalClick({
      target: "handleAgentReportSearchClick",
      debounceTimer: 200,
      callback: async () => {
        if (!validate()) return
        isSearching.value = true
        personalOverview.value = null
        teamRows.value = []
        page.value = 1
        lastSearchCurrencyId.value = currencyId.value
        lastSearchDateRange.value = dateRange.value ? [...dateRange.value] : null
        try {
          await Promise.all([refetchPersonal(), refetchTeam()])
        } finally {
          isSearching.value = false
        }
      }
    })
  }

  // ── 團隊分頁（不重撈 personal）──
  const handlePageChange = (nextPage: number) => {
    handleGlobalClick({
      target: `handleAgentReportPage${nextPage}Click`,
      debounceTimer: 120,
      callback: async () => {
        page.value = nextPage
        await refetchTeam()
      }
    })
  }

  // ── 顯示用 computed ──
  const summaryCards = computed<AgentReportSummaryCardData>(() => ({
    account:
      personalOverview.value?.team?.member_account ||
      selfAccount.value ||
      "-",
    teamCount:
      personalOverview.value?.team?.member_count != null
        ? String(personalOverview.value.team.member_count)
        : "0"
  }))

  const buildSelfRow = (
    label: string,
    src:
      | GetMemberAgentReportResponseType["personal"]
      | GetMemberAgentReportResponseType["team"]
      | undefined
  ): AgentReportSelfRow => ({
    label,
    bet_count_display: fmt(src?.bet_count),
    deposit_display: fmt(src?.deposit, true),
    withdraw_display: fmt(src?.withdraw, true),
    bet_amount_display: fmt(src?.bet_amount, true),
    valid_bet_display: fmt(src?.valid_bet, true),
    prize_display: fmt(src?.prize, true),
    profit_display: fmt(src?.profit, true),
    rate_display: fmtRate(src?.rate),
    bonus_display: fmt(src?.bonus, true)
  })

  const selfTableRows = computed<AgentReportSelfRow[]>(() => [
    buildSelfRow("自身數據", personalOverview.value?.personal),
    buildSelfRow("團隊", personalOverview.value?.team)
  ])

  const teamTableRows = computed<AgentReportTeamRow[]>(() =>
    teamRows.value.map((row) => ({
      member_id: row.member_id,
      member_account: row.member_account,
      member_count_display: fmt(row.member_count),
      bet_count_display: fmt(row.bet_count),
      deposit_display: fmt(row.deposit, true),
      withdraw_display: fmt(row.withdraw, true),
      bet_amount_display: fmt(row.bet_amount, true),
      valid_bet_display: fmt(row.valid_bet, true),
      prize_display: fmt(row.prize, true),
      profit_display: fmt(row.profit, true),
      rate_display: fmtRate(row.rate),
      bonus_display: fmt(row.bonus, true)
    }))
  )

  // H5 金額總計：用 personal/team 對應 page/total（暫以 personal 為「本頁」、team 為「結果」展示）
  const mobileSummaryRows = computed<AgentReportMobileSummaryRow[]>(() => {
    const p = personalOverview.value?.personal
    const tt = personalOverview.value?.team
    const row = (label: string, pageVal: unknown, totalVal: unknown): AgentReportMobileSummaryRow => ({
      label,
      pageValue: fmt(pageVal, true),
      totalValue: fmt(totalVal, true)
    })
    return [
      row("投注金額", p?.bet_amount, tt?.bet_amount),
      row("有效投注", p?.valid_bet, tt?.valid_bet),
      row("派彩", p?.prize, tt?.prize),
      row("盈虧", p?.profit, tt?.profit),
      row("活動獎金", p?.bonus, tt?.bonus)
    ]
  })

  const hasTeamRows = computed(() => teamRows.value.length > 0)
  const isTeamEmpty = computed(() => !isFetchingTeam.value && teamRows.value.length === 0)

  return {
    // state
    page,
    size,
    totalRecords,
    currencyId,
    dateRange,
    isSearching,
    isFetchingPersonal,
    isFetchingTeam,
    // computed
    currencyOptions,
    summaryCards,
    selfTableRows,
    teamTableRows,
    mobileSummaryRows,
    hasTeamRows,
    isTeamEmpty,
    // actions
    handleSearch,
    handlePageChange
  }
}

export type AgentReportReturn = ReturnType<typeof useAgentReport>
