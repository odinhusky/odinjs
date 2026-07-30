<template>
  <div class="agent-report__matrix">
    <div
      v-if="walletHeaders.length"
      class="agent-report__matrix-row agent-report__matrix-row--header"
    >
      <div class="agent-report__matrix-cell agent-report__matrix-cell--label" />
      <div class="agent-report__matrix-cell" />
      <div v-for="(header, index) in walletHeaders" :key="index" class="agent-report__matrix-cell">
        {{ header }}
      </div>
    </div>

    <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="agent-report__matrix-row">
      <div class="agent-report__matrix-cell agent-report__matrix-cell--label">{{ row.label }}</div>
      <div class="agent-report__matrix-cell">
        <slot name="basic" :row="row" :row-index="rowIndex">
          {{ row.basic }}
        </slot>
      </div>
      <div
        v-for="(_, colIndex) in walletHeaders"
        :key="colIndex"
        class="agent-report__matrix-cell agent-report__matrix-cell--wallet"
      >
        {{ row.wallets ? (row.wallets[colIndex] ?? AGENT_REPORT_EMPTY_VALUE) : AGENT_REPORT_EMPTY_VALUE }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AGENT_REPORT_EMPTY_VALUE } from "../utils/formatters"

export type AgentReportOverviewMobileMatrixRow = {
  label: string
  basic: string | number
  wallets: (string | number)[] | null
}

defineProps<{
  rows: AgentReportOverviewMobileMatrixRow[]
  walletHeaders: string[]
}>()
</script>

<style lang="scss" scoped>
.agent-report__matrix-cell {
  border: none !important;
  box-shadow: none !important;
}
</style>
