import type { ChartData, ChartOptions } from "chart.js"
import type { ComputedRef, Ref } from "vue"

export type DatePresetType = "today" | "days3" | "days7" | "custom"

export interface SummaryCardItem {
  key: string
  label: string
  value: number | string
}

export interface CurrencyOptionItem {
  label: string
  value: string
  currencyId: number
}

export interface SummaryMetricItem {
  date: string
  deposit: unknown
  withdraw: unknown
}

export interface MemberSummaryLike {
  login_at?: string | null
  bet_count?: number | string
  bet_amount?: number | string
  valid_bet?: number | string
  prize?: number | string
  profit?: number | string
  bonus?: number | string
  deposit?: number | string
  withdraw?: number | string
  metrics?: SummaryMetricItem[]
}

export interface UseSummaryReturn {
  selectedCurrency: Ref<string>
  currencyOptions: ComputedRef<CurrencyOptionItem[]>
  selectedDateRange: Ref<[string, string]>
  isDateDialogVisible: Ref<boolean>
  tempDateRange: Ref<string[]>
  selectedDatePreset: Ref<DatePresetType>
  onlineTimeText: ComputedRef<string>
  summaryCards: ComputedRef<SummaryCardItem[]>
  depositAmount: ComputedRef<number>
  withdrawAmount: ComputedRef<number>
  doughnutData: ComputedRef<ChartData<"doughnut">>
  doughnutOptions: ComputedRef<ChartOptions<"doughnut">>
  lineData: ComputedRef<ChartData<"line">>
  lineOptions: ComputedRef<ChartOptions<"line">>
  isLoading: ComputedRef<boolean>
  handleCurrencyChange: (currencyCode: string) => void
  openDateDialog: () => void
  closeDateDialog: () => void
  applyDatePreset: (preset: Exclude<DatePresetType, "custom">) => void
  confirmDateRange: () => void
}
