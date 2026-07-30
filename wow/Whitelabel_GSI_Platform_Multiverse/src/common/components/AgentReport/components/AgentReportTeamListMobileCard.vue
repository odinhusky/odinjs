<template>
  <AgentReportOverviewMobileMatrix
    :rows="report.getAgentReportTeamListMobileMatrixRows(data)"
    :wallet-headers="report.getAgentReportTeamListMobileMatrixWalletHeaders(data.member_id)"
  >
    <template #basic="{ row, rowIndex }">
      <AgentReportTeamAccountCell
        v-if="rowIndex === 0"
        :member-id="data.member_id"
        :member-account="String(row.basic)"
      />
      <template v-else>{{ row.basic }}</template>
    </template>
  </AgentReportOverviewMobileMatrix>
</template>

<script lang="ts" setup>
import type * as Response from "src/api/response.type"
import { useAgentReportContext } from "../useAgentReportContext"
import AgentReportOverviewMobileMatrix from "./AgentReportOverviewMobileMatrix.vue"
import AgentReportTeamAccountCell from "./AgentReportTeamAccountCell.vue"

defineProps<{
  data: Response.GetMemberTeamAgentReportList
}>()

const report = useAgentReportContext()
</script>
