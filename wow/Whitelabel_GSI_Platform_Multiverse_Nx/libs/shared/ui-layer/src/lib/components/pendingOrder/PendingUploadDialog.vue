<script setup lang="ts">
import { PENDING_SEARCH_TYPE_ENUMS } from "@shared-lib/constants/enums/pendingSearchType"
import { TOAST_SEVERITY_ENUMS } from "@shared-lib/constants/enums/toast"
import type { PendingOrderRowView } from "../../composables/usePendingOrder"

interface Props {
  visible: boolean
  row?: PendingOrderRowView | null
}

interface UploadImageItem {
  id: string
  value: string
  previewUrl: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  row: null
})

const emit = defineEmits<{
  (e: "close"): void
  (e: "submitted"): void
}>()

const runtimeConfig = useRuntimeConfig()
const nuxtApp = useNuxtApp()
const { uploadSingleFile, S3_STORAGE_CATEGORY } = useS3Upload()
const { getRemarkByOrderType, uploadDetailByOrderType } = usePendingOrderDetail()
const { copy } = useClipboard()

const isLoading = ref(false)
const isSubmitting = ref(false)
const isUploading = ref(false)
const remarkContent = ref<Array<{ title: string; content: string }>>([])
const images = ref<UploadImageItem[]>([])

const isEditable = computed(() => Boolean(props.row?.canUpload))
const isDepositOrder = computed(() => props.row?.orderType === PENDING_SEARCH_TYPE_ENUMS.DEPOSIT)
const transCode = computed(() => props.row?.transCode || "-")
const noteText = computed(() => {
  const noteItem = remarkContent.value.find((item) => item.title.includes("備註"))
  return noteItem?.content || ""
})
const orderPrefix = computed(() => (props.row?.orderType === PENDING_SEARCH_TYPE_ENUMS.WITHDRAWAL ? "出金" : "存款"))
const hasReachedMaxImages = computed(() => images.value.length >= 5)

const getImageBase = () => {
  const imageBase = String(runtimeConfig.public.imageBase || "").trim()
  const apiBase = String(runtimeConfig.public.apiBase || "").trim()
  return imageBase || apiBase
}

const resolveImageUrl = (path: string) => {
  if (!path) return ""
  if (/^https?:\/\//i.test(path)) return path

  const base = getImageBase().replace(/\/$/, "")
  const normalizedPath = String(path).replace(/^\//, "")
  return base ? `${base}/${normalizedPath}` : path
}

const notify = (detail: string, severity: TOAST_SEVERITY_ENUMS = TOAST_SEVERITY_ENUMS.ERROR, summary = "提示") => {
  const appToast = (nuxtApp as any).$appToast
  appToast?.(detail, {
    severity,
    summary,
    life: 2200
  })
}

const readFileAsDataUrl = async (file: File): Promise<string> => {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const loadRemark = async () => {
  if (!props.row) return

  isLoading.value = true
  remarkContent.value = []
  images.value = []

  const result = await getRemarkByOrderType(props.row.orderType, props.row.transCode)

  isLoading.value = false

  if (!result.status) {
    notify(result.msg || "取得上傳明細失敗")
    return
  }

  const data = result.data
  remarkContent.value = data?.content || []
  images.value = (data?.images || []).map((item, index) => ({
    id: `${item.path || item.base64 || "img"}-${index}`,
    value: item.path || item.base64,
    previewUrl: item.path ? resolveImageUrl(item.path) : item.base64
  }))
}

watch(
  () => props.visible,
  async (visible) => {
    if (!visible) return
    await loadRemark()
  }
)

const uploadImageFile = async (file: File) => {
  if (isUploading.value || !props.row) return

  isUploading.value = true

  if (isDepositOrder.value) {
    const base64 = await readFileAsDataUrl(file)
    isUploading.value = false
    return {
      value: base64,
      previewUrl: base64
    }
  }

  const uploadResult = await uploadSingleFile({
    file,
    storage_category: S3_STORAGE_CATEGORY.KYC,
    expiration: 3600
  })

  isUploading.value = false

  if (!uploadResult.status || !uploadResult.data) {
    notify(uploadResult.msg || "上傳圖片失敗")
    return null
  }

  const objectKey = uploadResult.data.objectKey
  return {
    value: objectKey,
    previewUrl: resolveImageUrl(objectKey)
  }
}

const handleCopyTransCode = async () => {
  if (!transCode.value || transCode.value === "-") return

  try {
    await copy(transCode.value)
    notify("編號已複製", TOAST_SEVERITY_ENUMS.SUCCESS, "成功")
  } catch {
    notify("複製失敗，請稍後再試")
  }
}

const handleSelectNewFile = async (file: File) => {
  if (hasReachedMaxImages.value) {
    notify("最多只可上傳 5 張圖片")
    return
  }

  const uploaded = await uploadImageFile(file)
  if (!uploaded) return

  images.value.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    value: uploaded.value,
    previewUrl: uploaded.previewUrl
  })
}

const handleReplaceFile = async (index: number, file: File) => {
  const uploaded = await uploadImageFile(file)
  if (!uploaded) return

  images.value[index] = {
    ...images.value[index],
    value: uploaded.value,
    previewUrl: uploaded.previewUrl
  }
}

const handleRemove = (index: number) => {
  images.value.splice(index, 1)
}

const handleClose = () => {
  emit("close")
}

const handleSubmit = async () => {
  if (!props.row || !isEditable.value) {
    handleClose()
    return
  }

  isSubmitting.value = true

  const payload = {
    trans_code: props.row.transCode,
    images: images.value.map((item) => item.value).filter(Boolean)
  }

  const result = await uploadDetailByOrderType(props.row.orderType, payload)

  isSubmitting.value = false

  if (!result.status) {
    notify(result.msg || "提交上傳明細失敗")
    return
  }

  notify("上傳明細成功", TOAST_SEVERITY_ENUMS.SUCCESS, "成功")
  emit("submitted")
  handleClose()
}
</script>

<template>
  <BaseDialog
    :visible="props.visible"
    :class-obj="{
      root: '!max-w-[680px] phone:!w-screen',
      body: '!px-4 !py-5 phone:!px-3'
    }"
    @close="handleClose"
  >
    <template #header> 上傳明細 </template>

    <template v-if="isLoading">
      <div class="w-full flex flex-col items-center justify-center py-10 gap-3">
        <BaseIcon name="mdi:loading" size="28px" class-name="animate-spin text-[var(--text-text-primary)]" />
        <div class="text-sm text-[var(--text-text-primary)]">資料載入中...</div>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col gap-4">
        <div>
          <div class="text-sm leading-5 text-[var(--input-input-title-primary-enabled)]">{{ orderPrefix }}編號</div>
          <div class="flex items-center gap-2">
            <div class="text-xl leading-7 font-bold text-[var(--text-text-primary)] break-all">
              {{ transCode }}
            </div>

            <BaseIcon
              name="bxs:copy"
              size="18px"
              class-name="cursor-pointer text-[var(--icon-icon-primary-enabled)]"
              @click="handleCopyTransCode"
            />
          </div>
        </div>

        <div v-if="noteText">
          <div class="text-sm leading-5 text-[var(--input-input-title-primary-enabled)]">{{ orderPrefix }}備註</div>
          <div class="text-xl leading-7 font-bold text-[var(--text-text-primary)] break-all">
            {{ noteText }}
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <div class="text-xs leading-[18px] font-none text-[var(--text-text-primary)]">
            上傳明細
            <span class="text-red-400">*</span>
          </div>

          <div class="flex flex-col gap-3">
            <BaseUploadZone
              v-for="(image, index) in images"
              :key="image.id"
              :preview-url="image.previewUrl"
              :disabled="!isEditable"
              :loading="isUploading"
              :show-remove="isEditable"
              @select-file="handleReplaceFile(index, $event)"
              @remove="handleRemove(index)"
              @error="notify($event)"
            />

            <BaseUploadZone
              v-if="isEditable && !hasReachedMaxImages"
              :loading="isUploading"
              @select-file="handleSelectNewFile"
              @error="notify($event)"
            />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="grid grid-cols-2 gap-3">
        <BaseBtn theme="primary" category="outline" size="lg" class="w-full" @click="handleClose"> 取消 </BaseBtn>
        <BaseBtn
          theme="primary"
          size="lg"
          class="w-full"
          :disabled="!isEditable"
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          確定
        </BaseBtn>
      </div>
    </template>
  </BaseDialog>
</template>
