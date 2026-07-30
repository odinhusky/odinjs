<template>
  <div class="s3-image-uploader flex flex-col gap-1.5 pt-4 sm:gap-2 sm:pt-5">
    <div class="flex flex-wrap items-start gap-4 sm:gap-5">
      <div
        v-for="(key, index) in modelValue"
        :key="key + index"
        class="relative h-[80px] w-[80px] shrink-0 sm:h-[100px] sm:w-[100px]"
      >
        <div
          class="h-full w-full overflow-hidden rounded-lg border border-solid border-[var(--neutral-05)] bg-white"
          :class="{ 'cursor-pointer': !!previewUrls[key] && !disabled }"
          @click="onThumbClick(key)"
        >
          <q-img
            v-if="previewUrls[key]"
            :src="previewUrls[key]"
            fit="cover"
            class="h-full w-full"
            spinner-color="primary"
          />
          <div
            v-else
            class="flex h-full w-full flex-col items-center justify-center gap-1 bg-[var(--neutral-03)] px-1"
          >
            <q-icon name="image" class="text-[22px] text-[var(--neutral-100)] sm:text-[28px]" />
          </div>
        </div>
        <q-btn
          v-if="!disabled"
          unelevated
          round
          dense
          padding="none"
          class="s3-img-uploader-remove absolute left-full top-0 z-[1] !h-[1.2rem] !min-h-[1.2rem] !w-[1.2rem] !min-w-[1.2rem] shrink-0 -translate-x-1/2 -translate-y-1/2 bg-[var(--emotional-01)] text-white sm:!h-6 sm:!min-h-6 sm:!w-6 sm:!min-w-6"
          @click.stop="removeAt(index)"
        >
          <Icon icon="mdi:close" width="18" height="18" class="s3-img-uploader-remove-icon" />
        </q-btn>
      </div>

      <label
        v-if="modelValue.length < maxFiles"
        class="relative flex h-[80px] w-[80px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-solid border-[var(--neutral-05)] bg-[var(--neutral-03)] px-1 text-center sm:h-[100px] sm:w-[100px] sm:gap-2"
        :class="disabled || uploading ? 'pointer-events-none cursor-not-allowed opacity-60' : ''"
      >
        <input
          type="file"
          class="sr-only"
          :disabled="disabled || uploading"
          :accept="accept"
          multiple
          @change="onFileInputChange"
        />
        <q-inner-loading :showing="uploading" color="primary" size="28px" class="s3-uploader-inner-loading" />
        <template v-if="!uploading">
          <q-icon name="add" class="shrink-0 text-[24px] text-[var(--neutral-100)] sm:text-[30px]" />
          <span class="break-words text-center text-sm font-normal leading-tight text-[var(--neutral-08)]">
            {{ t("member.messenger.uploadImage") }}
          </span>
        </template>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { useQuasar } from "quasar"
import ImagePreviewDialog from "src/common/components/ImagePreviewDialog.vue"
import { useS3Upload } from "src/common/composables/useS3Upload"
import { Enums as S3StorageCategoryEnum } from "src/common/utils/constants/s3StorageCategory"
import { onBeforeUnmount, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"

const props = withDefaults(
  defineProps<{
    /** 已上傳圖片的 S3 `object_key` 陣列（與後端約定一致） */
    modelValue: string[]
    /** 後端 S3 分類，須與 `/platform/v1/player/s3/upload-url` 支援值對齊 */
    storageCategory: S3StorageCategoryEnum
    disabled?: boolean
    maxFiles?: number
    maxSizeMb?: number
    accept?: string
  }>(),
  {
    disabled: false,
    maxFiles: 5,
    maxSizeMb: 5,
    accept: "image/jpeg,image/png,image/webp",
  }
)

const emit = defineEmits<{
  "update:modelValue": [value: string[]]
}>()

const { t } = useI18n()
const $q = useQuasar()
const { uploadSingleFile } = useS3Upload()

const uploading = ref(false)
/** 本機上傳成功後暫存的預覽 blob URL（object_key → url） */
const previewUrls = reactive<Record<string, string>>({})

function revokePreview(key: string) {
  const url = previewUrls[key]
  if (url) {
    URL.revokeObjectURL(url)
    delete previewUrls[key]
  }
}

function removeAt(index: number) {
  const key = props.modelValue[index]
  if (key == null) return
  revokePreview(key)
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index)
  )
}

function onThumbClick(key: string) {
  if (props.disabled) return
  const orderedKeys = props.modelValue.filter((k) => Boolean(previewUrls[k]))
  const images = orderedKeys.map((k) => previewUrls[k] as string)
  const index = orderedKeys.indexOf(key)
  if (index < 0 || images.length === 0) return
  $q.dialog({
    component: ImagePreviewDialog,
    componentProps: {
      images,
      initialIndex: index,
    },
  })
}

async function onFileInputChange(ev: Event) {
  const input = ev.target as HTMLInputElement
  // 先複製成陣列再清空：FileList 與 value 連動，先清空會讓檔案列表變空、不會發 API
  const chosenFiles = input.files ? Array.from(input.files) : []
  input.value = ""
  if (chosenFiles.length === 0) return

  const maxBytes = props.maxSizeMb * 1024 * 1024
  const nextKeys = [...props.modelValue]

  for (const file of chosenFiles) {
    if (nextKeys.length >= props.maxFiles) {
      $q.notify({
        type: "negative",
        message: t("member.deposit.depositDetailUploadExceedsMax"),
        position: "top",
      })
      break
    }
    if (file.size > maxBytes) {
      $q.notify({
        type: "negative",
        message: t("member.deposit.depositDetailUploadWarning", { mb: props.maxSizeMb }),
        position: "top",
      })
      continue
    }

    const previewUrl = URL.createObjectURL(file)
    uploading.value = true
    const { status, data, msg } = await uploadSingleFile({
      file,
      storage_category: props.storageCategory,
    })
    uploading.value = false

    if (!status || !data || !("objectKey" in data) || !data.objectKey) {
      URL.revokeObjectURL(previewUrl)
      if (msg) {
        $q.notify({ type: "negative", message: String(msg), position: "top" })
      }
      continue
    }

    const { objectKey } = data
    previewUrls[objectKey] = previewUrl
    nextKeys.push(objectKey)
    emit("update:modelValue", [...nextKeys])
  }
}

onBeforeUnmount(() => {
  for (const key of Object.keys(previewUrls)) {
    revokePreview(key)
  }
})
</script>

<style scoped lang="scss">
.s3-img-uploader-remove-icon :deep(svg) {
  color: #fff;
  width: 14.4px;
  height: 14.4px;
}

@media (min-width: 640px) {
  .s3-img-uploader-remove-icon :deep(svg) {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 639px) {
  .s3-uploader-inner-loading :deep(.q-spinner) {
    font-size: 22.4px !important;
    width: 22.4px !important;
    height: 22.4px !important;
  }
}
</style>
