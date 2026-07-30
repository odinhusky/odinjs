<template>
  <div class="q-pa-md">
    <q-card class="editWrapper_v2 bg-white">
      <div class="msk" v-if="!permission.edit"></div>
      <q-form>
        <q-card-section>
          <div class="bold h1-bold text-center grey">{{ $t("menu.referral_commission_setup") }}</div>
        </q-card-section>
        <q-card-section style="padding-top: 0">
          <div class="row q-col-gutter-md edit_area_style1">
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div class="h7-bold">{{ $t("edit_form.rebate_switch") }}</div>
              <q-card-actions class="q-px-none" align="left">
                <q-btn-toggle
                  class="btn_toggle_style"
                  v-model="formData.enabled"
                  :options="[
                    { label: t('common.disable'), value: false },
                    { label: t('common.enable'), value: true }
                  ]"
                  toggle-color="primary"
                  unelevated
                  rounded
                />
              </q-card-actions>
            </q-card>
            <!-- 返佣對象 -->
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("edit_form.rebate_target") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey">
                <q-option-group v-model="formData.rebate_target" color="primary" :options="rebateTargetList">
                </q-option-group>
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
                          v-if="!spinShow"
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
            <!-- 盈虧 -->
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("table_header.calculate_mode") }}</p>
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

            <!-- bonus_type -->
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md" v-if="walletSwitch">
              <div>
                <p class="h7-bold">{{ $t("edit_form.bonus_type") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey">
                <q-option-group v-model="formData.wallet_type" color="primary" :options="bounsDropdownList">
                </q-option-group>
              </q-card-actions>
            </q-card>

            <q-card class="col-4 bg-transparent q-pt-md">
              <div>
                <p class="h7-bold">{{ $t("table_header.member_tag") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey">
                <memberTagOption
                  :parent-value="formData.label_ids"
                  @update:labelValue="handelMergeTags"
                  v-if="!spinShow"
                />
              </q-card-actions>
            </q-card>
          </div>
        </q-card-section>
        <q-card-section style="padding-top: 0">
          <!-- 派發門檻（有效投注） -->
          <div style="display: flex; align-items: center">
            <div class="h4-bold bold grey q-mb-sm">{{ distributionThresholdText }}</div>
            <div class="h4 bold text-red-500 q-mb-sm ml-2">{{ $t("edit_form.no_statistics") }}</div>
          </div>
          <q-table
            v-if="formatTableData.distributionThresholdList"
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :columns="formatTableColumn"
            :rows="formatTableData.distributionThresholdList.slice(0, 1)"
            row-key="id"
            table-header-class="bg-success"
          >
            <template v-slot:body="props">
              <q-tr :key="props.row.currency_id">
                <q-td v-for="col in formatTableData.distributionThresholdList" :key="col.currency_name">
                  <q-number
                    v-model="col.threshold"
                    class="col-6 default-input"
                    outlined
                    stack-label
                    input-class="text-right"
                    :options="optionsLimit"
                    :placeholder="$t('common.no_statistics')"
                  >
                  </q-number>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <!-- 單次結算派發上限 -->
          <div style="display: flex; align-items: center">
            <div class="h4-bold bold grey q-mb-sm q-mt-md">
              {{ $t("edit_form.single_settlement_distribution_limit") }}
            </div>
            <div class="h4 bold text-red-500 q-mb-sm q-mt-md ml-4">{{ $t("edit_form.no_statistics_margin") }}</div>
          </div>
          <q-table
            v-if="formatTableData.dispatchAmountLimitList"
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :columns="formatTableColumn"
            :rows="formatTableData.dispatchAmountLimitList.slice(0, 1)"
            row-key="id"
          >
            <template v-slot:body="props">
              <q-tr :key="props.row.id">
                <q-td v-for="col in formatTableData.dispatchAmountLimitList" :key="col.name">
                  <q-number
                    type="number"
                    v-model="col.amount"
                    class="col-6 default-input"
                    outlined
                    stack-label
                    input-class="text-right"
                    :options="optionsLimit"
                    :placeholder="$t('edit_form.max_input_placeholder')"
                  >
                  </q-number>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>

        <q-card-section>
          <q-card-section
            class="q-pb-xs table-style"
            v-for="(tableData, index) in formatTableData.rebateRateConfigList"
            :key="index"
          >
            <p>{{ $t("common.level_num", { num: index + 1 }) }}</p>

            <div class="title">{{ $t("edit_form.commission_ratio_setting") }}</div>
            <div class="rebet_tool_group row q-mt-md q-mb-md" style="background: white">
              <!-- 左邊卡片 -->
              <div class="col-12 col-md-6 q-col-gutter-md q-pa-md row items-end">
                <!-- 左側文字 + 下拉 -->
                <div class="col-6 col-md-5 column">
                  <div class="bold h5-bold q-mb-xs">{{ $t("edit_form.set_by_category") }}</div>
                  <q-select
                    v-model="selectedGameType[index]"
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
                    <q-btn size="md" square flat @click="categorySubStep('gameTypePercent', index)" class="q-left"
                      >-</q-btn
                    >
                    <q-number
                      v-model="gameTypePercent[index]"
                      :options="generalOptions"
                      borderless
                      class="default-input audit-multiple"
                    >
                      <template v-slot:append> % </template>
                    </q-number>
                    <q-btn size="md" square flat @click="categoryAddStep('gameTypePercent', index)" class="q-right"
                      >+</q-btn
                    >
                  </div>
                </div>

                <!-- 右側按鈕 -->
                <div class="col-3 col-md-3 flex items-end">
                  <q-btn color="primary" class="full-width" style="height: 40px" @click="onSettingCategory(index)">
                    {{ $t("btn.settings") }}</q-btn
                  >
                </div>
              </div>

              <!-- 右邊卡片 (同樣邏輯) -->
              <div class="col-12 col-md-6 q-col-gutter-md q-pa-md row items-end">
                <div class="col-6 col-md-5 column">
                  <div class="bold h5-bold q-mb-xs">{{ $t("edit_form.set_by_currency") }}</div>
                  <q-select
                    v-model="selectedSetCurrency[index]"
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
                    <q-btn size="md" square flat @click="categorySubStep('currencyPercent', index)" class="q-left"
                      >-</q-btn
                    >
                    <q-number
                      v-model="currencyPercent[index]"
                      :options="generalOptions"
                      borderless
                      class="default-input audit-multiple"
                    >
                      <template v-slot:append> % </template>
                    </q-number>
                    <q-btn size="md" square flat @click="categoryAddStep('currencyPercent', index)" class="q-right"
                      >+</q-btn
                    >
                  </div>
                </div>

                <div class="col-3 col-md-3 flex items-end">
                  <q-btn color="primary" class="full-width" style="height: 40px" @click="onSettingCurrency(index)">
                    {{ $t("btn.settings") }}</q-btn
                  >
                </div>
              </div>
            </div>

            <div class="row tableWrapper">
              <div class="col-12">
                <q-table
                  :rows="tableData"
                  :columns="formatGameTableColumn"
                  row-key="level"
                  hide-pagination
                  flat
                  :pagination="{ rowsPerPage: 100, page: 1 }"
                >
                  <template v-slot:body="props">
                    <q-tr>
                      <q-td key="provider_name">
                        {{ props.row.product_name }}
                      </q-td>
                      <q-td
                        v-for="(col, idx) in formatGameTableColumn.length - 1"
                        :key="props.row.currencyRate[idx].currencyId"
                      >
                        <q-input
                          type="number"
                          v-model.number="props.row.currencyRate[idx].rate"
                          class="col-6 default-input per-size"
                          input-class="text-right"
                          outlined
                          stack-label
                          :min="0"
                        >
                          <template v-slot:append> % </template>
                        </q-input>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </div>
          </q-card-section>
          <div></div>
          <div class="q-pt-md q-pb-lg" style="text-align: center">
            <q-btn outline color="primary" icon="add" align="center" class="q-mr-md add_btn detail-btn" @click="addRow">
            </q-btn>
            <q-btn outline icon="remove" align="center" class="add_btn remove-btn" @click="removeRow"> </q-btn>
          </div>
        </q-card-section>

        <q-card-actions class="q-py-md" align="center">
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
  import { getReferralCommssionSetting, updateReferralCommssionSetting } from "@/api/commissionManagement"

  import { getProductGameType } from "@/api/product"
  import {
    CURRENCY_TYPE,
    GAME_TYPE,
    CALCULATE_TYPE,
    SETTLEMENT_CYCLE,
    SEND_TYPE,
    BONUS_WALLET_TYPE,
    REBATE_TARGET
  } from "@/utils/constants"
  import { genEnumToDropdown } from "@/stores/queryStore"
  import { Enums } from "@/utils/constants/gameType"
  import BlockTags from "./component/BlockTags.vue"
  import memberTagOption from "@/components/forms/memberTagOption.vue"

  import { useCommon } from "@/hook/useCommon"
  import { useDecimal } from "@/hook/useDecimal"
  import { useSiteStore } from "@/stores/siteStore"
  import { getCurrencyList } from "@/api/common"
  import { useQueryStore } from "@/stores/queryStore"
  import type { GetReferralCommissionSettingList } from "@/api/request.type"
  import { usePermission } from "@/hook/usePermission"
  import { useWalletBouns } from "@/hook/useWalletBouns"

  const { permission } = usePermission()
  const queryStore = useQueryStore()
  const { preciseAdd, preciseSubtract } = useDecimal()

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const siteStore = useSiteStore()
  const gameTypePercent = ref<number[]>([])
  const currencyPercent = ref<number[]>([])
  const selectedGameType = ref<number[]>([])
  const selectedSetCurrency = ref<number[]>([])
  const $q = useQuasar()
  const isLoading = ref(false)
  const submitLoading = ref(false)

  const auditMultipleStep = 0.5
  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2"
  }
  const generalOptions2 = {
    min: 0,
    minimumFractionDigits: "0"
  }

  const { walletSwitch } = useWalletBouns()
  const bounsDropdownList = computed(() => {
    return numberEnumToArray(BONUS_WALLET_TYPE.Enums).map((item) => {
      const label = t(BONUS_WALLET_TYPE.I18nKeys[item as keyof typeof BONUS_WALLET_TYPE.I18nKeys]) || "common.unknow"
      return {
        label,
        value: item as number
      }
    })
  })

  const form = reactive<GetReferralCommissionSettingList[]>([
    {
      period_type: 0,
      audit_rate: 0,
      dispatch_type: 0,
      days_of_week: 0,
      enabled: false,
      rebate_target: REBATE_TARGET.Enums.All,
      dispatch_threshold: [],
      dispatch_amount_limit: [],
      label_ids: [],
      rebate_rate_config: [],
      level: 1,
      calculate_type: 1,
      wallet_type: BONUS_WALLET_TYPE.Enums.GENERALLY
    }
  ])

  const optionsLimit = {
    nullValue: ""
  }

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
  const rebateTargetList = computed(() =>
    Object.values(REBATE_TARGET.Enums)
      .filter((v) => !isNaN(Number(v)))
      .map((item) => ({
        label: t(REBATE_TARGET.I18nKeys[item as keyof typeof REBATE_TARGET.I18nKeys]),
        value: item
      }))
  )
  interface productItem {
    id: number
    game_type: string
  }
  const ProductDropdown = ref<productItem[]>([])

  const filteredGameTypeDropdownList = computed(() => {
    return [
      ...ProductDropdown.value.map((item) => {
        const label = t(GAME_TYPE.I18nKeys[item.id as keyof typeof GAME_TYPE.I18nKeys] || "")
        return {
          label,
          value: item.id
        }
      })
    ]
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

  const distributionThresholdText = computed(() =>
    t(CALCULATE_TYPE.DistributionThresholdI18nKeys[formData.calculate_type as CALCULATE_TYPE.Enums])
  )

  const language = ref({
    list: languageList,
    current: languageList?.value[0] ? languageList?.value[0].value : 0
  })

  const filteredGameType = reactive({
    list: filteredGameTypeDropdownList
  })

  // Watcher to log the selected filteredGameType and formatTableData
  /*watch(
    () => filteredGameType.current,
    (newVal, oldVal) => {
      console.log(`Selected filteredGameType: ${newVal}`)
      initTable()
      console.log("formatTableData:", formatTableData)
    }
  )*/
  // Set up init table columns
  type CurrencyRate = {
    rate: number
    currencyId: number
    product_code: number
  }
  type ResultItem = {
    currencyRate: CurrencyRate[]
  }
  type RebateRateConfig = {
    value: number
    game_type: number
    currencyRate: CurrencyRate[]
  }
  type DistributionThreshold = {
    currency_id: string
    currency_name: string
    threshold: number | string
  }

  type DispatchAmountLimit = {
    currency_id: string
    currency_name: string
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

  interface FormatResultItem {
    game_type: string
    product_id: number
    currency_id: number
    rate: string
  }

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
    return currencyDropdownList.map((currency) => {
      return {
        name: currency.value ? currency.value : "",
        label: currency.label || "",
        field: currency.label || "",
        sortable: false,
        align: "center"
      } as CustomColumn
    })
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

    return gameColumns
  })
  function goBack() {
    router.back()
  }

  const { search, spinShow, isSuccess, tableData } = useSearch(getReferralCommssionSetting)

  onMounted(async () => {
    await getCurrency()
    const { data }: { data: productItem[] } = await getProductGameType()
    ProductDropdown.value = data
    Promise.all([search()])
      .then(() => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          goBack()
        } else {
          isLoading.value = true
          // 語系設定
          //const result = siteStore.langList
          // formData.titles = result
          formData.period_type = tableData.value.period_type
          formData.dispatch_type = tableData.value.dispatch_type
          formData.audit_rate = Number(tableData.value.audit_rate)

          formData.label_ids = tableData.value.label_ids.map((e: any) => e)

          formData.enabled = tableData.value.enabled
          formData.rebate_target = tableData.value?.rebate_target ?? REBATE_TARGET.Enums.All
          formData.calculate_type = tableData.value?.calculate_type ?? 1

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
        }
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        //goBack()
      })
  })

  const reFormatTableData = () => {
    // 佣金比例設定
    if (formatGameTableColumn.value.length !== 0) {
      formatTableData.rebateRateConfigList = Array.from({ length: formData.rebate_rate_config.length }, (_, index) => {
        return filteredGameType.list.map((gameType) => {
          const currencyRate = currencyDropdownList.map((currency) => ({
            currencyId: currency.value,
            currency_name: currency.label,
            rate: 0,
            game_type: gameType.value,
            product_name: gameType.label,
            product_code: 0,
            level: 0 // 確保 level 不同
          }))

          return {
            game_type: gameType.value,
            product_name: gameType.label,
            product_code: 0,
            level: 0, // 讓不同 table 不會共用 level
            currencyRate
          }
        })
      })

      gameTypePercent.value = Array(formData.level).fill(0)
      currencyPercent.value = Array(formData.level).fill(0)

      for (let i = 0; i <= formatTableData.rebateRateConfigList.length - 1; i++) {
        selectedSetCurrency.value.push(currencyDropdownList[0].value)
        selectedGameType.value.push(filteredGameTypeDropdownList.value[0].value)
      }

      formatTableData.rebateRateConfigList.forEach((group, groupIndex) => {
        if (!Array.isArray(formData.rebate_rate_config[groupIndex])) return

        formData.rebate_rate_config[groupIndex].forEach(({ game_type, currency_id, rate }) => {
          if (!Array.isArray(group)) return // 確保 group 是陣列
          const game = group.find((item: { game_type: number }) => item.game_type === game_type)
          if (game) {
            const currency = game.currencyRate.find((cr: { currencyId: number }) => cr.currencyId === currency_id)
            if (currency) {
              currency.rate = Number(rate) // 更新 rate 值
            }
          }
        })
      })
    }
  }

  const addRow = () => {
    formData.level += 1
    const newRow: any = filteredGameType.list.map((gameType) => {
      const currencyRate = currencyDropdownList.map((currency) => ({
        currencyId: currency.value,
        currency_name: currency.label,
        rate: 0,
        game_type: gameType.value,
        product_name: gameType.label,
        product_code: 0,
        level: formatTableData.rebateRateConfigList.length // 設定不同 level
      }))

      return {
        game_type: gameType.value,
        product_name: gameType.label,
        product_code: 0,
        level: formatTableData.rebateRateConfigList.length, // 設定不同 level
        currencyRate
      }
    })

    formatTableData.rebateRateConfigList.push(newRow)
    gameTypePercent.value.push(0)
    currencyPercent.value.push(0)
    selectedSetCurrency.value.push(currencyDropdownList[0].value)
    selectedGameType.value.push(filteredGameTypeDropdownList.value[0].value)
  }
  const removeRow = () => {
    if (formatTableData.rebateRateConfigList.length > 1) {
      formatTableData.rebateRateConfigList.pop()
      gameTypePercent.value.pop()
      currencyPercent.value.pop()
      selectedSetCurrency.value.pop()
      selectedGameType.value.pop()
      formData.level -= 1
    }
  }

  const initTable = () => {
    // 派發门槛（有效投注）
    formatTableData.distributionThresholdList = formatTableColumn.value.map((column) => {
      const currency_id = column.name
      const distributionItem = form[0].dispatch_threshold.find(
        (item) => item.currency_id.toString() === currency_id.toString()
      )
      const currency_name = column.label
      const threshold =
        distributionItem && distributionItem.threshold !== "-1" ? parseFloat(distributionItem.threshold.toString()) : ""
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
        threshold: ""
      }))
    }

    // 單次結算派發上限
    formatTableData.dispatchAmountLimitList = formatTableColumn.value.map((column) => {
      const currency_id = column.name
      const distributionItem = form[0].dispatch_amount_limit.find(
        (item: { currency_id: number; amount: string | number }) => item.currency_id === Number(currency_id)
      )
      const currency_name = column.label
      const amount =
        distributionItem && distributionItem.amount !== "-1" ? parseFloat(distributionItem.amount.toString()) : ""
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
        amount: ""
      }))
    }
    reFormatTableData()
  }

  const setCurrency = (value: any, index: number) => {
    gameTypePercent.value[index] = 0
    selectedSetCurrency.value[index] = value
  }

  const setGameType = (value: any, index: number) => {
    gameTypePercent.value[index] = 0
    selectedGameType.value[index] = value
  }
  const [formData] = form

  const handelMergeTags = (value: never[]) => {
    console.log(value)
    formData.label_ids = value
  }

  function onCancel() {
    router.push({ name: "CommissionSettingList" })
  }

  const onSubmit = async () => {
    // Ensure dispatch_threshold is correctly structured
    formData.dispatch_threshold = formatTableData.distributionThresholdList.map((item: any) => ({
      currency_id: item.currency_id,
      threshold: item.threshold === "" ? -1 : parseFloat(item.threshold).toFixed(4)
    }))

    // Ensure dispatch_amount_limit is correctly structured
    formData.dispatch_amount_limit = formatTableData.dispatchAmountLimitList.map((item: any) => ({
      currency_id: item.currency_id,
      amount: item.amount === "" ? -1 : parseFloat(item.amount).toFixed(4)
    }))

    // Set the day of week to match the required format (0 for Sunday, 6 for Saturday)
    formData.days_of_week = cycleSettings.week === 7 ? 0 : cycleSettings.week

    let formatResult = formatTableData.rebateRateConfigList.map((levelArray: any) => {
      return levelArray.flatMap((item: any) =>
        item.currencyRate
          .filter((pitem: { rate: number; currencyId: number; product_code: number }) => pitem.rate !== 0)
          .map((pitem: { rate: number; currencyId: number; product_code: number }) => ({
            game_type: item.game_type,
            product_code: item.product_code,
            currency_id: pitem.currencyId,
            rate: pitem.rate.toString()
          }))
      )
    })

    formData.rebate_rate_config = formatResult
    console.log(formatResult)
    const { search, status } = useSearch(updateReferralCommssionSetting)
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
        location.reload()
        isLoading.value = false
      }, 500)
    } else {
      submitLoading.value = false
    }
  }

  const onSettingCurrency = (index: number) => {
    formatTableData.rebateRateConfigList[index].forEach((item: { game_type: number; currencyRate: number }) => {
      item.currencyRate.forEach((resultItem: { currencyId: number; rate: number }) => {
        if (resultItem.currencyId === selectedSetCurrency.value[index]) {
          resultItem.rate = Number(currencyPercent.value[index])
        }
      })
    })
  }
  const onSettingCategory = (index: number) => {
    formatTableData.rebateRateConfigList[index].forEach((item: { game_type: number; currencyRate: number }) => {
      if (item.game_type === selectedGameType.value[index]) {
        item.currencyRate.forEach((rateItem: { rate: number }) => {
          rateItem.rate = Number(gameTypePercent.value[index])
        })
      }
    })
  }

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
  /*
  function addLevelStep() {
    formData.level += 1
    reFormatTableData()
  }
  function subLevelStep() {
    if (formData.level > 1) {
      formData.level -= 1
      reFormatTableData()
    }
  }*/

  function updateCategoryValue(category: string, operation: (a: number, b: number) => number, index: number) {
    const targetArray = category === "gameTypePercent" ? gameTypePercent.value : currencyPercent.value
    let target = targetArray[index]

    target = typeof target === "string" ? parseFloat(target) : target

    if (typeof target !== "number" || isNaN(target)) {
      target = 0
    }

    target = operation(target as number, auditMultipleStep)

    if (target <= 0) {
      target = 0
    }

    targetArray[index] = target
  }

  function categoryAddStep(category: string, index: number) {
    updateCategoryValue(category, preciseAdd, index)
  }
  function categorySubStep(category: string, index: number) {
    updateCategoryValue(category, preciseSubtract, index)
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  @import "@/css/setting.scss";

  .d-flex {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
  }

  .direction {
    flex-direction: row !important;
    align-items: center !important;
  }

  .d-center {
    display: flex;
    justify-content: flex-start;
  }

  .tableWrapper {
    .q-tab--active {
      background: #6e39cb !important;
      color: white !important;
    }
  }
  .table-style {
    border-radius: 10px;
    background: rgba(239, 247, 255, 1);
    margin-bottom: 30px;
    p {
      color: rgba(8, 110, 255, 1);
      font-weight: 700;
      font-size: 18px;
    }
    .title {
      font-size: 14px;
      font-weight: 400;
      color: rgba(83, 82, 82, 1);
    }
  }

  ::v-deep(.q-field__control) {
    min-width: 80px;
  }

  .msk {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 99;
    cursor: not-allowed;
  }

  .my-custom-input input[type="number"] {
    -moz-appearance: textfield;
  }
  .my-custom-input input[type="number"]::-webkit-outer-spin-button,
  .my-custom-input input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .w-50 {
    width: 50%;
  }
</style>
