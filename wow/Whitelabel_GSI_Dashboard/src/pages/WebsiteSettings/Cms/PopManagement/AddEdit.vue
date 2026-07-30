<template>
  <div class="q-pl-md q-pt-md q-pr-md">
    <SubPageOnlyTitle :backLabelI18nKey="isEditMode ? 'btn.edit' : 'btn.add'" />
    <div class="q-pa-md">
      <div class="q-pa-xl bg-white">
        <q-form @submit="handleSubmit">
          <q-card flat>
            <!-- 自訂入口 -->
            <q-card-section>
              <div class="text-bold q-mb-sm text-left">{{ $t("table_header.content2") }}</div>
              <div class="row q-col-gutter-md" v-if="isShow">
                <div class="col-6">
                  <q-tabs
                    v-model="currentLanguage"
                    dense
                    class="bg-transparent text-grey-8 lanarea"
                    active-color="main-color"
                    content-class="languageTab"
                    outside-arrows
                  >
                    <q-tab
                      v-for="(lang, key) in language.list"
                      :key="key"
                      :name="lang.label"
                      :label="lang.label"
                      class="q-px-none q-mr-sm"
                      content-class="languageTabItem"
                    />
                  </q-tabs>
                </div>
                <div class="q-pl-lg col-6 row items-center q-col-gutter-md">
                  <AiLanguage class="mb-2" @applyLanguage="applyLanguage" />
                </div>

                <div class="col-12">
                  <q-tab-panels
                    v-model="currentLanguage"
                    animated
                    swipeable
                    class="bg-transparent q-mt-md"
                    v-if="cmsMode === 'title'"
                  >
                    <q-tab-panel
                      v-for="(lang, key) in language.list"
                      :name="lang.label"
                      :label="lang.label"
                      class="q-px-none"
                    >
                      <div>
                        <Editor
                          :model-value="cmsForm.setting.lang[lang.label as LANGUAGE_TYPE.Enums]"
                          @update:model-value="handelEditorTitle"
                        />
                      </div>
                    </q-tab-panel>
                  </q-tab-panels>
                  <q-tab-panels v-model="currentLanguage" animated swipeable class="bg-transparent q-mt-md" v-else>
                    <q-tab-panel
                      v-for="(lang, key) in language.list"
                      :name="lang.label"
                      :label="lang.label"
                      class="q-px-none"
                    >
                      <div>
                        <Editor
                          :model-value="cmsForm.entrance[index].lang[lang.label as LANGUAGE_TYPE.Enums]"
                          @update:model-value="handelEditorTitle"
                        />
                      </div>
                    </q-tab-panel>
                  </q-tab-panels>
                </div>
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
  import { computed, onMounted, ref, reactive } from "vue"
  import { useRoute } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import * as Request from "src/api/request.type"
  import { useCms } from "src/composables/useCms"
  import { useRule } from "src/hook/useRule"
  import { CMS_TYPE, LANGUAGE_TYPE } from "src/utils/constants"
  import SubPageOnlyTitle from "layouts/SubPage/OnlyTitle.vue"
  import Editor from "@/components/editor/Editor.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useSiteStore } from "src/stores/siteStore"
  import { clone } from "ramda"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"

  const { t } = useI18n()
  const $q = useQuasar()
  const route = useRoute()
  const Rules = useRule()
  const { isLoading, cmsForm, handleEditCmsItem, handleGetCmsDetail, titleLangObj } = useCms()
  const cmsMode = computed(() => route.params.mode)
  const cmsId = computed(() => Number(route.params.id) || 0)
  const siteStore = useSiteStore()

  const backRouteName = "CmsPopList"
  const isEditMode = computed(() => {
    const routeName = route.name as string
    return routeName.toLowerCase().includes("edit")
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
    apply: languageList?.value[0] ? languageList?.value[0].value : 0
  })
  const currentLanguage = ref(Object.keys(cmsForm.value.setting.lang)[0])

  function checkLangValidity(lang: { [key: string]: string }): boolean {
    for (let key in lang) {
      const langKey = siteStore.langList.map((lang) => lang.label)
      if (langKey.includes(key as LANGUAGE_TYPE.Enums) && lang[key] === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.form_validate_error_tip")} (${key})`,
          position: "top",
          timeout: 1000
        })
        return false
      }
    }
    return true
  }

  const handleSubmit = () => {
    if (cmsMode.value === "title" && !checkLangValidity(cmsForm.value.setting.lang)) {
      return false
    }
    if (cmsMode.value === "entrance" && !checkLangValidity(cmsForm.value.entrance[index.value].lang)) {
      return false
    }
    handleEditCmsItem(backRouteName)
  }

  const handelEditorTitle = (value: string) => {
    if (cmsMode.value === "title") {
      cmsForm.value.setting.lang[currentLanguage.value as LANGUAGE_TYPE.Enums] = value
    } else {
      cmsForm.value.entrance[index.value].lang[currentLanguage.value as LANGUAGE_TYPE.Enums] = value
    }
  }
  const applyLanguage = async () => {
    try {
      let firstItemData

      if (cmsMode.value === "title") {
        firstItemData = cmsForm.value.setting.lang[currentLanguage.value as LANGUAGE_TYPE.Enums]
      } else {
        firstItemData = cmsForm.value.entrance[index.value].lang[currentLanguage.value as LANGUAGE_TYPE.Enums]
      }

      if (!firstItemData) {
        $q.notify({
          type: "negative",
          message: t("message.please_fill_the_first_language_content_before_using_ai_translation"),
          position: "top",
          timeout: 300
        })
        return
      }

      $q.loading.show()
      const languages =
        cmsMode.value === "title"
          ? Object.keys(cmsForm.value.setting.lang)
          : Object.keys(cmsForm.value.entrance[index.value].lang)
      const { status, data } = await translateAiText([{ input_text: firstItemData, languages }])
      if (status && Array.isArray(data) && data.length) {
        Object.keys(data[0].translations).forEach((item) => {
          if (cmsMode.value === "title") {
            cmsForm.value.setting.lang[item as LANGUAGE_TYPE.Enums] = data[0].translations[item]
          } else {
            cmsForm.value.entrance[index.value].lang[item as LANGUAGE_TYPE.Enums] = data[0].translations[item]
          }
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
  const index = ref(Number(route.query.index))
  const isShow = ref(false)
  onMounted(async () => {
    await handleGetCmsDetail(cmsId.value)

    if (!isEditMode.value) {
      cmsForm.value.entrance.push({
        type: CMS_TYPE.Enums.POPMANAGEMENT as number,
        payload: {},
        lang: clone(titleLangObj.value) as Request.CmsLangTitle,
        img: ""
      })

      index.value = cmsForm.value.entrance.length - 1
    }
    isShow.value = true
  })
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  @import "../../../../css/cms.scss";
  @import "../../../../css/dragTable.scss";
  ::v-deep(.q-tabs__content) {
    justify-content: start !important;
  }
</style>
