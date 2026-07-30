<script setup lang="ts">
import type { BaseTableColumn } from "../BaseTable.vue"
import {
  useReferralRebateFlow,
  type ReferralRebateEventDisplayRow,
  type ReferralRebateStatementDisplayRow,
  type ReferralRebateTab
} from "../../composables/useReferralRebateFlow"

interface ReferralRebatePageClassObj {
  page?: string
  content?: string
  title?: string
  panel?: string
}

const props = withDefaults(
  defineProps<{
    pageSize?: number
    classObj?: ReferralRebatePageClassObj
  }>(),
  {
    pageSize: 20,
    classObj: () => ({})
  }
)

const { t } = useI18n()
const { isDown } = useCustomBreakpoints()
const mobileExpandedRowKey = ref<string | null>(null)

const {
  activePagination,
  activeTab,
  copiedReferralCode,
  currencyOptions,
  currentDisplayRows,
  detailDisplayRows,
  eventDisplayRows,
  gameTypeOptions,
  inputFilters,
  isActiveListLoading,
  isPageLoading,
  isVisible,
  selectedCurrencyId,
  showEventDetail,
  referralCode,
  referralUrl,
  totalRevenueAmount,
  totalValidBetAmount,
  backToEvents,
  changeCurrency,
  changeTab,
  copyReferralCode,
  copyReferralUrl,
  search,
  showEventStatement,
  updatePage
} = useReferralRebateFlow({
  pageSize: props.pageSize
})

const titleText = computed(() => t("member.referralRebate.title"))
const currencyText = computed(() => t("collaboration.currency"))
const accountText = computed(() => t("member.referralRebate.account"))
const accountPlaceholderText = computed(() => t("placeholder.pleaseEnterUserAccount"))
const gameTypeText = computed(() => t("member.referralRebate.gametype"))
const searchTimeText = computed(() => t("member.referralRebate.searchTime"))
const searchText = computed(() => t("common.btn.search"))
const emptyText = computed(() => t("tableHeader.no_data"))
const selectPlaceholderText = computed(() => t("shareholder_platform.please_select"))
const currentTabText = computed(() => t("member.referralRebate.eventStatement"))
const eventsTabText = computed(() => t("member.referralRebate.revenueDetail"))
const detailText = computed(() => t("member.referralRebate.detail"))
const copiedText = computed(() => t("common.btn.copied"))

const tabOptions = computed<Array<{ key: ReferralRebateTab; label: string }>>(() => [
  { key: "current", label: currentTabText.value },
  { key: "events", label: eventsTabText.value }
])

const summaryCards = computed(() => [
  {
    key: "referral-code",
    label: t("collaboration.exclusive_referral_code"),
    value: referralCode.value,
    theme: "blue-purple"
  },
  {
    key: "valid-bet",
    label: t("member.referralRebate.latestTotalValidBetAmount"),
    value: totalValidBetAmount.value,
    theme: "pink"
  },
  {
    key: "revenue-amount",
    label: t("member.referralRebate.latestTotalRevenueAmount"),
    value: totalRevenueAmount.value,
    theme: "pink"
  }
])

const statementColumns = computed<BaseTableColumn[]>(() => [
  { field: "account", header: accountText.value, width: "16%" },
  { field: "tier", header: t("member.referralRebate.tier"), width: "13%" },
  { field: "rate_display", header: t("member.referralRebate.rate"), width: "13%" },
  { field: "currency_code", header: currencyText.value, width: "10%" },
  { field: "valid_bet_amount_display", header: t("member.referralRebate.validBetAmount"), width: "16%" },
  { field: "profit_display", header: t("member.referralRebate.netGamingRevenue"), width: "16%" },
  { field: "revenue_amount_display", header: t("member.referralRebate.revenueAmount"), width: "16%" }
])

const eventColumns = computed<BaseTableColumn[]>(() => [
  { field: "settlement_time_display", header: t("member.referralRebate.settlementTime"), width: "17%" },
  { field: "currency_code", header: currencyText.value, width: "9%" },
  { field: "valid_bet_amount_display", header: t("member.referralRebate.totalValidBetAmount"), width: "16%" },
  { field: "profit_display", header: t("member.referralRebate.totalProfit"), width: "12%" },
  { field: "revenue_amount_display", header: t("member.referralRebate.totalRevenueAmount"), width: "16%" },
  { field: "distribution_time_display", header: t("member.referralRebate.distributionTime"), width: "17%" },
  { field: "actions", header: detailText.value, width: "13%" }
])

const activeColumns = computed(() => (activeTab.value === "events" && !showEventDetail.value ? eventColumns.value : statementColumns.value))
const activeRows = computed(() => {
  if (showEventDetail.value) return detailDisplayRows.value
  if (activeTab.value === "events") return eventDisplayRows.value
  return currentDisplayRows.value
})
const isMobileLayout = computed(() => Boolean(isDown.phone))
const rowKey = computed(() => {
  if (showEventDetail.value || activeTab.value === "current") return "account"
  return "id"
})

const selectClassObj = {
  wrapper: "!gap-1",
  label: "!text-xs !leading-4 !text-[var(--color-light-900)]",
  select:
    "!min-h-[38px] !h-[38px] !rounded-md !border !border-[var(--brand-brand-secondary-contrast)] !bg-[var(--container-container-field)]",
  selectLabel: "!py-0 !pl-3 !text-sm !leading-[36px]",
  dropdown: "!ml-0 !w-8 !text-[var(--text-text-primary)]",
  panel: "!z-[1100]"
}

const inputClassObj = {
  root: "!gap-1",
  label: "!text-xs !leading-4 !text-[var(--color-light-900)]",
  input:
    "!min-h-[38px] !h-[38px] !rounded-md !border !border-[var(--brand-brand-secondary-contrast)] !bg-[var(--container-container-field)] !py-0 !text-sm !leading-[36px]"
}

const dateClassObj = {
  root: "!gap-1",
  label: "!text-xs !leading-4 !text-[var(--color-light-900)]",
  input: "!h-[38px] !min-h-[38px] !border-0 !bg-[var(--color-transparent)]",
  panelRoot: "phone:!w-[calc(100vw-32px)]"
}

const tableClassObj = {
  root: "!gap-3",
  tableWrap: "!rounded-md !border-0",
  tableHead:
    "[&>tr>th]:!whitespace-nowrap [&>tr>th]:!px-4 [&>tr>th]:!py-3 [&>tr>th]:!text-sm [&>tr>th]:!leading-5 pad:[&>tr>th]:!px-3 pad:[&>tr>th]:!text-xs phone:[&>tr>th]:!text-xs",
  tableBody:
    "[&>tr>td]:!whitespace-nowrap [&>tr>td]:!px-4 [&>tr>td]:!py-4 [&>tr>td]:!text-sm pad:[&>tr>td]:!px-3 pad:[&>tr>td]:!text-xs",
  mobileCardWrap: "!gap-3",
  mobileCard: "!rounded-lg !border-0"
}

const tabButtonClass = (tab: ReferralRebateTab) =>
  cx(
    "h-10 min-w-[132px] rounded-t-md px-4 text-sm font-bold leading-5 transition-colors phone:h-10 phone:min-w-0 phone:flex-1 phone:px-2",
    activeTab.value === tab && !showEventDetail.value
      ? "bg-[linear-gradient(90deg,var(--button-button-bg-primary-left-enabled)_0%,var(--button-button-bg-primary-right-enabled)_100%)] text-[var(--button-button-title-primary-enabled)]"
      : "bg-[var(--color-light-100)] text-[var(--text-text-primary)]"
  )

const summaryCardClass = (theme: string) =>
  theme === "blue-purple"
    ? "border-[var(--brand-brand-secondary-contrast)] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-navy-950)_54%,var(--button-button-bg-secondary-left-enabled)_46%)_0%,color-mix(in_srgb,var(--color-navy-950)_50%,var(--button-button-bg-secondary-right-enabled)_50%)_100%)]"
    : "border-[var(--card-card-border-pink)] bg-[var(--card-card-bg-pink)]"

const asEventRow = (row: Record<string, any>) => row as ReferralRebateEventDisplayRow
const asStatementRow = (row: Record<string, any>) => row as ReferralRebateStatementDisplayRow

const getMobileRowKey = (row: Record<string, any>, index: number) => {
  const value = row.id ?? row.account ?? index
  return `${activeTab.value}-${showEventDetail.value ? "detail" : "list"}-${String(value)}`
}

const isMobileRowExpanded = (row: Record<string, any>, index: number) =>
  mobileExpandedRowKey.value === getMobileRowKey(row, index)

const toggleMobileRow = (row: Record<string, any>, index: number) => {
  const key = getMobileRowKey(row, index)
  mobileExpandedRowKey.value = mobileExpandedRowKey.value === key ? null : key
}

const getStatementMobileRows = (row: ReferralRebateStatementDisplayRow) => [
  { label: t("member.referralRebate.tier"), value: row.tier },
  { label: t("member.referralRebate.rate"), value: row.rate_display },
  { label: t("member.referralRebate.validBetAmount"), value: row.valid_bet_amount_display },
  { label: t("member.referralRebate.netGamingRevenue"), value: row.profit_display },
  { label: t("member.referralRebate.revenueAmount"), value: row.revenue_amount_display }
]

const getEventMobileRows = (row: ReferralRebateEventDisplayRow) => [
  { label: t("member.referralRebate.settlementTime"), value: row.settlement_time_display },
  { label: t("member.referralRebate.totalValidBetAmount"), value: row.valid_bet_amount_display },
  { label: t("member.referralRebate.totalProfit"), value: row.profit_display },
  { label: t("member.referralRebate.totalRevenueAmount"), value: row.revenue_amount_display },
  { label: t("member.referralRebate.distributionTime"), value: row.distribution_time_display }
]

watch(
  activeRows,
  (rows) => {
    mobileExpandedRowKey.value = rows.length ? getMobileRowKey(rows[0] as Record<string, any>, 0) : null
  },
  { immediate: true }
)
</script>

<template>
  <section
    :class="
      cx(
        'min-h-full text-[var(--text-text-primary)]',
        props.classObj?.page
      )
    "
  >
    <div
      :class="
        cx(
          'mx-auto w-full max-w-[1200px] px-6 py-8 padXl:max-w-[929px] padLg:max-w-[892px] phone:max-w-none phone:px-4 phone:py-5',
          props.classObj?.content
        )
      "
    >
      <h1 :class="cx('text-[28px] font-bold leading-9 phone:text-2xl phone:leading-8', props.classObj?.title)">
        {{ titleText }}
      </h1>

      <div v-if="isPageLoading" class="flex min-h-[360px] items-center justify-center">
        <BaseIcon name="svg-spinners:ring-resize" size="2rem" class="text-[var(--icon-icon-primary-enabled)]" />
      </div>

      <div
        v-else-if="!isVisible"
        class="mt-6 flex min-h-[360px] items-center justify-center rounded-lg bg-[var(--color-navy-950)] text-sm text-[var(--color-light-700)]"
      >
        {{ emptyText }}
      </div>

      <div v-else :class="cx('mt-5 flex flex-col gap-5 phone:mt-4 phone:gap-4', props.classObj?.panel)">
        <div class="w-[120px] phone:w-full">
          <BaseSelect
            :model-value="selectedCurrencyId"
            :options="currencyOptions"
            option-label="label"
            option-value="value"
            :label="currencyText"
            :placeholder="selectPlaceholderText"
            :class-obj="selectClassObj"
            @update:model-value="changeCurrency(Number($event))"
          />
        </div>

        <section class="overflow-x-auto overflow-y-hidden [scrollbar-width:none] phone:overflow-visible [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div class="grid min-w-[760px] grid-cols-[minmax(220px,1.1fr)_minmax(250px,1.25fr)_minmax(250px,1.25fr)] gap-4 phone:min-w-0 phone:grid-cols-2 phone:gap-3">
            <div
              v-for="card in summaryCards"
              :key="card.label"
              :class="
                cx(
                  'min-h-[82px] rounded-lg border px-4 py-3',
                  card.key === 'referral-code' && 'phone:col-span-2',
                  summaryCardClass(card.theme)
                )
              "
            >
              <div class="whitespace-nowrap text-xs leading-4 text-[var(--color-light-600)] phone:whitespace-normal">{{ card.label }}</div>
              <div class="mt-1 flex min-w-0 items-center gap-2">
                <span class="min-w-0 truncate text-2xl font-bold leading-8 text-[var(--text-text-primary)] phone:text-[26px] phone:leading-9">
                  {{ card.value }}
                </span>

                <template v-if="card.key === 'referral-code'">
                  <button
                    type="button"
                    class="shrink-0 text-[var(--color-light-700)] hover:text-[var(--text-text-primary)] disabled:opacity-50"
                    :disabled="!referralUrl && referralCode === '-'"
                    :aria-label="card.label"
                    @click="copyReferralUrl"
                  >
                    <BaseIcon name="mdi:share-variant" size="18px" />
                  </button>
                  <button
                    type="button"
                    class="shrink-0 text-[var(--color-light-700)] hover:text-[var(--text-text-primary)] disabled:opacity-50"
                    :disabled="referralCode === '-'"
                    :aria-label="card.label"
                    @click="copyReferralCode"
                  >
                    <BaseIcon name="mdi:content-copy" size="18px" />
                  </button>
                  <span v-if="copiedReferralCode" class="shrink-0 text-xs text-[var(--color-light-700)]">
                    {{ copiedText }}
                  </span>
                </template>
              </div>
            </div>
          </div>
        </section>

        <section class="overflow-hidden rounded-lg phone:rounded-md">
          <div v-if="!showEventDetail" class="flex items-end gap-1 phone:gap-0">
            <button
              v-for="tab in tabOptions"
              :key="tab.key"
              type="button"
              :class="tabButtonClass(tab.key)"
              @click="changeTab(tab.key)"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="rounded-b-lg bg-[var(--color-navy-950)] phone:rounded-b-md">
            <div class="px-6 pb-5 pt-4 phone:px-2 phone:py-4">
              <div v-if="showEventDetail" class="mb-4 flex items-center gap-3">
                <BaseBtn
                  size="sm"
                  :class-obj="{
                    button:
                      '!h-8 !min-h-8 !rounded-lg !px-3 !py-0 !text-sm !font-bold !text-[var(--button-button-title-secondary-enabled)] !bg-[linear-gradient(180deg,var(--button-button-bg-secondary-left-enabled)_0%,var(--button-button-bg-secondary-right-enabled)_100%)]',
                    label: '!gap-2'
                  }"
                  @click="backToEvents"
                >
                  <BaseIcon name="mdi:arrow-left" size="20px" />
                  回上一層
                </BaseBtn>
              </div>

              <div
                class="grid grid-cols-[minmax(112px,180px)_minmax(140px,1fr)_minmax(170px,1.2fr)_104px] items-end gap-3 phone:grid-cols-1"
              >
                <BaseSelect
                  v-model="inputFilters.gameType"
                  :options="gameTypeOptions"
                  option-label="label"
                  option-value="value"
                  :label="gameTypeText"
                  :placeholder="selectPlaceholderText"
                  :class-obj="selectClassObj"
                  class="min-w-0"
                />

                <BaseInput
                  v-model="inputFilters.account"
                  :label="accountText"
                  :placeholder="accountPlaceholderText"
                  :class-obj="inputClassObj"
                  class="min-w-0"
                />

                <BaseDatePicker
                  v-model="inputFilters.dateRange"
                  selection-mode="range"
                  :label="searchTimeText"
                  :class-obj="dateClassObj"
                  class="min-w-0"
                />

                <BaseBtn
                  size="sm"
                  class="min-w-0"
                  :class-obj="{
                    button:
                      '!h-[38px] !min-h-[38px] !rounded-md !px-3 !py-0 !text-sm !font-bold !text-[var(--button-button-title-secondary-enabled)] !bg-[linear-gradient(90deg,var(--button-button-bg-secondary-left-enabled)_0%,var(--button-button-bg-secondary-right-enabled)_100%)]'
                  }"
                  @click="search"
                >
                  {{ searchText }}
                </BaseBtn>
              </div>
            </div>

            <div class="min-h-[420px] px-6 pb-4 pt-0 phone:px-2 phone:pb-4">
              <div v-if="isMobileLayout" class="flex flex-col gap-3">
                <div v-if="isActiveListLoading" class="flex min-h-[220px] items-center justify-center text-[var(--color-light-900)]">
                  <BaseIcon name="svg-spinners:ring-resize" size="2rem" />
                </div>

                <template v-else-if="activeRows.length">
                  <article
                    v-for="(row, index) in activeRows"
                    :key="`referral-rebate-mobile-${index}`"
                    class="overflow-hidden rounded-lg border border-transparent bg-[var(--table-table-content-bg-light)] text-[var(--text-text-primary)]"
                  >
                    <button
                      type="button"
                      class="grid min-h-[64px] w-full grid-cols-[minmax(0,1fr)_minmax(76px,96px)_18px] items-center gap-3 bg-[var(--tag-tag-bg-default)] px-4 py-3 text-left"
                      @click="toggleMobileRow(row, index)"
                    >
                      <div class="flex min-w-0 items-center gap-3">
                        <span class="shrink-0 rounded-full bg-[var(--tag-tag-bg-default)] px-3 py-1 text-xs font-bold">
                          {{ row.currency_code }}
                        </span>
                        <div class="min-w-0">
                          <div class="truncate text-sm font-bold">
                            {{ activeTab === "events" && !showEventDetail ? asEventRow(row).settlement_time_display : asStatementRow(row).account }}
                          </div>
                          <div class="text-[10px] leading-4 text-[var(--color-light-600)]">
                            {{ activeTab === "events" && !showEventDetail ? $t("member.referralRebate.settlementTime") : accountText }}
                          </div>
                        </div>
                      </div>

                      <div class="min-w-0 justify-self-end text-right">
                        <div class="text-sm font-bold">
                          {{ activeTab === "events" && !showEventDetail ? asEventRow(row).revenue_amount_display : asStatementRow(row).revenue_amount_display }}
                        </div>
                        <div class="text-[10px] leading-4 text-[var(--color-light-600)]">
                          {{ $t("member.referralRebate.revenueAmount") }}
                        </div>
                      </div>
                      <BaseIcon
                        :name="isMobileRowExpanded(row, index) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                        size="18px"
                        class="shrink-0"
                      />
                    </button>

                    <div v-if="isMobileRowExpanded(row, index)" class="px-4 pb-3 text-xs">
                      <div
                        v-for="item in activeTab === 'events' && !showEventDetail ? getEventMobileRows(asEventRow(row)) : getStatementMobileRows(asStatementRow(row))"
                        :key="`${String(item.label)}-${String(item.value)}`"
                        class="flex items-center justify-between border-b border-[var(--color-light-100)] py-2 last:border-b-0"
                      >
                        <span class="text-[var(--color-light-800)]">{{ item.label }}</span>
                        <span class="ml-4 break-all text-right font-bold">{{ item.value }}</span>
                      </div>

                      <div v-if="activeTab === 'events' && !showEventDetail" class="flex justify-end pt-3">
                        <BaseBtn
                          theme="primary"
                          category="outline"
                          size="sm"
                          class="h-8 min-w-14 !rounded-md !px-3 !py-1"
                          @click="showEventStatement(asEventRow(row))"
                        >
                          {{ detailText }}
                        </BaseBtn>
                      </div>
                    </div>
                  </article>
                </template>

                <div v-else class="flex min-h-[300px] flex-col items-center justify-center gap-4 text-sm text-[var(--color-light-700)]">
                  <BaseIcon name="mdi:folder-search-outline" size="92px" class="text-[var(--button-button-bg-secondary-left-enabled)]" />
                  <span>{{ emptyText }}</span>
                </div>

                <div class="flex justify-center pt-2">
                  <BasePagination
                    :model-value="activePagination.page"
                    :rows="activePagination.pageSize"
                    :total-records="activePagination.total"
                    :class-obj="{ root: '!gap-2', pageButton: '!w-8 !h-8', navButton: '!w-8 !h-8' }"
                    @update:model-value="updatePage"
                  />
                </div>
              </div>

              <BaseTable
                v-else
                :rows="activeRows"
                :columns="activeColumns"
                :loading="isActiveListLoading"
                :pagination="true"
                :server-pagination="true"
                :page="activePagination.page"
                :rows-per-page="activePagination.pageSize"
                :total-records="activePagination.total"
                :row-key="rowKey"
                :class-obj="tableClassObj"
                :data-table-props="{ tableStyle: 'min-width: 1080px; width: 100%; table-layout: fixed;' }"
                @update:page="updatePage"
              >
                <template #cell-account="{ data }">
                  <span class="font-bold">{{ asStatementRow(data).account }}</span>
                </template>

                <template #cell-actions="{ data }">
                  <BaseBtn
                    theme="primary"
                    category="outline"
                    size="sm"
                    class="h-8 min-w-14 !rounded-md !px-3 !py-1"
                    @click="showEventStatement(asEventRow(data))"
                  >
                    {{ detailText }}
                  </BaseBtn>
                </template>

                <template #mobileCardToggleRow="{ data, expanded }">
                  <div class="flex min-h-[64px] w-full items-center justify-between gap-3 bg-[var(--tag-tag-bg-default)] px-4 py-3 text-left">
                    <div class="min-w-0">
                      <div class="truncate text-sm font-bold">
                        {{ activeTab === "events" && !showEventDetail ? asEventRow(data).settlement_time_display : asStatementRow(data).account }}
                      </div>
                      <div class="text-[10px] leading-4 text-[var(--color-light-600)]">
                        {{ activeTab === "events" && !showEventDetail ? $t("member.referralRebate.settlementTime") : accountText }}
                      </div>
                    </div>
                    <div class="flex shrink-0 items-center gap-3">
                      <div class="text-right">
                        <div class="text-sm font-bold">{{ data.currency_code }}</div>
                        <div class="text-[10px] leading-4 text-[var(--color-light-600)]">{{ currencyText }}</div>
                      </div>
                      <BaseIcon :name="expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'" size="18px" />
                    </div>
                  </div>
                </template>

                <template #mobileCardRowList="{ data }">
                  <div
                    v-for="column in activeColumns"
                    :key="`mobile-${String(column.field)}-${String(data[rowKey])}`"
                    class="flex items-center justify-between border-b border-[var(--color-light-100)] px-4 py-2 text-xs last:border-b-0"
                  >
                    <span class="text-[var(--color-light-800)]">{{ column.header }}</span>
                    <span class="ml-4 break-all text-right font-bold">
                      <template v-if="column.field === 'actions'">
                        <BaseBtn
                          theme="primary"
                          category="outline"
                          size="sm"
                          class="h-8 min-w-14 !rounded-md !px-3 !py-1"
                          @click="showEventStatement(asEventRow(data))"
                        >
                          {{ detailText }}
                        </BaseBtn>
                      </template>
                      <template v-else>{{ data[String(column.field)] ?? "-" }}</template>
                    </span>
                  </div>
                </template>

                <template #empty>
                  <div class="flex min-h-[300px] flex-col items-center justify-center gap-4 text-sm text-[var(--color-light-700)]">
                    <BaseIcon name="mdi:folder-search-outline" size="92px" class="text-[var(--button-button-bg-secondary-left-enabled)]" />
                    <span>{{ emptyText }}</span>
                  </div>
                </template>
              </BaseTable>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
