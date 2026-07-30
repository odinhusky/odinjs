<template>
  <!-- pc data -->
  <q-table
    v-if="!isMobile"
    :rows="memberManagementStore.betReportRows"
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

    <template #top>
      <q-form @submit.prevent="memberManagementStore.handlerSearchBetReport" class="search-form">
        <div class="search-form-row">
          <div class="search-item bet-report bet-report-date-search-item">
            <div class="search-item-label">{{ $t("member.summary.query_time") }}</div>
            <q-input
              v-model="formattedDateRange"
              :placeholder="$t('placeholder.pleaseSelectDate')"
              readonly
              dense
              standout="bg-grey-10 text-white"
              class="search-item-input date"
            >
              <template v-slot:append>
                <q-icon name="calendar_month" class="cursor-pointer" />
              </template>
              <q-menu
                ref="menuRef"
                @show="memberManagementStore.datePickerShow = true"
                @hide="memberManagementStore.datePickerShow = false"
              >
                <q-date
                  v-model="memberManagementStore.dateRange"
                  mask="YYYY-MM-DD"
                  range
                  color="primary"
                  minimal
                  class="agent-center-date-picker"
                  @range-end="hideMenu"
                />
              </q-menu>
            </q-input>
          </div>

          <div class="search-item bet-report">
            <div class="search-item-label bet-report">{{ $t("menu.userAccount") }}</div>
            <q-input
              v-model="memberManagementStore.memberAccount"
              :placeholder="$t('placeholder.pleaseEnterUserAccount')"
              dense
              standout="text-black"
              class="search-item-input account bet-report"
            />
          </div>

          <SearchButton :action="memberManagementStore.handlerSearchBetReport" />
        </div>
      </q-form>
    </template>

    <template #body="props">
      <q-tr>
        <q-td key="member_account" :props="props">
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

    <template v-if="memberManagementStore.betReportRows?.length" #bottom-row>
      <q-tr class="page-total">
        <q-td>{{ $t("menu.pageTotal") }}</q-td>
        <q-td v-for="(item, index) in memberManagementStore.betReportSummaryList" :key="index">{{ item }}</q-td>
      </q-tr>
      <q-tr class="search-result-total">
        <q-td>{{ $t("menu.searchTotal") }}</q-td>
        <q-td v-for="(item, index) in memberManagementStore.betReportSummaryTotalList" :key="index">{{ item }}</q-td>
      </q-tr>
    </template>

    <template #no-data>
      <div class="agent-center-empty">
        <img :src="orderImg('no-data.svg')" alt="no-data" class="agent-center-empty-img" />
        <span>{{ $t("tableHeader.noData") }}</span>
      </div>
    </template>
  </q-table>

  <!-- mobile data -->
  <div v-else class="expansion-menu">
    <q-form @submit.prevent="memberManagementStore.handlerSearchBetReport" class="search-form">
      <div class="search-form-row bet-report-mobile-search-row">
        <div class="search-item bet-report">
          <div class="search-item-label">{{ $t("member.summary.query_time") }}</div>
          <q-input
            v-model="formattedDateRange"
            :placeholder="$t('placeholder.pleaseSelectDate')"
            readonly
            dense
            standout="bg-grey-10 text-white"
            class="search-item-input date"
          >
            <template v-slot:append>
              <q-icon name="calendar_month" class="cursor-pointer" />
            </template>
            <q-menu
              ref="menuRef"
              @show="memberManagementStore.datePickerShow = true"
              @hide="memberManagementStore.datePickerShow = false"
            >
              <q-date
                v-model="memberManagementStore.dateRange"
                mask="YYYY-MM-DD"
                range
                color="primary"
                minimal
                class="agent-center-date-picker"
                @range-end="hideMenu"
              />
            </q-menu>
          </q-input>
        </div>

        <div class="search-item">
          <div class="search-item-label">{{ $t("menu.userAccount") }}</div>
          <q-input
            v-model="memberManagementStore.memberAccount"
            :placeholder="$t('placeholder.pleaseEnterUserAccount')"
            dense
            standout="text-black"
            class="search-item-input account"
          />
        </div>

        <SearchButton :action="memberManagementStore.handlerSearchBetReport" />
      </div>
    </q-form>

    <div v-if="memberManagementStore.betReportRows?.length" class="bet-report-mobile-summary-strip">
      <button type="button" class="bet-report-mobile-summary-strip__header" @click="toggleMobileSummaryExpanded">
        <span class="bet-report-mobile-summary-strip__toggle">
          <q-icon :name="isMobileSummaryExpanded ? 'expand_more' : 'expand_less'" />
        </span>
        <span>{{ $t("menu.pageTotal") }}</span>
        <span>{{ $t("menu.searchTotal") }}</span>
      </button>
      <div class="bet-report-mobile-summary-strip__body">
        <div v-for="row in mobileSummaryRows" :key="row.key" class="bet-report-mobile-summary-strip__row">
          <span>{{ row.label }}</span>
          <span>{{ row.page }}</span>
          <span>{{ row.total }}</span>
        </div>
      </div>
    </div>

    <q-list v-if="memberManagementStore.betReportRows?.length">
      <q-expansion-item
        v-for="data in memberManagementStore.betReportRows"
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

  <!-- pagination -->
  <div v-if="memberManagementStore.totalPage" class="pagination">
    <q-pagination
      v-model="memberManagementStore.page"
      :max="memberManagementStore.totalPage"
      @update:model-value="memberManagementStore.handleChangePage"
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
import { computed, ref } from "vue"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useSiteImg } from "src/common/hooks/useSiteImg"
import { useI18n } from "vue-i18n"
import SearchButton from "./SearchButton.vue"

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

const menuRef = ref(null)
const isMobileSummaryExpanded = ref(false)
const expandedBetReportKeys = ref<string[]>([])

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

const mobileSummaryRows = computed(() => {
  const rows = betReportSummaryColumns.value.map((column, index) => ({
    key: column.key,
    label: column.label,
    page: memberManagementStore.betReportSummaryList[index],
    total: memberManagementStore.betReportSummaryTotalList[index],
  }))

  if (isMobileSummaryExpanded.value) {
    return rows
  }

  return rows.filter((row) => row.key === "profit")
})

const formattedDateRange = computed(() => {
  if (typeof memberManagementStore.dateRange === "string") {
    if (!memberManagementStore.dateRange) return ""
    return `${memberManagementStore.dateRange} ${t("common.btn.to")} ${memberManagementStore.dateRange}`
  } else {
    if (!memberManagementStore.dateRange?.from || !memberManagementStore.dateRange?.to) return ""
    return `${memberManagementStore.dateRange.from} ${t("common.btn.to")} ${memberManagementStore.dateRange.to}`
  }
})

const hideMenu = () => {
  ;(menuRef.value as any)?.hide()
}

const toggleMobileSummaryExpanded = () => {
  isMobileSummaryExpanded.value = !isMobileSummaryExpanded.value
}
</script>

<style lang="scss" scoped>
@import "app/template/set_r017/assets/css/membershipManagement.scss";

@media (max-width: 768px) {
  .bet-report-mobile-summary-strip {
    overflow: hidden;
    margin-bottom: 0.5rem;
    border-radius: 0.25rem;
  }

  .bet-report-mobile-summary-strip__header,
  .bet-report-mobile-summary-strip__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    text-align: center;
  }

  .bet-report-mobile-summary-strip__header {
    width: 100%;
    padding: 0.75rem 0;
    border: 0;
    background: rgba(255, 255, 255, 0.14);
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
  }

  .bet-report-mobile-summary-strip__body {
    padding: 0.625rem;
    background: #090720;
  }

  .bet-report-mobile-summary-strip__row {
    border-bottom: 1px solid rgba(210, 210, 210, 0.24);
    color: #fff;
    font-size: 0.75rem;
    line-height: 1;
  }

  .bet-report-mobile-summary-strip__row:last-child {
    border-bottom: 0;
  }

  .bet-report-mobile-summary-strip__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.72);

    :deep(.q-icon) {
      font-size: 1rem;
      line-height: 1;
    }
  }

  .bet-report-mobile-summary-strip__header > span {
    padding: 0.25rem 0.5rem;
    white-space: nowrap;
  }

  .bet-report-mobile-summary-strip__header > span:nth-child(2) {
    border-left: 1px solid rgba(210, 210, 210, 0.24);
    border-right: 1px solid rgba(210, 210, 210, 0.24);
  }

  .bet-report-mobile-summary-strip__header > span:nth-child(3) {
    border-right: 1px solid rgba(210, 210, 210, 0.24);
  }

  .bet-report-mobile-summary-strip__row > span {
    padding: 0.5rem 0;
    white-space: nowrap;
  }

  .bet-report-mobile-summary-strip__row > span:nth-child(2),
  .bet-report-mobile-summary-strip__row > span:nth-child(3) {
    font-weight: 700;
  }

  .bet-report-mobile-card-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, auto);
    column-gap: 0.75rem;
    width: 100%;
    min-width: 0;
  }

  .bet-report-mobile-card-item {
    min-width: 0;
    color: rgba(255, 255, 255, 0.66);
    font-size: 0.6875rem;
    line-height: 1rem;
  }

  .bet-report-mobile-card-value {
    color: #fff;
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1rem;
    word-break: break-all;
  }

  .bet-report-mobile-account-trigger {
    padding: 0;
    border: 0;
    background: transparent;
    color: #39a7ff;
    text-align: left;
    cursor: pointer;
  }

  .bet-report-mobile-account-trigger:hover {
    text-decoration: underline;
  }

  .bet-report-mobile-card-label {
    margin-top: 0.25rem;
  }

  .bet-report-mobile-card-value-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.375rem;
  }

  .bet-report-mobile-card-value-group {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .bet-report-mobile-toggle-btn {
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
    color: #fff;
    cursor: pointer;

    :deep(.q-icon) {
      font-size: 1.375rem;
      line-height: 1;
    }
  }
}
</style>
