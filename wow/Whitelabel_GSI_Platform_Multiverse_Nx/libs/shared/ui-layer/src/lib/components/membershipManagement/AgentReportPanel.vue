<script setup lang="ts">
import { useAgentReport } from "../../composables/useMembershipManagement/useAgentReport"
import AgentReportFilters from "./AgentReportFilters.vue"
import AgentReportSummaryCards from "./AgentReportSummaryCards.vue"
import AgentReportSelfTable from "./AgentReportSelfTable.vue"
import AgentReportTeamTable from "./AgentReportTeamTable.vue"
import AgentReportMobileSummary from "./AgentReportMobileSummary.vue"
import AgentReportMobileTeamList from "./AgentReportMobileTeamList.vue"

const {
  page,
  size,
  totalRecords,
  currencyId,
  dateRange,
  isSearching,
  isFetchingPersonal,
  isFetchingTeam,
  currencyOptions,
  summaryCards,
  selfTableRows,
  teamTableRows,
  mobileSummaryRows,
  hasTeamRows,
  handleSearch,
  handlePageChange
} = useAgentReport()

const { isDown } = useCustomBreakpoints()

const mobileSummaryExpanded = ref(true)
const expandedRowKey = ref<string>("")

const onToggleRow = (key: string) => {
  expandedRowKey.value = expandedRowKey.value === key ? "" : key
}

const mobileSectionTitleClass = "text-xl leading-7 font-bold text-[var(--text-text-primary)]"
</script>

<template>
  <div :class="cx(FLEX_COL, 'w-full gap-4')">
    <AgentReportFilters
      :currency-id="currencyId"
      :currency-options="currencyOptions"
      :date-range="dateRange"
      :is-searching="isSearching"
      @update:currency-id="currencyId = $event"
      @update:date-range="dateRange = $event"
      @search="handleSearch"
    />

    <AgentReportSummaryCards :data="summaryCards" />

    <!-- PC -->
    <template v-if="!isDown.phone">
      <AgentReportSelfTable :rows="selfTableRows" :is-loading="isFetchingPersonal" />
      <AgentReportTeamTable
        :rows="teamTableRows"
        :page="page"
        :size="size"
        :total-records="totalRecords"
        :is-loading="isFetchingTeam"
        @page-change="handlePageChange($event)"
      />
    </template>

    <!-- H5 -->
    <template v-else>
      <div :class="cx(FLEX_COL, 'w-full gap-3')">
        <h3 :class="mobileSectionTitleClass">自身數據</h3>
        <AgentReportMobileSummary
          :rows="mobileSummaryRows"
          :expanded="mobileSummaryExpanded"
          @toggle="mobileSummaryExpanded = !mobileSummaryExpanded"
        />
      </div>

      <div :class="cx(FLEX_COL, 'w-full gap-3')">
        <h3 :class="mobileSectionTitleClass">團隊數據</h3>
        <AgentReportMobileTeamList
          :rows="teamTableRows"
          :expanded-row-key="expandedRowKey"
          :is-loading="isFetchingTeam"
          @toggle-row="onToggleRow"
        />
      </div>
      <div v-if="hasTeamRows" class="flex justify-end pt-2">
        <BasePagination
          :model-value="page"
          :rows="size"
          :total-records="totalRecords"
          @update:model-value="handlePageChange($event)"
        />
      </div>
    </template>
  </div>
</template>
