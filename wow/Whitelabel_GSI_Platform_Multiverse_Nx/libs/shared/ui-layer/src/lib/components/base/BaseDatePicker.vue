<script setup lang="ts">
type ExternalModel = string | string[] | null

interface Props {
  modelValue?: ExternalModel
  label?: string
  placeholder?: string
  invalid?: boolean
  required?: boolean
  errorMessage?: string
  disabled?: boolean
  selectionMode?: "single" | "range" | "multiple"
  /** 日期顯示格式，預設對應 YYYY-MM-DD（PrimeVue: yy-mm-dd） */
  dateFormat?: string
  showTime?: boolean
  showSelectionSummary?: boolean
  showTodayTab?: boolean
  todayLabel?: string
  /** 開啟月份視圖 */
  view?: "date" | "month" | "year"

  classObj?: {
    root?: string // 💡 最外層容器（含 label + error）
    label?: string // 💡 標籤文字樣式
    input?: string // 💡 輸入框樣式（覆寫 input 背景/文字）
    panelRoot?: string // 💡 下拉面板最外層容器
    header?: string // 💡 月份年份導覽列
    title?: string // 💡 月份 / 年份標題文字
    dayCell?: string // 💡 每個日期格子（含 hover）
    selectedDay?: string // 💡 選取中的日期（覆寫漸層背景）
    monthCell?: string // 💡 月份視圖中的每個月份格子
    selectedMonth?: string // 💡 選取中的月份
    yearCell?: string // 💡 年份視圖中的每個年份格子
    selectedYear?: string // 💡 選取中的年份
    errorMessage?: string // 💡 錯誤訊息樣式
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  selectionMode: "single",
  dateFormat: "yy-mm-dd",
  showTime: false,
  showSelectionSummary: true,
  showTodayTab: true,
  todayLabel: "今天",
  view: "date",
  invalid: false,
  required: false,
  disabled: false,
  classObj: () => ({})
})

// ==================  與外部字串 ref 做格式轉換 ===========================

defineOptions({
  inheritAttrs: false
})

const model = defineModel<ExternalModel>() // 負責與外部溝通的 v-model

// 💡 負責把外部的字串，翻譯成 PrimeVue 看得懂的 Date 物件
const internalModel = computed(() => {
  if (model.value == null) return null

  if (Array.isArray(model.value)) {
    return model.value.map((item) => (typeof item === "string" ? new Date(item) : item)) as Date[]
  }

  return typeof model.value === "string" ? new Date(model.value) : (model.value as Date)
})

// 💡 負責把 PrimeVue 吐出來的 Date 物件，翻譯回字串傳給外部
const handleUpdateModelValue = (value: Date | (Date | null)[] | null | undefined) => {
  if (value == null) {
    model.value = null
    return
  }

  if (Array.isArray(value)) {
    // 將選取的日期陣列轉回字串，保留 null 以維持 PrimeVue 的操作狀態
    const formattedArray = value.map((item) => (item ? formatDate(item) : null))
    model.value = formattedArray as unknown as string[]
    return
  }

  model.value = formatDate(value as Date)
}

const formatDate = (value: Date): string => {
  const y = value.getFullYear()
  const m = String(value.getMonth() + 1).padStart(2, "0")
  const d = String(value.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

// ================== 其他內部狀態與計算屬性 ===========================
const selectedColorClass =
  "!bg-[linear-gradient(90deg,var(--datetime-datetime-bg-primary-left-enabled)_0%,var(--datetime-datetime-bg-primary-right-enabled)_100%)]"
const disabledColorClass = "text-[var(--input-input-icon-primary-disabled)]"
</script>

<template>
  <div :class="cx('flex flex-col gap-1.5 w-full', props.classObj?.root)">
    <!-- Label -->
    <label
      v-if="label"
      :class="
        cx(
          FLEX_ITEMS_CENTER,
          'gap-1 text-sm leading-5 font-medium',
          disabled ? disabledColorClass : 'text-[var(--text-text-primary)]',
          props.classObj?.label
        )
      "
    >
      {{ label }}
      <BaseRequiredIcon v-if="required" />
    </label>

    <div class="relative group w-full">
      <DatePicker
        :model-value="internalModel"
        @update:model-value="handleUpdateModelValue"
        v-bind="$attrs"
        :placeholder="placeholder"
        :disabled="disabled"
        :selection-mode="selectionMode"
        :date-format="dateFormat"
        :show-time="showTime"
        :show-button-bar="showTodayTab"
        :view="view"
        :show-icon="false"
        :manualInput="false"
        :pt="{
          // 💡 根節點（包含 input 本體）
          root: {
            class: cx('w-full !block align-top', props.classObj?.input)
          },
          // 💡 文字輸入框
          pcInputText: {
            root: {
              class: cx(
                'form-item-class transition-all duration-200 border-2 rounded-lg px-3 py-2 pr-10 outline-none',
                'bg-[var(--input-input-bg-primary-enabled)] text-white',
                'border-[var(--input-input-border-primary-enabled)]',
                'hover:border-[var(--input-input-border-primary-hover)]',
                'active:border-[var(--input-input-border-primary-active)]',
                'focus:border-[var(--input-input-border-primary-active)]',
                props.disabled && [
                  'opacity-100 cursor-not-allowed',
                  '!bg-[var(--input-input-bg-primary-disabled)]',
                  '!border-[var(--input-input-border-primary-disabled)]',
                  disabledColorClass
                ],
                props.invalid && !props.disabled && '!border-[var(--input-input-negative)]',
                'placeholder:text-[var(--input-input-placeholder-primary-enabled)]'
              )
            }
          },
          dropdown: {
            class: cx('bg-transparent odinhuksky')
          },
          // 💡 下拉面板容器
          panel: {
            class: cx(
              '!w-[320px] !bg-[var(--select-select-bg-secondary-enabled)] border border-white/10 !rounded-none shadow-xl overflow-hidden z-50',
              props.classObj?.panelRoot
            )
          },
          buttonbar: {
            class: '!border-t-0 !px-4 !py-3'
          },
          // 💡 導覽標題列（月 / 年）
          header: {
            class: cx(
              'flex items-center justify-between px-4 py-3 bg-transparent border-b border-white/10',
              props.classObj?.header
            )
          },
          // 💡 月份 / 年份標題文字按鈕
          title: {
            class: cx(
              'text-[var(--text-text-primary)] font-semibold text-sm cursor-pointer hover:text-[var(--button-button-bg-primary-left-enabled)]',
              props.classObj?.title
            )
          },
          // 💡 上一個月 / 年按鈕
          previousButton: {
            class: cx(
              'flex items-center justify-center w-7 h-7 rounded-lg transition-colors duration-200',
              'text-[var(--icon-icon-primary-enabled)]',
              'hover:bg-white/10'
            )
          },
          // 💡 下一個月 / 年按鈕
          nextButton: {
            class: cx(
              'flex items-center justify-center w-7 h-7 rounded-lg transition-colors duration-200',
              'text-[var(--icon-icon-primary-enabled)]',
              'hover:bg-white/10'
            )
          },
          // 💡 星期列（Sun Mon ... Sat）
          weekHeader: {
            class: 'text-[var(--input-input-placeholder-primary-enabled)] text-xs font-medium text-center'
          },
          // 💡 日期表格容器
          tableBody: {
            class: 'p-2'
          },
          // 💡 日期格子 span（數字本體）
          day: ({ context }: any) => ({
            class: cx(
              'w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-pointer transition-all duration-200 z-10 relative',
              
              // 如果是今天 (且沒有被選中) 或是
              context.today && !context.selected && cx('todayCellClass', props.classObj?.dayCell),

              // 選中的日期，給予特定文字顏色
              (context.today && !context.selected || context.selected) && cx('font-normal !text-[var(--datetime-datetime-title-primary-enabled)]', selectedColorClass, props.classObj?.selectedDay),

              // 停用日期
              (context.disabled || props.disabled) && 'opacity-30 cursor-not-allowed pointer-events-none',
              
              // 沒有被選重的其他日期
              !context.selected && !context.disabled && !props.disabled && 'otherCellClass'
            )
          }),
          // 💡 月份視圖格子
          month: ({ context }: any) => ({
            class: cx(
              'flex-1 text-center px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200',
              context.selected
                ? cx('selectedCellClass', selectedColorClass, props.classObj?.selectedMonth)
                : 'text-[var(--text-text-primary)]',
              !context.selected && 'hoverCellClass',
              props.classObj?.monthCell
            )
          }),
          // 💡 年份視圖格子
          year: ({ context }: any) => ({
            class: cx(
              'flex-1 text-center px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200',
              context.selected
                ? cx('selectedCellClass', selectedColorClass, props.classObj?.selectedYear)
                : 'text-[var(--text-text-primary)]',
              !context.selected && 'hoverCellClass',
              props.classObj?.yearCell
            )
          })
      }"
      />

      <div :class="cx('absolute z-10 right-3 top-1/2 -translate-y-1/2')">
        <BaseIcon
          name="material-symbols:date-range"
          :class="
            cx(
              'text-lg pointer-events-none transition-colors duration-200',

              // 💡 狀態 A：如果 DatePicker 被 disabled，給予無效的顏色
              disabled
                ? disabledColorClass
                : [
                    // 預設顏色 (對應 input 的 placeholder 或預設邊框色)
                    'text-[var(--input-input-icon-primary-enabled)]',

                    // 💡 狀態 B：當滑鼠 Hover 到整個 input 區塊時的顏色
                    'group-hover:text-[var(--input-input-icon-primary-hover)]',

                    // 💡 狀態 C：當 input 點擊/聚焦 (Active) 時的顏色 (例如變成你的橘色或高亮色)
                    'group-focus-within:!text-[var(--input-input-icon-primary-active)]'
                  ]
            )
          "
        />
      </div>
    </div>

    <BaseErrorMessage
      v-if="invalid && errorMessage"
      :errorMessage="errorMessage"
      :class="props.classObj?.errorMessage"
    />
  </div>
</template>

<style scoped>
:deep(.p-datepicker-buttonbar) {
  border-block-start: 0 !important;
}
</style>
