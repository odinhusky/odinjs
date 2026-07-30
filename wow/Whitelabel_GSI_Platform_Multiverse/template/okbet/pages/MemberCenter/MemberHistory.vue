<template>
  <HeaderTitleBack v-if="isMobile" :title-i18n="HISTORY_SEARCH_TYPE.I18nTitle[historyState.query.search_type]">
    <div class="h5-history-container">
      <!-- 類型切換 TAB -->
      <q-tabs
        v-model="historyState.query.search_type"
        dense
        indicator-color="primary"
        align="left"
        class="h5-type-tabs"
      >
        <q-tab v-for="item in searchTabs" :key="item.value" :name="item.value">
          {{ $t(item.label) }}
        </q-tab>
      </q-tabs>

      <q-form @submit="handleSubmit" class="w-full">
        <div class="date-picker-container">
          <!-- 幣別選擇 -->
          <div
            v-if="historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory"
            class="flex items-center justify-start mb-[0.625rem]"
          >
            <span class="mr-1.5 text-[0.75rem] md:text-base font-semibold">{{ $t("collaboration.currency") }}</span>

            <q-select
              v-model="historyState.query.currency_id"
              :options="bettingHistoryCurrencyList"
              rounded
              dense
              borderless
              option-label="label"
              option-value="value"
              emit-value
              map-options
              class="history-currency"
            />
          </div>

          <!-- 投注方式 -->
          <div
            v-if="!!aiAgentStatus && historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory"
            class="wallet-type-field"
          >
            <div class="date-picker-label">{{ $t("tableHeader.bettingMethod") }}</div>
            <q-select
              v-model="historyState.query.updated_by"
              :options="aiBettingHistoryTabs"
              dense
              borderless
              option-label="label"
              option-value="value"
              emit-value
              map-options
              class="wallet-type-select"
            />
          </div>

          <!-- 錢包類型選擇 -->
          <div class="wallet-type-field">
            <div class="date-picker-label">{{ $t("tableHeader.walletType") }}</div>
            <q-select
              v-model="selectedWalletType"
              :options="walletTypeOptions"
              dense
              borderless
              option-label="label"
              option-value="value"
              emit-value
              map-options
              class="wallet-type-select"
            />
          </div>

          <div class="date-picker-field">
            <div class="date-picker-label">{{ $t("member.profile.date") }}</div>
            <div class="date-picker-input">
              <span class="date-picker-text">
                {{ historyState.query.start_date }} ~ {{ historyState.query.end_date }}
              </span>
              <q-icon name="calendar_month" class="date-picker-icon" />
              <q-menu @show="datePickerShow = true" @hide="datePickerShow = false" ref="menuRef">
                <q-date
                  v-model="datePickerValue"
                  range
                  mask="YYYY-MM-DD"
                  color="primary"
                  minimal
                  @range-end="hideMenu"
                  @update:model-value="handleDateRangePick"
                />
              </q-menu>
            </div>
          </div>

          <q-btn-toggle
            v-model="historyState.query.dateType"
            no-caps
            unelevated
            toggle-color="primary"
            class="toggle-date-picker font"
            :options="dayTypeTabs"
          />

          <div class="flex items-center justify-between">
            <q-btn
              outline
              color="primary"
              type="reset"
              class="text-xs md:text-2xl font-normal capitalize rounded-lg w-[calc(50%-0.3125rem)] h-9 pl-[0.4375rem] font"
            >
              {{ $t("common.btn.reset") }}
            </q-btn>
            <q-btn
              color="primary"
              type="submit"
              class="text-xs md:text-2xl font-normal capitalize rounded-lg w-[calc(50%-0.3125rem)] h-9 pl-[0.4375rem] font"
            >
              {{ $t("common.btn.search") }}
            </q-btn>
          </div>

          <div
            v-if="historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory"
            class="ai-total-area md:mt-[1.125rem]"
          >
            <div class="total-item">
              <div class="total-item-title">{{ $t("menu.validBet") }}</div>
              <div class="total-item-amount">{{ moneyFormat(validBetAmount) }}</div>
            </div>

            <div class="total-item">
              <div class="total-item-title">{{ $t("menu.winLoss") }}</div>
              <div class="total-item-amount">{{ moneyFormat(winLossAmount) }}</div>
            </div>
          </div>
        </div>

        <div class="report-content">
          <q-scroll-area v-if="historyState.list.length" @scroll="handleScroll" :visible="false" ref="scrollAreaRef">
            <q-expansion-item
              v-for="(history, index) in historyState.list"
              :key="index"
              switch-toggle-side
              dense
              dense-toggle
              default-opened
              expand-icon="keyboard_arrow_down"
            >
              <template v-slot:header>
                <q-item-section class="title-section !pr-2">
                  <div class="header-cell">
                    <span class="header-value">{{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
                    <span class="header-label">{{ $t("tableHeader.accountChangeTime") }}</span>
                  </div>
                  <div class="header-cell right">
                    <span class="header-value">{{ moneyFormat(history.after_balance) }}</span>
                    <span class="header-label">{{ $t("tableHeader.amountAfterChange") }}</span>
                  </div>
                </q-item-section>
              </template>
              <q-card>
                <!-- <q-card-section>
                  <span class="title">{{ $t("tableHeader.accountChangeTime") }}</span>
                  <span class="text">{{ dateformat(history.updated_at ?? "", "YYYY-MM-DD HH:mm:ss") }}</span>
                </q-card-section> -->
                <q-card-section>
                  <span class="title">{{ currencyHeader }}</span>
                  <span class="text">{{ currencyName(history.currency_code) }}</span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.walletType") }}</span>
                  <span class="text">{{
                    $t(WALLET_TYPE.I18nKeys[(history.wallet_type as unknown as WALLET_TYPE.Enums) ?? 0])
                  }}</span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.accountType") }}</span>
                  <span class="text">{{
                    $t(actionType.I18nKeys[(history.action_type as unknown as ACTION_TYPE.Enums) ?? 0])
                  }}</span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.accountVariableObject") }}</span>
                  <span
                    class="text"
                    :class="{ link: canOpenHistoryDetail(history) }"
                    @click="handleHistoryTargetClick(history)"
                  >
                    <template v-if="isInterestHistory(history)">
                      {{ getHistoryAccountVariableObject(history) }}
                    </template>
                    <template v-else>
                      <p v-if="history.action_target">{{ history.action_target }}</p>
                      {{ getHistoryReferenceCode(history) }}
                    </template>
                  </span>
                </q-card-section>
                <q-card-section v-if="!!aiAgentStatus && history.action_type === ACTION_TYPE.Enums.BET">
                  <span class="title">{{ $t("tableHeader.bettingMethod") }}</span>
                  <span class="text">
                    {{
                      history.updated_by === HISTORY_UPDATED_BY_TYPE.Enums.Ai
                        ? $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Ai])
                        : $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Member])
                    }}
                  </span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.amount") }}</span>
                  <span class="text">{{ moneyFormat(history.amount) }}</span>
                </q-card-section>
                <q-card-section>
                  <span class="title">{{ $t("tableHeader.amountBeforeChanges") }}</span>
                  <span class="text">{{ moneyFormat(history.before_balance) }}</span>
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <div class="footer">
              {{ $t("member.mail.noMoreDataToDisplay") }}
            </div>
          </q-scroll-area>
          <div v-else class="no-data">
            <img :src="memberImg('fund-no-data.png')" alt="no-data" />
            <p>{{ $t("tableHeader.noContent") }}</p>
          </div>
        </div>
      </q-form>
    </div>
  </HeaderTitleBack>
  <div v-else class="pc-history-container">
    <q-form class="w-full" @submit="handleSubmit" @reset="handleReset">
      <img :src="memberImg('history.png')" alt="statement" class="img-order" />
      <!-- 類型切換 -->
      <q-tabs v-model="historyState.query.search_type" :outside-arrows="false" :mobile-arrows="false" class="type-tabs">
        <q-tab v-for="item in searchTabs" :key="item.value" :name="item.value">
          {{ $t(item.label) }}
        </q-tab>
      </q-tabs>

      <!-- 表單 -->
      <q-table
        :rows="historyState.list"
        :rows-per-page-options="[historyState.pagination?.rowsPerPage || 10]"
        :columns="dynamicColumns"
        row-key="id"
        v-model:pagination="historyState.pagination"
        :loading="isLoading"
        hide-pagination
        wrap-cells
        @request="handleTableRequest"
        flat
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template #top>
          <!-- 幣別選擇 -->
          <div
            v-if="historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory"
            class="flex items-center justify-start mb-[1.875rem]"
          >
            <span class="mr-2.5 text-[1.25rem] font-semibold">{{ $t("collaboration.currency") }}</span>
            <q-select
              v-model="historyState.query.currency_id"
              :options="bettingHistoryCurrencyList"
              rounded
              dense
              borderless
              option-label="label"
              option-value="value"
              emit-value
              map-options
              class="history-currency"
            />
          </div>

          <div class="query-field-wrapper">
            <div class="query-fields">
              <!-- 投注方式 -->
              <div
                v-if="!!aiAgentStatus && historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory"
                class="wallet-type-field"
              >
                <div class="date-picker-label">{{ $t("tableHeader.bettingMethod") }}</div>
                <q-select
                  v-model="historyState.query.updated_by"
                  :options="aiBettingHistoryTabs"
                  dense
                  borderless
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  class="wallet-type-select"
                />
              </div>

              <!-- 錢包類型 -->
              <div class="wallet-type-field">
                <div class="date-picker-label">{{ $t("tableHeader.walletType") }}</div>
                <q-select
                  v-model="selectedWalletType"
                  :options="walletTypeOptions"
                  dense
                  borderless
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  class="wallet-type-select"
                />
              </div>

              <!-- 時間選擇 -->
              <div class="date-picker-field">
                <div class="date-picker-label">{{ $t("member.profile.date") }}</div>
                <div class="date-picker-input">
                  <span class="date-picker-text">
                    {{ historyState.query.start_date }} ~ {{ historyState.query.end_date }}
                  </span>
                  <q-icon name="calendar_month" class="date-picker-icon" />
                  <q-menu @show="datePickerShow = true" @hide="datePickerShow = false" ref="menuRef">
                    <q-date
                      v-model="datePickerValue"
                      range
                      mask="YYYY-MM-DD"
                      color="primary"
                      minimal
                      @range-end="hideMenu"
                      @update:model-value="handleDateRangePick"
                    />
                  </q-menu>
                </div>
              </div>

              <div class="flex items-center justify-between mt-8 mb-5">
                <q-btn-toggle
                  v-model="historyState.query.dateType"
                  no-caps
                  unelevated
                  toggle-color="primary"
                  class="toggle-date-picker font"
                  :options="dayTypeTabs"
                />
              </div>
            </div>

            <div class="flex items-center query-actions">
              <q-btn
                color="primary"
                type="submit"
                class="text-base font-normal capitalize rounded-lg w-28 h-9 min-h-9 font"
                >{{ $t("common.btn.search") }}</q-btn
              >
              <q-btn
                outline
                color="primary"
                type="reset"
                class="ml-2 text-base font-normal capitalize rounded-lg w-28 h-9 min-h-9 font"
                >{{ $t("common.btn.reset") }}</q-btn
              >
            </div>
          </div>
          <div v-if="historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory" class="ai-total-area">
            <div class="total-item">
              <div class="total-item-title">{{ $t("menu.validBet") }}</div>
              <div class="total-item-amount">{{ moneyFormat(validBetAmount) }}</div>
            </div>

            <div class="total-item">
              <div class="total-item-title">{{ $t("menu.winLoss") }}</div>
              <div class="total-item-amount">{{ moneyFormat(winLossAmount) }}</div>
            </div>
          </div>
        </template>
        <!-- table data -->
        <template #body="props">
          <q-tr>
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              class="custom-td"
              :props="props"
              :style="col.name === 'accountChangeTime' ? { width: '15%' } : undefined"
            >
              <span v-if="col.name === 'accountChangeTime'">
                {{ dateformat(props.row.updated_at, "YYYY-MM-DD HH:mm:ss") }}
              </span>
              <span v-else-if="col.name === 'currency'">
                {{ currencyName(props.row.currency_code) }}
              </span>
              <span v-else-if="col.name === 'walletType' || col.name === 'wallet_type'">
                {{ walletTypeName(props.row.wallet_type) }}
              </span>
              <span v-else-if="col.name === 'accountType'">
                {{ $t(actionType.I18nKeys[props.row.action_type as ACTION_TYPE.Enums]) }}
              </span>
              <template v-else-if="col.name === 'accountVariableObject'">
                <template v-if="isInterestHistory(props.row)">
                  {{ getHistoryAccountVariableObject(props.row) }}
                </template>
                <template v-else>
                  <p v-if="props.row.action_target">
                    {{ props.row.action_target }}
                  </p>
                  <span
                    class="text-blue link"
                    @click="
                      handleUploadDetail(
                        props.row.action_type === ACTION_TYPE.Enums.BET
                          ? props.row.wager_code
                          : props.row.transaction_code,
                        props.row.action_type
                      )
                    "
                  >
                    {{
                      props.row.action_type === ACTION_TYPE.Enums.BET ? props.row.wager_code : props.row.transaction_code
                    }}
                  </span>
                </template>
              </template>
              <span v-else-if="col.name === 'betMethod'">
                {{ historyUpdatedByName(props.row.updated_by) }}
              </span>
              <span v-else-if="col.name === 'amount'">
                {{ moneyFormat(props.row.amount, 2) }}
              </span>
              <span v-else-if="col.name === 'amountBeforeChanges'">
                {{ moneyFormat(props.row.before_balance, 2) }}
              </span>
              <span v-else-if="col.name === 'amountAfterChange'">
                {{ moneyFormat(props.row.after_balance, 2) }}
              </span>
              <span v-else>
                {{ col.value }}
              </span>
            </q-td>
          </q-tr>
        </template>
        <template #no-data>
          <div class="no-data-container">
            <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
            <span>{{ $t("tableHeader.no_data") }}</span>
          </div>
        </template>
      </q-table>
      <div v-if="historyState.pagination.totalPage" class="flex justify-end q-pa-md custom-pagination">
        <q-pagination
          v-model="historyState.pagination.page"
          :max="historyState.pagination.totalPage"
          :max-pages="5"
          :boundary-numbers="false"
          @update:model-value="handlePagination"
          direction-links
          flat
          active-design="flat"
          color="deep-grey"
          active-color="blue-8"
          icon-prev="arrow_left"
          icon-next="arrow_right"
        />
      </div>
    </q-form>
  </div>

  <DepositDetailUpload ref="depositDetailUploadRef" />
  <WithdrawalDetailUpload ref="withdrawalDetailUploadRef" />
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, toRef, watch } from "vue"
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useHistory } from "src/common/composables/useHistory"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useEnv } from "src/common/hooks/useEnv"
import {
  ACTION_TYPE,
  HISTORY_SEARCH_TYPE,
  HISTORY_UPDATED_BY_TYPE,
  REPORT_DATE_TYPES,
  WALLET_TYPE
} from "src/common/utils/constants"
import { dateformat } from "src/common/utils/dayjsUtils"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import DepositDetailUpload from "./components/DepositDetailUpload.vue"
import WithdrawalDetailUpload from "./components/WithdrawalDetailUpload.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "phone")

const { t, locale } = useI18n()

const getPromotionTitle = (promotionTitle: Record<string, string> | null | undefined) => {
  if (!promotionTitle) return ""
  return promotionTitle[locale.value] ?? promotionTitle["en"] ?? Object.values(promotionTitle)[0] ?? ""
}
const route = useRoute()
const { aiAgentStatus } = useEnv()
const { moneyFormat } = useCommon()
const { getWideLogo } = useLogo()
const { memberImg } = useSiteImg()
const { inUseWallet } = useUserInfo()
const {
  historyState,
  isLoading,
  aiBettingHistoryTabs,
  dynamicColumns,
  bettingHistoryCurrencyList,
  validBetAmount,
  winLossAmount,
  handleDateRangePick,
  initHistoryQuery,
  getHistoryList,
  getHistoryTotal,
  handlePagination,
  handleTableRequest,
  handleScroll,
  currencyName,
  handlerChangeBetHistoryTab,
  currencyHeader
} = useHistory()

const searchTabs = computed(() => [
  {
    label: t(HISTORY_SEARCH_TYPE.I18nKeys[HISTORY_SEARCH_TYPE.Enums.Deposit]),
    value: HISTORY_SEARCH_TYPE.Enums.Deposit
  },
  {
    label: t(HISTORY_SEARCH_TYPE.I18nKeys[HISTORY_SEARCH_TYPE.Enums.Withdrawal]),
    value: HISTORY_SEARCH_TYPE.Enums.Withdrawal
  },
  {
    label: t(HISTORY_SEARCH_TYPE.I18nKeys[HISTORY_SEARCH_TYPE.Enums.BetHistory]),
    value: HISTORY_SEARCH_TYPE.Enums.BetHistory
  },
  {
    label: t(HISTORY_SEARCH_TYPE.I18nKeys[HISTORY_SEARCH_TYPE.Enums.Promotion]),
    value: HISTORY_SEARCH_TYPE.Enums.Promotion
  },
  {
    label: t(HISTORY_SEARCH_TYPE.I18nKeys[HISTORY_SEARCH_TYPE.Enums.InterestRecord]),
    value: HISTORY_SEARCH_TYPE.Enums.InterestRecord
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

const menuRef = ref()
const scrollAreaRef = ref()
const datePickerShow = ref(false)
const datePickerValue = ref({ from: historyState.query.start_date, to: historyState.query.end_date })
const actionType = ACTION_TYPE
type HistoryItem = (typeof historyState.list)[number]

const walletTypeName = (walletType?: WALLET_TYPE.Enums) => {
  if (!walletType || !(walletType in WALLET_TYPE.I18nKeys)) return ""

  return t(WALLET_TYPE.I18nKeys[walletType])
}

const historyUpdatedByName = (updatedBy?: number) => {
  return updatedBy === HISTORY_UPDATED_BY_TYPE.Enums.Ai
    ? $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Ai])
    : $t(HISTORY_UPDATED_BY_TYPE.I18nKeys[HISTORY_UPDATED_BY_TYPE.Enums.Member])
}

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

const canOpenHistoryDetail = (history: HistoryItem) => {
  return [ACTION_TYPE.Enums.DEPOSIT, ACTION_TYPE.Enums.WITHDRAWAL].includes(history.action_type as ACTION_TYPE.Enums)
}

const handleHistoryTargetClick = (history: HistoryItem) => {
  if (!canOpenHistoryDetail(history)) return
  handleUploadDetail(getHistoryReferenceCode(history), history.action_type)
}

const handleSubmit = async () => {
  historyState.pagination.page = 1
  getHistoryList()
  if (historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory) {
    await getHistoryTotal()
  }
  scrollAreaRef?.value?.setScrollPosition("vertical", 0)
}

const depositDetailUploadRef = ref()
const withdrawalDetailUploadRef = ref()

const handleUploadDetail = (transCode: string | undefined, actionType: number | undefined) => {
  switch (actionType) {
    case ACTION_TYPE.Enums.DEPOSIT:
      depositDetailUploadRef.value.openDialog(transCode, true)
      break
    case ACTION_TYPE.Enums.WITHDRAWAL:
      withdrawalDetailUploadRef.value.openDialog(transCode, true)
      break
  }
}

const hideMenu = () => {
  menuRef.value.hide()
}

const handleReset = async () => {
  historyState.query.dateType = REPORT_DATE_TYPES.Enums.LastSevenDays
  historyState.query.wallet_types = []
  await nextTick()
  await getHistoryList()
}

watch(
  () => historyState.query.search_type,
  async () => {
    await nextTick()
    await handleSubmit()
  }
)

onMounted(async () => {
  if (isMobile.value) {
    // 要search type, 但不要page
    initHistoryQuery()
    historyState.query.offset = 0
    historyState.pagination.page = 1
    historyState.query.size = 15
    historyState.pagination.rowsPerPage = 15
    historyState.pagination.rowsNumber = 15
  } else {
    if (route.name !== "history") {
      route.query.search_type = String(HISTORY_SEARCH_TYPE.Enums.BetHistory)
    } else {
      historyState.query.search_type = HISTORY_SEARCH_TYPE.Enums.Deposit
    }
    historyState.query.size = 10
    historyState.pagination.rowsPerPage = 10
    historyState.pagination.rowsNumber = 10
    // 需要在最後查詢query search type，因為沒有all，並且rowsNumber改動會驅動handlePagination
    initHistoryQuery()
  }

  if (inUseWallet.value && inUseWallet.value[WALLET_TYPE.Enums.Cash]) {
    // 配置投注歷史預設的幣別
    historyState.query.currency_id = inUseWallet.value?.[WALLET_TYPE.Enums.Cash]?.currency_id ?? 0
  }

  handlerChangeBetHistoryTab()

  if (historyState.query.search_type === HISTORY_SEARCH_TYPE.Enums.BetHistory) {
    // 一開始若直接進投注頁時要打總計api
    await getHistoryTotal()
  }

  await getHistoryList()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";
@import "app/template/okbet/assets/css/button.scss";
@import "app/template/okbet/assets/css/reports.scss";

.type-tabs {
  font-family: OpenSans;
}

.pc-history-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  // height: 100%;
  border-radius: 20px;
  padding: 70px 45px 0px;
  .img-order {
    width: 262px;
    height: auto;
  }
}

.h5-type-tabs {
  width: 100%;
  border-bottom: 1px solid #e5ebf2;

  :deep(.q-tab) {
    padding: 0 0.75rem;
    min-width: 0;
    font-size: 0.75rem;
    font-family: Helvetica;
    color: #888;

    &.q-tab--active {
      color: #025be8;
      font-weight: 600;
    }
  }

  :deep(.q-tabs__content) {
    overflow-x: auto;
  }
}

.h5-history-container {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: $background-light-color;

  @include phone-width {
    margin-top: 0;
  }

  .toggle-date-picker {
    @apply border border-solid border-gray-300 rounded-lg text-base;

    @include phone-width {
      @apply mb-4;
    }

    // 使用 :deep() 來穿透 scoped 樣式，影響 q-btn-toggle 內部的 .q-btn 元件
    :deep(.q-btn) {
      @apply flex-1 text-2xl;

      @include phone-width {
        @apply text-xs;
      }
    }

    .q-btn {
      font-weight: 400;

      &.bg-primary {
        font-weight: 510;
      }
    }
  }
}

.font {
  font-family: OpenSans;
}

:deep(.date-font > .q-btn__content.text-center.col.items-center.q-anchor--skip.justify-center.row) {
  font-family: serif;
}

@media screen and (max-width: 768px) {
  :deep(.btn-submit > .q-btn__content.text-center.col.items-center.q-anchor--skip.justify-center.row) {
    font-family: Helvetica;
  }
}

:deep(.q-table > thead > tr > th),
.custom-td {
  font-family: OpenSans;
  word-break: keep-all;
  .link {
    cursor: pointer;
  }
}

:deep(.date-input-item > .text) {
  font-family: Helvetica !important;
}

.btn-submit {
  font-family: Helvetica;
}

.title,
.text,
.footer {
  font-family: Helvetica;
}

:deep(.title-section) {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.header-cell {
  display: flex;
  flex-direction: column;

  &.right {
    align-items: flex-end;
  }

  .header-value {
    font-family: Helvetica;
    font-size: 0.875rem;
    font-weight: 500;
    color: inherit;
  }

  .header-label {
    font-family: Helvetica;
    font-size: 0.625rem;
    color: #888;
    margin-top: 0.125rem;
  }
}

.query-field-wrapper {
  flex: 0 0 100%;
  display: flex;
  flex-direction: row;

  @include phone-width {
    flex-direction: column;
  }

  .query-fields {
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;

    @include phone-width {
      flex-direction: column;
    }
  }

  .query-actions {
    align-items: flex-end;
    padding-bottom: 1.25rem;
  }
}

.wallet-type-field {
  margin-right: 1rem;
  margin-bottom: 1rem;

  @include phone-width {
    margin-right: 0;
  }

  .date-picker-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .wallet-type-select {
    display: flex;
    align-items: center;
    min-width: 240px;
    padding: 0 0.875rem;
    background: #fff;
    box-shadow: 0px 0px 6px 0px #00000033;
    border: 1px solid var(--secondary-Color-8, #e8ecf8);
    border-radius: 0.5rem;

    :deep(.q-field__control) {
      min-height: unset;
      height: calc(0.625rem * 2 + 1.25rem);
    }

    :deep(.q-field__native) {
      font-size: 0.875rem;
      color: #4b5678;
      min-height: unset;
      padding: 0;
    }
  }
}

.date-picker-field {
  margin-right: 1rem;

  @include phone-width {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .date-picker-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .date-picker-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.875rem;
    cursor: pointer;
    background: #fff;
    box-shadow: 0px 0px 6px 0px #00000033;
    border: 1px solid var(--secondary-Color-8, #e8ecf8);
    border-radius: 0.5rem;

    .date-picker-text {
      font-size: 0.875rem;
      color: #4b5678;
    }

    .date-picker-icon {
      margin-left: 0.625rem;
      font-size: 1.25rem;
      color: #667085;
    }
  }
}

:deep(.q-table__container) {
  padding: 2.5rem;
  .q-table__top {
    padding: 0;
  }
}

.history-tabs {
  margin-top: 0.625rem;
  padding-left: 1rem;

  @include phone-width {
    margin-top: 1.25rem;
    padding: 0;
  }

  :deep(.q-tab) {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 0.625rem 2.34375rem;

    &.q-tab--active {
      background: #e6effd !important;
      color: #0162ec !important;
    }
  }
}

.history-currency {
  width: 12.5rem;
  height: 2.9375rem;
  background-color: #f0f1f4;
  border-radius: 6.25rem;
  padding: 0.625rem;

  @include phone-width {
    width: 7.9375rem;
    height: 1.875rem;
    padding: 0.4375rem 0.625rem;
  }

  :deep(.q-field__control) {
    height: 100%;
    min-height: unset;
  }

  :deep(.q-field__native) {
    justify-content: center;
    font-size: 1.25rem;
    line-height: 0;
    min-height: unset;

    @include phone-width {
      font-size: 0.75rem;
    }
  }

  :deep(.q-field__append) {
    height: 100%;
  }
}

.ai-total-area {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;

  @include phone-width {
    flex-direction: row;
    border-top: 1px solid #e5ebf2;
    padding: 1rem 0 0;
    margin: 1.25rem 0 0;
    gap: 1rem;
  }

  .total-item {
    width: calc(50% - 0.3125rem);
    padding: 1.0625rem 0;
    border-radius: 3.125rem;
    background-color: #025be8;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 700;

    @include phone-width {
      flex: 1;
    }

    &-title {
      color: #ffffff99;
      font-size: 0.75rem;
      margin-bottom: 0.25rem;

      @include phone-width {
        margin-bottom: 0.6875rem;
      }
    }

    &-amount {
      color: #ffffff;
      font-size: 1.25rem;
    }
  }
}
</style>
