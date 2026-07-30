<script setup lang="ts">
import { useBetRecordQuery } from "../../composables/useMembershipManagement/useBetRecordQuery"
import BetRecordQueryFilters from "./BetRecordQueryFilters.vue"
import BetRecordQueryTablePanel from "./BetRecordQueryTablePanel.vue"
import BetRecordQueryMobileSummaryCard from "./BetRecordQueryMobileSummaryCard.vue"
import BetRecordQueryMobileList from "./BetRecordQueryMobileList.vue"

interface Props {
  initialMemberAccount?: string
  initialDateRange?: string[] | null
}

const props = withDefaults(defineProps<Props>(), {
  initialMemberAccount: "",
  initialDateRange: null
})

const {
  page,
  size,
  totalRecords,
  memberAccount,
  wagerCode,
  dateRange,
  dateTypeMode,
  isFetching,
  openingWagerCode,
  normalizedRows,
  pageSummaryRow,
  totalSummaryRow,
  mobileSummaryRows,
  hasRows,
  handleSearch,
  handlePageChange,
  handleOpenDetail,
  applyDrillDown
} = useBetRecordQuery()

const { isDown } = useCustomBreakpoints()

const mobileSummaryExpanded = ref(true)
const expandedRowKey = ref<string>("")

const onToggleRow = (key: string) => {
  expandedRowKey.value = expandedRowKey.value === key ? "" : key
}

onMounted(() => {
  if (props.initialMemberAccount || (props.initialDateRange && props.initialDateRange[0])) {
    applyDrillDown(props.initialMemberAccount, props.initialDateRange ?? null)
  }
})

watch(
  () => [props.initialMemberAccount, props.initialDateRange] as const,
  ([account, range]) => {
    if (!account && !(range && range[0])) return
    applyDrillDown(account, range ?? null)
  }
)
</script>

<template>
  <!-- dark container 已提升至 page level（membershipManagement.vue），此處只負責內容堆疊 -->
  <div :class="cx(FLEX_COL, 'w-full gap-4')">
    <BetRecordQueryFilters
      :wager-code="wagerCode"
      :member-account="memberAccount"
      :date-range="dateRange"
      :date-type-mode="dateTypeMode"
      :is-searching="isFetching"
      @update:wager-code="wagerCode = $event"
      @update:member-account="memberAccount = $event"
      @update:date-range="dateRange = $event"
      @update:date-type-mode="dateTypeMode = $event"
      @search="handleSearch"
    />

    <!-- PC -->
    <template v-if="!isDown.phone">
      <BetRecordQueryTablePanel
        :rows="normalizedRows"
        :page-summary="pageSummaryRow"
        :total-summary="totalSummaryRow"
        :page="page"
        :size="size"
        :total-records="totalRecords"
        :is-loading="isFetching"
        :opening-wager-code="openingWagerCode"
        @page-change="handlePageChange($event)"
        @open-detail="handleOpenDetail"
      />
    </template>

    <!-- H5 -->
    <template v-else>
      <BetRecordQueryMobileSummaryCard
        v-if="hasRows"
        :rows="mobileSummaryRows"
        :expanded="mobileSummaryExpanded"
        @toggle="mobileSummaryExpanded = !mobileSummaryExpanded"
      />

      <BetRecordQueryMobileList
        :rows="normalizedRows"
        :expanded-row-key="expandedRowKey"
        :is-loading="isFetching"
        :opening-wager-code="openingWagerCode"
        @toggle-row="onToggleRow"
        @open-detail="handleOpenDetail"
      />

      <div v-if="hasRows" class="flex justify-end pt-2">
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
