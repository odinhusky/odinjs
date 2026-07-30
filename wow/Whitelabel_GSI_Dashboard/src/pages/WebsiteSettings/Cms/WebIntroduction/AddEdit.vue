<template>
  <div class="q-pl-md q-pt-md q-pr-md">
    <SubPageOnlyTitle :backLabelI18nKey="isEditMode ? 'btn.edit' : 'btn.add'" />
    <div class="q-pa-md">
      <div class="q-pa-xl bg-white">
        <q-form @submit="handleSubmit">
          <q-card flat>
            <!-- 標題 -->
            <q-card-section class="row items-center q-gutter-md">
              <h3 class="text-subtitle1 text-weight-bold q-my-none">{{ $t("table_header.title") }}</h3>
              <q-input
                v-model="cmsForm.title"
                dense
                outlined
                class="cms-form-input"
                :placeholder="$t('common.please_enter_content')"
                lazy-rules
                :rules="[Rules.required()]"
              ></q-input>
            </q-card-section>
            <q-card-section class="row items-center justify-between">
              <div class="row items-center gap-4">
                <h3 class="text-subtitle1 text-weight-bold q-mb-none">{{ $t("cms.page_address") }}</h3>
                <q-select
                  v-model="cmsForm.url_id"
                  :options="cmsOptions"
                  dense
                  options-dense
                  outlined
                  map-options
                  emit-value
                  class="cms-form-input"
                >
                </q-select>
              </div>

              <AiLanguage class="ml-4" @applyLanguage="applyLanguage" />
            </q-card-section>
            <q-card-section class="row items-center q-gutter-md">
              <div class="col-12 col-sm q-mt-md languageTabsWrapper">
                <q-tabs
                  v-model="currentLanguage"
                  dense
                  class="bg-transparent text-grey-8 lanarea"
                  active-color="main-color"
                  content-class="languageTab"
                  outside-arrows
                >
                  <q-tab
                    v-for="(lang, key) in Object.keys(cmsForm.setting.lang).sort()"
                    :key="key"
                    :name="lang"
                    :label="lang"
                    class="q-px-none q-mr-sm"
                    content-class="languageTabItem"
                  />
                </q-tabs>

                <q-tab-panels v-model="currentLanguage" animated swipeable class="bg-transparent q-mt-md">
                  <q-tab-panel
                    v-for="(lang, key) in Object.keys(cmsForm.setting.lang).sort()"
                    :name="lang"
                    :label="lang"
                    class="q-px-none"
                  >
                    <div class="q-mb-md">
                      <div class="q-pb-sm">{{ $t("cms.display_title") }}</div>
                      <q-input
                        v-model.trim="getPage(lang).title"
                        dense
                        outlined
                        class="cms-form-input"
                        :placeholder="$t('common.please_enter_content')"
                        :rules="[Rules.required()]"
                      />
                    </div>
                    <div class="q-mb-md">
                      <div class="q-pb-sm">{{ $t("table_header.content2") }}</div>
                      <Editor :model-value="currentContent" @update:model-value="handelEditor" />
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </div>
            </q-card-section>
            <!-- btns -->
            <q-card-actions class="btns q-mt-xl q-py-md" align="center">
              <q-btn
                outline
                color="main-color"
                class="q-mr-sm col-2"
                size="md"
                :to="{ name: backRouteName }"
                :loading="isLoading"
              >
                {{ $t("btn.cancel") }}
              </q-btn>
              <q-btn color="main-color" class="col-2" size="md" type="submit" :loading="isLoading">{{
                $t("btn.save")
              }}</q-btn>
            </q-card-actions>
          </q-card>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from "vue"
  import { useRoute } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useCms } from "src/composables/useCms"
  import { CMS_TYPE, LANGUAGE_TYPE, CMS_WEBINTRODUCTION_TYPE } from "src/utils/constants"
  import SubPageOnlyTitle from "layouts/SubPage/OnlyTitle.vue"
  import Editor from "@/components/editor/Editor.vue"
  import { useRule } from "src/hook/useRule"
  import { useQueryStore, DropdownType } from "src/stores/queryStore"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"

  const { t } = useI18n()
  const $q = useQuasar()
  const route = useRoute()
  const { isLoading, cmsForm, initCmsForm, handleGetCmsDetail, handleAddCmsItem, handleEditCmsItem } = useCms()
  const cmsId = computed(() => Number(route.params.id) || 0)
  const Rules = useRule()
  const queryStore = useQueryStore()
  const saveUrlId = ref(0)
  const backRouteName = "CmsWebIntroductionList"
  const isEditMode = computed(() => {
    const routeName = route.name as string
    return routeName.toLowerCase().includes("edit")
  })

  const handleSubmit = () => {
    //如果他沒有換指定ID 跟 沒有選擇 就不要送url_id到後端
    if (saveUrlId.value === cmsForm.value.url_id) {
      delete cmsForm.value.url_id
    }
    if (isEditMode.value) {
      handleEditCmsItem(backRouteName)
      return
    }
    handleAddCmsItem(backRouteName)
  }

  onMounted(async () => {
    await queryStore.getCmsWebIntroductionsList()

    if (isEditMode.value && cmsId.value) {
      await handleGetCmsDetail(cmsId.value)
    } else {
      initCmsForm(CMS_TYPE.Enums.WEBSITE_INFORMATION)
    }
    saveUrlId.value = cmsForm.value.url_id ?? 0
  })
  const newOption = { label: t("table_header.please_select"), value: 0 }

  const cmsOptions = computed(() => {
    const options = [...queryStore.cmsWebIntroductionList].map((option) => {
      return {
        ...option,
        label:
          t(CMS_WEBINTRODUCTION_TYPE.I18nKeys[option.value as keyof typeof CMS_WEBINTRODUCTION_TYPE.I18nKeys]) ||
          t("common.unknow")
      }
    })
    console.log(options)
    options.unshift(newOption)
    return options
  })

  const currentLanguage = ref(Object.keys(cmsForm.value.setting.lang)[0])

  const getPage = (lang: string) => {
    return cmsForm.value.page.find((p: { lang: string }) => p.lang === lang) || { title: "", content: "" }
  }

  const handelEditor = (value: string) => {
    const page = getPage(currentLanguage.value)
    if (page) {
      page.content = value
    }
  }

  const currentContent = computed({
    get() {
      const page = getPage(currentLanguage.value)
      return page ? page.content : ""
    },
    set(value) {
      const page = getPage(currentLanguage.value)
      if (page) {
        page.content = value
      }
    }
  })

  const applyLanguage = async () => {
    try {
      const firstItemData = cmsForm.value.page.find((item) => item.lang === currentLanguage.value)

      const payload = []
      if (firstItemData?.title) {
        payload.push({ input_text: firstItemData.title })
      }
      if (firstItemData?.content) {
        payload.push({ input_text: firstItemData.content })
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

      $q.loading.show()
      const languages = Object.keys(cmsForm.value.setting.lang)
      const payloadWithLanguages = payload.map((item) => ({ ...item, languages }))
      const { status, data } = await translateAiText(payloadWithLanguages)
      if (status && Array.isArray(data) && data.length) {
        if (!!firstItemData?.title) {
          const titleTranslations = data?.[0]?.translations
          const contentTranslations = data?.[1]?.translations

          cmsForm.value.page.forEach((item) => {
            item.title = titleTranslations?.[item.lang]

            if (contentTranslations) {
              item.content = contentTranslations?.[item.lang]
            } else {
              item.content = ""
            }
          })
        } else {
          cmsForm.value.page.forEach((item) => {
            item.title = ""
            item.content = data?.[0]?.translations?.[item.lang]
          })
        }

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
  @import "../../../../css/_variable.sass";
  @import "../../../../css/cms.scss";
  .languageTabsWrapper {
    .lanarea {
      border-bottom: 1px solid #dbe0f2;
    }
    ::v-deep(.q-tabs__content) {
      justify-content: start;
    }
    .custom-textarea {
      border: 1px solid #c2c2ca;
    }
    ::v-deep(.q-textarea .q-field__native) {
      padding-left: 1.25rem;
    }
  }
</style>
