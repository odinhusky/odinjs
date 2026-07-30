<template>
  <div class="agent-report__self-data w-full mb-5">
    <div class="agent-report__section-title flex items-center gap-1 w-auto mb-1 md:mb-2.5">
      <span>{{ $t("member.membershipManagement.selfData") }}</span>
      <q-icon
        v-if="showOwnDetailExpandIcon"
        :name="report.agentReportOwnDetailExpanded ? 'arrow_drop_up' : 'arrow_drop_down'"
        class="agent-report__section-title-icon cursor-pointer mr-1 align-middle shrink-0"
        @click.stop.prevent="report.toggleAgentReportOwnDetail()"
      />
      <q-spinner v-if="report.agentReportOwnDetailLoading" size="1rem" class="mr-1 align-middle shrink-0" />
    </div>

    <AgentReportPersonalTable />
    <AgentReportTeamTable />
  </div>
</template>

<script lang="ts" setup>
import { computed, toValue } from "vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useAgentReportContext } from "../useAgentReportContext"
import AgentReportPersonalTable from "./AgentReportPersonalTable.vue"
import AgentReportTeamTable from "./AgentReportTeamTable.vue"

const { isMobile } = useMediaQuery()
const report = useAgentReportContext()

const showOwnDetailExpandIcon = computed(() => {
  if (!toValue(report.isAgentReportOwnDetailExpandIconVisible)) return false
  if (isMobile.value && toValue(report.agentReportOwnDetailExpanded)) return false
  return true
})
</script>
