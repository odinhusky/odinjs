<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #after>
      <div class="msk" v-if="!permission.edit"></div>
      <q-form class="form-container" @submit="handleSubmit">
        <q-card class="q-pa-md bg-transparent" flat>
          <q-card-section class="form-content">
            <template v-for="pixelCode in form.pixel_codes" :key="pixelCode.type">
              <div class="form-left">
                <h3 class="form-title">{{ $t(PIXEL_CODE_TYPE.I18nKeys[pixelCode.type]) }}</h3>
                <q-toggle
                  v-if="ShowEnabled[pixelCode.type]"
                  v-model="pixelCode.is_enabled"
                  :color="pixelCode.is_enabled ? 'positive' : 'negative'"
                  :false-value="false"
                  :true-value="true"
                  stack-label
                  size="lg"
                  :label="pixelCode.is_enabled ? $t('common.enable') : $t('common.disable')"
                />
              </div>

              <div class="form-value">
                <q-input
                  v-model="pixelCode.content"
                  dense
                  outlined
                  class="form-input"
                  :placeholder="$t('common.please_enter_content')"
                  :type="InputType[pixelCode.type] || 'text'"
                  rows="3"
                  :autogrow="isAutoGrow[pixelCode.type]"
                ></q-input>
              </div>
            </template>
          </q-card-section>
          <q-card-section class="warning-content">
            <q-img :src="svgImg('warning')" loading="lazy" class="icon-warning"></q-img>
            <span class="warning-text"> {{ $t("seo.warning_text") }}</span>
          </q-card-section>

          <q-card-section class="flex items-center justify-center gap-4">
            <q-btn color="primary" class="submit-btn" type="submit" :loading="isLoading" :disable="!permission.edit">{{
              $t("btn.check")
            }}</q-btn>
          </q-card-section>
        </q-card>
      </q-form>
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar, QInputProps } from "quasar"
  import { useImage } from "@/hook/useImage"
  import { useSearch } from "@/hook/useSearch"
  import { getPixelCodes, putPixelCodes } from "src/api/pixelCodes"
  import * as Request from "src/api/request.type"
  import type * as Response from "src/api/response.type"
  import { PIXEL_CODE_TYPE } from "src/utils/constants"
  import { usePermission } from "@/hook/usePermission"

  const ShowItem: Record<PIXEL_CODE_TYPE.Enums, boolean> = {
    [PIXEL_CODE_TYPE.Enums.HEAD]: true,
    [PIXEL_CODE_TYPE.Enums.BODY_START]: false,
    [PIXEL_CODE_TYPE.Enums.BODY_END]: false,
    [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]: true,
    [PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT]: true,
    [PIXEL_CODE_TYPE.Enums.EVENT_REGISTER]: true,
    [PIXEL_CODE_TYPE.Enums.EVENT_REGISTER_SUCCESS]: true
  }

  const ShowEnabled: Record<PIXEL_CODE_TYPE.Enums, boolean> = {
    [PIXEL_CODE_TYPE.Enums.HEAD]: false,
    [PIXEL_CODE_TYPE.Enums.BODY_START]: false,
    [PIXEL_CODE_TYPE.Enums.BODY_END]: false,
    [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]: true,
    [PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT]: true,
    [PIXEL_CODE_TYPE.Enums.EVENT_REGISTER]: true,
    [PIXEL_CODE_TYPE.Enums.EVENT_REGISTER_SUCCESS]: true
  }

  const InputType: Record<PIXEL_CODE_TYPE.Enums, QInputProps["type"]> = {
    [PIXEL_CODE_TYPE.Enums.HEAD]: "textarea",
    [PIXEL_CODE_TYPE.Enums.BODY_START]: "textarea",
    [PIXEL_CODE_TYPE.Enums.BODY_END]: "textarea",
    [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]: "text",
    [PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT]: "text",
    [PIXEL_CODE_TYPE.Enums.EVENT_REGISTER]: "text",
    [PIXEL_CODE_TYPE.Enums.EVENT_REGISTER_SUCCESS]: "text"
  }

  const isAutoGrow: Record<PIXEL_CODE_TYPE.Enums, boolean> = {
    [PIXEL_CODE_TYPE.Enums.HEAD]: false,
    [PIXEL_CODE_TYPE.Enums.BODY_START]: false,
    [PIXEL_CODE_TYPE.Enums.BODY_END]: false,
    [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]: true,
    [PIXEL_CODE_TYPE.Enums.EVENT_DEPOSIT]: true,
    [PIXEL_CODE_TYPE.Enums.EVENT_REGISTER]: true,
    [PIXEL_CODE_TYPE.Enums.EVENT_REGISTER_SUCCESS]: true
  }

  const enumOrder = Object.values(PIXEL_CODE_TYPE.Enums)

  const $q = useQuasar()
  const { t } = useI18n()

  const { permission } = usePermission()
  const { svgImg } = useImage()
  const isLoading = ref(false)
  const splitterModel = ref(100)

  const form = reactive<Request.PutPixelCodes>({
    pixel_codes: enumOrder
      .map((type) => ({ type, content: "", is_enabled: false }))
      .filter((item: Response.PixelCode) => ShowItem[item.type])
  })

  const handelGetPixelCodes = async () => {
    const { search, tableData, status } = useSearch(getPixelCodes)
    isLoading.value = true
    await search()
    isLoading.value = false

    if (status.value && tableData.value) {
      form.pixel_codes = tableData.value
        .map((item: Response.PixelCode) => item)
        .filter((item: Response.PixelCode) => ShowItem[item.type])
        .sort((a: Response.PixelCode, b: Response.PixelCode) => enumOrder.indexOf(a.type) - enumOrder.indexOf(b.type))
    }
  }
  async function handleSubmit() {
    const { search, status } = useSearch(putPixelCodes)
    isLoading.value = true
    await search(form)
    isLoading.value = false
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    }
  }

  onMounted(async () => {
    await handelGetPixelCodes()
  })
</script>

<style lang="scss" scoped>
  @import "../../../css/_variable.sass";
  .form-container {
    max-width: 100%;

    .form-content {
      @apply grid grid-cols-[auto_1fr] gap-4 items-center mb-0;

      .form-left {
        @apply flex items-center justify-between;
      }
      .form-title {
        @apply text-base font-bold;
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
      max-width: 850px; /* 最長寬度限制 */
      .icon-warning {
        @apply w-6;
      }

      .warning-text {
        @apply text-base font-semibold align-middle ml-2;
        color: red;
      }
    }

    .submit-btn {
      width: 12rem;
      height: 2.25rem;
      font-size: 1rem;
      border-radius: 6px;
    }
  }

  .msk {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 99;
    cursor: not-allowed;
  }
</style>
