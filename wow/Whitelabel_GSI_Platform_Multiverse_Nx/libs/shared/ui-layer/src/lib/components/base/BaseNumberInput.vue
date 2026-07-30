<script setup lang="ts">
import InputNumber from "primevue/inputnumber"
import type { InputNumberInputEvent } from "primevue/inputnumber"
import { ref, computed } from "vue"
import BaseRequiredIcon from "@shared-lib/components/base/BaseRequiredIcon.vue"

type BaseNumberInputAttributeValue = string | number | boolean | undefined
type BaseNumberInputAttributes = Record<string, BaseNumberInputAttributeValue>

interface Props {
  modelValue?: number | null
  label?: string
  placeholder?: string
  min?: number
  max?: number
  minFractionDigits?: number
  maxFractionDigits?: number
  step?: number
  prefix?: string
  suffix?: string
  mode?: "decimal" | "currency"
  currency?: string
  showButtons?: boolean
  buttonLayout?: "stacked" | "horizontal" | "vertical"
  invalid?: boolean
  required?: boolean
  errorMessage?: string
  disabled?: boolean
  readonly?: boolean
  inputAttrs?: BaseNumberInputAttributes
  classObj?: {
    root?: string
    fieldRoot?: string
    input?: string
    label?: string
    errorMessage?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  mode: "decimal",
  invalid: false,
  disabled: false,
  required: false,
  readonly: false,
  showButtons: false,
  classObj: () => ({})
})

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void
  (e: "input", value: number | null): void
  (e: "focus"): void
  (e: "blur"): void
}>()

const isFocused = ref(false)

const hasValue = computed(() => props.modelValue !== null && props.modelValue !== undefined)

const isActiveText = computed(() => isFocused.value || hasValue.value)

const disabledColorClass = "text-[var(--input-input-icon-primary-disabled)]"

const getInputNumberValue = (event: InputNumberInputEvent): number | null => {
  return typeof event.value === "number" && Number.isFinite(event.value) ? event.value : null
}

const inputPassThrough = computed((): { pcInputText: { root: BaseNumberInputAttributes } } | undefined => {
  if (!props.inputAttrs) return undefined

  return {
    pcInputText: {
      root: { ...props.inputAttrs }
    }
  }
})
</script>

<template>
  <div :class="cx('flex flex-col gap-1 w-full', props.classObj?.root)">
    <label
      v-if="label"
      :class="
        cx(
          'flex items-center gap-1',
          'text-sm leading-5 font-medium',
          disabled ? disabledColorClass : 'text-[var(--text-text-primary)]',
          props.classObj?.label
        )
      "
    >
      {{ label }}
      <BaseRequiredIcon v-if="required" />
    </label>

    <div :class="cx('w-full', props.classObj?.fieldRoot)">
      <InputNumber
        :model-value="modelValue"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :min-fraction-digits="minFractionDigits"
        :max-fraction-digits="maxFractionDigits"
        :step="step"
        :prefix="prefix"
        :suffix="suffix"
        :mode="mode"
        :currency="currency"
        :show-buttons="showButtons"
        :button-layout="buttonLayout"
        :disabled="disabled"
        :readonly="readonly"
        :invalid="invalid"
        :pt="inputPassThrough"
        :input-class="
          cx(
            'w-full transition-all duration-200 border-2 rounded-lg px-3 py-2 outline-none',
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
            disabled && [
              'opacity-100 cursor-not-allowed',
              '!bg-[var(--input-input-bg-primary-disabled)]',
              '!border-[var(--input-input-border-primary-disabled)]',
              disabledColorClass
            ],
            invalid && !disabled && '!border-[var(--input-input-negative)]',
            props.classObj?.input
          )
        "
        @update:model-value="emit('update:modelValue', $event)"
        @input="emit('input', getInputNumberValue($event))"
        @focus="
          () => {
            isFocused = true
            emit('focus')
          }
        "
        @blur="
          () => {
            isFocused = false
            emit('blur')
          }
        "
      />
    </div>

    <!-- 錯誤訊息 -->
    <BaseErrorMessage
      v-if="invalid && errorMessage"
      :errorMessage="errorMessage"
      :class-obj="{ root: props.classObj?.errorMessage }"
    />
  </div>
</template>

<style scoped>
/* 內部 input 的自動填充重置 */
:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 1000px var(--input-input-bg-primary-enabled) inset !important;
  -webkit-text-fill-color: white !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* 移除 InputNumber 的預設外框 */
:deep(.p-inputnumber) {
  width: 100%;
}

:deep(.p-inputnumber-input) {
  width: 100%;
}
</style>
