<template>
  <div class="space-y-2">
    <q-file
      ref="fileRef"
      v-model="selectedFiles"
      multiple
      class="hidden"
      :accept="accept"
      @update:model-value="onSelectFiles"
    />

    <div class="flex flex-wrap gap-2">
      <div
        v-for="(image, index) in previewImages"
        :key="`${image.url}-${index}`"
        class="s3-image-item relative h-20 w-20 overflow-hidden rounded border border-gray-300 bg-gray-100"
        :class="{ 's3-image-item--removing': removingKeys.has(image.uid) }"
      >
        <q-img :src="image.url" fit="cover" class="h-full w-full cursor-pointer" @click="openPreview(index)" />
        <div class="s3-image-overlay absolute inset-0 z-10 flex items-center justify-center gap-2 bg-black/45">
          <q-btn
            flat
            round
            dense
            size="xs"
            icon="visibility"
            color="white"
            class="s3-overlay-action-btn"
            @click.stop.prevent="openPreview(index)"
          />
          <q-btn
            v-if="!disabled"
            flat
            round
            dense
            size="xs"
            icon="delete"
            color="white"
            class="s3-overlay-action-btn"
            @click.stop.prevent="removeImage(index)"
          />
        </div>
      </div>

      <button
        v-if="!isMaxReached"
        type="button"
        class="flex h-20 w-20 flex-col items-center justify-center rounded border border-dashed border-gray-400 text-gray-600 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="disabled || uploading"
        @click="pickFiles"
      >
        <q-spinner v-if="uploading" size="16px" />
        <template v-else>
          <q-icon name="add" size="18px" />
          <span class="mt-1 text-[11px]">{{ buttonLabel || t("common.upload_image") }}</span>
        </template>
      </button>
    </div>

    <q-dialog v-model="previewVisible" maximized>
      <q-card class="bg-black">
        <q-card-section class="row items-center justify-between text-white">
          <div>{{ previewIndex + 1 }} / {{ previewImages.length }}</div>
          <q-btn flat round dense icon="close" color="white" @click="previewVisible = false" />
        </q-card-section>
        <q-card-section class="q-pa-none">
          <q-carousel
            v-model="previewIndex"
            animated
            swipeable
            navigation
            arrows
            infinite
            height="calc(100vh - 64px)"
            class="bg-black text-white"
          >
            <q-carousel-slide
              v-for="(image, index) in previewImages"
              :key="`${image.url}-preview-${index}`"
              :name="index"
            >
              <div class="flex h-full w-full items-center justify-center">
                <q-img :src="image.url" fit="contain" class="h-full w-full" />
              </div>
            </q-carousel-slide>
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue"
  import { useQuasar, type QFile } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useS3Upload } from "@/composables/useS3Upload"
  import { useDynamicResourceUrl } from "@/composables/useDynamicResourceUrl"
  import type { S3_STORAGE_CATEGORY } from "@/utils/constants"

  const props = withDefaults(
    defineProps<{
      modelValue: string[]
      storageCategory: S3_STORAGE_CATEGORY.Enums
      disabled?: boolean
      buttonLabel?: string
      maxCount?: number
      enableValidation?: boolean
      accept?: string
    }>(),
    {
      disabled: false,
      buttonLabel: "",
      maxCount: 0,
      enableValidation: false,
      accept: "image/*"
    }
  )

  const emit = defineEmits<{
    (e: "update:modelValue", value: string[]): void
  }>()

  const $q = useQuasar()
  const { t } = useI18n()
  const { uploadSingleFile } = useS3Upload()
  const { normalizeDynamicResourceUrl } = useDynamicResourceUrl()

  const fileRef = ref<QFile | null>(null)
  const selectedFiles = ref<File[] | null>(null)
  const uploading = ref(false)
  const previewVisible = ref(false)
  const previewIndex = ref(0)
  const removingKeys = ref(new Set<string>())
  const isMaxReached = computed(() => props.maxCount > 0 && (props.modelValue?.length || 0) >= props.maxCount)

  const previewImages = computed(() => {
    return (props.modelValue || []).map((item, index) => ({
      key: item,
      uid: `${item}-${index}`,
      url: normalizeDynamicResourceUrl(item)
    }))
  })

  const pickFiles = () => {
    fileRef.value?.pickFiles()
  }

  const openPreview = (index: number) => {
    previewIndex.value = index
    previewVisible.value = true
  }

  const removeImage = async (index: number) => {
    const target = previewImages.value[index]
    if (!target) return
    removingKeys.value.add(target.uid)
    await new Promise((resolve) => setTimeout(resolve, 180))

    const next = [...(props.modelValue || [])]
    next.splice(index, 1)
    emit("update:modelValue", next)
    removingKeys.value.delete(target.uid)
    if (previewIndex.value >= next.length) {
      previewIndex.value = Math.max(0, next.length - 1)
    }
  }

  const onSelectFiles = async (files: File[] | File | null) => {
    let normalizedFiles = Array.isArray(files) ? files : files ? [files] : []
    if (!normalizedFiles.length) return

    if (props.maxCount > 0) {
      const remain = Math.max(0, props.maxCount - (props.modelValue?.length || 0))
      if (remain <= 0) {
        if (props.enableValidation) {
          $q.notify({
            type: "negative",
            message: t("error_msg.file_size_exceeds_limit"),
            position: "top",
            timeout: 1000
          })
        }
        selectedFiles.value = null
        return
      }
      if (normalizedFiles.length > remain) {
        if (props.enableValidation) {
          $q.notify({
            type: "warning",
            message: `${t("common.image")} max ${props.maxCount}`,
            position: "top",
            timeout: 1000
          })
        }
        normalizedFiles = normalizedFiles.slice(0, remain)
      }
    }

    uploading.value = true
    const uploadedKeys: string[] = [...(props.modelValue || [])]

    for (const file of normalizedFiles) {
      const res = await uploadSingleFile({
        file,
        storage_category: props.storageCategory
      })
      if (res.status && res.data?.objectKey) {
        uploadedKeys.push(res.data.objectKey)
      } else {
        $q.notify({
          type: "negative",
          message: res.msg || t("error_msg.image_upload_failed"),
          position: "top",
          timeout: 1000
        })
      }
    }

    emit("update:modelValue", uploadedKeys)
    selectedFiles.value = null
    uploading.value = false
  }
</script>

<style scoped>
  .s3-image-overlay {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
    background: rgba(0, 0, 0, 0.45);
  }

  .s3-image-item:hover .s3-image-overlay {
    opacity: 1;
    pointer-events: auto;
  }

  .s3-image-item {
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }

  .s3-image-item--removing {
    opacity: 0;
    transform: scale(0.9);
  }

  .s3-overlay-action-btn {
    background: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.8);
  }
</style>
