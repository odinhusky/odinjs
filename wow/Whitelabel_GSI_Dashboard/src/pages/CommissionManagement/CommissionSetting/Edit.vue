<template>
  <div class="q-pa-md" style="padding-top: 0">
    <q-card class="editWrapper_v2 bg-white">
      <q-form>
        <q-card-section class="q-pt-lg">
          <div class="bold h1-bold text-center grey">{{ $t("edit_form.edit_commission_group") }}</div>
        </q-card-section>
        <q-card-section>
          <AiLanguage class="w-full justify-end mb-4" @applyLanguage="applyLanguage" />

          <div class="row col-12 col-sm languageTabsWrapper">
            <div class="col-12">
              <q-tabs
                v-model="language.current"
                dense
                class="bg-transparent text-grey-8"
                active-color="main-color"
                content-class="languageTab"
                outside-arrows
              >
                <q-tab
                  v-for="(lang, key) in language.list"
                  :key="key"
                  :name="lang.value"
                  :label="lang.label"
                  class="q-px-none q-mr-md"
                  content-class="languageTabItem"
                />
              </q-tabs>

              <q-tab-panels v-model="language.current" animated swipeable>
                <q-tab-panel
                  v-for="(lang, key) in language.list"
                  :key="key"
                  :name="lang.value"
                  :label="lang.label"
                  class="q-px-none"
                >
                  <div class="text-h6 max-w">
                    <q-input
                      v-model.trim="formData.titles[lang.label as keyof typeof formData.titles]"
                      outlined
                      dense
                      hide-bottom-space
                      outline
                      borderless
                      :placeholder="$t('common.please_enter_content')"
                      class="bg-white"
                    />
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-sm edit_area_style1">
            <!-- 結算週期 -->
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("table_header.settle_cycle") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey">
                <q-option-group v-model="formData.period_type" color="primary" :options="settlementCycleList">
                  <!-- 日結算 -->
                  <template v-slot:label-0="opt">
                    <div class="row items-center" style="min-width: 15rem">
                      <div>{{ opt.label }}</div>
                      <div class="col q-ml-xs">00:00 - 23:59</div>
                    </div>
                  </template>

                  <!-- 週結算 -->
                  <template v-slot:label-1="opt">
                    <div class="row items-center text-left" style="min-width: 15rem">
                      <div>{{ opt.label }}</div>
                      <div class="col row items-center q-ml-xs">
                        {{ $t("common.every_week") }}
                        <q-select
                          v-model="cycleSettings.week"
                          :options="dropdownData.weeks"
                          outlined
                          dense
                          emit-value
                          map-options
                          color="primary"
                          class="q-ml-sm default-input-sm"
                        >
                          <template #selected>
                            {{
                              dropdownData.weeks.filter((item) => item.value === cycleSettings.week)[0]
                                ? $t(dropdownData.weeks.filter((item) => item.value === cycleSettings.week)[0].label)
                                : ""
                            }}
                          </template>
                          <template #option="{ itemProps, opt, selected, toggleOption }">
                            <q-item v-bind="itemProps">
                              <q-item-section>
                                <q-item-label>{{ $t(opt.label) }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </div>
                    </div>
                  </template>
                  <!-- 季結算 -->
                  <template v-slot:label-3="opt">
                    <div class="row items-center text-left" style="min-width: 15rem">
                      <div>{{ opt.label }}</div>
                      <div class="col row items-center q-ml-xs">
                        {{ $t("common.every_season_tip") }}
                        <q-select
                          v-model="cycleSettings.season"
                          :options="dropdownData.months"
                          outlined
                          dense
                          emit-value
                          map-options
                          color="primary"
                          class="q-mx-sm"
                        />
                        {{ $t("common.day") }}
                      </div>
                    </div>
                  </template>

                  <!-- 半年結算 -->
                  <template v-slot:label-4="opt">
                    <div class="row items-center text-left" style="min-width: 15rem">
                      <div>{{ opt.label }}</div>
                      <div class="col row items-center q-ml-xl">
                        {{ $t("common.every_half_tip") }}
                        <q-select
                          v-model="cycleSettings.halfYear"
                          :options="dropdownData.months"
                          outlined
                          dense
                          emit-value
                          map-options
                          color="primary"
                          class="q-mx-sm"
                        />
                        {{ $t("common.day") }}
                      </div>
                    </div>
                  </template>
                </q-option-group>
              </q-card-actions>
            </q-card>
            <!-- 結算週期 -->
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("common.effective_time") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey">
                <DateTimePicker
                  :date-time-model="dateTimeSelector"
                  :use-time-picker="false"
                  :on-update-date-time="onUpdateDateTime"
                  :label="''"
                  :outlined="true"
                  style="width: 98%"
                  class="bg-white"
                />
              </q-card-actions>
            </q-card>
            <!-- 派發方式 -->
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("table_header.reward_type") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey">
                <q-option-group v-model="formData.dispatch_type" color="primary" :options="sendTypeList">
                </q-option-group>
              </q-card-actions>
            </q-card>

            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("edit_form.bonus_type") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey">
                <q-select
                  v-model="formData.wallet_type"
                  :options="bounsDropdownList"
                  class="default-input bg-white"
                  outlined
                  dense
                  emit-value
                  map-options
                  style="max-width: 18.75rem"
                />
              </q-card-actions>
            </q-card>
            <!-- 稽核倍數 -->
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("edit_form.audit_multiple") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey">
                <div class="row items-center no-wrap audit-multiple-container">
                  <q-btn size="md" square flat @click="subStep" class="q-left">-</q-btn>
                  <q-number
                    v-model="formData.audit_rate"
                    :options="generalOptions"
                    borderless
                    class="default-input audit-multiple"
                  />
                  <q-btn size="md" square flat @click="addStep" class="q-right">+</q-btn>
                </div>
              </q-card-actions>
            </q-card>
            <!-- 盈虧 -->
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("table_header.reward_type") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey">
                <q-option-group
                  v-model="formData.calculate_type"
                  color="primary"
                  :options="[
                    { label: $t(CALCULATE_TYPE.I18nKeys[CALCULATE_TYPE.Enums.ValidBet]), value: 1 },
                    { label: $t(CALCULATE_TYPE.I18nKeys[CALCULATE_TYPE.Enums.WinLose]), value: 2 },
                    { label: $t(CALCULATE_TYPE.I18nKeys[CALCULATE_TYPE.Enums.NetGamingRevenue]), value: 3 }
                  ]"
                >
                </q-option-group>
              </q-card-actions>
            </q-card>

            <q-card class="col-4 bg-transparent q-pt-md q-mb-md" v-if="isLoading">
              <div>
                <p class="h7-bold">{{ $t("common.distribute_membership_levels") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey">
                <MemberLevelTags
                  :parent-value="formData.level_ids"
                  @update:parentValue="handelMemberLevelTags"
                  :is-column="true"
                />
              </q-card-actions>
            </q-card>
            <q-card class="col-4 bg-transparent q-pt-md" v-if="isLoading">
              <div>
                <p class="h7-bold">{{ $t("common.block_send_tag") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey">
                <memberTagOption :parent-value="formData.label_ids" @update:labelValue="handelMergeTags" />
              </q-card-actions>
            </q-card>
          </div>
        </q-card-section>

        <q-card-section class="padding-top: 0px;">
          <!-- 派發門檻（有效投注） -->
          <div class="h4-bold bold grey q-mb-sm">{{ distributionThresholdText }}</div>
          <q-table
            v-if="formatTableData.distributionThresholdList"
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :columns="formatTableColumn"
            :rows="formatTableData.distributionThresholdList.slice(0, 1)"
            row-key="id"
            class="table_v2"
          >
            <template v-slot:body="props">
              <q-tr :key="props.row.currency_id">
                <q-td v-for="col in formatTableData.distributionThresholdList" :key="col.currency_name">
                  <q-input
                    type="number"
                    v-model.number="col.threshold"
                    class="col-6 default-input"
                    outlined
                    stack-label
                    input-class="text-right"
                    :min="0"
                  >
                  </q-input>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <!-- 單次結算派發上限 -->
          <div class="h4-bold bold grey q-mb-sm q-mt-md">
            {{ $t("edit_form.single_settlement_distribution_limit") }}
          </div>
          <q-table
            v-if="formatTableData.dispatchAmountLimitList"
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :columns="formatTableColumn"
            :rows="formatTableData.dispatchAmountLimitList.slice(0, 1)"
            row-key="id"
            class="table_v2"
          >
            <template v-slot:body="props">
              <q-tr :key="props.row.id">
                <q-td v-for="col in formatTableData.dispatchAmountLimitList" :key="col.currency_name">
                  <q-input
                    type="number"
                    v-model.number="col.amount"
                    class="col-6 default-input"
                    outlined
                    stack-label
                    input-class="text-right"
                    :min="0"
                  >
                  </q-input>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>

        <q-card-section class="padding-top: 0px;">
          <div class="text-h6 text-bold title">{{ $t("edit_form.commission_ratio_setting") }}</div>
          <div class="rebet_tool_group row">
            <!-- 左邊卡片 -->
            <div class="col-12 col-md-6 q-col-gutter-md q-pa-md row items-end">
              <!-- 左側文字 + 下拉 -->
              <div class="col-6 col-md-5 column">
                <div class="bold h5-bold q-mb-xs">{{ $t("edit_form.set_by_category") }}</div>
                <q-select
                  v-model="selectedGameType"
                  :options="filteredGameTypeDropdownList"
                  outlined
                  dense
                  map-options
                  emit-value
                  class="default-input"
                />
              </div>

              <!-- 中間加減框 -->
              <div class="col-3 col-md-4 flex items-end justify-center">
                <div class="row items-center no-wrap audit-multiple-container full-width">
                  <q-btn size="md" square flat @click="categorySubStep('categoryPercent')" class="q-left">-</q-btn>
                  <q-number
                    v-model="categoryPercent"
                    :options="generalOptions"
                    borderless
                    class="default-input audit-multiple"
                  >
                    <template v-slot:append> % </template>
                  </q-number>
                  <q-btn size="md" square flat @click="categoryAddStep('categoryPercent')" class="q-right">+</q-btn>
                </div>
              </div>

              <!-- 右側按鈕 -->
              <div class="col-3 col-md-3 flex items-end">
                <q-btn color="primary" class="full-width" style="height: 40px" @click="onSettingCategory">
                  {{ $t("btn.settings") }}</q-btn
                >
              </div>
            </div>

            <!-- 右邊卡片 (同樣邏輯) -->
            <div class="col-12 col-md-6 q-col-gutter-md q-pa-md row items-end" v-if="currencyDropdownList.length > 0">
              <div class="col-6 col-md-5 column">
                <div class="bold h5-bold q-mb-xs">{{ $t("edit_form.set_by_currency") }}</div>
                <q-select
                  v-model="selectedSetCurrency"
                  :options="currencyDropdownList"
                  outlined
                  dense
                  map-options
                  emit-value
                  class="default-input"
                />
              </div>

              <div class="col-3 col-md-4 flex items-end justify-center">
                <div class="row items-center no-wrap audit-multiple-container full-width">
                  <q-btn size="md" square flat @click="categorySubStep('categoryCurrency')" class="q-left">-</q-btn>
                  <q-number
                    v-model="categoryCurrency"
                    :options="generalOptions"
                    borderless
                    class="default-input audit-multiple"
                  >
                    <template v-slot:append> % </template>
                  </q-number>
                  <q-btn size="md" square flat @click="categoryAddStep('categoryCurrency')" class="q-right">+</q-btn>
                </div>
              </div>

              <div class="col-3 col-md-3 flex items-end">
                <q-btn color="primary" class="full-width" style="height: 40px" @click="onSettingCurrency">
                  {{ $t("btn.settings") }}</q-btn
                >
              </div>
            </div>
          </div>
          <div class="row col-12 col-sm languageTabsWrapper q-mt-md">
            <div class="col-12">
              <q-tabs
                v-model="filteredGameType.current"
                dense
                class="bg-transparent text-grey-8"
                active-color="main-color"
                content-class="languageTab"
                outside-arrows
              >
                <q-tab
                  v-for="item in filteredGameType.list"
                  :key="item.value"
                  :name="item.value"
                  :label="item.label"
                  class="q-px-none q-mr-md"
                  content-class="languageTabItem"
                />
              </q-tabs>

              <q-tab-panels v-model="filteredGameType.current" animated swipeable>
                <q-tab-panel
                  v-for="item in filteredGameType.list"
                  :name="item.value"
                  :value="item.value"
                  :label="item.value"
                  class="q-px-none"
                >
                  <q-table
                    v-if="isLoading"
                    :rows="formatTableData.rebateRateConfigList[Number(filteredGameType.current) - 1].result"
                    :columns="formatGameTableColumn"
                    row-key="id"
                    hide-pagination
                    flat
                    :pagination="{
                      rowsPerPage: 100,
                      page: 1
                    }"
                  >
                    <template v-slot:body="props">
                      <q-tr>
                        <q-td key="provider_name">
                          {{ props.row.product_name }}
                        </q-td>
                        <q-td v-for="(col, idx) in formatGameTableColumn.length - 1" :key="props.row.currencyRate[idx]">
                          <q-input
                            type="number"
                            v-model.number="props.row.currencyRate[idx].rate"
                            class="col-6 default-input per-size"
                            input-class="text-right"
                            outlined
                            stack-label
                            :min="0"
                            v-if="props.row.currencyRate[idx].product_code !== -1"
                          >
                            <template v-slot:append> % </template>
                          </q-input>

                          <q-input
                            type="number"
                            v-model.number="props.row.currencyRate[idx].rate"
                            class="col-6"
                            style="visibility: hidden"
                            v-else
                          >
                          </q-input>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>

          <div></div>
        </q-card-section>
        <q-card-actions class="q-py-md" align="center">
          <q-btn color="main-color" outline @click="onCancel" class="edit_btns">{{ $t("btn.cancel") }}</q-btn>
          <q-btn class="q-ml-md edit_btns" color="main-color" @click="onSubmit" :loading="submitLoading">{{
            $t("btn.check")
          }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed, watch } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import type { CustomColumn } from "quasar"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useSearch } from "@/hook/useSearch"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { getCommssionSettingSingleList, updateCommssionSetting } from "@/api/commissionManagement"

  import { getProductDropdown } from "@/api/product"
  import { GAME_TYPE, SETTLEMENT_CYCLE, SEND_TYPE, BONUS_WALLET_TYPE, CALCULATE_TYPE } from "@/utils/constants"
  import { genEnumToDropdown } from "@/stores/queryStore"
  import { Enums } from "@/utils/constants/gameType"
  import memberTagOption from "@/components/forms/memberTagOption.vue"

  import MemberLevelTags from "./component/MemberLevelTags.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useRfc3339 } from "@/composables/useRfc3339"
  import { useDecimal } from "@/hook/useDecimal"
  import { useSiteStore } from "@/stores/siteStore"
  import { useTimeZoneStore } from "@/stores/timezoneStore"
  import { getCurrencyList } from "@/api/common"
  import DateTimePicker from "@/components/query/dateTimePicker.vue"
  import type { GetCommissionSettingList as CommissionSettingRequest } from "@/api/request.type"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"

  const { preciseAdd, preciseSubtract } = useDecimal()
  const { walletSwitch } = useWalletBouns()

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const siteStore = useSiteStore()
  const timezoneStore = useTimeZoneStore()
  const { format } = useRfc3339()
  const categoryPercent = ref(0)
  const categoryCurrency = ref(0)
  const selectedGameType = ref(1)
  const selectedSetCurrency = ref(0)
  const $q = useQuasar()
  const isLoading = ref(false)
  const submitLoading = ref(false)
  const auditMultipleStep = 0.5
  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2"
  }
  type CommissionTitleMap = Record<string, string>
  type CommissionFormData = Omit<
    CommissionSettingRequest,
    "titles" | "dispatch_threshold" | "dispatch_amount_limit"
  > & {
    titles: CommissionTitleMap
    dispatch_threshold: { currency_id: number | string; threshold: number | string }[]
    dispatch_amount_limit: { currency_id: number | string; amount: number | string }[]
  }
  const form = reactive<CommissionFormData[]>([
    {
      id: 0,
      titles: {},
      period_type: 0,
      audit_rate: 0,
      dispatch_type: 0,
      days_of_week: 0,
      dispatch_threshold: [],
      dispatch_amount_limit: [],
      level_ids: [],
      label_ids: [],
      rebate_rate_config: [],
      start_at: "",
      end_at: "",
      wallet_type: BONUS_WALLET_TYPE.Enums.GENERALLY,
      calculate_type: CALCULATE_TYPE.Enums.ValidBet,
      start: 0,
      end: 0
    }
  ])
  const { genWeeks, genMonths, genTimeFormat, numberEnumToArray } = useCommon()
  const dropdownData = reactive({
    weeks: genWeeks(),
    months: genMonths()
  })
  const cycleSettings = reactive({
    week: 0,
    month: 0,
    season: 0,
    halfYear: 0
  })
  const settlementCycleList = computed(() =>
    Object.values(SETTLEMENT_CYCLE.Enums)
      .filter((v) => !isNaN(Number(v)))
      .map((item) => ({
        label: t(SETTLEMENT_CYCLE.I18nKeys[item as keyof typeof SETTLEMENT_CYCLE.I18nKeys]),
        value: item
      }))
  )
  const sendTypeList = computed(() =>
    Object.values(SEND_TYPE.Enums)
      .filter((v) => !isNaN(Number(v)))
      .map((item) => ({
        label: t(SEND_TYPE.I18nKeys[item as keyof typeof SEND_TYPE.I18nKeys]),
        value: item
      }))
  )
  const gameTypeDropdownList = genEnumToDropdown(Enums, GAME_TYPE.I18nKeys).map((e) => {
    e.label = t(e.label)
    return e
  })
  const filteredGameTypeDropdownList = computed(() => {
    return gameTypeDropdownList.filter((item) => item.value !== 0)
  })
  const bounsDropdownList = computed(() => {
    return numberEnumToArray(BONUS_WALLET_TYPE.Enums).map((item) => {
      const label = t(BONUS_WALLET_TYPE.I18nKeys[item as keyof typeof BONUS_WALLET_TYPE.I18nKeys]) || "common.unknow"
      return {
        label,
        value: item as number
      }
    })
  })

  const languageList = computed(() => {
    const languageList = siteStore.langList
    return languageList.map((e) => {
      const label = e.label
      const value = e.value
      return {
        label,
        value
      }
    })
  })
  const language = ref({
    list: languageList,
    current: languageList?.value[0] ? languageList?.value[0].value : 0
  })
  const sourceStartTime = ref("")
  const sourceEndTime = ref("")
  const isSyncingDateTimeSelector = ref(false)
  const isDateTimeManuallyEdited = ref(false)

  const filteredGameType = reactive({
    list: filteredGameTypeDropdownList,
    current: filteredGameTypeDropdownList.value[0].value
  })

  const distributionThresholdText = computed(() =>
    t(CALCULATE_TYPE.DistributionThresholdI18nKeys[formData.calculate_type as CALCULATE_TYPE.Enums])
  )

  // Set up init table columns
  type CurrencyRate = {
    rate: number
    currencyId: number
    product_code: number
    game_type: string | number
    currency_name: string
    product_name: string
  }
  type ResultItem = {
    game_type: string | number
    product_name: string
    product_code: number
    currencyRate: CurrencyRate[]
  }
  type RebateRateConfig = {
    label?: string | number
    value: string | number
    result: ResultItem[]
  }
  type DistributionThreshold = {
    currency_id: string // 根据你的需求调整类型
    currency_name: string // 根据你的需求调整类型
    threshold: number
  }

  type DispatchAmountLimit = {
    currency_id: string // 根据你的需求调整类型
    currency_name: string // 根据你的需求调整类型
    amount: number | string
  }
  const formatTableData = reactive({
    distributionThresholdList: [] as DistributionThreshold[],
    dispatchAmountLimitList: [] as DispatchAmountLimit[],
    rebateRateConfigList: [] as RebateRateConfig[]
  })

  interface newItemType {
    label?: string
    value?: number
  }
  const currencyDropdownList = reactive<newItemType[]>([])

  const getCurrency = async () => {
    const { data } = await getCurrencyList()

    if (!data || !Object.keys(data).length) {
      currencyDropdownList.length = 0
      return
    }
    for (const [currency, value] of Object.entries(data)) {
      const newItem = {
        label: currency,
        value: value
      } as newItemType
      currencyDropdownList.push(newItem)
    }
  }

  const formatTableColumn = computed((): CustomColumn[] => {
    return currencyDropdownList
      .map((currency) => {
        return {
          name: currency.value ? currency.value : "",
          label: currency.label || "",
          field: currency.label || "",
          sortable: false,
          align: "center"
        } as CustomColumn
      })
      .sort((a, b) => Number(a.name) - Number(b.name))
  })

  const formatGameTableColumn = computed((): CustomColumn[] => {
    const providerName = "provider_name"
    const gameColumns = currencyDropdownList.map((currency) => {
      return {
        name: currency.value ? currency.value : "",
        label: currency.label || "",
        field: currency.label || "",
        sortable: false,
        align: "center"
      } as CustomColumn
    })

    // 在開頭插入 providerName
    gameColumns.unshift({
      name: providerName,
      label: t("query_params.product_name"),
      field: providerName,
      sortable: false,
      align: "center"
    } as CustomColumn)

    return gameColumns.sort((a, b) => Number(a.name) - Number(b.name))
  })
  function goBack() {
    router.back()
  }

  function mapCurrency(productCurrency: string | undefined) {
    // 找到對應的物件
    const mappedCurrency = currencyDropdownList.find((item) => productCurrency === item.label)

    // 如果找到則返回物件，否則返回 false
    return mappedCurrency || false
  }

  interface productItem {
    product_code: number
    product_name: string
    game_type_id: number
    currency: string
  }

  const ProductDropdown = ref<productItem[]>([])
  const syncDateTimeSelector = () => {
    if (!sourceStartTime.value || !sourceEndTime.value) return

    isSyncingDateTimeSelector.value = true
    dateTimeSelector.from = format(sourceStartTime.value, "yyyy-MM-dd") || sourceStartTime.value
    dateTimeSelector.to = format(sourceEndTime.value, "yyyy-MM-dd") || sourceEndTime.value
    dateTimeSelector.fromHms = format(sourceStartTime.value, "HH:mm:ss") || "00:00:00"
    dateTimeSelector.toHms = format(sourceEndTime.value, "HH:mm:ss") || "23:59:59"
    isSyncingDateTimeSelector.value = false
  }

  const { search, isSuccess, tableData } = useSearch(getCommssionSettingSingleList)
  onMounted(async () => {
    await getCurrency()
    selectedSetCurrency.value = currencyDropdownList[0]?.value ?? 0
    const { data }: { data: productItem[] } = await getProductDropdown()
    ProductDropdown.value = data
    const id = route.params.id as string
    Promise.all([search({ id: parseInt(id) })])
      .then(() => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          goBack()
        } else {
          // 語系設定
          const result = siteStore.langList
          // formData.titles = result
          formData.titles = tableData.value.titles
          formData.period_type = tableData.value.period_type
          formData.dispatch_type = tableData.value.dispatch_type
          formData.audit_rate = Number(tableData.value.audit_rate)
          sourceStartTime.value = tableData.value.start_at || ""
          sourceEndTime.value = tableData.value.end_at || ""
          isDateTimeManuallyEdited.value = false
          syncDateTimeSelector()

          formData.level_ids = tableData.value.level_ids.map((e: any) => e)
          formData.label_ids = tableData.value.label_ids.map((e: any) => e)
          // 派發门槛（有效投注）
          formData.dispatch_threshold = tableData.value.dispatch_threshold || []
          // 單次結算派發上限
          formData.dispatch_amount_limit = tableData.value.dispatch_amount_limit

          // 佣金比例設定
          formData.rebate_rate_config = tableData.value.rebate_rate_config
          initTable()
          // 結算週期
          cycleSettings.week = tableData.value.days_of_week ? tableData.value.days_of_week : dropdownData.weeks[0].value
          cycleSettings.month = dropdownData.months[0].value
          cycleSettings.season = dropdownData.months[0].value
          cycleSettings.halfYear = dropdownData.months[0].value

          formData.wallet_type = walletSwitch.value ? tableData.value.wallet_type : BONUS_WALLET_TYPE.Enums.GENERALLY
          formData.calculate_type = tableData.value.calculate_type
          isLoading.value = true
        }
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        //goBack()
      })
  })

  const initTable = () => {
    // 派發门槛（有效投注）
    formatTableData.distributionThresholdList = formatTableColumn.value.map((column) => {
      const currency_id = column.name
      const distributionItem = form[0].dispatch_threshold.find(
        (item) => item.currency_id.toString() === currency_id.toString()
      )
      const currency_name = column.label
      const threshold = distributionItem ? parseFloat(distributionItem.threshold.toString()) : 0
      return {
        currency_id,
        currency_name,
        threshold
      }
    })

    // 沒有資料的話給預設
    if (!form[0].dispatch_threshold || form[0].dispatch_threshold.length === 0) {
      formatTableData.distributionThresholdList = formatTableColumn.value.map((column) => ({
        currency_id: column.name,
        currency_name: column.label,
        threshold: 0
      }))
    }

    // 單次結算派發上限
    formatTableData.dispatchAmountLimitList = formatTableColumn.value.map((column) => {
      const currency_id = column.name
      const distributionItem = form[0].dispatch_amount_limit.find(
        (item) => Number(item.currency_id) === Number(currency_id)
      )
      const currency_name = column.label
      const amount = distributionItem ? parseFloat(String(distributionItem.amount)) : 0
      return {
        currency_id,
        currency_name: currency_name,
        amount: amount
      }
    })

    // 沒有資料的話給預設
    if (!form[0].dispatch_amount_limit || form[0].dispatch_amount_limit.length === 0) {
      formatTableData.dispatchAmountLimitList = formatTableColumn.value.map((column) => ({
        currency_id: column.name,
        currency_name: column.label,
        amount: 0
      }))
    }

    // 佣金比例設定
    if (formatGameTableColumn.value.length !== 0) {
      const filteredResult = filteredGameType.list.map((gameType) => {
        // 筛选出符合当前 gameType 的数据
        const filteredItems = ProductDropdown.value.filter((item) => item.game_type_id === gameType.value)
        const result = filteredItems.map((product) => {
          const currencyRate = formatGameTableColumn.value
            .map((currencyColumn) => {
              if (currencyColumn.name === "provider_name") return null // 跳过 provider_name 列

              const mapC = mapCurrency(product.currency)
              const defaultData = {
                currencyId: Number(currencyColumn.name),
                currency_name: currencyColumn.label,
                rate: 0,
                game_type: gameType.value,
                product_name: product.product_name,
                //product_code: -1
                product_code: product.product_code
              }
              /*//如果幣別mapiing不到那就所有幣別可以輸入 例如IDR2 先保留
              if (!mapC) {
                const matchingProductMapping = filteredItems.find((item) => item.product_name === product.product_name)
                defaultData.product_code = matchingProductMapping?.product_code ?? -1
              } else {
                const matchingProduct = filteredItems.find(
                  (item) => item.currency === currencyColumn.label && item.product_name === product.product_name
                )
                defaultData.product_code = matchingProduct ? matchingProduct.product_code : -1
              }*/
              return defaultData
            })
            .filter((item): item is CurrencyRate => item !== null) // 过滤掉 null 值

          return {
            game_type: gameType.value,
            product_name: product.product_name,
            product_code: product.product_code,
            currencyRate
          }
        })

        return {
          ...gameType,
          result
        }
      })

      formatTableData.rebateRateConfigList = filteredResult

      const rateMap = new Map()
      formData.rebate_rate_config.forEach(
        (item: { game_type: string; product_code: number; currency_id: number; rate: string }) => {
          rateMap.set(`${item.product_code}-${item.currency_id}-${item.game_type}`, item.rate)
        }
      )

      // 更新 formatTableData.rebateRateConfigList
      formatTableData.rebateRateConfigList.forEach((gameType) => {
        gameType.result.forEach((product) => {
          product.currencyRate.forEach((currency) => {
            // 生成匹配键
            const key = `${currency.product_code}-${currency.currencyId}-${currency.game_type}`
            if (rateMap.has(key)) {
              // 更新 rate
              currency.rate = rateMap.get(key)
            }
          })
        })
      })
    }
  }

  const [formData] = form
  const handelMemberLevelTags = (value: number[]) => {
    formData.level_ids = value
  }
  const handelMergeTags = (value: never[]) => {
    formData.label_ids = value
  }

  function onCancel() {
    router.push({ name: "CommissionSettingList" })
  }

  const onSubmit = async () => {
    // Ensure dispatch_threshold is correctly structured
    formData.dispatch_threshold = formatTableData.distributionThresholdList.map((item: any) => ({
      currency_id: item.currency_id,
      threshold: item.threshold.toFixed(4) // Ensure threshold is formatted as string with 4 decimal places
    }))

    // Ensure dispatch_amount_limit is correctly structured
    formData.dispatch_amount_limit = formatTableData.dispatchAmountLimitList.map((item: any) => ({
      currency_id: item.currency_id,
      amount: item.amount.toFixed(4) // Ensure amount is formatted as string with 4 decimal places
    }))

    // Set the day of week to match the required format (0 for Sunday, 6 for Saturday)
    formData.days_of_week = cycleSettings.week === 7 ? 0 : cycleSettings.week

    // Get the rebate rate configuration data
    let formatResult: any[] = []
    formatTableData.rebateRateConfigList.forEach((item) => {
      item.result.forEach((product: any) => {
        product.currencyRate.forEach((pitem: { rate: number; currencyId: number; product_code: number }) => {
          if (pitem.rate !== 0 && pitem.product_code !== -1) {
            formatResult.push({
              game_type: product.game_type,
              product_code: pitem.product_code,
              currency_id: pitem.currencyId,
              rate: pitem.rate.toString()
            })
          }
        })
      })
    })

    formData.rebate_rate_config = formatResult

    formData.start_at = `${dateTimeSelector.from || ""} ${dateTimeSelector.fromHms || ""}`.trim()

    formData.end_at = `${dateTimeSelector.to || ""} ${dateTimeSelector.toHms || ""}`.trim()
    // Keep titles as an array
    /*formData.titles = formData.titles.map((title) => ({
      label: title.label,
      name: title.name
    }))*/

    // Add other required fields
    formData.id = route.params.id as string

    const { search, status } = useSearch(updateCommssionSetting)
    submitLoading.value = true
    await search(formData)
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      setTimeout(() => {
        router.push({ name: "CommissionSettingList" })
      }, 500)
    } else {
      submitLoading.value = false
    }
  }

  const onSettingCurrency = () => {
    formatTableData.rebateRateConfigList.forEach((item) => {
      // 目前有鎖定當下產品tab 如果不要拿掉判斷就好
      if (item.value === filteredGameType.current) {
        item.result.forEach((resultItem) => {
          resultItem.currencyRate.forEach((rateItem) => {
            if (rateItem.currencyId === selectedSetCurrency.value) {
              rateItem.rate = Number(categoryCurrency.value)
            }
          })
        })
      }
    })
  }
  const onSettingCategory = () => {
    formatTableData.rebateRateConfigList.forEach((item) => {
      if (item.value === selectedGameType.value) {
        item.result.forEach((resultItem) => {
          resultItem.currencyRate.forEach((rateItem) => {
            rateItem.rate = Number(categoryPercent.value)
          })
        })
      }
    })
  }
  const dateTimeSelector = reactive<{ from?: string; to?: string; fromHms?: string; toHms?: string }>({
    from: undefined,
    to: undefined,
    fromHms: undefined,
    toHms: undefined
  })
  const onUpdateDateTime = (newValue: { from: string; to: string; fromHms?: string; toHms?: string }) => {
    if (isSyncingDateTimeSelector.value) return

    isDateTimeManuallyEdited.value = true
    if (!newValue) {
      dateTimeSelector.from = undefined
      dateTimeSelector.to = undefined
      dateTimeSelector.fromHms = undefined
      dateTimeSelector.toHms = undefined
      return
    }
    dateTimeSelector.from = newValue.from
    dateTimeSelector.to = newValue.to
    dateTimeSelector.fromHms = newValue.fromHms
    dateTimeSelector.toHms = newValue.toHms
  }

  watch(
    () => timezoneStore.targetOffsetMinutes,
    () => {
      if (isDateTimeManuallyEdited.value) return
      syncDateTimeSelector()
    }
  )

  function addStep() {
    formData.audit_rate =
      typeof formData.audit_rate === "string" ? parseFloat(formData.audit_rate) : formData.audit_rate
    if (typeof formData.audit_rate !== "number" || isNaN(formData.audit_rate)) {
      formData.audit_rate = 0
    }
    formData.audit_rate = preciseAdd(formData.audit_rate as number, auditMultipleStep)
  }
  function subStep() {
    formData.audit_rate =
      typeof formData.audit_rate === "string" ? parseFloat(formData.audit_rate) : formData.audit_rate
    if (typeof formData.audit_rate !== "number" || isNaN(formData.audit_rate)) {
      formData.audit_rate = 0
    }
    if (formData.audit_rate) {
      formData.audit_rate = preciseSubtract(formData.audit_rate, auditMultipleStep)
    }
  }

  function updateCategoryValue(category: string, operation: (a: number, b: number) => number) {
    let target = category === "categoryPercent" ? categoryPercent : categoryCurrency

    target.value = typeof target.value === "string" ? parseFloat(target.value) : target.value

    if (typeof target.value !== "number" || isNaN(target.value)) {
      target.value = 0
    }
    target.value = operation(target.value as number, auditMultipleStep)
    if (target.value <= 0) {
      target.value = 0
    }
  }

  function categoryAddStep(category: string) {
    updateCategoryValue(category, preciseAdd)
  }
  function categorySubStep(category: string) {
    updateCategoryValue(category, preciseSubtract)
  }

  const applyLanguage = async () => {
    try {
      const currentLanguage = language.value.list.find((item) => item.value === language.value?.current)
      const languageName = currentLanguage?.label
      const firstItemData = languageName ? formData.titles?.[languageName] : undefined
      if (!firstItemData) {
        $q.notify({
          type: "negative",
          message: t("message.please_fill_the_first_language_content_before_using_ai_translation"),
          position: "top",
          timeout: 300
        })
        return
      }

      $q.loading.show()
      const languages = language.value.list.map((item) => item.label)
      const { status, data } = await translateAiText([{ input_text: firstItemData, languages }])
      if (status && Array.isArray(data) && data.length) {
        Object.keys(data[0].translations).forEach((item: string) => {
          formData.titles[item as keyof typeof formData.titles] = data[0].translations[item]
        })
        $q.notify({
          type: "positive",
          message: t("message.ai_translation_completed"),
          position: "top",
          timeout: 300
        })
      }
    } catch (error) {
      console.error("applyLanguage error", error)
    } finally {
      $q.loading.hide()
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  @import "@/css/setting.scss";

  .title {
    font-size: 14px;
  }

  .download {
    cursor: pointer;
    text-decoration: underline;
    color: #5298ff;
  }

  ::v-deep(.q-field__control) {
    min-width: 80px;
  }

  ::v-deep(.languageTab) {
    justify-content: left !important;
  }
</style>
