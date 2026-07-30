<template>
  <div>
    <!-- 標頭 -->
    <q-card-section v-if="!!slots['title']">
      <slot name="title"></slot>
    </q-card-section>
    <q-card-section>
      <q-separator />
    </q-card-section>

    <!-- 前端資訊tabs -->
    <q-card-section class="q-pb-xs">
      <div class="row tab-container languageTabsWrapper">
        <div class="col-6">
          <q-tabs
            v-model="language.current"
            dense
            class="bg-transparent text-grey-8 lang-tabs"
            active-color="main-color"
            content-class="languageTab"
            outside-arrows
          >
            <q-tab
              v-for="(lang, key) in language.list"
              :key="key"
              :name="lang.label"
              :label="lang.label"
              class="q-px-none q-mr-md"
              content-class="languageTabItem"
            />
          </q-tabs>
        </div>

        <div class="q-pl-lg col-6 row items-center q-col-gutter-md justify-end">
          <AiLanguage class="mb-2" @applyLanguage="applyLanguage" />
        </div>
      </div>
      <q-tab-panels v-model="language.current" animated class="bg-edit-color q-pa-sm rounded-borders">
        <q-tab-panel v-for="item in form.i18n" :name="item.language" class="q-px-none">
          <div class="row q-col-gutter-xl">
            <div class="col-6">
              <div>{{ $t("edit_form.member_display_name") }}</div>
              <q-input v-model="item.title" square borderless dense class="edit-input" />
              <div class="q-mt-lg q-mb-xs">{{ $t("edit_form.member_promotion_display") }}</div>
              <div class="row no-wrap">
                <div class="col-9 q-pt-xs">
                  <PreviewImage
                    :parentImage="item.images"
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
            <!--<div class="col-6">
              <div>{{ $t("edit_form.detailed_description_page") }}</div>
              <div>
                <Editor :model-value="item.description_page" @update:model-value="handelEditor($event, item)" />
              </div>
            </div>-->
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
    <!-- 活動資訊 -->
    <q-card-section class="q-pa-md q-ma-md rounded-borders activity-info" style="background-color: #fcf8ff">
      <div class="row q-col-gutter-md">
        <!-- 結算統計開關 -->
        <div class="col-3">
          <div class="q-pb-xs">{{ $t("edit_form.settlement_toggle") }}</div>
          <q-btn-toggle
            v-model="form.settlement_enabled"
            toggle-color="primary"
            text-color="primary"
            unelevated
            rounded
            class="btn_toggle_style"
            size="16px"
            :options="[
              { label: $t('edit_form.include'), value: true },
              { label: $t('edit_form.exclude'), value: false }
            ]"
          />
        </div>
        <!-- 活動日期 -->
        <div class="col-3">
          <div class="q-pb-xs">{{ $t("edit_form.event_date") }}</div>
          <DateTimePicker
            class="edit-input"
            label=""
            :date-time-model="dateTimeSelector"
            :on-update-date-time="onUpdateDateTime"
            :with-outlined="false"
            :with-borderless="true"
          />
        </div>

        <!-- 派發方式 -->
        <div class="col-3">
          <div>{{ $t("query_params.distribution_type") }}</div>
          <div class="q-pt-sm">
            <q-option-group v-model="form.payout_method" :options="autoPayoutOptions" color="primary" inline />
          </div>
        </div>

        <!-- 稽核倍數 -->
        <div class="col-2">
          <div>{{ $t("edit_form.audit_multiple") }}</div>
          <div class="row items-center no-wrap audit-multiple-container">
            <q-btn size="md" square flat @click="subStep" class="q-left">-</q-btn>
            <q-number
              v-model="form.turnover_rate"
              :options="generalOptions"
              borderless
              class="default-input audit-multiple"
            />
            <q-btn size="md" square flat @click="addStep" class="q-right">+</q-btn>
          </div>
        </div>
      </div>
    </q-card-section>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, useSlots, watch, onMounted, watchEffect } from "vue"
  import { useInvitationBonusStore } from "@/stores/invitationBonusStore"
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
  import { getPromotionList, getPromotionDetail } from "@/api/promotion"
  import { getCurrencyList } from "@/api/common"
  import { genEnumToDropdown } from "@/stores/queryStore"
  import { LANGUAGE_TYPE, CURRENCY_TYPE } from "@/utils/constants"
  import DateTimePicker from "@/components/query/dateTimePicker.vue"
  import Editor from "@/components/editor/Editor.vue"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { useSiteStore } from "@/stores/siteStore"
  import { useEnv } from "src/hook/useEnv"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"

  const slots = useSlots()
  const { t } = useI18n()
  const $q = useQuasar()
  const { preciseAdd, preciseSubtract } = useDecimal()
  const { genWeeks, numberEnumToArray } = useCommon()
  const siteStore = useSiteStore()
  const languageStore = useLanguageStore()
  const tieredRewardStore = useInvitationBonusStore()
  const { invitationBonusItem: form } = storeToRefs(tieredRewardStore)
  const { envData } = useEnv()
  const { VITE_APP_BASE_API } = envData()

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
    current: languageList?.value[0] ? languageList?.value[0].label : 0,
    apply: languageList?.value[0] ? languageList?.value[0].value : 0
  })

  const applyLanguage = async () => {
    const fromItem = form.value.i18n?.find((e) => e.language === language.current)
    if (!fromItem || !fromItem?.title) {
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
      const { status, data } = await translateAiText([
        {
          input_text: fromItem.title,
          languages
        }
      ])

      if (status && Array.isArray(data) && data.length) {
        form.value.i18n?.forEach((item) => {
          item.title = data[0].translations[item.language]
          item.images = fromItem.images
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

  const formatDateTimeSelector = (data: Request.AddInvitationBonusItem) => {
    dateTimeSelector.from = data.start_date
    dateTimeSelector.to = data.end_date
  }

  // 上傳圖片
  const { promotionEventBanner } = useImage()
  const updateImgUrl = (value: string, item: Request.InvitationBonusInfo) => {
    item.images = value
  }
  const deleteImage = (item: Request.InvitationBonusInfo) => {
    item.images = ""
  }
  // 編輯器
  const handelEditor = (value: string, item: Request.InvitationBonusInfo) => {
    item.description_page = value
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

  // 自動派發
  const autoPayoutOptions = computed(() => [
    {
      label: t("reward_type.auto"),
      value: 1
    },
    {
      label: t("reward_type.manual"),
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
  function addStep() {
    form.value.turnover_rate = preciseAdd(form.value.turnover_rate, auditMultipleStep)
  }
  function subStep() {
    if (form.value.turnover_rate) {
      form.value.turnover_rate = preciseSubtract(form.value.turnover_rate, auditMultipleStep)
    }
  }

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

  watch(languageList, (newValue) => {
    language.current = newValue[0].label
  })
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
  })
  onMounted(async () => {
    formatDateTimeSelector(form.value)
    await getCurrencyDropdown()
  })
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
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
    background-color: #fff;
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

  :deep(.q-tab--active) {
    background-color: #eff7ff;
  }
  :deep(.q-tab__indicator) {
    display: none;
  }
  .apply-btn {
    min-height: 32px;
    height: 32px;
    font-size: 12px !important;
  }

  .activity-info {
  }
</style>
