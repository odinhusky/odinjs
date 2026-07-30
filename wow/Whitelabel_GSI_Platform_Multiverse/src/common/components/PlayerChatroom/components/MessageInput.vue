<template>
  <div :class="cx('chatroom-input', 'flex-shrink-0 p-2.5 bg-[var(--bg-05)]', styleObj?.container)">
    <div :class="cx('input-wrapper', 'flex items-center gap-2.5', styleObj?.wrapper)">
      <q-btn
        flat
        round
        dense
        :disable="disabled"
        :class="cx('image-btn rounded-full bg-[var(--bg-14)]', iconBtnSize, styleObj?.imageButton)"
        @click="$emit('select-image')"
      >
        <span class="material-icons-outlined">add_photo_alternate</span>
      </q-btn>

      <q-input
        ref="inputRef"
        v-model="localMessage"
        type="textarea"
        :placeholder="$t('chat_room.enter_please_with_triple_dots')"
        outlined
        dense
        autogrow
        :rows="1"
        :disable="disabled"
        :rules="conditionalRules"
        :class="cx('message-textarea', 'flex-1', styleObj?.textarea)"
        @keydown.enter.exact.prevent="handleSend"
      />

      <q-btn
        round
        color="primary"
        icon="send"
        :disable="disabled || !localMessage.trim()"
        :class="cx('send-btn', 'flex-shrink-0', iconBtnSize, styleObj?.sendButton)"
        @click="handleSend"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue"
import { cx } from "src/common/utils/cx"
import type { MessageInputStyleObj } from "../types/messageInputTypes"

const props = defineProps<{
  modelValue: string
  disabled: boolean
  rules: Array<(val: string) => boolean | string>
  styleObj?: MessageInputStyleObj
}>()

const emit = defineEmits<{
  "update:modelValue": [value: string]
  send: [message: string]
  "select-image": []
}>()

const localMessage = ref(props.modelValue)
const inputRef = ref<any>(null)

const iconBtnSize = "w-[1.875rem] h-[1.875rem]"

// 只在有內容時才套用 rules，避免空值時顯示錯誤
const conditionalRules = computed(() => {
  if (!localMessage.value.trim()) {
    return []
  }
  return props.rules
})

watch(
  () => props.modelValue,
  (val) => {
    localMessage.value = val
  }
)

watch(localMessage, (val) => {
  emit("update:modelValue", val)
})

// 初始化時清空輸入框
onMounted(() => {
  localMessage.value = ""
})

function handleSend() {
  if (!localMessage.value.trim()) return

  // 驗證內容
  for (const rule of props.rules) {
    const result = rule(localMessage.value)
    if (result !== true) {
      return
    }
  }

  emit("send", localMessage.value)
  localMessage.value = ""
}
</script>

<style scoped>
.message-textarea :deep(.q-field__control) {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.message-textarea :deep(.q-field__native) {
  color: white;
  max-height: 5rem;
}

.message-textarea :deep(.q-placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

.message-textarea :deep(.q-field__bottom) {
  white-space: normal;
  word-wrap: break-word;
  padding: 8px 12px;
}

.message-textarea :deep(.q-field__messages) {
  white-space: normal;
  word-wrap: break-word;
}
</style>
