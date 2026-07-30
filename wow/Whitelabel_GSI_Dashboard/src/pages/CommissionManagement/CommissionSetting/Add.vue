<template>
  <div class="q-pl-md q-pr-md">
    <SubPage action-label-i18n-key="btn.add" />
  </div>
  <q-card class="q-pa-md no-shadow bg-transparent addWrapper">
    <q-card-section>
      <StepperComp :step-labels-i18n-key="stepLabelsI18nKey" :step-tips-i18n-key="stepTipsI18nKey">
        <template #step1>
          <q-card class="no-shadow bg-transparent add_card">
            <AiLanguage class="w-full justify-end mb-6" @applyLanguage="applyLanguage" />

            <q-form @submit="onSubmit">
              <q-card-section>
                <div class="row q-col-gutter-lg">
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
                          :label="lang.value"
                          class="q-px-none"
                        >
                          <div class="text-h6">
                            <q-input
                              v-if="formData && formTitles[key]"
                              v-model.trim="formTitles[key].name"
                              outlined
                              dense
                              hide-bottom-space
                              outline
                              borderless
                              :placeholder="$t('common.please_enter_content')"
                              style="background: white"
                            />
                          </div>
                        </q-tab-panel>
                      </q-tab-panels>
                    </div>
                  </div>
                  <div class="row q-col-gutter-md q-mb-sm add_area_style">
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
                                        ? $t(
                                            dropdownData.weeks.filter((item) => item.value === cycleSettings.week)[0]
                                              .label
                                          )
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
                          <!-- 月 -->
                          <template v-slot:label-2="opt">
                            <div class="row items-center text-left" style="min-width: 15rem">
                              <div>{{ opt.label }}</div>
                            </div>
                          </template>
                        </q-option-group>
                      </q-card-actions>
                    </q-card>
                    <!-- 結算週期 -->
                    <q-card class="col-5 bg-transparent q-pt-md q-mb-md">
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
                    <q-card class="col-3 bg-transparent q-pt-md q-mb-md">
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
                  </div>
                </div>
                <!--q-col-gutter-lg-->
              </q-card-section>
              <q-card-section align="center">
                <q-btn color="main-color" outline @click="onCancel" class="edit_btns">{{ $t("btn.cancel") }}</q-btn>
                <q-btn color="main-color" @click="nextPrevStep(true)" class="edit_btns q-ml-md">{{
                  $t("btn.next_step")
                }}</q-btn>
              </q-card-section>
            </q-form>
          </q-card>
        </template>

        <template #step2>
          <q-card class="no-shadow bg-transparent add_card editWrapper_v2 q-mt-lg">
            <q-card-section>
              <div class="row q-col-gutter-md q-pt-xs">
                <div class="col-6">
                  <div>
                    <p class="h7-bold">{{ $t("common.distribute_membership_levels") }}</p>
                  </div>
                  <MemberLevelTags
                    :parent-value="formData.level_ids"
                    @update:parentValue="handelMemberLevelTags"
                    :is-column="true"
                  />
                </div>
                <div class="col-6">
                  <div>
                    <p class="h7-bold">{{ $t("common.block_send_tag") }}</p>
                  </div>
                  <memberTagOption :parent-value="formData.label_ids" @update:labelValue="handelMergeTags" />
                </div>
              </div>
            </q-card-section>
            <q-card-section align="center">
              <q-btn color="main-color" outline @click="nextPrevStep(false)" class="edit_btns">{{
                $t("btn.prev_step")
              }}</q-btn>
              <q-btn class="q-ml-md edit_btns" color="main-color" @click="nextPrevStep(true)">{{
                $t("btn.next_step")
              }}</q-btn>
            </q-card-section>
          </q-card>
        </template>

        <template #step3>
          <q-card class="no-shadow bg-transparent add_card editWrapper_v2 q-mt-lg">
            <q-card-section>
              <!-- 派發門檻（有效投注） -->
              <div class="h4-bold bold grey q-mb-sm">{{ distributionThresholdText }}</div>
              <q-table
                square
                hide-pagination
                :rows-per-page-options="[0]"
                :columns="formatTableColumn"
                :rows="formatTableData.distributionThresholdList.slice(0, 1)"
                row-key="id"
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
              <div class="h4-bold bold grey q-mb-sm q-mt-md">
                {{ $t("edit_form.single_settlement_distribution_limit") }}
              </div>
              <q-table
                square
                hide-pagination
                :rows-per-page-options="[0]"
                :columns="formatTableColumn"
                :rows="formatTableData.dispatchAmountLimitList.slice(0, 1)"
                row-key="id"
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
            <q-card-section align="center">
              <q-btn color="main-color" outline @click="nextPrevStep(false)" class="edit_btns">{{
                $t("btn.prev_step")
              }}</q-btn>
              <q-btn class="q-ml-md edit_btns" color="main-color" @click="nextPrevStep(true)">{{
                $t("btn.next_step")
              }}</q-btn>
            </q-card-section>
          </q-card>
        </template>

        <template #step4>
          <q-card class="no-shadow bg-transparent add_card q-mt-lg">
            <q-card-section>
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
                <div
                  class="col-12 col-md-6 q-col-gutter-md q-pa-md row items-end"
                  v-if="currencyDropdownList.length > 0"
                >
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
                      <q-btn size="md" square flat @click="categoryAddStep('categoryCurrency')" class="q-right"
                        >+</q-btn
                      >
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
                            <q-td
                              v-for="(col, idx) in formatGameTableColumn.length - 1"
                              :key="props.row.currencyRate[idx]"
                            >
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
            </q-card-section>
          </q-card>

          <q-card-section align="center">
            <q-btn color="main-color" outline @click="nextPrevStep(false)" class="edit_btns">{{
              $t("btn.prev_step")
            }}</q-btn>
            <q-btn class="q-ml-md edit_btns" color="main-color" @click="onSubmit">{{ $t("btn.check") }}</q-btn>
          </q-card-section>
        </template>
      </StepperComp>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import type { CustomColumn } from "quasar"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { postCommssionSetting } from "@/api/commissionManagement"
  import type { LANGUAGE_TYPE } from "@/utils/constants"
  import {
    CURRENCY_TYPE,
    GAME_TYPE,
    SETTLEMENT_CYCLE,
    SEND_TYPE,
    BONUS_WALLET_TYPE,
    CALCULATE_TYPE
  } from "@/utils/constants"
  import { genEnumToDropdown } from "@/stores/queryStore"
  import { Enums } from "@/utils/constants/gameType"
  import BlockTags from "./component/BlockTags.vue"
  import MemberLevelTags from "./component/MemberLevelTags.vue"
  import memberTagOption from "@/components/forms/memberTagOption.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useDecimal } from "@/hook/useDecimal"
  import { useSiteStore } from "@/stores/siteStore"
  import { getCurrencyList } from "@/api/common"
  import StepperComp from "@/components/stepper/Index.vue"
  import { useStepper } from "@/hook/useStepper"
  import DateTimePicker from "@/components/query/dateTimePicker.vue"
  import SubPage from "layouts/SubPage/Index.vue"
  import { useCommissionStore } from "@/stores/commissionStore"
  import { storeToRefs } from "pinia"
  import { useQueryStore } from "@/stores/queryStore"
  import type { GetCommissionSettingList } from "@/api/request.type"
  import { getProductDropdown } from "@/api/product"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"

  const queryStore = useQueryStore()
  const { preciseAdd, preciseSubtract } = useDecimal()

  const commissionStore = useCommissionStore()
  const { walletSwitch } = useWalletBouns()

  const { commissionItem: formData } = storeToRefs(commissionStore)

  interface productItem {
    product_code: number
    product_name: string
    game_type_id: number
    currency: string
  }

  const ProductDropdown = ref<productItem[]>([])
  // 步驟標頭
  const stepLabelsI18nKey = [
    "step_label.add_commission_group",
    "step_label.distribution_blocking_membership",
    "step_label.commission_distribution_setting",
    "step_label.commission_ratio_setting"
  ]

  // 步驟概述
  const stepTipsI18nKey = [
    "step_tip.commission_distribution_rules_setting",
    "step_tip.commission_distribution_rules_setting_1",
    "step_tip.commission_distribution_rules_setting_2",
    "step_tip.product_commission_ratio_setting"
  ]

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const siteStore = useSiteStore()
  const { nextPrevStep } = useStepper()

  const categoryPercent = ref(0)
  const categoryCurrency = ref(0)
  const selectedGameType = ref(1)
  const selectedSetCurrency = ref(0)
  const $q = useQuasar()
  const isLoading = ref(false)
  const auditMultipleStep = 0.5
  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2"
  }
  const { genWeeks, genMonths, genTimeFormat, numberEnumToArray } = useCommon()
  const dropdownData = reactive({
    weeks: genWeeks(),
    months: genMonths()
  })
  const cycleSettings = reactive({
    week: 0,
    month: 0
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
  const formTitles = computed(() => (formData.value.titles || []) as unknown as CommissionTitleItem[])
  const filteredGameType = reactive({
    list: filteredGameTypeDropdownList,
    current: filteredGameTypeDropdownList.value[0].value
  })
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
  type CommissionTitleItem = {
    label: LANGUAGE_TYPE.Enums
    value: number
    name: string
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

  interface FormatResultItem {
    game_type: string
    product_code: number
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

  const distributionThresholdText = computed(() =>
    t(CALCULATE_TYPE.DistributionThresholdI18nKeys[formData.value.calculate_type as CALCULATE_TYPE.Enums])
  )

  function mapCurrency(productCurrency: string | undefined) {
    // 找到對應的物件
    const mappedCurrency = currencyDropdownList.find((item) => productCurrency === item.label)

    // 如果找到則返回物件，否則返回 false
    return mappedCurrency || false
  }

  let productList = ref<{ gameType: string; label: string; value: string }[]>([])
  onMounted(async () => {
    await getCurrency()
    selectedSetCurrency.value = currencyDropdownList[0]?.value ?? 0
    const { data }: { data: productItem[] } = await getProductDropdown()
    ProductDropdown.value = data

    initTable()
  })
  const initTable = () => {
    isLoading.value = true

    // 初始化設定所有產品佣金比例
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
    }

    if (formData.value.id === 0) {
      // 派發门槛（有效投注）
      formatTableData.distributionThresholdList = formatTableColumn.value.map((column) => {
        const currency_id = column.name
        const currency_name = column.label
        const threshold = 0
        return {
          currency_id,
          currency_name: currency_name,
          threshold: threshold
        } as DistributionThreshold
      })
      // 單次結算派發上限
      formatTableData.dispatchAmountLimitList = formatTableColumn.value.map((column) => {
        const currency_id = column.name
        const currency_name = column.label
        const amount = "0"
        return {
          currency_id,
          currency_name: currency_name,
          amount: amount
        } as DispatchAmountLimit
      })
    } else {
      formatTableData.distributionThresholdList = formatTableColumn.value.map((column) => {
        const currency_id = column.name
        const distributionItem = formData.value.dispatch_threshold.find(
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
      if (!formData.value.dispatch_threshold || formData.value.dispatch_threshold.length === 0) {
        formatTableData.distributionThresholdList = formatTableColumn.value.map((column) => ({
          currency_id: column.name,
          currency_name: column.label,
          threshold: 0
        }))
      }

      // 單次結算派發上限
      formatTableData.dispatchAmountLimitList = formatTableColumn.value.map((column) => {
        const currency_id = column.name
        const distributionItem = formData.value.dispatch_amount_limit.find(
          (item: { currency_id: number; amount: string }) => item.currency_id === Number(currency_id)
        )
        const currency_name = column.label
        const amount = distributionItem ? parseFloat(distributionItem.amount) : 0
        return {
          currency_id,
          currency_name: currency_name,
          amount: amount
        }
      })

      // 沒有資料的話給預設
      if (!formData.value.dispatch_amount_limit || formData.value.dispatch_amount_limit.length === 0) {
        formatTableData.dispatchAmountLimitList = formatTableColumn.value.map((column) => ({
          currency_id: column.name,
          currency_name: column.label,
          amount: 0
        }))
      }
      // 佣金比例設定
      if (formatGameTableColumn.value.length !== 0) {
        const rateMap = new Map()
        formData.value.rebate_rate_config.forEach(
          (item: { game_type: string; product_code: number; currency_id: number; rate: string }) => {
            rateMap.set(`${item.product_code}-${item.currency_id}`, item.rate)
          }
        )

        // 更新 formatTableData.rebateRateConfigList
        formatTableData.rebateRateConfigList.forEach((gameType) => {
          gameType.result.forEach(
            (product: { currencyRate: { product_code: number; rate: number; currencyId: number }[] }) => {
              product.currencyRate.forEach((currency: { product_code: number; currencyId: number; rate: number }) => {
                // 生成匹配键
                const key = `${currency.product_code}-${currency.currencyId}`
                if (rateMap.has(key)) {
                  // 更新 rate
                  currency.rate = rateMap.get(key)
                }
              })
            }
          )
        })
      } //if end
    }
    // 語系設定
    const result = siteStore.langList

    if (formData.value.id === 0) {
      formData.value.titles = result
      cycleSettings.week = dropdownData.weeks[0].value
    } else {
      //複製
      const mergedResult = result.map((item: any) => ({
        ...item,
        name: formData.value.titles[item.label]
      }))
      formData.value.titles = mergedResult
      cycleSettings.week = formData.value.days_of_week as number
      const start = new Date(formData.value.start_at as string)
      const end = new Date(formData.value.end_at as string)
      dateTimeSelector.from = genTimeFormat(start.toISOString().replace("Z", "") as any, "yyyy-MM-dd", false) || ""
      dateTimeSelector.to = genTimeFormat(end.toISOString().replace("Z", ""), "yyyy-MM-dd", false) || ""

      dateTimeSelector.fromHms = genTimeFormat(start.toISOString().replace("Z", ""), "HH:mm:ss", false)
      dateTimeSelector.toHms = genTimeFormat(end.toISOString().replace("Z", ""), "HH:mm:ss", false)
    }

    cycleSettings.month = dropdownData.months[0].value
  }
  const setCurrency = (value: any) => {
    categoryPercent.value = 0
    selectedSetCurrency.value = value
  }

  const setGameType = (value: any) => {
    categoryPercent.value = 0
    selectedGameType.value = value
  }
  const handelMemberLevelTags = (value: never[]) => {
    formData.value.level_ids = value
  }
  const handelMergeTags = (value: never[]) => {
    formData.value.label_ids = value
  }

  function onCancel() {
    router.push({ name: "CommissionSettingList" })
  }

  const onSubmit = async () => {
    formData.value.dispatch_threshold = formatTableData.distributionThresholdList.map((item: any) => {
      return {
        currency_id: item.currency_id,
        threshold: item.threshold
      }
    })
    formData.value.dispatch_amount_limit = formatTableData.dispatchAmountLimitList.map((item: any) => {
      return {
        currency_id: item.currency_id,
        amount: item.amount.toString()
      }
    })

    const result = formData.value.titles.reduce((acc: any, current: any) => {
      acc[current.label] = current.name
      return acc
    }, {})
    formData.value.titles = result
    // 0~6, 0表示星期日
    formData.value.days_of_week = cycleSettings.week === 7 ? 0 : cycleSettings.week
    formData.value.id = route.params.id as string
    /*
      const formatResult = formatTableData.rebateRateConfigList.map((res) => {
        return res.result.flatMap((rateItem) => {
          return rateItem.currencyRate.map((item) => {
            const { game_type, product_code, currencyId, rate } = item
            return { game_type, product_code, currencyId, rate: rate.toString() }
          })
        })
      })*/
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

    formData.value.rebate_rate_config = formatResult

    if (dateTimeSelector.from !== undefined && dateTimeSelector.to !== undefined) {
      formData.value.start_at = `${dateTimeSelector.from || ""} ${dateTimeSelector.fromHms || ""}`.trim()
      formData.value.end_at = `${dateTimeSelector.to || ""} ${dateTimeSelector.toHms || ""}`.trim()
    }
    await post(formData.value)
  }
  function errorMsg(msg: string) {
    $q.notify({
      type: "negative",
      message: t(msg),
      position: "top",
      timeout: 1000
    })
  }

  const validateLanguages = (array: { label: string; value: number; name?: string }[]) => {
    const missingItem = array.find((item: { label: string; value: number; name?: string }) => !item.name)
    if (missingItem) {
      $q.notify({
        type: "negative",
        message: `${t("common.please_enter_title")} (${missingItem.label})`,
        position: "top",
        timeout: 1000
      })
      return false
    }
    return true
  }
  const stepOne = () => {
    nextPrevStep(true)

    if (!validateLanguages(formData.value.titles)) return
    if (dateTimeSelector.from === undefined || dateTimeSelector.to === undefined) {
      errorMsg("error_msg.please_enter_date")
      return
    } else {
      nextPrevStep(true)
    }
  }
  const post = async (formDatas: GetCommissionSettingList) => {
    const { code, msg } = await postCommssionSetting(formDatas)
    if (code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 1000
      })
      setTimeout(() => {
        router.push({ name: "CommissionSettingList" })
        isLoading.value = false
      }, 500)
    } else {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 1000
      })
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

  function addStep() {
    formData.value.audit_rate =
      typeof formData.value.audit_rate === "string" ? parseFloat(formData.value.audit_rate) : formData.value.audit_rate
    if (typeof formData.value.audit_rate !== "number" || isNaN(formData.value.audit_rate)) {
      formData.value.audit_rate = 0
    }
    formData.value.audit_rate = preciseAdd(formData.value.audit_rate as number, auditMultipleStep)
  }
  function subStep() {
    formData.value.audit_rate =
      typeof formData.value.audit_rate === "string" ? parseFloat(formData.value.audit_rate) : formData.value.audit_rate
    if (typeof formData.value.audit_rate !== "number" || isNaN(formData.value.audit_rate)) {
      formData.value.audit_rate = 0
    }
    if (formData.value.audit_rate) {
      formData.value.audit_rate = preciseSubtract(formData.value.audit_rate, auditMultipleStep)
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
      const firstItemData = formTitles.value[language.value?.current]

      if (!firstItemData) {
        $q.notify({
          type: "negative",
          message: t("message.please_fill_the_first_language_content_before_using_ai_translation"),
          position: "top",
          timeout: 300
        })
        return
      }

      const languages = language.value.list.map((item) => item.label)
      const payload = [{ input_text: firstItemData.name, languages }]
      $q.loading.show()
      const { status, data } = await translateAiText(payload)
      if (status && Array.isArray(data) && data.length) {
        formTitles.value.forEach((item) => {
          item.name = data[0].translations[item.label]
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

  .radio-group {
    display: flex;
    flex-direction: column;
    width: 40%;
  }

  .radio-group > div {
    display: flex;
    margin-bottom: 0.8em;
  }

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

  .container {
    flex-direction: column;
  }

  .other-group > * {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 1.8em 0;
  }

  .title {
    font-size: 14px;
  }

  ::v-deep(.q-field__control) {
    min-width: 80px;
  }
  ::v-deep(.languageTab) {
    justify-content: left !important;
  }
</style>
