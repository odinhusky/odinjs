<template>
  <div class="agent-report__table-scroll">
    <div :class="tableClass">
    <div class="agent-report__data-row agent-report__data-row--header">
      <div
        class="agent-report__data-area"
        :class="{ 'agent-report__data-area--span-2': leadingSpan > 1 }"
      >
        <div class="agent-report__header-item">{{ headers[0] }}</div>
      </div>
      <div v-for="(label, index) in headers.slice(1)" :key="index" class="agent-report__data-area">
        <div class="agent-report__header-item">{{ label }}</div>
      </div>
    </div>

    <div class="agent-report__data-row agent-report__data-row--summary">
      <div
        v-for="(cell, index) in summaryCells"
        :key="index"
        class="agent-report__data-area"
        :class="{ 'agent-report__data-area--span-2': index === 0 && leadingSpan > 1 }"
      >
        <div class="agent-report__data-item">{{ cell }}</div>
      </div>
    </div>

    <template v-if="showDetails && detailRows.length">
      <div
        v-for="(detail, detailIndex) in detailRows"
        :key="detailIndex"
        class="agent-report__data-row agent-report__data-row--detail"
      >
        <div
          class="agent-report__data-area agent-report__data-area--span-2 agent-report__data-area--detail"
        >
          <div class="agent-report__data-item">{{ detail.walletLabel }}</div>
        </div>
        <div
          v-for="(value, index) in detail.metricValues"
          :key="index"
          class="agent-report__data-area agent-report__data-area--detail"
        >
          <div class="agent-report__data-item">{{ value }}</div>
        </div>
        <div
          v-for="index in detail.trailingEmptyCount"
          :key="`empty-${index}`"
          class="agent-report__data-area agent-report__data-area--empty agent-report__data-area--detail"
        >
          <div class="agent-report__data-item" />
        </div>
      </div>
    </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

export type AgentReportDesktopDataGridDetailRow = {
  walletLabel: string
  metricValues: string[]
  trailingEmptyCount: number
}

const props = withDefaults(
  defineProps<{
    tableClass: string
    headers: string[]
    summaryCells: string[]
    detailRows: AgentReportDesktopDataGridDetailRow[]
    showDetails: boolean
    leadingColumnSpan?: number
  }>(),
  {
    leadingColumnSpan: 1
  }
)

const leadingSpan = computed(() => props.leadingColumnSpan)
</script>
