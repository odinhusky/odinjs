<template>
  <div class="agent-report-brand">
    <AgentReport :active="active" />
  </div>
</template>

<script lang="ts" setup>
import AgentReport from "src/common/components/AgentReport/Index.vue"

defineProps<{
  active?: boolean
}>()
</script>

<style lang="scss">
@import "app/template/set_r025/assets/css/agentReport.scss";
</style>
