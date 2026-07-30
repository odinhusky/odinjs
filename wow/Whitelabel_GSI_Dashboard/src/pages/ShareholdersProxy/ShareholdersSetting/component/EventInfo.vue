<template>
  <div>
    <div class="row q-col-gutter-md">
      <!-- 結算開關-->
      <div class="col-4">
        <div class="q-pb-xs h7-bold">{{ $t("edit_form.settlement_switch") }}</div>

        <q-btn-toggle
          v-model="form.settlement_enabled"
          toggle-color="primary"
          unelevated
          rounded
          class="btn_toggle_style"
          :false-value="false"
          :true-value="true"
          :options="[
            { label: $t('common.enable'), value: true },
            { label: $t('common.disable'), value: false }
          ]"
        />
      </div>
      <!-- 代理詳情路口-->
      <div class="col-4">
        <div class="q-pb-xs h7-bold">{{ $t("edit_form.agent_details_entry") }}</div>
        <q-btn-toggle
          v-model="form.show_agent_details"
          toggle-color="primary"
          unelevated
          rounded
          class="btn_toggle_style"
          :false-value="false"
          :true-value="true"
          :options="[
            { label: $t('edit_form.show'), value: true },
            { label: $t('edit_form.do_not_show'), value: false }
          ]"
        />
      </div>

      <!-- 流水倍數 -->
      <div class="col-4">
        <div class="h7-bold">{{ $t("table_header.turnover") }}</div>
        <div class="q-mt-xs row items-center no-wrap audit-multiple-container">
          <q-btn size="md" square flat @click="subStep" class="q-left">-</q-btn>
          <q-number
            v-model="form.turnover_rate"
            :options="generalOptions"
            dense
            borderless
            square
            class="default-input audit-multiple"
          />
          <q-btn size="md" square flat @click="addStep" class="q-right">+</q-btn>
        </div>
      </div>
    </div>

    <div class="q-mt-md q-pb-sm flex items-center">
      <p class="bold h4-bold grey">{{ $t("edit_form.detailed_description_page") }}</p>
      <AiLanguage class="ml-4" @applyLanguage="applyLanguage" />
    </div>
    <div class="row languageTabsWrapper">
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
            :name="lang.label"
            :label="lang.label"
            class="q-px-none q-mr-md"
            content-class="languageTabItem"
          />
        </q-tabs>
      </div>
      <q-tab-panels v-model="language.current" animated style="width: 100%">
        <q-tab-panel v-for="item in form.i18n" :name="item.language" class="q-px-none">
          <div class="row q-col-gutter-xl">
            <div class="col-12">
              <div>
                <Editor :model-value="item.description_page" @update:model-value="handelEditor($event, item)" />
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, useSlots, watch, onMounted, watchEffect } from "vue"
  import { useShareholderProxyStore } from "@/stores/shareholderProxyStore"
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
  import {
    EVENT_TYPE,
    PROMO_TIME,
    LANGUAGE_TYPE,
    CATEGORY_TYPE,
    CURRENCY_TYPE,
    PROMOTION_REWARD_TYPE,
    BONUS_WALLET_TYPE
  } from "@/utils/constants"
  import Editor from "@/components/editor/Editor.vue"
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
  const shareholderProxyStore = useShareholderProxyStore()
  const { walletSwitch } = useWalletBouns()
  const { proxyItem: form } = storeToRefs(shareholderProxyStore)
  const { envData } = useEnv()
  const { VITE_APP_BASE_API } = envData()
  // 沿用設定

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

  // 上傳圖片
  const { promotionEventBanner } = useImage()
  const updateImgUrl = (value: string, item: Request.PromotionInfo) => {
    item.image = value
  }
  const deleteImage = (item: Request.PromotionInfo) => {
    item.image = ""
  }
  // 編輯器
  const handelEditor = (value: string, item: Request.ShareholderInfo) => {
    item.description_page = value
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

  const applyLanguage = async () => {
    try {
      console.log("form.value.i18n :>> ", form.value.i18n)
      const firstItemData = form.value.i18n.find((item) => item.language === language.current)
      if (!firstItemData || !firstItemData?.description_page) {
        $q.notify({
          type: "negative",
          message: t("message.please_fill_the_first_language_content_before_using_ai_translation"),
          position: "top",
          timeout: 300
        })
        return
      }

      const languages = language.list.map((item) => item.label)
      const payload = [{ input_text: firstItemData.description_page, languages }]

      $q.loading.show()
      const { status, data } = await translateAiText(payload)
      if (status && Array.isArray(data) && data.length) {
        form.value.i18n.forEach((item) => {
          item.description_page = data[0].translations[item.language]
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

  // 間聽清零
  watch(
    () => reward.amount,
    (newValue) => {
      if (newValue) {
        reward.amount = newValue.replace(/^0+/, "") || "0"
      }
    }
  )

  watch(languageList, (newValue) => {
    language.current = newValue[0].label
    language.apply = newValue[0].value
  })

  onMounted(async () => {
    await getCurrencyDropdown()
  })
</script>

<style lang="scss" scoped>
  @import "../../../../css/setting.scss";
</style>
