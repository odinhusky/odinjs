<script setup lang="ts">
import InputText from "primevue/inputtext"
import IconField from "primevue/iconfield"
import InputIcon from "primevue/inputicon"
import { ref, computed } from "vue"
import BaseRequiredIcon from "@shared-lib/components/base/BaseRequiredIcon.vue"

type BaseInputAttributeValue = string | number | boolean | undefined
type BaseInputAttributes = Record<string, BaseInputAttributeValue>

interface Props {
  modelValue?: string | number
  type?: "text" | "password" | "number" | string
  label?: string
  placeholder?: string
  leftIcon?: string
  rightIcon?: string
  invalid?: boolean
  required?: boolean
  errorMessage?: string
  disabled?: boolean
  inputAttrs?: BaseInputAttributes
  classObj?: {
    root?: string // 最外層容器 (包含 Label 和 Error)
    fieldRoot?: string // 原本 IconField 的位置
    input?: string
    label?: string
    errorMessage?: string
    leftIconWrapper?: string
    leftIcon?: string
    rightIconWrapper?: string
    rightIcon?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  invalid: false,
  disabled: false,
  required: false,
  classObj: () => ({})
})

const emit = defineEmits(["update:modelValue", "right-icon-click"])

const isFocused = ref(false)

const hasValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return false
  return String(props.modelValue).trim().length > 0
})

const isActiveText = computed(() => isFocused.value || hasValue.value)

// 1. 密碼切換邏輯
const isPasswordVisible = ref(false)
const togglePassword = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const inputType = computed(() => {
  if (props.type === "password") {
    return isPasswordVisible.value ? "text" : "password"
  }
  return props.type
})

const computedRightIcon = computed(() => {
  if (props.type === "password") {
    return isPasswordVisible.value ? "mdi:eye-off-outline" : "mdi:eye-outline"
  }
  return props.rightIcon
})

const handleRightClick = (event: MouseEvent) => {
  if (props.disabled) return // 💡 禁用時不允許觸發點擊事件
  if (props.type === "password") {
    togglePassword()
  } else {
    emit("right-icon-click", event)
  }
}

// 💡 提取公共的禁用顏色變數，方便維護
const disabledColorClass = "text-[var(--input-input-icon-primary-disabled)]"
</script>

<template>
  <div :class="cx('flex flex-col gap-1 w-full', props.classObj?.root)">
    <label
      v-if="label"
      :class="
        cx(
          FLEX_ITEMS_CENTER,
          'gap-1',
          'text-sm leading-5 font-medium',
          disabled ? disabledColorClass : 'text-[var(--text-text-primary)]',
          props.classObj?.label
        )
      "
    >
      {{ label }}
      <BaseRequiredIcon v-if="required" />
    </label>

    <IconField :class="cx('w-full', props.classObj?.fieldRoot)">
      <InputIcon v-if="leftIcon" :class="cx('z-20', props.classObj?.leftIconWrapper)">
        <BaseIcon
          :name="leftIcon"
          size="1.25rem"
          :class="
            cx(
              props.disabled ? disabledColorClass : 'text-[var(--input-input-icon-primary-hover)]',
              props.classObj?.leftIcon
            )
          "
        />
      </InputIcon>

      <InputText
        v-bind="props.inputAttrs"
        :value="modelValue"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :class="
          cx(
            'form-item-class transition-all duration-200 border-2 rounded-lg px-3 py-2 outline-none',
            'bg-[var(--input-input-bg-primary-enabled)]',
            'placeholder:text-[var(--input-input-title-primary-enabled)]',
            'hover:placeholder:text-[var(--input-input-title-primary-hover)]',
            'focus:placeholder:text-[var(--input-input-title-primary-active)]',
            isActiveText
              ? 'text-[var(--input-input-title-primary-active)]'
              : 'text-[var(--input-input-title-primary-enabled)]',
            'border-[var(--input-input-border-primary-enabled)]',
            'hover:border-[var(--input-input-border-primary-hover)]',
            'focus:border-[var(--input-input-border-primary-active)]',

            props.disabled && [
              'opacity-100 cursor-not-allowed',
              '!bg-[var(--input-input-bg-primary-disabled)]',
              '!border-[var(--input-input-border-primary-disabled)]',
              disabledColorClass
            ],

            // 💡 錯誤狀態：變為紅框
            invalid && !props.disabled && '!border-[var(--input-input-negative)]',

            props.classObj?.input
          )
        "
      />

      <InputIcon
        v-if="computedRightIcon"
        position="right"
        :class="
          cx(
            'z-20',
            (rightIcon || type === 'password') && !props.disabled && 'cursor-pointer',
            props.classObj?.rightIconWrapper
          )
        "
        @click="handleRightClick"
      >
        <BaseIcon
          :name="computedRightIcon"
          size="1.25rem"
          :class="
            cx(
              props.disabled ? disabledColorClass : 'text-[var(--input-input-icon-primary-hover)]',
              !props.disabled && type === 'password' && 'hover:text-white',
              props.classObj?.rightIcon
            )
          "
        />
      </InputIcon>
    </IconField>

    <!-- 錯誤訊息 -->
    <BaseErrorMessage
      v-if="invalid && errorMessage"
      :errorMessage="errorMessage"
      :class-obj="{ root: props.classObj?.errorMessage }"
    />
  </div>
</template>

<style scoped>
/* 💡 針對 Chrome/Edge/Safari 的自動填充樣式重置 */
:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
  /* 1. 使用內陰影蓋住預設背景色 */
  -webkit-box-shadow: 0 0 0 1000px var(--input-input-bg-primary-enabled) inset !important;

  /* 2. 設定自動填充時的文字顏色 */
  -webkit-text-fill-color: white !important;

  /* 3. 防止背景色在轉場時閃爍 */
  transition: background-color 5000s ease-in-out 0s;
}

/* 💡 針對內部選取器進行額外防禦 */
:deep(input:-internal-autofill-selected) {
  background-color: transparent !important;
  background-image: none !important;
  color: white !important;
}
</style>
