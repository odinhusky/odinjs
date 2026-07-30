<script setup lang="ts">
import { PENDING_SEARCH_TYPE_ENUMS } from "@shared-lib/constants/enums/pendingSearchType"
import { TOAST_SEVERITY_ENUMS } from "@shared-lib/constants/enums/toast"
import type { PendingOrderRowView } from "../../composables/usePendingOrder"

interface Props {
  visible: boolean
  row?: PendingOrderRowView | null
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  row: null
})

const emit = defineEmits<{
  (e: "close"): void
}>()

const runtimeConfig = useRuntimeConfig()
const nuxtApp = useNuxtApp()
const { fetchDepositRemark, isPending: isDepositRemarkPending } = useBankDepositRemark()
const { fetchWithdrawalRemark, isPending: isWithdrawalRemarkPending } = useBankWithdrawalRemark()
const { copy } = useClipboard()

const isLoading = ref(false)
const remarkContent = ref<Array<{ title: string; content: string }>>([])
const resolvedImages = ref<string[]>([])

const orderPrefix = computed(() => (props.row?.orderType === PENDING_SEARCH_TYPE_ENUMS.WITHDRAWAL ? "出金" : "存款"))
const detailTitle = computed(() => `${orderPrefix.value}明細`)
const transCodeLabel = computed(() => `${orderPrefix.value}編號`)
const transCode = computed(() => props.row?.transCode || "-")
const hasRemarkContent = computed(() => remarkContent.value.length > 0)
const hasImages = computed(() => resolvedImages.value.length > 0)

const getImageBase = () => {
  const imageBase = String(runtimeConfig.public.imageBase || "").trim()
  const apiBase = String(runtimeConfig.public.apiBase || "").trim()
  return imageBase || apiBase
}

const resolveImageUrl = (path: string) => {
  const normalizedPath = String(path || "").trim()
  if (!normalizedPath) return ""
  if (/^https?:\/\//i.test(normalizedPath) || /^data:image\//i.test(normalizedPath)) return normalizedPath

  const base = getImageBase().replace(/\/$/, "")
  const normalized = normalizedPath.replace(/^\//, "")
  return base ? `${base}/${normalized}` : normalizedPath
}

const normalizeRemarkImages = (images: unknown): string[] => {
  if (!Array.isArray(images)) return []

  return images
    .map((item) => {
      if (typeof item === "string") {
        return resolveImageUrl(item)
      }

      if (!item || typeof item !== "object") return ""

      const maybePath = "path" in item ? String((item as Record<string, unknown>).path || "") : ""
      const maybeBase64 = "base64" in item ? String((item as Record<string, unknown>).base64 || "") : ""
      return resolveImageUrl(maybePath || maybeBase64)
    })
    .filter(Boolean)
}

const normalizeRemarkContent = (content: unknown): Array<{ title: string; content: string }> => {
  if (!Array.isArray(content)) return []

  return content
    .map((item) => {
      if (!item || typeof item !== "object") return null

      const record = item as Record<string, unknown>
      const title = String(record.title || "").trim()
      const text = String(record.content || "").trim()

      if (!title && !text) return null

      return {
        title,
        content: text
      }
    })
    .filter((item): item is { title: string; content: string } => Boolean(item))
}

const notify = (detail: string, severity: TOAST_SEVERITY_ENUMS = TOAST_SEVERITY_ENUMS.ERROR, summary = "提示") => {
  const appToast = (nuxtApp as any).$appToast
  appToast?.(detail, {
    severity,
    summary,
    life: 2200
  })
}

const loadDetail = async () => {
  if (!props.row) return

  isLoading.value = true
  remarkContent.value = []
  resolvedImages.value = []

  const response =
    props.row.orderType === PENDING_SEARCH_TYPE_ENUMS.WITHDRAWAL
      ? await fetchWithdrawalRemark(props.row.transCode)
      : await fetchDepositRemark(props.row.transCode)

  isLoading.value = false

  if (!response?.status) {
    notify(response?.msg || "取得明細失敗")
    return
  }

  remarkContent.value = normalizeRemarkContent(response.data?.content)
  resolvedImages.value = normalizeRemarkImages(response.data?.images)
}

watch(
  () => props.visible,
  async (visible) => {
    if (!visible) return
    await loadDetail()
  }
)

const handleClose = () => emit("close")

const handleCopyTransCode = async () => {
  if (!transCode.value || transCode.value === "-") return

  try {
    await copy(transCode.value)
    notify("編號已複製", TOAST_SEVERITY_ENUMS.SUCCESS, "成功")
  } catch {
    notify("複製失敗，請稍後再試")
  }
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
    <template #header>
      {{ detailTitle }}
    </template>

    <template v-if="isLoading || isDepositRemarkPending || isWithdrawalRemarkPending">
      <div class="w-full flex flex-col items-center justify-center py-10 gap-3">
        <BaseIcon name="mdi:loading" size="28px" class-name="animate-spin text-[var(--text-text-primary)]" />
        <div class="text-sm text-[var(--text-text-primary)]">資料載入中...</div>
      </div>
    </template>

    <template v-else>
      <div class="w-full flex flex-col gap-4">
        <div>
          <div class="text-base leading-6 text-[var(--dialog-dialog-subtitle-content)]">
            {{ transCodeLabel }}
          </div>
          <div class="flex items-center gap-2">
            <div class="text-base leading-6 font-semibold text-[var(--dialog-dialog-title-content)] break-all">
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

        <div v-if="hasRemarkContent">
          <div class="text-base leading-6 text-[var(--dialog-dialog-subtitle-content)]">{{ orderPrefix }}備註</div>
          <div class="flex flex-col gap-2">
            <div
              v-for="(item, index) in remarkContent"
              :key="`${item.title}-${index}`"
              class="text-base leading-6 font-semibold text-[var(--dialog-dialog-title-content)] break-words"
            >
              <span v-if="item.title">
                {{ item.title }}
              </span>
              <span v-if="item.title && item.content"> : </span>
              <span>{{ item.content || "-" }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs leading-[18px] font-none text-[var(--text-text-primary)]">上傳明細</div>

          <div
            class="rounded-lg border border-[var(--border-border-primary)] bg-[var(--tab-tab-bg-square-primary-enabled)] p-3"
          >
            <div v-if="hasImages" class="grid grid-cols-1 gap-3">
              <BaseImage
                v-for="(item, index) in resolvedImages"
                :key="`${item}-${index}`"
                :src="item"
                :alt="`${orderPrefix}明細圖片${index + 1}`"
                :class-obj="{
                  container: 'w-full rounded-md overflow-hidden border border-[var(--border-border-primary)]',
                  image: 'w-full max-h-[260px] object-contain bg-white'
                }"
              />
            </div>

            <div
              v-else
              :class="cx(FLEX_CENTER, 'h-[145px] rounded-md bg-[background: var(--surface-surface-contrainer)]')"
            >
              <NoData type="empty" :class-obj="{ root: cx('!min-h-[initial]') }" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
