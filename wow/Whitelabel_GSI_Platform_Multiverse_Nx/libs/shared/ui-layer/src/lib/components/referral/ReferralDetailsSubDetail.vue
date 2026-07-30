<script setup lang="ts">
import type { BaseTableColumn, BaseTableHeaderGroupRow } from "../BaseTable.vue"
import type { ReferralStatementDetailListResponseType } from "../../api/apiFunctions/referral_getReferralStatementDetail"
import { useAvailableCurrencyList } from "../../api/hooks/useAvailableCurrencyList"
import { useReferralStatementDetailQuery } from "../../api/hooks/useReferralStatementDetailQuery"
import { formatMoney } from "../../utils/formatMoney"
import ReferralDetailsSubMobileCard from "./ReferralDetailsSubMobileCard.vue"

type StatementDetailRow = ReferralStatementDetailListResponseType["list"][number]

interface CurrencyColumn {
  id: string
  code: string
}

const props = defineProps<{
  statementId: number
  statementRange: { start: string; end: string }
}>()

const emit = defineEmits<{
  back: []
}>()

const { t } = useI18n()
const { isMobile } = useCustomBreakpoints()
const { fetchAvailableCurrencyList } = useAvailableCurrencyList()

const currentPage = ref(1)
const pageSize = computed(() => (isMobile.value ? 20 : 10)) // 對齊舊版 mobile 寫死 20
const currencyCodeById = ref<Record<string, string>>({})

const statementIdRef = computed(() => props.statementId)

const queryParams = computed(() => ({
  offset: (currentPage.value - 1) * pageSize.value,
  size: pageSize.value
}))

const referralStatementDetailQuery = useReferralStatementDetailQuery({
  statementId: statementIdRef,
  params: queryParams
})

const rows = computed(() => referralStatementDetailQuery.data.value?.list ?? [])
const totalRecords = computed(() => referralStatementDetailQuery.data.value?.total ?? 0)
const isLoading = computed(
  () => referralStatementDetailQuery.isLoading.value || referralStatementDetailQuery.isFetching.value
)

const currencyColumns = computed<CurrencyColumn[]>(() => {
  const ids = new Set<string>()
  rows.value.forEach((row) => {
    Object.keys(row.revenues || {}).forEach((id) => ids.add(id))
  })
  Object.keys(referralStatementDetailQuery.data.value?.page_summary?.revenue_total || {}).forEach((id) => ids.add(id))

  return Array.from(ids)
    .sort((a, b) => Number(a) - Number(b))
    .map((id) => ({
      id,
      code: currencyCodeById.value[id] ?? id
    }))
})

const tableDataTableProps = computed(() => ({
  tableStyle: `min-width: ${300 + currencyColumns.value.length * 110}px; width: 100%;`
}))

const tableRows = computed(() =>
  rows.value.map((row) => {
    const currencyValues = currencyColumns.value.reduce<Record<string, string>>((acc, currency) => {
      const value = row.revenues[currency.id]
      acc[`currency_${currency.id}`] = value === undefined || value === null ? "-" : formatMoney(value)
      return acc
    }, {})

    return { ...row, ...currencyValues }
  })
)

const tableColumns = computed<BaseTableColumn[]>(() => [
  { field: "member_account", header: t("menu.userAccount"), width: "180px" },
  { field: "cashback_count", header: t("menu.directMemberCount"), width: "120px" },
  ...currencyColumns.value.map((currency) => ({
    field: `currency_${currency.id}`,
    header: currency.code,
    width: "110px"
  }))
])

// 雙層表頭:返佣金額 colspan 跨各幣別欄
const tableHeaderGroup = computed<BaseTableHeaderGroupRow[]>(() => {
  const currencyCount = currencyColumns.value.length
  if (currencyCount === 0) return []

  return [
    {
      cells: [
        { header: t("menu.userAccount"), rowspan: 2 },
        { header: t("menu.directMemberCount"), rowspan: 2 },
        { header: t("menu.commissionAmount"), colspan: currencyCount }
      ]
    },
    {
      cells: currencyColumns.value.map((currency) => ({ header: currency.code }))
    }
  ]
})

const formatRangeDisplay = computed(() => {
  const formatPart = (value: string) => (value ? value.slice(0, 16).replace("T", " ").replace(/-/g, "/") : "-")
  return `${formatPart(props.statementRange.start)} - ${formatPart(props.statementRange.end)}`
})

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleBack = () => {
  emit("back")
}

const handleRetry = () => {
  referralStatementDetailQuery.refetch()
}

const loadCurrencyMap = async () => {
  const response = await fetchAvailableCurrencyList()
  if (!response.status) return

  currencyCodeById.value = (response.data?.currencies ?? []).reduce<Record<string, string>>((acc, currency) => {
    acc[String(currency.id)] = currency.code
    return acc
  }, {})
}

const getDownlineCountClass = (row: StatementDetailRow) =>
  row.cashback_count > 0 ? "text-[var(--link)]" : "text-[var(--container-container-field-secondary)]"

const asStatementDetailRow = (row: Record<string, any>) => row as StatementDetailRow

onMounted(() => {
  loadCurrencyMap()
})
</script>

<template>
  <section class="flex h-full min-h-0 w-full flex-col gap-3 rounded-lg bg-[var(--card-card-bg-fourth-enabled)] p-4">
    <div class="flex w-full flex-wrap items-center gap-3">
      <BaseBtn
        theme="secondary"
        size="md"
        class="!rounded-lg !px-4 !py-2"
        @click="handleBack"
      >
        <span class="inline-flex items-center gap-1">
          <BaseIcon name="mdi:arrow-left" size="20px" />
          回上一層
        </span>
      </BaseBtn>
    </div>

    <div class="flex w-full items-center justify-end gap-2 text-sm phone:justify-start">
      <span class="text-[var(--card-card-subtitle-primary-enabled)]">{{ $t("menu.settlementRange") }}</span>
      <span class="font-bold text-[var(--text-text-accent)]">{{ formatRangeDisplay }}</span>
    </div>

    <div
      v-if="referralStatementDetailQuery.isError.value"
      class="flex min-h-[220px] flex-col items-center justify-center gap-3 text-[var(--text-text-primary)]"
    >
      <div>{{ referralStatementDetailQuery.error.value?.message || "資料載入失敗" }}</div>
      <BaseBtn theme="secondary" size="lg" @click="handleRetry">重試</BaseBtn>
    </div>

    <template v-else>
      <div v-if="isMobile" class="flex w-full flex-col gap-3">
        <div v-if="isLoading" class="flex min-h-[220px] items-center justify-center text-[var(--text-text-primary)]">
          Loading...
        </div>

        <NoData v-else-if="rows.length === 0" type="empty" />

        <template v-else>
          <ReferralDetailsSubMobileCard
            v-for="row in rows"
            :key="`${row.member_account}-${row.cashback_count}`"
            :row="row"
            :currency-columns="currencyColumns"
          />
        </template>

        <div v-if="totalRecords > pageSize" class="flex justify-center pt-2">
          <BasePagination
            :model-value="currentPage"
            :rows="pageSize"
            :total-records="totalRecords"
            @update:model-value="handlePageChange"
          />
        </div>
      </div>

      <BaseTable
        v-else
        :rows="tableRows"
        :columns="tableColumns"
        :header-group="tableHeaderGroup"
        :loading="isLoading"
        :pagination="true"
        :server-pagination="true"
        :page="currentPage"
        :rows-per-page="pageSize"
        :total-records="totalRecords"
        :data-table-props="tableDataTableProps"
        :is-show-mobile-card="false"
        row-key="member_account"
        @update:page="handlePageChange"
      >
        <template #cell-cashback_count="{ data }">
          <span :class="cx('font-bold', getDownlineCountClass(asStatementDetailRow(data)))">
            {{ asStatementDetailRow(data).cashback_count }}
          </span>
        </template>

        <template #empty>
          <NoData type="empty" />
        </template>
      </BaseTable>
    </template>
  </section>
</template>
