<script setup lang="ts">
import { useBetReportTab } from "../../composables/useMembershipManagement/useBetReportTab"

const emit = defineEmits<{
  "drill-down": [account: string, dateRange: string[] | null]
}>()

const {
  page,
  size,
  totalRecords,
  memberAccount,
  dateRange,
  lastSearchDateRange,
  isFetching,
  normalizedRows,
  pageSummaryRow,
  totalSummaryRow,
  handleSearch,
  handlePageChange
} = useBetReportTab()

const { isDown } = useCustomBreakpoints()

const columns = [
  { field: "member_account", header: "帳號" },
  { field: "bet_count_display", header: "訂單數量" },
  { field: "win_count_display", header: "贏的次數" },
  { field: "bet_amount_display", header: "投注金額" },
  { field: "valid_bet_amount_display", header: "有效投注" },
  { field: "payout_display", header: "派彩" },
  { field: "profit_display", header: "輸贏" },
  { field: "profit_rate_display", header: "輸贏率" },
  { field: "bonus_display", header: "活動彩金" }
]

const inputClass = cx(
  "w-full rounded-lg px-4 py-2 text-base leading-6",
  "bg-[var(--input-input-bg-primary-enabled)] text-[var(--text-text-primary)]",
  "border-2 border-[var(--input-input-border-primary-enabled)]",
  "placeholder:text-[var(--input-input-placeholder-primary-enabled)]",
  "outline-none focus:border-[var(--input-input-border-primary-focused)]"
)

const labelCls = "text-sm leading-5 text-[var(--text-text-primary)]"

const handleAccountClick = (account: string) => {
  emit("drill-down", account, lastSearchDateRange.value)
}

// ── 合計列合併到 table 末尾顯示 ──
const summaryRows = computed(() => {
  const rows = []
  if (pageSummaryRow.value) rows.push({ ...pageSummaryRow.value, _isSummary: true })
  if (totalSummaryRow.value) rows.push({ ...totalSummaryRow.value, _isSummary: true })
  return rows
})

const tableRows = computed(() => [...normalizedRows.value, ...summaryRows.value])
</script>

<template>
  <div :class="cx(FLEX_COL, 'w-full gap-4')">
    <!-- 篩選列：對齊其他 tab（label 在上、查詢時間 w-[285px]、按鈕 w-[100px]） -->
    <!-- PC -->
    <div v-if="!isDown.phone" :class="cx(FLEX_ITEMS_END, 'flex-wrap gap-3 w-full')">
      <!-- 會員帳號（選填） -->
      <div class="flex flex-col gap-1 w-[180px]">
        <span :class="labelCls">會員帳號</span>
        <input
          :class="inputClass"
          :value="memberAccount"
          placeholder="請輸入..."
          @input="memberAccount = ($event.target as HTMLInputElement).value"
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- 查詢時間 -->
      <div class="flex flex-col gap-1">
        <span :class="labelCls">查詢時間</span>
        <div class="w-[285px]">
          <BaseDatePicker
            v-model="dateRange"
            selection-mode="range"
            placeholder="yyyy-mm-dd ~ yyyy-mm-dd"
            :show-clear-button="true"
            clear-label="X"
            :class-obj="{
              root: '!w-full !max-w-none',
              input: '!w-full'
            }"
          />
        </div>
      </div>

      <BaseBtn theme="secondary" size="lg" class="shrink-0 w-[100px]" :loading="isFetching" @click="handleSearch">
        搜尋
      </BaseBtn>
    </div>

    <!-- H5 -->
    <div v-else :class="cx(FLEX_COL, 'w-full gap-4')">
      <div class="flex flex-col gap-1">
        <span :class="labelCls">查詢時間</span>
        <BaseDatePicker
          v-model="dateRange"
          selection-mode="range"
          placeholder="yyyy-mm-dd ~ yyyy-mm-dd"
          :show-clear-button="true"
          clear-label="X"
          :class-obj="{
            root: '!w-full !max-w-none',
            input: '!w-full',
            panelRoot: 'phone:!w-full'
          }"
        />
      </div>

      <div class="flex flex-col gap-1">
        <span :class="labelCls">會員帳號</span>
        <input
          :class="inputClass"
          :value="memberAccount"
          placeholder="請輸入..."
          @input="memberAccount = ($event.target as HTMLInputElement).value"
          @keyup.enter="handleSearch"
        />
      </div>

      <BaseBtn theme="secondary" size="lg" :loading="isFetching" class="w-full" @click="handleSearch">
        搜尋
      </BaseBtn>
    </div>

    <!-- Loading -->
    <div v-if="isFetching" class="flex justify-center py-8">
      <BaseIcon name="mdi:loading" size="32px" class="animate-spin text-[var(--text-text-secondary)]" />
    </div>

    <!-- PC 表格 -->
    <template v-else-if="!isDown.phone">
      <BaseTable
        :rows="tableRows"
        :columns="columns"
        :loading="false"
        :pagination="true"
        :server-pagination="true"
        :page="page"
        :rows-per-page="size"
        :total-records="totalRecords"
        @page-change="handlePageChange($event.page)"
      >
        <template #cell-member_account="{ data }">
          <span
            v-if="!data._isSummary"
            class="cursor-pointer text-[var(--button-button-bg-primary-left-enabled)] hover:underline"
            @click="handleAccountClick(data.member_account)"
          >
            {{ data.member_account }}
          </span>
          <span v-else class="font-bold text-[var(--text-text-primary)]">
            {{ data.member_account }}
          </span>
        </template>

        <template #empty>
          <NoData />
        </template>
      </BaseTable>
    </template>

    <!-- Mobile 卡片列表 -->
    <template v-else>
      <div v-if="!tableRows.length" class="flex justify-center py-8">
        <NoData />
      </div>

      <template v-else>
        <div
          v-for="(row, idx) in tableRows"
          :key="idx"
          :class="cx(
            'w-full rounded-lg p-4 flex flex-col gap-3',
            row._isSummary
              ? 'bg-[var(--list-list-bg-hover)] border border-[var(--input-input-border-primary-enabled)]'
              : 'bg-[var(--list-list-bg-enabled)]'
          )"
        >
          <!-- 帳號列 -->
          <div :class="cx(FLEX_ITEMS_CENTER, 'justify-between')">
            <span
              v-if="!row._isSummary"
              class="text-sm font-bold cursor-pointer text-[var(--button-button-bg-primary-left-enabled)] hover:underline"
              @click="handleAccountClick(row.member_account)"
            >
              {{ row.member_account }}
            </span>
            <span v-else class="text-sm font-bold text-[var(--text-text-primary)]">
              {{ row.member_account }}
            </span>
          </div>

          <!-- 數據格 -->
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div v-for="col in columns.slice(1)" :key="col.field">
              <div class="text-[10px] text-[var(--list-list-subtitle-enabled)]">{{ col.header }}</div>
              <div class="font-semibold text-[var(--text-text-primary)]">{{ row[col.field] }}</div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-end pt-2">
          <BasePagination
            :model-value="page"
            :rows="size"
            :total-records="totalRecords"
            @update:model-value="handlePageChange($event)"
          />
        </div>
      </template>
    </template>
  </div>
</template>
