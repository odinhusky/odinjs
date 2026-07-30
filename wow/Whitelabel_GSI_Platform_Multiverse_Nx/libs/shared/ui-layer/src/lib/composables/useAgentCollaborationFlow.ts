import { computed, onMounted, ref } from "vue"
import { useClipboard } from "@vueuse/core"
import { useI18n } from "#imports"
import { useApiMutation } from "../api/useApiMutation"
import { getAvailableCurrencyList, type CurrencyItemType } from "../api/apiFunctions/bank_getAvailableCurrencyList"
import {
  getCollaborationStatistics,
  type GetCollaborationStatisticsResponseType
} from "../api/apiFunctions/collaboration_getCollaborationStatistics"
import { getCollaborationVisibility } from "../api/apiFunctions/collaboration_getCollaborationVisibility"
import {
  getInvitations,
  type GetInvitationsParamsType,
  type InvitationItem
} from "../api/apiFunctions/collaboration_getInvitations"
import {
  getRebates,
  type GetRebatesParamsType,
  type RebateItem
} from "../api/apiFunctions/collaboration_getRebates"
import { useSetting } from "../api/hooks/useSetting"
import { INVITATION_STATUS_ENUMS, INVITATION_STATUS_I18N_KEYS } from "../constants/enums/invitationStatus"
import { REBATE_STATUS_I18N_KEYS } from "../constants/enums/rebateStatus"
import { useWalletStore } from "../stores/wallet"
import { normalizeDateRangeBoundaryIfNeeded, toRfc3339 } from "../utils/useRfc3339"

export type AgentCollaborationTab = "invitation" | "rebate"

export interface AgentCollaborationPagination {
  page: number
  pageSize: number
  total: number
}

export interface AgentCollaborationInvitationFilters {
  memberAccount: string
  status: INVITATION_STATUS_ENUMS
}

export interface AgentCollaborationRebateFilters {
  dateRange: string[]
}

export interface AgentCollaborationSelectOption {
  label: string
  value: string | number
}

export interface AgentCollaborationCurrencyOption extends AgentCollaborationSelectOption {
  code: string
}

export interface UseAgentCollaborationFlowOptions {
  pageSize?: number
  enableVisibility?: boolean
}

const DEFAULT_PAGE_SIZE = 10

const formatDate = (date: Date, separator = "-") => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return [year, month, day].join(separator)
}

const getDefaultRebateDateRange = () => {
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 7)
  return [formatDate(sevenDaysAgo), formatDate(today)]
}

const normalizePagination = (
  pagination: { offset?: number; size?: number; total?: number; page?: number } | undefined,
  pageSize: number
): AgentCollaborationPagination => {
  const size = Number(pagination?.size || pageSize)
  const offset = Number(pagination?.offset || 0)
  return {
    page: Number(pagination?.page || (offset === 0 ? 1 : Math.floor(offset / Math.max(size, 1)) + 1)),
    pageSize: size,
    total: Number(pagination?.total || 0)
  }
}

const formatNumber = (value: string | number | null | undefined) => {
  const numericValue = Number(value ?? 0)
  if (!Number.isFinite(numericValue)) return "0"
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(numericValue)
}

const formatDateTime = (value: string | undefined) => {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const datePart = formatDate(date, "/")
  const timePart = [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((item) => String(item).padStart(2, "0"))
    .join(":")
  return `${datePart} ${timePart}`
}

export const useAgentCollaborationFlow = (options: UseAgentCollaborationFlowOptions = {}) => {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE
  const enableVisibility = options.enableVisibility ?? true
  const { t, locale } = useI18n()
  const walletStore = useWalletStore()
  const { copy, isSupported: isClipboardSupported } = useClipboard()

  const visibilityMutation = useApiMutation(getCollaborationVisibility)
  const currencyMutation = useApiMutation(getAvailableCurrencyList)
  const statisticsMutation = useApiMutation(getCollaborationStatistics)
  const invitationMutation = useApiMutation(getInvitations)
  const rebateMutation = useApiMutation(getRebates)
  const { setting: utcOffsetSetting, refetch: refetchSetting } = useSetting<number | undefined>({
    selector: (setting) => setting.utc_offset
  })

  const isVisible = ref(false)
  const isInitialized = ref(false)
  const currencyList = ref<CurrencyItemType[]>([])
  const selectedCurrencyId = ref<number | null>(null)
  const activeTab = ref<AgentCollaborationTab>("invitation")
  const statistics = ref<GetCollaborationStatisticsResponseType | null>(null)
  const invitations = ref<InvitationItem[]>([])
  const rebates = ref<RebateItem[]>([])
  const invitationFilters = ref<AgentCollaborationInvitationFilters>({
    memberAccount: "",
    status: INVITATION_STATUS_ENUMS.ALL
  })
  const rebateFilters = ref<AgentCollaborationRebateFilters>({
    dateRange: getDefaultRebateDateRange()
  })
  const invitationPagination = ref<AgentCollaborationPagination>({
    page: 1,
    pageSize,
    total: 0
  })
  const rebatePagination = ref<AgentCollaborationPagination>({
    page: 1,
    pageSize,
    total: 0
  })
  const copiedReferralCode = ref(false)

  const currencyOptions = computed<AgentCollaborationCurrencyOption[]>(() =>
    currencyList.value.map((item) => ({
      label: item.code,
      value: item.id,
      code: item.code
    }))
  )

  const selectedCurrency = computed(() => currencyList.value.find((item) => item.id === selectedCurrencyId.value) ?? null)
  const selectedCurrencyCode = computed(() => selectedCurrency.value?.code ?? "")
  const bannerPath = computed(() => {
    const data = statistics.value as (GetCollaborationStatisticsResponseType & { banner_path?: string }) | null
    return data?.banner_path || data?.banner || ""
  })

  const invitationStatusOptions = computed<AgentCollaborationSelectOption[]>(() =>
    Object.values(INVITATION_STATUS_ENUMS)
      .filter((value): value is INVITATION_STATUS_ENUMS => typeof value === "number")
      .map((value) => ({
        label: t(INVITATION_STATUS_I18N_KEYS[value]),
        value
      }))
  )

  const isPageLoading = computed(() => visibilityMutation.isPending.value || currencyMutation.isPending.value)
  const isStatisticsLoading = computed(() => statisticsMutation.isPending.value)
  const isInvitationLoading = computed(() => invitationMutation.isPending.value)
  const isRebateLoading = computed(() => rebateMutation.isPending.value)

  const activePagination = computed(() =>
    activeTab.value === "invitation" ? invitationPagination.value : rebatePagination.value
  )

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

  const fetchVisibility = async () => {
    if (!enableVisibility) {
      isVisible.value = true
      return true
    }

    try {
      const response = await visibilityMutation.mutateAsync(undefined)
      isVisible.value = Boolean(response.data)
      return isVisible.value
    } catch {
      isVisible.value = false
      return false
    }
  }

  const fetchCurrencies = async () => {
    const response = await currencyMutation.mutateAsync(undefined)
    currencyList.value = response.data?.currencies ?? []
    normalizeSelectedCurrency()
  }

  const fetchStatistics = async () => {
    if (!selectedCurrencyId.value) return
    const response = await statisticsMutation.mutateAsync({
      lang: String(locale.value),
      currency_id: selectedCurrencyId.value
    })
    statistics.value = response.data
  }

  const fetchInvitations = async (page = invitationPagination.value.page) => {
    if (!selectedCurrencyId.value) return

    const payload: Partial<GetInvitationsParamsType> = {
      currency_id: selectedCurrencyId.value,
      offset: (page - 1) * pageSize,
      size: pageSize
    }

    const memberAccount = invitationFilters.value.memberAccount.trim()
    if (memberAccount) payload.member_account = memberAccount
    if (invitationFilters.value.status >= 0) payload.status = invitationFilters.value.status

    const response = await invitationMutation.mutateAsync(payload as GetInvitationsParamsType)
    invitations.value = response.data?.list ?? []
    invitationPagination.value = normalizePagination(response.data?.pagination, pageSize)
  }

  const fetchRebates = async (page = rebatePagination.value.page) => {
    if (!selectedCurrencyId.value) return

    const [startDate, endDate] = rebateFilters.value.dateRange.length
      ? rebateFilters.value.dateRange
      : getDefaultRebateDateRange()

    if (utcOffsetSetting.value === undefined || utcOffsetSetting.value === null) {
      await refetchSetting()
    }

    const utcOffsetMinutes = Number(utcOffsetSetting.value ?? 0)
    const startTime =
      toRfc3339(normalizeDateRangeBoundaryIfNeeded("start_time", startDate), utcOffsetMinutes) ?? ""
    const endTime = toRfc3339(normalizeDateRangeBoundaryIfNeeded("end_time", endDate), utcOffsetMinutes) ?? ""

    const payload: GetRebatesParamsType = {
      start_time: startTime,
      end_time: endTime,
      currency_id: selectedCurrencyId.value,
      offset: (page - 1) * pageSize,
      size: pageSize
    }

    const response = await rebateMutation.mutateAsync(payload)
    rebates.value = response.data?.list ?? []
    rebatePagination.value = normalizePagination(response.data?.pagination, pageSize)
  }

  const fetchActiveTab = async (page?: number) => {
    if (activeTab.value === "rebate") {
      await fetchRebates(page)
      return
    }

    await fetchInvitations(page)
  }

  const initialize = async () => {
    try {
      const visible = await fetchVisibility()
      if (!visible) return

      await fetchCurrencies()
      await fetchStatistics()
      await fetchActiveTab(1)
    } finally {
      isInitialized.value = true
    }
  }

  const changeCurrency = async (currencyId: number) => {
    if (!currencyId || selectedCurrencyId.value === currencyId) return
    selectedCurrencyId.value = currencyId
    invitationPagination.value.page = 1
    rebatePagination.value.page = 1
    await fetchStatistics()
    await fetchActiveTab(1)
  }

  const changeTab = async (tab: AgentCollaborationTab) => {
    if (activeTab.value === tab) return
    activeTab.value = tab
    await fetchActiveTab(1)
  }

  const searchInvitations = async () => {
    invitationPagination.value.page = 1
    await fetchInvitations(1)
  }

  const searchRebates = async () => {
    rebatePagination.value.page = 1
    await fetchRebates(1)
  }

  const updateInvitationPage = async (page: number) => {
    await fetchInvitations(page)
  }

  const updateRebatePage = async (page: number) => {
    await fetchRebates(page)
  }

  const updateActivePage = async (page: number) => {
    if (activeTab.value === "rebate") {
      await updateRebatePage(page)
      return
    }
    await updateInvitationPage(page)
  }

  const copyReferralCode = async () => {
    const code = statistics.value?.referral_code ?? ""
    if (!code || !isClipboardSupported.value) return

    await copy(code)
    copiedReferralCode.value = true
    globalThis.setTimeout(() => {
      copiedReferralCode.value = false
    }, 1500)
  }

  const getInvitationStatusLabel = (status: INVITATION_STATUS_ENUMS) =>
    INVITATION_STATUS_I18N_KEYS[status] ? t(INVITATION_STATUS_I18N_KEYS[status]) : "-"

  const getRebateStatusLabel = (status: RebateItem["status"]) =>
    REBATE_STATUS_I18N_KEYS[status] ? t(REBATE_STATUS_I18N_KEYS[status]) : String(status ?? "-")

  onMounted(() => {
    initialize()
  })

  return {
    activeTab,
    activePagination,
    bannerPath,
    copiedReferralCode,
    currencyOptions,
    invitations,
    invitationFilters,
    invitationPagination,
    invitationStatusOptions,
    isInitialized,
    isInvitationLoading,
    isPageLoading,
    isRebateLoading,
    isStatisticsLoading,
    isVisible,
    rebates,
    rebateFilters,
    rebatePagination,
    selectedCurrencyCode,
    selectedCurrencyId,
    statistics,
    changeCurrency,
    changeTab,
    copyReferralCode,
    fetchVisibility,
    formatDateTime,
    formatNumber,
    getInvitationStatusLabel,
    getRebateStatusLabel,
    searchInvitations,
    searchRebates,
    updateActivePage,
    updateInvitationPage,
    updateRebatePage
  }
}
