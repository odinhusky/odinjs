<script setup lang="ts">
import Chart from "primevue/chart"
import "chart.js/auto"
import type { ChartData, ChartOptions, ChartType, Plugin } from "chart.js"

interface Props {
  type: ChartType
  data: ChartData
  options?: ChartOptions
  plugins?: Plugin[]
  classObj?: {
    root?: string
    chart?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
  plugins: () => [],
  classObj: () => ({})
})
</script>

<template>
  <div :class="cx('w-full h-full', props.classObj?.root)">
    <Chart
      :type="props.type"
      :data="props.data"
      :options="props.options"
      :plugins="props.plugins"
      :pt="{
        root: {
          class: cx('w-full h-full', props.classObj?.chart)
        }
      }"
    />
  </div>
</template>
