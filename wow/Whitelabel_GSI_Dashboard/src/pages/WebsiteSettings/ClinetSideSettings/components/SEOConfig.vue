<template>
  <q-form class="form-seo" @submit="handleSubmit">
    <q-card class="q-pa-md bg-transparent" flat>
      <q-card-section class="form-seo-title">{{ $t("seo.seo_configuration") }}</q-card-section>
      <q-card-section class="form-seo-content">
        <template v-for="seoItem in form.seoList" :key="seoItem.type">
          <h3 class="form-text">
            {{ $t(SEO_CONFIG_TYPE.I18nKeys[seoItem.type]) }}
            <q-icon
              v-if="seoItem.type === SEO_CONFIG_TYPE.Enums.OTHER"
              name="error"
              color="warning"
              size="1.25rem"
              class="cursor-pointer ml-1"
            >
              <q-tooltip>{{ $t("seo.other_tooltip") }}</q-tooltip>
            </q-icon>
          </h3>
          <div class="form-value">
            <q-input
              v-model="seoItem.content"
              :type="seoItem.type === SEO_CONFIG_TYPE.Enums.OTHER ? 'textarea' : undefined"
              dense
              outlined
              class="form-input"
              :placeholder="$t(SEO_CONFIG_TYPE.I18nPlaceholder[seoItem.type])"
            ></q-input>
          </div>
        </template>
      </q-card-section>
      <q-card-section class="warning-content">
        <span class="warning-text"> {{ $t("seo.seo_configuration_reminder") }}</span>
      </q-card-section>

      <q-card-section class="flex items-center justify-center gap-4">
        <q-btn color="primary" class="submit-btn" type="submit" :loading="isLoading" :disable="!permission.edit">
          {{ $t("btn.save") }}
        </q-btn>
      </q-card-section>
      <q-separator class="my-4" />
    </q-card>
  </q-form>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { usePermission } from "@/hook/usePermission"
  import { useHtmlTag } from "src/composables/useHtmlTag"
  import { useS3Upload } from "src/composables/useS3Upload"
  import { useSearch } from "@/hook/useSearch"
  import { getSiteVerification, putSiteVerification } from "src/api/siteVerification"
  import type * as Request from "src/api/request.type"
  import type * as Response from "src/api/response.type"
  import { SEO_CONFIG_TYPE } from "src/utils/constants"

  type SEOItem = {
    type: SEO_CONFIG_TYPE.Enums
    content: string
  }

  type SEOForm = {
    seoList: SEOItem[]
  }

  const fileName = "custom_head_inject_extensions.html"
  const { t } = useI18n()
  const $q = useQuasar()
  const { generateSEOHTMLMeta, parseSEOHTMLMeta } = useHtmlTag()
  const { permission } = usePermission()
  const { S3_STORAGE_CATEGORY, uploadSingleFile, handlePostS3Download } = useS3Upload()
  const isLoading = ref(false)

  const form = reactive<SEOForm>({
    seoList: []
  })

  const generateMetaString = (seoList: SEOItem[]): string => {
    const map = seoList.reduce(
      (acc, item) => {
        acc[item.type] = item.content
        return acc
      },
      {} as Record<string, string>
    )

    return generateSEOHTMLMeta(map)
  }

  const handleSubmit = async () => {
    const htmlContent = generateMetaString(form.seoList)

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
    const file = new File([blob], fileName, {
      type: "text/html"
    })

    if (file) {
      isLoading.value = true
      const { status, data } = await uploadSingleFile({
        file,
        storage_category: S3_STORAGE_CATEGORY.Enums.site_verification
      })

      if (status && data?.objectKey && data.file.name) {
        const payload: Request.PutSiteVerification = {
          file_name: file.name,
          storage_key: data.objectKey
        }
        const { search, status: putStatus } = useSearch(putSiteVerification)
        await search(payload)

        if (putStatus.value) {
          $q.notify({
            type: "positive",
            message: t("message.edit_success"),
            position: "top",
            timeout: 300
          })
        }
      }
      isLoading.value = false
    }
  }

  const initSEOList = async () => {
    form.seoList = Object.values(SEO_CONFIG_TYPE.Enums).map((type) => ({
      type,
      content: ""
    }))
    await handelGetSiteVerification()
  }

  const handelGetSiteVerification = async () => {
    isLoading.value = true
    const { search, tableData, status } = useSearch(getSiteVerification)
    await search()

    if (status.value && tableData.value.length) {
      const siteVerificationItem = tableData.value.find(
        (item: Response.SiteVerificationItem) => item.file_name === fileName
      )

      if (siteVerificationItem) {
        const payload = {
          file_name: siteVerificationItem.file_name,
          object_key: siteVerificationItem.storage_key
        }
        const res = await handlePostS3Download(payload)

        if (res.status && res.data?.download_url) {
          await getSEOData(res.data.download_url)
        }
      }
    }
    isLoading.value = false
  }

  const getSEOData = async (url: string) => {
    fetch(url)
      .then((res) => res.text())
      .then((html) => {
        const parsed = parseSEOHTMLMeta(html)
        form.seoList = form.seoList.map((item) => ({
          ...item,
          content: parsed[item.type] ?? item.content // 沒有對應就保留原值
        }))
      })
      .catch((err) => console.error(err))
  }

  onMounted(async () => {
    await initSEOList()
  })
</script>

<style scoped lang="scss">
  .form-seo {
    .form-seo-title {
      @apply p-0 text-xl font-bold;
    }
    .form-seo-content {
      @apply grid grid-cols-[auto_1fr] gap-4 items-center mb-0 px-0;

      .form-text {
        @apply text-base flex items-center;
      }

      .form-value {
        @apply flex items-center;
        .form-input {
          width: 35.625rem;
          :deep(.q-field__control) {
            border-radius: 0.25rem;
            min-height: 2.25rem;

            :deep(.q-field__native) {
              min-height: 2.25rem;
            }
          }
          :deep(.q-field__append) {
            border-radius: 0.25rem;
            min-height: 2.25rem;
          }
          :deep(.q-field__bottom) {
            bottom: -1rem;
          }
        }
      }
    }
    .warning-content {
      @apply p-0;
      .warning-text {
        @apply text-base font-semibold align-middle;
        color: red;
      }
    }
    .submit-btn {
      width: 12rem;
      height: 2.875rem;
      font-size: 1rem;
      border-radius: 6px;
    }
  }
</style>
