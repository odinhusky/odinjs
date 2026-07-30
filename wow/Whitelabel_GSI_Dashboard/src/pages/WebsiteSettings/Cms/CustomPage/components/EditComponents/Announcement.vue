<template>
  <div class="announcement-horizontal-container">
    <!-- 公告卡片列表 -->
    <VueDraggableNext
      :list="props.entrance.payload.nested_entrance"
      class="drag-container-horizontal"
      item-key="id"
      handle=".drag-handle"
    >
      <div
        v-for="(subEntrance, subEntranceIndex) in props.entrance.payload.nested_entrance"
        :key="`entrance-${subEntranceIndex}`"
        class="card-entrance-horizontal"
      >
        <!-- header -->
        <div class="entrance-header">
          <div class="row items-center">
            <img :src="btnSort()" alt="sort-button" class="drag-handle" />
            <span class="text-xs">{{ $t("table_header.order") }}{{ subEntranceIndex + 1 }}</span>
          </div>
          <img :src="btnTrash()" alt="delete-button" @click="removeEntrance(subEntranceIndex)" />
        </div>

        <!-- 多語系內容 -->
        <div class="field-section">
          <AiLanguage class="mb-2" @applyLanguage="applyLanguage(subEntrance)" />
          <q-tabs v-model="subEntrance.payload.currentLang" dense class="language-tabs">
            <q-tab
              v-for="lang in languageList"
              :key="lang.value"
              :name="lang.label"
              :label="lang.label"
              class="language-tab"
            />
          </q-tabs>
          <q-tab-panels v-model="subEntrance.payload.currentLang" animated class="language-panels">
            <q-tab-panel
              v-for="detail in subEntrance.payload.details"
              :key="detail.lang"
              :name="detail.lang"
              class="language-panel"
            >
              <!-- 內容 -->
              <div class="panel-field">
                <label class="panel-label">{{ $t("table_header.content") }}</label>
                <q-input v-model="detail.content" type="textarea" dense outlined class="panel-input" rows="4" />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>

      <!-- 新增公告卡片 -->
      <div class="card-entrance-horizontal add-container">
        <h4 class="add-title"></h4>
        <img :src="btnAdd()" alt="add-button" class="add-img" @click="handleAddEntrance" />
      </div>
    </VueDraggableNext>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from "vue"
  import { computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useImage } from "src/hook/useImage"
  import { useCms } from "src/composables/useCms"
  import { useSiteStore } from "src/stores/siteStore"
  import type * as Request from "src/api/request.type"
  import { VueDraggableNext } from "vue-draggable-next"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"

  const { t } = useI18n()
  const $q = useQuasar()
  const { initEntrance } = useCms()
  const { btnSort, btnTrash, btnAdd } = useImage()
  const siteStore = useSiteStore()

  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem>,
      required: true,
      default: () => null
    }
  })

  // 語系列表
  const languageList = computed(() => {
    return siteStore.langList.map((e) => ({
      label: e.label,
      value: e.value
    }))
  })

  // AI 翻譯套用至其他語系
  const applyLanguage = async (subEntrance: Request.CmsEntranceItem) => {
    const currentLang = subEntrance.payload.currentLang
    const details = subEntrance.payload.details
    if (!details || !currentLang) return

    const fromDetail = details.find((e) => e.lang === currentLang)
    if (!fromDetail) return

    const payload = []

    if (fromDetail.content) {
      payload.push({ input_text: fromDetail.content })
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
      const languages = languageList.value.map((item) => item.label)
      const payloadWithLanguages = payload.map((item) => ({ ...item, languages }))
      const { status, data } = await translateAiText(payloadWithLanguages)

      if (status && Array.isArray(data) && data.length) {
        const contentTranslations = data?.[0]?.translations

        details.forEach((detail) => {
          if (contentTranslations) {
            detail.content = contentTranslations?.[detail.lang as string] ?? detail.content
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

  // 初始化 nested_entrance
  const initNestedEntrance = () => {
    if (!props.entrance.payload.nested_entrance) {
      props.entrance.payload.nested_entrance = []
    }
  }

  // 移除公告
  const removeEntrance = (index: number) => {
    if (props.entrance.payload.nested_entrance) {
      props.entrance.payload.nested_entrance.splice(index, 1)
    }
  }

  // 新增公告
  const handleAddEntrance = async () => {
    const entrance = await initEntrance()
    entrance.payload.currentLang = languageList.value[0]?.label || ""
    entrance.payload.details = languageList.value.map((lang) => ({
      lang: lang.label,
      title: "",
      content: "",
      image: "",
      image_path: "",
      imageFileName: ""
    }))
    props.entrance.payload.nested_entrance?.push(entrance)
  }

  onMounted(() => {
    initNestedEntrance()
  })
</script>

<style lang="scss" scoped>
  @import "../../../../../../css/_variable.sass";
  @import "../../../../../../css/cms.scss";
  @import "../../../../../../css/dragTable.scss";

  .announcement-horizontal-container {
    display: flex;
    height: 100%;
    width: max-content;
    min-width: 100%;

    .drag-container-horizontal {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      height: 100%;
      padding-bottom: 1rem;

      .card-entrance-horizontal {
        flex-shrink: 0;
        width: 250px;
        height: fit-content;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 0.75rem;
        padding: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

        .entrance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;

          .row {
            gap: 0.5rem;
          }

          img {
            cursor: pointer;
            width: 1.25rem;
            height: 1.25rem;

            &:hover {
              opacity: 0.7;
            }
          }

          .text-xs {
            font-size: 13px;
            font-weight: 500;
            color: #333;
          }
        }

        .field-section {
          margin-bottom: 1rem;

          .field-label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: #666;
            margin-bottom: 0.5rem;
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
              font-size: 12px;
              color: #666;
              margin-bottom: 0.25rem;
            }

            .panel-input {
              width: 100%;
            }
          }
        }

        &.add-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          background: #fff;
          border: 1px dashed #d0d0d0;

          .add-title {
            font-size: 14px;
            color: #999;
            margin-bottom: 0.75rem;
          }

          .add-img {
            cursor: pointer;
            width: 2.5rem;
            height: 2.5rem;
            transition: transform 0.2s;

            &:hover {
              transform: scale(1.1);
            }
          }
        }
      }
    }
  }
</style>
