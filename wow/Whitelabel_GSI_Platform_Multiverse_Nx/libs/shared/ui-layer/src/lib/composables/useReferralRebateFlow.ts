import { computed, onMounted, ref, watch } from "vue"
import { useClipboard } from "@vueuse/core"
import { useAvailableCurrencyList } from "../api/hooks/useAvailableCurrencyList"
import { useReferralInfoQuery } from "../api/hooks/useReferralInfoQuery"
import { useSetting } from "../api/hooks/useSetting"
import {
  useReferralRebateEventDetailQuery,
  useReferralRebateEventsQuery,
  useReferralRebateGroupQuery,
  useReferralRebateStatementQuery,
  useReferralRebateSummaryQuery
} from "../api/hooks/useReferralRebateQueries"
import { useUserInfo } from "../api/hooks/useUserInfo"
import type { CurrencyItemType } from "../api/apiFunctions/bank_getAvailableCurrencyList"
import type { ReferralRebateEventsItem } from "../api/apiFunctions/referralRebate_getReferralRebateEvents"
import type { ReferralRebateStatementsItem } from "../api/commonTypes/referralRebateTypes"
import { GAME_TYPE_ENUMS, GAME_TYPE_I18N_KEYS } from "../constants/enums/gameType"
import { useWalletStore } from "../stores/wallet"
import { formatMoney } from "../utils/formatMoney"
import { normalizeDateRangeBoundaryIfNeeded, toRfc3339 } from "../utils/useRfc3339"
import {
  buildReferralRebateEventsParams,
  buildReferralRebateEventDetailParams,
  buildReferralRebateStatementParams,
  canAccessReferralRebate,
  getInitialReferralRebateDateRange,
  REFERRAL_REBATE_ALL_GAME_TYPE,
  type ReferralRebateDateRange,
  type ReferralRebateTarget
} from "./referralRebateFlowHelpers"

export type ReferralRebateTab = "current" | "events"

export interface ReferralRebatePaginationState {
  page: number
  pageSize: number
  total: number
}

export interface ReferralRebateFilterState {
  account: string
  gameType: number
  dateRange: string[]
}

export interface ReferralRebateSelectOption {
  label: string
  value: string | number
}

export interface ReferralRebateCurrencyOption extends ReferralRebateSelectOption {
  code: string
}

export interface UseReferralRebateFlowOptions {
  pageSize?: number
}

export interface ReferralRebateStatementDisplayRow extends ReferralRebateStatementsItem {
  currency_code: string
  rate_display: string
  valid_bet_amount_display: string
  profit_display: string
  revenue_amount_display: string
}

export interface ReferralRebateEventDisplayRow extends ReferralRebateEventsItem {
  currency_code: string
  settlement_time_display: string
  distribution_time_display: string
  valid_bet_amount_display: string
  profit_display: string
  revenue_amount_display: string
}

const DEFAULT_PAGE_SIZE = 20

const normalizeDateRange = (dateRange: string[]): ReferralRebateDateRange => {
  const defaultRange = getInitialReferralRebateDateRange()
  return {
    from: dateRange[0] || defaultRange.from,
    to: dateRange[1] || defaultRange.to
  }
}

const normalizePagination = (
  pagination: { page?: number; offset?: number; size?: number; total?: number } | undefined,
  pageSize: number
): ReferralRebatePaginationState => {
  const size = Number(pagination?.size || pageSize)
  const offset = Number(pagination?.offset || 0)
  return {
    page: Number(pagination?.page || Math.floor(offset / Math.max(size, 1)) + 1),
    pageSize: size,
    total: Number(pagination?.total || 0)
  }
}

const formatDateTime = (value: string | undefined) => {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const datePart = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("/")
  const timePart = [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((item) => String(item).padStart(2, "0"))
    .join(":")
  return `${datePart} ${timePart}`
}

const createDefaultPagination = (pageSize: number): ReferralRebatePaginationState => ({
  page: 1,
  pageSize,
  total: 0
})

const toFilterDateRange = (dateRange: ReferralRebateDateRange) => [dateRange.from, dateRange.to]

export const useReferralRebateFlow = (options: UseReferralRebateFlowOptions = {}) => {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE
  const { t } = useI18n()
  const walletStore = useWalletStore()
  const { copy, isSupported: isClipboardSupported } = useClipboard()
  const { fetchAvailableCurrencyList, isPending: isCurrencyLoading } = useAvailableCurrencyList()
  const { userInfo, isLoading: isUserInfoLoading } = useUserInfo()
  const { setting: utcOffsetSetting, isLoading: isSettingLoading } = useSetting<number | undefined>({
    selector: (setting) => setting.utc_offset
  })

  const activeTab = ref<ReferralRebateTab>("current")
  const selectedEvent = ref<ReferralRebateEventDisplayRow | null>(null)
  const currencyList = ref<CurrencyItemType[]>([])
  const selectedCurrencyId = ref<number | null>(null)
  const inputFilters = ref<ReferralRebateFilterState>({
    account: "",
    gameType: REFERRAL_REBATE_ALL_GAME_TYPE,
    dateRange: toFilterDateRange(getInitialReferralRebateDateRange())
  })
  const appliedFilters = ref<ReferralRebateFilterState>({ ...inputFilters.value })
  const currentPagination = ref(createDefaultPagination(pageSize))
  const eventsPagination = ref(createDefaultPagination(pageSize))
  const detailPagination = ref(createDefaultPagination(pageSize))
  const copiedReferralCode = ref(false)

  const groupQuery = useReferralRebateGroupQuery()
  const referralInfoQuery = useReferralInfoQuery()

  const selectedCurrency = computed(() => currencyList.value.find((item) => item.id === selectedCurrencyId.value) ?? null)
  const selectedCurrencyCode = computed(() => selectedCurrency.value?.code ?? "")
  const referralCode = computed(() => referralInfoQuery.data.value?.code || "-")
  const referralUrl = computed(() => referralInfoQuery.data.value?.url || "")
  const hasCurrency = computed(() => Number(selectedCurrencyId.value) > 0)
  const isUtcOffsetReady = computed(() => utcOffsetSetting.value !== undefined && utcOffsetSetting.value !== null)
  const utcOffsetMinutes = computed(() => Number(utcOffsetSetting.value ?? 0))
  const hasAccess = computed(() =>
    canAccessReferralRebate(groupQuery.data.value?.rebate_target as ReferralRebateTarget | undefined, Boolean(userInfo.value?.is_member_agent))
  )
  const isAccessReady = computed(() => !groupQuery.isLoading.value && !isUserInfoLoading.value)
  const isVisible = computed(() => isAccessReady.value && hasAccess.value)
  const canQueryData = computed(() => isVisible.value && hasCurrency.value && isUtcOffsetReady.value)
  const showEventDetail = computed(() => activeTab.value === "events" && selectedEvent.value !== null)

  const currencyOptions = computed<ReferralRebateCurrencyOption[]>(() =>
    currencyList.value.map((item) => ({
      label: item.code,
      value: item.id,
      code: item.code
    }))
  )

  const gameTypeOptions = computed<ReferralRebateSelectOption[]>(() => [
    {
      label: t("menu.all"),
      value: REFERRAL_REBATE_ALL_GAME_TYPE
    },
    ...Object.values(GAME_TYPE_ENUMS)
      .filter((value): value is GAME_TYPE_ENUMS => typeof value === "number")
      .map((value) => ({
        label: t(GAME_TYPE_I18N_KEYS[value]),
        value
      }))
  ])

  const summaryParams = computed(() => {
    const dateRange = normalizeDateRange(appliedFilters.value.dateRange)
    const startTime =
      toRfc3339(normalizeDateRangeBoundaryIfNeeded("start_time", dateRange.from), utcOffsetMinutes.value) ?? dateRange.from
    const endTime = toRfc3339(normalizeDateRangeBoundaryIfNeeded("end_time", dateRange.to), utcOffsetMinutes.value) ?? dateRange.to

    return {
      currency_id: selectedCurrencyId.value || 0,
      start_time: startTime,
      end_time: endTime
    }
  })

  const currentStatementParams = computed(() =>
    buildReferralRebateStatementParams({
      currencyId: selectedCurrencyId.value || 0,
      account: appliedFilters.value.account,
      gameType: appliedFilters.value.gameType,
      dateRange: {
        from: summaryParams.value.start_time,
        to: summaryParams.value.end_time
      },
      page: currentPagination.value.page,
      size: currentPagination.value.pageSize
    })
  )

  const eventsParams = computed(() =>
    buildReferralRebateEventsParams({
      currencyId: selectedCurrencyId.value || 0,
      dateRange: {
        from: summaryParams.value.start_time,
        to: summaryParams.value.end_time
      },
      page: eventsPagination.value.page,
      size: eventsPagination.value.pageSize
    })
  )

  const eventDetailParams = computed(
    () =>
      buildReferralRebateEventDetailParams({
        eventId: selectedEvent.value?.id || 0,
        currencyId: selectedCurrencyId.value || 0,
        account: appliedFilters.value.account,
        gameType: appliedFilters.value.gameType,
        page: detailPagination.value.page,
        size: detailPagination.value.pageSize
      }).query
  )

  const summaryQuery = useReferralRebateSummaryQuery({
    params: summaryParams,
    options: {
      enabled: canQueryData
    }
  })
  const currentStatementQuery = useReferralRebateStatementQuery({
    params: currentStatementParams,
    options: {
      enabled: computed(() => canQueryData.value && activeTab.value === "current")
    }
  })
  const eventsQuery = useReferralRebateEventsQuery({
    params: eventsParams,
    options: {
      enabled: computed(() => canQueryData.value && activeTab.value === "events" && !selectedEvent.value)
    }
  })
  const eventDetailQuery = useReferralRebateEventDetailQuery({
    eventId: computed(() => selectedEvent.value?.id || null),
    params: eventDetailParams,
    options: {
      enabled: computed(() => canQueryData.value && Boolean(selectedEvent.value))
    }
  })

  const summary = computed(() => summaryQuery.data.value)
  const currentRows = computed(() => currentStatementQuery.data.value?.list ?? [])
  const eventRows = computed(() => eventsQuery.data.value?.list ?? [])
  const detailRows = computed(() => eventDetailQuery.data.value?.list ?? [])

  const totalValidBetAmount = computed(() => formatMoney(summary.value?.valid_bet_amount))
  const totalProfit = computed(() => formatMoney(summary.value?.profit))
  const totalRevenueAmount = computed(() => formatMoney(summary.value?.revenue_amount))

  const toStatementDisplayRow = (row: ReferralRebateStatementsItem): ReferralRebateStatementDisplayRow => ({
    ...row,
    currency_code: selectedCurrencyCode.value,
    rate_display: `${row.rate}%`,
    valid_bet_amount_display: formatMoney(row.valid_bet_amount),
    profit_display: formatMoney(row.profit),
    revenue_amount_display: formatMoney(row.revenue_amount)
  })

  const currentDisplayRows = computed(() => currentRows.value.map(toStatementDisplayRow))
  const detailDisplayRows = computed(() => detailRows.value.map(toStatementDisplayRow))
  const eventDisplayRows = computed<ReferralRebateEventDisplayRow[]>(() =>
    eventRows.value.map((row) => ({
      ...row,
      currency_code: selectedCurrencyCode.value,
      settlement_time_display: formatDateTime(row.settlement_time),
      distribution_time_display: formatDateTime(row.distribution_time),
      valid_bet_amount_display: formatMoney(row.valid_bet_amount),
      profit_display: formatMoney(row.profit),
      revenue_amount_display: formatMoney(row.revenue_amount)
    }))
  )

  const activePagination = computed(() => {
    if (showEventDetail.value) return detailPagination.value
    if (activeTab.value === "events") return eventsPagination.value
    return currentPagination.value
  })

  const activeRows = computed(() => {
    if (showEventDetail.value) return detailDisplayRows.value
    if (activeTab.value === "events") return eventDisplayRows.value
    return currentDisplayRows.value
  })

  const isPageLoading = computed(
    () => isCurrencyLoading.value || groupQuery.isLoading.value || isUserInfoLoading.value || isSettingLoading.value
  )
  const isActiveListLoading = computed(() => {
    if (showEventDetail.value) return eventDetailQuery.isLoading.value || eventDetailQuery.isFetching.value
    if (activeTab.value === "events") return eventsQuery.isLoading.value || eventsQuery.isFetching.value
    return currentStatementQuery.isLoading.value || currentStatementQuery.isFetching.value
  })

  const normalizeSelectedCurrency = () => {
    if (!currencyList.value.length) {
      selectedCurrencyId.value = null
      return
    }

    const activeWallet = walletStore.walletList.find((item) => item.in_use)
    const walletMatchedCurrency = currencyList.value.find(
      (item) => item.id === Number(activeWallet?.currency_id) || item.code === activeWallet?.currency_code
    )

    selectedCurrencyId.value = walletMatchedCurrency?.id ?? currencyList.value[0]?.id ?? null
  }

  const fetchCurrencies = async () => {
    const response = await fetchAvailableCurrencyList()
    currencyList.value = response.data?.currencies ?? []
    normalizeSelectedCurrency()
  }

  const resetPages = () => {
    currentPagination.value.page = 1
    eventsPagination.value.page = 1
    detailPagination.value.page = 1
  }

  const changeCurrency = (currencyId: number) => {
    if (!currencyId || selectedCurrencyId.value === currencyId) return
    selectedCurrencyId.value = currencyId
    resetPages()
  }

  const changeTab = (tab: ReferralRebateTab) => {
    if (activeTab.value === tab && !selectedEvent.value) return
    activeTab.value = tab
    selectedEvent.value = null
    resetPages()
  }

  const search = () => {
    appliedFilters.value = {
      account: inputFilters.value.account.trim(),
      gameType: Number(inputFilters.value.gameType),
      dateRange: [...inputFilters.value.dateRange]
    }
    resetPages()
  }

  const showEventStatement = (event: ReferralRebateEventDisplayRow) => {
    selectedEvent.value = event
    detailPagination.value.page = 1
  }

  const backToEvents = () => {
    selectedEvent.value = null
    detailPagination.value.page = 1
  }

  const updatePage = (page: number) => {
    if (showEventDetail.value) {
      detailPagination.value.page = page
      return
    }
    if (activeTab.value === "events") {
      eventsPagination.value.page = page
      return
    }
    currentPagination.value.page = page
  }

  const copyReferralText = async (text: string) => {
    if (!text || text === "-" || !isClipboardSupported.value) return

    await copy(text)
    copiedReferralCode.value = true
    globalThis.setTimeout(() => {
      copiedReferralCode.value = false
    }, 1500)
  }

  const copyReferralCode = async () => {
    await copyReferralText(referralCode.value)
  }

  const copyReferralUrl = async () => {
    await copyReferralText(referralUrl.value || referralCode.value)
  }

  watch(
    () => currentStatementQuery.data.value?.pagination,
    (pagination) => {
      currentPagination.value = normalizePagination(pagination, pageSize)
    }
  )

  watch(
    () => eventsQuery.data.value?.pagination,
    (pagination) => {
      eventsPagination.value = normalizePagination(pagination, pageSize)
    }
  )

  watch(
    () => eventDetailQuery.data.value?.pagination,
    (pagination) => {
      detailPagination.value = normalizePagination(pagination, pageSize)
    }
  )

  onMounted(() => {
    fetchCurrencies()
  })

  return {
    activePagination,
    activeRows,
    activeTab,
    copiedReferralCode,
    currencyOptions,
    currentDisplayRows,
    currentPagination,
    detailDisplayRows,
    detailPagination,
    eventDisplayRows,
    eventsPagination,
    gameTypeOptions,
    hasAccess,
    inputFilters,
    isActiveListLoading,
    isPageLoading,
    isVisible,
    selectedCurrencyCode,
    selectedCurrencyId,
    selectedEvent,
    showEventDetail,
    referralCode,
    referralUrl,
    summary,
    totalProfit,
    totalRevenueAmount,
    totalValidBetAmount,
    backToEvents,
    changeCurrency,
    changeTab,
    copyReferralCode,
    copyReferralUrl,
    search,
    showEventStatement,
    updatePage
  }
}
