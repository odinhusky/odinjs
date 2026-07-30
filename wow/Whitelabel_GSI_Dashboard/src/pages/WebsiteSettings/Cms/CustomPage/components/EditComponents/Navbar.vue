<template>
  <div class="navbar-horizontal-container">
    <!-- 導航項目卡片列表 -->
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

        <!-- 標題 -->
        <div class="field-section">
          <label class="field-label">{{ $t("table_header.title") }}</label>
          <q-input
            v-model="subEntrance.payload.title"
            dense
            outlined
            class="field-input"
            :placeholder="$t('common.please_enter_content')"
          />
        </div>

        <!-- 會員端標題（多語系） -->
        <div class="field-section" v-if="subEntrance.payload.lang_titles">
          <div class="language-header">
            <label class="field-label">{{ $t("cms.display_title") }}</label>
            <q-btn flat dense size="sm" color="primary" :label="$t('btn.apply')" @click="applyLanguage(subEntrance)" />
          </div>
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
            <q-tab-panel v-for="lang in languageList" :key="lang.value" :name="lang.label" class="language-panel">
              <div class="panel-field">
                <q-input
                  v-model="subEntrance.payload.lang_titles[lang.label]"
                  dense
                  outlined
                  class="panel-input"
                  :placeholder="$t('common.please_enter_content')"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>

        <!-- Icon 設定 -->
        <div class="field-section">
          <div class="icon-row">
            <div class="icon-item">
              <label class="field-label">Icon</label>
              <PreviewImage
                :parentImage="subEntrance.payload.icon"
                :defaultImage="cmsIconUploadDefault()"
                :aspectRatio="'1/1'"
                :maxWidth="'3rem'"
                @update:modelValue="(val) => (subEntrance.payload.icon = val)"
                @update:img-file="(file) => handleIconFile(file, subEntrance, 'icon')"
                imageToBase64
                :maxFileSize="102400"
              />
            </div>
            <div class="icon-item">
              <label class="field-label">Selected</label>
              <PreviewImage
                :parentImage="subEntrance.payload.selected_icon"
                :defaultImage="cmsIconUploadDefault()"
                :aspectRatio="'1/1'"
                :maxWidth="'3rem'"
                @update:modelValue="(val) => (subEntrance.payload.selected_icon = val)"
                @update:img-file="(file) => handleIconFile(file, subEntrance, 'selected_icon')"
                imageToBase64
                :maxFileSize="102400"
              />
            </div>
          </div>
        </div>

        <!-- 開啟方式 -->
        <div class="field-section">
          <label class="field-label">{{ $t("common.redirect_method") }}</label>
          <q-select
            v-model="subEntrance.payload.opening_method"
            :options="openingMethodList"
            dense
            options-dense
            outlined
            map-options
            emit-value
            class="field-input"
          />
        </div>

        <!-- 登入前/後 -->
        <div class="field-section">
          <label class="field-label">{{ $t("table_header.before_after_login") }}</label>
          <q-select
            v-model="subEntrance.payload.display_login"
            :options="displayLoginList"
            dense
            options-dense
            outlined
            map-options
            emit-value
            class="field-input"
          />
        </div>

        <!-- 連結設定 -->
        <div class="field-section">
          <label class="field-label">{{ $t("common.link") }}</label>
          <EntranceLink v-model="subEntrance.type" :entrance="subEntrance" :mainEntranceType="props.entrance.type" />
        </div>
      </div>

      <!-- 新增導航項目 -->
      <div class="card-entrance-horizontal add-container">
        <h4 class="add-title">{{ $t("cms.click_add_entrance") }}</h4>
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
  import { CMS_OPENING_METHOD } from "src/utils/constants"
  import { translateAiText } from "@/api/ai"
  import type * as Request from "src/api/request.type"
  import { VueDraggableNext } from "vue-draggable-next"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import EntranceLink from "src/pages/WebsiteSettings/Cms/component/EntranceLink.vue"

  const { t } = useI18n()
  const $q = useQuasar()
  const { initEntrance, setFile, openingMethodList, displayLoginList } = useCms()
  const { cmsIconUploadDefault, btnSort, btnTrash, btnAdd } = useImage()
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

  // 初始化 nested_entrance
  const initNestedEntrance = () => {
    if (!props.entrance.payload.nested_entrance) {
      props.entrance.payload.nested_entrance = []
    }
  }

  // 移除項目
  const removeEntrance = (index: number) => {
    if (props.entrance.payload.nested_entrance) {
      props.entrance.payload.nested_entrance.splice(index, 1)
    }
  }

  // 處理圖標檔案上傳
  const handleIconFile = async (file: File, item: Request.CmsEntranceItem, type: string) => {
    if (file) {
      setFile(file)
      if (type === "icon") {
        item.payload.iconFileName = file.name
      } else {
        item.payload.selectedIconFileName = file.name
      }
    }
  }

  // 新增導航項目
  const handleAddEntrance = async () => {
    const entrance = await initEntrance()
    entrance.payload.opening_method = CMS_OPENING_METHOD.Enums.NEW_TAB
    entrance.payload.title = ""
    entrance.payload.icon = ""
    entrance.payload.selected_icon = ""
    entrance.payload.display_login = 0
    entrance.payload.lang_titles = {}
    entrance.payload.currentLang = languageList.value[0]?.label || ""

    // 初始化多語系標題
    languageList.value.forEach((lang) => {
      entrance.payload.lang_titles![lang.label] = ""
    })

    props.entrance.payload.nested_entrance?.push(entrance)
  }

  // AI 翻譯
  const applyLanguage = async (subEntrance: Request.CmsEntranceItem) => {
    try {
      const langTitles = subEntrance.payload.lang_titles
      const currentLang = subEntrance.payload.currentLang
      if (!langTitles || !currentLang) return

      const currentText = langTitles[currentLang]

      if (!currentText) {
        $q.notify({
          type: "negative",
          message: t("message.please_fill_the_first_language_content_before_using_ai_translation"),
          position: "top",
          timeout: 1500
        })
        return
      }

      $q.loading.show()
      const languages = Object.keys(langTitles)
      const { status, data } = await translateAiText([{ input_text: currentText, languages }])

      if (status && Array.isArray(data) && data.length) {
        Object.keys(data[0].translations).forEach((item) => {
          subEntrance.payload.lang_titles![item] = data[0].translations[item]
        })
        $q.notify({
          type: "positive",
          message: t("message.ai_translation_completed"),
          position: "top",
          timeout: 1500
        })
      }
    } catch (error) {
      console.error("applyLanguage error", error)
    } finally {
      $q.loading.hide()
    }
  }

  onMounted(() => {
    initNestedEntrance()
  })
</script>

<style lang="scss" scoped>
  @import "../../../../../../css/_variable.sass";
  @import "../../../../../../css/cms.scss";
  @import "../../../../../../css/dragTable.scss";

  .navbar-horizontal-container {
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
        height: fit-content !important;
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

          .field-input {
            width: 100%;
            margin-left: 0 !important;
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

          .icon-row {
            display: flex;
            gap: 1rem;

            .icon-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.25rem;
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
