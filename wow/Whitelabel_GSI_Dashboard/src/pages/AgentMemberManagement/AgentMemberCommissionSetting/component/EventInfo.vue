<template>
  <div>
    <!-- 前端資訊tabs -->
    <q-card-section class="q-pb-xs" style="background-color: rgb(252, 248, 255)">
      <div class="row tab-container q-col-gutter-md">
        <div class="col-2">
          <div class="q-pb-lg">{{ $t("query_params.commission_name") }}</div>
          <div class="row q-col-gutter-xl">
            <div class="col-12">
              <q-input bg-color="white" v-model="form.name" square borderless dense class="edit-input" />
            </div>
          </div>
          <!--<q-tabs v-model="language.current" class="justify-start bottom_border">
            <q-tab
              v-for="item in form.info"
              :key="item.lang"
              :name="item.lang"
              :label="$t(LANGUAGE_TYPE.I18nKeys[item.lang])"
            />
          </q-tabs>
          <q-tab-panels v-model="language.current" animated class="q-mt-md">
            <q-tab-panel v-for="item in form.info" :name="item.lang" class="q-px-none">
              <div class="row q-col-gutter-xl">
                <div class="col-12">
                  <q-input v-model="item.title" square borderless dense class="edit-input" />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>-->
        </div>
        <div class="col-2">
          <div class="row q-col-gutter-xl">
            <div class="col-12">
              <div class="q-pb-lg">{{ $t("query_params.member_account") }}</div>

              <q-select
                v-model="form.member_ids"
                :options="accountOption"
                use-input
                use-chips
                multiple
                fill-input
                input-debounce="0"
                emit-value
                map-options
                bg-color="white"
                @filter="filterAccount"
                outlined
                square
                borderless
                dense
                bottom-slots
                :disable="readOnly"
              >
                <template v-slot:append>
                  <q-icon name="search" @click.stop.prevent />
                </template>
              </q-select>
            </div>
          </div>
        </div>
        <!-- 結算週期 -->
        <div class="col-2">
          <div class="q-pb-xs">{{ $t("table_header.settle_cycle") }}</div>
          <div class="q-pt-sm">
            <div class="row items-center col-12">
              <q-radio v-model="form.settlement_type" :val="1" :label="$t('settlement_cycle.daily')" />
              <div class="q-ml-md">
                <q-icon name="schedule" class="q-mr-xs" />
                00:00
                <span class="q-mx-sm">-</span>
                <q-icon name="schedule" class="q-mr-xs" />
                23:59
              </div>
            </div>
            <div class="row items-center col-12">
              <q-radio v-model="form.settlement_type" :val="2" :label="$t('settlement_cycle.weekly')" />
              <div class="q-ml-md row items-center">
                <span class="">{{ $t("common.every_week") }}</span>
                <q-select
                  v-model="form.settlement_week"
                  :options="weekDropdownList"
                  class="edit-input q-ml-md"
                  borderless
                  dense
                  emit-value
                  map-options
                  standout="bg-white text-black"
                  rounded
                  bg-color="white"
                />
              </div>
            </div>
            <div class="row items-center col-12">
              <q-radio v-model="form.settlement_type" :val="3" :label="$t('settlement_cycle.monthly')" />
            </div>
          </div>
        </div>
        <div class="col-2" style="width: 12% !important">
          <div class="q-pb-xs">{{ $t("table_header.calculate_type") }}</div>
          <div class="q-pt-sm">
            <div class="row items-center col-12">
              <q-radio v-model="commissionForm.calculation_type" :val="1" :label="$t('table_header.winlose')" />
            </div>
            <div class="row items-center col-12">
              <q-radio
                v-model="commissionForm.calculation_type"
                :val="2"
                :label="$t('table_header.net_gaming_revenue')"
              />
            </div>
          </div>
        </div>
        <div class="col-1" v-if="walletSwitch">
          <div class="q-pb-xs">{{ $t("table_header.wallet_type") }}</div>
          <div class="row q-mt-md col-12">
            <q-select
              v-model="form.wallet_type"
              :options="bounsDropdownList"
              class="edit-input"
              borderless
              dense
              emit-value
              map-options
              standout="text-black"
              rounded
              bg-color="white"
            />
          </div>
        </div>
        <div class="col-2">
          <div class="q-pb-xs">{{ $t("table_header.reward_type") }}</div>
          <div class="q-pt-sm">
            <div class="row items-center col-12">
              <q-radio v-model="form.payout_method" :val="1" :label="$t('send_type.auto')" />
            </div>
            <div class="row items-center col-12">
              <q-radio v-model="form.payout_method" :val="2" :label="$t('send_type.manual')" />
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- 活動資訊 -->
    <q-card-section class="q-pt-s">
      <div class="row q-col-gutter-md">
        <!-- 活動日期 -->
        <!--<div class="col-4">
          <div class="q-pb-xs">{{ $t("edit_form.event_date") }}</div>
          <DateTimePicker
            class="edit-input"
            label=""
            :date-time-model="dateTimeSelector"
            :on-update-date-time="onUpdateDateTime"
            :with-outlined="false"
            :with-borderless="true"
          />
        </div>-->
      </div>
    </q-card-section>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, useSlots, watch, onMounted, watchEffect } from "vue"
  import { useAgentCommissionStore } from "@/stores/agentCommissionStore"
  import { storeToRefs } from "pinia"
  import { useLanguageStore } from "src/stores/languageStore"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useCommon } from "@/hook/useCommon"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { getMemberLevel0Search } from "@/api/agentMemberManagements"

  import { getCurrencyList } from "@/api/common"
  import { LANGUAGE_TYPE, CURRENCY_TYPE, BONUS_WALLET_TYPE } from "@/utils/constants"
  import { useSiteStore } from "@/stores/siteStore"
  const props = defineProps({
    readOnly: {
      type: [Boolean],
      required: false,
      default: () => false
    }
  })

  const slots = useSlots()
  const { t } = useI18n()
  const $q = useQuasar()
  const { walletSwitch } = useWalletBouns()
  const { genWeeksStartSun, numberEnumToArray } = useCommon()

  const languageStore = useLanguageStore()
  const store = useAgentCommissionStore()
  const siteStore = useSiteStore()
  const { commissionItem: form } = storeToRefs(store)
  const commissionForm = computed(() => form.value as Request.UpdateAgentCommissionItem & { calculation_type?: number })

  const weekDropdownList = computed(() => {
    const weeks = genWeeksStartSun()
    return weeks.map((e) => {
      const label = t(e.label)
      return {
        label,
        value: e.value
      }
    })
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

  function getDynamicLangValue(data: Response.PromotionLangTitle): string {
    if (!data) return ""
    const nowLang = languageStore.currentLanguageOption.backendKey as LANGUAGE_TYPE.Enums
    if (nowLang in data) {
      return data[nowLang]
    } else {
      // 没有 MYR 的值，则取第一个值
      for (const key in data) {
        return data[key as LANGUAGE_TYPE.Enums]
      }
    }
    return ""
  }
  // 多語系（套用）
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
  const language = reactive({
    list: languageList,
    current: languageList.value[0].label,
    apply: languageList.value[0].label
  })

  const formatDateTimeSelector = (data: Request.AddPromotionItem) => {
    dateTimeSelector.from = data.start_date
    dateTimeSelector.to = data.end_date
  }

  // 活動日期
  const dateTimeSelector = reactive<{ from?: string; to?: string }>({
    from: undefined,
    to: undefined
  })
  const onUpdateDateTime = (newValue: { from: string; to: string }) => {
    if (!newValue) {
      dateTimeSelector.from = undefined
      dateTimeSelector.to = undefined
      return
    }
    dateTimeSelector.from = newValue.from
    dateTimeSelector.to = newValue.to
  }

  /*
  watch(
    form,
    (newValue) => {
      formatDateTimeSelector(newValue)
    },
    { deep: true }
  )
  watch(dateTimeSelector, (newValue) => {
    form.value.start_date = newValue.from || ""
    form.value.end_date = newValue.to || ""
  })*/
  /*watch(
    reward,
    (newValue) => {
      if (form.value.type !== EVENT_TYPE.Enums.BetBonus) {
        const rewardItem: Request.PromotionRewardItem = {
          currency: newValue.currency,
          amount: parseFloat(newValue.amount),
          type: PROMOTION_REWARD_TYPE.Enums.FixedAmount,
          condition: 0,
          limit: ""
        }
        form.value.reward[0] = rewardItem
      }
    },
    { deep: true }
  )*/

  onMounted(async () => {
    /*formatDateTimeSelector(form.value)
    formatReward(form.value)
    getCurrencyDropdown()*/
    //搜尋會員
    getMember("")
  })

  interface StringOption {
    label: string
    value: number
  }
  const accountOption = ref<StringOption[]>([])
  const stringOptions = ref<StringOption[]>([])

  const filterAccount = (val: string, update: Function, abort: Function) => {
    update(() => {
      const needle = val.toLowerCase()
      if (stringOptions.value.length <= 0) {
        getMember(needle)
      }
      accountOption.value = stringOptions.value.filter((v) => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1)
    })
  }
  //搜尋會員
  const getMember = async (name: string | "") => {
    const { data } = await getMemberLevel0Search()
    if (!data || !Object.keys(data).length) {
      stringOptions.value.length = 0
      return
    }
    stringOptions.value.length = 0
    data.list.forEach((item: any) => {
      const newItem = {
        label: item.account,
        value: item.member_id
      }
      // 将新对象添加到 accountOption 数组中
      stringOptions.value.push(newItem as never)
    })
  }
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";

  .bottom_border {
    border-bottom: 0.0313rem solid #999;
  }
  .tab-container {
    ::v-deep(.q-tabs__content) {
      justify-content: flex-start;
    }
    .q-tab--active {
      color: $mainColor;
    }
  }
  .q-tab-panels {
    background-color: transparent !important;
  }
  .edit-input {
    border: 0.0625rem solid #c2c2ca;
    border-radius: 0.25rem;
    padding: 0.0313rem 0.625rem;
    background-color: #fff;
  }
  .preview-image {
    aspect-ratio: 236/132;
    overflow: auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    cursor: pointer;
    img {
      width: 100%;
      height: auto;
    }
  }
  .audit-multiple-container {
    border: 0.0625rem solid #999;
    .q-btn {
      height: 1.25rem;
      background-color: #f3f4ff;
      font-size: 0.625rem;
    }
    .audit-multiple {
      border-left: 0.0625rem solid #999;
      border-right: 0.0625rem solid #999;
      ::v-deep(input.q-field__input) {
        text-align: center;
      }
    }
  }
</style>
