<template>
  <div>
    <div class="row column q-mb-md custom-hide bg-white q-pa-md bg-shadow">
      <div style="z-index: 2" v-if="useVisibleBtn">
        <div class="row items-center justify-between full-width" :class="{ 'q-mb-md': visible }">
          <!-- 靠左 -->
          <div class="q-mb-none blod h2-bold grey">
            <p v-if="useVisibleTitle">{{ t(route.meta.breadcrumb[0].i18nKey) }}</p>
          </div>

          <!-- 靠右 -->
          <q-btn fab-mini flat size="xs" class="q-px-md visible_btn" @click="store.toggleVisible">
            {{ $t(`common.${visible ? "hide_filter" : "show_filter"}`) }}
            <q-icon :name="visible ? 'expand_less' : 'expand_more'" class="q-ml-xs" />
          </q-btn>
        </div>
      </div>
      <q-form ref="formRef" class="col queryForm">
        <q-slide-transition>
          <div v-if="visible" class="row q-col-gutter-md">
            <template v-for="config in Object.keys(configs)" :key="config">
              <div
                v-if="selectFields.includes(getComponentName(config))"
                :class="[
                  initialEveryColumnClass,
                  { hidden: route.name === 'TeamAgentReport' && store.currencyList.length === 1 }
                ]"
              >
                <dynamicComponent
                  :hide-bottom-space="true"
                  :componentName="getComponentName(config)"
                  :name="configToNameMap[config]"
                  outlined
                  v-model="queryForm[configToNameMap[config]]"
                />
              </div>

              <div v-else-if="config === 'useGameCodeName'" class="col-12 col-sm-6 col-md-6 col-lg-4">
                <div class="row col-12 q-col-gutter-md">
                  <GameCode v-model="queryForm.gameCode" class="col-12 col-sm-6" />
                  <GameName
                    v-model="queryForm.gameName"
                    :isUseGameCode="true"
                    :gameCode="queryForm.gameCode"
                    class="col-12 col-sm-6"
                  />
                </div>
              </div>
              <div v-else-if="config === 'useDatePicker'" class="datePickerWrapper col-12 col-sm-4 col-md-4 col-lg-3">
                <DateTimePicker
                  :label="configs.customDateTimeLabelI18nKey"
                  :date-time-model="dateTimeSelector"
                  :on-update-date-time="onUpdateDateTime"
                  :use-time-picker="configs.useTimePicker"
                  :date-range-limit="configs.dateRangeLimit"
                  :quick-selectors="configs.dateTimeQuickSelectors"
                  :class="configs.useTimePicker ? 'time-picker' : 'date-picker'"
                />
              </div>
              <div v-else-if="config === 'useDatePicker2'" class="datePickerWrapper col-12 col-sm-4 col-md-4 col-lg-3">
                <DateTimePicker
                  :label="configs.customDateTimeLabelI18nKey2"
                  :date-time-model="dateTimeSelector2"
                  :on-update-date-time="onUpdateDateTime2"
                  :use-time-picker="configs.useTimePicker2"
                  :date-range-limit="configs.dateRangeLimit"
                  :quick-selectors="configs.dateTimeQuickSelectors"
                  :class="configs.useTimePicker2 ? 'time-picker' : 'date-picker'"
                />
              </div>
              <div
                v-else-if="config === 'useDatePickerSingle'"
                class="datePickerWrapper col-12 col-sm-4 col-md-4 col-lg-3"
              >
                <p>{{ configs.customDateTimeLabelI18nKey || t("common.select_date") }}</p>
                <DateTimePickerSingle
                  :label="configs.customDateTimeLabelI18nKey"
                  :date-time-model="dateTimeSelector"
                  :with-dense="true"
                  :useTimePicker="false"
                  :on-update-date-time="onUpdateDateTime"
                  :class="configs.useTimePicker ? 'time-picker' : 'date-picker'"
                />
              </div>
              <!-- 日期類型(申請日期/核准日期) -->
              <div v-else-if="config === 'useDateType'" class="col-12 col-sm-12 col-md-12 col-lg-3 q-flex">
                <q-option-group v-model="queryForm.dateType" :options="dateTypeList" color="primary" />
              </div>
              <!-- 複選日期類型(申請日期/核准日期) -->
              <div v-else-if="config === 'useMultiDateType'" class="col-12 col-sm-12 col-md-12 col-lg-auto q-flex">
                <q-option-group
                  v-if="queryForm.multiDateType"
                  v-model="queryForm.multiDateType"
                  :options="dateTypeList"
                  color="primary"
                  class="row column"
                  inline
                  type="checkbox"
                />
              </div>
              <div v-else-if="config === 'useBetReportDateType'" class="col-12 col-sm-12 col-md-12 col-lg-auto q-flex">
                <q-option-group
                  v-model="queryForm.dateType"
                  :options="betDateTypeList"
                  color="primary"
                  class="row column"
                  inline
                  type="checkbox"
                />
              </div>
              <!-- 複選日期類型(投注日期/核准日期) -->
              <div
                v-else-if="config === 'useMultiBetReportDateType'"
                class="col-12 col-sm-12 col-md-12 col-lg-auto q-flex"
              >
                <q-option-group
                  v-if="queryForm.multiDateType"
                  v-model="queryForm.multiDateType"
                  :options="betDateTypeList"
                  color="primary"
                  class="row column"
                  inline
                  type="checkbox"
                />
              </div>
              <!--日期類型-(建立時間/派發時間/領取時間/逾期時間) -->
              <!-- <div v-else-if="config === 'useReceiveDateType'" class="col-12 col-sm-12 col-md-12 col-lg-auto q-flex">
                <q-option-group v-model="queryForm.dateType" :options="ReceiveDateTypeList" color="primary" inline />
              </div> -->
              <div v-else-if="config === 'useDepositMethod'" :class="initialEveryColumnClass">
                <FundMethod v-model="queryForm.type" name="type" labelI18nKey="table_header.deposit_method" />
              </div>
              <div v-else-if="config === 'useWithdrawalMethod'" :class="initialEveryColumnClass">
                <FundMethod v-model="queryForm.type" name="type" labelI18nKey="table_header.withdrawal_method" />
              </div>
              <div v-else-if="config === 'useFreeRoundProduct'" :class="initialEveryColumnClass">
                <p>
                  {{ t("table_header.product") }}
                </p>
                <freeRoundProduct
                  :hide-bottom-space="true"
                  :name="configToNameMap[config]"
                  :currencyId="queryForm.currency || 0"
                  outlined
                  v-model="queryForm[configToNameMap[config]] as string | number | undefined"
                  @update:gameList="(newGameList) => (gameList = newGameList)"
                />
              </div>
              <div v-else-if="config === 'useFreeRoundGame'" :class="initialEveryColumnClass">
                <p>
                  {{ t("table_header.game") }}
                </p>
                <freeRoundGame
                  :hide-bottom-space="true"
                  :name="configToNameMap[config]"
                  :gameList="gameList"
                  outlined
                  v-model="queryForm[configToNameMap[config]] as string | number | undefined"
                />
              </div>
              <div v-else-if="resetFields.includes(config)" :key="config" :class="initialEveryColumnClass">
                <p>
                  {{ config === "useIp" ? "IP" : $t("query_params." + camelToSnake(config.substring(3))) }}
                </p>
                <queryInput
                  v-model.trim="queryForm[configToNameMap[config]]"
                  :name="configToNameMap[config]"
                  type="text"
                  class="queryInput"
                  outlined
                  clearable
                  dense
                  :standout="standoutColor(camelToSnake(config.substring(3)))"
                  rounded
                  :rules="configs[config + 'Rules'] ? configs[config + 'Rules'] : []"
                  lazy-rules
                  :placeholder="
                    config === 'useShareholderLevel' && configs.inputPlaceholder ? $t(configs.inputPlaceholder) : ''
                  "
                />
              </div>
            </template>

            <!-- Custom Fields -->
            <template v-if="configs.customFields">
              <template v-for="field in configs.customFields" :key="field.key">
                <div :class="field.width || initialEveryColumnClass">
                  <p v-if="field.label && field.type !== 'checkbox'">
                    {{ t(field.label) }}
                  </p>

                  <!-- Input Type -->
                  <queryInput
                    v-if="field.type === 'input'"
                    v-model.trim="queryForm[field.key]"
                    :name="field.key"
                    type="text"
                    class="queryInput"
                    outlined
                    :clearable="field.clearable !== false"
                    dense
                    standout="bg-white text-black"
                    rounded
                    :rules="field.rules || []"
                    lazy-rules
                    :placeholder="field.placeholder ? t(field.placeholder) : ''"
                  />

                  <!-- Select Type -->
                  <querySelect
                    v-else-if="field.type === 'select'"
                    :hide-bottom-space="true"
                    v-model="queryForm[field.key]"
                    :name="field.key"
                    :clearable="field.clearable !== false"
                    borderless
                    dense
                    standout="bg-white text-black"
                    rounded
                    :list="field.options || []"
                  />

                  <!-- Checkbox Type -->
                  <q-checkbox
                    v-else-if="field.type === 'checkbox'"
                    :model-value="getCheckboxCustomFieldValue(field.key)"
                    @update:model-value="updateCheckboxCustomFieldValue(field.key, $event)"
                    :label="field.label ? t(field.label) : undefined"
                    class="custom-checkbox-field"
                    dense
                  />
                </div>
              </template>
            </template>

            <div
              v-if="['TeamAgentReport', 'TeamAgentReportList', 'TeamAgentReportDetail'].includes(route.name)"
              class="text-[#E6A23C] w-full flex justify-end items-center mt-[1.46875rem] mb-[0.36875rem]"
            >
              <img src="~assets/images/common/remind.webp" class="w-6 h-6" />
              <span>{{ $t("common.team_data_large_time") }}</span>
            </div>

            <div class="col-12 row d-flex justify-end" :class="{ 'q-mt-md': route.name !== 'TeamAgentReport' }">
              <!-- 重設 -->
              <q-btn v-if="configs.useReset" color="grey" @click="onReset()" class="btns q-ml-xs">{{
                $t("btn.reset")
              }}</q-btn>
              <!-- 查詢 -->
              <q-btn @click="onSubmit()" :loading="spinShow" class="btns btn-blue q-ml-xs">
                <q-icon class="q-mr-xs" size="xs" name="search" />
                {{ $t("btn.search") }}
              </q-btn>
              <!-- 匯出 -->
              <q-btn v-if="configs.useExport" class="btns q-ml-xs btn-export" @click="onExport">
                <q-icon size="xs" name="archive" />
                {{ $t("btn.export") }}
              </q-btn>
            </div>
          </div>
        </q-slide-transition>
      </q-form>
    </div>

    <slot name="mainContent"></slot>

    <div class="pagination-container">
      <Pagination v-if="configs.usePagination" v-bind="pagination" />
    </div>
  </div>
</template>

<script lang="ts">
  import { type IQueryConfig, type IQueryParams } from "@/components/query/types/common"
  export { IQueryConfig }
</script>
<script lang="ts" setup>
  import DateTimePicker from "@/components/query/dateTimePicker.vue"
  import DateTimePickerSingle from "@/components/query/dateTimePickerSingle.vue"

  import DateTimeQuickSelector from "@/components/query/buttons/dateTimeQuickSelector.vue"
  import dynamicComponent from "@/components/query/dynamicComponent.vue"
  import queryInput from "@/components/query/input.vue"
  import querySelect from "@/components/query/selects/base.vue"
  import type { IPaginationResults, IPaginationSettings } from "@/components/query/pagination.vue"
  import Pagination, { allowPerPageList } from "@/components/query/pagination.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useQueryStore } from "@/stores/queryStore"
  import { useSiteStore } from "@/stores/siteStore"
  import { EventBusKey } from "@/symbols"
  import * as CONSTANTS from "@/utils/constants"
  import { injectStrict } from "@/utils/injectTyped"
  import { storeToRefs } from "pinia"
  import { useQuasar, type QForm } from "quasar"
  import { equals } from "ramda"
  import type { PropType } from "vue"
  import { defineProps, nextTick, onMounted, onUnmounted, reactive, ref, watchEffect, computed, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import GameCode from "@/components/query/selects/gameCode.vue"
  import GameName from "@/components/query/selects/gameName.vue"

  import GameProduct from "@/components/query/selects/gameTypeV2.vue"
  import GameProductType from "@/components/query/selects/gameProductType.vue"
  import FundMethod from "@/components/query/selects/fundMethod.vue"
  import freeRoundProduct from "@/components/query/selects/freeRoundProduct.vue"
  import freeRoundGame from "@/components/query/selects/freeRoundGame.vue"
  import { useTimeZoneStore } from "@/stores/timezoneStore"

  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const { genTimeFormat, genDate, numberEnumToArray } = useCommon()

  const store = useQueryStore()
  const eventbus = injectStrict(EventBusKey)
  const timezoneStore = useTimeZoneStore()

  interface IDropdownItem<T> {
    label: string
    value: T
  }

  const props = defineProps({
    configs: {
      type: Object as PropType<IQueryConfig>,
      required: true,
      default: () => {
        return {}
      }
    },
    /** 總筆數 */
    total: {
      type: [Number],
      required: false,
      default: 0
    }
  })

  const emit = defineEmits(["queryUpdate", "queryExport", "queryCatchForm", "queryFieldChange"])

  const formRef = ref<QForm | null>(null)
  const queryForm = reactive<Partial<IQueryParams>>({})
  const gameList = ref<Array<{ game_code: string; game_name: string }>>([])

  const isCheckboxCustomField = (key: string) => {
    return props.configs.customFields?.some((field) => field.type === "checkbox" && field.key === key) ?? false
  }

  const getBooleanQueryValue = (value: unknown) => {
    const queryValue = Array.isArray(value) ? value[0] : value
    return queryValue === "true"
  }
  const getCheckboxCustomFieldValue = (key: string) => queryForm[key] === true
  const updateCheckboxCustomFieldValue = (key: string, value: boolean) => {
    queryForm[key] = value
  }

  onMounted(() => {
    if (props.configs.customFields) {
      props.configs.customFields.forEach((field) => {
        if (field.defaultValue !== undefined && queryForm[field.key] === undefined) {
          queryForm[field.key] = field.defaultValue
        }
      })
    }
  })

  defineExpose({
    queryForm,
    onSubmit
  })

  function standoutColor(c) {
    switch (c) {
      case "member_account":
        return "bg-white text-black"
      case "general_agent_account":
        return "bg-green text-white"
      // 其他情况，你可以根据需要添加更多的case
      default:
        return "bg-gray text-white" // 默认情况
    }
  }

  const useVisibleBtn = computed(() => {
    return props.configs.useVisibleBtn === undefined ? true : props.configs.useVisibleBtn
  })
  const useVisibleTitle = computed(() => {
    return props.configs.useVisibleTitle === undefined ? true : props.configs.useVisibleTitle
  })
  function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter, index) => (index === 0 ? letter.toLowerCase() : `_${letter.toLowerCase()}`))
  }

  // 下拉選單資料
  let dropdownData = reactive({
    dateTypeList: [] as IDropdownItem<CONSTANTS.DATE_TYPE.Enums>[],
    betDateTypeList: [] as IDropdownItem<CONSTANTS.BET_REPORT_DATE_TYPE.Enums>[],
    ReceiveDateTypeList: [] as IDropdownItem<CONSTANTS.RECEIVE_DATE_TYPE.Enums>[]
  })

  // 分頁資料
  const pagination = reactive<IPaginationSettings>({
    page: 1,
    perPage: 20,
    offset: 0,
    total: 0,
    onPagination
  })

  watchEffect(() => {
    pagination.total = props.total
  })

  // 监听 queryForm 的变化，当任何查询字段值发生变化时，抛出事件
  watch(
    () => queryForm,
    (newValue, oldValue) => {
      // 过滤掉 undefined、空字符串、null、空数组的参数
      const filterQueryForm = Object.entries(newValue).reduce(
        (filteredQuery, [key, value]) => {
          if (value !== undefined && value !== "" && value !== null && !(Array.isArray(value) && value.length === 0)) {
            filteredQuery[key] = value
          }
          return filteredQuery
        },
        {} as Record<string, any>
      )

      // 抛出字段变化事件
      emit("queryFieldChange", {
        queryForm: filterQueryForm,
        rawQueryForm: newValue
      })
    },
    { deep: true }
  )

  let cacheQuery = {}

  function hardCodeQuery(query: any) {
    const routeQuery = route.query

    // currency_id為memberlist頁的特規篩選條件
    const hardCodeColumns = ["order_type", "sort_type", "currency_id"]

    for (const key in routeQuery) {
      if (hardCodeColumns.includes(key)) {
        query[key] = routeQuery[key]
      }
    }
  }

  function onSubmit() {
    if (props.configs.usePagination) {
      // 重新搜尋時，預設頁碼回到第1頁
      pagination.page = 1
    }

    handleSubmit()
  }

  async function handleSubmit() {
    const formValidate = await formRef.value?.validate()
    if (!formValidate) return

    if (
      props.configs.useDatePicker ||
      props.configs.useDateType ||
      props.configs.useBetReportDateType ||
      props.configs.useReceiveDateType ||
      props.configs.useMultiDateType ||
      props.configs.useDatePickerSingle
    ) {
      if (!props.configs.dateTimeIsUnnecessary && (!dateTimeSelector.from || !dateTimeSelector.to)) {
        return
      }
      if (dateTimeSelector.from) {
        let fromHms = "00:00:00"

        if (props.configs.useTimePicker && dateTimeSelector.fromHms) {
          fromHms = dateTimeSelector.fromHms
        }
        queryForm.start = new Date(`${dateTimeSelector.from} ${fromHms}.000`).valueOf()
      } else {
        queryForm.start = undefined
      }

      if (dateTimeSelector.to) {
        let toHms = "23:59:59"

        if (props.configs.useTimePicker && dateTimeSelector.toHms) {
          toHms = dateTimeSelector.toHms
        }
        queryForm.end = new Date(`${dateTimeSelector.to} ${toHms}.999`).valueOf()
      } else {
        queryForm.end = undefined
      }
    }
    if (props.configs.useDatePicker2) {
      if (dateTimeSelector2.from) {
        let fromHms = "00:00:00"

        if (props.configs.useTimePicker2 && dateTimeSelector2.fromHms) {
          fromHms = dateTimeSelector2.fromHms
        }
        queryForm.start2 = new Date(`${dateTimeSelector2.from} ${fromHms}.000`).valueOf()
      } else {
        queryForm.start2 = undefined
      }

      if (dateTimeSelector2.to) {
        let toHms = "23:59:59"

        if (props.configs.useTimePicker2 && dateTimeSelector2.toHms) {
          toHms = dateTimeSelector2.toHms
        }
        queryForm.end2 = new Date(`${dateTimeSelector2.to} ${toHms}.999`).valueOf()
      } else {
        queryForm.end2 = undefined
      }
    }

    // if (props.configs.useDateType && !queryForm?.dateType?.length) {
    //   $q.notify({
    //     type: "negative",
    //     message: t("error_msg.date_type_is_required"),
    //     position: "top",
    //     timeout: 300
    //   })
    //   return
    // }

    // 過濾掉 undefined、空字串、null，或是空陣列 的參數
    const filterQueryForm = Object.entries(queryForm).reduce((filteredQuery, [key, value]) => {
      // 如果 value 不是 undefined、空字符串、null、空数组或数组长度为 0，则保留该参数
      if (value !== undefined && value !== "" && value !== null && !(Array.isArray(value) && value.length === 0)) {
        filteredQuery[key] = value
      }
      return filteredQuery
    }, {})

    const newCacheQuery = {
      ...filterQueryForm
    }

    // 若 allowSameSubmit 為 false 時，比較 cacheQuery 與 filterQueryForm，相同則不送出
    if (!props.configs.allowSameSubmit && equals(cacheQuery, newCacheQuery)) {
      return
    }

    cacheQuery = newCacheQuery
    const _pagination = props.configs.usePagination
      ? {
          offset: pagination.offset,
          size: pagination.perPage
        }
      : undefined

    const query = Object.assign({}, null, {
      ...cacheQuery,
      ..._pagination
    })

    hardCodeQuery(query)

    const location = { query }
    router.push(location).then(async () => {
      emit("queryUpdate", query)
    })
  }

  const dateTimeSelector = reactive<{ from?: string; fromHms?: string; to?: string; toHms?: string }>({
    from: undefined,
    fromHms: undefined,
    to: undefined,
    toHms: undefined
  })
  const onUpdateDateTime = (newValue: { from: string; fromHms?: string; to: string; toHms?: string }) => {
    console.log(newValue)
    if (!newValue) {
      dateTimeSelector.from = undefined
      dateTimeSelector.fromHms = undefined
      dateTimeSelector.to = undefined
      dateTimeSelector.toHms = undefined
      //onQueryForm()
      return
    }
    dateTimeSelector.from = newValue.from
    dateTimeSelector.fromHms = newValue.fromHms
    dateTimeSelector.to = newValue.to
    dateTimeSelector.toHms = newValue.toHms
    //onQueryForm()
  }
  const dateTimeSelector2 = reactive<{ from?: string; fromHms?: string; to?: string; toHms?: string }>({
    from: undefined,
    fromHms: undefined,
    to: undefined,
    toHms: undefined
  })
  const onUpdateDateTime2 = (newValue: { from: string; fromHms?: string; to: string; toHms?: string }) => {
    if (!newValue) {
      dateTimeSelector2.from = undefined
      dateTimeSelector2.fromHms = undefined
      dateTimeSelector2.to = undefined
      dateTimeSelector2.toHms = undefined
      return
    }
    dateTimeSelector2.from = newValue.from
    dateTimeSelector2.fromHms = newValue.fromHms
    dateTimeSelector2.to = newValue.to
    dateTimeSelector2.toHms = newValue.toHms
  }

  function getComponentName(cname: string) {
    return cname.substring(3).charAt(0).toLowerCase() + cname.substring(4)
  }
  const selectFields = [
    "enableStatus",
    "frozenStatus",
    "memberTag",
    "commissionGroup",
    "memberTagType",
    "depositStatus",
    "withdrawStatus",
    "memberLevel",
    "quotaType",
    "quotaModifyReason",
    "agentAccount",
    "adminAgentAccount",
    // "auroraAdminAgentAccount",
    "currency",
    "accountFlowType",
    "product",
    "gameType",
    "gameTypeAll",
    "gameProductAll",
    "gameCode",
    "gameProductCode",
    "gameName",
    "monitoringType",
    "rewardType",
    "pageLog",
    "permissionLevel",
    "frontendStatus",
    "agentStatus",
    "eventType",
    "distributionStatus",
    "sendType",
    "siteOperationType",
    "fundMethod",
    "service",
    "paymentType",
    "saveStatus",
    "firstDeposit",
    "tierWhenDepositing",
    "payer",
    "operator",
    "tierWhenWithdrawal",
    "announcementType",
    "documentType",
    "displayObjectType",
    "documentDownloadObjectType",
    "tradingActionType",
    "accountStatus",
    "giftType",
    "receiveStatus",
    "memberLevelAfterChange",
    "excludeMemberTag",
    "excludeMemberLevel",
    "excludeRecommender",
    "selfExclusionStatus",
    "walletType",
    "activeStatus",
    "gamingSite",
    "gamingSiteAll",
    "calculateType",
    "agentCommissionCalculationType",
    "receiveDateType",
    "bettingStatus",
    "progressStatus",
    "agentQuotaAdjustType",
    "intent",
    "taskName",
    "taskStatus",
    "spinCountType",
    "referralWheelList",
    "integration",
    "integrationStatus",
    "productStatus",
    "gameTypeV2",
    "productCodeV2",
    "freeRoundStatus",
    "prizeType",
    "warningStatus",
    "warningType",
    "agentGameCode",
    "cashFlowType",
    "gatewayMerchant",
    "identity",
    "kycIdType",
    "kycStatus",
    "registerMethod"
  ]

  // 映射配置和相應的name值
  const configToNameMap: { [key: string]: string } = {
    useMemberAccount: "memberAccount",
    useIp: "ip",
    useGeneralAgentAccount: "genaralAgentAccount",
    useAgentAccount: "agentAccount",
    useAdminAgentAccount: "adminAgentAccount",
    useAuroraAdminAgentAccount: "auroraAdminAgentAccount",
    useEnableStatus: "enable",
    useDepositStatus: "depositStatus",
    useWithdrawStatus: "withdrawStatus",
    useFrozenStatus: "frozenStatus",
    useRecommender: "recommender",
    useExcludeRecommender: "exclude_parent_ids",
    useMemberTag: "memberTag",
    useExcludeMemberTag: "not_label",
    useMemberTagType: "memberTagType",
    useEmail: "email",
    usePayoutIdentity: "payout_identity",
    useMemberLevel: "memberLevel",
    useExcludeMemberLevel: "not_level",
    useDepositNumber: "depositNumber",
    useWithdrawNumber: "withdrawNumber",
    useRefTransCode: "ref_trans_code",
    useCurrency: "currency",
    useProduct: "product",
    useGameType: "game_type",
    useGameProductAll: "product_code",
    useGameCode: "code",
    useDateType: "dateType",
    useMultiDateType: "dateType",
    useMultiBetReportDateType: "dateType",
    useBetReportDateType: "dateType",
    useReceiveDateType: "dateType",
    useQuotaType: "quotaType",
    useOrderNumber: "orderNumber",
    useQuotaModifyReason: "quotaModifyReason",
    useName: "name",
    usePhone: "phone",
    useUid: "uid",
    usePermissionLevel: "permissionLevel",
    usePageLog: "pageLog",
    useKeyword: "keyword",
    useAccountStatus: "accountStatus",
    useMasterAgentName: "masterAgentName",
    useGeneralAgent: "generalAgent",
    useAgent: "agent",
    useAgentId: "agentId",
    useAgentAccountInput: "agentAccount",
    useFrontendStatus: "frontendStatus",
    useAgentStatus: "agentStatus",
    useGameName: "gameName",
    useEventName: "title",
    useTitle: "title",
    useEventType: "type",
    useDistributionStatus: "status",
    useSendType: "dispatch_type",
    useCode: "code",
    useCommissionGroup: "commissionGroup",
    useRewardType: "rewardType",
    useMonitoringType: "monitoringType",
    useAccountFlowType: "accountFlowType",
    useTransactionNumber: "transactionNumber",
    useSiteOperationType: "siteOperationType",
    useAgentName: "agentName",
    usePayerName: "name",
    useFundMethod: "type",
    useService: "service",
    useCommissionName: "commissionName",
    usePaymentType: "paymentType",
    useSaveStatus: "saveStatus",
    useFirstDeposit: "firstDeposit",
    useTierWhenDepositing: "tierWhenDepositing",
    usePayer: "payer",
    useOperator: "operator",
    useWithdrawalNumber: "withdrawalNumber",
    useTierWhenWithdrawal: "tierWhenWithdrawal",
    useBetNumber: "betNumber",
    useAnnouncementType: "announcementType",
    useDocumentType: "documentType",
    useDisplayObjectType: "displayObjectType",
    useDocumentDownloadObjectType: "documentDownloadObjectType",
    useTradingActionType: "tradingActionType",
    useGroupName: "groupName",
    useGiftType: "giftType",
    useGiftName: "giftName",
    useReceiveStatus: "receiveStatus",
    useUsername: "username",
    useAccount: "account",
    useMemberLevelAfterChange: "memberLevel",
    useSelfExclusionStatus: "selfExclusionStatus",
    useWalletType: "wallet_type",
    useActiveStatus: "activeStatus",
    useCollaborationDomain: "title",
    useGamingSite: "gaming_site",
    useGamingSiteAll: "gaming_site",
    useCalculateType: "calculate_type",
    useAgentCommissionCalculationType: "calculation_type",
    useBettingStatus: "enable",
    useProgressStatus: "status",
    useAgentQuotaAdjustType: "type",
    useIntent: "intent",
    useTaskName: "taskName",
    useTaskStatus: "taskStatus",
    useShareholderAccount: "account",
    useShareholderLevel: "tier",
    useSpinCountType: "spinCountType",
    useReferralWheelList: "referralWheelList",
    useIntegration: "integration_id",
    useProductCode: "product_code",
    useProductNames: "product_name",
    useProductGameName: "name",
    useProductGameCode: "code",
    useIntegrationStatus: "integration_status",
    useProductStatus: "status",
    useGameTypeV2: "game_type",
    useProductCodeV2: "product_code",
    useFreeRoundStatus: "freeRoundStatus",
    useFreeRoundProduct: "freeRoundProduct",
    useFreeRoundGame: "freeRoundGame",
    usePrizeType: "prizeType",
    useWarningStatus: "status",
    useWarningType: "reason_type",
    useAgentGameCode: "product_code",
    useCashFlowType: "type",
    useGatewayMerchant: "payment_gateway_name",
    useIdentity: "identity",
    useKycIdType: "type",
    useKycStatus: "status",
    useRegisterMethod: "register_method"
  }

  const resetFields = Object.keys(configToNameMap)

  function onReset() {
    const nowDate = genTimeFormat(new Date(), "yyyy-MM-dd")
    const resetValues: Record<string, string | undefined> = {
      from: nowDate,
      fromHms: "00:00:00",
      to: nowDate,
      toHms: "23:59:59"
    }

    resetFields.forEach((field) => {
      if (props.configs.customFields) {
        // Reset custom fields
        props.configs.customFields.forEach((field) => {
          queryForm[field.key] = field.defaultValue !== undefined ? field.defaultValue : undefined
        })
      }

      if (props.configs[field]) {
        const fieldName = camelToSnake(field.substring(3)) // 刪除 "use" 前綴
        queryForm[fieldName] = resetValues[fieldName] !== undefined ? resetValues[fieldName] : undefined
      }
    })

    formRef.value?.resetValidation()
  }

  function onExport() {
    // 過濾掉 undefined、空字串、null，或是空陣列 的參數
    const filterQueryForm = Object.entries(queryForm).reduce((filteredQuery, [key, value]) => {
      // 如果 value 不是 undefined、空字符串、null、空数组或数组长度为 0，则保留该参数
      if (value !== undefined && value !== "" && value !== null && !(Array.isArray(value) && value.length === 0)) {
        filteredQuery[key] = value
      }
      return filteredQuery
    }, {})
    emit("queryExport", filterQueryForm)
  }

  // 變更頁碼
  async function onPagination(result: IPaginationResults) {
    pagination.page = result.page
    pagination.perPage = result.perPage

    const query = Object.assign({}, null, {
      ...cacheQuery,
      offset: (pagination.page - 1) * pagination.perPage,
      size: pagination.perPage
    })
    hardCodeQuery(query)

    const location = { query }

    router.push(location).then(async () => {
      emit("queryUpdate", query)
    })
  }

  const initialEveryColumnClass = ref("col-12 col-sm-3 col-md-3")
  const { visible, spinShow } = storeToRefs(store)

  // 初始化元件
  onMounted(async () => {
    if (props.configs.filterShowOnLoaded) {
      store.setVisibleShow()
    } else {
      store.setVisibleHide()
    }
    // 一進頁面就先載入幣別
    await store.getCurrencyList()
    await store.getGameTypeList()
    for (const key in route.query) {
      if (Object.prototype.hasOwnProperty.call(route.query, key)) {
        const value = route.query[key] as (typeof queryForm)[typeof key]
        queryForm[key] = value

        if (isCheckboxCustomField(key)) {
          queryForm[key] = getBooleanQueryValue(value)
        }
        if (key === "multiDateType") {
          if (typeof value === "string") {
            queryForm.multiDateType = [parseInt(value)]
          }
          if (Array.isArray(value)) {
            queryForm.multiDateType = value.map((e) => parseInt(e as any as string))
          }
        }
        if (key === "accountFlowType") {
          if (typeof value === "string") {
            queryForm.accountFlowType = [parseInt(value)]
          }
          if (Array.isArray(value)) {
            queryForm.accountFlowType = value.map((e) => parseInt(e as any as string))
          }
        }
      }
    }
    eventbus.on("toggleVisibles", () => {
      store.toggleVisible()
    })

    if (props.configs.everyColumnsClass) {
      initialEveryColumnClass.value = props.configs.everyColumnsClass
    }

    if (props.configs.usePagination && (route.query.offset || route.query.offset === "0") && !!route.query.size) {
      const { offset, size } = route.query

      if (typeof offset === "string" && typeof size === "string") {
        pagination.page = Math.floor(parseInt(offset) / parseInt(size)) + 1
        pagination.offset = parseInt(offset)
        pagination.perPage = parseInt(size)
      }

      pagination.perPage =
        typeof size === "string" && allowPerPageList.includes(parseInt(size)) ? parseInt(size) : allowPerPageList[0]
    }

    if (props.configs.useDateType || props.configs.useBetReportDateType) {
      queryForm.dateType = CONSTANTS.DATE_TYPE.Enums.Apply
    }

    if (props.configs.useReceiveDateType) {
      queryForm.dateType = CONSTANTS.RECEIVE_DATE_TYPE.Enums.Created
    }
    if (props.configs.useMultiDateType && !queryForm.multiDateType) {
      queryForm.multiDateType = []
    }
    if (props.configs.useMultiBetReportDateType && !queryForm.multiDateType) {
      queryForm.multiDateType = []
    }
    if (props.configs.useGamingSiteAll) {
      queryForm.gaming_site = -1
    }

    if (
      props.configs.useDatePicker ||
      props.configs.useDateType ||
      props.configs.useBetReportDateType ||
      props.configs.useReceiveDateType ||
      props.configs.useMultiDateType ||
      props.configs.useDatePickerSingle
    ) {
      const now = new Date()
      const daysAgo = new Date(now)
      daysAgo.setDate(
        now.getDate() -
          (props.configs.initialDateRange === undefined || props.configs.initialDateRange === null
            ? 0
            : props.configs.initialDateRange)
      )
      if (route.query.start) {
        try {
          dateTimeSelector.from = genTimeFormat(parseInt(route.query.start as string), "yyyy-MM-dd", false)
          console.log(dateTimeSelector.from)
        } catch (e: any) {
          // dateTimeSelector.from = genTimeFormat(now, "yyyy-MM-dd")
          dateTimeSelector.from = genDate(daysAgo, "yyyy-MM-dd")
        }

        if (props.configs.useTimePicker) {
          try {
            dateTimeSelector.fromHms = genTimeFormat(parseInt(route.query.start as string), "HH:mm:ss", false)
          } catch (e: any) {
            dateTimeSelector.fromHms = "00:00:00"
          }
        }
      } else {
        if (props.configs.dateTimeIsUnnecessary) {
          // 若時間篩選條件非必填，則預設值為 undefined
          dateTimeSelector.from = undefined
        } else {
          // dateTimeSelector.from = genTimeFormat(now, "yyyy-MM-dd")
          dateTimeSelector.from = genDate(daysAgo, "yyyy-MM-dd")
          if (props.configs.useTimePicker) {
            dateTimeSelector.fromHms = "00:00:00"
          }
        }
      }

      if (route.query.end) {
        try {
          dateTimeSelector.to = genTimeFormat(parseInt(route.query.end as string), "yyyy-MM-dd", false)
        } catch (e: any) {
          dateTimeSelector.to = genTimeFormat(now, "yyyy-MM-dd")
        }
        if (props.configs.useTimePicker) {
          try {
            dateTimeSelector.toHms = genTimeFormat(parseInt(route.query.end as string), "HH:mm:ss", false)
          } catch (e: any) {
            dateTimeSelector.toHms = "23:59:59"
          }
        }
      } else {
        if (props.configs.dateTimeIsUnnecessary) {
          // 若時間篩選條件非必填，則預設值為 undefined
          dateTimeSelector.to = undefined
        } else {
          dateTimeSelector.to = genTimeFormat(now, "yyyy-MM-dd", false)

          if (props.configs.useTimePicker) {
            dateTimeSelector.toHms = "23:59:59"
          }
        }
      }
    }

    if (props.configs.useDatePicker2) {
      const now = new Date()
      const daysAgo = new Date(now)
      daysAgo.setDate(
        now.getDate() -
          (props.configs.initialDateRange === undefined || props.configs.initialDateRange === null
            ? 0
            : props.configs.initialDateRange)
      )
      if (route.query.start2) {
        try {
          dateTimeSelector2.from = genTimeFormat(parseInt(route.query.start2 as string), "yyyy-MM-dd", false)
        } catch (e: any) {
          // dateTimeSelector.from = genTimeFormat(now, "yyyy-MM-dd")
          dateTimeSelector2.from = genDate(daysAgo, "yyyy-MM-dd")
        }

        if (props.configs.useTimePicker2) {
          try {
            dateTimeSelector2.fromHms = genTimeFormat(parseInt(route.query.start2 as string), "HH:mm:ss", false)
          } catch (e: any) {
            dateTimeSelector2.fromHms = "00:00:00"
          }
        }
      } else {
        if (props.configs.dateTimeIsUnnecessary) {
          // 若時間篩選條件非必填，則預設值為 undefined
          dateTimeSelector2.from = undefined
        } else {
          // dateTimeSelector.from = genTimeFormat(now, "yyyy-MM-dd")
          dateTimeSelector2.from = genDate(daysAgo, "yyyy-MM-dd")
          if (props.configs.useTimePicker) {
            dateTimeSelector2.fromHms = "00:00:00"
          }
        }
      }

      if (route.query.end2) {
        try {
          dateTimeSelector2.to = genTimeFormat(parseInt(route.query.end2 as string), "yyyy-MM-dd", false)
        } catch (e: any) {
          dateTimeSelector2.to = genTimeFormat(now, "yyyy-MM-dd")
        }
        if (props.configs.useTimePicker2) {
          try {
            dateTimeSelector2.toHms = genTimeFormat(parseInt(route.query.end2 as string), "HH:mm:ss", false)
          } catch (e: any) {
            dateTimeSelector2.toHms = "23:59:59"
          }
        }
      } else {
        if (props.configs.dateTimeIsUnnecessary) {
          // 若時間篩選條件非必填，則預設值為 undefined
          dateTimeSelector2.to = undefined
        } else {
          dateTimeSelector2.to = genTimeFormat(now, "yyyy-MM-dd", false)

          if (props.configs.useTimePicker2) {
            dateTimeSelector2.toHms = "23:59:59"
          }
        }
      }
    }

    /**
     * 依客戶需求客製化
     * 當幣別清單只有一筆時，打開頁面時預設選中第一個幣別
     */
    if (props.configs.useCurrency) {
      if (queryForm.currency === undefined || queryForm.currency === null || queryForm.currency === "") {
        if (store.currencyList.length >= 1) {
          const siteStore = useSiteStore()
          const isSkg1 = siteStore.agent_code?.toLowerCase() === "skg1"
          const path = route.path || ""
          const usdItem = isSkg1
            ? store.currencyList.find((item) => item.value === CONSTANTS.CURRENCY_TYPE.Enums.USD)
            : undefined
          queryForm.currency = usdItem ? usdItem.value : store.currencyList[0].value
        }
      }
    }

    // if (props.configs.useGameType) {
    //   queryForm.game_type = store.gameTypeList.map((item) => item.value as number)
    // }

    if (props.configs.submitOnLoaded) {
      nextTick(() => {
        handleSubmit()
      })
    }
  })

  // 日期類型(申請日期/核准日期)
  const dateTypeList = computed(() => {
    store.getDateType()
    const list: IDropdownItem<CONSTANTS.DATE_TYPE.Enums>[] = []
    store.dateType.forEach((status) => {
      if (status) {
        list.push({
          label: t((CONSTANTS.DATE_TYPE.I18nKeys as any)[status] || "common.unknow"),
          value: status
        })
      }
    })
    return list
  })

  //日期類型-投注紀錄(投注日期/结算日期)
  const betDateTypeList = computed(() => {
    store.getDateType()
    const list: IDropdownItem<CONSTANTS.BET_REPORT_DATE_TYPE.Enums>[] = []
    store.dateType.forEach((status) => {
      list.push({
        label: t((CONSTANTS.BET_REPORT_DATE_TYPE.I18nKeys as any)[status] || "common.unknow"),
        value: status
      })
    })
    return list.slice(0, 2)
  })

  //日期類型-(建立時間/派發時間/領取時間/逾期時間)
  const ReceiveDateTypeList = computed(() => {
    const list: IDropdownItem<CONSTANTS.RECEIVE_DATE_TYPE.Enums>[] = []
    numberEnumToArray(CONSTANTS.RECEIVE_DATE_TYPE.Enums).forEach((item) => {
      list.push({
        label: t(
          CONSTANTS.RECEIVE_DATE_TYPE.I18nKeys[item as keyof typeof CONSTANTS.RECEIVE_DATE_TYPE.I18nKeys] ||
            "common.unknow"
        ),
        value: item as number
      })
    })
    return list
  })

  /*function onQueryForm() {
        // 過濾掉 undefined、空字串、null，或是空陣列 的參數
        const filterQueryForm = Object.entries(queryForm).reduce<Record<string, string | number | boolean | null | any[]>>(
          (filteredQuery, [key, value]) => {
            // 如果 value 不是 undefined、空字符串、null、空数组或数组长度为 0，则保留该参数
            if (value !== undefined && value !== "" && value !== null && !(Array.isArray(value) && value.length === 0)) {
              filteredQuery[key] = value
            }
            return filteredQuery
          },
          {}
        )
        if (dateTimeSelector.from) {
          let fromHms = "00:00:00"
          if (props.configs.useTimePicker && dateTimeSelector.fromHms) {
            fromHms = dateTimeSelector.fromHms
          }
          // 插入 start 参数
          filterQueryForm["start"] = new Date(`${dateTimeSelector.from} ${fromHms}.000`).valueOf()
        }
        if (dateTimeSelector.to) {
          let toHms = "23:59:59"
          if (props.configs.useTimePicker && dateTimeSelector.toHms) {
            toHms = dateTimeSelector.toHms
          }
          // 插入 end 参数
          filterQueryForm["end"] = new Date(`${dateTimeSelector.to} ${toHms}.999`).valueOf()
        }

        emit("queryCatchForm", filterQueryForm)
      }*/

  // 监听货币变化，重置产品和游戏选择
  watch(
    () => queryForm.currency,
    () => {
      // 重置产品选择
      queryForm.freeRoundProduct = undefined
      // 重置游戏选择
      queryForm.freeRoundGame = undefined
      // 清空游戏列表
      gameList.value = []
    }
  )

  onUnmounted(() => {
    eventbus.off("toggleVisibles")
  })
</script>

<style lang="scss" scoped>
  ::v-deep(.q-field__control),
  ::v-deep(.q-field__marginal) {
    height: unset !important;
  }
  ::v-deep(.q-field__control-container) {
    white-space: nowrap;
    overflow: hidden;
  }
  .absolute-right {
    bottom: auto;
  }

  .datePickerWrapper {
    display: block;

    .date-picker {
      min-width: 240px;
    }

    .time-picker {
      width: auto;
      //min-width: 370px;
    }
  }
  .visible_btn {
    color: #858585;
  }

  .pagination-container {
    background-color: #fff;
    border-radius: 0 0 10px 10px;
    padding: 1rem;
  }

  .custom-checkbox-field {
    align-items: center;
    min-height: 40px;

    ::v-deep(.q-checkbox__inner) {
      width: 1em;
      min-width: 1em;
      height: 1em;
      font-size: 14px;
    }

    ::v-deep(.q-checkbox__bg) {
      width: 1em;
      height: 1em;
      top: 0;
      left: 0;
    }

    ::v-deep(.q-checkbox__label) {
      font-size: 14px;
      line-height: 1;
    }
  }

  .account-flow-audit-checkbox-field {
    display: flex;
    align-items: flex-start;
    padding-top: 37px;
  }
</style>
