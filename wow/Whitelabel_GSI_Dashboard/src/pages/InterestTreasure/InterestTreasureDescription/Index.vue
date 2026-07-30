<template>
  <div class="q-pa-md">
    <q-card class="bg-white px-80 py-6">
      <q-card-section>
        <div class="text-h5 text-bold text-center">{{ $t("menu.advertising_and_description_settings") }}</div>
      </q-card-section>

      <q-form @submit="handleSubmit">
        <!-- 多语言信息 -->
        <q-card-section class="q-pb-xs">
          <div class="row tab-container !mb-0">
            <div class="col-6">
              <q-tabs
                v-model="language.current"
                class="justify-start lang-tabs q-ml-md text-grey"
                indicator-color="light-blue-1"
                active-color="black"
                dense
              >
                <q-tab
                  class="rounded-t-lg"
                  v-for="(lang, key) in language.list"
                  :key="key"
                  :name="lang.label"
                  :label="lang.label"
                />
              </q-tabs>
            </div>

            <div class="q-pl-lg col-6 row items-center q-col-gutter-md justify-end">
              <AiLanguage @applyLanguage="applyLanguage" />
            </div>
          </div>
          <q-tab-panels v-model="language.current" animated class="bg-[#EFF7FF] q-pa-sm rounded-borders">
            <q-tab-panel v-for="item in form.info" :key="item.lang" :name="item.lang" class="q-px-none">
              <div class="row q-col-gutter-xl">
                <div class="col-6">
                  <div class="q-mb-none text-bold">{{ $t("interest_treasure.banner_ad") }}</div>
                  <div class="text-caption text-grey-7 q-mb-xs">*{{ $t("common.Image2mb") }}</div>
                  <div class="row no-wrap">
                    <div class="col-9 q-pt-xs">
                      <PreviewImage
                        :parentImage="item.lang ? previewImages[item.lang] || item.image_path : item.image_path"
                        :defaultImage="interestTreasureBanner()"
                        :aspectRatio="'236/132'"
                        @update:modelValue="updateInterestTreasureBanner($event, item)"
                        imageToBase64
                        :maxFileSize="204800"
                      />
                    </div>
                    <div class="col-3">
                      <div class="column justify-end q-pl-md fit">
                        <q-btn class="q-mt-xs" color="red-5" @click="deleteImage(item)">{{
                          $t("common.delete")
                        }}</q-btn>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="q-mb-xs text-bold">{{ $t("edit_form.detailed_description_page") }}</div>
                  <Editor v-model="item.description" :init="{ height: 320 }" />
                  <div class="text-bold q-mb-xs mt-2">{{ $t("menu.rule_title") }}</div>
                  <div class="rule-list text-body2">
                    <p v-for="n in 7" :key="n">{{ n }}.{{ $t(`menu.rule_${n}`) }}</p>
                  </div>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <!-- 操作按钮 -->
        <q-card-actions align="center" class="q-pa-md q-mt-md">
          <q-btn outline :label="$t('btn.cancel')" class="action-btn" @click="handleCancel" />
          <q-btn type="submit" color="primary" :label="$t('btn.submit')" class="action-btn" :loading="submitting" />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted } from "vue"
  import { useRouter } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useSiteStore } from "@/stores/siteStore"
  import { useS3Upload } from "@/composables/useS3Upload"
  import { useImage } from "@/hook/useImage"
  import { useEnv } from "@/hook/useEnv"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import Editor from "@/components/editor/Editor.vue"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { postInterestDescription, getInterestDescription } from "@/api/interest"
  import { translateAiText } from "@/api/ai"
  import { S3_STORAGE_CATEGORY } from "@/utils/constants"

  const router = useRouter()
  const { t } = useI18n()
  const $q = useQuasar()
  const siteStore = useSiteStore()
  const { uploadSingleFile } = useS3Upload()
  const { promotionEventBanner: interestTreasureBanner } = useImage()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()

  const submitting = ref(false)
  const loading = ref(false)

  // 预览图片
  const previewImages = ref<Record<string, string>>({})

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
    current: languageList?.value[0] ? languageList?.value[0].label : "zh-CN"
  })

  // 表单数据
  const form = reactive<{
    info: Array<{
      lang: string
      image_path: string
      description: string
    }>
  }>({
    info: []
  })

  // 初始化表单
  const initializeForm = () => {
    form.info = languageList.value.map((lang) => ({
      lang: lang.label,
      image_path: "",
      description: ""
    }))
  }

  // 将 base64 转换为 File 对象
  const base64ToFile = (base64String: string, filename = "image.png"): File => {
    const arr = base64String.split(",")
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png"
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  // 获取图片完整路径
  const getImageFullPath = (objectKey: string): string => {
    if (!objectKey) return ""
    if (objectKey.startsWith("http://") || objectKey.startsWith("https://")) {
      return objectKey
    }
    return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${objectKey}`
  }

  // 更新利息宝 Banner
  const updateInterestTreasureBanner = async (
    value: string,
    item: { lang: string; image_path: string; description: string }
  ) => {
    if (!value) {
      item.image_path = ""
      if (item.lang) previewImages.value[item.lang] = ""
      return
    }

    if (!item.lang) {
      console.error("item.lang is undefined")
      return
    }

    try {
      // 如果是 base64 字符串，需要上传到 S3
      if (value.startsWith("data:image")) {
        // 先保存 base64 用于预览
        previewImages.value[item.lang] = value

        // 将 base64 转换为 File 对象
        const timestamp = Date.now()
        const file = base64ToFile(value, `interest_description_${timestamp}.png`)

        // 上传到 S3
        const result = await uploadSingleFile({
          file: file,
          storage_category: S3_STORAGE_CATEGORY.Enums.interest,
          expiration: 600
        })

        $q.loading.hide()

        if (result.status && result.data?.objectKey) {
          // 保存 object_key 到 image_path（用于提交）
          item.image_path = result.data.objectKey
          // 保留 base64 用于预览
          previewImages.value[item.lang] = value
        } else {
          // 上传失败，清除预览
          previewImages.value[item.lang] = ""
          item.image_path = ""
          $q.notify({
            type: "negative",
            message: result.msg || t("error_msg.image_upload_failed"),
            position: "top"
          })
        }
      } else {
        // 如果已经是 URL 或 object_key，直接保存
        item.image_path = value
        previewImages.value[item.lang] = value
      }
    } catch (error) {
      $q.loading.hide()
      if (item.lang) {
        previewImages.value[item.lang] = ""
      }
      item.image_path = ""
      console.error("图片上传失败:", error)
      $q.notify({
        type: "negative",
        message: t("error_msg.image_upload_failed"),
        position: "top"
      })
    }
  }

  const deleteImage = (item: { lang: string; image_path: string; description: string }) => {
    item.image_path = ""
    if (item.lang) previewImages.value[item.lang] = ""
  }

  // AI 翻譯套用至其他語言
  const applyLanguage = async () => {
    const fromItem = form.info?.find((e) => e.lang === language.current)
    if (!fromItem) return

    const payload = []

    if (fromItem.description) {
      payload.push({
        input_text: fromItem.description
      })
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
      const languages = language.list.map((item) => item.label)
      const payloadWithLanguages = payload.map((item) => ({ ...item, languages }))
      const { status, data } = await translateAiText(payloadWithLanguages)
      if (status && Array.isArray(data) && data.length) {
        const descriptionTranslations = data?.[0]?.translations

        form.info?.forEach((item) => {
          if (descriptionTranslations) {
            item.description = descriptionTranslations?.[item.lang as string] ?? item.description
          }
          // 將當前語系的圖片套用到所有語系
          item.image_path = fromItem.image_path
          if (item.lang && fromItem.lang) {
            previewImages.value[item.lang] = previewImages.value[fromItem.lang] || ""
          }
        })
      }
    } catch (error) {
      console.error("AI 翻譯失敗:", error)
      $q.notify({
        type: "negative",
        message: t("message.ai_translation_failed") || "AI translation failed",
        position: "top"
      })
    } finally {
      $q.loading.hide()
    }
  }

  // 加载现有数据
  const loadData = async () => {
    loading.value = true
    try {
      const response = await getInterestDescription()
      if (response.code === 0 && response.data && Array.isArray(response.data)) {
        // 将 API 数据映射到表单
        response.data.forEach((apiItem: Response.GetInterestDescriptionData) => {
          const formItem = form.info.find((item) => item.lang === apiItem.lang)
          if (formItem) {
            formItem.image_path = apiItem.image_path || ""
            formItem.description = apiItem.description || ""
            // 如果有 image_path，设置预览图片
            if (apiItem.image_path) {
              previewImages.value[apiItem.lang] = getImageFullPath(apiItem.image_path)
            }
          }
        })
      }
    } catch (error) {
      console.error("加载数据失败:", error)
      $q.notify({
        type: "negative",
        message: t("message.load_failed"),
        position: "top"
      })
    } finally {
      loading.value = false
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    submitting.value = true

    try {
      // 准备提交数据
      const params: Request.PostInterestDescription = form.info.map((item) => ({
        lang: item.lang,
        image_path: item.image_path,
        description: item.description
      }))

      console.log(params)

      const response = await postInterestDescription(params)

      if (response.code === 0) {
        $q.notify({
          type: "positive",
          message: t("aiAssistant.save_success"),
          position: "top"
        })
        // 重新加载数据
        await loadData()
      } else {
        $q.notify({
          type: "negative",
          message: response.msg || t("aiAssistant.failed_to_save"),
          position: "top"
        })
      }
    } catch (error) {
      console.error("保存失败:", error)
      $q.notify({
        type: "negative",
        message: t("aiAssistant.failed_to_save"),
        position: "top"
      })
    } finally {
      submitting.value = false
    }
  }

  // 取消
  const handleCancel = () => {
    router.back()
  }

  // 初始化
  onMounted(async () => {
    initializeForm()
    await loadData()
  })
</script>

<style scoped lang="scss">
  .q-tab-panels {
    border-radius: 4px;
  }

  .tab-container {
    margin-bottom: 16px;
  }

  .lang-tabs {
    :deep(.q-tab) {
      min-height: 40px;
    }

    :deep(.q-tab--active) {
      background-color: #eff7ff;
    }
  }

  .bg-edit-color {
    background-color: #f5f5f5;
  }

  .px-80 {
    padding-left: 80px;
    padding-right: 80px;
  }

  .py-6 {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  .action-btn {
    min-width: 180px;
  }

  .rule-list {
    p {
      margin: 0 0 2px 0;
      line-height: 1.6;
    }
  }
</style>
