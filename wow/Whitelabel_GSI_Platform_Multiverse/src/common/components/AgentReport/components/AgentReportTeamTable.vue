<template>
  <AgentReportOverviewMobileMatrix
    v-if="isMobile"
    :rows="report.agentReportTeamMobileMatrixRows"
    :wallet-headers="report.agentReportTeamMobileMatrixWalletHeaders"
  />

  <AgentReportDesktopDataGrid
    v-else
    table-class="agent-report__team-table"
    :headers="report.agentReportTeamTableHeaders"
    :summary-cells="teamSummaryCells"
    :detail-rows="teamDetailRows"
    :show-details="report.agentReportOwnDetailExpanded && report.agentReportOwnDetailTeamList.length > 0"
    :leading-column-span="2"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useAgentReportContext } from "../useAgentReportContext"
import AgentReportDesktopDataGrid from "./AgentReportDesktopDataGrid.vue"
import AgentReportOverviewMobileMatrix from "./AgentReportOverviewMobileMatrix.vue"

const { isMobile } = useMediaQuery()
const report = useAgentReportContext()

const teamSummaryCells = computed(() => [
  report.agentReportTeamSummaryMemberCount,
  ...report.agentReportTeamSummarySharedValues,
  report.agentReportTeamSummaryClickCount,
  report.agentReportTeamSummaryRegisterCount,
  report.agentReportTeamSummaryFirstDepositCount
])

const teamDetailRows = computed(() =>
  report.agentReportOwnDetailTeamList.map((detail) => ({
    walletLabel: report.formatWalletTypeLabel(detail.wallet_type),
    metricValues: report.formatMetricCells(detail),
    trailingEmptyCount: 3
  }))
)
</script>
