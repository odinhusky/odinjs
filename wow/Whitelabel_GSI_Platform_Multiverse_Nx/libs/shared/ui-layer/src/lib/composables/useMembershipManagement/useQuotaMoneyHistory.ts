import type {
  GetMemberAgentQuotaMoneyHistory,
  GetMemberAgentQuotaMoneyHistoryParamsType
} from "@shared-src/lib/api/apiFunctions/userInfo_getMemberAgentQuotaMoneyHistory"
import { useMemberAgentQuotaMoneyHistory } from "@shared-src/lib/api/hooks/useMemberAgentQuotaMoneyHistory"
import { MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS } from "@shared-src/lib/constants/enums/memberAgentQuotaSearchType"
import { formatMoney } from "@shared-src/lib/utils/formatMoney"
import { DateTime } from "luxon"
import { handleGlobalClick } from "../../utils/handleGlobalClick"
import type { QuotaMoneyHistoryRow } from "./types"

const DEFAULT_SIZE = 10

const ACTION_TYPE_OPTIONS = [
  { label: "全部", value: MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.ALL },
  { label: "加款", value: MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.MANUAL_ADDITION },
  { label: "扣款", value: MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.MANUAL_DEDUCTION }
]

const ACTION_TYPE_LABELS: Record<number, string> = {
  [MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.DEPOSIT]: "存款",
  [MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.WITHDRAWAL]: "出款",
  [MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.MANUAL_ADDITION]: "代理加款",
  [MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.MANUAL_DEDUCTION]: "代理扣款",
  [MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.BET_RECORD]: "投注紀錄"
}

const resolveDateRange = (range: string[] | null): { startDate: string; endDate: string } | null => {
  if (!range || !range[0]) return null
  return {
    startDate: range[0],
    endDate: range[1] ?? range[0]
  }
}

const fmt = (value: unknown, isAmount = false) => {
  if (value === null || value === undefined || value === "") return "-"
  if (!isAmount) return String(value)
  return formatMoney(value as string | number)
}

const fmtDate = (value: unknown) => {
  if (typeof value !== "string" || !value.trim()) return "-"
  const iso = DateTime.fromISO(value, { setZone: true })
  if (iso.isValid) return iso.toFormat("yyyy-MM-dd HH:mm:ss")
  const sql = DateTime.fromSQL(value)
  return sql.isValid ? sql.toFormat("yyyy-MM-dd HH:mm:ss") : value
}

const getActionTarget = (row: GetMemberAgentQuotaMoneyHistory) => {
  return (
    row.product_name ||
    row.game_name ||
    row.promotion_title ||
    row.wager_code ||
    row.transaction_code ||
    "-"
  )
}

const mapRow = (row: GetMemberAgentQuotaMoneyHistory): QuotaMoneyHistoryRow => {
  const id = row.id ?? row.transaction_code ?? row.updated_at_unix
  return {
    id,
    _rowKey: `${id}-${row.member_account || "member"}`,
    member_account: fmt(row.member_account),
    updated_at_display: fmtDate(row.updated_at),
    action_type_display: ACTION_TYPE_LABELS[row.action_type] || "-",
    action_target_display: fmt(getActionTarget(row)),
    amount_display: fmt(row.amount, true),
    before_balance_display: fmt(row.before_balance, true),
    after_balance_display: fmt(row.after_balance, true),
    currency_code: fmt(row.currency_code),
    transaction_code: fmt(row.transaction_code),
    wager_code: fmt(row.wager_code)
  }
}

export const useQuotaMoneyHistory = () => {
  const { pushToast } = useToastQueue()
  const { t } = useI18n()

  const page = ref(1)
  const size = ref(DEFAULT_SIZE)
  const totalRecords = ref(0)

  const memberAccount = ref("")
  const searchType = ref<MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS>(MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.ALL)
  const dateRange = ref<string[] | null>(null)

  const requestParams = reactive<GetMemberAgentQuotaMoneyHistoryParamsType>({
    member_account: "",
    search_type: MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.ALL,
    str_time: "",
    end_time: "",
    offset: "0",
    size: String(DEFAULT_SIZE)
  })

  const {
    memberAgentQuotaMoneyHistory,
    isFetching,
    refetch
  } = useMemberAgentQuotaMoneyHistory({
    params: requestParams
  })

  watch(memberAgentQuotaMoneyHistory, (data) => {
    if (!data) return
    totalRecords.value = data.total ?? 0
    if (data.size) {
      page.value = Math.floor(Number(data.offset || 0) / Number(data.size || DEFAULT_SIZE)) + 1
    }
  })

  const normalizedRows = computed(() => (memberAgentQuotaMoneyHistory.value?.list ?? []).map(mapRow))

  const validateDate = () => {
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

  const syncRequestParams = (resolved: { startDate: string; endDate: string }) => {
    Object.assign(requestParams, {
      member_account: memberAccount.value.trim(),
      search_type: searchType.value,
      str_time: resolved.startDate,
      end_time: resolved.endDate,
      offset: String((page.value - 1) * size.value),
      size: String(size.value)
    })
  }

  const loadData = async () => {
    const resolved = validateDate()
    if (!resolved) return
    syncRequestParams(resolved)
    await refetch()
  }

  const handleSearch = () => {
    handleGlobalClick({
      target: "handleQuotaMoneyHistorySearchClick",
      debounceTimer: 200,
      callback: async () => {
        page.value = 1
        await loadData()
      }
    })
  }

  const handlePageChange = (nextPage: number) => {
    handleGlobalClick({
      target: `handleQuotaMoneyHistoryPage${nextPage}Click`,
      debounceTimer: 120,
      callback: async () => {
        page.value = nextPage
        await loadData()
      }
    })
  }

  return {
    page,
    size,
    totalRecords,
    memberAccount,
    searchType,
    dateRange,
    actionTypeOptions: ACTION_TYPE_OPTIONS,
    normalizedRows,
    isFetching,
    handleSearch,
    handlePageChange
  }
}
