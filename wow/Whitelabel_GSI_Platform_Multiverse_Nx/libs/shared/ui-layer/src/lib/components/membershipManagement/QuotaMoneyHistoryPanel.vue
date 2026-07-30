<script setup lang="ts">
import { MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS } from "@shared-src/lib/constants/enums/memberAgentQuotaSearchType"
import { useQuotaMoneyHistory } from "../../composables/useMembershipManagement/useQuotaMoneyHistory"

const {
  page,
  size,
  totalRecords,
  memberAccount,
  searchType,
  dateRange,
  actionTypeOptions,
  normalizedRows,
  isFetching,
  handleSearch,
  handlePageChange
} = useQuotaMoneyHistory()

const { isDown } = useCustomBreakpoints()

const columns = [
  { field: "member_account", header: "會員帳號", width: "140px" },
  { field: "updated_at_display", header: "帳變時間", width: "180px" },
  { field: "action_type_display", header: "帳變類型", width: "120px" },
  { field: "action_target_display", header: "帳變項目", width: "160px" },
  { field: "amount_display", header: "帳變金額", width: "130px" },
  { field: "before_balance_display", header: "帳變前額度", width: "150px" },
  { field: "after_balance_display", header: "帳變後額度", width: "150px" },
  { field: "currency_code", header: "幣別", width: "100px" }
]

const inputClass = cx(
  "w-full rounded-lg px-4 py-2 text-base leading-6",
  "bg-[var(--input-input-bg-primary-enabled)] text-[var(--text-text-primary)]",
  "border-2 border-[var(--input-input-border-primary-enabled)]",
  "placeholder:text-[var(--input-input-placeholder-primary-enabled)]",
  "outline-none focus:border-[var(--input-input-border-primary-focused)]"
)

const labelCls = "text-sm leading-5 text-[var(--text-text-primary)]"

const selectClassObj = {
  select:
    "!bg-[var(--input-input-bg-primary-enabled)] [&_.p-select-dropdown]:!bg-transparent [&_.p-select-dropdown]:!border-0 [&_.p-select-dropdown]:!shadow-none [&_.p-select-dropdown]:!w-auto [&_.p-select-dropdown]:!px-0 [&_.p-select-dropdown]:!pr-3",
  selectLabel: "!pl-4 !pr-1 !py-2",
  dropdown: "!ml-0 !p-0 !bg-transparent !border-0 !shadow-none"
}

const filterRangeDates = computed<string[] | null>({
  get: () => {
    if (!Array.isArray(dateRange.value) || dateRange.value.length < 2) return dateRange.value ?? null
    return dateRange.value
  },
  set: (value) => {
    if (value == null) {
      dateRange.value = null
      return
    }
    if (!Array.isArray(value) || value.length < 2 || !value[0] || !value[1]) return
    dateRange.value = [value[0], value[1]]
  }
})

const handleSearchTypeUpdate = (value: unknown) => {
  searchType.value = Number(value ?? MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.ALL) as MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS
}
</script>

<template>
  <div :class="cx(FLEX_COL, 'w-full gap-4')">
    <!-- PC filter -->
    <div v-if="!isDown.phone" :class="cx(FLEX_ITEMS_END, 'flex-wrap gap-3 w-full')">
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

      <div class="flex flex-col gap-1 w-[160px]">
        <span :class="labelCls">帳變類型</span>
        <BaseSelect
          :model-value="searchType"
          :options="actionTypeOptions"
          option-label="label"
          option-value="value"
          :class-obj="selectClassObj"
          @update:model-value="handleSearchTypeUpdate"
        />
      </div>

      <div class="flex flex-col gap-1 w-[285px]">
        <span :class="labelCls">查詢時間</span>
        <BaseDatePicker
          v-model="filterRangeDates"
          selection-mode="range"
          placeholder="yyyy-mm-dd ~ yyyy-mm-dd"
          :show-clear-button="true"
          clear-label="X"
          :class-obj="{ root: '!w-full !max-w-none', input: '!w-full' }"
        />
      </div>

      <BaseBtn theme="secondary" size="lg" :loading="isFetching" class="shrink-0 w-[100px]" @click="handleSearch">
        搜尋
      </BaseBtn>
    </div>

    <!-- H5 filter -->
    <div v-else :class="cx(FLEX_COL, 'w-full gap-4')">
      <div class="flex flex-col gap-1">
        <span :class="labelCls">查詢時間</span>
        <BaseDatePicker
          v-model="filterRangeDates"
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

      <div class="flex flex-col gap-1">
        <span :class="labelCls">帳變類型</span>
        <BaseSelect
          :model-value="searchType"
          :options="actionTypeOptions"
          option-label="label"
          option-value="value"
          :class-obj="selectClassObj"
          @update:model-value="handleSearchTypeUpdate"
        />
      </div>

      <BaseBtn theme="secondary" size="lg" :loading="isFetching" class="w-full" @click="handleSearch">
        搜尋
      </BaseBtn>
    </div>

    <div v-if="isFetching" class="flex justify-center py-8">
      <BaseIcon name="mdi:loading" size="32px" class="animate-spin text-[var(--text-text-secondary)]" />
    </div>

    <template v-else-if="!isDown.phone">
      <BaseTable
        row-key="_rowKey"
        :rows="normalizedRows"
        :columns="columns"
        :loading="false"
        :pagination="true"
        :server-pagination="true"
        :page="page"
        :rows-per-page="size"
        :total-records="totalRecords"
        @page-change="handlePageChange($event.page)"
        @update:page="handlePageChange($event)"
      >
        <template #empty>
          <NoData />
        </template>
      </BaseTable>
    </template>

    <template v-else>
      <div v-if="!normalizedRows.length" class="flex justify-center py-8">
        <NoData />
      </div>

      <template v-else>
        <div
          v-for="row in normalizedRows"
          :key="row._rowKey"
          :class="cx('w-full rounded-lg p-4 flex flex-col gap-3 bg-[var(--list-list-bg-enabled)]')"
        >
          <div :class="cx(FLEX_ITEMS_CENTER, 'justify-between gap-3')">
            <div class="min-w-0">
              <div class="text-sm font-bold text-[var(--button-button-bg-primary-left-enabled)] truncate">
                {{ row.member_account }}
              </div>
              <div class="text-[10px] text-[var(--list-list-subtitle-enabled)]">會員帳號</div>
            </div>

            <div class="text-right shrink-0">
              <div class="text-sm font-bold text-[var(--text-text-primary)]">{{ row.amount_display }}</div>
              <div class="text-[10px] text-[var(--list-list-subtitle-enabled)]">帳變金額</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div v-for="col in columns.slice(1)" :key="col.field">
              <div class="text-[10px] text-[var(--list-list-subtitle-enabled)]">{{ col.header }}</div>
              <div class="font-semibold text-[var(--text-text-primary)] break-all">{{ row[col.field] }}</div>
            </div>
          </div>
        </div>

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
