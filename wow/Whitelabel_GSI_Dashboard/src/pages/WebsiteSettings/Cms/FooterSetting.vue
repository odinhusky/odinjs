<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #after>
      <q-card class="no-shadow bg-transparent memberLevelSettingsWrapper">
        <div class="msk" v-if="!permission.edit"></div>
        <q-card-section align="center" class="q-mx-auto card-section">
          <div class="text-bold q-mb-sm text-left">{{ $t("table_header.content2") }}</div>
          <div class="col-12">
            <AiLanguage class="w-full justify-end" @applyLanguage="applyLanguage" />
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
                  <div>
                    <!-- <q-input
                      v-model.trim="currentContent"
                      rows="30"
                      type="textarea"
                      class="custom-textarea"
                      :placeholder="$t('common.please_enter_content')"
                    />-->
                    <Editor :model-value="getPage(lang)?.content" @update:model-value="handelEditor" />
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
          <div class="text-bold q-mb-sm text-left q-mt-md">{{ $t("common.supplier_logo") }}</div>
          <q-card-section class="q-pt-xs">
            <div class="row q-col-gutter-md">
              <VueDraggableNext :list="providerData" class="drag-container q-mt-md" :disabled="disabledDrag">
                <div class="col-3 q-mt-md" v-for="(imgitem, index) in providerData" :key="index">
                  <div class="q-mr-md" v-if="index < providerData.length - 1">
                    <PreviewImage
                      :parentImage="providerData[index]"
                      :defaultImage="addKycDefault()"
                      :aspectRatio="'400/120'"
                      :max-file-size="2097152"
                      @update:modelValue="updateListImgUrl($event, index)"
                      imageToBase64
                    />
                  </div>
                  <div class="col q-mr-md q-pt-md text-left" v-if="index < providerData.length - 1">
                    <div class="img_tool">
                      <div class="left-btn">
                        <img
                          :src="btnSort()"
                          alt="sort-button"
                          @mouseenter="disabledDrag = false"
                          @mouseleave="disabledDrag = true"
                          @touchstart="disabledDrag = false"
                          @touchend="disabledDrag = true"
                        />
                      </div>
                      <div class="right-btn">
                        <q-btn outline color="deep-orange" @click="removePic(index)">
                          {{ $t("btn.remove") }}
                          <q-icon class="q-ml-xs" size="xs" name="delete_outline" />
                        </q-btn>
                      </div>
                    </div>
                  </div>
                  <div v-if="index === providerData.length - 1">
                    <div class="q-mr-md">
                      <PreviewImage
                        :defaultImage="addKycDefault()"
                        :aspectRatio="'210/120'"
                        :max-file-size="2097152"
                        @update:modelValue="addListImgUrl($event)"
                        imageToBase64
                      />
                    </div>
                  </div>

                  <!--end-->
                </div>
              </VueDraggableNext>
              <!--<div class="col-3" v-if="addImg">
                <div class="q-mr-md">
                  <PreviewImage
                    :defaultImage="addKycDefault()"
                    :aspectRatio="'210/120'"
                    :max-file-size="2097152"
                    @update:modelValue="addListImgUrl($event)"
                    imageToBase64
                  />
                </div>
              </div>-->
            </div>
          </q-card-section>
          <q-btn color="main-color" class="btnSubmit" :loading="isLoading" @click="onSubmit" v-if="permission.edit">{{
            $t("btn.check")
          }}</q-btn>
        </q-card-section>
      </q-card>
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive, computed, watch, nextTick } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useCms } from "src/composables/useCms"
  import { CMS_TYPE, LANGUAGE_TYPE } from "src/utils/constants"
  import { VueDraggableNext } from "vue-draggable-next"
  import { useImage } from "src/hook/useImage"
  import { useQuasar } from "quasar"
  import { getProductList } from "@/api/product"
  import { useSearch } from "@/hook/useSearch"
  import { addCmsItem, editCmsItem } from "src/api/cms"
  import Editor from "@/components/editor/Editor.vue"
  import { useEnv } from "src/hook/useEnv"
  import { useI18n } from "vue-i18n"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { usePermission } from "@/hook/usePermission"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"

  const { addKycDefault, btnSort } = useImage()

  const splitterModel = ref(100)

  const { t } = useI18n()

  const $q = useQuasar()
  const isLoading = ref(false)

  function onDragEnd() {}

  interface dropdownItem {
    label: string
    value: number
  }

  const { initCmsForm, cmsForm, cmsList, handleGetCmsList, handleGetCmsDetail } = useCms()
  const isAdd = ref(false)
  const currentLanguage = ref(Object.keys(cmsForm.value.setting.lang)[0])
  const providerData = ref<string[]>([])
  const { envData, removePrefixDeep } = useEnv()
  const { VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const disabledDrag = ref(true)
  const defaultImg = ref("")
  const addImg = ref(true)
  const { permission } = usePermission()

  onMounted(async () => {
    await handleGetCmsList(CMS_TYPE.Enums.FOOTER_SETTINGS)
    if (cmsList.value.length > 0) {
      await handleGetCmsDetail(cmsList.value[0].id)
      providerData.value = cmsForm.value.setting.logo_sort.map((item) => `${VITE_APP_BASE_API}/${item}`)
    } else {
      isAdd.value = true
      initCmsForm(CMS_TYPE.Enums.FOOTER_SETTINGS)
    }
    providerData.value.push("")
  })

  watch(
    () => cmsForm.value.setting.lang,
    (newLang) => {
      currentLanguage.value = Object.keys(newLang)[0]
    },
    { deep: true }
  )

  const getPage = (lang: string) => {
    return cmsForm.value.page.find((p: { lang: string }) => p.lang === lang) || { title: "", content: "" }
  }

  const handelEditor = (value: string) => {
    const page = getPage(currentLanguage.value)
    if (page) {
      page.content = value
    }
  }

  const addListImgUrl = (value: string) => {
    addImg.value = false
    const emptyStringIndex = providerData.value.indexOf("")
    if (emptyStringIndex !== -1) {
      providerData.value.splice(emptyStringIndex, 1)
    }

    providerData.value.push(value)
    providerData.value.push("")
    console.log(providerData.value)
    setTimeout(() => {
      addImg.value = true
    }, 300)
  }
  const updateListImgUrl = (value: string, index: number) => {
    providerData.value[index] = value
  }
  const removePic = (index: number) => {
    providerData.value.splice(index, 1)
  }
  /*
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
  })*/
  const onSubmit = async () => {
    let api = editCmsItem
    let msg = ""

    cmsForm.value.setting.logo_sort = [...providerData.value]
    const emptyStringIndex = cmsForm.value.setting.logo_sort.indexOf("")
    if (emptyStringIndex !== -1) {
      cmsForm.value.setting.logo_sort.splice(emptyStringIndex, 1)
    }
    if (isAdd.value) {
      cmsForm.value.title = "footer"
      api = addCmsItem
      msg = t("message.add_success")
    } else {
      api = editCmsItem
      msg = t("message.edit_success")
    }
    cmsForm.value.setting.product_entrance_type = 0
    cmsForm.value.setting.product_integration_id = 0
    /*let payload = removePrefixDeep(cmsForm.value, `${VITE_APP_DYNAMIC_RESOURCE_URL}/`)
    payload = removePrefixDeep(payload, `${VITE_APP_BASE_API}/`)*/

    const { search, status } = useSearch(api)
    isLoading.value = true
    await search(cmsForm.value)
    isLoading.value = false
    if (status.value) {
      $q.notify({
        type: "positive",
        message: msg,
        position: "top",
        timeout: 300
      })
      setTimeout(() => {
        history.go(0)
      }, 1000)
    }
  }

  const applyLanguage = async () => {
    try {
      const firstItemData = cmsForm.value.page.find((item) => item.lang === currentLanguage.value)
      if (!firstItemData || !firstItemData?.content) {
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
      const { status, data } = await translateAiText([{ input_text: firstItemData.content, languages }])
      if (status && Array.isArray(data) && data.length) {
        Object.keys(data[0].translations).forEach((item) => {
          const target = cmsForm.value.page.find((p: { lang: string }) => p.lang === item)
          if (target) {
            target.content = data[0].translations[item]
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
</script>

<style lang="scss" scoped>
  @import "../../../css/_variable.sass";
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
  ::v-deep(.button-style) {
    margin-top: 1.25rem;
    .q-checkbox__inner {
      display: none;
    }
    .q-checkbox__label {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
      border: 0.0625rem solid #3f3c4433;
      padding: 0.5rem 32px;
      border-radius: 62.4375rem;
      img {
        margin-right: 0.5rem;
      }
    }
    &[aria-checked="true"] {
      .q-checkbox__label {
        border-color: $mainColor;
        border-width: 0.125rem;
      }
    }
  }
  ::v-deep(.q-btn--fab-mini) {
    width: 10px;
    min-width: 10px;
  }

  .w-100 {
    width: 100%;
  }
  .card-section {
    width: 60.3125rem;
    padding-left: 4rem;
    padding-right: 4rem;
    background: white;
    padding-bottom: 5rem;
    padding-top: 2rem;
    margin-bottom: 3rem;
    margin-top: 2rem;
  }
  .provider-choice-area {
    display: flex;
    margin-bottom: 3rem;
    .card {
      font-size: 14px;
    }
    .game_list {
      height: 510px;
      width: 100%;
      border: 1px solid #c2c2ca !important;
      padding-top: 0.9375rem;
      .q-checkbox {
        ::v-deep(.q-checkbox__label) {
          display: flex;
          width: 100%;
          align-items: center;
          padding-left: 16px;
          .game-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
          }

          .game-item-index {
            width: 38px;
            height: 28px;
            line-height: 26px;
            text-align: center;
            border: 1px solid #c2c2ca;
            border-radius: 5px;
          }
          .game-img {
            width: 4.6875rem;
            height: 30px;
            margin-right: 10px;
            margin-left: 15px;
          }
          .game-img2 {
            width: 4.6875rem;
            height: 30px;
          }
          .drag-bar {
            cursor: grab;
            font-size: 20px;
            margin-left: 5px;
          }

          .game-item-label {
            margin-left: 8px;
          }
        }
      }
    }
    .card_left {
      width: 300px;
    }
    .card_right {
      width: 400px;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .q-checkbox {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
    }
    .controll_bar {
      display: flex;
      flex-direction: column;
      align-self: center;
      .btn {
        width: 50px;
        height: 50px;
      }
    }
    ::v-deep(.q-field--outlined .q-field__control) {
      height: 36px;
    }
    ::v-deep(.q-field__marginal) {
      height: 36px !important;
    }
  }
  .pd0 {
    padding-top: 0px;
    padding-bottom: 0px;
  }
  .img_tool {
    display: flex;
    align-items: center;
    span {
      font-size: 12px;
    }
  }
  .left-btn,
  .right-btn {
    display: flex;
    justify-content: center;
  }
  .left-btn {
    cursor: pointer;
    margin-right: 1.25rem;
  }
  .drag-container {
    display: flex;
    flex-wrap: wrap;
  }

  .disabled,
  .disabled *,
  [disabled],
  [disabled] * {
    opacity: 1 !important;
    cursor: pointer !important;
  }
  .msk {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 99;
    cursor: not-allowed;
  }
</style>
