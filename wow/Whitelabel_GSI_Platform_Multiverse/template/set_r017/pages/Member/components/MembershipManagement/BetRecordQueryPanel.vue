<template>
  <!-- pc data -->
  <q-table
    v-if="!isMobile"
    :rows="memberManagementStore.betRecordQueryRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="betRecordQueryTableColumns"
    row-key="id"
    hide-pagination
    flat
    class="bet-record-query-table"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #top>
      <q-form @submit.prevent="memberManagementStore.handlerSearchBetRecordQuery" class="search-form">
        <div class="search-form-row bet-record-search-row">
          <div class="search-item bet-record-report">
            <div class="search-item-label bet-record-report">{{ $t("tableHeader.betNumber") }}</div>
            <q-input
              v-model="memberManagementStore.betNumber"
              :placeholder="$t('placeholder.pleaseEnterBetNumber')"
              dense
              standout="text-black"
              class="search-item-input account bet-record-report"
            />
          </div>

          <div class="search-item bet-record-report">
            <div class="search-item-label bet-record-report">{{ $t("menu.userAccount") }}</div>
            <q-input
              v-model="memberManagementStore.memberAccount"
              :placeholder="$t('placeholder.pleaseEnterUserAccount')"
              dense
              standout="text-black"
              class="search-item-input account bet-record-report"
            />
          </div>

          <div class="search-item bet-record-report">
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

          <div class="bet-record-checkbox-group">
            <label class="bet-record-checkbox">
              <q-checkbox
                v-model="memberManagementStore.settlementDate"
                size="xs"
                dense
                class="bet-record-checkbox-control"
              />
              <span>{{ $t("menu.settlementDate") }}</span>
            </label>

            <label class="bet-record-checkbox">
              <q-checkbox v-model="memberManagementStore.betDate" size="xs" dense class="bet-record-checkbox-control" />
              <span>{{ $t("member.membershipManagement.betDate") }}</span>
            </label>
          </div>

          <SearchButton :action="memberManagementStore.handlerSearchBetRecordQuery" />
        </div>
      </q-form>
    </template>

    <template #body="props">
      <q-tr>
        <q-td key="wager_code" :props="props">
          <span>{{ props.row.wager_code }}</span>
        </q-td>
        <q-td key="gaming_site" :props="props">
          <span>{{ formatGameType(props.row.game_type) }}</span>
        </q-td>
        <q-td key="member_account" :props="props">
          <span>{{ props.row.member_account }}</span>
        </q-td>
        <q-td key="created_at" :props="props">
          <span>{{ formatDateTime(props.row.created_at) }}</span>
        </q-td>
        <q-td key="settled_at" :props="props">
          <span>{{ formatDateTime(props.row.settled_at) }}</span>
        </q-td>
        <q-td key="status" :props="props">
          <span>{{ props.row.status_title }}</span>
        </q-td>
        <q-td key="channel_code" :props="props">
          <span>{{ props.row.channel_code }}</span>
        </q-td>
        <q-td key="product_title" :props="props">
          <span>{{ props.row.product_title }}</span>
        </q-td>
        <q-td key="game_title" :props="props">
          <span>{{ props.row.game_title }}</span>
        </q-td>
        <q-td key="bet_amount" :props="props">
          <span>{{ moneyFormat(props.row.bet_amount) }}</span>
        </q-td>
        <q-td key="valid_bet_amount" :props="props">
          <span>{{ moneyFormat(props.row.valid_bet_amount) }}</span>
        </q-td>
        <q-td key="payout" :props="props">
          <span
            class="agent-center-link"
            @click="
              memberManagementStore.handlerGetMemberAgentWagerDetail(props.row.wager_code, props.row.product_code)
            "
            >{{ moneyFormat(props.row.payout) }}</span
          >
        </q-td>
        <q-td key="profit" :props="props">
          <span>{{ moneyFormat(props.row.profit) }}</span>
        </q-td>
        <q-td key="bonus" :props="props">
          <span>-</span>
        </q-td>
      </q-tr>
    </template>

    <template v-if="memberManagementStore.betRecordQueryRows?.length" #bottom-row>
      <q-tr class="page-total">
        <q-td>{{ $t("menu.pageTotal") }}</q-td>
        <q-td v-for="i in 8" :key="i">-</q-td>
        <q-td v-for="(item, index) in memberManagementStore.betRecordQuerySummaryList" :key="index">{{ item }}</q-td>
        <q-td>-</q-td>
      </q-tr>
      <q-tr class="search-result-total">
        <q-td>{{ $t("menu.searchTotal") }}</q-td>
        <q-td v-for="i in 8" :key="i">-</q-td>
        <q-td v-for="(item, index) in memberManagementStore.betRecordQuerySummaryTotalList" :key="index">
          {{ item }}
        </q-td>
        <q-td>-</q-td>
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
    <q-form @submit.prevent="memberManagementStore.handlerSearchBetRecordQuery" class="search-form">
      <div class="search-form-row mb-5">
        <div class="search-item">
          <div class="search-item-label">{{ $t("tableHeader.betNumber") }}</div>
          <q-input
            v-model="memberManagementStore.betNumber"
            :placeholder="$t('placeholder.pleaseEnterBetNumber')"
            dense
            standout="text-black"
            class="search-item-input account"
          />
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
      </div>

      <div class="search-form-row bet-record-mobile-search-row">
        <div class="search-item">
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

        <div class="search-item checkbox bet-record-mobile-checkbox-group">
          <div class="bet-record-mobile-checkbox">
            <q-checkbox
              v-model="memberManagementStore.settlementDate"
              size="xs"
              dense
              class="bet-record-checkbox-control"
            />
            <span>{{ $t("menu.settlementDate") }}</span>
          </div>

          <div class="bet-record-mobile-checkbox">
            <q-checkbox v-model="memberManagementStore.betDate" size="xs" dense class="bet-record-checkbox-control" />
            <span>{{ $t("member.membershipManagement.betDate") }}</span>
          </div>
        </div>

        <SearchButton :action="memberManagementStore.handlerSearchBetRecordQuery" />
      </div>
    </q-form>

    <div v-if="memberManagementStore.betRecordQueryRows?.length" class="bet-record-mobile-summary-strip">
      <button type="button" class="bet-record-mobile-summary-strip__header" @click="toggleMobileSummaryExpanded">
        <span class="bet-record-mobile-summary-strip__toggle">
          <q-icon :name="isMobileSummaryExpanded ? 'expand_more' : 'expand_less'" />
        </span>
        <span>{{ $t("menu.pageTotal") }}</span>
        <span>{{ $t("menu.searchTotal") }}</span>
      </button>
      <div class="bet-record-mobile-summary-strip__body">
        <div v-for="row in mobileSummaryRows" :key="row.key" class="bet-record-mobile-summary-strip__row">
          <span>{{ row.label }}</span>
          <span>{{ row.page }}</span>
          <span>{{ row.total }}</span>
        </div>
      </div>
    </div>

    <q-list v-if="memberManagementStore.betRecordQueryRows?.length">
      <q-expansion-item
        v-for="data in memberManagementStore.betRecordQueryRows"
        :key="getBetRecordRowKey(data)"
        :model-value="expandedBetRecordKeys.includes(getBetRecordRowKey(data))"
        dense
        dense-toggle
        expand-separator
        expand-icon="keyboard_arrow_down"
        hide-expand-icon
        class="expansion-item"
        @update:model-value="(expanded) => updateExpandedBetRecordKey(expanded, getBetRecordRowKey(data))"
      >
        <template #header="{ expanded, toggle }">
          <q-item-section class="expansion-header">
            <div class="bet-record-mobile-card-header">
              <div class="bet-record-mobile-card-item">
                <div class="bet-record-mobile-card-value">{{ data.wager_code }}</div>
                <div class="bet-record-mobile-card-label">{{ $t("tableHeader.betNumber") }}</div>
              </div>
              <div class="bet-record-mobile-card-item text-right">
                <div class="bet-record-mobile-card-value-row">
                  <div class="bet-record-mobile-card-value-group">
                    <button
                      type="button"
                      class="bet-record-mobile-account-trigger bet-record-mobile-card-value"
                      @click.stop="memberManagementStore.searchAccountBetReport(data.member_account)"
                    >
                      {{ data.member_account }}
                    </button>
                    <div class="bet-record-mobile-card-label">{{ $t("menu.userAccount") }}</div>
                  </div>
                  <button type="button" class="bet-record-mobile-toggle-btn" @click.stop="toggle">
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
                <div class="mb-1">{{ $t("member.register.gaming_site") }}</div>
                <div class="text-right">{{ formatGameType(data.game_type) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.bettingTime") }}</div>
                <div class="text-right">{{ formatDateTime(data.created_at) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("member.referralRebate.settlementTime") }}</div>
                <div class="text-right">{{ formatDateTime(data.settled_at) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.status") }}</div>
                <div class="text-right">{{ data.status_title }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.bettingSource") }}</div>
                <div class="text-right">{{ data.channel_code }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.product") }}</div>
                <div class="text-right">{{ data.product_title }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("common.games") }}</div>
                <div class="text-right">{{ data.game_title }}</div>
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
                <div
                  class="text-right agent-center-link"
                  @click="memberManagementStore.handlerGetMemberAgentWagerDetail(data.wager_code, data.product_code)"
                >
                  {{ moneyFormat(data.payout) }}
                </div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.activityBonus") }}</div>
                <div class="text-right">-</div>
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
import { useRfc3339 } from "src/common/composables/useRfc3339"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useSiteImg } from "src/common/hooks/useSiteImg"
import { GAME_TYPE } from "src/common/utils/constants"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"

import SearchButton from "./SearchButton.vue"

type BetRecordSummaryKey =
  | "gaming_site"
  | "created_at"
  | "settled_at"
  | "status"
  | "channel_code"
  | "product_title"
  | "game_title"
  | "bet_amount"
  | "valid_bet_amount"
  | "payout"
  | "profit"
  | "bonus"

const { t } = useI18n()
const { isMobile } = useMediaQuery()
const { moneyFormat } = useCommon()
const { formatDateTime } = useRfc3339()
const { orderImg } = useSiteImg()
const memberManagementStore = useMemberManagement()

const menuRef = ref(null)
const isMobileSummaryExpanded = ref(false)
const expandedBetRecordKeys = ref<string[]>([])

const betRecordQueryTableColumns = computed(() =>
  memberManagementStore.getBetRecordQueryColumns({ showProfitRate: false })
)

const getBetRecordRowKey = (row: { wager_code?: string }) => row.wager_code ?? ""

const updateExpandedBetRecordKey = (expanded: boolean, key: string) => {
  if (expanded) {
    if (!expandedBetRecordKeys.value.includes(key)) {
      expandedBetRecordKeys.value = [...expandedBetRecordKeys.value, key]
    }
    return
  }

  expandedBetRecordKeys.value = expandedBetRecordKeys.value.filter((currentKey) => currentKey !== key)
}

const formatGameType = (gameType: GAME_TYPE.Enums | number | string | null | undefined) => {
  if (gameType === undefined || gameType === null || gameType === "") return "-"

  const gameTypeNumber = Number(gameType)
  const i18nKey = GAME_TYPE.I18nKeys[gameTypeNumber as GAME_TYPE.Enums]

  return i18nKey ? t(i18nKey) : String(gameType)
}

const betRecordSummaryColumns = computed<Array<{ key: BetRecordSummaryKey; label: string }>>(() => [
  { key: "gaming_site", label: t("member.register.gaming_site") },
  { key: "created_at", label: t("tableHeader.bettingTime") },
  { key: "settled_at", label: t("member.referralRebate.settlementTime") },
  { key: "status", label: t("tableHeader.status") },
  { key: "channel_code", label: t("tableHeader.bettingSource") },
  { key: "product_title", label: t("tableHeader.product") },
  { key: "game_title", label: t("common.games") },
  { key: "bet_amount", label: t("tableHeader.bettingAmount") },
  { key: "valid_bet_amount", label: t("tableHeader.validBetAmount") },
  { key: "payout", label: t("common.payout") },
  { key: "profit", label: t("member.referralRebate.profit") },
  { key: "bonus", label: t("tableHeader.activityBonus") },
])

const betRecordSummaryValueMap = computed<Record<BetRecordSummaryKey, { page: string; total: string }>>(() => ({
  gaming_site: { page: "-", total: "-" },
  created_at: { page: "-", total: "-" },
  settled_at: { page: "-", total: "-" },
  status: { page: "-", total: "-" },
  channel_code: { page: "-", total: "-" },
  product_title: { page: "-", total: "-" },
  game_title: { page: "-", total: "-" },
  bet_amount: {
    page: memberManagementStore.betRecordQuerySummaryList[0] ?? "-",
    total: memberManagementStore.betRecordQuerySummaryTotalList[0] ?? "-",
  },
  valid_bet_amount: {
    page: memberManagementStore.betRecordQuerySummaryList[1] ?? "-",
    total: memberManagementStore.betRecordQuerySummaryTotalList[1] ?? "-",
  },
  payout: {
    page: memberManagementStore.betRecordQuerySummaryList[2] ?? "-",
    total: memberManagementStore.betRecordQuerySummaryTotalList[2] ?? "-",
  },
  profit: {
    page: memberManagementStore.betRecordQuerySummaryList[3] ?? "-",
    total: memberManagementStore.betRecordQuerySummaryTotalList[3] ?? "-",
  },
  bonus: { page: "-", total: "-" },
}))

const mobileSummaryRows = computed(() => {
  const rows = betRecordSummaryColumns.value.map((column) => ({
    key: column.key,
    label: column.label,
    page: betRecordSummaryValueMap.value[column.key].page,
    total: betRecordSummaryValueMap.value[column.key].total,
  }))

  if (isMobileSummaryExpanded.value) {
    return rows
  }

  return rows.filter((row) => row.key === "profit")
})

const formattedDateRange = computed(() => {
  if (typeof memberManagementStore.dateRange === "string") {
    if (memberManagementStore.dateRange === "") return ""
    return `${memberManagementStore.dateRange} ${t("common.btn.to")} ${memberManagementStore.dateRange}`
  } else {
    if (!memberManagementStore.dateRange.from || !memberManagementStore.dateRange.to) return ""
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
  .bet-record-mobile-summary-strip {
    overflow: hidden;
    margin-bottom: 0.5rem;
    border-radius: 0.25rem;
  }

  .bet-record-mobile-summary-strip__header,
  .bet-record-mobile-summary-strip__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    text-align: center;
  }

  .bet-record-mobile-summary-strip__header {
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

  .bet-record-mobile-summary-strip__body {
    padding: 0.625rem;
    background: #090720;
  }

  .bet-record-mobile-summary-strip__row {
    border-bottom: 1px solid rgba(210, 210, 210, 0.24);
    color: #fff;
    font-size: 0.75rem;
    line-height: 1;
  }

  .bet-record-mobile-summary-strip__row:last-child {
    border-bottom: 0;
  }

  .bet-record-mobile-summary-strip__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.72);

    :deep(.q-icon) {
      font-size: 1rem;
      line-height: 1;
    }
  }

  .bet-record-mobile-summary-strip__header > span {
    padding: 0.25rem 0.5rem;
    white-space: nowrap;
  }

  .bet-record-mobile-summary-strip__header > span:nth-child(2) {
    border-left: 1px solid rgba(210, 210, 210, 0.24);
    border-right: 1px solid rgba(210, 210, 210, 0.24);
  }

  .bet-record-mobile-summary-strip__header > span:nth-child(3) {
    border-right: 1px solid rgba(210, 210, 210, 0.24);
  }

  .bet-record-mobile-summary-strip__row > span {
    padding: 0.5rem 0;
    white-space: nowrap;
  }

  .bet-record-mobile-summary-strip__row > span:nth-child(2),
  .bet-record-mobile-summary-strip__row > span:nth-child(3) {
    font-weight: 700;
  }

  .bet-record-mobile-card-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, auto);
    column-gap: 0.75rem;
    width: 100%;
    min-width: 0;
  }

  .bet-record-mobile-card-item {
    min-width: 0;
    color: rgba(255, 255, 255, 0.66);
    font-size: 0.6875rem;
    line-height: 1rem;
  }

  .bet-record-mobile-card-value {
    color: #fff;
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1rem;
    word-break: break-all;
  }

  .bet-record-mobile-account-trigger {
    padding: 0;
    border: 0;
    background: transparent;
    color: #fff;
    text-align: right;
    cursor: pointer;
  }

  .bet-record-mobile-account-trigger:hover {
    text-decoration: underline;
  }

  .bet-record-mobile-card-label {
    margin-top: 0.25rem;
  }

  .bet-record-mobile-card-value-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.375rem;
  }

  .bet-record-mobile-card-value-group {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .bet-record-mobile-toggle-btn {
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
