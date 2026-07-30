<script setup lang="ts">
import type { BaseTableColumn, BaseTableHeaderGroupRow } from "../BaseTable.vue"
import type { ReferralStatementListResponseType } from "../../api/apiFunctions/referral_getReferralStatementList"
import { useAvailableCurrencyList } from "../../api/hooks/useAvailableCurrencyList"
import { useReferralStatementListQuery } from "../../api/hooks/useReferralStatementListQuery"
import { formatMoney } from "../../utils/formatMoney"
import ReferralDetailsMobileCard from "./ReferralDetailsMobileCard.vue"

type StatementListRow = ReferralStatementListResponseType["list"][number]

interface CurrencyColumn {
  id: string
  code: string
}

const emit = defineEmits<{
  "show-sub-details": [{ statementId: number; range: { start: string; end: string } }]
}>()

const { t } = useI18n()
const { isMobile } = useCustomBreakpoints()
const { fetchAvailableCurrencyList } = useAvailableCurrencyList()

const currentPage = ref(1)
const pageSize = ref(10)
const currencyCodeById = ref<Record<string, string>>({})

const queryParams = computed(() => ({
  offset: (currentPage.value - 1) * pageSize.value,
  size: pageSize.value
}))

const referralStatementListQuery = useReferralStatementListQuery({ params: queryParams })

const rows = computed(() => referralStatementListQuery.data.value?.list ?? [])
const totalRecords = computed(() => referralStatementListQuery.data.value?.total ?? 0)
const isLoading = computed(
  () => referralStatementListQuery.isLoading.value || referralStatementListQuery.isFetching.value
)

const tableDataTableProps = {
  tableStyle: "min-width: 920px; width: 100%;"
}

const currencyColumns = computed<CurrencyColumn[]>(() => {
  const ids = new Set<string>()
  rows.value.forEach((row) => {
    Object.keys(row.revenues || {}).forEach((id) => ids.add(id))
  })

  return Array.from(ids)
    .sort((a, b) => Number(a) - Number(b))
    .map((id) => ({
      id,
      code: currencyCodeById.value[id] ?? id
    }))
})

const formatDate = (value: string) => (value ? value.slice(0, 10) : "-")
const formatDateTime = (value: string) => {
  if (!value) return "-"
  return value.slice(0, 16).replace("T", " ")
}

const tableRows = computed(() =>
  rows.value.map((row) => {
    const currencyValues = currencyColumns.value.reduce<Record<string, string>>((acc, currency) => {
      const value = row.revenues[currency.id]
      acc[`currency_${currency.id}`] = value === undefined || value === null ? "-" : formatMoney(value)
      return acc
    }, {})

    return {
      ...row,
      billing_date_display: formatDate(row.billing_date),
      billing_cycle_display: `${formatDateTime(row.billing_start)} - ${formatDateTime(row.billing_end)}`,
      ...currencyValues
    }
  })
)

const tableColumns = computed<BaseTableColumn[]>(() => [
  { field: "billing_date_display", header: t("menu.settlementDate"), width: "140px" },
  { field: "billing_cycle_display", header: t("menu.settlementRange"), width: "260px" },
  { field: "cashback_count", header: t("menu.directMemberCount"), width: "120px" },
  ...currencyColumns.value.map((currency) => ({
    field: `currency_${currency.id}`,
    header: currency.code,
    width: "110px"
  })),
  { field: "actions", header: t("menu.function"), width: "120px" }
])

// 雙層表頭:返佣金額 colspan 跨各幣別欄
const tableHeaderGroup = computed<BaseTableHeaderGroupRow[]>(() => {
  const currencyCount = currencyColumns.value.length
  if (currencyCount === 0) return []

  return [
    {
      cells: [
        { header: t("menu.settlementDate"), rowspan: 2 },
        { header: t("menu.settlementRange"), rowspan: 2 },
        { header: t("menu.directMemberCount"), rowspan: 2 },
        { header: t("menu.commissionAmount"), colspan: currencyCount },
        { header: t("menu.function"), rowspan: 2 }
      ]
    },
    {
      cells: currencyColumns.value.map((currency) => ({ header: currency.code }))
    }
  ]
})

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleView = (payload: { statementId: number; range: { start: string; end: string } }) => {
  emit("show-sub-details", payload)
}

const handleRetry = () => {
  referralStatementListQuery.refetch()
}

const loadCurrencyMap = async () => {
  const response = await fetchAvailableCurrencyList()
  if (!response.status) return

  currencyCodeById.value = (response.data?.currencies ?? []).reduce<Record<string, string>>((acc, currency) => {
    acc[String(currency.id)] = currency.code
    return acc
  }, {})
}

const getDownlineCountClass = (row: StatementListRow) =>
  row.cashback_count > 0 ? "text-[var(--link)]" : "text-[var(--container-container-field-secondary)]"

const asStatementRow = (row: Record<string, any>) => row as StatementListRow

onMounted(() => {
  loadCurrencyMap()
})
</script>

<template>
  <section class="flex h-full min-h-0 w-full flex-col gap-3 rounded-lg bg-[var(--card-card-bg-fourth-enabled)] p-4">

    <div
      v-if="referralStatementListQuery.isError.value"
      class="flex min-h-[220px] flex-col items-center justify-center gap-3 text-[var(--text-text-primary)]"
    >
      <div>{{ referralStatementListQuery.error.value?.message || "資料載入失敗" }}</div>
      <BaseBtn theme="secondary" size="lg" @click="handleRetry">重試</BaseBtn>
    </div>

    <template v-else>
      <div v-if="isMobile" class="flex w-full flex-col gap-3">
        <div v-if="isLoading" class="flex min-h-[220px] items-center justify-center text-[var(--text-text-primary)]">
          Loading...
        </div>

        <NoData v-else-if="rows.length === 0" type="empty" />

        <template v-else>
          <ReferralDetailsMobileCard
            v-for="row in rows"
            :key="row.statement_id"
            :row="row"
            :currency-columns="currencyColumns"
            @view="handleView"
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
        row-key="statement_id"
        @update:page="handlePageChange"
      >
        <template #cell-cashback_count="{ data }">
          <span :class="cx('font-bold', getDownlineCountClass(asStatementRow(data)))">
            {{ asStatementRow(data).cashback_count }}
          </span>
        </template>

        <template #cell-actions="{ data }">
          <BaseBtn
            theme="primary"
            category="outline"
            size="md"
            class="h-8 min-w-14 !rounded-lg !px-3 !py-1"
            @click="
              handleView({
                statementId: asStatementRow(data).statement_id,
                range: { start: asStatementRow(data).billing_start, end: asStatementRow(data).billing_end }
              })
            "
          >
            {{ $t("menu.details") }}
          </BaseBtn>
        </template>

        <template #empty>
          <NoData type="empty" />
        </template>
      </BaseTable>
    </template>
  </section>
</template>
