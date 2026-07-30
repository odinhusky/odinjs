<script setup lang="ts">
interface Props {
  previewUrl?: string
  disabled?: boolean
  loading?: boolean
  accept?: string
  maxSizeMb?: number
  title?: string
  hint?: string
  showRemove?: boolean
  classObj?: {
    root?: string
    dropZone?: string
    placeholder?: string
    previewWrap?: string
    image?: string
    removeBtn?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  previewUrl: "",
  disabled: false,
  loading: false,
  accept: "image/jpeg,image/png",
  maxSizeMb: 5,
  title: "點擊或拖曳檔案至此處",
  hint: "僅限PNG、JPG文件，單檔大小不可超過5MB",
  showRemove: true,
  classObj: () => ({})
})

const emit = defineEmits<{
  (e: "select-file", file: File): void
  (e: "remove"): void
  (e: "error", message: string): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const acceptedMimeTypes = computed(() => {
  return String(props.accept || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
})

const openFilePicker = () => {
  if (props.disabled || props.loading) return
  inputRef.value?.click()
}

const validateFile = (file: File) => {
  const mime = String(file.type || "").toLowerCase()
  if (acceptedMimeTypes.value.length > 0 && !acceptedMimeTypes.value.includes(mime)) {
    emit("error", "僅支援 PNG / JPG 圖片格式")
    return false
  }

  const maxBytes = Number(props.maxSizeMb || 5) * 1024 * 1024
  if (file.size > maxBytes) {
    emit("error", `檔案大小不可超過 ${props.maxSizeMb}MB`)
    return false
  }

  return true
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  if (!validateFile(file)) {
    target.value = ""
    return
  }

  emit("select-file", file)
  target.value = ""
}

const handleRemove = (event: MouseEvent) => {
  event.stopPropagation()
  emit("remove")
}
</script>

<template>
  <div :class="cx('w-full', props.classObj?.root)">
    <input ref="inputRef" type="file" :accept="props.accept" class="hidden" @change="handleChange" />

    <button
      type="button"
      :disabled="props.disabled || props.loading"
      :class="
        cx(
          'relative w-full rounded-xl border border-dashed border-[var(--upload-upload-border)]',
          'bg-transparent overflow-hidden text-left',
          'transition-colors duration-200',
          'disabled:cursor-not-allowed disabled:opacity-60',
          props.classObj?.dropZone
        )
      "
      @click="openFilePicker"
    >
      <div v-if="props.previewUrl" :class="cx('relative h-[128px] w-full bg-black/20', props.classObj?.previewWrap)">
        <img :src="props.previewUrl" alt="uploaded" :class="cx('h-full w-full object-cover', props.classObj?.image)" />

        <BaseIconBtn
          v-if="props.showRemove"
          icon="mdi:trash-can-outline"
          size="sm"
          theme="primary"
          :class="cx('absolute top-2 right-2 !rounded-xl shadow-md', props.classObj?.removeBtn)"
          @click="handleRemove"
        />
      </div>

      <div v-else :class="cx('min-h-[128px] px-4 py-6', FLEX_COL, FLEX_CENTER, 'gap-2', props.classObj?.placeholder)">
        <BaseIcon name="mdi:cloud-upload-outline" size="28px" class-name="text-[var(--upload-upload-icon)]" />

        <div class="text-sm leading-5 text-[var(--upload-upload-title)] text-center">{{ props.title }}</div>

        <div class="text-xs leading-4 text-[var(--upload-upload-title)] opacity-70 text-center">{{ props.hint }}</div>
      </div>
    </button>
  </div>
</template>
