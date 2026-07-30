<script setup lang="ts">
interface Props {
  rows: Record<string, any>[]
  tableColumns?: Array<{ field: string; header: string; width?: string; bodyClass?: string; headerClass?: string }>
  loading?: boolean
  page: number
  rowsPerPage: number
  totalRecords: number
  noDataType?: "empty" | "gift" | "card"
  walletOptions?: Array<{ label: string; value: string }>
  walletTypeOptions?: Array<{ label: string; value: number }>
  selectedCurrency?: string
  selectedWalletType?: number
  selectedBetMethod?: number
  selectedDateRange?: string[]
  validBetAmount?: string | number
  winLossAmount?: string | number
  betMethodOptions?: Array<{ label: string; value: number }>
  showWalletTypeFilter?: boolean
  showBetMethodFilter?: boolean
  showBetSummary?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tableColumns: () => [],
  loading: false,
  noDataType: "empty",
  walletOptions: () => [],
  walletTypeOptions: () => [],
  betMethodOptions: () => [],
  selectedCurrency: "",
  selectedWalletType: 0,
  selectedBetMethod: -1,
  selectedDateRange: () => [],
  validBetAmount: "0",
  winLossAmount: "0",
  showWalletTypeFilter: true,
  showBetMethodFilter: false,
  showBetSummary: false
})

const emit = defineEmits<{
  (e: "update:selectedCurrency", value: string): void
  (e: "update:selectedWalletType", value: number): void
  (e: "update:selectedBetMethod", value: number): void
  (e: "update:selectedDateRange", value: string[] | null): void
  (e: "search"): void
  (e: "page-change", page: number): void
}>()

const AMOUNT_COLUMN_FIELD_WHITELIST = new Set([
  "amount",
  "beforeBalance",
  "afterBalance",
  "validBetAmount",
  "winLossAmount"
])

const isAmountLikeColumn = (field: string) => AMOUNT_COLUMN_FIELD_WHITELIST.has(String(field || ""))

const resolvedTableColumns = computed(() => {
  return (props.tableColumns || []).map((column) => {
    const bodyAlignmentClass = isAmountLikeColumn(column.field) ? "!text-right" : "!text-center"
    const bodyClass = [column.bodyClass, bodyAlignmentClass].filter(Boolean).join(" ")
    const headerClass = [column.headerClass, "!text-center"].filter(Boolean).join(" ")

    return {
      ...column,
      bodyClass,
      headerClass
    }
  })
})
</script>

<template>
  <BaseTable
    :rows="props.rows"
    :columns="resolvedTableColumns"
    :loading="props.loading"
    :pagination="true"
    :server-pagination="true"
    :page="props.page"
    :rows-per-page="props.rowsPerPage"
    :total-records="props.totalRecords"
    @update:page="emit('page-change', $event)"
  >
    <template #filters>
      <HistoryTableFilters
        :wallet-options="props.walletOptions"
        :wallet-type-options="props.walletTypeOptions"
        :selected-currency="props.selectedCurrency"
        :selected-wallet-type="props.selectedWalletType"
        :selected-bet-method="props.selectedBetMethod"
        :selected-date-range="props.selectedDateRange"
        :valid-bet-amount="props.validBetAmount"
        :win-loss-amount="props.winLossAmount"
        :bet-method-options="props.betMethodOptions"
        :show-wallet-type-filter="props.showWalletTypeFilter"
        :show-bet-method-filter="props.showBetMethodFilter"
        :show-bet-summary="props.showBetSummary"
        @update:selected-currency="emit('update:selectedCurrency', $event)"
        @update:selected-wallet-type="emit('update:selectedWalletType', $event)"
        @update:selected-bet-method="emit('update:selectedBetMethod', $event)"
        @update:selected-date-range="emit('update:selectedDateRange', $event)"
        @search="emit('search')"
      />
    </template>

    <template #mobileCardToggleRow="{ data, expanded }">
      <HistoryMobileCardToggleRow :data="data" :expanded="expanded" />
    </template>

    <template #empty>
      <NoData :type="props.noDataType" />
    </template>
  </BaseTable>
</template>
