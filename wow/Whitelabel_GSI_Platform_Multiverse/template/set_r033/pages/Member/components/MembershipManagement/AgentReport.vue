<template>
  <div class="agent-report-brand agent-report">
    <div v-if="report.isAgentReportSubordinateView" class="agent-report-back-bar">
      <q-btn
        flat
        dense
        no-caps
        icon="chevron_left"
        class="agent-report-back-bar__button"
        @click="report.handlerBackAgentReportMember"
      />
      <div class="agent-report-back-bar__text">
        <span>{{ $t("member.membershipManagement.superiorAgent") }}</span>
        <strong>{{ report.agentReportParentMemberAccount || EMPTY_VALUE }}</strong>
      </div>
    </div>

    <q-form v-else @submit.prevent="report.handlerSearchAgentReport" class="search-form">
      <div class="search-form-row agent-report-search-row">
        <div class="search-item agent-report-currency-search-item">
          <div class="search-item-label">{{ $t("common.btn.currency") }}</div>
          <q-select
            v-model="report.agentReportCurrencyId"
            :options="report.agentReportCurrencyList"
            emit-value
            map-options
            dense
            standout
            outlined
            borderless
            no-error-icon
            hide-bottom-space
            color="select"
            behavior="menu"
            options-dense
            class="agent-report-profile-select agent-report__currency-select"
            popup-content-class="agent-center-select-menu"
          />
        </div>

        <div class="search-item">
          <div class="search-item-label">{{ $t("member.summary.query_time") }}</div>
          <q-input
            v-model="report.formattedDateRange"
            :placeholder="$t('placeholder.pleaseSelectDate')"
            readonly
            dense
            standout="bg-grey-10 text-white"
            class="search-item-input date agent-report__date-input"
          >
            <template #append>
              <q-icon :name="datePickerShow ? 'arrow_drop_up' : 'arrow_drop_down'" class="cursor-pointer" />
            </template>

            <q-menu ref="menuRef" @show="datePickerShow = true" @hide="datePickerShow = false">
              <q-date
                v-model="report.dateRange"
                mask="YYYY-MM-DD"
                range
                color="primary"
                minimal
                class="agent-report-calendar agent-center-date-picker"
                @range-end="hideMenu"
              />
            </q-menu>
          </q-input>
        </div>

        <div class="search-item agent-report-search-row__quick-range">
          <div class="agent-report__date-toggle">
            <q-btn
              v-for="option in quickRangeOptions"
              :key="option.value"
              unelevated
              no-caps
              :class="selectedQuickRange === option.value ? 'bg-primary' : ''"
              @click="handleQuickRange(option.value)"
            >
              {{ option.label }}
            </q-btn>
          </div>
        </div>

        <SearchButton :loading="report.isSearching" :action="handleSearchAction" />
      </div>
    </q-form>

    <div class="agent-report-content relative">
      <q-inner-loading :showing="isAgentReportSearching" color="primary" />

      <div v-if="hasAgentReportData" class="agent-report-summary-card">
        <div class="agent-report-summary-meta">
          <span
            >{{ $t("member.membershipManagement.memberAccount") }}：<strong>{{ summaryAccount }}</strong></span
          >
          <span
            >{{ $t("member.membershipManagement.teamMember") }}：<strong>{{ summaryTeamCount }}</strong></span
          >
          <span
            >{{ $t("common.btn.currency") }}：<strong>{{ summaryCurrency }}</strong></span
          >
        </div>

        <div v-if="!isCompactView" class="agent-report-table-shell">
          <table class="agent-report-custom-table agent-report-custom-table--summary">
            <thead>
              <tr>
                <th>{{ $t("tableHeader.type2") }}</th>
                <th v-for="column in summaryMetricColumns" :key="column.key">{{ column.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in summaryRows" :key="row.label">
                <td class="agent-report-custom-table__row-label">{{ row.label }}</td>
                <td v-for="column in summaryMetricColumns" :key="column.key">
                  {{ formatMetricValue(row.data, column.key) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="agent-report-mobile-summary">
          <div class="agent-report-mobile-summary-strip">
            <button
              type="button"
              class="agent-report-mobile-summary-strip__header"
              @click="toggleMobileSummaryExpanded"
            >
              <span class="agent-report-mobile-summary-strip__toggle">
                <q-icon :name="isMobileSummaryExpanded ? 'expand_more' : 'expand_less'" />
              </span>
              <span>{{
                isMobileSummaryExpanded ? $t("member.membershipManagement.selfData") : $t("menu.pageTotal")
              }}</span>
              <span>{{
                isMobileSummaryExpanded ? $t("member.membershipManagement.team") : $t("menu.searchTotal")
              }}</span>
            </button>
            <div class="agent-report-mobile-summary-strip__body">
              <div v-for="row in mobileSummaryRows" :key="row.key" class="agent-report-mobile-summary-strip__row">
                <span>{{ row.label }}</span>
                <span>{{ row.own }}</span>
                <span>{{ row.team }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="hasAgentReportData" class="agent-report-team-section">
        <div class="agent-report-team-section__header">
          <div class="agent-report-team-section__title">{{ $t("shareholder_platform.teamData") }}</div>
          <div class="agent-report-team-section__meta">
            {{ $t("common.select_ai_type") }}：<strong>{{ summaryCurrency }}</strong>
          </div>
        </div>

        <div v-if="!isCompactView" class="agent-report-table-shell relative">
          <q-inner-loading :showing="isAgentReportPageLoading" color="primary" />

          <table v-if="agentReportRows.length" class="agent-report-custom-table agent-report-custom-table--team">
            <thead>
              <tr>
                <th v-for="column in teamColumns" :key="column.key">{{ column.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in agentReportRows" :key="row.member_id">
                <td>
                  <button
                    v-if="report.isAgentReportDownlineExplorationEnabled"
                    type="button"
                    class="agent-report-account-button"
                    @click="report.searchSubordinateAgentReport(row.member_id)"
                  >
                    {{ row.member_account || EMPTY_VALUE }}
                  </button>
                  <span v-else>{{ row.member_account || EMPTY_VALUE }}</span>
                </td>
                <td>{{ formatCountValue(row.member_count) }}</td>
                <td v-for="column in summaryMetricColumns" :key="column.key">
                  {{ formatMetricValue(row, column.key) }}
                </td>
              </tr>
            </tbody>
          </table>

          <div v-else class="agent-center-empty">
            <img :src="orderImg('no-data.svg')" alt="no-data" class="agent-center-empty-img" />
            <span>{{ $t("tableHeader.noData") }}</span>
          </div>
        </div>

        <div v-else class="agent-report-mobile-team-list relative">
          <q-inner-loading :showing="isAgentReportPageLoading" color="primary" />

          <q-list v-if="agentReportRows.length">
            <q-expansion-item
              v-for="row in agentReportRows"
              :key="row.member_id"
              :model-value="expandedAgentReportKeys.includes(getAgentReportRowKey(row))"
              dense
              dense-toggle
              expand-separator
              expand-icon="keyboard_arrow_down"
              hide-expand-icon
              class="expansion-item"
              @update:model-value="(expanded) => updateExpandedAgentReportKey(expanded, getAgentReportRowKey(row))"
            >
              <template #header="{ expanded, toggle }">
                <q-item-section class="expansion-header">
                  <div class="agent-report-mobile-card-header">
                    <div class="agent-report-mobile-card-item">
                      <button
                        v-if="report.isAgentReportDownlineExplorationEnabled"
                        type="button"
                        class="agent-report-mobile-account-trigger agent-report-mobile-card-value"
                        @click.stop="report.searchSubordinateAgentReport(row.member_id)"
                      >
                        {{ row.member_account || EMPTY_VALUE }}
                      </button>
                      <div v-else class="agent-report-mobile-card-value">{{ row.member_account || EMPTY_VALUE }}</div>
                      <div class="agent-report-mobile-card-label">{{ $t("menu.account") }}</div>
                    </div>
                    <div class="agent-report-mobile-card-item text-right">
                      <div class="agent-report-mobile-card-value-row">
                        <div class="agent-report-mobile-card-value-group">
                          <div class="agent-report-mobile-card-value">{{ formatCountValue(row.member_count) }}</div>
                          <div class="agent-report-mobile-card-label">
                            {{ $t("member.membershipManagement.teamMember") }}
                          </div>
                        </div>
                        <button type="button" class="agent-report-mobile-toggle-btn" @click.stop="toggle">
                          <q-icon :name="expanded ? 'expand_less' : 'expand_more'" />
                        </button>
                      </div>
                    </div>
                  </div>
                </q-item-section>
              </template>

              <q-card>
                <q-card-section>
                  <div class="expansion-detail">
                    <div v-for="column in mobileMetricColumns" :key="column.key" class="expansion-detail-item">
                      <div>{{ column.label }}</div>
                      <div class="text-right">{{ formatMetricValue(row, column.key) }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>

          <div v-else class="agent-center-empty">
            <img :src="orderImg('no-data.svg')" alt="no-data" class="agent-center-empty-img" />
            <span>{{ $t("tableHeader.noData") }}</span>
          </div>
        </div>
      </div>

      <div v-else-if="!isAgentReportSearching && !isAgentReportPageLoading" class="agent-center-empty">
        <img :src="orderImg('no-data.svg')" alt="no-data" class="agent-center-empty-img" />
        <span>{{ $t("tableHeader.noData") }}</span>
      </div>
    </div>

    <div v-if="agentReportTotalPage" class="pagination">
      <q-pagination
        v-model="agentReportPage"
        :max="agentReportTotalPage"
        @update:model-value="handleAgentReportPageChange"
        direction-links
        flat
        active-design="flat"
        color="deep-grey"
        active-color="blue-8"
        icon-prev="chevron_left"
        icon-next="chevron_right"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type * as Response from "src/api/response.type"
import { computed, onBeforeUnmount, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { getLastOrOverDay, getToday } from "src/common/utils/dayjsUtils"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useSiteImg } from "src/common/hooks/useSiteImg"
import { useAgentReport } from "src/common/composables/useAgentReport"
import { AGENT_REPORT_EMPTY_VALUE as EMPTY_VALUE } from "src/common/components/AgentReport/utils/formatters"
import SearchButton from "./SearchButton.vue"

type QuickRange = "today" | "threeDays" | "sevenDays" | "custom"
type MetricKey =
  | "bet_count"
  | "deposit"
  | "withdraw"
  | "bet_amount"
  | "valid_bet"
  | "prize"
  | "profit"
  | "rate"
  | "bonus"
type MetricSource =
  | Response.GetMemberAgentReport["personal"]
  | Response.GetMemberAgentReport["team"]
  | Response.GetMemberTeamAgentReportList
  | undefined

const props = withDefaults(
  defineProps<{
    active?: boolean
  }>(),
  {
    active: true,
  }
)

const { t } = useI18n()
const { isMobile } = useMediaQuery()
const { moneyFormat } = useCommon()
const { orderImg } = useSiteImg()
const report = useAgentReport()

const isCompactView = computed(() => isMobile.value)
const isAgentReportSearching = computed(() => report.isSearching)
const isAgentReportPageLoading = computed(() => report.isPageLoading)
const agentReportRows = computed(() => report.agentReportRows)
const agentReportOwnData = computed<Response.GetMemberAgentReport | undefined>(() => report.agentReportOwnData)
const agentReportTotalPage = computed(() => report.totalPage)
const agentReportPage = computed({
  get: () => report.page,
  set: (value: number) => {
    report.page = value
  },
})
const hasAgentReportData = computed(() => Boolean(agentReportOwnData.value) || agentReportRows.value.length > 0)

const menuRef = ref<InstanceType<typeof import("quasar")["QMenu"]> | null>(null)
const datePickerShow = ref(false)
const selectedQuickRange = ref<QuickRange>("sevenDays")
const isMobileSummaryExpanded = ref(false)
const expandedAgentReportKeys = ref<string[]>([])

const quickRangeOptions: Array<{ label: string; value: Exclude<QuickRange, "custom"> }> = [
  { label: t("common.btn.today2"), value: "today" },
  { label: t("common.btn.withinThreeDays"), value: "threeDays" },
  { label: t("common.btn.withinSevenDays"), value: "sevenDays" },
]

const summaryMetricColumns = computed<Array<{ key: MetricKey; label: string }>>(() => [
  { key: "bet_count", label: t("member.membershipManagement.orderQuantity") },
  { key: "deposit", label: t("menu.deposit") },
  { key: "withdraw", label: t("menu.withdrawal") },
  { key: "bet_amount", label: t("tableHeader.bettingAmount") },
  { key: "valid_bet", label: t("tableHeader.validBetAmount") },
  { key: "prize", label: t("common.payout") },
  { key: "profit", label: t("member.referralRebate.profit") },
  { key: "rate", label: t("tableHeader.profitRatio") },
  { key: "bonus", label: t("tableHeader.activityBonus") },
])

const teamColumns = computed(() => [
  { key: "member_account", label: t("menu.userAccount") },
  { key: "member_count", label: t("member.membershipManagement.teamMember") },
  ...summaryMetricColumns.value,
])

const mobileMetricColumns = computed<Array<{ key: MetricKey; label: string }>>(() => [
  { key: "bet_count", label: t("member.membershipManagement.orderQuantity") },
  { key: "deposit", label: t("member.withdrawal.deposit") },
  { key: "withdraw", label: t("menu.withdrawal") },
  { key: "bet_amount", label: t("vip.bet") },
  { key: "valid_bet", label: t("member.referralRebate.validBetAmount") },
  { key: "prize", label: t("common.payout") },
  { key: "profit", label: t("shareholder_platform.profit") },
  { key: "rate", label: t("tableHeader.profitRatio") },
  { key: "bonus", label: t("tableHeader.activityBonus") },
])

const summaryRows = computed(() => [
  { label: t("member.membershipManagement.selfData"), data: agentReportOwnData.value?.personal },
  { label: t("member.membershipManagement.team"), data: agentReportOwnData.value?.team },
])

const summaryAccount = computed(() => agentReportOwnData.value?.team?.member_account || EMPTY_VALUE)
const summaryTeamCount = computed(() => formatCountValue(agentReportOwnData.value?.team?.member_count))
const summaryCurrency = computed(() => {
  const currencyId = agentReportOwnData.value?.team?.currency_id ?? report.agentReportCurrencyId
  return report.currencyName(currencyId) || EMPTY_VALUE
})

const mobileSummaryRows = computed(() => {
  const rows = mobileMetricColumns.value.map((column) => ({
    key: column.key,
    label: column.label,
    own: formatMetricValue(agentReportOwnData.value?.personal, column.key),
    team: formatMetricValue(agentReportOwnData.value?.team, column.key),
  }))

  if (isMobileSummaryExpanded.value) {
    return rows
  }

  return rows.filter((row) => row.key === "profit")
})

const formatCountValue = (value?: string | number | null) => moneyFormat(value ?? undefined) ?? EMPTY_VALUE

const formatMetricValue = (row: MetricSource, key: MetricKey) => {
  if (key === "rate") {
    return row?.rate ? `${row.rate}%` : EMPTY_VALUE
  }

  return moneyFormat(row?.[key] ?? undefined) ?? EMPTY_VALUE
}

const resolveQuickRange = (): QuickRange => {
  const today = String(getToday())
  const currentFrom = report.dateRange.from
  const currentTo = report.dateRange.to

  if (currentFrom === today && currentTo === today) {
    return "today"
  }

  if (currentFrom === getLastOrOverDay(-2) && currentTo === today) {
    return "threeDays"
  }

  if (currentFrom === getLastOrOverDay(-6) && currentTo === today) {
    return "sevenDays"
  }

  return "custom"
}

const handleQuickRange = (value: Exclude<QuickRange, "custom">) => {
  const today = String(getToday())

  selectedQuickRange.value = value

  if (value === "today") {
    report.updateDateRange({ from: today, to: today })
    return
  }

  if (value === "threeDays") {
    report.updateDateRange({ from: getLastOrOverDay(-2), to: today })
    return
  }

  report.updateDateRange({ from: getLastOrOverDay(-6), to: today })
}

const handleSearchAction = async () => {
  await report.handlerSearchAgentReport()
}

const handleAgentReportPageChange = async (value: number) => {
  await report.handleChangePage(value)
}

const toggleMobileSummaryExpanded = () => {
  isMobileSummaryExpanded.value = !isMobileSummaryExpanded.value
}

const getAgentReportRowKey = (row: Response.GetMemberTeamAgentReportList) => String(row.member_id)

const updateExpandedAgentReportKey = (expanded: boolean, key: string) => {
  if (expanded) {
    if (!expandedAgentReportKeys.value.includes(key)) {
      expandedAgentReportKeys.value = [...expandedAgentReportKeys.value, key]
    }
    return
  }

  expandedAgentReportKeys.value = expandedAgentReportKeys.value.filter((currentKey) => currentKey !== key)
}

const hideMenu = () => {
  menuRef.value?.hide()
}

watch(
  () => props.active,
  async (active) => {
    if (active) {
      await report.activateTab()
    }
  },
  { immediate: true }
)

watch(
  () => ({ ...report.dateRange }),
  () => {
    selectedQuickRange.value = resolveQuickRange()
  },
  { deep: true, immediate: true }
)

onBeforeUnmount(() => {
  report.reset()
})
</script>

<style lang="scss" scoped>
@import "app/template/set_r033/assets/css/agentCenter.scss";

.agent-report-brand {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
}

.agent-report-search-row {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.625rem;

  .search-item {
    flex: 1 1 9.375rem;
    min-width: 9.375rem;
    max-width: 12rem;
  }

  .search-item:nth-child(2) {
    flex-basis: 17rem;
    min-width: 17rem;
    max-width: 20rem;
  }

  .agent-report-search-row__quick-range {
    max-width: none;
  }

  .agent-report__date-toggle {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 0.625rem;

    :deep(.q-btn) {
      flex: 1 1 0;
      min-width: 98px;
      padding: 0.25rem;
      white-space: nowrap;
    }

    :deep(.q-btn__content) {
      white-space: nowrap;
    }
  }

  :deep(.agent-center-search-btn) {
    flex: 0 0 6.25rem;
    margin-left: auto;
  }
}

@container (max-width: 48rem) {
  .agent-report-search-row {
    display: flex !important;
    flex-direction: column !important;
    flex-wrap: nowrap !important;
    align-items: stretch !important;

    .search-item {
      flex: 1 0 auto !important;
      width: 100% !important;
      min-width: 0 !important;
      max-width: none !important;
    }

    .agent-report-search-row__quick-range {
      flex: 1 0 auto !important;
      width: 100% !important;
      min-width: 0 !important;
      max-width: none !important;
    }

    .agent-report__date-toggle {
      display: flex !important;
      width: 100% !important;

      :deep(.q-btn) {
        flex: 1 1 0 !important;
        min-width: 0 !important;
      }
    }

    :deep(.agent-center-search-btn) {
      flex: 1 0 auto !important;
      align-self: stretch !important;
      width: 100% !important;
      min-width: 0 !important;
      margin-left: 0 !important;
    }
  }
}

@media (max-width: 768px) {
  .agent-report-search-row {
    display: flex !important;
    flex-direction: column !important;
    flex-wrap: nowrap !important;
    align-items: stretch !important;

    .search-item {
      flex: 1 0 auto !important;
      width: 100% !important;
      min-width: 0 !important;
      max-width: none !important;
    }

    .agent-report-search-row__quick-range {
      flex: 1 0 auto !important;
      width: 100% !important;
      min-width: 0 !important;
      max-width: none !important;
    }

    .agent-report__date-toggle {
      display: flex !important;
      width: 100% !important;

      :deep(.q-btn) {
        flex: 1 1 0 !important;
        min-width: 0 !important;
      }
    }

    :deep(.agent-center-search-btn) {
      flex: 1 0 auto !important;
      align-self: stretch !important;
      width: 100% !important;
      min-width: 0 !important;
      margin-left: 0 !important;
    }
  }

  .agent-report-mobile-summary-strip {
    border-radius: 0.25rem;
    overflow: hidden;
  }

  .agent-report-mobile-summary-strip__header,
  .agent-report-mobile-summary-strip__row {
    display: grid;
    grid-template-columns: 2rem 1fr 1fr;
    align-items: center;
    text-align: center;
  }

  .agent-report-mobile-summary-strip__header {
    height: 1.75rem;
    background: var(--bg-13);
    color: var(--text-01);
    font-size: 0.625rem;
    font-weight: 700;
  }

  .agent-report-mobile-summary-strip__row {
    height: 1.75rem;
    background: var(--bg-11);
    color: var(--text-02);
    font-size: 0.625rem;
    font-weight: 700;
  }

  .agent-report-mobile-summary-strip__chevron {
    font-size: 0.75rem;
    color: var(--text-01);
  }

  .agent-report-mobile-team-list {
    .expansion-item {
      margin-bottom: 0.5rem;

      :deep(.q-item) {
        padding: 0.625rem 0.75rem;
      }
    }
  }
}

.agent-report-profile-select {
  width: 100%;

  :deep(.q-field__control) {
    min-height: 2.5rem;
    height: 2.5rem;
    padding: 0 1rem;
    border: 2px solid var(--input-dropdown-text-03);
    border-radius: 0.5rem;
    background: var(--input-dropdown-bg-01) !important;
    box-shadow: 0 2px 4px 0 #00000080;

    &::before,
    &::after {
      border: 0 !important;
    }
  }

  :deep(.q-field__control-container) {
    padding-top: 0;
  }

  :deep(.q-field__native),
  :deep(.q-field__input) {
    padding: 0;
    color: var(--input-dropdown-text-01) !important;
    font-family: "Noto Sans TC", sans-serif;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.1875rem;
  }

  :deep(.q-field__append),
  :deep(.q-select__dropdown-icon) {
    color: var(--input-dropdown-text-01) !important;
  }
}

.agent-report-content {
  min-height: 18rem;
}

.agent-report-back-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0 0.625rem;
  margin-bottom: 0.625rem;
  border-bottom: 1px solid var(--input-dropdown-text-03);
  color: var(--text-02);
}

.agent-report-back-bar__button {
  min-width: 2rem;
  min-height: 2rem;
  border-radius: 50%;
  color: var(--text-02);
  background: var(--bg-13);
}

.agent-report-back-bar__text {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;

  strong {
    color: var(--primany-01);
    font-weight: 700;
  }
}

.agent-report-summary-card,
.agent-report-team-section {
  border-radius: 0.5rem;
  background: transparent;
}

.agent-report-summary-meta,
.agent-report-team-section__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  color: var(--text-01);
  font-size: 0.875rem;
  font-weight: 400;
}

.agent-report-summary-meta {
  margin: 0.5rem 0;
}

.agent-report-summary-meta strong,
.agent-report-team-section__meta strong {
  color: var(--primany-01);
}

.agent-report-team-section {
  margin-top: 0.5rem;
}

.agent-report-team-section__header {
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.agent-report-team-section__title {
  color: var(--text-01);
  font-size: 1rem;
}

.agent-report-table-shell {
  overflow-x: auto;
  border-radius: 0.25rem;
}

.agent-report-custom-table {
  width: 100%;
  min-width: 50rem;
  border-collapse: separate;
  border-spacing: 0;
  color: var(--text-02);
  font-size: 0.875rem;
  text-align: center;

  th,
  td {
    padding: 0.625rem 0.5rem;
  }

  th {
    background: var(--bg-13);
    color: var(--text-02);
    font-size: 0.875rem;
    white-space: nowrap;
  }

  td {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-01);
  }

  tbody tr:nth-child(odd) {
    // background: var(--bg-14);
  }

  tbody tr:nth-child(even) {
    background: var(--bg-08);
  }
}

.agent-report-custom-table--summary {
  min-width: 44rem;
}

.agent-report-custom-table__row-label {
  background: var(--bg-12) !important;
  font-weight: 700;
  white-space: nowrap;
}

.agent-report-account-button {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text-02);
  font: inherit;
  cursor: pointer;

  &:hover {
    color: var(--btn-bg-01);
    text-decoration: underline;
  }
}

.agent-report-account-button--mobile {
  color: var(--btn-bg-01);
  font-weight: 700;
}

.agent-report-mobile-summary,
.agent-report-mobile-team-list {
  margin-top: 0.5rem;
}

.agent-report-mobile-summary__item {
  margin-bottom: 0.75rem;
}

:deep(.agent-report-calendar) {
  background: var(--bg-11);
  color: var(--text-02);
}

@media (max-width: 768px) {
  .agent-report-summary-meta,
  .agent-report-team-section__header {
    gap: 0.375rem;
  }

  .agent-report-team-section__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .agent-report-summary-meta,
  .agent-report-team-section__header,
  .agent-report-team-section__meta {
    display: none;
  }

  .agent-report-mobile-summary-strip {
    border-radius: 0.25rem;
    overflow: hidden;

    .agent-report-mobile-summary-strip__header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
      align-items: center;
      text-align: center;
    }

    .agent-report-mobile-summary-strip__header {
      width: 100%;
      height: auto;
      min-height: 0;
      padding: 0.75rem 0;
      border: 0;
      background: var(--bg-13);
      color: var(--text-01);
      font-size: 0.6875rem;
      font-weight: 700;
      line-height: 1;
      cursor: pointer;
    }

    .agent-report-mobile-summary-strip__row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
      align-items: center;
      text-align: center;
      height: auto;
      min-height: 0;
      padding: 0;
      background: transparent;
      color: var(--text-02);
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1;
      border-bottom: 1px solid var(--input-dropdown-text-03);
    }

    .agent-report-mobile-summary-strip__row:last-child {
      border-bottom: 0;
    }

    .agent-report-mobile-summary-strip__body {
      background: #000 !important;
      padding: 10px;
    }

    .agent-report-mobile-summary-strip__toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--text-01);

      :deep(.q-icon) {
        font-size: 1rem;
        line-height: 1;
      }
    }

    .agent-report-mobile-summary-strip__header > span {
      padding: 4px 8px;
      white-space: nowrap;
      font-size: 12px;
    }

    .agent-report-mobile-summary-strip__row > span {
      padding: 8px 0;
      white-space: nowrap;
      font-size: 12px;
    }

    .agent-report-mobile-summary-strip__header > span:nth-child(2) {
      border-left: 1px solid var(--input-dropdown-text-03);
      border-right: 1px solid var(--input-dropdown-text-03);
    }

    .agent-report-mobile-summary-strip__header > span:nth-child(3) {
      border-right: 1px solid var(--input-dropdown-text-03);
    }

    .agent-report-mobile-summary-strip__row > span:nth-child(2),
    .agent-report-mobile-summary-strip__row > span:nth-child(3) {
      font-weight: 700;
    }
  }

  .agent-report-mobile-team-list {
    .expansion-item {
      margin-bottom: 0.5rem;
      border-radius: 0.25rem;
      overflow: hidden;

      :deep(.q-item) {
        align-items: flex-start;
        min-height: 0 !important;
        padding: 0.75rem 0.875rem !important;
        background: var(--bg-08) !important;
      }

      :deep(.q-item__section--main) {
        min-width: 0;
        padding: 0 !important;
      }

      :deep(.q-item__section--side) {
        display: none !important;
      }

      :deep(.q-expansion-item__toggle-icon) {
        font-size: 1rem;
        color: var(--text-02) !important;
      }

      :deep(.q-card__section) {
        padding: 0.75rem 0.875rem 0.75rem !important;
      }
    }

    .agent-report-mobile-card-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, auto);
      column-gap: 0.75rem;
      width: 100%;
      min-width: 0;
      padding-bottom: 0;
    }

    .agent-report-mobile-card-item {
      min-width: 0;
      color: var(--text-01);
      font-size: 0.6875rem;
      line-height: 1rem;
    }

    .agent-report-mobile-card-value {
      color: var(--text-02);
      font-size: 0.875rem;
      font-weight: 700;
      line-height: 1rem;
      word-break: break-all;
    }

    .agent-report-mobile-account-trigger {
      border: 0;
      padding: 0;
      text-align: left;
      background: transparent;
      cursor: pointer;
    }

    .agent-report-mobile-card-label {
      margin-top: 0.25rem;
    }

    .agent-report-mobile-card-value-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.375rem;
    }

    .agent-report-mobile-card-value-group {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .agent-report-mobile-toggle-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      align-self: center;
      width: 20px;
      height: 20px;
      min-width: 20px;
      min-height: 20px;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--text-02);
      cursor: pointer;

      :deep(.q-icon) {
        font-size: 1.375rem;
        line-height: 1;
      }
    }

    .expansion-detail-item {
      padding: 0.625rem 0;
      border-bottom: 1px solid var(--input-dropdown-text-03);
      color: var(--text-01);
      font-size: 0.75rem;
      line-height: 1rem;

      .text-right {
        color: var(--text-02);
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1rem;
      }
    }
  }
}

// 幣別下拉 + 日期輸入框：對齊其它面板（BetReport 等）的 .search-item-input（set_r033 深色輸入樣式）
.agent-report-brand {
  .agent-report-profile-select,
  .agent-report__currency-select,
  .agent-report__date-input {
    :deep(.q-field__control) {
      min-height: 2.4375rem;
      height: 2.4375rem;
      padding: 0 0.875rem;
      border: 0 !important;
      border-radius: 0.625rem !important;
      background: var(--input-dropdown-bg-01) !important;
      box-shadow: none;

      &::before,
      &::after {
        border: 0 !important;
      }
    }

    :deep(.q-field__native),
    :deep(.q-field__input),
    :deep(.q-field__append),
    :deep(.q-select__dropdown-icon),
    :deep(.q-icon) {
      color: var(--input-dropdown-text-01) !important;
    }

    :deep(.q-field__native::placeholder),
    :deep(.q-field__input::placeholder) {
      color: var(--input-dropdown-text-01) !important;
    }
  }

  .agent-report__currency-select {
    border: 1px solid var(--input-dropdown-text-03) !important;
    border-radius: 0.625rem !important;
  }
}
</style>
