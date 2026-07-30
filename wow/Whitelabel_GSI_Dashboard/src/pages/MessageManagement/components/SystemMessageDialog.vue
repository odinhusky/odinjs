<template>
  <q-dialog ref="dialogRef" class="system-message-dialog" @hide="onDialogHide">
    <q-card class="w-[60vw] max-w-[80rem]">
      <q-card-section>
        <div class="text-lg font-semibold text-[#535252]">
          {{ dialogTitle }}
        </div>
      </q-card-section>

      <q-form ref="translationFormRef" greedy>
        <q-card-section class="space-y-5">
          <!-- 收件對象 -->
          <section class="space-y-2">
            <div class="text-sm font-medium">{{ t("table_header.receiver") }}</div>
            <q-option-group
              v-model="targetTypeModel"
              :options="targetTypeOptions"
              type="radio"
              inline
              :disable="isReadonly"
            />
          </section>

          <MessageReceiverField
            :is-readonly="isReadonly"
            :target-type="targetTypeModel"
            :message="props.message"
            v-model:selected-receiver-ids="selectedReceiverIds"
          />

          <!-- 發佈時間（唯讀） -->
          <section v-if="isReadonly" class="space-y-2">
            <div class="text-sm font-medium">{{ t("table_header.time") }}</div>
            <div class="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
              {{ props.message.published_at ? formatDateTime(props.message.published_at) : "-" }}
            </div>
          </section>

          <!-- 多語系內容 -->
          <section class="languageTabsWrapper">
            <div class="language-tabs-group">
              <div class="language-tabs-header flex items-center no-wrap gap-3">
                <q-tabs
                  v-model="activeTranslationLang"
                  dense
                  align="left"
                  class="language-tabs-nav bg-transparent text-grey-8"
                  active-color="main-color"
                  content-class="languageTab"
                  outside-arrows
                >
                  <q-tab
                    v-for="item in translations"
                    :key="item.lang"
                    :name="item.lang"
                    :label="item.lang"
                    class="q-px-none q-mr-md"
                    content-class="languageTabItem"
                  />
                </q-tabs>
                <div v-if="!isReadonly" class="flex-1" />
                <aiLanguage v-if="!isReadonly" class="shrink-0" @applyLanguage="applyLanguage" />
              </div>

              <q-tab-panels v-model="activeTranslationLang" animated swipeable>
                <q-tab-panel v-for="item in translations" :key="item.lang" :name="item.lang" class="q-px-none">
                  <div class="space-y-3">
                    <div>
                      <div class="mb-1 text-sm font-medium">{{ t("table_header.subject") }}</div>
                      <q-input
                        v-model="item.subject"
                        outlined
                        dense
                        :disable="isReadonly"
                        :placeholder="t('common.please_enter_title')"
                        :rules="textFieldRules"
                        lazy-rules="ondemand"
                      />
                    </div>

                    <div>
                      <div class="mb-1 text-sm font-medium">{{ t("table_header.content") }}</div>
                      <q-input
                        v-model="item.content"
                        type="textarea"
                        outlined
                        :rows="6"
                        :disable="isReadonly"
                        :placeholder="t('common.please_enter_content')"
                        :rules="textFieldRules"
                        lazy-rules="ondemand"
                      />
                    </div>

                    <div class="space-y-1">
                      <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                        <span class="text-sm font-medium">{{ t("common.image") }}</span>
                        <span v-if="!isReadonly" class="text-xs text-gray-500">
                          {{ t("common.max_count_hint", { count: MESSAGE_IMAGE_MAX_COUNT }) }}
                        </span>
                      </div>

                      <S3ImageUploader
                        v-if="!isReadonly"
                        :key="item.lang"
                        v-model="item.images"
                        :storage-category="S3_STORAGE_CATEGORY.Enums.message"
                        :max-count="MESSAGE_IMAGE_MAX_COUNT"
                      />
                      <div v-else class="px-3 py-2">
                        <ImagePreviewGallery v-if="item.images.length" :images="item.images" thumb-size="80px" />
                        <div v-else class="text-sm text-gray-500">-</div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </section>
        </q-card-section>
      </q-form>

      <q-card-actions align="right" class="gap-2 border-t border-gray-200">
        <q-btn outline :label="t('btn.cancel')" color="primary" @click="onDialogCancel" />
        <q-btn
          v-if="!isReadonly"
          unelevated
          :label="t('btn.confirm')"
          color="primary"
          :loading="submitLoading"
          @click="onSubmitCreate"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue"
  import { storeToRefs } from "pinia"
  import { useDialogPluginComponent, useQuasar, type QForm } from "quasar"
  import { useI18n } from "vue-i18n"
  import { translateAiText } from "@/api/ai"
  import ImagePreviewGallery from "@/components/common/ImagePreviewGallery.vue"
  import S3ImageUploader from "@/components/common/S3ImageUploader.vue"
  import { useRfc3339 } from "@/composables/useRfc3339"
  import aiLanguage from "@/components/ai/aiLanguage.vue"
  import MessageReceiverField from "./MessageReceiverField.vue"
  import { S3_STORAGE_CATEGORY } from "@/utils/constants"
  import { useSiteStore } from "@/stores/siteStore"
  import {
    createSystemMessage,
    MessageNotificationTargetType,
    MessageNotificationTargetTypeI18nKeys,
    type Request,
    type Response
  } from "@/api/messageManagement"

  // --- types & constants ---

  type TranslationFormItem = {
    lang: string
    subject: string
    content: string
    images: string[]
  }

  const MESSAGE_IMAGE_MAX_COUNT = 3

  const TARGET_TYPE_OPTIONS = [
    MessageNotificationTargetType.ALL_MEMBERS,
    MessageNotificationTargetType.SPECIFIC_MEMBERS,
    MessageNotificationTargetType.MEMBER_LEVEL,
    MessageNotificationTargetType.MEMBER_TAG
  ] as const

  // --- props & composables ---

  const props = defineProps<{
    message: Response.MessageNotificationBase | Response.MessageNotificationDetail
    isReadonly?: boolean
  }>()

  defineEmits([...useDialogPluginComponent.emits])

  const { t } = useI18n()
  const $q = useQuasar()
  const { formatDateTime } = useRfc3339()
  const { langList } = storeToRefs(useSiteStore())
  const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

  // --- helpers ---

  const normalizeImages = (images: unknown): string[] =>
    Array.isArray(images) ? images.filter((url): url is string => typeof url === "string" && Boolean(url)) : []

  const notify = (type: "positive" | "negative", message: string, timeout = 300) => {
    $q.notify({ type, message, position: "top", timeout })
  }

  const createTranslations = (): TranslationFormItem[] => {
    const sourceMap = new Map<string, Response.MessageNotificationTranslation>()
    for (const item of props.message.translations || []) {
      const langKey = String(item.lang || "").toLowerCase()
      if (langKey) sourceMap.set(langKey, item)
    }

    const langs = [...new Set(siteLangs.value.length ? siteLangs.value : [...sourceMap.keys()])]

    return langs.map((lang) => {
      const existing = sourceMap.get(lang)
      return {
        lang,
        subject: String(existing?.subject || ""),
        content: String(existing?.content || ""),
        images: [...normalizeImages(existing?.images)]
      }
    })
  }

  // --- state ---

  const siteLangs = computed(() =>
    (langList.value || []).map((item) => String(item.label || "").toLowerCase()).filter(Boolean)
  )

  const translations = ref<TranslationFormItem[]>(createTranslations())
  const activeTranslationLang = ref(translations.value[0]?.lang || "")

  const isReadonly = computed(() => props.isReadonly ?? true)
  const dialogTitle = computed(() =>
    isReadonly.value ? t("message_notification.view") : t("message_notification.create")
  )
  const textFieldRules = computed(() => (isReadonly.value ? [] : [requiredRule]))
  const targetTypeOptions = computed(() =>
    TARGET_TYPE_OPTIONS.map((value) => ({
      label: t(MessageNotificationTargetTypeI18nKeys[value]),
      value
    }))
  )

  const targetTypeModel = ref(props.message.target_type)
  const selectedReceiverIds = ref<number[]>([])
  const translationFormRef = ref<QForm | null>(null)
  const submitLoading = ref(false)

  const requiredRule = (value: string | null | undefined) =>
    String(value || "").trim().length > 0 || t("common.validate.mustNotBeEmpty")

  const submitPayload = computed((): Request.CreateMessageNotification => {
    const payload: Request.CreateMessageNotification = {
      target_type: targetTypeModel.value,
      translations: translations.value.map((item) => ({
        lang: item.lang,
        subject: String(item.subject || "").trim(),
        content: String(item.content || "").trim(),
        images: item.images.length ? [...item.images] : []
      }))
    }

    if (targetTypeModel.value !== MessageNotificationTargetType.ALL_MEMBERS && selectedReceiverIds.value.length > 0) {
      payload.recipient_ids = [...selectedReceiverIds.value]
    }

    return payload
  })

  // --- form actions ---

  const validateTranslations = (): boolean => {
    const invalid = translations.value.find(
      (item) => !String(item.subject || "").trim() || !String(item.content || "").trim()
    )
    if (!invalid) return true

    notify("negative", t("common.validate.mustNotBeEmpty"))
    return false
  }

  const applyLanguage = async () => {
    const current = translations.value.find((item) => item.lang === activeTranslationLang.value)
    const sourceSubject = String(current?.subject || "").trim()
    const sourceContent = String(current?.content || "").trim()

    if (!sourceSubject && !sourceContent) {
      notify("negative", t("message.please_fill_the_first_language_content_before_using_ai_translation"))
      return
    }

    const languages = translations.value.map((item) => item.lang).filter(Boolean)

    try {
      $q.loading.show()
      const { status, data } = await translateAiText([
        { input_text: sourceSubject, languages },
        { input_text: sourceContent, languages }
      ])
      if (!status || !Array.isArray(data) || data.length < 2) return

      const sourceLang = activeTranslationLang.value
      const sourceImages = [...(current?.images || [])]

      translations.value = translations.value.map((item) => {
        const isSourceLang = item.lang === sourceLang
        const shouldCopyImages = !isSourceLang && item.images.length === 0 && sourceImages.length > 0

        return {
          lang: item.lang,
          subject: data[0]?.translations?.[item.lang] ?? item.subject,
          content: data[1]?.translations?.[item.lang] ?? item.content,
          images: shouldCopyImages ? [...sourceImages] : [...item.images]
        }
      })

      notify("positive", t("message.ai_translation_completed"))
    } catch (error) {
      console.error("applyLanguage error", error)
    } finally {
      $q.loading.hide()
    }
  }

  const onSubmitCreate = async () => {
    if (!validateTranslations()) return

    submitLoading.value = true
    const payload = submitPayload.value
    const res = await createSystemMessage(payload)
    submitLoading.value = false

    if (res.code !== 0) {
      notify("negative", res.msg || t("message.error"), 1000)
      return
    }

    notify("positive", t("message.success"))
    onDialogOK(payload)
  }
</script>

<style scoped lang="scss">
  .system-message-dialog :deep(.q-dialog__inner--minimized > div) {
    max-width: 60vw !important;
  }

  .languageTabsWrapper .language-tabs-group {
    .language-tabs-header {
      width: 100%;
    }

    .language-tabs-nav {
      flex: 0 1 auto;
      width: auto;
      max-width: 100%;
    }

    :deep(.language-tabs-nav.q-tabs) {
      margin-bottom: 0;
    }

    :deep(.language-tabs-nav .q-tabs__content) {
      flex: 0 0 auto;
    }

    :deep(.language-tabs-nav .q-tab) {
      flex: 0 0 auto;
    }

    :deep(.q-tab-panels) {
      margin-top: 0;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    :deep(.q-tab-panel) {
      padding-top: 12px;
    }
  }
</style>
