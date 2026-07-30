<template>
  <AgentReportLayout>
    <AgentReportTeamDesktopTable v-if="!isMobile" />

    <div v-else class="agent-report__team-data relative text-xs font-normal">
      <q-inner-loading :showing="report.isPageLoading" color="primary" />
      <div v-if="report.agentReportRows?.length" class="w-full">
        <AgentReportTeamListMobileCard v-for="data in report.agentReportRows" :key="data.member_id" :data="data" />
      </div>

      <div v-else class="agent-report__no-data flex justify-center items-center w-full mb-5">
        <span class="m-5">{{ $t("tableHeader.no_data") }}</span>
      </div>
    </div>

    <div v-if="report.totalPage" class="flex justify-end mt-5">
      <q-pagination
        v-model="report.page"
        :max="report.totalPage"
        direction-links
        flat
        active-design="flat"
        color="deep-grey"
        active-color="blue-8"
        icon-prev="chevron_left"
        icon-next="chevron_right"
        @update:model-value="report.handleChangePage"
      />
    </div>
  </AgentReportLayout>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, provide, watch } from "vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useAgentReport } from "src/common/composables/useAgentReport"
import { AGENT_REPORT_KEY } from "./useAgentReportContext"
import AgentReportLayout from "./components/AgentReportLayout.vue"
import AgentReportTeamDesktopTable from "./components/AgentReportTeamDesktopTable.vue"
import AgentReportTeamListMobileCard from "./components/AgentReportTeamListMobileCard.vue"

const props = withDefaults(
  defineProps<{
    active?: boolean
  }>(),
  {
    active: true,
  }
)

const { isMobile } = useMediaQuery()
const report = useAgentReport()

provide(AGENT_REPORT_KEY, report)

onBeforeUnmount(() => {
  report.reset()
})

defineExpose({
  reset: () => report.reset(),
})

watch(
  () => props.active,
  async (active) => {
    if (active) {
      await report.activateTab()
    }
  },
  { immediate: true }
)
</script>

<style lang="scss">
@import "./agentReport.scss";
</style>
