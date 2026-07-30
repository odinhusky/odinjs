<template>
  <div>
    <!-- 標頭 -->
    <q-card-section v-if="!!slots['title']">
      <slot name="title"></slot>
    </q-card-section>

    <!-- 前端資訊tabs -->
    <q-card-section class="q-pb-xs">
      <div class="row tab-container">
        <div class="col-6">
          <q-tabs
            v-model="language.current"
            class="justify-start lang-tabs text-grey bg-transparent"
            indicator-color="light-blue-1"
            active-color="black"
            dense
          >
            <q-tab v-for="(lang, key) in language.list" :key="key" :name="lang.label" :label="lang.label" />
          </q-tabs>
        </div>

        <div class="q-pl-lg col-6 row items-center q-col-gutter-md justify-end">
          <AiLanguage class="mb-2" @applyLanguage="applyLanguage" />
        </div>
      </div>
      <q-tab-panels v-model="language.current" animated class="bg-edit-color q-pa-sm rounded-borders">
        <q-tab-panel v-for="item in form.content_settings" :name="item.lang" class="q-px-none">
          <div class="row q-col-gutter-xl">
            <div class="col-6">
              <div>{{ $t("edit_form.member_title") }}</div>
              <q-input v-model="item.title" square borderless dense class="edit-input" />
              <div class="q-mt-lg q-mb-xs">{{ $t("edit_form.agent_rebate_promo") }}</div>
              <div class="row no-wrap">
                <div class="col-9 q-pt-xs">
                  <PreviewImage
                    :parentImage="item.image"
                    :defaultImage="promotionEventBanner()"
                    :aspectRatio="'236/132'"
                    @update:modelValue="updateImgUrl($event, item)"
                    imageToBase64
                    :maxFileSize="204800"
                  />
                </div>
                <div class="col-3">
                  <div class="column justify-end q-pl-md fit">
                    <q-btn class="q-mt-xs" color="red-5" @click="deleteImage(item)">{{ $t("common.delete") }}</q-btn>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div>{{ $t("edit_form.detailed_description_page") }}</div>
              <div>
                <Editor :model-value="item.detail" @update:model-value="handelEditor($event, item)" />
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
    <!-- 活動資訊 -->
    <q-card-section class="q-pa-md q-ma-md rounded-borders" style="background-color: #fcf8ff">
      <div class="row q-col-gutter-md">
        <!-- 活動日期 -->
        <!-- <div class="col-4">
          <div class="q-pb-xs">{{ $t("edit_form.event_date") }}</div>

          <DateTimePicker
            class="edit-input"
            :date-time-model="dateTimeSelector"
            :on-update-date-time="onUpdateDateTime"
            :use-time-picker="true"
            :with-outlined="false"
            :with-borderless="true"
          />
        </div> -->

        <!-- 前端顯示 - 存款優惠 -->
        <div class="col-4">
          <div class="q-pb-xs">{{ $t("edit_form.front_end_display") }}</div>
          <q-btn-toggle
            v-model="form.basic_setting.show"
            class="btn_toggle_style"
            toggle-color="primary"
            text-color="grey"
            size="16px"
            no-caps
            rounded
            unelevated
            :options="[
              { label: $t('edit_form.show'), value: 1 },
              { label: $t('edit_form.do_not_show'), value: 0 }
            ]"
          />
        </div>
        <!-- 反傭統計-->
        <div class="col-4">
          <div class="q-pb-xs">{{ $t("edit_form.rebate_stats") }}</div>
          <q-btn-toggle
            v-model="form.basic_setting.rebate"
            class="btn_toggle_style"
            toggle-color="primary"
            text-color="grey"
            size="16px"
            no-caps
            rounded
            unelevated
            :options="[
              { label: $t('edit_form.include'), value: 1 },
              { label: $t('edit_form.exclude'), value: 0 }
            ]"
          />
        </div>
        <!-- 結算週期 -->
        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.settle_cycle") }}</div>
          <div class="q-pt-sm">
            <div class="row items-center col-12">
              <q-radio
                v-model="form.basic_setting.settlement_type"
                :val="1"
                :label="$t('settlement_cycle.weekly')"
                :disable="checkSettleCycle"
              />
              <div class="q-ml-md row items-center">
                <span class="">{{ $t("common.every_week") }}</span>
                <q-select
                  v-model="form.basic_setting.settlement_week"
                  :options="weekDropdownList"
                  class="edit-input q-ml-md"
                  borderless
                  dense
                  emit-value
                  map-options
                  standout="bg-white text-black"
                  rounded
                  :disable="checkSettleCycle"
                />
              </div>
            </div>
            <div class="row items-center col-12">
              <q-radio
                v-model="form.basic_setting.settlement_type"
                :val="2"
                :label="$t('settlement_cycle.monthly')"
                :disable="checkSettleCycle"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="row q-col-gutter-md q-mt-md">
        <!-- 派發方式 -->
        <!-- <div class="col-4">
          <div>{{ $t("query_params.distribution_type") }}</div>
          <div class="q-pt-sm">
            <q-option-group
              v-model="form.basic_setting.auto_payout"
              :options="autoPayoutOptions"
              color="primary"
              inline
            />
          </div>
        </div> -->

        <!-- 獎勵類型 -->
        <!-- <div class="col-4">
          <div>{{ $t("edit_form.reward_type") }}</div>
          <div class="q-pt-sm">
            <q-option-group
              v-model="form.basic_setting.reward_type"
              :options="rewardTypeOptions"
              color="primary"
              inline
            />
          </div>
        </div> -->

        <!-- 自動派發時間 -->
        <!-- <div class="col-4" v-if="form.basic_setting.auto_payout === 1">
          <div class="q-pb-xs">{{ $t("edit_form.automatic_time") }}</div>
          <div>
            <div class="row items-center">
              <div class="row items-center" style="width: 100%">
                <span class="">{{ $t("common.every_week") }}</span>
                <q-select
                  v-model="form.basic_setting.dispatched_week"
                  :options="weekDropdownList"
                  class="edit-input q-ml-md"
                  borderless
                  dense
                  emit-value
                  map-options
                  standout="bg-white text-black"
                  rounded
                />
                <q-input
                  ref="inputElement"
                  borderless
                  dense
                  class="edit-input q-ml-md"
                  v-model="form.basic_setting.dispatched_time"
                  mask="fulltime"
                  style="height: 40px"
                  @click="openDateTimePicker"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer" style="height: 40px">
                      <q-popup-proxy ref="proxyPopup" cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="form.basic_setting.dispatched_time" with-seconds format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </div> -->
        <!-- 稽核倍數 -->
        <!-- <div class="col-2">
          <div>{{ $t("edit_form.audit_multiple") }}</div>
          <div class="q-mt-xs row items-center no-wrap audit-multiple-container">
            <q-btn size="md" square flat @click="subStep">-</q-btn>
            <q-input
              v-model="form.basic_setting.audit_rate"
              dense
              borderless
              square
              @update:modelValue="limitDecimals"
              class="audit-multiple"
            />
            <q-btn size="md" square flat @click="addStep">+</q-btn>
          </div>
        </div> -->
      </div>
    </q-card-section>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, useSlots, watch, onMounted, watchEffect, Ref, nextTick } from "vue"
  import { useCollaborationStore } from "@/stores/collaborationStore"

  import { storeToRefs } from "pinia"
  import { useLanguageStore } from "src/stores/languageStore"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useImage } from "@/hook/useImage"
  import { useDecimal } from "@/hook/useDecimal"
  import { useCommon } from "@/hook/useCommon"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { getCurrencyList } from "@/api/common"
  import { genEnumToDropdown } from "@/stores/queryStore"
  import { LANGUAGE_TYPE, CURRENCY_TYPE, BONUS_WALLET_TYPE } from "@/utils/constants"
  import DateTimePicker from "@/components/query/dateTimePicker.vue"
  import Editor from "@/components/editor/Editor.vue"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { useSiteStore } from "@/stores/siteStore"
  import { useEnv } from "src/hook/useEnv"
  import { QPopupProxy, QInput } from "quasar"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"

  const slots = useSlots()
  const { t } = useI18n()
  const $q = useQuasar()
  const { preciseAdd, preciseSubtract } = useDecimal()
  const { genWeeks, numberEnumToArray } = useCommon()
  const siteStore = useSiteStore()
  const languageStore = useLanguageStore()
  const collaborationStore = useCollaborationStore()
  const { walletSwitch } = useWalletBouns()
  const { collaborationItem: form } = storeToRefs(collaborationStore)
  const { envData } = useEnv()
  const { VITE_APP_BASE_API } = envData()
  const checkSettleCycle = ref(true)
  const weekDropdownList = computed(() => {
    const weeks = genWeeks()
    return weeks.map((e) => {
      const label = t(e.label)
      return {
        label,
        value: e.value
      }
    })
  })

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
    current: languageList?.value[0] ? languageList?.value[0].label : 0,
    apply: languageList?.value[0] ? languageList?.value[0].value : 0
  })

  const applyLanguage = async () => {
    const fromItem = form.value.content_settings?.find((e) => e.lang === language.current)
    if (!fromItem) return

    const payload = []

    if (!!fromItem.title) {
      payload.push({
        input_text: fromItem.title
      })
    }

    if (!!fromItem.detail) {
      payload.push({
        input_text: fromItem.detail
      })
    }

    if (!payload.length) {
      $q.notify({
        type: "negative",
        message: t("message.please_fill_the_first_language_content_before_using_ai_translation"),
        position: "top",
        timeout: 300
      })
      return
    }

    try {
      $q.loading.show()
      const languages = language.list.map((item) => item.label)
      const payloadWithLanguages = payload.map((item) => ({ ...item, languages }))
      const { status, data } = await translateAiText(payloadWithLanguages)
      if (status && Array.isArray(data) && data.length) {
        if (!!fromItem.title) {
          const titleTranslations = data?.[0]?.translations
          const contentTranslations = data?.[1]?.translations

          form.value.content_settings?.forEach((item) => {
            item.title = titleTranslations?.[item.lang]
            item.image = fromItem.image

            if (contentTranslations) {
              item.detail = contentTranslations?.[item.lang]
            } else {
              item.detail = ""
            }
          })
        } else {
          form.value.content_settings?.forEach((item) => {
            item.title = ""
            item.detail = data?.[0]?.translations?.[item.lang]
            item.image = fromItem.image
          })
        }
      }
      $q.notify({
        type: "positive",
        message: t("message.ai_translation_completed"),
        position: "top",
        timeout: 300
      })
    } catch (error) {
      console.error("applyLanguage error", error)
    } finally {
      $q.loading.hide()
    }
  }

  /*const formatReward = (data: Request.AddCollaborationItem) => {
       if (form.value.reward.length > 0) {
         reward.currency = data.reward[0].currency
         reward.amount = `${data.reward[0].amount}`
       }

     }*/

  // 上傳圖片
  const { promotionEventBanner } = useImage()
  const updateImgUrl = (value: string, item: Request.CollaborationContent) => {
    item.image = value
  }
  const deleteImage = (item: Request.CollaborationContent) => {
    item.image = ""
  }
  // 編輯器
  const handelEditor = (value: string, item: Request.CollaborationContent) => {
    item.detail = value
  }

  // 活動日期
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

  // 自動派發
  const autoPayoutOptions = computed(() => [
    {
      label: t("reward_type.auto"),
      value: 1
    },
    {
      label: t("reward_type.manual"),
      value: 0
    }
  ])

  // 獎勵類型
  const rewardTypeOptions = computed(() => [
    {
      label: t("common.cash"),
      value: 1
    },
    {
      label: t("common.wallet_bonus"),
      value: 2
    }
  ])

  // 稽核倍數
  const auditMultipleStep = 0.5
  const generalOptions = {
    min: 0,
    precision: "2",
    nullValue: 0
  }
  /*
    const limitDecimals = (inputValue: string, decimals: number) => {
      console.log("xxxx")
      const regex = new RegExp(`^\\d+(\\.\\d{0,${decimals}})?$`)
      if (!regex.test(inputValue)) {
        // 如果不匹配正则，则重设为之前合法的值
        form.value.basic_setting.audit_rate = value.value
      } else {
        // 更新合法值
        value.value = inputValue
        form.value.basic_setting.audit_rate = inputValue // 确保与 v-model 同步
      }
    }*/

  // const limitDecimals = (value) => {
  //   console.log(value)
  //   // 正则匹配两位小数
  //   const validValue = value.match(/^\d*(\.\d{0,2})?/)?.[0] || ""
  //   form.value.basic_setting.audit_rate = validValue
  // }

  // function addStep() {
  //   form.value.basic_setting.audit_rate = preciseAdd(form.value.basic_setting.audit_rate, auditMultipleStep)
  // }
  // function subStep() {
  //   if (form.value.basic_setting.audit_rate) {
  //     form.value.basic_setting.audit_rate = preciseSubtract(form.value.basic_setting.audit_rate, auditMultipleStep)
  //   }
  // }
  // 派發金額
  const reward = reactive<{
    currency: string
    amount: string
  }>({ currency: "", amount: "0" })
  const currencyDropdown = reactive<{
    list: {
      label: string
      value: string
    }[]
  }>({
    list: []
  })

  async function getCurrencyDropdown() {
    const { data } = await getCurrencyList()
    if (!data || !Object.keys(data).length) {
      currencyDropdown.list.length = 0
      return
    }
    Object.keys(data).forEach((key) => {
      currencyDropdown.list.push({
        label: t(CURRENCY_TYPE.I18nKeys[data[key] as keyof typeof CURRENCY_TYPE.I18nKeys] ?? key),
        value: key
      })
    })
  }
  // 間聽清零
  watch(
    () => reward.amount,
    (newValue) => {
      if (newValue) {
        reward.amount = newValue.replace(/^0+/, "") || "0"
      }
    }
  )
  /* watch(
       form,
       (newValue) => {
         formatDateTimeSelector(newValue)
       },
       { deep: true }
     )*/
  // watch(dateTimeSelector, (newValue) => {
  //   form.value.basic_setting.started_at = newValue.from + " " + newValue.fromHms || ""
  //   form.value.basic_setting.ended_at = newValue.to + " " + newValue.toHms || ""
  // })

  watch(languageList, (newValue) => {
    language.current = newValue[0].label
  })

  onMounted(async () => {
    //formatDateTimeSelector(form.value)
    await getCurrencyDropdown()

    // if (form.value.basic_setting.started_at !== "") {
    //   dateTimeSelector.from = format(new Date(form.value.basic_setting.started_at), "yyyy-MM-dd")
    //   dateTimeSelector.to = format(new Date(form.value.basic_setting.ended_at), "yyyy-MM-dd")
    // } else {
    //   checkSettleCycle.value = false
    // }
    // if (form.value.basic_setting.ended_at !== "") {
    //   dateTimeSelector.fromHms = format(form.value.basic_setting.started_at, "HH:mm:ss")
    //   dateTimeSelector.toHms = format(form.value.basic_setting.ended_at, "HH:mm:ss")
    // }

    /* dateTimeSelector.from = format(new Date(form.value.basic_setting.started_at), "yyyy-MM-dd")
    dateTimeSelector.to = format(new Date(form.value.basic_setting.ended_at), "yyyy-MM-dd")
    dateTimeSelector.fromHms = format(form.value.basic_setting.started_at, "HH:mm:ss")
    dateTimeSelector.toHms = format(form.value.basic_setting.ended_at, "HH:mm:ss")*/
    // formatReward(form.value)
  })

  const inputElement = ref() as Ref<QInput>
  const proxyPopup = ref() as Ref<QPopupProxy>
  const isProxyShow = ref(false)
  const openDateTimePicker = () => {
    if (!isProxyShow.value) {
      proxyPopup.value.show()
    } else {
      inputElement.value.blur()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  // .tab-container {
  //   border-bottom: 0.0313rem solid #999;
  //   ::v-deep(.q-tabs__content) {
  //     justify-content: flex-start;
  //   }
  //   .q-tab--active {
  //     color: $mainColor;
  //   }
  // }
  // .q-tab-panels {
  //   background-color: transparent !important;
  // }

  .lang-tabs {
    ::v-deep(.q-tabs__content) {
      justify-content: flex-start;
      padding-left: 0.5rem;
      .q-tab {
        padding-top: 0;
        padding-bottom: 0;
        border-radius: 10px 10px 0 0;
        border-top: 1px solid #f0f2f5;
        border-left: 1px solid #f0f2f5;
        border-right: 1px solid #f0f2f5;
        &--active {
          border: none;
        }
      }
    }
  }

  .edit-input {
    border: 0.0625rem solid #c2c2ca;
    border-radius: 0.25rem;
    padding: 0.0313rem 0.625rem;
    ::v-deep(.q-field__control) {
      box-shadow: none;
      min-height: 32px;
      height: 32px;
    }
    ::v-deep(.q-field__native) {
      height: 32px;
      min-height: 32px;
    }

    ::v-deep(.q-field__append) {
      height: 32px;
      min-height: 32px;
    }
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
  ::v-deep(.q-field__control) {
    background-color: transparent !important;
  }

  .audit-multiple-container {
    border: 0.0625rem solid #999;
    width: 200px;
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
      ::v-deep(.q-field__native) {
        text-align: center;
      }
    }
  }

  :deep(.q-tab--active) {
    background-color: #eff7ff;
  }
  :deep(.q-tab__indicator) {
    display: none;
  }
  .apply-btn {
    min-height: 32px;
    height: 32px;
  }
</style>
