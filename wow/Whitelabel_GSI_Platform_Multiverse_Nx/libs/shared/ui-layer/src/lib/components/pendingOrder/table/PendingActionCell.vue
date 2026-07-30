<script setup lang="ts">
import type { PendingOrderRowView } from "../../../composables/usePendingOrder"

interface Props {
  data: PendingOrderRowView
  mobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mobile: false
})

const emit = defineEmits<{
  (e: "upload", row: PendingOrderRowView): void
  (e: "cancel", row: PendingOrderRowView): void
}>()

const handleUpload = () => emit("upload", props.data)
const handleCancel = () => emit("cancel", props.data)
</script>

<template>
  <div v-if="props.mobile" :class="cx(FLEX_ITEMS_CENTER, 'gap-2 w-full')">
    <BaseBtn
      theme="primary"
      category="outline"
      size="md"
      class="flex-1"
      :disabled="!props.data.canUpload"
      @click="handleUpload"
    >
      上傳明細
    </BaseBtn>

    <BaseBtn
      theme="primary"
      category="outline"
      size="md"
      class="flex-1"
      :disabled="!props.data.canCancel"
      @click="handleCancel"
    >
      取消
    </BaseBtn>
  </div>

  <div v-else class="flex items-center justify-center gap-2">
    <BaseBtn theme="primary" category="outline" size="md" :disabled="!props.data.canUpload" @click="handleUpload">
      上傳明細
    </BaseBtn>

    <BaseBtn theme="primary" category="outline" size="md" :disabled="!props.data.canCancel" @click="handleCancel">
      取消
    </BaseBtn>
  </div>
</template>
