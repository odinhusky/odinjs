import { DateTime } from "luxon"
import type { GetMemberSummaryParamsType } from "@shared-lib/api/apiFunctions/userInfo_getMemberSummary"
import { DATE_PRESET_MAP, createDateRange, normalizeQueryDate, resolvePresetByRange } from "./dateHelpers"
import { useSummaryDisplayComputed } from "./displayComputed"
import type { CurrencyOptionItem, DatePresetType, UseSummaryReturn } from "./types"
export const useSummary = (): UseSummaryReturn => {
  const route = useRoute()
  const router = useRouter()

  const { walletOptions, walletList, selectedCurrencyCode } = useCurrencyInfo()

  const selectedCurrency = ref("")
  const selectedDateRange = ref<[string, string]>(createDateRange(DATE_PRESET_MAP.today))

  const isDateDialogVisible = ref(false)
  const tempDateRange = ref<string[]>([...selectedDateRange.value])
  const selectedDatePreset = ref<DatePresetType>("today")

  const isInitialized = ref(false)

  const requestParams = reactive<GetMemberSummaryParamsType>({
    currency_id: 0,
    start_time: "",
    end_time: ""
  })

  const { memberSummary, isFetching, refetch } = useMemberSummary({
    params: requestParams
  })

  const { summaryCards, depositAmount, withdrawAmount, doughnutData, doughnutOptions, lineData, lineOptions } =
    useSummaryDisplayComputed(memberSummary, selectedDateRange)

  const onlineSeconds = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null

  const currencyOptions = computed<CurrencyOptionItem[]>(() => {
    return walletOptions.value.map((item) => ({
      label: item.label,
      value: item.value,
      currencyId: Number(item.currencyId)
    }))
  })

  const selectedCurrencyId = computed(() => {
    const selectedWallet = walletList.value.find((item) => item.currency_code === selectedCurrency.value)
    return Number(selectedWallet?.currency_id ?? 0)
  })

  const parsedLoginAt = computed(() => {
    const loginAt = memberSummary.value?.login_at
    if (!loginAt) return null

    const fromIso = DateTime.fromISO(loginAt, { setZone: true })
    if (fromIso.isValid) return fromIso

    const fromSql = DateTime.fromSQL(loginAt)
    if (fromSql.isValid) return fromSql

    return null
  })

  const syncOnlineSecondsFromLoginAt = () => {
    const loginDate = parsedLoginAt.value
    if (!loginDate) {
      // API 未回傳 login_at 時仍維持可見且可跳動的在線時間
      onlineSeconds.value = Math.max(onlineSeconds.value, 0)
      return
    }

    onlineSeconds.value = Math.max(0, Math.floor((Date.now() - loginDate.toMillis()) / 1000))
  }

  const onlineTimeText = computed(() => {
    const seconds = Math.max(0, onlineSeconds.value)
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0")
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")
    const secs = String(seconds % 60).padStart(2, "0")

    return `${hours}:${minutes}:${secs}`
  })

  const pushRouteQuery = async () => {
    await router.replace({
      path: route.path,
      query: {
        ...route.query,
        currency_id: String(selectedCurrencyId.value),
        start_time: selectedDateRange.value[0],
        end_time: selectedDateRange.value[1]
      }
    })
  }

  const loadSummary = async ({ syncQuery = true }: { syncQuery?: boolean } = {}) => {
    if (!selectedCurrencyId.value || selectedDateRange.value.length < 2) return

    requestParams.currency_id = selectedCurrencyId.value
    requestParams.start_time = selectedDateRange.value[0]
    requestParams.end_time = selectedDateRange.value[1]

    await refetch()

    if (syncQuery) {
      await pushRouteQuery()
    }
  }

  const handleCurrencyChange = (currencyCode: string) => {
    if (!currencyCode || currencyCode === selectedCurrency.value) return

    handleGlobalClick({
      target: "handleMemberSummaryCurrencySelectChange",
      debounceTimer: 150,
      callback: async () => {
        selectedCurrency.value = currencyCode
        await loadSummary()
      }
    })
  }

  const openDateDialog = () => {
    handleGlobalClick({
      target: "handleMemberSummaryOpenDateDialogClick",
      debounceTimer: 100,
      callback: () => {
        tempDateRange.value = [...selectedDateRange.value]
        selectedDatePreset.value = resolvePresetByRange(tempDateRange.value)
        isDateDialogVisible.value = true
      }
    })
  }

  const closeDateDialog = () => {
    isDateDialogVisible.value = false
  }

  const applyDatePreset = (preset: Exclude<DatePresetType, "custom">) => {
    handleGlobalClick({
      target: `handleMemberSummaryDatePreset${preset}Click`,
      debounceTimer: 120,
      callback: () => {
        tempDateRange.value = createDateRange(DATE_PRESET_MAP[preset])
        selectedDatePreset.value = preset
      }
    })
  }

  const confirmDateRange = () => {
    handleGlobalClick({
      target: "handleMemberSummaryConfirmDateDialogClick",
      debounceTimer: 150,
      callback: async () => {
        if (!Array.isArray(tempDateRange.value) || tempDateRange.value.length < 2) return

        selectedDateRange.value = [tempDateRange.value[0], tempDateRange.value[1]]
        isDateDialogVisible.value = false
        await loadSummary()
      }
    })
  }

  const resolveInitialStateFromRoute = () => {
    const queryCurrencyId = Number(route.query.currency_id)
    const matchedWalletById = walletList.value.find((item) => Number(item.currency_id) === queryCurrencyId)

    if (matchedWalletById?.currency_code) {
      selectedCurrency.value = matchedWalletById.currency_code
    } else if (selectedCurrencyCode.value) {
      selectedCurrency.value = selectedCurrencyCode.value
    } else {
      selectedCurrency.value = currencyOptions.value[0]?.value || ""
    }

    const queryStart = normalizeQueryDate(route.query.start_time)
    const queryEnd = normalizeQueryDate(route.query.end_time)

    if (queryStart && queryEnd) {
      selectedDateRange.value = [queryStart, queryEnd]
    }
  }

  watch(
    currencyOptions,
    async (options) => {
      if (!options.length || isInitialized.value) return

      resolveInitialStateFromRoute()
      isInitialized.value = true

      await loadSummary({ syncQuery: false })
    },
    { immediate: true }
  )

  watch(tempDateRange, (range) => {
    selectedDatePreset.value = resolvePresetByRange(range)
  })

  watch(
    () => memberSummary.value?.login_at,
    () => {
      syncOnlineSecondsFromLoginAt()
    },
    { immediate: true }
  )

  onMounted(() => {
    syncOnlineSecondsFromLoginAt()
    timer = setInterval(() => {
      if (parsedLoginAt.value) {
        syncOnlineSecondsFromLoginAt()
        return
      }

      onlineSeconds.value += 1
    }, 1000)
  })

  onUnmounted(() => {
    if (!timer) return
    clearInterval(timer)
    timer = null
  })

  return {
    selectedCurrency,
    currencyOptions,
    selectedDateRange,
    isDateDialogVisible,
    tempDateRange,
    selectedDatePreset,
    onlineTimeText,
    summaryCards,
    depositAmount,
    withdrawAmount,
    doughnutData,
    doughnutOptions,
    lineData,
    lineOptions,
    isLoading: computed(() => isFetching.value),
    handleCurrencyChange,
    openDateDialog,
    closeDateDialog,
    applyDatePreset,
    confirmDateRange
  }
}
