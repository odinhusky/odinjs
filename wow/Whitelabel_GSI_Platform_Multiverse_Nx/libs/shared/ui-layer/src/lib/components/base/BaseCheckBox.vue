<script setup lang="ts">
import Checkbox from "primevue/checkbox"

interface Props {
  modelValue?: any
  binary?: boolean
  disabled?: boolean
  name?: string
  value?: any
  inputId?: string
  label?: string

  // 💡 客製化 class 物件
  classObj?: {
    wrapper?: string // 最外層容器 (控制 Checkbox 與文字的排列)
    root?: string // 容器
    box?: string // 方框
    input?: string // 原生 input
    icon?: string // 勾勾圖標
    label?: string // 文字標籤的樣式
  }
}

const props = withDefaults(defineProps<Props>(), {
  binary: true,
  disabled: false,
  classObj: () => ({})
})

const emit = defineEmits(["update:modelValue", "change"])

// 處理數值同步
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
})

// 💡 產生唯一 ID：如果外部沒傳 inputId，就自動生一個，確保 <label> 能點擊連動
const uniqueId = useId()
const computedInputId = computed(() => props.inputId || uniqueId)
</script>

<template>
  <div :class="cx('inline-flex items-center gap-2', props.classObj?.wrapper)">
    <Checkbox
      v-model="model"
      :binary="binary"
      :disabled="disabled"
      :name="name"
      :value="value"
      :input-id="computedInputId"
      :pt="{
        root: {
          class: cx('inline-flex align-bottom cursor-pointer select-none', props.classObj?.root)
        },
        input: {
          class: cx(
            'peer w-full h-full absolute top-0 left-0 z-10 p-0 m-0 opacity-0 cursor-pointer',
            props.classObj?.input
          )
        },
        box: ({ context }) => ({
          class: cx(
            // 基礎外觀 (Default)
            'flex items-center justify-center w-5 h-5 rounded border-[1px] transition-all duration-200',
            'bg-[var(--checkbox-checkbox-bg-enabled)] border-[var(--checkbox-checkbox-border-enabled)]',

            // 💡 修正關鍵：只有在「未選中」且「未禁用」時，Hover 才改背景和邊框
            !props.disabled &&
              !context.checked &&
              'peer-hover:!border-[var(--checkbox-checkbox-border-hover)] peer-hover:!bg-[var(--checkbox-checkbox-bg-hover)]',

            // 💡 選中狀態 (Checked)：維持實心，這裡加上 ! 確保穩定
            context.checked &&
              !props.disabled &&
              '!bg-[var(--checkbox-checkbox-bg-active)] !border-[var(--checkbox-checkbox-border-active)]',

            // 禁用狀態 (Disabled)
            props.disabled &&
              'bg-[var(--checkbox-checkbox-bg-disabled)] border-[var(--checkbox-checkbox-border-disabled)] cursor-not-allowed',

            props.classObj?.box
          )
        }),
        icon: () => ({
          class: cx(
            'w-4 h-4 transition-all duration-200',
            // 選中時的勾勾顏色 (白色)
            'text-[var(--checkbox-checkbox-icon-active)]',
            // 禁用時的勾勾顏色 (灰色)
            props.disabled && 'text-[var(--checkbox-checkbox-icon-disabled)]',
            props.classObj?.icon
          )
        })
      }"
      @change="$emit('change', $event)"
    />

    <label
      v-if="label || $slots.default"
      :for="computedInputId"
      :class="
        cx(
          'cursor-pointer select-none text-sm leading-5',
          props.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-white', // 這裡的顏色可以對接你的 CSS 變數
          props.classObj?.label
        )
      "
    >
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>
