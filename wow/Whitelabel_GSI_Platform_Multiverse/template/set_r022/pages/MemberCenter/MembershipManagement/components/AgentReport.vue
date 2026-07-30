<template>
  <div class="agent-report-brand agent-report">
    <div v-if="report.isAgentReportSubordinateView" class="agent-report-back-bar">
      <q-btn flat dense no-caps icon="chevron_left" class="agent-report-back-bar__button" @click="handleBackAction" />
      <div class="agent-report-back-bar__text">
        <span>{{ $t("member.membershipManagement.superiorAgent") }}</span>
        <strong>{{ report.agentReportParentMemberAccount || EMPTY_VALUE }}</strong>
      </div>
    </div>

    <q-form v-else @submit.prevent="handleSearchAction" class="search-form">
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

        <div class="search-item agent-report-date-search-item">
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
              <q-icon name="calendar_month" class="cursor-pointer" />
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

        <!-- R022 current version does not need quick date presets; set_r017/shared flow kept this behavior. -->
        <!-- <div class="search-item agent-report-search-row__quick-range">
          <div class="agent-report__date-toggle">
            <q-btn
              v-for="option in report.dayTypeTabs"
              :key="option.value"
              unelevated
              no-caps
              :class="report.dateType === option.value ? 'bg-primary' : ''"
              @click="report.dateType = option.value"
            >
              {{ option.label }}
            </q-btn>
          </div>
        </div> -->

        <div class="agent-center-search-actions">
          <!-- R022 Figma does not show reset button on agent report. -->
          <!-- <q-btn
            :label="$t('common.btn.reset')"
            type="button"
            unelevated
            no-caps
            class="agent-center-reset-btn"
            @click="handleResetAction"
          /> -->
          <SearchButton :loading="report.isSearching" :action="handleSearchAction" />
        </div>
      </div>
    </q-form>

    <div class="agent-report-content relative">
      <q-inner-loading :showing="isAgentReportSearching" color="primary" />

      <div v-if="hasAgentReportData" class="agent-report-section">
        <div class="agent-report-section__title">{{ $t("member.membershipManagement.selfData") }}</div>

        <div v-if="!isCompactView" class="agent-report-table-shell">
          <table class="agent-report-custom-table agent-report-custom-table--personal">
            <thead>
              <tr>
                <th v-for="header in personalHeaders" :key="header">{{ header }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="(cell, index) in personalSummaryCells" :key="index">{{ cell }}</td>
              </tr>
              <tr class="agent-report-summary-label-row">
                <td v-for="(cell, index) in teamSummaryLabelCells" :key="index">{{ cell }}</td>
              </tr>
              <tr>
                <td v-for="(cell, index) in teamSummaryCells" :key="index">{{ cell }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="agent-report-mobile-matrix">
          <div v-if="personalMobileWalletHeaders.length" class="agent-report-mobile-matrix__row header">
            <div />
            <div />
            <div v-for="header in personalMobileWalletHeaders" :key="header">{{ header }}</div>
          </div>
          <div v-for="(row, index) in personalMobileRows" :key="index" class="agent-report-mobile-matrix__row">
            <div>{{ row.label }}</div>
            <div>{{ row.basic }}</div>
            <div v-for="(_, walletIndex) in personalMobileWalletHeaders" :key="walletIndex">
              {{ row.wallets ? row.wallets[walletIndex] ?? EMPTY_VALUE : EMPTY_VALUE }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="hasAgentReportData" class="agent-report-team-section">
        <div class="agent-report-section__title">{{ $t("shareholder_platform.teamData") }}</div>

        <div v-if="!isCompactView" class="agent-report-table-shell relative">
          <q-inner-loading :showing="isAgentReportPageLoading" color="primary" />

          <table v-if="agentReportRows.length" class="agent-report-custom-table agent-report-custom-table--team">
            <thead>
              <tr>
                <th v-for="column in teamColumns" :key="column.name">{{ column.label }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="row in agentReportRows" :key="row.member_id">
                <tr>
                  <td v-for="column in teamColumns" :key="column.name">
                    <div v-if="column.name === 'member_account'" class="agent-report-account-cell">
                      <button
                        type="button"
                        class="agent-report-account-toggle"
                        @click="report.toggleAgentReportTeamRowDetail(row.member_id)"
                      >
                        <q-icon
                          class="agent-report-account-toggle__icon"
                          :name="
                            report.isAgentReportTeamRowDetailExpanded(row.member_id) ? 'arrow_drop_down' : 'arrow_right'
                          "
                        />
                        <span class="agent-report-account-text">{{ row.member_account || EMPTY_VALUE }}</span>
                      </button>
                    </div>
                    <span v-else>{{ report.formatAgentReportTeamRowCell(row, column.name) }}</span>
                  </td>
                </tr>
                <tr
                  v-for="detail in getTeamDetailRows(row.member_id)"
                  v-show="report.isAgentReportTeamRowDetailExpanded(row.member_id)"
                  :key="`${row.member_id}-${detail.walletLabel}`"
                  class="agent-report-detail-row"
                >
                  <td :colspan="report.agentReportTeamRowDetailColspans.leadingColspan">{{ detail.walletLabel }}</td>
                  <td v-for="(value, index) in detail.metricValues" :key="index">{{ value }}</td>
                  <td v-for="index in detail.trailingEmptyCount" :key="`empty-${index}`">{{ EMPTY_VALUE }}</td>
                </tr>
              </template>
            </tbody>
          </table>

          <div v-else class="agent-center-empty">
            <img :src="orderImg('no-data.svg')" alt="no-data" class="agent-center-empty-img" />
            <span>{{ $t("tableHeader.noData") }}</span>
          </div>
        </div>

        <div v-else class="agent-report-mobile-matrix-list relative">
          <q-inner-loading :showing="isAgentReportPageLoading" color="primary" />

          <div v-if="agentReportRows.length" class="agent-report-mobile-team-matrices">
            <div v-for="row in agentReportRows" :key="row.member_id" class="agent-report-mobile-matrix">
              <div class="agent-report-mobile-matrix__row header">
                <div />
                <div />
                <div
                  v-for="header in report.getAgentReportTeamListMobileMatrixWalletHeaders(row.member_id)"
                  :key="header"
                >
                  {{ report.isAgentReportTeamRowDetailExpanded(row.member_id) ? header : "" }}
                </div>
              </div>
              <div
                v-for="(matrixRow, index) in report.getAgentReportTeamListMobileMatrixRows(row)"
                :key="index"
                class="agent-report-mobile-matrix__row"
              >
                <div>{{ matrixRow.label }}</div>
                <div>
                  <button
                    v-if="index === 0"
                    type="button"
                    class="agent-report-account-toggle agent-report-account-toggle--mobile"
                    @click="report.toggleAgentReportTeamRowDetail(row.member_id)"
                  >
                    <q-icon
                      class="agent-report-account-toggle__icon"
                      :name="
                        report.isAgentReportTeamRowDetailExpanded(row.member_id) ? 'arrow_drop_down' : 'arrow_right'
                      "
                    />
                    <span>{{ matrixRow.basic }}</span>
                  </button>
                  <template v-else>{{ matrixRow.basic }}</template>
                </div>
                <div
                  v-for="(_, walletIndex) in report.getAgentReportTeamListMobileMatrixWalletHeaders(row.member_id)"
                  :key="walletIndex"
                >
                  {{ matrixRow.wallets ? matrixRow.wallets[walletIndex] ?? EMPTY_VALUE : EMPTY_VALUE }}
                </div>
              </div>
            </div>
          </div>

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
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import type * as Response from "src/api/response.type"
import { AGENT_REPORT_EMPTY_VALUE as EMPTY_VALUE } from "src/common/components/AgentReport/utils/formatters"
import { useAgentReport } from "src/common/composables/useAgentReport"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { computed, onBeforeUnmount, ref, watch } from "vue"

import SearchButton from "./SearchButton.vue"

type DetailRow = {
  walletLabel: string
  metricValues: string[]
  trailingEmptyCount: number
}

const props = withDefaults(
  defineProps<{
    active?: boolean
  }>(),
  {
    active: true,
  }
)

const { isMobile } = useMediaQuery()
const { orderImg } = useSiteImg()
const report = useAgentReport()

const isCompactView = computed(() => isMobile.value)
const isAgentReportSearching = computed(() => report.isSearching || report.agentReportOwnDetailLoading)
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

const teamColumns = computed(() => report.agentReportColumns)
const personalHeaders = computed(() => report.agentReportPersonalTableHeaders)
const personalExtendedData = computed(() => agentReportOwnData.value?.personal)
const teamSummaryData = computed(() => agentReportOwnData.value?.team)
const personalSummaryCells = computed(() => [
  report.agentReportPersonalSummaryAccount,
  report.agentReportPersonalSummaryCurrency,
  ...report.formatMetricCells(personalExtendedData.value),
  formatCountValue(personalExtendedData.value?.referral_click_count),
])
const teamSummaryLabelCells = computed(() => report.agentReportTeamTableHeaders)
const teamSummaryCells = computed(() => [
  formatCountValue(teamSummaryData.value?.member_count),
  ...report.formatMetricCells(teamSummaryData.value),
  formatCountValue(teamSummaryData.value?.referral_click_count),
  formatCountValue(teamSummaryData.value?.register_count),
  formatCountValue(teamSummaryData.value?.first_time_deposit_count),
])
const personalMobileRows = computed(() => report.agentReportPersonalMobileMatrixRows)
const personalMobileWalletHeaders = computed(() => report.agentReportPersonalMobileMatrixWalletHeaders)

const getTeamDetailRows = (memberId: number): DetailRow[] =>
  report.getAgentReportTeamRowDetailList(memberId).map((detail) => ({
    walletLabel: report.formatWalletTypeLabel(detail.wallet_type),
    metricValues: report.formatMetricCells(detail),
    trailingEmptyCount: report.agentReportTeamRowDetailColspans.trailingColspan,
  }))

const ensureOwnDetailExpanded = async () => {
  if (!agentReportOwnData.value || report.agentReportOwnDetailExpanded) return

  await report.toggleAgentReportOwnDetail()
}

const ensureVisibleTeamDetailsExpanded = async () => {
  if (!isCompactView.value) return

  await Promise.all(
    agentReportRows.value.map(async (row) => {
      if (!report.isAgentReportTeamRowDetailExpanded(row.member_id)) {
        await report.toggleAgentReportTeamRowDetail(row.member_id)
      }
    })
  )
}

const expandVisibleDetails = async () => {
  await ensureOwnDetailExpanded()
  await ensureVisibleTeamDetailsExpanded()
}

const formatCountValue = (value?: string | number | null) =>
  value === undefined || value === null || value === "" ? EMPTY_VALUE : String(value)

const handleSearchAction = async () => {
  const success = await report.handlerSearchAgentReport()
  if (success) {
    await expandVisibleDetails()
  }
}

const handleAgentReportPageChange = async (value: number) => {
  await report.handleChangePage(value)
  await ensureVisibleTeamDetailsExpanded()
}

const handleBackAction = async () => {
  await report.handlerBackAgentReportMember()
  await expandVisibleDetails()
}

const hideMenu = () => {
  menuRef.value?.hide()
}

watch(
  () => props.active,
  async (active) => {
    if (active) {
      await report.activateTab()
      await expandVisibleDetails()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  report.reset()
})
</script>

<style lang="scss" scoped>
@import "app/template/set_r022/assets/css/membershipManagement.scss";
</style>
