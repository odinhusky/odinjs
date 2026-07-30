<script setup lang="ts">
import Select from "primevue/select"
import BaseRequiredIcon from "@shared-lib/components/base/BaseRequiredIcon.vue"
import { OVERFLOW_Y_AUTO_HIDDEN } from "@shared-lib/constants/globalStyles"

interface Props {
  modelValue?: any
  options?: any[]
  optionLabel?: string
  optionValue?: string
  placeholder?: string

  // 💡 標籤與錯誤相關
  label?: string
  required?: boolean
  invalid?: boolean
  errorMessage?: string
  disabled?: boolean

  // 💡 客製化樣式接口
  classObj?: {
    wrapper?: string // 最外層容器 (包含 Label 和 Error)
    selectLabel?: string // 選擇框內 label 的容器 (用於調整選中後的文字與圖示的排列)
    dropdown?: string // 下拉箭頭 Icon
    label?: string // 標籤文字樣式
    select?: string // 選擇框本體 (Trigger)
    panel?: string // 💡 下拉選單的外框背景
    item?: string // 💡 下拉選單的單一選項
    error?: string // 錯誤訊息樣式
    optionHover?: string // 選項 Hover 狀態的額外樣式 (會與 item 同時存在)
    optionSelected?: string // 被選中選項的額外樣式 (會與 item 同時存在)
  }
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  optionLabel: "label",
  // 如果 optionValue 沒給，PrimeVue 預設會回傳整個 Object
  disabled: false,
  invalid: false,
  required: false,
  classObj: () => ({})
})

const emit = defineEmits(["update:modelValue", "change"])

const disabledColorClass = "text-[var(--input-input-icon-primary-disabled)]"
</script>

<template>
  <div :class="cx('flex flex-col gap-1.5 w-full', props.classObj?.wrapper)">
    <label
      v-if="label"
      :class="
        cx(
          'text-sm font-medium flex items-center gap-1',
          disabled ? disabledColorClass : 'text-[var(--input-input-title-primary-enabled)]',
          props.classObj?.label
        )
      "
    >
      {{ label }}
      <BaseRequiredIcon v-if="required" />
    </label>

    <Select
      :model-value="modelValue"
      :options="options"
      :option-label="optionLabel"
      :option-value="optionValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', $event)"
      @change="emit('change', $event)"
      :pt="{
        // 💡 Trigger 本體：負責外框、Hover 與 Invalid 狀態
        root: ({ state }) => ({
          class: cx(
            'form-item-class !p-0',
            'flex items-center justify-between transition-all duration-200 border-2 rounded-lg outline-none cursor-pointer',
            'bg-[var(--input-input-bg-primary-enabled)] !text-[var(--button-button-title-primary-enabled)]',
            '[&_.p-select-label.p-placeholder]:text-[var(--input-input-title-primary-enabled)]',
            'hover:[&_.p-select-label.p-placeholder]:text-[var(--input-input-title-primary-hover)]',
            '[&.p-focus_.p-select-label.p-placeholder]:text-[var(--input-input-title-primary-active)]',
            '[&_.p-select-label:not(.p-placeholder)]:text-[var(--input-input-title-primary-active)]',
            'border-[var(--input-input-border-primary-enabled)]',

            // Hover 狀態
            !props.disabled && 'hover:border-[var(--input-input-border-primary-hover)]',
            // Focus 打開狀態
            state.focused && 'border-[var(--input-input-border-primary-active)]',

            // 禁用狀態
            props.disabled && [
              'opacity-100 cursor-not-allowed',
              '!bg-[var(--input-input-bg-primary-disabled)]',
              '!border-[var(--input-input-border-primary-disabled)]',
              disabledColorClass
            ],

            // 💡 錯誤狀態：變為紅框
            invalid && !props.disabled && '!border-[var(--input-input-negative)]',

            props.classObj?.select
          )
        }),
        listContainer: {
          class: cx(OVERFLOW_Y_AUTO_HIDDEN)
        },
        // 選擇到的文字
        label: {
          class: cx('block overflow-hidden whitespace-nowrap pl-4 pr-0 py-2 text-ellipsis', props.classObj?.selectLabel)
        },
        // 右側箭頭 Icon
        dropdown: {
          class: cx('flex items-center justify-center ml-2 !text-[var(--icon-icon-primary-enabled)]', props.classObj?.dropdown)
        },
        // 💡 下拉選單的容器 (PrimeVue v4: overlay)
        overlay: {
          class: cx(
            '!bg-[var(--select-select-bg-secondary-enabled)] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50',
            props.classObj?.panel
          )
        },
        list: {
          class: 'flex flex-col gap-0 !m-0 !p-0 list-none'
        },
        // 💡 單一選項：處理 Hover 與 Selected (PrimeVue v4: option)
        option: ({ context }: any) => ({
          class: cx(
            'cursor-pointer !m-0 !rounded-none border-0 px-3 py-2 transition-colors duration-200 text-sm leading-5 font-medium !text-[var(--button-button-title-primary-enabled)]',
            // 被選中時的樣式 (設計稿中的橘紅色)
            context.selected && cx(BG_PRIMARY, 'font-bold !text-[var(--button-button-title-primary-enabled)]', props.classObj?.optionSelected),
            // focus（hover）時的樣式，但不是已選中的狀態
            context.focused && !context.selected && cx(BG_PRIMARY, '!text-[var(--button-button-title-primary-enabled)]', props.classObj?.optionHover),
            // 默認狀態：避免出現 PrimeVue 預設顏色
            !context.selected && !context.focused && '!bg-[var(--input-input-bg-primary-enabled)]',
            props.classObj?.item
          )
        })
      }"
    >
      <template v-if="$slots.value" #value="slotProps">
        <slot name="value" v-bind="slotProps" />
      </template>

      <template v-if="$slots.option" #option="slotProps">
        <slot name="option" v-bind="slotProps" />
      </template>

      <template #dropdownicon>
        <BaseIcon name="mdi:chevron-down" size="1.25rem" />
      </template>
    </Select>

    <BaseErrorMessage v-if="invalid && errorMessage" :errorMessage="errorMessage" />
  </div>
</template>

<style scoped>
:deep(.p-select-list-container) {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

:deep(.p-select-list-container::-webkit-scrollbar) {
  display: none;
}
</style>
