<template>
  <span class="ant-upload" :class="cx(FLEX_CENTER, FLEX_COL)">
    <img :src="svgIcon('camera')" alt="" />
    <q-file
      ref="imgFileRef"
      v-model="fileModel"
      style="display: none"
      :max-file-size="maxFileSize"
      @update:model-value="handleImgUpload($event)"
      accept="image/*,.heic,.HEIC"
      capture="environment"
      @rejected="onRejected"
    />
    <span class="uploadBtn mt-6" @click="selectFile">
      {{ $t("common.btn.openCamera") }}
    </span>
    <span class="tip-message mt-1">{{ $t("common.tip.fileSize", { size: 10000 }) }}</span>
    <span class="tip-message mt-1">{{ $t("common.tip.fileType", { type: "PNG,JPG" }) }}</span>
  </span>
  <div
    ref="previewImage"
    class="preview-image"
    :class="`${className} ${isDragIn ? 'drag-in' : ''} ${disabled ? 'disabled' : ''}`"
    :style="{ 'aspect-ratio': aspectRatio, 'max-width': maxWidth }"
    @click="selectFile"
  ></div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/okbet_green/hooks/useSiteImg"
import { Ref, ref, watch, toRefs, defineEmits, computed, onMounted, onBeforeUnmount } from "vue"
import { QFile, useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
const $q = useQuasar()
const { t } = useI18n()
const { svgIcon } = useSiteImg()
import { cx } from "src/common/utils/cx"
import { FLEX_CENTER, FLEX_COL } from "src/common/utils/constants/styles"

// 检测是否为移动设备
const isMobileDevice = () => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  )
}
const props = defineProps({
  parentImage: {
    type: String,
    required: false,
    default: ""
  },
  side: {
    type: String,
    required: false,
    default: "FRONT"
  },
  defaultImage: {
    type: String,
    required: false,
    default: ""
  },
  imageToBase64: {
    type: Boolean,
    required: false,
    default: false
  },
  outputType: {
    type: String,
    required: false,
    default: "url", // "url" | "base64" | "file"
    validator: (value: string) => ["url", "base64", "file"].includes(value)
  },
  aspectRatio: {
    type: String,
    required: false,
    default: "100/100"
  },
  className: {
    type: String,
    required: false,
    default: ""
  },
  maxFileSize: {
    type: Number,
    required: false,
    default: 5000000
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  detail: {
    type: Object,
    default: () => ({ tipOneSize: "", tipTwoSize: "" })
  },
  maxWidth: {
    type: String,
    required: false,
    default: ""
  }
})
const {
  parentImage,
  defaultImage,
  imageToBase64,
  outputType,
  aspectRatio,
  className,
  maxFileSize,
  disabled,
  maxWidth
} = toRefs(props)
const defaultImageUrl = computed(() => defaultImage.value)
const previewImage = ref()
const isDragIn = ref(false)
const imgFileRef = ref() as Ref<QFile>
const imgFile = new Map<string, File>()

const imgUrl = ref("")
const fileModel = ref<File | null>(null)

const selectFile = () => {
  if (disabled.value) return

  // 如果是电脑设备，显示提示信息，不允许操作 ,  到時候要打開, 測試中
  if (!isMobileDevice()) {
    $q.notify({
      type: "warning",
      message: t("error_message.upload_file_only_camera"),
      position: "top",
      timeout: 3000
    })
    return
  }

  // 移动设备正常执行拍照功能
  imgFileRef.value.pickFiles()
}

// 檢查是否為 HEIC 檔案
const isHEICFile = (file: File): boolean => {
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  )
}

// 轉換 HEIC 檔案為 JPEG
const convertHEICToJPEG = async (file: File): Promise<File> => {
  try {
    // 只在真的遇到 HEIC 檔時才載入，避免把 heic2any 主包打進初始 chunk
    const { default: heic2any } = await import("heic2any")
    const convertedBlob = (await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.8
    })) as Blob

    // 創建新的 File 對象
    const convertedFile = new File([convertedBlob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
      type: "image/jpeg"
    })

    return convertedFile
  } catch (error) {
    console.error("HEIC 轉換失敗:", error)
    $q.notify({
      type: "negative",
      message: "HEIC 檔案轉換失敗，請重試",
      position: "top",
      timeout: 3000
    })
    throw error
  }
}

const handleImgUpload = async ($event: File) => {
  let processedFile = $event

  // 如果是 HEIC 檔案，先轉換為 JPEG
  if (isHEICFile($event)) {
    try {
      $q.loading.show({
        message: "正在處理 HEIC 檔案..."
      })
      processedFile = await convertHEICToJPEG($event)
    } catch (error) {
      $q.loading.hide()
      return // 轉換失敗，停止處理
    } finally {
      $q.loading.hide()
    }
  }

  imgFile.set(props.side, processedFile)
  emit("update:imgFile", imgFile)

  const currentFile = imgFile.get(props.side)
  if (currentFile) {
    // 根據 outputType 決定輸出格式
    if (outputType.value === "base64" || imageToBase64.value) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target?.result as string
        imgUrl.value = base64String
      }
      reader.readAsDataURL(currentFile)
    } else {
      // "file" 和 "url" 模式都使用 Object URL 用於預覽
      imgUrl.value = URL.createObjectURL(currentFile)
    }
  }
}
const emit = defineEmits(["update:modelValue", "update:imgFile", "img-uploaded"])
watch(parentImage, (newValue) => {
  imgUrl.value = newValue
})
watch(imgUrl, (newValue) => {
  emit("update:modelValue", {
    imgs: newValue,
    file: imgFile.get(props.side)
  })
})

// watch(imgFile, (newValue) => {
//   emit("update:imgFile", newValue)
// })

function preventDefaults(e: Event) {
  e.preventDefault()
  e.stopPropagation()
}
function handleDragIn() {
  isDragIn.value = true
}
function handleDragOut() {
  isDragIn.value = false
}
async function handleDrop(e: DragEvent) {
  // 如果是电脑设备，不允许拖拽上传
  if (!isMobileDevice()) {
    $q.notify({
      type: "warning",
      message: t("error_message.upload_file_only_camera"),
      position: "top",
      timeout: 3000
    })
    return
  }

  const dt = e.dataTransfer
  const files = dt?.files as FileList
  if (files?.length > 0) {
    const file = files[0]
    const fileSizeInBytes = file.size
    if (maxFileSize?.value) {
      if (fileSizeInBytes > maxFileSize.value) {
        onRejected()
        return
      }
    }
    await handleImgUpload(files[0])
  }
}
function onRejected() {
  $q.notify({
    type: "negative",
    message: t("error_message.file_size_exceeds_limit"),
    position: "top",
    timeout: 1000
  })
}
onMounted(() => {
  imgUrl.value = parentImage.value

  // 只在移动设备上启用拖拽功能
  if (isMobileDevice()) {
    // 防止默认事件和冒泡
    ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      previewImage.value.addEventListener(eventName, preventDefaults, false)
      document.body.addEventListener(eventName, preventDefaults, false)
    })
    // 拖入和拖出时的样式变化
    ;["dragenter", "dragover"].forEach((eventName) => {
      previewImage.value.addEventListener(eventName, handleDragIn, false)
    })
    ;["dragleave", "drop"].forEach((eventName) => {
      previewImage.value.addEventListener(eventName, handleDragOut, false)
    })
    // 处理拖放事件
    previewImage.value.addEventListener("drop", handleDrop, false)
  }
})
onBeforeUnmount(() => {
  // 只在移动设备上移除拖拽事件监听器
  if (isMobileDevice()) {
    // 防止默认事件和冒泡
    ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      previewImage.value.removeEventListener(eventName, preventDefaults, false)
      document.body.removeEventListener(eventName, preventDefaults, false)
    })
    // 拖入和拖出时的样式变化
    ;["dragenter", "dragover"].forEach((eventName) => {
      previewImage.value.removeEventListener(eventName, handleDragIn, false)
    })
    ;["dragleave", "drop"].forEach((eventName) => {
      previewImage.value.removeEventListener(eventName, handleDragOut, false)
    })
    // 处理拖放事件
    previewImage.value.removeEventListener("drop", handleDrop, false)
  }
})
</script>

<style lang="scss" scoped>
@import "app/template/okbet_green/assets/css/_variable.sass";

.ant-upload {
  width: 100%;
  max-width: 20rem;
}

.preview-image {
  overflow: auto;
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
  img {
    width: 100%;
    height: auto;
  }
  &.drag-in {
    opacity: 0.5;
  }
}
.preview-image-detail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding-left: 10px;
  .preview-image-icon {
    display: flex;
    flex-direction: column;
  }
  .uploader-language-detail {
    display: flex;
    flex-direction: column;
    color: red;
    text-align: left;
  }
}
.none-preview-image-icon {
  justify-content: flex-start;
}
.uploadBtn {
  display: inline-block;
  width: 100%;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-radius: 6px;
  color: $text-light-color;
  background: $primary-color;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.tip-message {
  text-align: center;
  font-family: "Noto Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
</style>
