<script setup lang="ts">
import type { AgentReportMobileSummaryRow } from "../../composables/useMembershipManagement/types"

interface Props {
  rows: AgentReportMobileSummaryRow[]
  expanded: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "toggle"): void
}>()

const onToggle = () => emit("toggle")
</script>

<template>
  <div
    class="w-full rounded-lg border border-[var(--border-border-primary)] bg-[var(--list-list-bg-enabled)] overflow-hidden"
  >
    <button
      type="button"
      class="w-full flex items-center justify-between px-4 py-3"
      @click="onToggle"
    >
      <div class="flex items-center gap-2">
        <BaseIcon name="mdi:chart-box-outline" size="18px" class="text-[var(--text-text-primary)]" />
        <span class="text-sm font-bold text-[var(--text-text-primary)]">金額總計</span>
      </div>
      <BaseIcon
        :name="props.expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
        size="20px"
        class="text-[var(--text-text-secondary)]"
      />
    </button>

    <div v-if="props.expanded" class="border-t border-[var(--border-border-primary)]">
      <div
        class="grid grid-cols-3 px-4 py-2 text-xs font-bold text-[var(--list-list-subtitle-enabled)] bg-[var(--list-list-bg-hover)]"
      >
        <span>項目</span>
        <span class="text-right">本頁總計</span>
        <span class="text-right">搜尋結果總計</span>
      </div>
      <div
        v-for="row in props.rows"
        :key="row.label"
        class="grid grid-cols-3 px-4 py-2 text-sm border-t border-[var(--border-border-primary)]"
      >
        <span class="text-[var(--list-list-subtitle-enabled)]">{{ row.label }}</span>
        <span class="text-right font-semibold text-[var(--text-text-primary)]">{{ row.pageValue }}</span>
        <span class="text-right font-semibold text-[var(--text-text-primary)]">{{ row.totalValue }}</span>
      </div>
    </div>
  </div>
</template>
