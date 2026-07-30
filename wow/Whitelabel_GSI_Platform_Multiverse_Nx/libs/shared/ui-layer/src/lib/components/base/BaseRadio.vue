<script setup lang="ts">
import RadioButton from "primevue/radiobutton"
import { computed } from "vue"

interface Props {
  modelValue?: any
  disabled?: boolean
  name?: string
  value?: any // Radio 必須要有值來區分選項
  inputId?: string
  // 💡 客製化 class 物件
  classObj?: {
    root?: string // 容器
    box?: string // 圓圈邊框
    input?: string // 原生 input
    icon?: string // 內縮圓點
  }
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  classObj: () => ({})
})

const emit = defineEmits(["update:modelValue", "change"])

// 處理 v-model
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
})
</script>

<template>
  <RadioButton
    v-model="model"
    :disabled="disabled"
    :name="name"
    :value="value"
    :input-id="inputId"
    :pt="{
      root: {
        class: cx('relative inline-flex align-bottom cursor-pointer select-none', props.classObj?.root)
      },
      input: {
        class: cx(
          'peer w-full h-full absolute top-0 left-0 z-10 p-0 m-0 opacity-0 cursor-pointer',
          props.classObj?.input
        )
      },
      box: ({ context }) => ({
        class: cx(
          // 基礎外觀：圓形
          'flex items-center justify-center w-5 h-5 rounded-full border-[1px] transition-all duration-200',
          'bg-[var(--radio-radio-bg-enabled)] border-[var(--radio-radio-border-enabled)]',

          // Hover 狀態：利用 peer-hover，僅在未選中時觸發邊框變色
          !props.disabled &&
            !context.checked &&
            'peer-hover:!border-[var(--radio-radio-hover)] peer-hover:!bg-transparent',

          // 選中狀態 (Checked)
          context.checked && !props.disabled && '!border-[var(--radio-radio-border-active)]',

          // 禁用狀態 (Disabled)
          props.disabled &&
            'bg-[var(--radio-radio-icon-disabled)] border-[var(--radio-radio-border-disabled)] cursor-not-allowed',

          props.classObj?.box
        )
      }),
      icon: ({ context }) => ({
        class: cx(
          // 內縮圓點的尺寸與外觀
          'block w-2.5 h-2.5 rounded-full transition-all duration-200',
          // 選中時的顏色 (橘色)
          context.checked && !props.disabled && 'bg-[var(--radio-radio-icon-active)]',
          // 禁用且選中時的顏色 (深灰色)
          context.checked && props.disabled && 'bg-[var(--radio-radio-icon-disabled)]',
          props.classObj?.icon
        )
      })
    }"
    @change="$emit('change', $event)"
  />
</template>
