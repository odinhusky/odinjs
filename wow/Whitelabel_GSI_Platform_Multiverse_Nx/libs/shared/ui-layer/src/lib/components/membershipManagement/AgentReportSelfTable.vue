<script setup lang="ts">
import type { AgentReportSelfRow } from "../../composables/useMembershipManagement/types"

interface Props {
  rows: AgentReportSelfRow[]
  isLoading: boolean
}

defineProps<Props>()

const columns = [
  { field: "label", header: "", width: "120px" },
  { field: "bet_count_display", header: "注單量", width: "120px" },
  { field: "deposit_display", header: "存款", width: "120px" },
  { field: "withdraw_display", header: "出金", width: "120px" },
  { field: "bet_amount_display", header: "投注金額", width: "120px" },
  { field: "valid_bet_display", header: "有效投注", width: "120px" },
  { field: "prize_display", header: "派彩", width: "120px" },
  { field: "profit_display", header: "盈虧", width: "120px" },
  { field: "rate_display", header: "盈虧比", width: "120px" },
  { field: "bonus_display", header: "活動獎金", width: "120px" }
]
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <!-- Section title with purple left bar -->
    <div :class="cx(FLEX_ITEMS_CENTER, 'gap-2')">
      <span class="inline-block w-1 h-4 rounded bg-[var(--button-button-bg-secondary-left-enabled)]" />
      <span class="text-base leading-6 font-bold text-[var(--text-text-primary)]">自身數據</span>
    </div>
    <BaseTable
      :rows="rows"
      :columns="columns"
      :loading="isLoading"
      :pagination="false"
    >
      <template #cell-label="{ data }">
        <span class="font-bold text-[var(--text-text-primary)]">{{ data.label }}</span>
      </template>
      <template #empty>
        <NoData />
      </template>
    </BaseTable>
  </div>
</template>
