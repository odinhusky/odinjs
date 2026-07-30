<template>
  <div class="leaderboard-settings">
    <!-- 多語系標題設定 -->
    <q-card-section class="setting-row">
      <div class="language-header">
        <AiLanguage class="mb-2" @applyLanguage="applyLanguage" />
      </div>
      <q-tabs v-model="currentLang" dense class="language-tabs">
        <q-tab
          v-for="lang in languageList"
          :key="lang.value"
          :name="lang.label"
          :label="lang.label"
          class="language-tab"
        />
      </q-tabs>
      <q-tab-panels v-model="currentLang" animated class="language-panels">
        <q-tab-panel v-for="detail in payload.details" :key="detail.lang" :name="detail.lang" class="language-panel">
          <!-- 標題 -->
          <div class="panel-field">
            <label class="panel-label">{{ $t("cms.display_title") }}</label>
            <q-input
              v-model="detail.display_title"
              dense
              outlined
              class="panel-input"
              :placeholder="$t('common.please_enter_content')"
            />
          </div>
          <!-- 分頁標題 1 -->
          <div class="panel-field">
            <label class="panel-label">{{ $t("cms.tab_title") }} 1</label>
            <q-input
              v-model="detail.tab_title_1"
              dense
              outlined
              class="panel-input"
              :placeholder="$t('common.please_enter_content')"
            />
          </div>
          <!-- 分頁標題 2 -->
          <div class="panel-field">
            <label class="panel-label">{{ $t("cms.tab_title") }} 2</label>
            <q-input
              v-model="detail.tab_title_2"
              dense
              outlined
              class="panel-input"
              :placeholder="$t('common.please_enter_content')"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from "vue"
  import { computed, ref, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useSiteStore } from "src/stores/siteStore"
  import type * as Request from "src/api/request.type"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"

  const { t } = useI18n()
  const $q = useQuasar()
  const siteStore = useSiteStore()

  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem>,
      required: true,
      default: () => null
    }
  })

  // 當前選中語系
  const currentLang = ref("")

  // 語系列表
  const languageList = computed(() => {
    return siteStore.langList.map((e) => ({
      label: e.label,
      value: e.value
    }))
  })

  // 初始化 payload 預設值
  const initPayloadDefaults = () => {
    // 初始化 details 多語系陣列
    if (!props.entrance.payload.details || props.entrance.payload.details.length === 0) {
      props.entrance.payload.details = languageList.value.map((lang) => ({
        lang: lang.label,
        display_title: "",
        tab_title_1: "",
        tab_title_2: "",
        title: "",
        content: "",
        image: ""
      }))
    }

    // 設置當前語系
    currentLang.value = languageList.value[0]?.label || ""

    const defaults = {
      bet_amount_threshold: 0,
      currencies: [] as string[],
      payout_amount_threshold: 0,
      multiplier_threshold: 0,
      robot_enabled: false,
      image_display: [] as string[],
      pc_display_columns: [] as string[],
      h5_display_columns: [] as string[],
      payout_highlight_threshold: 0,
      multiplier_highlight_threshold: 0
    }

    Object.keys(defaults).forEach((key) => {
      if (props.entrance.payload[key as keyof typeof defaults] === undefined) {
        ;(props.entrance.payload as any)[key] = defaults[key as keyof typeof defaults]
      }
    })
  }

  const payload = computed(() => props.entrance.payload as any)

  // AI 翻譯套用至其他語系
  const applyLanguage = async () => {
    const details = payload.value.details
    if (!details || !currentLang.value) return

    const fromDetail = details.find((e: any) => e.lang === currentLang.value)
    if (!fromDetail) return

    const payload_items = []
    if (fromDetail.display_title) payload_items.push({ input_text: fromDetail.display_title })
    if (fromDetail.tab_title_1) payload_items.push({ input_text: fromDetail.tab_title_1 })
    if (fromDetail.tab_title_2) payload_items.push({ input_text: fromDetail.tab_title_2 })

    if (!payload_items.length) {
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
      const languages = languageList.value.map((item) => item.label)
      const payloadWithLanguages = payload_items.map((item) => ({ ...item, languages }))
      const { status, data } = await translateAiText(payloadWithLanguages)

      if (status && Array.isArray(data) && data.length) {
        let idx = 0
        const displayTitleTranslations = fromDetail.display_title ? data[idx++]?.translations : null
        const tabTitle1Translations = fromDetail.tab_title_1 ? data[idx++]?.translations : null
        const tabTitle2Translations = fromDetail.tab_title_2 ? data[idx++]?.translations : null

        details.forEach((detail: any) => {
          if (displayTitleTranslations) {
            detail.display_title = displayTitleTranslations[detail.lang] ?? detail.display_title
          }
          if (tabTitle1Translations) {
            detail.tab_title_1 = tabTitle1Translations[detail.lang] ?? detail.tab_title_1
          }
          if (tabTitle2Translations) {
            detail.tab_title_2 = tabTitle2Translations[detail.lang] ?? detail.tab_title_2
          }
        })
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

  // 幣種選項（這裡可以從 API 獲取）
  const currencyOptions = computed(() => [
    { label: "USD", value: "USD" },
    { label: "CNY", value: "CNY" },
    { label: "EUR", value: "EUR" },
    { label: "JPY", value: "JPY" },
    { label: "KRW", value: "KRW" },
    { label: "THB", value: "THB" },
    { label: "VND", value: "VND" },
    { label: "IDR", value: "IDR" },
    { label: "MYR", value: "MYR" },
    { label: "PHP", value: "PHP" }
  ])

  // 圖片顯示選項
  const imageOptions = computed(() => [
    { label: t("cms.player_avatar"), value: "player_avatar" },
    { label: t("cms.game_image"), value: "game_image" }
  ])

  // 顯示欄位選項
  const displayColumnOptions = computed(() => [
    { label: t("cms.player_account"), value: "player_account" },
    { label: t("cms.game_name"), value: "game_name" },
    { label: t("cms.bet_amount"), value: "bet_amount" },
    { label: t("cms.multiplier"), value: "multiplier" },
    { label: t("cms.payout"), value: "payout" }
  ])

  // 驗證規則 - 正數
  const positiveNumberRule = (val: number) => {
    if (val === undefined || val === null || val === 0) return true
    return val > 0 || t("cms.must_be_positive")
  }

  // 驗證規則 - 派獎金額高亮門檻不能低於派彩金額門檻
  const highlightPayoutRule = (val: number) => {
    if (val === undefined || val === null || val === 0) return true
    if (val < 0) return t("cms.must_be_positive")
    if (payload.value.payout_amount_threshold && val < payload.value.payout_amount_threshold) {
      return t("cms.highlight_must_be_greater_than_threshold")
    }
    return true
  }

  // 驗證規則 - 倍率高亮門檻不能低於倍率門檻
  const highlightMultiplierRule = (val: number) => {
    if (val === undefined || val === null || val === 0) return true
    if (val < 0) return t("cms.must_be_positive")
    if (payload.value.multiplier_threshold && val < payload.value.multiplier_threshold) {
      return t("cms.highlight_must_be_greater_than_threshold")
    }
    return true
  }

  onMounted(() => {
    initPayloadDefaults()
  })
</script>

<style lang="scss" scoped>
  .leaderboard-settings {
    padding: 0.5rem 0;

    .setting-row {
      padding: 0.75rem 1rem;

      .setting-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .setting-title {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin: 0 0 0.25rem 0;
      }

      .setting-desc {
        font-size: 12px;
        color: #666;
        margin: 0 0 0.75rem 0;
      }

      .setting-input {
        width: 100%;
      }

      .language-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .language-tabs {
        :deep(.q-tabs__content) {
          justify-content: flex-start;
        }
      }

      .language-tab {
        min-height: 32px;
        padding: 0 12px;
        font-size: 12px;
      }

      .language-panels {
        background: #f8f9fa;
        border-radius: 8px;
        margin-top: 0.5rem;

        .language-panel {
          padding: 0.75rem;
        }
      }

      .panel-field {
        margin-bottom: 0.75rem;

        .panel-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .panel-desc {
          font-size: 11px;
          color: #999;
          margin: 0 0 0.5rem 0;
        }

        .panel-input {
          width: 100%;
        }
      }
    }

    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .highlight-settings {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .highlight-item {
        display: flex;
        align-items: center;
        gap: 1rem;

        .highlight-label {
          font-size: 13px;
          color: #333;
          min-width: 120px;
        }

        .highlight-input {
          flex: 1;
          max-width: 200px;
        }
      }
    }

    :deep(.q-separator) {
      margin: 0.5rem 0;
    }
  }
</style>
