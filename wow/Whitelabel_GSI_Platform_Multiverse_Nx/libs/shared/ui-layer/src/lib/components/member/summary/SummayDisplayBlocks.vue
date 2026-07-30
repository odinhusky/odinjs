<script setup lang="ts">
import type { ChartData, ChartOptions } from "chart.js"
import type { SummaryCardItem } from "../../../composables/useSummary/types"

interface Props {
  summaryCards: SummaryCardItem[]
  depositAmount: number
  withdrawAmount: number
  doughnutData: ChartData<"doughnut">
  doughnutOptions: ChartOptions<"doughnut">
}

const props = defineProps<Props>()
</script>

<template>
  <section class="w-full grid grid-cols-[minmax(0,260px)_1fr] gap-1 phone:grid-cols-1">
    <div class="rounded-lg bg-[var(--card-card-bg-primary-enabled)] px-3 py-2 flex flex-col gap-2 min-h-[116px]">
      <div class="text-xs leading-none font-medium capitalize text-[var(--card-card-title-fourth-enabled)]">
        存款/出金
      </div>

      <div class="grid grid-cols-[90px_1fr] items-center gap-2">
        <div class="w-[90px] h-auto py-2.5">
          <BaseChart
            type="doughnut"
            :data="props.doughnutData"
            :options="props.doughnutOptions"
            :class-obj="{ chart: '!h-[90px] !w-[90px]' }"
          />
        </div>

        <div :class="cx(FLEX_COL, 'gap-2')">
          <SummaryDonutsCategoryDisplay
            label="存款"
            :amount="props.depositAmount"
            color-class="bg-[var(--card-card-chart-primary)]"
          />

          <SummaryDonutsCategoryDisplay
            label="出金"
            :amount="props.withdrawAmount"
            color-class="bg-[var(--card-card-chart-second)]"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-1 phone:grid-cols-2">
      <SummayDisplayBlock v-for="card in props.summaryCards" :key="card.key" :label="card.label" :value="card.value" />
    </div>
  </section>
</template>
