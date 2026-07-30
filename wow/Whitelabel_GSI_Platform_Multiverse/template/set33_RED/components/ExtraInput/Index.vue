<template>
  <q-input
    ref="inputRef"
    v-model="inputValue"
    :rules="
      field.column_name === 'account'
        ? [Rules.required(), Rules.noWhitespace()]
        : field.required
        ? [Rules.required()]
        : []
    "
    lazy-rules
    :hide-bottom-space="shouldHideBottomSpace"
    bg-color="white"
    outlined
    class="input-control form-input"
    :type="hiddenColumn(field.column_name) ? 'password' : 'text'"
    :class="{
      'real-name-bank-match-input': props.hideBottomSpace === true,
      'mb-3': !shouldHideBottomSpace && field.required,
      'mb-8': !shouldHideBottomSpace && !field.required,
    }"
    :placeholder="field?.lang?.[nowLang] ? field?.lang[nowLang] : $t(`member.register.${field.column_name}`)"
  />
</template>

<script setup lang="ts">
import type { QInput } from "quasar"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { computed, ref } from "vue"

const Rules = useRule()
const { nowLang } = useLanguage()
const { hiddenColumn } = useAuth()

interface Props {
  modelValue: any // 欄位為動態, 無法預先定義
  hideBottomSpace?: boolean
  field: {
    column_name: string
    customize: boolean
    edit: boolean
    lang?: {
      [key: string]: string
    }
    required: boolean
    type: number
    values: Array<{ value: number | string; label: string }>
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "", // 欄位為動態, 無法預先定義
  field: () => ({
    column_name: "",
    customize: false,
    edit: false,
    required: false,
    type: 1,
    values: [],
  }),
})

const emit = defineEmits(["update:modelValue"])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit("update:modelValue", value),
})

const inputRef = ref<QInput | null>(null)
const shouldHideBottomSpace = computed<boolean>(
  () => props.hideBottomSpace === true && inputRef.value?.hasError !== true
)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set33_RED/assets/css/_variable.sass";

.form-input {
  :deep(.q-field__inner) {
    .q-field__control {
      height: 40px;
    }
  }
}

.input-control {
  :deep(.q-field__control-container) {
    @apply flex items-center justify-center;
  }
  :deep(.q-field__control .q-field__native) {
    height: calc(100% - 8px);
    min-height: initial !important;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      /* --- 關鍵：停用 Quasar 的自動填入偵測動畫 --- */
      -webkit-animation-name: none !important;
      animation-name: none !important;

      /* 除了內陰影，強行把 background 設為透明 */
      background-color: transparent !important;
      background-image: none !important;

      // 使用巨大的內陰影覆蓋背景色
      -webkit-box-shadow: 0 0 0px 1000px $common-white-color inset !important;
      box-shadow: 0 0 0px 1000px $common-white-color inset !important;
      // 強制文字顏色（例如白色）
      // -webkit-text-fill-color: $common-white-color !important;

      // --- 關鍵修復：處理左右出現的邊框 ---
      border-radius: 0 !important;
      border: none !important;
      outline: none !important;

      /* 阻止樣式跳轉 */
      transition: background-color 5000s ease-in-out 0s;
    }
  }
}
</style>
