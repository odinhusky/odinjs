<script setup lang="ts">
import type { AgentReportTeamRow } from "../../composables/useMembershipManagement/types"

interface Props {
  rows: AgentReportTeamRow[]
  page: number
  size: number
  totalRecords: number
  isLoading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "page-change", page: number): void
}>()

const columns = [
  { field: "member_account", header: "會員帳號", width: "140px" },
  { field: "member_count_display", header: "團隊人數", width: "100px" },
  { field: "bet_count_display", header: "注單量", width: "100px" },
  { field: "deposit_display", header: "存款", width: "120px" },
  { field: "withdraw_display", header: "出金", width: "120px" },
  { field: "bet_amount_display", header: "投注", width: "120px" },
  { field: "valid_bet_display", header: "有效投注額", width: "130px" },
  { field: "prize_display", header: "派彩", width: "120px" },
  { field: "profit_display", header: "盈虧", width: "120px" },
  { field: "rate_display", header: "盈虧比", width: "120px" },
  { field: "bonus_display", header: "活動獎金", width: "120px" }
]
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div :class="cx(FLEX_ITEMS_CENTER, 'gap-2')">
      <span class="inline-block w-1 h-4 rounded bg-[var(--button-button-bg-secondary-left-enabled)]" />
      <span class="text-base leading-6 font-bold text-[var(--text-text-primary)]">團隊數據</span>
    </div>
    <BaseTable
      :rows="props.rows"
      :columns="columns"
      :loading="props.isLoading"
      :pagination="true"
      :server-pagination="true"
      :page="props.page"
      :rows-per-page="props.size"
      :total-records="props.totalRecords"
      @page-change="emit('page-change', $event.page)"
      @update:page="emit('page-change', $event)"
    >
      <template #empty>
        <NoData />
      </template>
    </BaseTable>
  </div>
</template>
