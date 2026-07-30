<template>
  <div class="lifetime-layout q-ma-md">
    <q-card flat class="lifetime-panel" style="border: 0px !important">
      <q-card-section class="panel-section">
        <div class="panel-title">{{ $t("menu.promotion_setting") }}</div>
        <div class="panel-subtitle">{{ $t("promotion_edit_accumulation_basis") }}</div>
        <div class="basis-control-row q-mt-sm">
          <q-btn-toggle
            v-model="form.count_basis"
            size="16px"
            unelevated
            rounded
            class="accumulation-toggle"
            :options="basisOptions"
          />
          <DateTimePicker
            v-if="form.count_basis === COUNT_BASIS.Enums.CUSTOM_PERIOD"
            class="custom-period-picker"
            label=""
            :date-time-model="customPeriodDateRange"
            :on-update-date-time="onUpdateCustomPeriodDateRange"
            :with-outlined="false"
            :with-borderless="true"
            :readonly="form.mode === 'edit'"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card v-if="showSpecifiedConditionsPanel" flat class="lifetime-panel q-mt-md">
      <q-card-section class="panel-section">
        <div class="condition-settings q-mt-md bg-edit-color rounded-borders">
          <div class="settings-grid">
            <div class="settings-field condition-mode-field">
              <div class="settings-label">{{ $t("promotion_edit_specified_conditions") }}</div>
              <q-option-group
                v-model="form.depositLifetimeMode"
                type="radio"
                color="primary"
                class="condition-mode-group"
                :options="depositLifetimeModeOptions"
              />
            </div>

            <div v-if="isCashPrizeType" class="settings-field currency-field">
              <div class="settings-label settings-label-row">
                <span>{{ $t("common.currency") }}</span>
                <q-icon name="info" color="black" size="16px" class="q-ml-xs">
                  <q-tooltip
                    anchor="center right"
                    self="center left"
                    class="multiple-currency-tooltip text-body2 text-white shadow-4"
                  >
                    {{ $t("hint_multiple_currencies") }}
                  </q-tooltip>
                </q-icon>
              </div>
              <ElSelect
                :model-value="selectedCurrencies"
                multiple
                filterable
                reserve-keyword
                :placeholder="''"
                class="currency-select"
                @change="handleCurrencyChange"
              >
                <ElOption
                  v-for="option in currencyOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </ElSelect>
            </div>

            <div v-if="isCashPrizeType" class="settings-field reward-type-field">
              <div class="settings-label">{{ $t("promotion_reward_type") }}</div>
              <div class="reward-mode-options">
                <q-radio
                  v-model="form.rewardType"
                  :val="PROMOTION_REWARD_TYPE.Enums.FixedAmount"
                  :label="$t('edit_form.fixed_amount')"
                />
                <q-radio
                  v-model="form.rewardType"
                  :val="PROMOTION_REWARD_TYPE.Enums.Magnification"
                  :label="$t('promotion_edit_convert_by_ratio')"
                />
              </div>
            </div>

            <div
              v-if="form.depositLifetimeMode === DEPOSIT_LIFETIME_MODE.SpecifiedRange"
              class="settings-field eligibility-field"
            >
              <div class="settings-label">{{ $t("promotion_edit_eligibility") }}</div>
              <q-option-group
                v-model="sharedRepeatableValue"
                color="primary"
                class="eligibility-options"
                :options="repeatableOptions"
              />
            </div>
          </div>
        </div>

        <div v-if="showDepositMethodTags" class="q-mt-md deposit-method-wrapper">
          <DepositMethodTags item-button-style />
        </div>

        <div v-if="form.depositLifetimeMode === DEPOSIT_LIFETIME_MODE.SpecifiedRange" class="range-rule-banner q-mt-md">
          <q-icon name="warning_amber" size="20px" class="range-rule-icon" />
          <div class="range-rule-content">
            <div class="range-rule-title">{{ $t("promotion_hint_title") }}</div>
            <div>{{ $t("promotion_hint_one") }}</div>
            <div>{{ $t("promotion_hint_two") }}</div>
            <div>{{ $t("promotion_hint_three") }}</div>
          </div>
        </div>

        <q-card v-for="condition in activeConditions" :key="condition.id" flat class="condition-card q-mt-md">
          <q-card-section class="condition-section">
            <div class="condition-top-row">
              <div class="condition-header-main">
                <div v-if="form.depositLifetimeMode === DEPOSIT_LIFETIME_MODE.SpecifiedCount" class="count-row">
                  <span class="condition-label">{{ $t("promotion_edit_nth") }}</span>
                  <q-input
                    v-model="condition.hitCount"
                    dense
                    outlined
                    type="number"
                    min="1"
                    step="1"
                    class="header-input small-input"
                  />
                  <span class="condition-label">{{ $t("promotion_edit_times_achieved") }}</span>
                  <q-btn
                    no-caps
                    flat
                    color="primary"
                    size="sm"
                    class="apply-all-btn"
                    icon="content_copy"
                    :label="$t('promotion_edit_apply_all_tiers')"
                    @click="applyConditionToAll(condition.id)"
                  />
                </div>

                <div v-else class="range-header-layout">
                  <div class="range-row">
                    <span class="condition-label">{{ $t("account_flow_type.deposit") }}</span>
                    <q-input
                      v-model="condition.minCount"
                      dense
                      outlined
                      type="number"
                      min="1"
                      step="1"
                      class="header-input small-input"
                    />
                    <span class="condition-label">{{ $t("promotion_edit_times") }}</span>
                    <span class="condition-label">~</span>
                    <q-input
                      v-model="condition.maxCount"
                      dense
                      outlined
                      type="number"
                      min="1"
                      step="1"
                      class="header-input medium-input"
                      :placeholder="$t('promotion_edit_max_value_optional')"
                    />
                    <span class="condition-label">{{ $t("promotion_edit_times") }}</span>
                    <q-btn
                      no-caps
                      flat
                      color="primary"
                      size="sm"
                      class="apply-all-btn"
                      icon="content_copy"
                      :label="$t('promotion_edit_apply_all_tiers')"
                      @click="applyConditionToAll(condition.id)"
                    />
                  </div>
                </div>
              </div>

              <div class="condition-actions">
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  class="delete-btn"
                  :disable="activeConditions.length <= 1"
                  @click="removeCondition(condition.id)"
                />
                <q-btn
                  flat
                  round
                  dense
                  color="grey-7"
                  :icon="condition.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                  @click="condition.expanded = !condition.expanded"
                />
              </div>
            </div>

            <div v-if="condition.expanded" class="condition-body">
              <div v-if="isCashPrizeType" class="condition-table-scroll">
                <q-markup-table flat square separator="cell" class="condition-table">
                  <thead>
                    <tr>
                      <th class="table-label-column"></th>
                      <th v-for="currency in condition.currencies" :key="`${condition.id}-${currency.currency}-head`">
                        {{ currency.currency }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="table-row-label">{{ $t("edit_form.single_deposit_threshold") }}</td>
                      <td
                        v-for="currency in condition.currencies"
                        :key="`${condition.id}-${currency.currency}-condition`"
                        class="table-cell"
                      >
                        <q-input
                          v-model="currency.condition"
                          dense
                          outlined
                          type="number"
                          class="currency-cell-input"
                          @focus="clearIfZero(currency, 'condition')"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="table-row-label">
                        {{
                          form.rewardType === PROMOTION_REWARD_TYPE.Enums.FixedAmount
                            ? $t("promotion_edit_fixed_bonus_amount")
                            : $t("edit_form.magnification")
                        }}
                      </td>
                      <td
                        v-for="currency in condition.currencies"
                        :key="`${condition.id}-${currency.currency}-amount`"
                        class="table-cell"
                      >
                        <q-input
                          v-model="currency.amount"
                          dense
                          outlined
                          type="number"
                          class="currency-cell-input"
                          :suffix="form.rewardType === PROMOTION_REWARD_TYPE.Enums.Magnification ? '%' : undefined"
                          @focus="clearIfZero(currency, 'amount')"
                        />
                      </td>
                    </tr>
                    <tr v-if="form.rewardType === PROMOTION_REWARD_TYPE.Enums.Magnification">
                      <td class="table-row-label">
                        {{ $t("promotion_max_amount") }}
                      </td>
                      <td
                        v-for="currency in condition.currencies"
                        :key="`${condition.id}-${currency.currency}-limit`"
                        class="table-cell"
                      >
                        <q-input
                          v-model="currency.limit"
                          dense
                          outlined
                          type="number"
                          class="currency-cell-input"
                          :placeholder="$t('edit_form.max_input_placeholder')"
                          @focus="clearIfZero(currency, 'limit')"
                        />
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>

              <div v-else-if="condition.freeGame?.dateRange" class="free-game-grid">
                <q-select
                  :model-value="condition.freeGame.freeRoundSetting.wallet_type"
                  :options="freeRoundWalletTypeOptions"
                  emit-value
                  map-options
                  outlined
                  :label="`* ${$t('query_params.wallet_type')}`"
                  @update:model-value="(value) => handleFreeGameWalletTypeChange(condition, value)"
                />
                <q-select
                  v-model="condition.freeGame.freeRoundSetting.currency_id"
                  :options="freeGameCurrencyOptions"
                  emit-value
                  map-options
                  outlined
                  :label="`* ${$t('common.currency')}`"
                  @update:model-value="(value) => handleFreeGameCurrencyChange(condition, value)"
                />
                <q-input
                  v-model="condition.freeGame.condition"
                  outlined
                  type="number"
                  min="1"
                  :label="`* ${$t('common.deposit_threshold')}`"
                />
                <q-select
                  v-model="condition.freeGame.freeRoundSetting.product_code"
                  :options="freeGameProductOptions"
                  emit-value
                  map-options
                  outlined
                  :label="`* ${$t('table_header.product')}`"
                  @update:model-value="(value) => handleFreeGameProductChange(condition, value)"
                />
                <q-select
                  v-model="condition.freeGame.freeRoundSetting.game_code"
                  :options="getFreeGameGameOptions(condition)"
                  emit-value
                  map-options
                  outlined
                  :label="`* ${$t('table_header.game')}`"
                  :loading="isFreeGameGameLoading(condition)"
                  @update:model-value="(value) => handleFreeGameGameChange(condition, value)"
                />
                <q-select
                  v-if="condition.freeGame.freeRoundSetting.product_code === 1006"
                  v-model="condition.freeGame.freeRoundSetting.bet_per_line"
                  :options="getFreeGameBetPerLineOptions(condition)"
                  emit-value
                  map-options
                  outlined
                  :label="`* ${$t('query_params.betting_amount_per_line')}`"
                  :loading="isFreeGameBetScaleLoading(condition)"
                  :disable="isFreeGameBetScaleDisabled(condition)"
                />
                <q-select
                  v-else
                  v-model="condition.freeGame.freeRoundSetting.total_bet_amount"
                  :options="getFreeGameTotalBetOptions(condition)"
                  emit-value
                  map-options
                  outlined
                  :label="`* ${$t('table_header.total_bet_amount')}`"
                  :loading="isFreeGameBetScaleLoading(condition)"
                  :disable="isFreeGameBetScaleDisabled(condition)"
                />
                <DateTimePicker
                  class="free-game-date-picker"
                  :date-time-model="condition.freeGame.dateRange"
                  label=""
                  :input-label="t('common.distribution_time')"
                  :with-outlined="true"
                  :with-borderless="false"
                  :useTimePicker="true"
                  :on-update-date-time="(value) => handleFreeGameDateRangeChange(condition, value)"
                />
                <q-input
                  v-model="condition.freeGame.freeRoundSetting.rounds"
                  outlined
                  type="number"
                  min="1"
                  :label="`* ${$t('table_header.given_time')}`"
                  @keydown="handleFreeGameIntegerKeydown"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div class="add-condition-wrap">
          <q-btn flat outline color="primary" icon="add" class="add-condition-btn" @click="appendCondition" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref, watch } from "vue"
  import { useQuasar } from "quasar"
  import { storeToRefs } from "pinia"
  import { useI18n } from "vue-i18n"
  import { ElOption, ElSelect } from "element-plus"
  import "element-plus/es/components/select/style/css"
  import "element-plus/es/components/option/style/css"
  import { usePromotionStore } from "@/stores/promotionStore"
  import { useQueryStore } from "@/stores/queryStore"
  import { useCurrencyStore } from "@/stores/currencyStore"
  import { useSiteStore } from "@/stores/siteStore"
  import { getGatewayList } from "@/api/promotion"
  import { getCurrencyList } from "@/api/common"
  import { getFreeRoundGamesBetScales, getFreeRoundProduct } from "@/api/freeRound"
  import type * as Request from "@/api/request.type"
  import { COUNT_BASIS, CURRENCY_TYPE, PRIZE_TYPE, PROMOTION_REWARD_TYPE } from "@/utils/constants"
  import {
    getFreeRoundWalletTypeOptions,
    normalizeSelectableFreeRoundWalletType,
    normalizeSelectableFreeRoundWalletTypeWhenReady
  } from "@/utils/freeRoundWalletType"
  import DateTimePicker from "@/components/query/dateTimePicker.vue"
  import DepositMethodTags from "@/pages/Promotion/PromotionSetting/component/DepositMethodTags.vue"
  import {
    DEPOSIT_LIFETIME_MODE,
    addDepositLifetimeCondition,
    ensureDepositLifetimeState,
    getActiveDepositLifetimeConditions,
    removeDepositLifetimeCondition,
    syncDepositLifetimeCurrencies
  } from "./depositLifetime"

  type CurrencyOption = {
    label: string
    value: string
  }

  type FreeGameSelectOption<T> = {
    label: string
    value: T
  }

  type DateTimeModel = {
    from?: string
    fromHms?: string
    to?: string
    toHms?: string
  }

  type FreeGameOptionState = {
    gameOptions: FreeGameSelectOption<string>[]
    betPerLineOptions: FreeGameSelectOption<number>[]
    totalBetOptions: FreeGameSelectOption<number>[]
    gameLoading: boolean
    betScaleLoading: boolean
  }

  const defaultFreeGameOptionState: FreeGameOptionState = {
    gameOptions: [],
    betPerLineOptions: [],
    totalBetOptions: [],
    gameLoading: false,
    betScaleLoading: false
  }

  const $q = useQuasar()
  const { t } = useI18n()
  const promotionStore = usePromotionStore()
  const queryStore = useQueryStore()
  const currencyStore = useCurrencyStore()
  const siteStore = useSiteStore()
  const { promotionItem: form } = storeToRefs(promotionStore)
  const gatewayList = ref<Request.promotionGatewayItem[]>([])
  const isGatewayListReady = ref(false)
  const freeGameCurrencyOptions = ref<FreeGameSelectOption<number>[]>([])
  const freeGameOptionState = reactive<Record<string, FreeGameOptionState>>({})
  const customPeriodDateRange = reactive<{ from?: string; to?: string }>({
    from: form.value.start_date || undefined,
    to: form.value.end_date || undefined
  })

  const basisOptions = computed(() => [
    { label: t("promotion_edit_lifetime"), value: COUNT_BASIS.Enums.LIFETIME },
    { label: t("promotion_edit_custom_period"), value: COUNT_BASIS.Enums.CUSTOM_PERIOD }
  ])

  const repeatableOptions = computed(() => [
    { label: t("promotion_edit_repeatable"), value: 1 },
    { label: t("promotion_edit_non_repeatable"), value: 0 }
  ])
  const depositLifetimeModeOptions = computed(() => [
    { label: t("promotion_edit_specified_times"), value: DEPOSIT_LIFETIME_MODE.SpecifiedCount },
    { label: t("promotion_edit_specified_range"), value: DEPOSIT_LIFETIME_MODE.SpecifiedRange }
  ])
  const freeGameProductOptions = computed<FreeGameSelectOption<number>[]>(() => [
    {
      label: "PragmaticPlay",
      value: 1006
    },
    {
      label: "WOW Gaming",
      value: 1148
    }
  ])
  const freeRoundWalletTypeOptions = computed(() => getFreeRoundWalletTypeOptions(siteStore.wallet_type_list, t))
  const isCashPrizeType = computed(() => form.value.prize_type === PRIZE_TYPE.Enums.CASH)
  const isFreeGamePrizeType = computed(() => form.value.prize_type === PRIZE_TYPE.Enums.FREE_GAME)
  const showDepositMethodTags = computed(() => isCashPrizeType.value || isFreeGamePrizeType.value)

  const currencyOptions = computed<CurrencyOption[]>(() => {
    const uniqueOptions = new Map<string, CurrencyOption>()
    queryStore.currencyList.forEach((item) => {
      const code = CURRENCY_TYPE.Enums[item.value as CURRENCY_TYPE.Enums] as unknown as string
      if (code && !uniqueOptions.has(code)) {
        uniqueOptions.set(code, {
          label: code,
          value: code
        })
      }
    })
    return Array.from(uniqueOptions.values())
  })

  const selectedCurrencies = computed(() =>
    Array.from(new Set(form.value.reward.map((item) => item.currency).filter(Boolean)))
  )
  const activeConditions = computed(() => getActiveDepositLifetimeConditions(form.value))
  const selectedFreeGameCurrencyIds = computed<number[]>(() => {
    const currencyIds = activeConditions.value
      .map((condition) => Number(condition.freeGame?.freeRoundSetting.currency_id) || 0)
      .filter((currencyId) => currencyId > 0)

    return Array.from(new Set(currencyIds))
  })
  const sharedRepeatableValue = computed({
    get: () => (activeConditions.value[0]?.repeatable ? 1 : 0),
    set: (value: number) => {
      const nextRepeatable = Number(value) === 1
      activeConditions.value.forEach((condition) => {
        condition.repeatable = nextRepeatable
      })
    }
  })
  const showSpecifiedConditionsPanel = computed(
    () =>
      form.value.count_basis === COUNT_BASIS.Enums.LIFETIME ||
      form.value.count_basis === COUNT_BASIS.Enums.CUSTOM_PERIOD
  )

  watch(
    () => [
      form.value.count_basis,
      form.value.depositLifetimeMode,
      form.value.prize_type,
      selectedCurrencies.value.join("|"),
      selectedFreeGameCurrencyIds.value.join("|")
    ],
    () => {
      ensureDepositLifetimeState(form.value)
      updateFilteredGatewayList()
    },
    { immediate: true }
  )

  watch(
    () => [form.value.prize_type, activeConditions.value.map((condition) => condition.id).join("|")],
    async () => {
      if (!isFreeGamePrizeType.value) {
        return
      }

      ensureDepositLifetimeState(form.value)
      ensureFreeGameConditions()
      await Promise.all(activeConditions.value.map(initializeFreeGameConditionLists))
    }
  )

  watch(
    () => [form.value.start_date, form.value.end_date],
    ([startDate, endDate]) => {
      customPeriodDateRange.from = startDate || undefined
      customPeriodDateRange.to = endDate || undefined
    },
    { immediate: true }
  )

  watch(
    () => siteStore.wallet_type_list,
    () => {
      if (!isFreeGamePrizeType.value) {
        return
      }

      activeConditions.value.forEach((condition) => {
        const freeRoundSetting = getFreeGameSetting(condition)
        freeRoundSetting.wallet_type = normalizeSelectableFreeRoundWalletTypeWhenReady(
          freeRoundSetting.wallet_type,
          siteStore.wallet_type_list,
          siteStore.walletTypeListReady
        )
      })
    },
    { deep: true }
  )

  onMounted(async () => {
    await queryStore.getCurrencyList()
    await getFreeGameCurrencyDropdown()
    const { data } = await getGatewayList({ display: true })
    gatewayList.value = data.list || []
    isGatewayListReady.value = true
    ensureDepositLifetimeState(form.value)
    updateFilteredGatewayList()
    if (isFreeGamePrizeType.value) {
      ensureFreeGameConditions()
      await Promise.all(activeConditions.value.map(initializeFreeGameConditionLists))
    }
  })

  function getSelectedGatewayCurrencyValues(): number[] {
    if (isFreeGamePrizeType.value) {
      return selectedFreeGameCurrencyIds.value
    }

    return form.value.reward.flatMap((item) => {
      const currency = CURRENCY_TYPE.Enums[item.currency as keyof typeof CURRENCY_TYPE.Enums]
      return typeof currency === "number" ? [currency] : []
    })
  }

  function updateFilteredGatewayList() {
    const rewardCurrencyValueList = getSelectedGatewayCurrencyValues()

    if (rewardCurrencyValueList.length === 0) {
      clearGatewaySelections()
      return
    }

    if (!isGatewayListReady.value) {
      form.value.filteredGatewayList = []
      return
    }

    form.value.filteredGatewayList = gatewayList.value.filter((item) => rewardCurrencyValueList.includes(item.currency))

    const validGatewayIds = new Set(form.value.filteredGatewayList.map((item) => item.id))
    form.value.payment_gateway = (form.value.payment_gateway || []).filter((id: number) => validGatewayIds.has(id))
  }

  function clearGatewaySelections() {
    form.value.filteredGatewayList = []
    form.value.payment_gateway = []
    form.value.bankCardTags = []
    form.value.electronicWallet = []
    form.value.ExternalChannelTags = []
    form.value.cryptoWalletTags = []
    form.value.cryptoWalletThirdTags = []
  }

  function addCurrency(currency: string) {
    if (selectedCurrencies.value.includes(currency)) {
      return
    }

    form.value.reward.push({
      currency,
      condition: "",
      type: form.value.rewardType || PROMOTION_REWARD_TYPE.Enums.FixedAmount,
      amount: "",
      limit: "",
      free_round_setting: []
    })

    syncDepositLifetimeCurrencies(form.value)
    updateFilteredGatewayList()
  }

  function removeCurrency(currency: string) {
    form.value.reward = form.value.reward.filter((item) => item.currency !== currency)
    syncDepositLifetimeCurrencies(form.value)
    updateFilteredGatewayList()
  }

  function handleCurrencyChange(values: string[]) {
    const nextCurrencies = Array.from(new Set(values || []))
    const currentCurrencies = [...selectedCurrencies.value]

    currentCurrencies.filter((currency) => !nextCurrencies.includes(currency)).forEach(removeCurrency)
    nextCurrencies.filter((currency) => !currentCurrencies.includes(currency)).forEach(addCurrency)
  }

  function createFreeRoundSetting(source?: Partial<Request.FreeRoundSettingItem>): Request.FreeRoundSettingItem {
    return {
      begin_date: Number(source?.begin_date) || 0,
      end_date: Number(source?.end_date) || 0,
      bet_per_line: source?.bet_per_line || "0",
      total_bet_amount: source?.total_bet_amount || "0",
      currency_id: Number(source?.currency_id) || 0,
      game_code: source?.game_code || "",
      product_code: Number(source?.product_code) || 1006,
      remark: source?.remark || "",
      rounds: source?.rounds || "0",
      wallet_type: normalizeSelectableFreeRoundWalletTypeWhenReady(
        source?.wallet_type,
        siteStore.wallet_type_list,
        siteStore.walletTypeListReady
      )
    }
  }

  function ensureFreeGameConfig(condition: Request.DepositLifetimeCondition): Request.DepositLifetimeConditionFreeGame {
    if (!condition.freeGame) {
      condition.freeGame = {
        condition: "",
        freeRoundSetting: createFreeRoundSetting(),
        dateRange: getFreeGameDateRangeModelFromSetting(createFreeRoundSetting())
      }
    }

    condition.freeGame.freeRoundSetting = createFreeRoundSetting(condition.freeGame.freeRoundSetting)
    condition.freeGame.dateRange = getFreeGameDateRangeModelFromSetting(condition.freeGame.freeRoundSetting)
    return condition.freeGame
  }

  function getFreeGameSetting(condition: Request.DepositLifetimeCondition): Request.FreeRoundSettingItem {
    return ensureFreeGameConfig(condition).freeRoundSetting
  }

  function getFreeGameState(condition: Request.DepositLifetimeCondition): FreeGameOptionState {
    return freeGameOptionState[condition.id] || defaultFreeGameOptionState
  }

  function ensureFreeGameState(condition: Request.DepositLifetimeCondition): FreeGameOptionState {
    if (!freeGameOptionState[condition.id]) {
      freeGameOptionState[condition.id] = { ...defaultFreeGameOptionState }
    }

    return freeGameOptionState[condition.id]
  }

  async function getFreeGameCurrencyDropdown() {
    const { data } = await getCurrencyList()
    freeGameCurrencyOptions.value = Object.keys(data).map((key) => {
      const currency = data[key] as number
      return {
        value: currency,
        label: t((CURRENCY_TYPE.I18nKeys as any)[currency as keyof typeof CURRENCY_TYPE.I18nKeys] ?? key)
      }
    })
  }

  function ensureFreeGameConditions() {
    activeConditions.value.forEach((condition) => {
      ensureFreeGameConfig(condition)
      ensureFreeGameState(condition)
    })
  }

  function getDefaultFreeGameCurrencyId(): number {
    const currencyValues = freeGameCurrencyOptions.value.map((option) => option.value)
    const selectedHeaderCurrency = Number(currencyStore.currentCurrency)

    if (selectedHeaderCurrency > 0 && currencyValues.includes(selectedHeaderCurrency)) {
      return selectedHeaderCurrency
    }

    return currencyValues[0] || 0
  }

  async function applyDefaultFreeGameCurrency(condition: Request.DepositLifetimeCondition): Promise<boolean> {
    if (form.value.mode === "edit") {
      return false
    }

    const freeRoundSetting = getFreeGameSetting(condition)
    if (freeRoundSetting.currency_id) {
      return false
    }

    const currencyId = getDefaultFreeGameCurrencyId()
    if (!currencyId) {
      return false
    }

    await handleFreeGameCurrencyChange(condition, currencyId)
    return true
  }

  async function initializeFreeGameConditionLists(condition: Request.DepositLifetimeCondition): Promise<void> {
    const appliedDefault = await applyDefaultFreeGameCurrency(condition)
    if (appliedDefault) {
      return
    }

    await loadFreeGameConditionLists(condition)
  }

  async function handleFreeGameWalletTypeChange(condition: Request.DepositLifetimeCondition, walletType: number) {
    const freeRoundSetting = getFreeGameSetting(condition)
    freeRoundSetting.wallet_type = normalizeSelectableFreeRoundWalletType(walletType, siteStore.wallet_type_list)
    resetFreeGameBetScales(condition)
    await loadFreeGameBetScales(condition)
  }

  async function handleFreeGameCurrencyChange(condition: Request.DepositLifetimeCondition, currencyId: number) {
    const freeRoundSetting = getFreeGameSetting(condition)
    freeRoundSetting.currency_id = currencyId
    freeRoundSetting.game_code = ""
    freeRoundSetting.bet_per_line = "0"
    freeRoundSetting.total_bet_amount = "0"
    resetFreeGameBetScales(condition)
    updateFilteredGatewayList()
    await loadFreeGameGames(condition)
  }

  async function handleFreeGameProductChange(condition: Request.DepositLifetimeCondition, productCode: number) {
    const freeRoundSetting = getFreeGameSetting(condition)
    freeRoundSetting.product_code = productCode
    freeRoundSetting.game_code = ""
    freeRoundSetting.bet_per_line = "0"
    freeRoundSetting.total_bet_amount = "0"
    resetFreeGameBetScales(condition)
    await loadFreeGameGames(condition)
  }

  async function handleFreeGameGameChange(condition: Request.DepositLifetimeCondition, gameCode: string) {
    const freeRoundSetting = getFreeGameSetting(condition)
    freeRoundSetting.game_code = gameCode
    freeRoundSetting.bet_per_line = "0"
    freeRoundSetting.total_bet_amount = "0"
    await loadFreeGameBetScales(condition)
  }

  async function loadFreeGameConditionLists(condition: Request.DepositLifetimeCondition) {
    await loadFreeGameGames(condition)
    await loadFreeGameBetScales(condition)
  }

  async function loadFreeGameGames(condition: Request.DepositLifetimeCondition) {
    const freeRoundSetting = getFreeGameSetting(condition)
    const state = ensureFreeGameState(condition)

    if (!freeRoundSetting.currency_id || !freeRoundSetting.product_code) {
      state.gameOptions = []
      return
    }

    state.gameLoading = true
    try {
      const response = await getFreeRoundProduct(freeRoundSetting.currency_id, freeRoundSetting.product_code)
      const selectedProduct = response?.data?.products?.find(
        (item: { product_code: number }) => item.product_code === freeRoundSetting.product_code
      )
      state.gameOptions = (selectedProduct?.game_list || []).map((item: { game_name: string; game_code: string }) => ({
        label: item.game_name,
        value: item.game_code
      }))
    } catch (error) {
      $q.notify({
        type: "negative",
        message: error instanceof Error ? error.message : "Failed to load free round game options",
        position: "top",
        timeout: 1000
      })
      throw error
    } finally {
      state.gameLoading = false
    }
  }

  async function loadFreeGameBetScales(condition: Request.DepositLifetimeCondition) {
    const freeRoundSetting = getFreeGameSetting(condition)
    const state = ensureFreeGameState(condition)

    if (
      !freeRoundSetting.currency_id ||
      !freeRoundSetting.product_code ||
      !freeRoundSetting.game_code ||
      !freeRoundSetting.wallet_type
    ) {
      state.betPerLineOptions = []
      state.totalBetOptions = []
      return
    }

    state.betScaleLoading = true
    try {
      const response = await getFreeRoundGamesBetScales({
        currency_id: freeRoundSetting.currency_id,
        product_code: freeRoundSetting.product_code,
        game_code: freeRoundSetting.game_code,
        wallet_type: normalizeSelectableFreeRoundWalletTypeWhenReady(
          freeRoundSetting.wallet_type,
          siteStore.wallet_type_list,
          siteStore.walletTypeListReady
        )
      })

      state.betPerLineOptions = (response?.data?.betPerLineScales || []).map((item: number) => ({
        label: item.toString(),
        value: item
      }))
      state.totalBetOptions = (response?.data?.totalBetScales || []).map((item: number) => ({
        label: item.toString(),
        value: item
      }))
    } catch (error) {
      $q.notify({
        type: "negative",
        message: error instanceof Error ? error.message : "Failed to load free round betting options",
        position: "top",
        timeout: 1000
      })
      throw error
    } finally {
      state.betScaleLoading = false
    }
  }

  function resetFreeGameBetScales(condition: Request.DepositLifetimeCondition) {
    const state = ensureFreeGameState(condition)
    state.betPerLineOptions = []
    state.totalBetOptions = []
  }

  function getFreeGameGameOptions(condition: Request.DepositLifetimeCondition) {
    return getFreeGameState(condition).gameOptions
  }

  function getFreeGameBetPerLineOptions(condition: Request.DepositLifetimeCondition) {
    return getFreeGameState(condition).betPerLineOptions
  }

  function getFreeGameTotalBetOptions(condition: Request.DepositLifetimeCondition) {
    return getFreeGameState(condition).totalBetOptions
  }

  function isFreeGameGameLoading(condition: Request.DepositLifetimeCondition) {
    return getFreeGameState(condition).gameLoading
  }

  function isFreeGameBetScaleLoading(condition: Request.DepositLifetimeCondition) {
    return getFreeGameState(condition).betScaleLoading
  }

  function isFreeGameBetScaleDisabled(condition: Request.DepositLifetimeCondition) {
    const freeRoundSetting = condition.freeGame?.freeRoundSetting
    if (!freeRoundSetting) {
      return true
    }

    return (
      !freeRoundSetting.currency_id ||
      !freeRoundSetting.product_code ||
      !freeRoundSetting.game_code ||
      !freeRoundSetting.wallet_type
    )
  }

  function getDateTimeModelFromTimestamp(timestampValue: number | string | undefined): DateTimeModel {
    const timestamp = Number(timestampValue) || 0
    if (!timestamp) {
      return {
        from: "",
        fromHms: "00:00:00",
        to: "",
        toHms: "23:59:59"
      }
    }

    const date = new Date(timestamp * 1000)
    const from = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-")
    const fromHms = [
      String(date.getHours()).padStart(2, "0"),
      String(date.getMinutes()).padStart(2, "0"),
      String(date.getSeconds()).padStart(2, "0")
    ].join(":")

    return {
      from,
      fromHms,
      to: from,
      toHms: fromHms
    }
  }

  function getFreeGameDateRangeModelFromSetting(freeRoundSetting: Request.FreeRoundSettingItem): DateTimeModel {
    const beginDate = getDateTimeModelFromTimestamp(freeRoundSetting.begin_date)
    const endDate = getDateTimeModelFromTimestamp(freeRoundSetting.end_date)

    return {
      from: beginDate.from,
      fromHms: beginDate.fromHms,
      to: endDate.from,
      toHms: endDate.fromHms || "23:59:59"
    }
  }

  function toUnixSeconds(date?: string, hms?: string) {
    if (!date) {
      return 0
    }

    const timestamp = Math.floor(new Date(`${date} ${hms || "00:00:00"}`).getTime() / 1000)
    return Number.isNaN(timestamp) ? 0 : timestamp
  }

  function handleFreeGameDateRangeChange(condition: Request.DepositLifetimeCondition, value: DateTimeModel) {
    const freeRoundSetting = getFreeGameSetting(condition)
    freeRoundSetting.begin_date = toUnixSeconds(value.from, value.fromHms)
    freeRoundSetting.end_date = toUnixSeconds(value.to, value.toHms || "23:59:59")
    ensureFreeGameConfig(condition).dateRange = {
      from: value.from,
      fromHms: value.fromHms,
      to: value.to,
      toHms: value.toHms
    }
  }

  function handleFreeGameIntegerKeydown(event: KeyboardEvent) {
    if (event.key === "-" || event.key === ".") {
      event.preventDefault()
    }
  }

  async function appendCondition() {
    addDepositLifetimeCondition(form.value, form.value.depositLifetimeMode || DEPOSIT_LIFETIME_MODE.SpecifiedCount)
    if (isFreeGamePrizeType.value) {
      ensureFreeGameConditions()
      const newCondition = activeConditions.value[activeConditions.value.length - 1]
      if (newCondition) {
        await initializeFreeGameConditionLists(newCondition)
      }
    }
  }

  function removeCondition(id: string) {
    removeDepositLifetimeCondition(
      form.value,
      form.value.depositLifetimeMode || DEPOSIT_LIFETIME_MODE.SpecifiedCount,
      id
    )
    delete freeGameOptionState[id]
  }

  function applyConditionToAll(sourceId: string) {
    const sourceCondition = activeConditions.value.find((condition) => condition.id === sourceId)
    if (!sourceCondition) {
      return
    }

    activeConditions.value.forEach((condition) => {
      if (condition.id === sourceId) {
        return
      }

      condition.currencies = condition.currencies.map((currency) => {
        const sourceCurrency = sourceCondition.currencies.find((item) => item.currency === currency.currency)
        return {
          ...currency,
          condition: sourceCurrency?.condition ?? "",
          amount: sourceCurrency?.amount ?? "",
          limit: sourceCurrency?.limit ?? ""
        }
      })

      if (form.value.depositLifetimeMode === DEPOSIT_LIFETIME_MODE.SpecifiedRange) {
        condition.repeatable = sourceCondition.repeatable ?? true
      }

      if (isFreeGamePrizeType.value) {
        const sourceFreeGame = ensureFreeGameConfig(sourceCondition)
        condition.freeGame = {
          condition: sourceFreeGame.condition,
          freeRoundSetting: createFreeRoundSetting(sourceFreeGame.freeRoundSetting),
          dateRange: {
            ...sourceFreeGame.dateRange
          }
        }
        void loadFreeGameConditionLists(condition)
      }
    })
  }

  function clearIfZero(
    item: { condition: number | string; amount: number | string; limit?: number | string },
    field: "condition" | "amount" | "limit"
  ) {
    if (Number(item[field]) <= 0) {
      item[field] = ""
    }
  }

  function onUpdateCustomPeriodDateRange(newValue: { from?: string; to?: string }) {
    if (!newValue) {
      customPeriodDateRange.from = undefined
      customPeriodDateRange.to = undefined
      form.value.start_date = ""
      form.value.end_date = ""
      return
    }

    customPeriodDateRange.from = newValue.from
    customPeriodDateRange.to = newValue.to
    form.value.start_date = newValue.from || ""
    form.value.end_date = newValue.to || ""
  }
</script>

<style lang="scss" scoped>
  .lifetime-layout {
    line-height: normal !important;

    .lifetime-panel {
      border-radius: 14px;
      background: #fff;
      box-shadow: none;
    }

    .panel-section {
      padding: 0px;
    }

    .panel-title {
      font-size: 18px;
      font-weight: 700;
      color: #535252;
    }

    .panel-subtitle {
      font-size: 14px;
      font-weight: 400;
      color: #000000;
    }

    .basis-control-row {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .accumulation-toggle {
      padding: 4px;
      border-radius: 9999px;
      background: #f0f2f5;

      :deep(.q-btn-group) {
        gap: 4px;
      }

      :deep(.q-btn-item) {
        min-height: 40px;
        padding: 0 14px;
        border: 0;
        border-radius: 9999px !important;
        background: transparent;
        color: var(--neutral-07, #858585);
        text-transform: none;
        box-shadow: none;
      }

      :deep(.q-btn-item .block) {
        font-weight: 400;
      }

      :deep(.q-btn-item.bg-primary),
      :deep(.q-btn-item.q-btn--active),
      :deep(.q-btn-item.q-btn--active.bg-primary) {
        background: var(--primary-05, #086eff) !important;
        background-color: var(--primary-05, #086eff) !important;
        color: #fff !important;
        box-shadow: 0px 0px 4px 0px var(--primary05, rgba(8, 110, 255, 1)) !important;
      }

      :deep(.q-btn-item.bg-primary .block),
      :deep(.q-btn-item.q-btn--active .block) {
        color: #fff !important;
        font-weight: 500;
      }
    }

    .custom-period-picker {
      min-width: 320px;
      max-width: 420px;
      flex: 1 1 320px;
      border: 1px solid #d6deef;
      border-radius: 8px;
      padding: 0 12px;
      background: #fff;
    }

    .custom-period-picker :deep(p) {
      display: none;
    }

    .custom-period-picker :deep(.q-field__control) {
      padding: 0;
      box-shadow: none;
    }

    .condition-settings {
      border-radius: 14px;
      background: #fcf8ff;
      padding: 18px 20px;
    }

    .condition-mode-group {
      :deep(.q-option-group) {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      :deep(.q-radio) {
        min-height: 24px;
      }

      :deep(.q-radio__label) {
        font-size: 14px;
        font-weight: 600;
        color: #556072;
      }
    }

    .range-rule-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      border-radius: 10px;
      border: 1px solid #e4c878;
      background: rgba(255, 227, 143, 0.16);
      color: #c49a2c;
      font-size: 13px;
      line-height: 1.6;
      padding: 12px 16px;
    }

    .range-rule-icon {
      flex: 0 0 auto;
      color: #d2a63f;
      margin-top: 1px;
    }

    .range-rule-content {
      flex: 1;
    }

    .range-rule-title {
      font-weight: 700;
      margin-bottom: 4px;
    }

    .settings-grid {
      display: grid;
      grid-template-columns:
        minmax(120px, max-content)
        minmax(260px, 360px)
        minmax(140px, max-content)
        minmax(160px, max-content);
      gap: 16px 24px;
      align-items: start;
    }

    .settings-field {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .condition-mode-field {
      min-width: 120px;
    }

    .currency-field {
      min-width: 260px;
    }

    .reward-type-field {
      min-width: 140px;
    }

    .eligibility-field {
      min-width: 160px;
    }

    .settings-label,
    .condition-label {
      font-size: 14px;
      font-weight: 600;
      color: #556072;
    }

    .settings-label-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .currency-select {
      width: 100%;
      max-width: 360px;
    }

    .currency-select :deep(.el-select__wrapper) {
      min-height: 40px;
      border-radius: 4px;
      box-shadow: none;
    }

    .currency-select :deep(.el-select__placeholder) {
      color: #9ca3af;
    }

    .reward-mode-options {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      min-height: 40px;
    }

    .reward-mode-options :deep(.q-radio__label) {
      font-size: 14px;
      color: #556072;
    }

    .eligibility-options {
      :deep(.q-option-group) {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      :deep(.q-radio__label) {
        font-size: 14px;
        color: #556072;
      }
    }

    .deposit-method-wrapper {
      background-color: #fff !important;
      border-radius: 14px;

      :deep(.activity-info) {
        background-color: #fff !important;
      }
    }

    .condition-card {
      border-radius: 14px;
      background: #eff7ff;
      overflow: hidden;
    }

    .condition-section {
      padding: 0;
    }

    .condition-top-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      padding: 16px 18px;
      background: #eff7ff;
    }

    .condition-header-main {
      flex: 1;
      min-width: 320px;
    }

    .count-row,
    .range-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .range-header-layout {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      flex-wrap: wrap;
    }

    .condition-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: auto;
    }

    .apply-all-btn {
      padding: 0 6px;
      font-size: 14px;
      min-height: 28px;
    }

    .delete-btn {
      color: #ef4444 !important;
    }

    .header-input {
      background: #fff;
      border-radius: 8px;
    }

    .small-input {
      width: 72px;
    }

    .medium-input {
      width: 170px;
    }

    .condition-body {
      padding: 16px 18px 18px;
      background: #eff7ff;
    }

    .condition-table-scroll {
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      border-radius: 4px;
    }

    .condition-table {
      background: transparent;
      border-radius: 12px;
      overflow: visible;
      min-width: 100%;
      width: max-content;

      thead {
        background: #dbeeff;
      }

      th,
      td {
        padding: 12px;
        border-left: 0px;
      }

      th {
        font-size: 14px;
        font-weight: 700;
        color: #435269;
        text-align: center;
      }
    }

    :deep(.condition-table.q-table--horizontal-separator thead th),
    :deep(.condition-table.q-table--cell-separator thead th),
    :deep(.condition-table.q-table--cell-separator tbody tr:not(:last-child) > td) {
      border-bottom: 1px solid #f0f2f5 !important;
    }

    .table-label-column {
      width: 180px;
      min-width: 180px;
      background: #dbeeff;
    }

    .table-row-label {
      font-size: 14px;
      font-weight: 600;
      color: #556072;
      background: #fff;
      white-space: nowrap;
    }

    .table-cell {
      min-width: 170px;
      background: #fff;
    }

    .currency-cell-input {
      background: #fff;
    }

    .free-game-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(180px, 1fr));
      gap: 16px 18px;
      padding: 12px;
      border-radius: 4px;
      background: #fff;
    }

    .free-game-date-picker {
      width: 100%;

      :deep(p) {
        display: none;
      }

      :deep(.q-field__control) {
        min-height: 56px;
        height: 56px;
      }

      :deep(.q-field__marginal) {
        height: 56px;
      }

      :deep(.q-field__label),
      :deep(.q-field--float .q-field__label) {
        top: 9px;
        transform: none;
        font-size: 12px;
        line-height: 18px;
      }

      :deep(.q-field__native) {
        font-size: 11px;
        line-height: 16px;
        padding-top: 18px;
      }
    }

    .add-condition-wrap {
      display: flex;
      justify-content: center;
      padding-top: 16px;
    }

    .add-condition-btn {
      width: 36px;
      height: 36px;
      min-height: 36px;
      background: #fff;
    }

    @media (max-width: 960px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }

      .reward-type-field {
        min-width: 0;
      }

      .table-label-column,
      .table-row-label,
      .table-cell {
        min-width: 120px;
      }

      .free-game-grid {
        grid-template-columns: 1fr;
      }
    }
  }
</style>

<style lang="scss">
  .multiple-currency-tooltip {
    background: #00000099 !important;
    border-radius: 8px;
    padding: 8px 12px;
  }
</style>
