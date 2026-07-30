import { ref, computed, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { useApi } from "src/common/hooks/useApi"
import { INTEREST_STATUS } from "src/common/utils/constants"
import {
  getInterestActivityList,
  getInterestActivityDetailList,
  applyInterestActivity,
  applyInterestActivityRedemption,
  getInterestActivityDescription
} from "src/api/interest"
import type * as Response from "src/api/response.type"

// 開發模式開關 - 設為 true 使用假資料
const USE_MOCK_DATA = false

// 單一活動類型（陣列中的元素）
type ActivityItem = Response.GetInterestActivityList[number]

// 假資料 - 活動列表（與 API response.data 結構相同）
const mockActivityList: Response.GetInterestActivityList = [
  {
    id: 16,
    start_time: "2026-02-23T17:00:00Z",
    end_time: "2026-03-30T17:00:00Z",
    currency_id: 8,
    currency_code: "IDR",
    is_auto_dispatch: 2,
    audit_rate: "1",
    contents: [
      { activity_id: 16, lang: "bm", title: "Khazanah Faedah", detail: "", image_path: "agent/interest/335/01KJ46PH1FRNET0Z5M7PVFPXMS.png" },
      { activity_id: 16, lang: "br", title: "Tesouro de Juros", detail: "", image_path: "agent/interest/335/01KJ46PH1FRNET0Z5M7PVFPXMS.png" },
      { activity_id: 16, lang: "en", title: "Interest Treasure", detail: "", image_path: "https://wowdata.gpsriowdl.com/gsi/dev/devm/agent/interest/335/01KJ46PRP12B84RW2PH30XZVZC.png" },
      { activity_id: 16, lang: "id", title: "Harta Karun Bunga", detail: "", image_path: "agent/interest/335/01KJ46PH1FRNET0Z5M7PVFPXMS.png" },
      { activity_id: 16, lang: "jp", title: "利息宝", detail: "", image_path: "agent/interest/335/01KJ46PSZS8K0PNHE7GVVZ5XDV.png" },
      { activity_id: 16, lang: "ko", title: "이자 보물", detail: "", image_path: "agent/interest/335/01KJ46PH1FRNET0Z5M7PVFPXMS.png" },
      { activity_id: 16, lang: "sp", title: "Tesoro de Intereses", detail: "", image_path: "agent/interest/335/01KJ46PH1FRNET0Z5M7PVFPXMS.png" },
      { activity_id: 16, lang: "th", title: "สมบัติแห่งดอกเบี้ย", detail: "", image_path: "agent/interest/335/01KJ46PH1FRNET0Z5M7PVFPXMS.png" },
      { activity_id: 16, lang: "zh-cn", title: "利息宝", detail: "", image_path: "agent/interest/335/01KJ46PH1FRNET0Z5M7PVFPXMS.png" },
      { activity_id: 16, lang: "zh-tw", title: "利息寶", detail: "", image_path: "https://wowdata.gpsriowdl.com/gsi/dev/devm/agent/interest/335/01KJ46PH1FRNET0Z5M7PVFPXMS.png" }
    ],
    plans: [
      {
        id: 32,
        days: 1,
        interest_rate: "5",
        principal: "500",
        expected_interest: "0.06",
        can_participate: false,
        can_refund: false
      }
    ]
  }
]

const mockRecordList: Response.GetInterestActivityDetailListItem[] = [
  {
    id: 1,
    activity_name: "Interest Vault - 7 Days Special",
    principal: "1000.00",
    days: 30,
    interest_rate: "1.2",
    expected_interest: "360.00",
    apply_time: "2024-01-15 10:30:00",
    currency_code: "USD",
    status: 1,
    contents: [
      {
        lang: "en",
        title: "Interest Vault - 7 Days Special",
        detail: "<p>Enjoy 1.2% daily interest on your USD deposit.</p>",
        image_path: "https://placehold.co/600x400/1a1a2e/eee?text=Interest+Vault"
      },
      {
        lang: "zh-TW",
        title: "利息寶 - 7 天特惠",
        detail: "<p>享受美元存款 1.2% 每日利息。</p>",
        image_path: "https://placehold.co/600x400/1a1a2e/eee?text=Interest+Vault"
      }
    ]
  },
  {
    id: 2,
    activity_name: "Premium Interest - 30 Days",
    principal: "500.00",
    days: 14,
    interest_rate: "0.8",
    expected_interest: "56.00",
    apply_time: "2024-01-10 14:20:00",
    currency_code: "USD",
    status: 2,
    contents: [
      {
        lang: "en",
        title: "Premium Interest - 30 Days",
        detail: "<p>Premium rates for 30-day USD deposits.</p>",
        image_path: "https://placehold.co/600x400/2d2d44/eee?text=Premium+Interest"
      },
      {
        lang: "zh-TW",
        title: "高級利息 - 30 天",
        detail: "<p>30 天美元存款享受高級利率。</p>",
        image_path: "https://placehold.co/600x400/2d2d44/eee?text=Premium+Interest"
      }
    ]
  },
  {
    id: 3,
    activity_name: "Interest Vault - 7 Days Special",
    principal: "2000.00",
    days: 7,
    interest_rate: "0.5",
    expected_interest: "70.00",
    apply_time: "2024-01-05 09:15:00",
    currency_code: "USD",
    status: 0,
    contents: [
      {
        lang: "en",
        title: "Interest Vault - 7 Days Special",
        detail: "<p>Enjoy 0.5% daily interest on your USD deposit.</p>",
        image_path: "https://placehold.co/600x400/1a1a2e/eee?text=Interest+Vault"
      },
      {
        lang: "zh-TW",
        title: "利息寶 - 7 天特惠",
        detail: "<p>享受美元存款 0.5% 每日利息。</p>",
        image_path: "https://placehold.co/600x400/1a1a2e/eee?text=Interest+Vault"
      }
    ]
  },
  {
    id: 4,
    activity_name: "Euro Special - Limited Time",
    principal: "800.00",
    days: 90,
    interest_rate: "1.8",
    expected_interest: "1296.00",
    apply_time: "2024-01-01 16:45:00",
    currency_code: "EUR",
    status: 1,
    contents: [
      {
        lang: "en",
        title: "Euro Special - Limited Time",
        detail: "<p>Special rates for EUR deposits with 90-day lock-in period.</p>",
        image_path: "https://placehold.co/600x400/3d3d5c/eee?text=Euro+Special"
      },
      {
        lang: "zh-TW",
        title: "歐元特惠 - 限時活動",
        detail: "<p>歐元存款享受特惠利率，90 天鎖定期間。</p>",
        image_path: "https://placehold.co/600x400/3d3d5c/eee?text=Euro+Special"
      }
    ]
  }
]

export function useInterest() {
  const { t, locale } = useI18n()
  const $q = useQuasar()

  // 狀態
  const activeTab = ref<"activity" | "records">("activity")
  const isLoading = ref(false)
  const isApplying = ref(false)
  const isRecordsLoading = ref(false)
  const isRedeeming = ref<number | null>(null)

  // 活動數據 - 現在是陣列
  const activityList = ref<Response.GetInterestActivityList>([])
  const currentActivityIndex = ref(0)
  const selectedPlan = ref<Response.GetInterestActivityListPlan | null>(null)
  const applyAmount = ref("")

  // 試算相關
  const calcDays = ref("")
  const calcAmount = ref("")
  const calcResult = ref({
    rate: "0",
    interest: "0.00"
  })

  // 說明彈窗
  const showDescriptionDialog = ref(false)

  // 活動廣宣
  const activityDescription = ref<Response.GetInterestActivityDescription>([])

  const activityDescriptionContent = computed(() => {
    if (!activityDescription.value.length) return null
    return (
      activityDescription.value.find((c: Response.GetInterestActivityDescriptionContent) => c.lang === locale.value) ||
      activityDescription.value[0]
    )
  })

  // 最小存放額度提示彈窗
  const showMinPrincipalDialog = ref(false)
  const minPrincipalValue = ref("")

  // 記錄數據
  const recordList = ref<Response.GetInterestActivityDetailListItem[]>([])
  const recordsPagination = ref({
    page: 1,
    rowsPerPage: 10,
    totalPage: 1,
    total: 0
  })

  // 計算屬性 - 當前選中的活動
  const currentActivity = computed<ActivityItem | null>(() => {
    if (!activityList.value.length) return null
    return activityList.value[currentActivityIndex.value] || activityList.value[0]
  })

  // 當前活動的內容（根據語系）
  const activityContent = computed(() => {
    if (!currentActivity.value?.contents) return null
    return currentActivity.value.contents.find((c) => c.lang === locale.value) || currentActivity.value.contents[0]
  })

  // 是否有多個活動
  const hasMultipleActivities = computed(() => activityList.value.length > 1)

  const canApply = computed(() => {
    return applyAmount.value && parseFloat(applyAmount.value) > 0
  })

  // 矩陣表格相關計算屬性
  const uniqueDays = computed(() => {
    if (!currentActivity.value?.plans) return []
    const days = [...new Set(currentActivity.value.plans.map((p) => p.days))]
    return days.sort((a, b) => a - b)
  })

  const uniquePrincipals = computed(() => {
    if (!currentActivity.value?.plans) return []
    const principals = [...new Set(currentActivity.value.plans.map((p) => p.principal))]
    return principals.sort((a, b) => parseFloat(a) - parseFloat(b))
  })

  // 根據本金和天數獲取利率
  const getRateByMatrix = (principal: string, days: number) => {
    const plan = currentActivity.value?.plans.find((p) => p.principal === principal && p.days === days)
    return plan ? `${plan.interest_rate}%` : "-"
  }

  // 根據本金和天數選擇方案
  const selectPlanByMatrix = (principal: string, days: number) => {
    const plan = currentActivity.value?.plans.find((p) => p.principal === principal && p.days === days)
    if (plan) {
      selectedPlan.value = plan
    }
  }

  // 根據本金選擇第一個可參與的方案
  const selectByPrincipal = (principal: string) => {
    const plan = currentActivity.value?.plans.find((p) => p.principal === principal)
    if (plan) {
      selectedPlan.value = plan
    }
  }

  // 檢查該行是否有選中的方案
  const isRowSelected = (principal: string) => {
    return selectedPlan.value?.principal === principal
  }

  // 檢查特定單元格是否選中
  const isPlanSelected = (principal: string, days: number) => {
    return selectedPlan.value?.principal === principal && selectedPlan.value?.days === days
  }

  // 方案表格欄位
  const planColumns = computed(() => [
    { name: "days", label: t("interest.days"), field: "days", align: "center" as const },
    { name: "principal", label: t("interest.principal"), field: "principal", align: "center" as const },
    { name: "interest_rate", label: t("interest.interestRate"), field: "interest_rate", align: "center" as const },
    {
      name: "expected_interest",
      label: t("interest.expectedInterest"),
      field: "expected_interest",
      align: "center" as const
    }
  ])

  const tableColumns = computed(() => [
    { name: "activity_name", label: t("interest.activityName"), field: "activity_name", align: "center" as const },
    { name: "principal", label: t("interest.principal"), field: "principal", align: "center" as const },
    { name: "days", label: t("interest.days"), field: "days", align: "center" as const },
    { name: "interest_rate", label: t("interest.interestRate"), field: "interest_rate", align: "center" as const },
    {
      name: "expected_interest",
      label: t("interest.expectedInterest"),
      field: "expected_interest",
      align: "center" as const
    },
    { name: "apply_time", label: t("interest.applyTime"), field: "apply_time", align: "center" as const },
    { name: "status", label: t("interest.status"), field: "status", align: "center" as const },
    { name: "action", label: t("interest.action"), field: "action", align: "center" as const }
  ])

  // 方法
  const selectActivity = (index: number) => {
    if (index >= 0 && index < activityList.value.length) {
      currentActivityIndex.value = index
      selectedPlan.value = null
      applyAmount.value = ""
      // 滑動到該卡片，使用 slideToLoop 支援 loop 模式
      if (swiperInstance.value) {
        if (swiperInstance.value.params?.loop) {
          swiperInstance.value.slideToLoop(index)
        } else {
          swiperInstance.value.slideTo(index)
        }
      }
    }
  }

  const selectPlan = (plan: Response.GetInterestActivityListPlan) => {
    // if (plan.can_participate) {
      selectedPlan.value = plan
    // }
  }

  const getStatusClass = (status: number) => {
    switch (status) {
      case INTEREST_STATUS.Enums.Active:
        return "text-info"
      case INTEREST_STATUS.Enums.Refunded:
        return "text-success"
      case INTEREST_STATUS.Enums.Dispatched:
      case INTEREST_STATUS.Enums.SystemDispatched:
        return "text-success"
      default:
        return "text-grey"
    }
  }

  const getStatusText = (status: number) => {
    const key = INTEREST_STATUS.I18nKeys[status as INTEREST_STATUS.Enums]
    return key ? t(key) : "-"
  }

  // Swiper 相關
  const swiperInstance = ref<any>(null)

  const onSwiperInit = (swiper: any) => {
    swiperInstance.value = swiper
    // 使用 realIndex 支援 loop 模式
    currentActivityIndex.value = swiper.realIndex ?? swiper.activeIndex
  }

  const onSlideChange = (swiper: any) => {
    // 使用 realIndex 支援 loop 模式
    currentActivityIndex.value = swiper.realIndex ?? swiper.activeIndex
    selectedPlan.value = null
    applyAmount.value = ""
  }

  // API 調用
  const fetchActivityList = async () => {
    isLoading.value = true

    if (USE_MOCK_DATA) {
      // 模擬 API 延遲
      await new Promise((resolve) => setTimeout(resolve, 500))
      activityList.value = mockActivityList
      isLoading.value = false
      return
    }

    const { status, data } = await useApi(getInterestActivityList)
    isLoading.value = false

    if (status && data) {
      activityList.value = data
    }
  }

  const fetchRecordList = async () => {
    isRecordsLoading.value = true

    if (USE_MOCK_DATA) {
      // 模擬 API 延遲
      await new Promise((resolve) => setTimeout(resolve, 500))
      const offset = (recordsPagination.value.page - 1) * recordsPagination.value.rowsPerPage
      const paginatedList = mockRecordList.slice(offset, offset + recordsPagination.value.rowsPerPage)
      recordList.value = paginatedList
      recordsPagination.value.total = mockRecordList.length
      recordsPagination.value.totalPage = Math.ceil(mockRecordList.length / recordsPagination.value.rowsPerPage)
      isRecordsLoading.value = false
      return
    }

    const { status, data } = await useApi(getInterestActivityDetailList, {
      offset: (recordsPagination.value.page - 1) * recordsPagination.value.rowsPerPage,
      size: recordsPagination.value.rowsPerPage
    })
    isRecordsLoading.value = false

    if (status && data) {
      recordList.value = data.list
      recordsPagination.value.total = data.pagination.total
      recordsPagination.value.totalPage = Math.ceil(data.pagination.total / recordsPagination.value.rowsPerPage)
    }
  }

  // 試算功能
  const handleCalc = () => {
    const days = parseInt(calcDays.value) || 0
    const amount = parseFloat(calcAmount.value) || 0

    if (days <= 0 || amount <= 0 || !currentActivity.value) {
      calcResult.value = { rate: "0", interest: "0.00" }
      return
    }

    // 檢查金額是否大於等於最小存放額度
    const minPrincipal = uniquePrincipals.value[0]
    if (minPrincipal && amount < parseFloat(minPrincipal)) {
      minPrincipalValue.value = minPrincipal
      showMinPrincipalDialog.value = true
      return
    }

    // 金額與存放天數必須同時達到門檻，再取已達成的最高級距。
    const matchingPlan = [...currentActivity.value.plans]
      .filter((plan) => plan.days <= days && parseFloat(plan.principal) <= amount)
      .sort((a, b) => b.days - a.days || parseFloat(b.principal) - parseFloat(a.principal))[0]

    if (matchingPlan) {
      const rate = parseFloat(matchingPlan.interest_rate)
      const interest = (amount * rate * days) / 100 / 365
      calcResult.value = {
        rate: matchingPlan.interest_rate,
        interest: (Math.floor(interest * 100) / 100).toFixed(2)
      }
    } else {
      calcResult.value = { rate: "0", interest: "0.00" }
    }
  }

  const handleApply = async () => {
    if (!currentActivity.value) return

    // 檢查金額是否大於最小存放額度
    const minPrincipal = uniquePrincipals.value[0]
    if (minPrincipal && parseFloat(applyAmount.value) < parseFloat(minPrincipal)) {
      minPrincipalValue.value = minPrincipal
      showMinPrincipalDialog.value = true
      return
    }

    isApplying.value = true

    if (USE_MOCK_DATA) {
      // 模擬 API 延遲
      await new Promise((resolve) => setTimeout(resolve, 800))
      isApplying.value = false
      // $q.notify({
      //   type: "positive",
      //   message: t("interest.applySuccess")
      // })
      applyAmount.value = ""
      selectedPlan.value = null
      return
    }

    const { status } = await useApi(applyInterestActivity, {
      activity_id: currentActivity.value.id,
      principal: applyAmount.value
    })
    isApplying.value = false

    if (status) {
      applyAmount.value = ""
      selectedPlan.value = null
      await fetchActivityList()
    }
  }

  const handleRedeem = async (applicationId: number) => {
    isRedeeming.value = applicationId

    if (USE_MOCK_DATA) {
      // 模擬 API 延遲
      await new Promise((resolve) => setTimeout(resolve, 800))
      isRedeeming.value = null
      // $q.notify({
      //   type: "positive",
      //   message: t("interest.redeemSuccess")
      // })
      // 更新假資料中的狀態
      const record = mockRecordList.find((r) => r.id === applicationId)
      if (record) {
        record.status = 2
      }
      await fetchRecordList()
      return
    }

    const { status, msg } = await useApi(applyInterestActivityRedemption, {
      application_id: applicationId
    })
    isRedeeming.value = null

    if (status) {
      // $q.notify({
      //   type: "positive",
      //   message: t("interest.redeemSuccess")
      // })
      await fetchRecordList()
    } else {
      // $q.notify({
      //   type: "negative",
      //   message: msg || t("interest.redeemFailed")
      // })
    }
  }

  const handlePagination = () => {
    fetchRecordList()
  }

  // 監聽標籤頁切換
  const watchActiveTab = () => {
    watch(
      activeTab,
      (newTab) => {
        if (newTab === "records") {
          fetchRecordList()
        }
      },
      { immediate: true }
    )
  }

  // 取得活動廣宣
  const fetchActivityDescription = async () => {
    const { status, data } = await useApi(getInterestActivityDescription)
    if (status && data) {
      activityDescription.value = data
    }
  }

  // 初始化
  const initInterest = async () => {
    await Promise.all([fetchActivityList(), fetchActivityDescription()])
    watchActiveTab()
  }

  return {
    // 狀態
    activeTab,
    isLoading,
    isApplying,
    isRecordsLoading,
    isRedeeming,

    // 活動數據
    activityList,
    currentActivityIndex,
    currentActivity,
    selectedPlan,
    applyAmount,
    activityContent,
    hasMultipleActivities,
    canApply,

    // 試算相關
    calcDays,
    calcAmount,
    calcResult,
    handleCalc,

    // 矩陣表格相關
    uniqueDays,
    uniquePrincipals,
    getRateByMatrix,
    selectPlanByMatrix,
    selectByPrincipal,
    isRowSelected,
    isPlanSelected,

    // 記錄數據
    recordList,
    recordsPagination,
    tableColumns,
    planColumns,

    // 說明彈窗
    showDescriptionDialog,
    activityDescriptionContent,

    // 最小存放額度提示彈窗
    showMinPrincipalDialog,
    minPrincipalValue,

    // 方法
    selectActivity,
    selectPlan,
    getStatusClass,
    getStatusText,
    onSwiperInit,
    onSlideChange,
    fetchActivityList,
    fetchRecordList,
    handleApply,
    handleRedeem,
    handlePagination,
    initInterest
  }
}
