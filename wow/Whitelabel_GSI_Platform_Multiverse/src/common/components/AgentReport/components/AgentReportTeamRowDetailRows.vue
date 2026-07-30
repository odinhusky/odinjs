<template>
  <template v-if="report.isAgentReportTeamRowDetailExpanded(memberId)">
    <q-tr
      v-if="report.isAgentReportTeamRowDetailLoading(memberId)"
      class="agent-report__team-detail-tr"
    >
      <q-td :colspan="report.agentReportColumns.length">
        <div class="flex justify-center p-3">
          <q-spinner size="1.5rem" />
        </div>
      </q-td>
    </q-tr>
    <q-tr
      v-for="(detail, detailIndex) in report.getAgentReportTeamRowDetailList(memberId)"
      :key="`team-detail-${memberId}-${detailIndex}`"
      class="agent-report__team-detail-tr"
    >
      <q-td
        :colspan="report.agentReportTeamRowDetailColspans.leadingColspan"
        class="text-center whitespace-nowrap"
      >
        {{ report.formatWalletTypeLabel(detail.wallet_type) }}
      </q-td>
      <q-td
        v-for="(value, cellIndex) in report.formatMetricCells(detail)"
        :key="cellIndex"
        class="text-center whitespace-nowrap"
      >
        {{ value }}
      </q-td>
      <q-td
        :colspan="report.agentReportTeamRowDetailColspans.trailingColspan"
        class="text-center whitespace-nowrap"
      />
    </q-tr>
  </template>
</template>

<script lang="ts" setup>
import { useAgentReportContext } from "../useAgentReportContext"

defineProps<{
  memberId: number
}>()

const report = useAgentReportContext()
</script>
