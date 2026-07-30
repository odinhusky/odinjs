<template>
  <div class="history-area">
    <!-- 類型切換 -->
    <q-tabs
      v-model="historyState.query.search_type"
      no-caps
      :outside-arrows="false"
      :mobile-arrows="false"
      :align="isDown.phone ? 'center' : 'left'"
      indicator-color="transparent"
      inline-label
      class="type-tabs"
    >
      <q-tab v-for="item in searchTabs" :key="item.value" :name="item.value">
        {{ item.label }}
      </q-tab>
    </q-tabs>

    <div class="history-content">
      <div class="history-title">
        <div class="history-title-left flex items-center gap-2">
          {{ $t("menu.history_records") }}

          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="text-[var(--icon-02)] cursor-pointer hidden phone:!block"
          >
            <path
              d="M15 3.5C15.5523 3.5 16 3.94772 16 4.5V16.5C16 17.0523 15.5523 17.5 15 17.5H5C4.44772 17.5 4 17.0523 4 16.5V4.5C4 3.94772 4.44772 3.5 5 3.5H15ZM6 14.5V15.7002H14V14.5H6ZM6 12.7998H14V11.5996H6V12.7998ZM6 9.7998H14V8.59961H6V9.7998ZM6 6.7998H11V5.59961H6V6.7998Z"
              fill="currentColor"
            />
          </svg>
          <q-menu class="bg-transparent hidden phone:!block" :offset="[-20, 0]">
            <MemberNav module="module2" />
          </q-menu>
        </div>

        <div
          class="history-title-right"
          :class="historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory ? 'flex-auto' : 'flex-1'"
        >
          <!-- 投注歷史 幣別 -->
          <template v-if="historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory">
            <q-select
              v-model="historyState.query.currency_id"
              :options="historyCurrencyList"
              dense
              borderless
              option-label="label"
              option-value="value"
              emit-value
              map-options
              color="white"
              class="history-currency"
            />
          </template>

          <!-- 投注歷史 AI類別 -->
          <template v-if="!!aiAgentStatus && historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory">
            <q-select
              v-model="historyState.query.updated_by"
              :options="aiHistoryTabs"
              dense
              borderless
              option-label="label"
              option-value="value"
              emit-value
              map-options
              color="white"
              class="history-updated-by"
            />
          </template>

          <!-- 錢包類型下拉選單 -->
          <q-select
            v-model="selectedWalletType"
            :options="walletTypeOptions"
            dense
            borderless
            option-label="label"
            option-value="value"
            emit-value
            map-options
            color="white"
            class="history-wallet-type"
          />

          <DateRangePicker v-model="dateRange" class="history-date-range-picker" />

          <q-space />

          <q-btn class="h-100 q-ml-md btn-submit" :label="$t('common.btn.search')" @click="handleSubmit"></q-btn>
        </div>
      </div>

      <div v-if="historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory" class="ai-total-area">
        <div class="total-item">
          <div class="total-item-title">{{ $t("collaboration.valid_bet_amount") }}</div>
          <div class="total-item-amount">{{ moneyFormat(validBet) }}</div>
        </div>

        <div class="total-item">
          <div class="total-item-title">{{ $t("menu.winLoss") }}</div>
          <div class="total-item-amount">{{ moneyFormat(winLoss) }}</div>
        </div>
      </div>

      <q-table
        v-if="!isDown.phone"
        ref="tableRef"
        v-model:pagination="historyState.pagination"
        :rows="historyState.list"
        :rows-per-page-options="[historyState.pagination?.rowsPerPage || 10]"
        :columns="dynamicColumns"
        row-key="id"
        :loading="isLoading"
        hide-pagination
        flat
        @request="handleTableRequest"
        class="history-table"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template #body="props">
          <q-tr>
            <q-td key="accountChangeTime" :props="props" width="15%">
              <span>{{ dateformat(props.row.updated_at, "YYYY-MM-DD HH:mm:ss") }}</span>
            </q-td>
            <q-td key="currency" :props="props">
              <span>{{ currencyName(props.row.currency_code) }}</span>
            </q-td>
            <q-td key="walletType" :props="props">
              <span>{{ $t(WALLET_TYPE.I18nKeys[props.row.wallet_type as WALLET_TYPE.Enums]) }}</span>
            </q-td>
            <q-td key="accountType" :props="props">
              <span>{{ $t(ACTION_TYPE.I18nKeys[props.row.action_type as ACTION_TYPE.Enums]) }}</span>
            </q-td>
            <q-td key="accountVariableObject" :props="props">
              <template v-if="isInterestHistory(props.row)">
                <span>{{ getHistoryAccountVariableObject(props.row) }}</span>
              </template>
              <template v-else>
                <p v-if="props.row.action_target">{{ props.row.action_target }}</p>
                <template v-if="getPromotionTitle(props.row.promotion_title)">
                  <span>{{ getPromotionTitle(props.row.promotion_title) }}</span>
                </template>
                <template v-else>
                  <span>{{ getHistoryReferenceCode(props.row) }}</span>
                </template>
              </template>
            </q-td>
            <q-td key="betMethod" :props="props">
              <span>
                {{
                  props.row.updated_by === HISTORY_UPDATED_BY_TYPE.Enums.Ai
                    ? $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Ai])
                    : $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Member])
                }}
              </span>
            </q-td>
            <q-td key="amount" :props="props">
              <span>{{ moneyFormat(props.row.amount, 2) }}</span>
            </q-td>
            <q-td key="amountBeforeChanges" :props="props">
              <span>{{ moneyFormat(props.row.before_balance, 2) }}</span>
            </q-td>
            <q-td key="amountAfterChange" :props="props">
              <span>{{ moneyFormat(props.row.after_balance, 2) }}</span>
            </q-td>
          </q-tr>
        </template>

        <template #no-data>
          <div class="no-data-container">
            <img :src="orderImg('no-data.svg')" alt="no-data" class="no-data-img" />

            <span>{{ $t("tableHeader.noData") }}</span>
          </div>
        </template>
      </q-table>

      <template v-else>
        <q-list v-if="historyState.list.length" class="mobile-history-list">
          <div v-for="(history, index) in historyState.list" :key="index" class="w-full">
            <q-expansion-item
              dense
              expand-separator
              :header-class="['mobile-item-header']"
              expand-icon="expand_more"
              expand-icon-class="no-rotate"
            >
              <template v-slot:header>
                <div class="header-item-left">
                  <div class="header-label">
                    <div class="top">{{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</div>
                    <div class="bottom">{{ $t("tableHeader.accountChangeTime") }}</div>
                  </div>
                </div>

                <div class="header-item-right">
                  <div class="top">{{ moneyFormat(history.after_balance) }}</div>
                  <div class="bottom">{{ $t("tableHeader.amountAfterChange") }}</div>
                </div>
              </template>
              <q-list class="mobile-item-body">
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.currency") }}</span>
                  <span class="body-item-value">{{ currencyName(history.currency_code) }}</span>
                </q-item>
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.accountType") }}</span>
                  <span class="body-item-value">{{ $t(ACTION_TYPE.I18nKeys[history.action_type ?? 0]) }}</span>
                </q-item>
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.accountVariableObject") }}</span>
                  <span class="body-item-value">
                    <template v-if="isInterestHistory(history)">
                      {{ getHistoryAccountVariableObject(history) }}
                    </template>
                    <template v-else-if="getPromotionTitle(history.promotion_title)">
                      {{ getPromotionTitle(history.promotion_title) }}
                    </template>
                    <template v-else>
                      {{ getHistoryReferenceCode(history) }}
                    </template>
                  </span>
                </q-item>
                <q-item v-if="history.action_type === ACTION_TYPE.Enums.BET" class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.bettingMethod") }}</span>
                  <span class="body-item-value">
                    {{
                      history.updated_by === HISTORY_UPDATED_BY_TYPE.Enums.Ai
                        ? $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Ai])
                        : $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Member])
                    }}
                  </span>
                </q-item>
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.amount") }}</span>
                  <span class="body-item-value">
                    {{ moneyFormat(history.amount) }}
                  </span>
                </q-item>
                <q-item class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.amountBeforeChanges") }}</span>
                  <span class="body-item-value">
                    {{ moneyFormat(history.before_balance) }}
                  </span>
                </q-item>
                <!-- 欄位重複暫移除 -->
                <!-- <q-item class="body-item">
                  <span class="body-item-title">{{ $t("tableHeader.amountAfterChange") }}</span>
                  <span class="body-item-value">
                    {{ moneyFormat(history.after_balance) }}
                  </span>
                </q-item> -->
              </q-list>
            </q-expansion-item>
          </div>
        </q-list>

        <div v-else class="no-data-container">
          <img :src="orderImg('no-data.svg')" alt="no-data" class="no-data-img" />

          <span>{{ $t("tableHeader.noData") }}</span>
        </div>
      </template>

      <q-pagination
        v-if="historyState.pagination.totalPage"
        v-model="historyState.pagination.page"
        :max="historyState.pagination.totalPage"
        :max-pages="5"
        class="custom-pagination"
        color="grey-7"
        direction-links
        @update:model-value="handlePagination"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useSiteImg } from "src/common/hooks/useSiteImg"
import { QTableProps, useQuasar } from "quasar"
import { useHistory } from "src/common/composables/useHistory"
import { useCommon } from "src/common/hooks/useCommon"
import {
  ACTION_TYPE,
  REPORT_DATE_TYPES,
  HISTORY_SEARCH_TYPE,
  WALLET_TYPE,
  HISTORY_UPDATED_BY_TYPE
} from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { computed, nextTick, onMounted, provide, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useEnv } from "src/common/hooks/useEnv"
import { useEnvInfoStore } from "src/stores/envStore"
import { useUserInfo } from "src/common/composables/useUserInfo"
import DateRangePicker from "./DateRangePicker.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import MemberNav from "src/common/components/MemberNav/Index.vue"

type WalletDropItem = {
  label: string
  value: number
}

const $q = useQuasar()
const { t, locale } = useI18n()

const getPromotionTitle = (promotionTitle: Record<string, string> | null | undefined) => {
  if (!promotionTitle) return ""
  return promotionTitle[locale.value] ?? promotionTitle["en"] ?? Object.values(promotionTitle)[0] ?? ""
}
const { envInfo } = useEnvInfoStore()
const { aiAgentStatus } = useEnv()
const { moneyFormat } = useCommon()
const { orderImg } = useSiteImg()
const { isDown } = useMediaQuery()
const { inUseWallet, userWalletMap, getWalletLabel } = useUserInfo()
const {
  isLoading,
  historyTableColumns,
  aiHistoryTableColumns,
  historyState,
  initHistoryQuery,
  getHistoryList,
  getHistoryTotal,
  handlePagination,
  handleTableRequest,
  currencyName,
  searchTabs
} = useHistory()
type HistoryItem = (typeof historyState.list)[number]

const isInterestHistory = (history: HistoryItem) => {
  return [
    ACTION_TYPE.Enums.INTEREST_DEDUCTION,
    ACTION_TYPE.Enums.INTEREST_PRINCIPAL,
    ACTION_TYPE.Enums.INTEREST_EARNINGS
  ].includes(Number(history.action_type) as ACTION_TYPE.Enums)
}

const getHistoryReferenceCode = (history: HistoryItem) => {
  return Number(history.action_type) === ACTION_TYPE.Enums.BET ? history.wager_code : history.transaction_code
}

const getHistoryAccountVariableObject = (history: HistoryItem) => {
  if (isInterestHistory(history)) return history.action_target || getHistoryReferenceCode(history) || "-"

  return history.action_target || getHistoryReferenceCode(history) || "-"
}

const uploadSwitch = computed(() => Boolean(envInfo.upload_details))
const isR027 = computed(() => envInfo.siteKey === "set_r027")

// 提供 historyState 給子組件使用
provide("historyState", historyState)

const tableColumns = computed<QTableProps["columns"]>(() => [
  ...(historyTableColumns.value || []),
  {
    name: "upload",
    field: "upload",
    align: "center",
    label: t("tableHeader.uploadDetail")
  },
  {
    name: "cancel",
    field: "cancel",
    align: "center",
    label: t("tableHeader.cancel")
  }
])

const dayTypeTabs = computed(() => [
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.Today]),
    value: REPORT_DATE_TYPES.Enums.Today
  },
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.Yesterday]),
    value: REPORT_DATE_TYPES.Enums.Yesterday
  },
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastSevenDays]),
    value: REPORT_DATE_TYPES.Enums.LastSevenDays
  },
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastThirtyDays]),
    value: REPORT_DATE_TYPES.Enums.LastThirtyDays
  }
])

const dynamicColumns = computed(() => {
  return historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory
    ? aiHistoryTableColumns.value
    : historyTableColumns.value
})

const aiHistoryTabs = computed(() => {
  return [
    {
      label: t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.All]),
      value: HISTORY_UPDATED_BY_TYPE.Enums.All
    },
    {
      label: t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Member]),
      value: HISTORY_UPDATED_BY_TYPE.Enums.Member
    },
    {
      label: t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Ai]),
      value: HISTORY_UPDATED_BY_TYPE.Enums.Ai
    }
  ]
})

const walletTypeOptions = computed(() => {
  const all = { label: t("common.btn.all"), value: 0 }
  const types = Object.values(WALLET_TYPE.Enums)
    .filter((v) => typeof v === "number")
    .map((v) => ({
      label: t(WALLET_TYPE.I18nKeys[v as WALLET_TYPE.Enums]),
      value: v as number
    }))
  return [all, ...types]
})

const selectedWalletType = computed({
  get: () => (historyState.query.wallet_types.length ? (historyState.query.wallet_types[0] as number) : 0),
  set: (val: number) => {
    historyState.query.wallet_types = val === 0 ? [] : [val as WALLET_TYPE.Enums]
  }
})

const historyCurrencyList = computed<WalletDropItem[]>(() => {
  return Object.keys(userWalletMap.value).map((e) => {
    const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
    const label = getWalletLabel(cashWallet)
    const value = cashWallet.currency_id
    return { label, value }
  })
})

const menuRef = ref()
const scrollAreaRef = ref()
const datePickerValue = ref({ from: historyState.query.start_date, to: historyState.query.end_date })

const tableRef = ref()
const validBet = ref(0)
const winLoss = ref(0)

const handleSubmit = async () => {
  historyState.pagination.page = 1
  await getHistoryList()

  if (historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory) {
    handlerGetHistoryTotal()
  }

  scrollAreaRef?.value?.setScrollPosition("vertical", 0)
}

const handlerGetHistoryTotal = async () => {
  const data = await getHistoryTotal()
  validBet.value = Number(data?.valid_bet_amount_total ?? 0)
  winLoss.value = Number(data?.player_profit ?? 0)
}

const hideMenu = () => {
  menuRef.value.hide()
}

watch(
  () => historyState.query.search_type,
  async () => {
    await nextTick()
    await handleSubmit()
  }
)

onMounted(async () => {
  if ($q.platform.is.mobile) {
    // 要取search type 但不要page，所以放前面
    initHistoryQuery()
    historyState.query.offset = 0
    historyState.pagination.page = 1
    historyState.query.size = 15
    historyState.pagination.rowsPerPage = 15
    historyState.pagination.rowsNumber = 15
  } else {
    historyState.query.size = 10
    historyState.pagination.rowsPerPage = 10
    historyState.pagination.rowsNumber = 10
    // 需要在最後rowsNumber改動會驅動handlePagination
    initHistoryQuery()
  }

  if (inUseWallet.value && inUseWallet.value[WALLET_TYPE.Enums.Cash]) {
    // 配置投注歷史預設的幣別
    historyState.query.currency_id = inUseWallet.value?.[WALLET_TYPE.Enums.Cash]?.currency_id ?? 0
  }

  console.log("historyState.query.search_type", historyState.query)

  if (historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory) {
    // 一開始若直接進投注頁時要打總計api
    await handlerGetHistoryTotal()
  }

  await getHistoryList()
})

const dateRange = computed({
  get() {
    return {
      from: historyState.query.start_date || "",
      to: historyState.query.end_date || ""
    }
  },
  set(value: { from: string; to: string }) {
    historyState.query.start_date = value.from
    historyState.query.end_date = value.to
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.history-area {
  width: 100%;
  position: relative;

  .type-tabs {
    :deep(.q-tab) {
      min-width: 6.25rem;
      min-height: auto;
      background: var(--btn-bg-07);
      color: var(--tab-text-01);
      font-size: 0.875rem;
      font-weight: 700;
      border-top-right-radius: 0.5rem;
      border-top-left-radius: 0.5rem;
      padding: 0.5rem 1.25rem;

      @include phone-width {
        // min-width: 3.75rem;
      }

      &.q-tab--active {
        background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%) !important;
      }

      .q-tab__content {
        padding: 0;
      }
    }
  }

  .history-content {
    background-color: var(--bg-11);
    color: var(--text-01);
    margin-bottom: 20px;
    border-radius: 0.5rem;
    border-top-left-radius: 0;
    padding: 1.25rem;
    margin: 0 auto 1.25rem;
    box-shadow: 0px -2px 8px 0px #0000004d;

    @include phone-width {
      padding: 0.625rem;
    }

    .history-title {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex-wrap: wrap;

      @include phone-width {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.625rem;
      }

      .history-title-left {
        font-size: 1.25rem;
        font-weight: 700;
        // flex: 1;
        word-break: break-all;
        white-space: nowrap;
        margin-right: 1rem;
        margin-bottom: 0px;

        @include phone-width {
          flex: 0 0 100%;
        }
      }

      .history-title-right {
        font-size: 1.25rem;
        font-weight: 700;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        gap: 0.625rem;
        justify-content: flex-end;
        margin-bottom: 0.625rem;
        width: 100%;

        @include phone-width {
          flex-direction: column;
          gap: 0.625rem;

          > * {
            width: 100% !important;
            max-width: 100% !important;

            &.q-space {
              display: none;
            }
          }
        }
      }

      .history-date-range-picker {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        border: 2px solid var(--input-dropdown-text-03);
        color: var(--input-dropdown-text-01);
        background: var(--input-dropdown-bg-01);
        border-radius: 0.25rem;
        box-shadow: 0px 2px 4px 0px #00000080;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        margin: 0;
        height: 2.5rem;

        @include phone-width {
          width: 100%;
          justify-content: space-between;
          gap: 0;
          margin: 0;
        }
      }

      .btn-submit {
        background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%) !important;
        min-width: 6.25rem;
        height: 2.5rem;

        @include phone-width {
          width: 100%;
          margin: 0;
        }
      }

      .history-currency,
      .history-updated-by,
      .history-wallet-type {
        margin-right: 1rem;
      }

      .history-currency,
      .history-updated-by,
      .history-wallet-type {
        height: 2.5rem;
        background-color: var(--input-dropdown-bg-01);
        border-radius: 0.25rem;
        padding: 0.625rem 0.75rem;
        border: 2px solid var(--input-dropdown-text-03);
        flex: auto;
        max-width: 25%;

        :deep(.q-field__control) {
          height: 100%;
          min-height: unset;
        }

        :deep(.q-field__native) {
          justify-content: center;
          font-size: 1rem;
          line-height: 0;
          min-height: unset;
          color: var(--input-dropdown-text-01);
        }

        :deep(.q-field__append) {
          height: 100%;
          color: var(--input-dropdown-text-01);
        }
      }

      .history-currency,
      .history-updated-by,
      .history-wallet-type {
        @include phone-width {
          margin-left: 0;
        }
      }
    }

    .history-table {
      width: 100%;
      background-color: var(--bg-11);

      * {
        scrollbar-width: thin;
      }

      :deep(.q-table) {
        border-radius: 0.75rem;

        thead {
          tr {
            background: var(--bg-13);

            th {
              color: var(--text-03);
              font-size: 0.875rem;
              font-weight: 700;
              padding: 0.75rem 0.25rem;
              min-width: 5rem;
              white-space: break-spaces;
            }
          }
        }

        tbody {
          background: var(--bg-14);

          td {
            color: var(--text-03);
            font-size: 0.875rem;
            font-weight: 400;
            padding: 0.75rem 0.25rem;
            min-width: 5rem;
            white-space: break-spaces;
            word-break: break-word;

            .text-danger {
              color: var(--text-06) !important;
              font-weight: 600;
            }

            .text-pending {
              color: var(--text-04) !important;
              font-weight: 600;
            }
          }
        }
      }
    }

    .mobile-history-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      border-top-left-radius: 0.25rem;
      border-top-right-radius: 0.25rem;
      overflow: hidden;

      :deep(.q-item) {
        &.mobile-item-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          background: var(--bg-14);
          padding: 0.625rem;

          .q-item__section {
            padding: 0;
            margin-left: 0.375rem;

            i {
              transform: none !important;
              transition: none !important;
            }
          }

          .header-item-left {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 0.375rem;
            flex: 1;
          }

          .header-label,
          .header-item-right {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 0.125rem;

            .top {
              color: var(--text-01);
              font-size: 0.875rem;
              font-weight: 700;
              line-height: normal;
            }

            .bottom {
              color: var(--text-03);
              font-size: 0.625rem;
              font-weight: 300;
              line-height: normal;
            }
          }
        }
      }

      :deep(.q-expansion-item__content) {
        background: var(--bg-08);
        padding: 0.625rem;

        .body-item {
          min-height: auto;
          padding: 0.25rem 0.5rem 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          border-bottom: 1px solid var(--bg-line-02);
          margin-bottom: 0.25rem;

          &:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }

          .body-item-title {
            color: var(--text-03);
            font-weight: 400;
          }

          .body-item-value {
            color: var(--text-01);
            font-weight: 700;

            &.text-danger {
              color: var(--text-06) !important;
            }

            &.text-pending {
              color: var(--text-04) !important;
            }
          }
        }
      }
    }

    .no-data-container {
      @apply w-full flex flex-col justify-center items-center py-40;

      span {
        color: var(--text-03);
        margin-top: 1.25rem;
        font-size: 0.875rem;
        font-weight: 700;
      }

      .no-data-img {
        width: 10rem;
      }
    }

    .custom-pagination {
      margin-top: 0.625rem;
      justify-content: flex-end;

      @include phone-width {
        justify-content: center;
      }

      :deep(.q-pagination__middle) {
        gap: 2px;

        .q-btn {
          background-color: var(--secondary-08);
          color: var(--text-01);
        }
      }

      :deep(.q-btn) {
        border-radius: 0.35rem;
      }

      :deep(.q-icon) {
        color: var(--text-01);
      }

      :deep(.q-btn--standard) {
        background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%) !important;
        color: var(--text-01) !important;

        &::before {
          display: none;
        }
      }
    }
  }
}

.ai-total-area {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;

  @include phone-width {
    flex-direction: column;
  }

  .total-item {
    width: calc(50% - 0.375rem);
    border-radius: 0.25rem;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 0.5rem 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    border: 1px solid rgba(255, 255, 255, 0.1);

    @include phone-width {
      width: 100%;

      &:first-child {
        margin-bottom: 0.625rem;
      }
    }

    &-title {
      color: rgba(255, 255, 255, 0.77);
      font-size: 0.875rem;
      font-weight: 400;
      margin-right: 0.25rem;

      @include phone-width {
        margin-right: 0.6875rem;
      }
    }

    &-amount {
      color: $common-white-color;
      font-size: 1.25rem;
    }
  }
}
</style>
