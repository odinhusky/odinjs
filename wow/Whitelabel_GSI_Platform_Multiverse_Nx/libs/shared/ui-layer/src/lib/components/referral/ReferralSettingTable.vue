<script setup lang="ts">
import type { BaseTableColumn } from "../BaseTable.vue"
import type { ReferralSettingItem } from "../../api/commonTypes/referralTypes"
import { useAvailableCurrencyList } from "../../api/hooks/useAvailableCurrencyList"
import { useReferralSettingQuery } from "../../api/hooks/useReferralSettingQuery"
import ReferralSettingMobileCard from "./ReferralSettingMobileCard.vue"
import ReferralSettingEditDialog from "./ReferralSettingEditDialog.vue"

interface CurrencyColumn {
  id: string
  code: string
}

const { t } = useI18n()
const { isMobile } = useCustomBreakpoints()
const { fetchAvailableCurrencyList } = useAvailableCurrencyList()

const search = ref("")
const submittedSearch = ref("")
const currentPage = ref(1)
const pageSize = ref(10)
const searchFetchSize = 1000
const currencyCodeById = ref<Record<string, string>>({})
const editingRow = ref<{ memberId: number; account: string } | null>(null)

const normalizedSubmittedSearch = computed(() => submittedSearch.value.trim().toLowerCase())
const isSearchActive = computed(() => normalizedSubmittedSearch.value.length > 0)
const queryParams = computed(() => ({
  offset: isSearchActive.value ? 0 : (currentPage.value - 1) * pageSize.value,
  size: isSearchActive.value ? searchFetchSize : pageSize.value,
  member_account: submittedSearch.value || undefined
}))

const referralSettingQuery = useReferralSettingQuery({ params: queryParams })

const fetchedRows = computed(() => referralSettingQuery.data.value?.list ?? [])
const filteredRows = computed(() => {
  if (!isSearchActive.value) return fetchedRows.value

  return fetchedRows.value.filter((row) => row.account.toLowerCase().includes(normalizedSubmittedSearch.value))
})
const rows = computed(() => {
  if (!isSearchActive.value) return fetchedRows.value

  const start = (currentPage.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})
const totalRecords = computed(() => {
  if (isSearchActive.value) return filteredRows.value.length

  return referralSettingQuery.data.value?.total ?? 0
})
const isLoading = computed(() => referralSettingQuery.isLoading.value || referralSettingQuery.isFetching.value)
const tableDataTableProps = {
  tableStyle: "min-width: 860px; width: 100%;"
}

const currencyColumns = computed<CurrencyColumn[]>(() => {
  const ids = new Set<string>()
  rows.value.forEach((row) => {
    Object.keys(row.settings.currency_limit || {}).forEach((id) => ids.add(id))
  })

  return Array.from(ids)
    .sort((a, b) => Number(a) - Number(b))
    .map((id) => ({
      id,
      code: currencyCodeById.value[id] ?? id
    }))
})

const tableRows = computed(() =>
  rows.value.map((row) => {
    const currencyValues = currencyColumns.value.reduce<Record<string, string>>((acc, currency) => {
      const value = row.settings.currency_limit[currency.id]
      acc[`currency_${currency.id}`] = value === undefined || value === null ? "-" : `${value}%`
      return acc
    }, {})

    return {
      ...row,
      ...currencyValues
    }
  })
)

const tableColumns = computed<BaseTableColumn[]>(() => [
  { field: "account", header: t("menu.userAccount"), width: "180px" },
  { field: "direct_member_count", header: t("menu.directMemberCount"), width: "120px" },
  ...currencyColumns.value.map((currency) => ({
    field: `currency_${currency.id}`,
    header: currency.code,
    width: "110px"
  })),
  { field: "actions", header: t("menu.function"), width: "120px" }
])

const editDialogVisible = computed({
  get: () => editingRow.value !== null,
  set: (visible) => {
    if (!visible) editingRow.value = null
  }
})

const handleSearch = () => {
  submittedSearch.value = search.value.trim()
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleEdit = (payload: { memberId: number; account: string }) => {
  editingRow.value = payload
}

const handleRetry = () => {
  referralSettingQuery.refetch()
}

const loadCurrencyMap = async () => {
  const response = await fetchAvailableCurrencyList()
  if (!response.status) return

  currencyCodeById.value = (response.data?.currencies ?? []).reduce<Record<string, string>>((acc, currency) => {
    acc[String(currency.id)] = currency.code
    return acc
  }, {})
}

const getDownlineCountClass = (row: ReferralSettingItem) =>
  row.direct_member_count > 0
    ? "text-[var(--link)]"
    : "text-[var(--container-container-field-secondary)]"

const asReferralSettingRow = (row: Record<string, any>) => row as ReferralSettingItem

onMounted(() => {
  loadCurrencyMap()
})
</script>

<template>
  <section class="flex h-full min-h-0 w-full flex-col gap-3 rounded-lg bg-[var(--card-card-bg-fourth-enabled)] p-4">
    <form class="flex w-full items-end gap-2 phone:flex-col phone:items-stretch" @submit.prevent="handleSearch">
      <BaseInput
        v-model="search"
        :label="$t('menu.userAccount')"
        :placeholder="$t('placeholder.pleaseEnter')"
        :class-obj="{ root: '!w-[200px] phone:!w-full', input: '!h-10' }"
      />
      <BaseBtn theme="secondary" size="lg" class="w-[128px] phone:w-full" @click.prevent="handleSearch">
        {{ $t("common.btn.search") }}
      </BaseBtn>
    </form>

    <div
      v-if="referralSettingQuery.isError.value"
      class="flex min-h-[220px] flex-col items-center justify-center gap-3 text-[var(--text-text-primary)]"
    >
      <div>{{ referralSettingQuery.error.value?.message || "資料載入失敗" }}</div>
      <BaseBtn theme="secondary" size="lg" @click="handleRetry">重試</BaseBtn>
    </div>

    <template v-else>
      <div v-if="isMobile" class="flex w-full flex-col gap-3">
        <div v-if="isLoading" class="flex min-h-[220px] items-center justify-center text-[var(--text-text-primary)]">
          Loading...
        </div>

        <NoData v-else-if="rows.length === 0" type="empty" />

        <template v-else>
          <ReferralSettingMobileCard
            v-for="row in rows"
            :key="row.member_id"
            :row="row"
            :currency-columns="currencyColumns"
            @edit="handleEdit"
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
        :loading="isLoading"
        :pagination="true"
        :server-pagination="true"
        :page="currentPage"
        :rows-per-page="pageSize"
        :total-records="totalRecords"
        :data-table-props="tableDataTableProps"
        :is-show-mobile-card="false"
        row-key="member_id"
        @update:page="handlePageChange"
      >
        <template #cell-direct_member_count="{ data }">
          <span :class="cx('font-bold', getDownlineCountClass(asReferralSettingRow(data)))">
            {{ asReferralSettingRow(data).direct_member_count }}
          </span>
        </template>

        <template #cell-actions="{ data }">
          <BaseBtn
            theme="primary"
            category="outline"
            size="md"
            class="h-8 min-w-14 !rounded-lg !px-3 !py-1"
            @click="handleEdit({ memberId: asReferralSettingRow(data).member_id, account: asReferralSettingRow(data).account })"
          >
            {{ $t("common.btn.edit") }}
          </BaseBtn>
        </template>

        <template #empty>
          <NoData type="empty" />
        </template>
      </BaseTable>
    </template>

    <ReferralSettingEditDialog
      v-if="editingRow"
      v-model:visible="editDialogVisible"
      :member-id="editingRow.memberId"
      :member-account="editingRow.account"
    />
  </section>
</template>
