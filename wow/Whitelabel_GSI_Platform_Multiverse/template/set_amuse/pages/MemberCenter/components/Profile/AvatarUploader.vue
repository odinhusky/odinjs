<template>
  <div class="avatar-uploader-container">
    <div class="avatar-wrapper">
      <!-- 頭像顯示區域 -->
      <div class="avatar-preview" @click="handleAvatarClick">
        <img v-if="currentAvatarUrl" :src="currentAvatarUrl" alt="avatar" class="avatar-image" />
        <div v-else class="default-avatar">
          <q-icon name="person" size="50px" color="grey-6" />
        </div>

        <!-- 相機圖標 -->
        <div class="camera-icon-overlay">
          <q-icon name="photo_camera" size="12px" color="white" />
        </div>
      </div>

      <!-- 刪除按鈕 - 只有在有頭像時顯示 -->
      <div v-if="hasAvatar" class="delete-button" @click.stop="handleDelete">
        <q-icon name="close" size="12px" color="white" />
      </div>

      <!-- 隐藏的文件输入 -->
      <q-file
        ref="fileInputRef"
        v-model="selectedFile"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        :max-file-size="maxSize * 1024"
        style="display: none"
        @update:model-value="handleFileSelect"
        @rejected="onRejected"
      />
    </div>

    <!-- 顯示/隱藏開關 -->
    <div class="visibility-toggle" :class="{ 'is-hidden': !isVisible }">
      <span class="toggle-label">{{
        isVisible ? $t("member.profile.avatar-show") : $t("member.profile.avatar-hide")
      }}</span>
      <q-toggle v-model="isVisible" color="orange" size="xs" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { QFile, useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useDynamicImage, DYNAMIC_IMAGE_DISPLAY_SIZE, squareCoverTransform } from "src/common/composables/useDynamicImage"
import { useS3Upload } from "src/common/composables/useS3Upload"

const $q = useQuasar()
const { t } = useI18n()
const { buildImageUrl } = useDynamicImage()
const { uploadSingleFile, S3_STORAGE_CATEGORY } = useS3Upload()

interface Props {
  modelValue?: string
  showAvatar?: boolean
  maxSize?: number
  defaultAvatar?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  showAvatar: true,
  maxSize: 2048,
  defaultAvatar: ""
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
  "update:showAvatar": [value: boolean]
  "upload-success": [data: { path: string; url: string }]
  "upload-error": [error: any]
  delete: []
}>()

const fileInputRef = ref<QFile>()
const selectedFile = ref<File>()
const isVisible = computed({
  get: () => props.showAvatar,
  set: (value) => {
    emit("update:showAvatar", value)
  }
})

const uploadedPath = ref("")
const isDeleted = ref(false)

const currentAvatarUrl = computed(() => {
  if (isDeleted.value) {
    return ""
  }

  if (selectedFile.value && uploadedPath.value === "preview") {
    try {
      return URL.createObjectURL(selectedFile.value)
    } catch (e) {
      console.error("創建預覽URL失敗:", e)
    }
  }

  if (uploadedPath.value && uploadedPath.value !== "preview") {
    return buildImageUrl(uploadedPath.value, undefined, squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.AVATAR_MD))
  }

  if (props.modelValue) {
    return buildImageUrl(props.modelValue, undefined, squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.AVATAR_MD))
  }

  return props.defaultAvatar
})

const hasAvatar = computed(() => {
  return !isDeleted.value && (!!uploadedPath.value || !!props.modelValue)
})

const handleAvatarClick = () => {
  fileInputRef.value?.pickFiles()
}

const handleFileSelect = async () => {
  if (!selectedFile.value) return

  isDeleted.value = false
  uploadedPath.value = "preview"

  try {
    $q.loading.show({
      message: t("common.alarm.uploading") || "上傳中..."
    })

    const { status, data, msg } = await uploadSingleFile({
      file: selectedFile.value,
      storage_category: S3_STORAGE_CATEGORY.Enums.avatar,
      expiration: 3600
    })

    if (!status || !data) {
      throw new Error(msg || "Upload failed")
    }

    uploadedPath.value = data.objectKey
    selectedFile.value = undefined
    isDeleted.value = false

    emit("update:modelValue", data.objectKey)
    emit("upload-success", {
      path: data.objectKey,
      url: buildImageUrl(data.objectKey, undefined, squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.AVATAR_MD))
    })

    $q.notify({
      type: "positive",
      message: t("common.alarm.uploadSuccess") || "上傳成功",
      position: "top",
      timeout: 1000
    })
  } catch (error: any) {
    console.error("Upload error:", error)
    uploadedPath.value = ""
    selectedFile.value = undefined

    emit("upload-error", error)

    $q.notify({
      type: "negative",
      message: error.message || t("common.alarm.uploadFailed") || "上傳失敗",
      position: "top",
      timeout: 1000
    })
  } finally {
    $q.loading.hide()
  }
}

const handleDelete = () => {
  isDeleted.value = true
  uploadedPath.value = ""
  selectedFile.value = undefined
  emit("update:modelValue", "")
  emit("delete")
}

const onRejected = () => {
  $q.notify({
    type: "negative",
    message: t("error_msg.file_size_exceeds_limit") || `文件大小超過限制 (${props.maxSize}KB)`,
    position: "top",
    timeout: 2000
  })
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && !uploadedPath.value) {
      isDeleted.value = false
    }
  }
)
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_amuse/assets/css/_variable.sass";

.avatar-uploader-container {
  display: flex;
  align-items: flex-end;
  gap: 2rem;

  @include iphone-width {
    align-items: flex-end;
    gap: 1rem;
  }
}

.avatar-wrapper {
  position: relative;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
}
.avatar-preview {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: visible;
  cursor: pointer;
  position: relative;
  background: #1a1a1a;

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    background: linear-gradient(180deg, #f9e8b3 0%, #876e41 100%);
    z-index: 0;
  }

  &:hover .camera-icon-overlay {
    opacity: 1;
  }
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 1;
  border-radius: 50%;
}

.default-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2a2a2a;
  position: relative;
  z-index: 1;
  border-radius: 50%;
}

.camera-icon-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 18px;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 2;
  border-radius: 0 0 50% 50%;
}

.delete-button {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(180deg, #f9e8b3 0%, #876e41 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  transition: all 0.3s;
  padding: 1px;

  &::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 0;
  }

  :deep(.q-icon) {
    position: relative;
    z-index: 1;
  }

  // &:hover {
  //   background: rgba(237, 119, 46, 0.9);
  //   border-color: #ed772e;
  //   transform: scale(1.1);
  // }
}

.visibility-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #c99737;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  width: auto;
  height: 24px;
  transition: background 0.3s ease;
  box-sizing: border-box;

  &.is-hidden {
    background: #6b6b6b;
  }

  @include iphone-width {
    justify-content: space-between;
    width: auto;
    height: 24px;
    align-items: center;
  }
}

.toggle-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #000;
  line-height: 1.2;
  white-space: nowrap;
  flex-shrink: 0;
}

:deep(.q-toggle) {
  transform: scale(0.5);
  transform-origin: center;
  margin: 0 -10px 0 -6px;
  flex-shrink: 0;

  .q-toggle__track {
    background: rgba(255, 255, 255, 0.3);
  }

  .q-toggle__thumb {
    color: white;
  }
}
</style>
