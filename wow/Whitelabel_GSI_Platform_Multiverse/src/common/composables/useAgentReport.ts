import type * as Response from "src/api/response.type"
import { useQuasar } from "quasar"
import { computed, nextTick, reactive, ref, watch } from "vue"
import { createSharedComposable } from "@vueuse/core"
import { useI18n } from "vue-i18n"
import { WALLET_TYPE, REPORT_DATE_TYPES } from "src/common/utils/constants"
import { useCommon } from "src/common/hooks/useCommon"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLanguage } from "src/common/composables/useLanguage"
import { useEnv } from "src/common/hooks/useEnv"
import { getLastOrOverDay, getToday, getYesterday } from "src/common/utils/dayjsUtils"
import { useAuthStore } from "src/stores/authStore"
import {
  createAgentReportColumns,
  createAgentReportPersonalSharedHeaders,
  createAgentReportTeamSharedHeaders,
} from "src/common/components/AgentReport/utils/columns"
import {
  AGENT_REPORT_EMPTY_VALUE,
  emptyDateRange,
  formatAgentReportMetricCells,
  formatAgentReportTeamRowCell as formatAgentReportTeamRowCellValue,
  formatAgentReportWalletTypeLabel,
  normalizeDateRange,
  type AgentReportDateRange,
  type MoneyFormatter,
} from "src/common/components/AgentReport/utils/formatters"
import {
  buildAgentReportMobileMatrixRows,
  buildAgentReportMobileMatrixWalletHeaders,
  getAgentReportTeamRowDetailColspans,
} from "src/common/components/AgentReport/utils/matrix"
import {
  buildAgentReportSearchTimeRange,
  getAgentReportRangeDays,
  isAgentReportDraftSynced,
  type AgentReportAppliedSearch,
} from "src/common/components/AgentReport/utils/search"
import {
  collapseAgentReportTeamRowDetails,
  type AgentReportTeamRowDetailState,
} from "src/common/components/AgentReport/utils/detailState"

type WalletDropItem = {
  label: string
  value: number
}

type AgentReportMemberLevel = {
  member_id: number
  member_account: string
}

type AgentReportDateType = REPORT_DATE_TYPES.Enums | -1

function _useAgentReport() {
  const { downlineExplorationEnabled } = useEnv()
  const { nowLang } = useLanguage()
  const $q = useQuasar()
  const { t } = useI18n()
  const { preciseDivide, moneyFormat } = useCommon()
  const {
    inUseWallet,
    userWalletMap,
    getWalletLabel,
    getMemberAgentReport,
    getMemberTeamAgentReport,
    getMemberAgentReportDetail,
    getMemberAgentTeamDetail,
  } = useUserInfo()
  const authStore = useAuthStore()

  const page = ref(1)
  const offset = ref(0)
  const size = ref(10)
  const totalPage = ref(0)
  const appliedSearch = ref<AgentReportAppliedSearch | null>(null)
  const isInitialized = ref(false)
  const agentReportCurrencyId = ref(inUseWallet.value?.[WALLET_TYPE.Enums.Cash]?.currency_id ?? 0)
  const agentReportMemberStack = ref<AgentReportMemberLevel[]>([])
  const dateType = ref<AgentReportDateType>(REPORT_DATE_TYPES.Enums.LastSevenDays)
  const isSearching = ref(false)
  const agentReportMoneyFormat: MoneyFormatter = (value) => moneyFormat(value ?? undefined)

  const isPageLoading = ref(false)
  const dateRange = ref<AgentReportDateRange>(emptyDateRange())
  const agentReportRows = ref<Response.GetMemberTeamAgentReportList[]>([])
  const agentReportOwnData = ref<Response.GetMemberAgentReport>()
  const agentReportOwnDetailExpanded = ref(false)
  const agentReportOwnDetailList = ref<Response.GetMemberAgentReportDetailPersonal[]>([])
  const agentReportOwnDetailTeamList = ref<Response.GetMemberAgentReportDetailTeam[]>([])
  const agentReportOwnDetailLoading = ref(false)
  const agentReportTeamRowDetails = ref<Record<number, AgentReportTeamRowDetailState>>({})

  const agentReportCurrencyList = computed<WalletDropItem[]>(() => {
    return Object.keys(userWalletMap.value).map((e) => {
      const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
      const label = getWalletLabel(cashWallet)
      const value = cashWallet.currency_id
      return { label, value }
    })
  })

  const currencyName = (currencyId: number) => {
    return agentReportCurrencyList.value?.find((item) => item.value === currencyId)?.label ?? AGENT_REPORT_EMPTY_VALUE
  }

  const agentReportColumns = computed(() => createAgentReportColumns(t))

  const agentReportMetricColumns = computed(() =>
    agentReportColumns.value.filter((column) => column.name !== "member_account")
  )

  const agentReportPersonalSharedHeaders = computed(() => createAgentReportPersonalSharedHeaders(t))

  const agentReportPersonalTableHeaders = computed(() => [
    t("menu.userAccount"),
    t("member.profile.currency"),
    ...agentReportPersonalSharedHeaders.value,
    t("member.membershipManagement.clickCount"),
  ])

  const formatMetricCells = (item: Parameters<typeof formatAgentReportMetricCells>[0]) =>
    formatAgentReportMetricCells(item, agentReportMoneyFormat)

  const formatWalletTypeLabel = (walletType: number) => formatAgentReportWalletTypeLabel(walletType, t, nowLang.value)

  const agentReportPersonalSummaryAccount = computed(
    () => agentReportOwnData.value?.team?.member_account ?? AGENT_REPORT_EMPTY_VALUE
  )

  const agentReportPersonalSummaryCurrency = computed(() =>
    currencyName(appliedSearch.value?.currencyId ?? agentReportCurrencyId.value)
  )

  const agentReportPersonalSummaryClickCount = computed(
    () => agentReportMoneyFormat(agentReportOwnData.value?.personal?.referral_click_count) ?? AGENT_REPORT_EMPTY_VALUE
  )

  const agentReportPersonalSummarySharedValues = computed(() => formatMetricCells(agentReportOwnData.value?.personal))

  const agentReportTeamRowDetailColspans = computed(() =>
    getAgentReportTeamRowDetailColspans(agentReportColumns.value.map((column) => column.name))
  )

  const agentReportPersonalMobileMatrixWalletHeaders = computed(() =>
    buildAgentReportMobileMatrixWalletHeaders({
      detailItems: agentReportOwnDetailList.value,
      expanded: agentReportOwnDetailExpanded.value,
      formatWalletTypeLabel,
    })
  )

  const agentReportPersonalMobileMatrixRows = computed(() =>
    buildAgentReportMobileMatrixRows({
      prefixRows: [
        { label: t("menu.userAccount"), basic: agentReportPersonalSummaryAccount.value },
        { label: t("member.profile.currency"), basic: agentReportPersonalSummaryCurrency.value },
      ],
      metricLabels: agentReportPersonalSharedHeaders.value,
      metricValues: agentReportPersonalSummarySharedValues.value,
      suffixRows: [
        {
          label: t("member.membershipManagement.clickCount"),
          basic: agentReportPersonalSummaryClickCount.value,
        },
      ],
      detailItems: agentReportOwnDetailList.value,
      expanded: agentReportOwnDetailExpanded.value,
      formatMetricCells,
    })
  )

  const agentReportTeamSharedHeaders = computed(() => createAgentReportTeamSharedHeaders(t))

  const agentReportTeamTableHeaders = computed(() => [
    t("member.membershipManagement.teamMember"),
    ...agentReportTeamSharedHeaders.value,
    t("member.membershipManagement.teamClickCount"),
    t("member.membershipManagement.teamRegisterCount"),
    t("shareholder_platform.team_first_deposits"),
  ])

  const agentReportTeamSummaryMemberCount = computed(
    () => agentReportMoneyFormat(agentReportOwnData.value?.team?.member_count) ?? AGENT_REPORT_EMPTY_VALUE
  )

  const agentReportTeamSummarySharedValues = computed(() => formatMetricCells(agentReportOwnData.value?.team))

  const agentReportTeamSummaryClickCount = computed(
    () => agentReportMoneyFormat(agentReportOwnData.value?.team?.referral_click_count) ?? AGENT_REPORT_EMPTY_VALUE
  )

  const agentReportTeamSummaryRegisterCount = computed(
    () => agentReportMoneyFormat(agentReportOwnData.value?.team?.register_count) ?? AGENT_REPORT_EMPTY_VALUE
  )

  const agentReportTeamSummaryFirstDepositCount = computed(
    () => agentReportMoneyFormat(agentReportOwnData.value?.team?.first_time_deposit_count) ?? AGENT_REPORT_EMPTY_VALUE
  )

  const agentReportTeamMobileMatrixWalletHeaders = computed(() =>
    buildAgentReportMobileMatrixWalletHeaders({
      detailItems: agentReportOwnDetailTeamList.value,
      expanded: agentReportOwnDetailExpanded.value,
      formatWalletTypeLabel,
    })
  )

  const agentReportTeamMobileMatrixRows = computed(() =>
    buildAgentReportMobileMatrixRows({
      prefixRows: [
        {
          label: agentReportTeamTableHeaders.value[0],
          basic: agentReportTeamSummaryMemberCount.value,
        },
      ],
      metricLabels: agentReportTeamSharedHeaders.value,
      metricValues: agentReportTeamSummarySharedValues.value,
      suffixRows: [
        {
          label: t("member.membershipManagement.teamClickCount"),
          basic: agentReportTeamSummaryClickCount.value,
        },
        {
          label: t("member.membershipManagement.teamRegisterCount"),
          basic: agentReportTeamSummaryRegisterCount.value,
        },
        {
          label: t("shareholder_platform.team_first_deposits"),
          basic: agentReportTeamSummaryFirstDepositCount.value,
        },
      ],
      detailItems: agentReportOwnDetailTeamList.value,
      expanded: agentReportOwnDetailExpanded.value,
      formatMetricCells,
    })
  )

  const isAgentReportTeamRowDetailExpanded = (memberId: number) =>
    agentReportTeamRowDetails.value[memberId]?.expanded ?? false

  const isAgentReportTeamRowDetailLoading = (memberId: number) =>
    agentReportTeamRowDetails.value[memberId]?.loading ?? false

  const getAgentReportTeamRowDetailList = (memberId: number) => agentReportTeamRowDetails.value[memberId]?.list ?? []

  const getAgentReportTeamListMobileMatrixWalletHeaders = (memberId: number) =>
    buildAgentReportMobileMatrixWalletHeaders({
      detailItems: getAgentReportTeamRowDetailList(memberId),
      expanded: isAgentReportTeamRowDetailExpanded(memberId),
      formatWalletTypeLabel,
    })

  const getAgentReportTeamListMobileMatrixRows = (data: Response.GetMemberTeamAgentReportList) => {
    const memberId = data.member_id
    const expanded = isAgentReportTeamRowDetailExpanded(memberId)

    return buildAgentReportMobileMatrixRows({
      prefixRows: [
        { label: t("menu.userAccount"), basic: data.member_account },
        {
          label: t("member.membershipManagement.teamMember"),
          basic: agentReportMoneyFormat(data.member_count) ?? AGENT_REPORT_EMPTY_VALUE,
        },
        { label: t("member.profile.currency"), basic: currencyName(data.currency_id) },
      ],
      metricLabels: agentReportTeamSharedHeaders.value,
      metricValues: formatMetricCells(data),
      suffixRows: [
        {
          label: t("member.membershipManagement.teamClickCount"),
          basic: agentReportMoneyFormat(data.referral_click_count) ?? AGENT_REPORT_EMPTY_VALUE,
        },
        {
          label: t("member.membershipManagement.teamRegisterCount"),
          basic: agentReportMoneyFormat(data.register_count) ?? AGENT_REPORT_EMPTY_VALUE,
        },
        {
          label: t("shareholder_platform.team_first_deposits"),
          basic: agentReportMoneyFormat(data.first_time_deposit_count) ?? AGENT_REPORT_EMPTY_VALUE,
        },
      ],
      detailItems: expanded ? getAgentReportTeamRowDetailList(memberId) : [],
      expanded,
      formatMetricCells,
    })
  }

  const isAgentReportDownlineExplorationEnabled = downlineExplorationEnabled

  const isAgentReportSubordinateView = computed(
    () => downlineExplorationEnabled.value && agentReportMemberStack.value.length > 0
  )

  const agentReportParentMemberAccount = computed(
    () => agentReportMemberStack.value[agentReportMemberStack.value.length - 1]?.member_account ?? ""
  )

  const dayTypeTabs = computed(() => [
    {
      label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.Today]),
      value: REPORT_DATE_TYPES.Enums.Today,
    },
    {
      label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.Yesterday]),
      value: REPORT_DATE_TYPES.Enums.Yesterday,
    },
    {
      label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastSevenDays]),
      value: REPORT_DATE_TYPES.Enums.LastSevenDays,
    },
  ])

  const formattedDateRange = computed(() => {
    if (!dateRange.value.from || !dateRange.value.to) return ""
    return `${dateRange.value.from} ${t("common.btn.to")} ${dateRange.value.to}`
  })

  const formattedStartDate = computed(() => dateRange.value.from)

  const formattedEndDate = computed(() => dateRange.value.to)

  const clearDateTypePreset = () => {
    dateType.value = -1
  }

  const updateDateRange = (value: string | AgentReportDateRange | null) => {
    dateRange.value = normalizeDateRange(value)
    clearDateTypePreset()
  }

  const applyDateTypeToDraft = (value: AgentReportDateType) => {
    switch (value) {
      case REPORT_DATE_TYPES.Enums.Today: {
        const today = String(getToday())
        dateRange.value = { from: today, to: today }
        break
      }
      case REPORT_DATE_TYPES.Enums.Yesterday: {
        const yesterday = String(getYesterday())
        dateRange.value = { from: yesterday, to: yesterday }
        break
      }
      case REPORT_DATE_TYPES.Enums.LastSevenDays:
        dateRange.value = { from: getLastOrOverDay(-6), to: getLastOrOverDay(0) }
        break
    }
  }

  const searchTimeRange = computed(() => buildAgentReportSearchTimeRange(appliedSearch.value?.dateRange, preciseDivide))

  const getValidatedSearchTimeRange = () => {
    const range = searchTimeRange.value

    if (!range.startDate || !range.endDate) {
      $q.notify({
        type: "negative",
        message: t("placeholder.pleaseSelectDate"),
        position: "top",
      })
      return null
    }

    if (!range.status) {
      $q.notify({
        type: "negative",
        message: t("common.validate.startTimeMustBeBeforeEndTime"),
        position: "top",
      })
      return null
    }

    return range
  }

  const isAgentReportDraftSyncedWithApplied = computed(() =>
    isAgentReportDraftSynced(appliedSearch.value, dateRange.value, agentReportCurrencyId.value)
  )

  const isAgentReportOwnDetailExpandIconVisible = computed(
    () => agentReportOwnDetailExpanded.value || isAgentReportDraftSyncedWithApplied.value
  )

  const isAgentReportTeamRowExpandIconVisible = (memberId: number) =>
    isAgentReportTeamRowDetailExpanded(memberId) || isAgentReportDraftSyncedWithApplied.value

  const collapseAgentReportExpandedDetails = () => {
    agentReportOwnDetailExpanded.value = false
    agentReportOwnDetailLoading.value = false

    const { nextDetails, changed } = collapseAgentReportTeamRowDetails(agentReportTeamRowDetails.value)

    if (changed) {
      agentReportTeamRowDetails.value = nextDetails
    }
  }

  const assertCanFetchDetails = () => {
    if (!appliedSearch.value || !isAgentReportDraftSyncedWithApplied.value) {
      return null
    }

    return getValidatedSearchTimeRange()
  }

  const resolveSearchMemberId = () => appliedSearch.value?.memberId ?? authStore.user_id ?? 0

  const withAgentReportSearching = async (task: () => Promise<void>) => {
    isSearching.value = true
    try {
      await task()
    } finally {
      isSearching.value = false
    }
  }

  const withAgentReportPageLoading = async (task: () => Promise<void>) => {
    isPageLoading.value = true
    try {
      await task()
    } finally {
      isPageLoading.value = false
    }
  }

  const formatAgentReportTeamRowCell = (row: Response.GetMemberTeamAgentReportList, columnName: string) =>
    formatAgentReportTeamRowCellValue(row, columnName, agentReportMoneyFormat, currencyName)

  const resetPageNumber = () => {
    page.value = 1
    offset.value = 0
    totalPage.value = 0
  }

  const resetAgentReportOwnDetail = () => {
    agentReportOwnDetailExpanded.value = false
    agentReportOwnDetailList.value = []
    agentReportOwnDetailTeamList.value = []
    agentReportOwnDetailLoading.value = false
  }

  const resetAgentReportTeamRowDetails = () => {
    agentReportTeamRowDetails.value = {}
  }

  const reset = () => {
    resetPageNumber()
    agentReportRows.value = []
    agentReportOwnData.value = undefined
    resetAgentReportOwnDetail()
    resetAgentReportTeamRowDetails()
    appliedSearch.value = null
    isInitialized.value = false
    agentReportMemberStack.value = []
    agentReportCurrencyId.value = inUseWallet.value?.[WALLET_TYPE.Enums.Cash]?.currency_id ?? 0
    dateType.value = REPORT_DATE_TYPES.Enums.LastSevenDays
    applyDateTypeToDraft(REPORT_DATE_TYPES.Enums.LastSevenDays)
  }

  const cloneAgentReportAppliedSearch = (value: AgentReportAppliedSearch): AgentReportAppliedSearch => ({
    ...value,
    dateRange: { ...value.dateRange },
  })

  const cloneAgentReportMemberStack = (stack: AgentReportMemberLevel[]) => stack.map((item) => ({ ...item }))

  const commitDraftToAppliedSearch = (memberId: number) => {
    appliedSearch.value = {
      dateRange: normalizeDateRange(dateRange.value),
      currencyId: agentReportCurrencyId.value,
      memberId,
    }
  }

  const activateTab = async () => {
    if (isInitialized.value) return

    await initTab()
  }

  const initTab = async () => {
    dateType.value = REPORT_DATE_TYPES.Enums.LastSevenDays
    applyDateTypeToDraft(REPORT_DATE_TYPES.Enums.LastSevenDays)
    const success = await handlerSearchAgentReport()
    if (success) {
      isInitialized.value = true
    }
  }

  const handleChangePage = async (newPage: number) => {
    offset.value = (newPage - 1) * size.value
    resetAgentReportTeamRowDetails()
    await withAgentReportPageLoading(async () => {
      await getMemberTeamAgentReportData()
    })
  }

  const scrollAgentReportViewToTop = async () => {
    await nextTick()
    document.querySelector(".scroll")?.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    })
  }

  const searchSubordinateAgentReport = async (memberId: number) => {
    if (!downlineExplorationEnabled.value || !appliedSearch.value) return

    const previousAppliedSearch = cloneAgentReportAppliedSearch(appliedSearch.value)
    const previousMemberStack = cloneAgentReportMemberStack(agentReportMemberStack.value)

    const currentMemberId = resolveSearchMemberId()
    const currentMemberAccount = agentReportOwnData.value?.team?.member_account ?? AGENT_REPORT_EMPTY_VALUE

    agentReportMemberStack.value.push({
      member_id: currentMemberId,
      member_account: currentMemberAccount,
    })
    appliedSearch.value = {
      ...appliedSearch.value,
      memberId,
    }
    resetPageNumber()

    await withAgentReportSearching(async () => {
      const [ownSuccess, teamSuccess] = await Promise.all([getMemberAgentReportData(), getMemberTeamAgentReportData()])

      if (!ownSuccess || !teamSuccess) {
        await restoreAgentReportAppliedSearchState(previousAppliedSearch, previousMemberStack)
      } else {
        await scrollAgentReportViewToTop()
      }
    })
  }

  const handlerBackAgentReportMember = async () => {
    if (!downlineExplorationEnabled.value || !appliedSearch.value) return

    const previousAppliedSearch = cloneAgentReportAppliedSearch(appliedSearch.value)
    const previousMemberStack = cloneAgentReportMemberStack(agentReportMemberStack.value)

    const parent = agentReportMemberStack.value.pop()
    if (!parent) return

    const memberId = parent.member_id === authStore.user_id ? authStore.user_id ?? 0 : parent.member_id

    appliedSearch.value = {
      ...appliedSearch.value,
      memberId,
    }

    resetPageNumber()

    await withAgentReportSearching(async () => {
      const [ownSuccess, teamSuccess] = await Promise.all([getMemberAgentReportData(), getMemberTeamAgentReportData()])

      if (!ownSuccess || !teamSuccess) {
        await restoreAgentReportAppliedSearchState(previousAppliedSearch, previousMemberStack)
      }
    })
  }

  const handlerSearchAgentReport = async (): Promise<boolean> => {
    if (!dateRange.value.from || !dateRange.value.to) {
      $q.notify({
        type: "negative",
        message: t("placeholder.pleaseSelectDate"),
        position: "top",
      })
      return false
    }

    const draftRange = normalizeDateRange(dateRange.value)
    if (getAgentReportRangeDays(draftRange, preciseDivide) > 31) {
      $q.notify({
        type: "negative",
        message: t("common.validate.startTimeMustBeBeforeEndTime31Days"),
        position: "top",
      })
      return false
    }

    resetPageNumber()
    const previousAppliedSearch = appliedSearch.value ? cloneAgentReportAppliedSearch(appliedSearch.value) : null
    const previousMemberStack = cloneAgentReportMemberStack(agentReportMemberStack.value)

    commitDraftToAppliedSearch(authStore.user_id ?? 0)
    agentReportMemberStack.value = []

    let searchSucceeded = false

    await withAgentReportSearching(async () => {
      const [ownSuccess, teamSuccess] = await Promise.all([getMemberAgentReportData(), getMemberTeamAgentReportData()])
      searchSucceeded = ownSuccess && teamSuccess

      if (!searchSucceeded) {
        await restoreAgentReportAppliedSearchState(previousAppliedSearch, previousMemberStack)
      }
    })

    return searchSucceeded
  }

  const toggleAgentReportTeamRowDetail = async (memberId: number) => {
    const current = agentReportTeamRowDetails.value[memberId]

    if (current?.expanded) {
      agentReportTeamRowDetails.value[memberId] = { ...current, expanded: false }
      return
    }

    if (current?.list?.length && isAgentReportDraftSyncedWithApplied.value) {
      agentReportTeamRowDetails.value[memberId] = { ...current, expanded: true }
      return
    }

    const range = assertCanFetchDetails()
    if (!range) return

    agentReportTeamRowDetails.value[memberId] = {
      expanded: false,
      loading: true,
      list: current?.list ?? [],
    }

    const { data, status: apiStatus } = await getMemberAgentTeamDetail({
      currency_id: appliedSearch.value!.currencyId,
      start_time: range.startDate,
      end_time: range.endDate,
      member_id: memberId,
    })

    agentReportTeamRowDetails.value[memberId] = {
      expanded: apiStatus && isAgentReportDraftSyncedWithApplied.value,
      loading: false,
      list: apiStatus ? data?.list ?? [] : [],
    }
  }

  const toggleAgentReportOwnDetail = async () => {
    if (agentReportOwnDetailExpanded.value) {
      agentReportOwnDetailExpanded.value = false
      return
    }

    if (
      isAgentReportDraftSyncedWithApplied.value &&
      (agentReportOwnDetailList.value.length > 0 || agentReportOwnDetailTeamList.value.length > 0)
    ) {
      agentReportOwnDetailExpanded.value = true
      return
    }

    const range = assertCanFetchDetails()
    if (!range) return

    agentReportOwnDetailLoading.value = true

    try {
      const { data } = await getMemberAgentReportDetail({
        currency_id: appliedSearch.value!.currencyId,
        start_time: range.startDate,
        end_time: range.endDate,
        member_id: resolveSearchMemberId(),
      })

      agentReportOwnDetailList.value = data?.personal ?? []
      agentReportOwnDetailTeamList.value = data?.team ?? []
      agentReportOwnDetailExpanded.value = isAgentReportDraftSyncedWithApplied.value
    } finally {
      agentReportOwnDetailLoading.value = false
    }
  }

  const getMemberAgentReportData = async (): Promise<boolean> => {
    agentReportOwnData.value = undefined
    resetAgentReportOwnDetail()

    const range = getValidatedSearchTimeRange()
    if (!range || !appliedSearch.value) return false

    try {
      const { data } = await getMemberAgentReport({
        currency_id: appliedSearch.value.currencyId,
        start_time: range.startDate,
        end_time: range.endDate,
        member_id: resolveSearchMemberId(),
      })

      agentReportOwnData.value = data
      return true
    } catch {
      return false
    }
  }

  const getMemberTeamAgentReportData = async (): Promise<boolean> => {
    agentReportRows.value = []
    resetAgentReportTeamRowDetails()

    const range = getValidatedSearchTimeRange()
    if (!range || !appliedSearch.value) return false

    try {
      const { data } = await getMemberTeamAgentReport({
        currency_id: appliedSearch.value.currencyId,
        start_time: range.startDate,
        end_time: range.endDate,
        offset: offset.value,
        size: size.value,
        member_id: resolveSearchMemberId(),
      })

      agentReportRows.value = data.list
      totalPage.value = Math.ceil(data.pagination.total / size.value)
      page.value = Math.floor(data.pagination.offset / data.pagination.size) + 1
      offset.value = (page.value - 1) * size.value
      return true
    } catch {
      return false
    }
  }

  const restoreAgentReportAppliedSearchState = async (
    applied: AgentReportAppliedSearch | null,
    stack: AgentReportMemberLevel[]
  ) => {
    appliedSearch.value = applied
    agentReportMemberStack.value = stack

    if (!applied) {
      resetPageNumber()
      agentReportRows.value = []
      agentReportOwnData.value = undefined
      resetAgentReportOwnDetail()
      resetAgentReportTeamRowDetails()
      return
    }

    await Promise.all([getMemberAgentReportData(), getMemberTeamAgentReportData()])
  }

  watch(dateType, applyDateTypeToDraft, { immediate: true })

  watch(
    [dateRange, agentReportCurrencyId],
    () => {
      if (!isAgentReportDraftSyncedWithApplied.value) {
        collapseAgentReportExpandedDetails()
      }
    },
    { deep: true }
  )

  const agentReport = reactive({
    // pagination
    page,
    offset,
    size,
    totalPage,

    // search draft
    agentReportCurrencyId,
    dateType,
    dateRange,

    // loading
    isSearching,
    isPageLoading,

    // initialized
    isInitialized,

    // list data
    agentReportRows,
    agentReportOwnData,

    // own detail
    agentReportOwnDetailExpanded,
    agentReportOwnDetailList,
    agentReportOwnDetailTeamList,
    agentReportOwnDetailLoading,

    // draft sync & expand visibility
    isAgentReportDraftSyncedWithApplied,
    isAgentReportOwnDetailExpandIconVisible,
    isAgentReportTeamRowExpandIconVisible,

    // columns & formatting
    agentReportColumns,
    agentReportMetricColumns,
    agentReportPersonalTableHeaders,
    agentReportPersonalSummaryAccount,
    agentReportPersonalSummaryCurrency,
    agentReportPersonalSummarySharedValues,
    agentReportPersonalSummaryClickCount,
    formatMetricCells,
    formatWalletTypeLabel,
    formatAgentReportTeamRowCell,

    // personal presentation
    agentReportPersonalMobileMatrixRows,
    agentReportPersonalMobileMatrixWalletHeaders,

    // team summary presentation
    agentReportTeamTableHeaders,
    agentReportTeamSummaryMemberCount,
    agentReportTeamSummarySharedValues,
    agentReportTeamSummaryClickCount,
    agentReportTeamSummaryRegisterCount,
    agentReportTeamSummaryFirstDepositCount,
    agentReportTeamMobileMatrixRows,
    agentReportTeamMobileMatrixWalletHeaders,
    agentReportTeamRowDetailColspans,

    // team row detail helpers
    isAgentReportTeamRowDetailExpanded,
    isAgentReportTeamRowDetailLoading,
    getAgentReportTeamRowDetailList,
    getAgentReportTeamListMobileMatrixRows,
    getAgentReportTeamListMobileMatrixWalletHeaders,

    // navigation
    isAgentReportDownlineExplorationEnabled,
    isAgentReportSubordinateView,
    agentReportParentMemberAccount,

    // search form
    agentReportCurrencyList,
    dayTypeTabs,
    currencyName,
    formattedDateRange,
    formattedStartDate,
    formattedEndDate,
    clearDateTypePreset,
    updateDateRange,

    // actions
    reset,
    activateTab,
    handleChangePage,
    searchSubordinateAgentReport,
    handlerBackAgentReportMember,
    handlerSearchAgentReport,
    toggleAgentReportTeamRowDetail,
    toggleAgentReportOwnDetail,
  })

  return agentReport
}

export type UseAgentReportReturn = ReturnType<typeof _useAgentReport>

export const useAgentReport = createSharedComposable(_useAgentReport)
