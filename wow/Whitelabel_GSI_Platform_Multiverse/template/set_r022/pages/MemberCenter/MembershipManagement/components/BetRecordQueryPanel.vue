<template>
  <q-table
    v-if="!isMobile"
    :rows="betRecordQueryRows"
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
        <q-td key="profit_rate" :props="props">
          <span>{{ `${formatProfitRate(props.row.profit, props.row.valid_bet_amount)}%` }}</span>
        </q-td>
        <q-td key="bonus" :props="props">
          <span>-</span>
        </q-td>
      </q-tr>
    </template>

    <template v-if="betRecordQueryRows.length" #bottom-row>
      <q-tr class="page-total">
        <q-td
          v-for="column in betRecordQueryTableColumns"
          :key="column.name"
          class="agent-center-summary-cell text-center"
          :class="{ 'agent-center-summary-cell--title': column.name === 'wager_code' }"
        >
          {{ getBetRecordSummaryValue("page", column.name) }}
        </q-td>
      </q-tr>
      <q-tr class="search-result-total">
        <q-td
          v-for="column in betRecordQueryTableColumns"
          :key="column.name"
          class="agent-center-summary-cell text-center"
          :class="{ 'agent-center-summary-cell--title': column.name === 'wager_code' }"
        >
          {{ getBetRecordSummaryValue("total", column.name) }}
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
    <div v-if="betRecordQueryRows.length" class="bet-record-mobile-summary-strip">
      <button type="button" class="bet-record-mobile-summary-strip__header" @click="toggleMobileSummaryExpanded">
        <span class="bet-record-mobile-summary-strip__title">
          <span class="bet-record-mobile-summary-strip__title-icon">
            <q-icon name="bar_chart" />
          </span>
          <span>{{ $t("amount.total") }}</span>
        </span>
        <span class="bet-record-mobile-summary-strip__toggle">
          <q-icon :name="isMobileSummaryExpanded ? 'expand_less' : 'expand_more'" />
        </span>
      </button>
      <div class="bet-record-mobile-summary-strip__body">
        <div class="bet-record-mobile-summary-strip__row bet-record-mobile-summary-strip__row--head">
          <span>{{ $t("member.withdrawal.item") }}</span>
          <span>{{ $t("menu.pageTotal") }}</span>
          <span>{{ $t("menu.searchTotal") }}</span>
        </div>
        <div v-for="row in mobileSummaryRows" :key="row.key" class="bet-record-mobile-summary-strip__row">
          <span>{{ row.label }}</span>
          <span>{{ row.page }}</span>
          <span>{{ row.total }}</span>
        </div>
      </div>
    </div>

    <q-list v-if="betRecordQueryRows.length">
      <q-expansion-item
        v-for="data in betRecordQueryRows"
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
                    <div class="bet-record-mobile-card-value">
                      {{ data.member_account }}
                    </div>
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
                <div class="mb-1">{{ $t("game.category") }}</div>
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
                <div class="mb-1">{{ $t("member.referralRebate.profit") }}</div>
                <div class="text-right">{{ moneyFormat(data.profit) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.profitRatio") }}</div>
                <div class="text-right">{{ `${formatProfitRate(data.profit, data.valid_bet_amount)}%` }}</div>
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

  <div v-if="betRecordQueryTotalPage" class="pagination">
    <q-pagination
      v-model="memberManagementStore.page"
      :max="betRecordQueryTotalPage"
      @update:model-value="handleBetRecordQueryPageChange"
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
import { useRfc3339 } from "src/common/composables/useRfc3339"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { GAME_TYPE } from "src/common/utils/constants"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"

type BetRecordSummaryKey = "bet_amount" | "valid_bet_amount" | "payout" | "profit" | "profit_rate" | "bonus"

const { t } = useI18n()
const { isMobile } = useMediaQuery()
const { moneyFormat } = useCommon()
const { formatDateTime } = useRfc3339()
const { orderImg } = useSiteImg()
const memberManagementStore = useMemberManagement()

const isMobileSummaryExpanded = ref(false)
const expandedBetRecordKeys = ref<string[]>([])

const betRecordQueryRows = computed(() => memberManagementStore.betRecordQueryRows)
const betRecordQueryTotalPage = computed(() => memberManagementStore.totalPage)
const betRecordQueryTableColumns = computed(() =>
  memberManagementStore.getBetRecordQueryColumns({ showProfitRate: true })
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

const toNumber = (value: string | number | null | undefined) => {
  const parsed = Number(String(value ?? 0).replace(/,/g, ""))
  return Number.isFinite(parsed) ? parsed : 0
}

const formatProfitRate = (
  profit: string | number | null | undefined,
  validBetAmount: string | number | null | undefined
) => {
  const valid = toNumber(validBetAmount)
  if (!valid) return "0"
  return String(Number(((toNumber(profit) / valid) * 100).toFixed(2)))
}

const formatGameType = (gameType: GAME_TYPE.Enums | number | string | null | undefined) => {
  if (gameType === undefined || gameType === null || gameType === "") return "-"

  const gameTypeNumber = Number(gameType)
  const i18nKey = GAME_TYPE.I18nKeys[gameTypeNumber as GAME_TYPE.Enums]

  return i18nKey ? t(i18nKey) : String(gameType)
}

const betRecordSummaryColumns = computed<Array<{ key: BetRecordSummaryKey; label: string }>>(() => [
  { key: "bet_amount", label: t("tableHeader.bettingAmount") },
  { key: "valid_bet_amount", label: t("tableHeader.validBetAmount") },
  { key: "payout", label: t("common.payout") },
  { key: "profit", label: t("member.referralRebate.profit") },
  { key: "profit_rate", label: t("tableHeader.profitRatio") },
  { key: "bonus", label: t("tableHeader.activityBonus") },
])

const sumBetRecordRows = (
  rows: typeof memberManagementStore.betRecordQueryRows,
  key: "bet_amount" | "valid_bet_amount" | "payout" | "profit"
) => rows.reduce((total, row) => total + Number(row[key] || 0), 0)

const betRecordQuerySummaryList = computed(() => [
  ...memberManagementStore.betRecordQuerySummaryList,
  `${formatProfitRate(
    sumBetRecordRows(betRecordQueryRows.value, "profit"),
    sumBetRecordRows(betRecordQueryRows.value, "valid_bet_amount")
  )}%`,
])
const betRecordQuerySummaryTotalList = computed(() => [
  ...memberManagementStore.betRecordQuerySummaryTotalList,
  `${formatProfitRate(
    memberManagementStore.betRecordQuerySummary?.total?.profit,
    memberManagementStore.betRecordQuerySummary?.total?.valid_bet_amount
  )}%`,
])

const handleBetRecordQueryPageChange = (page: number) => {
  memberManagementStore.handleChangePage(page)
}

const betRecordSummaryValueMap = computed<Record<BetRecordSummaryKey, { page: string; total: string }>>(() => ({
  bet_amount: {
    page: betRecordQuerySummaryList.value[0] ?? "-",
    total: betRecordQuerySummaryTotalList.value[0] ?? "-",
  },
  valid_bet_amount: {
    page: betRecordQuerySummaryList.value[1] ?? "-",
    total: betRecordQuerySummaryTotalList.value[1] ?? "-",
  },
  payout: {
    page: betRecordQuerySummaryList.value[2] ?? "-",
    total: betRecordQuerySummaryTotalList.value[2] ?? "-",
  },
  profit: {
    page: betRecordQuerySummaryList.value[3] ?? "-",
    total: betRecordQuerySummaryTotalList.value[3] ?? "-",
  },
  profit_rate: {
    page: betRecordQuerySummaryList.value[4] ?? "-",
    total: betRecordQuerySummaryTotalList.value[4] ?? "-",
  },
  bonus: { page: "-", total: "-" },
}))

const getBetRecordSummaryValue = (type: "page" | "total", columnName: string) => {
  if (columnName === "wager_code") {
    return type === "page" ? t("menu.pageTotal") : t("menu.searchTotal")
  }

  const summaryValue = betRecordSummaryValueMap.value[columnName as BetRecordSummaryKey]
  if (!summaryValue) return "-"

  return summaryValue[type] ?? "-"
}

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

const toggleMobileSummaryExpanded = () => {
  isMobileSummaryExpanded.value = !isMobileSummaryExpanded.value
}
</script>

<style lang="scss" scoped>
@import "app/template/set_r022/assets/css/membershipManagement.scss";
</style>
