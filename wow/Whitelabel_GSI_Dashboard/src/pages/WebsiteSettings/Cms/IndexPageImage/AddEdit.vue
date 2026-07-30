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
            <!-- 會員端標題 -->
            <q-card-section>
              <div class="row items-center">
                <div class="text-subtitle1 text-weight-bold q-mb-none">{{ $t("cms.display_title") }}</div>
                <AiLanguage class="ml-4" @applyLanguage="applyLanguage" />
              </div>
              <div class="row items-center q-gutter-md">
                <div v-for="item in Object.keys(cmsForm.setting.lang).sort()" :key="item">
                  <span>{{ item }}</span>
                  <q-input
                    v-model="cmsForm.setting.lang[item as LANGUAGE_TYPE.Enums]"
                    dense
                    outlined
                    class="cms-form-input"
                    :placeholder="$t('common.please_enter_content')"
                    :rules="[Rules.required()]"
                  ></q-input>
                </div>
              </div>
            </q-card-section>
            <!-- icon、排序方式、入口排序 -->
            <q-card-section class="row items-center q-gutter-md">
              <!-- icon -->
              <div v-for="item in Object.keys(cmsForm.setting.img_lang)" :key="item">
                <span>{{ item }}</span>
                <div class="row items-end" style="width: 16.875rem">
                  <PreviewImage
                    :parentImage="cmsForm.setting.img_lang[item as LANGUAGE_TYPE.Enums]"
                    :defaultImage="addKycDefault()"
                    :aspectRatio="'214/120'"
                    :maxWidth="'214px'"
                    @update:modelValue="updateIconUrl($event, item)"
                    imageToBase64
                    :maxFileSize="1048576"
                  />
                  <div>
                    <!--<p class="q-mb-none">
                      {{ $t("edit_form.image_dimensions", { width: "214", height: "120", unit: $t("edit_form.px") }) }}
                    </p>-->
                    <p class="q-mb-none">{{ $t("edit_form.image_file_size", { limit: "1MB" }) }}</p>
                  </div>
                </div>
              </div>

              <!-- 顯示裝置 -->
              <div>
                <span>{{ $t("cms.display_device") }}</span>
                <q-select
                  v-model="cmsForm.setting.display_device"
                  :options="displayDeviceList"
                  dense
                  options-dense
                  outlined
                  map-options
                  emit-value
                  class="cms-form-input"
                >
                </q-select>
              </div>
            </q-card-section>
            <!-- 自訂入口 -->
            <q-card-section>
              <h3 class="text-subtitle1 text-weight-bold q-mb">{{ $t("common.link") }}</h3>
              <div class="row items-center q-gutter-md">
                <div v-for="(entrance, entranceIndex) in cmsForm.entrance" :key="`entrance-${entranceIndex}`">
                  <EntranceLink v-model="entrance.type" :entrance="entrance" />
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
  import { computed, onMounted } from "vue"
  import { useRoute } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useImage } from "src/hook/useImage"
  import { useCms } from "src/composables/useCms"
  import { useRule } from "src/hook/useRule"
  import { CMS_TYPE, LANGUAGE_TYPE } from "src/utils/constants"
  import SubPageOnlyTitle from "layouts/SubPage/OnlyTitle.vue"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import EntranceLink from "src/pages/WebsiteSettings/Cms/component/EntranceLink.vue"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"

  const { t } = useI18n()
  const $q = useQuasar()
  const route = useRoute()
  const { addKycDefault } = useImage()
  const Rules = useRule()
  const {
    isLoading,
    cmsForm,
    displayLoginList,
    displayDeviceList,
    initCmsForm,
    addCmsFormEntrance,
    handleGetCmsDetail,
    handleAddCmsItem,
    handleEditCmsItem
  } = useCms()
  const cmsId = computed(() => Number(route.params.id) || 0)
  const backRouteName = "CmsIndexPageImageList"
  const isEditMode = computed(() => {
    const routeName = route.name as string
    return routeName.toLowerCase().includes("edit")
  })

  const updateIconUrl = (value: string, language: keyof typeof cmsForm.value.setting.img_lang) => {
    cmsForm.value.setting.img_lang[language] = value
  }

  function checkImgValidity(): boolean {
    Object.keys(cmsForm.value.setting.img_lang).forEach((key) => {
      const imgLangKey = key as keyof typeof cmsForm.value.setting.img_lang
      if (cmsForm.value.setting.img_lang[imgLangKey] === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.pictures_not_uploaded")} (${t(LANGUAGE_TYPE.I18nKeys[imgLangKey])})`,
          position: "top",
          timeout: 1000
        })
        return false
      }
    })
    return true
  }

  const handleSubmit = () => {
    for (const key of Object.keys(cmsForm.value.setting.img_lang)) {
      const imgLangKey = key as keyof typeof cmsForm.value.setting.img_lang
      if (cmsForm.value.setting.img_lang[imgLangKey] === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.pictures_not_uploaded")} (${t(LANGUAGE_TYPE.I18nKeys[imgLangKey])})`,
          position: "top",
          timeout: 1000
        })
        return false
      }
    }
    if (!cmsForm.value.entrance.length) {
      $q.notify({
        type: "negative",
        message: t("error_msg.entrance_required"),
        position: "top",
        timeout: 1000
      })
      return
    }

    if (isEditMode.value) {
      handleEditCmsItem(backRouteName)
      return
    }
    handleAddCmsItem(backRouteName)
  }

  const applyLanguage = async () => {
    try {
      const firstItemData = Object.keys(cmsForm.value.setting.lang)
        .sort()
        .map((item) => cmsForm.value.setting.lang[item as LANGUAGE_TYPE.Enums])
        .find((item) => !!item)
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
      const languages = Object.keys(cmsForm.value.setting.lang)
      const { status, data } = await translateAiText([{ input_text: firstItemData, languages }])
      if (status && Array.isArray(data) && data.length) {
        Object.keys(data[0].translations).forEach((item) => {
          cmsForm.value.setting.lang[item as LANGUAGE_TYPE.Enums] = data[0].translations[item]
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

  onMounted(() => {
    if (isEditMode.value && cmsId.value) {
      handleGetCmsDetail(cmsId.value)
    } else {
      initCmsForm(CMS_TYPE.Enums.INDEXPAGEIMAGE)
      addCmsFormEntrance()
    }
  })
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  @import "../../../../css/cms.scss";
  @import "../../../../css/dragTable.scss";
</style>
