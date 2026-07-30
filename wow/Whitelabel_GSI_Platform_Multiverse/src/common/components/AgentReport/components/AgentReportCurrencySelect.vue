<template>
  <q-select
    v-model="report.agentReportCurrencyId"
    :options="report.agentReportCurrencyList"
    rounded
    dense
    borderless
    hide-bottom-space
    emit-value
    map-options
    option-label="label"
    option-value="value"
    :class="selectClass"
  />
</template>

<script lang="ts" setup>
import { useAgentReportContext } from "../useAgentReportContext"

defineProps<{
  selectClass: string
}>()

const report = useAgentReportContext()
</script>
