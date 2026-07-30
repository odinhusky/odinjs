<template>
  <q-table
    table-class="bg-white"
    table-header-class="bg-white"
    :rows="report.agentReportRows"
    :rows-per-page-options="[report.size]"
    :columns="report.agentReportColumns"
    :loading="report.isPageLoading"
    row-key="member_id"
    hide-pagination
    flat
    class="agent-report__table w-full shadow-none rounded-none"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #body="props">
      <q-tr :props="props">
        <q-td key="member_account" :props="props">
          <AgentReportTeamAccountCell :member-id="props.row.member_id" :member-account="props.row.member_account" />
        </q-td>
        <q-td v-for="col in report.agentReportMetricColumns" :key="col.name" :props="props">
          <span>{{ report.formatAgentReportTeamRowCell(props.row, col.name) }}</span>
        </q-td>
      </q-tr>
      <AgentReportTeamRowDetailRows :member-id="props.row.member_id" />
    </template>

    <template #no-data>
      <span class="text-[#4a4a4a]">{{ $t("tableHeader.no_data") }}</span>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
import { useAgentReportContext } from "../useAgentReportContext"
import AgentReportTeamAccountCell from "./AgentReportTeamAccountCell.vue"
import AgentReportTeamRowDetailRows from "./AgentReportTeamRowDetailRows.vue"

const report = useAgentReportContext()
</script>
