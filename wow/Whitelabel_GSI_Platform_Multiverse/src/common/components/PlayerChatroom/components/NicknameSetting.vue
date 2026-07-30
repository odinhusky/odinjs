<template>
  <div
    v-if="show"
    :class="cx('nickname-setting', 'absolute inset-0 bg-[var(--bg-17)] z-10 overflow-auto', 'p-3', styleObj?.overlay)"
  >
    <div
      :class="
        cx('nickname-setup', 'w-full', 'py-4 px-5', 'bg-[var(--dialog-bg-02)]', 'rounded-xl', styleObj?.container)
      "
    >
      <div :class="cx('nickname-setup__content', 'w-full', 'flex flex-col gap-8', styleObj?.content)">
        <!-- 標題 -->
        <div :class="cx('nickname-setup__title', 'text-xl text-white text-center font-bold', styleObj?.title)">
          {{ $t("chat_room.nickname") }}
        </div>

        <!-- 輸入框 -->
        <q-input
          v-model="localNickname"
          :label="$t('chat_room.enter_please_with_triple_dots')"
          outlined
          dark
          autofocus
          :rules="rules"
          :class="cx('nickname-input', 'text-base font-bold text-white', styleObj?.input)"
          @keyup.enter="handleSubmit"
        />

        <!-- 確認按鈕 -->
        <q-btn
          :label="$t('common.btn.confirm')"
          color="primary"
          :class="cx('nickname-submit-btn', 'w-full !mt-0', styleObj?.button)"
          :disable="!localNickname.trim()"
          @click="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import { cx } from "src/common/utils/cx"
import type { NicknameSettingStyleObj } from "../types/nicknameSettingTypes"

const props = defineProps<{
  show: boolean
  modelValue: string
  rules: Array<(val: string) => boolean | string>
  styleObj?: NicknameSettingStyleObj
}>()

const emit = defineEmits<{
  "update:modelValue": [value: string]
  submit: [nickname: string]
}>()

const localNickname = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    localNickname.value = val
  }
)

watch(localNickname, (val) => {
  emit("update:modelValue", val)
})

// 初始化時清空暱稱輸入框
onMounted(() => {
  localNickname.value = ""
})

function handleSubmit() {
  if (!localNickname.value.trim()) return

  // 驗證暱稱
  for (const rule of props.rules) {
    const result = rule(localNickname.value)
    if (result !== true) {
      return
    }
  }

  emit("submit", localNickname.value)
  localNickname.value = ""
}
</script>

<style scoped>
.nickname-input :deep(.q-field__control) {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nickname-input :deep(.q-field__native) {
  color: white;
  font-size: 1rem;
  font-weight: 700;
}

.nickname-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.7);
}
</style>
