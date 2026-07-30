<template>
  <q-table
    v-if="!isMobile"
    :rows="betReportRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.betReportColumns"
    row-key="id"
    hide-pagination
    flat
    class="bet-report-table"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #body="props">
      <q-tr>
        <q-td key="member_account" :props="props" class="agent-center-account-cell">
          <span
            class="agent-center-link"
            @click="memberManagementStore.searchAccountBetReport(props.row.member_account)"
          >
            {{ props.row.member_account }}
          </span>
        </q-td>
        <q-td key="bet_count" :props="props">
          <span>{{ props.row.bet_count }}</span>
        </q-td>
        <q-td key="win_count" :props="props">
          <span>{{ props.row.win_count }}</span>
        </q-td>
        <q-td key="bet_amount" :props="props">
          <span>{{ moneyFormat(props.row.bet_amount) }}</span>
        </q-td>
        <q-td key="valid_bet_amount" :props="props">
          <span>{{ moneyFormat(props.row.valid_bet_amount) }}</span>
        </q-td>
        <q-td key="payout" :props="props">
          <span>{{ moneyFormat(props.row.payout) }}</span>
        </q-td>
        <q-td key="profit" :props="props">
          <span>{{ moneyFormat(props.row.profit) }}</span>
        </q-td>
        <q-td key="profit_rate" :props="props">
          <span>{{ `${props.row.profit_rate}%` }}</span>
        </q-td>
        <q-td key="bonus" :props="props">
          <span>{{ props.row.bonus }}</span>
        </q-td>
      </q-tr>
    </template>

    <template v-if="betReportRows.length" #bottom-row>
      <q-tr class="page-total">
        <q-td
          v-for="column in betReportTableColumns"
          :key="column.name"
          class="agent-center-summary-cell text-center"
          :class="{ 'agent-center-summary-cell--title': column.name === 'member_account' }"
        >
          {{ getBetReportSummaryValue("page", column.name) }}
        </q-td>
      </q-tr>
      <q-tr class="search-result-total">
        <q-td
          v-for="column in betReportTableColumns"
          :key="column.name"
          class="agent-center-summary-cell text-center"
          :class="{ 'agent-center-summary-cell--title': column.name === 'member_account' }"
        >
          {{ getBetReportSummaryValue("total", column.name) }}
        </q-td>
      </q-tr>
    </template>

    <template #no-data>
      <div class="agent-center-empty">
        <img :src="orderImg('no-data.svg')" alt="no-data" class="agent-center-empty-img" />
        <span>{{ $t("tableHeader.noData") }}</span>
      </div>
    </template>
  </q-table>

  <div v-else class="expansion-menu">
    <div v-if="betReportRows.length" class="bet-report-mobile-summary-strip">
      <button type="button" class="bet-report-mobile-summary-strip__header" @click="toggleMobileSummaryExpanded">
        <span class="bet-report-mobile-summary-strip__title">
          <span class="bet-report-mobile-summary-strip__title-icon">
            <q-icon name="bar_chart" />
          </span>
          <span>{{ $t("amount.total") }}</span>
        </span>
        <span class="bet-report-mobile-summary-strip__toggle">
          <q-icon :name="isMobileSummaryExpanded ? 'expand_less' : 'expand_more'" />
        </span>
      </button>
      <div class="bet-report-mobile-summary-strip__body">
        <div class="bet-report-mobile-summary-strip__row bet-report-mobile-summary-strip__row--head">
          <span>{{ $t("member.withdrawal.item") }}</span>
          <span>{{ $t("menu.pageTotal") }}</span>
          <span>{{ $t("menu.searchTotal") }}</span>
        </div>
        <div v-for="row in mobileSummaryRows" :key="row.key" class="bet-report-mobile-summary-strip__row">
          <span>{{ row.label }}</span>
          <span>{{ row.page }}</span>
          <span>{{ row.total }}</span>
        </div>
      </div>
    </div>

    <q-list v-if="betReportRows.length">
      <q-expansion-item
        v-for="data in betReportRows"
        :key="getBetReportRowKey(data)"
        :model-value="expandedBetReportKeys.includes(getBetReportRowKey(data))"
        dense
        dense-toggle
        expand-separator
        expand-icon="keyboard_arrow_down"
        hide-expand-icon
        class="expansion-item"
        @update:model-value="(expanded) => updateExpandedBetReportKey(expanded, getBetReportRowKey(data))"
      >
        <template #header="{ expanded, toggle }">
          <q-item-section class="expansion-header">
            <div class="bet-report-mobile-card-header">
              <div class="bet-report-mobile-card-item">
                <button
                  type="button"
                  class="bet-report-mobile-account-trigger bet-report-mobile-card-value"
                  @click.stop="memberManagementStore.searchAccountBetReport(data.member_account)"
                >
                  {{ data.member_account }}
                </button>
                <div class="bet-report-mobile-card-label">{{ $t("menu.userAccount") }}</div>
              </div>
              <div class="bet-report-mobile-card-item text-right">
                <div class="bet-report-mobile-card-value-row">
                  <div class="bet-report-mobile-card-value-group">
                    <div class="bet-report-mobile-card-value">{{ moneyFormat(data.profit) }}</div>
                    <div class="bet-report-mobile-card-label">{{ $t("member.referralRebate.profit") }}</div>
                  </div>
                  <button type="button" class="bet-report-mobile-toggle-btn" @click.stop="toggle">
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
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.orderQuantity") }}</div>
                <div class="text-right">{{ data.bet_count }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.winningNumber") }}</div>
                <div class="text-right">{{ data.win_count }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.bettingAmount") }}</div>
                <div class="text-right">{{ moneyFormat(data.bet_amount) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.validBetAmount") }}</div>
                <div class="text-right">{{ moneyFormat(data.valid_bet_amount) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("common.payout") }}</div>
                <div class="text-right">{{ moneyFormat(data.payout) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.profitRatio") }}</div>
                <div class="text-right">{{ `${data.profit_rate}%` }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.activityBonus") }}</div>
                <div class="text-right">{{ data.bonus }}</div>
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

  <div v-if="betReportTotalPage" class="pagination">
    <q-pagination
      v-model="memberManagementStore.page"
      :max="betReportTotalPage"
      @update:model-value="handleBetReportPageChange"
      direction-links
      flat
      active-design="flat"
      color="deep-grey"
      active-color="blue-8"
      icon-prev="chevron_left"
      icon-next="chevron_right"
    />
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"

type BetReportSummaryKey =
  | "bet_count"
  | "win_count"
  | "bet_amount"
  | "valid_bet_amount"
  | "payout"
  | "profit"
  | "profit_rate"
  | "bonus"

const { t } = useI18n()
const { isMobile } = useMediaQuery()
const { moneyFormat } = useCommon()
const { orderImg } = useSiteImg()
const memberManagementStore = useMemberManagement()

const isMobileSummaryExpanded = ref(false)
const expandedBetReportKeys = ref<string[]>([])

const betReportRows = computed(() => memberManagementStore.betReportRows)
const betReportTotalPage = computed(() => memberManagementStore.totalPage)
const betReportTableColumns = computed(() => memberManagementStore.betReportColumns)

const getBetReportRowKey = (row: { member_id?: number; member_account?: string }) =>
  String(row.member_id ?? row.member_account ?? "")

const updateExpandedBetReportKey = (expanded: boolean, key: string) => {
  if (expanded) {
    if (!expandedBetReportKeys.value.includes(key)) {
      expandedBetReportKeys.value = [...expandedBetReportKeys.value, key]
    }
    return
  }

  expandedBetReportKeys.value = expandedBetReportKeys.value.filter((currentKey) => currentKey !== key)
}

const betReportSummaryColumns = computed<Array<{ key: BetReportSummaryKey; label: string }>>(() => [
  { key: "bet_count", label: t("tableHeader.orderQuantity") },
  { key: "win_count", label: t("tableHeader.winningNumber") },
  { key: "bet_amount", label: t("tableHeader.bettingAmount") },
  { key: "valid_bet_amount", label: t("tableHeader.validBetAmount") },
  { key: "payout", label: t("common.payout") },
  { key: "profit", label: t("member.referralRebate.profit") },
  { key: "profit_rate", label: t("tableHeader.profitRatio") },
  { key: "bonus", label: t("tableHeader.activityBonus") },
])

const betReportSummaryList = computed(() => memberManagementStore.betReportSummaryList)
const betReportSummaryTotalList = computed(() => memberManagementStore.betReportSummaryTotalList)

const getBetReportSummaryValue = (type: "page" | "total", columnName: string) => {
  if (columnName === "member_account") {
    return type === "page" ? t("menu.pageTotal") : t("menu.searchTotal")
  }

  const summaryIndex = betReportSummaryColumns.value.findIndex((column) => column.key === columnName)
  if (summaryIndex === -1) return "-"

  return type === "page"
    ? betReportSummaryList.value[summaryIndex] ?? "-"
    : betReportSummaryTotalList.value[summaryIndex] ?? "-"
}

const handleBetReportPageChange = (page: number) => {
  memberManagementStore.handleChangePage(page)
}

const mobileSummaryRows = computed(() => {
  const rows = betReportSummaryColumns.value.map((column, index) => ({
    key: column.key,
    label: column.label,
    page: betReportSummaryList.value[index],
    total: betReportSummaryTotalList.value[index],
  }))

  if (isMobileSummaryExpanded.value) {
    return rows
  }

  return rows.filter((row) => row.key === "profit")
})

const toggleMobileSummaryExpanded = () => {
  isMobileSummaryExpanded.value = !isMobileSummaryExpanded.value
}
</script>

<style lang="scss" scoped>
@import "app/template/set_r022/assets/css/membershipManagement.scss";
</style>
