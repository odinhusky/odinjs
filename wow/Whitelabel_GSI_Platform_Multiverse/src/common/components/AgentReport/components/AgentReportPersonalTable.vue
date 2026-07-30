<template>
  <AgentReportOverviewMobileMatrix
    v-if="isMobile"
    :rows="report.agentReportPersonalMobileMatrixRows"
    :wallet-headers="report.agentReportPersonalMobileMatrixWalletHeaders"
  />

  <AgentReportDesktopDataGrid
    v-else
    table-class="agent-report__personal-table"
    :headers="report.agentReportPersonalTableHeaders"
    :summary-cells="personalSummaryCells"
    :detail-rows="personalDetailRows"
    :show-details="report.agentReportOwnDetailExpanded && report.agentReportOwnDetailList.length > 0"
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

const personalSummaryCells = computed(() => [
  report.agentReportPersonalSummaryAccount,
  report.agentReportPersonalSummaryCurrency,
  ...report.agentReportPersonalSummarySharedValues,
  report.agentReportPersonalSummaryClickCount
])

const personalDetailRows = computed(() =>
  report.agentReportOwnDetailList.map((detail) => ({
    walletLabel: report.formatWalletTypeLabel(detail.wallet_type),
    metricValues: report.formatMetricCells(detail),
    trailingEmptyCount: 1
  }))
)
</script>
