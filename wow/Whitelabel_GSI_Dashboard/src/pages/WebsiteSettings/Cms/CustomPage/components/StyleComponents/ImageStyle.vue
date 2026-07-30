<template>
  <div class="style-settings">
    <!-- 顯示樣式 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.display_style") }}</span>
      <div class="style-control">
        <div class="custom-toggle-group">
          <button
            type="button"
            class="toggle-btn"
            :class="{ active: styleData.displayStyle === 'horizontal' }"
            @click="styleData.displayStyle = 'horizontal'"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 19C2.45 19 1.97917 18.8042 1.5875 18.4125C1.19583 18.0208 1 17.55 1 17V7C1 6.45 1.19583 5.97917 1.5875 5.5875C1.97917 5.19583 2.45 5 3 5H13C13.55 5 14.0208 5.19583 14.4125 5.5875C14.8042 5.97917 15 6.45 15 7V17C15 17.55 14.8042 18.0208 14.4125 18.4125C14.0208 18.8042 13.55 19 13 19H3ZM3 17H13V7H3V17ZM17 19V5H19V19H17ZM21 19V5H23V19H21Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            type="button"
            class="toggle-btn"
            :class="{ active: styleData.displayStyle === 'grid' }"
            @click="styleData.displayStyle = 'grid'"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11 21H5C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19L3 5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3L11 3L11 21ZM9 19L9 5L5 5L5 19H9ZM13 11L13 3L19 3C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V11L13 11ZM15 9L19 9V5L15 5L15 9ZM13 21L13 13L21 13L21 19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21L13 21ZM15 19H19V15H15V19Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 每行張數（僅 horizontal 模式顯示） -->
    <div v-if="styleData.displayStyle === 'horizontal'" class="style-row">
      <span class="style-label">{{ $t("cms.row_show") }}</span>
      <div class="style-control">
        <div class="custom-number-input">
          <button type="button" class="stepper-btn" :disabled="styleData.rowShow <= 1" @click="decreaseRowShow">
            −
          </button>
          <div class="input-wrapper">
            <input type="text" :value="styleData.rowShow" @input="onRowShowInput" @blur="validateRowShow" />
          </div>
          <button type="button" class="stepper-btn" @click="increaseRowShow">+</button>
        </div>
      </div>
    </div>

    <!-- 顯示數量（僅 grid 模式顯示） -->
    <div v-if="styleData.displayStyle === 'grid'" class="style-row">
      <span class="style-label">{{ $t("cms.display_count") }}</span>
      <div class="style-control">
        <div class="custom-toggle-group count-toggle">
          <button
            type="button"
            class="toggle-btn"
            :class="{ active: styleData.displayCount === 3 }"
            @click="styleData.displayCount = 3"
          >
            3
          </button>
          <button
            type="button"
            class="toggle-btn"
            :class="{ active: styleData.displayCount === 6 }"
            @click="styleData.displayCount = 6"
          >
            6
          </button>
          <button
            type="button"
            class="toggle-btn"
            :class="{ active: styleData.displayCount === 9 }"
            @click="styleData.displayCount = 9"
          >
            9
          </button>
        </div>
      </div>
    </div>

    <!-- 顯示數量（僅 grid 模式顯示）舊版 -->
    <!-- <div v-if="styleData.displayStyle === 'grid'" class="style-row">
      <span class="style-label">{{ $t("cms.display_count") }}</span>
      <div class="style-control">
        <div class="number-input-group">
          <q-btn flat dense icon="remove" @click="decreaseCount" :disable="styleData.displayCount <= 1" />
          <q-input
            v-model.number="styleData.displayCount"
            type="number"
            dense
            outlined
            class="number-input"
            :min="1"
          />
          <q-btn flat dense icon="add" @click="increaseCount" />
        </div>
      </div>
    </div> -->

    <!-- 邊框樣式 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.border_style") }}</span>
      <div class="style-control">
        <div class="custom-toggle-group text-toggle">
          <button
            type="button"
            class="toggle-btn"
            :class="{ active: styleData.borderStyle === 'square' }"
            @click="styleData.borderStyle = 'square'"
          >
            {{ $t("cms.square") }}
          </button>
          <button
            type="button"
            class="toggle-btn"
            :class="{ active: styleData.borderStyle === 'rounded' }"
            @click="styleData.borderStyle = 'rounded'"
          >
            {{ $t("cms.rounded") }}
          </button>
        </div>
      </div>
    </div>

    <!-- 背景顏色 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.background_color") }}</span>
      <div class="style-control color-control">
        <div class="color-preview" :style="{ backgroundColor: styleData.backgroundColor }">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="styleData.backgroundColor" format-model="hex" />
          </q-popup-proxy>
        </div>
        <span class="color-value">{{ styleData.backgroundColor || "#DCEEFF" }}</span>
        <q-btn flat dense class="reset-btn" @click="styleData.backgroundColor = defaultStyle.backgroundColor">{{
          $t("btn.reset")
        }}</q-btn>
      </div>
    </div>

    <!-- 主要顏色（僅 grid 模式顯示） -->
    <div v-if="styleData.displayStyle === 'grid'" class="style-row">
      <span class="style-label">{{ $t("cms.arr_primary_color") }}</span>
      <div class="style-control color-control">
        <div class="color-preview" :style="{ backgroundColor: styleData.primaryColor }">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="styleData.primaryColor" format-model="hex" />
          </q-popup-proxy>
        </div>
        <span class="color-value">{{ styleData.primaryColor || "#DCEEFF" }}</span>
        <q-btn flat dense class="reset-btn" @click="styleData.primaryColor = defaultStyle.primaryColor">{{
          $t("btn.reset")
        }}</q-btn>
      </div>
    </div>

    <!-- 次要顏色（僅 grid 模式顯示） -->
    <div v-if="styleData.displayStyle === 'grid'" class="style-row">
      <span class="style-label">{{ $t("cms.arr_secondary_color") }}</span>
      <div class="style-control color-control">
        <div class="color-preview" :style="{ backgroundColor: styleData.secondaryColor }">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="styleData.secondaryColor" format-model="hex" />
          </q-popup-proxy>
        </div>
        <span class="color-value">{{ styleData.secondaryColor || "#DCEEFF" }}</span>
        <q-btn flat dense class="reset-btn" @click="styleData.secondaryColor = defaultStyle.secondaryColor">{{
          $t("btn.reset")
        }}</q-btn>
      </div>
    </div>

    <!-- 與下方區塊間距 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.margin_bottom") }}</span>
      <div class="style-control">
        <div class="custom-slider-input">
          <input
            type="range"
            class="slider"
            :value="styleData.marginBottom"
            min="0"
            max="100"
            :style="{
              background: `linear-gradient(to right, #409EFF 0%, #409EFF ${styleData.marginBottom}%, #e0e0e0 ${styleData.marginBottom}%, #e0e0e0 100%)`
            }"
            @input="onMarginSliderInput"
          />
          <div class="value-input">
            <input type="text" :value="styleData.marginBottom" @input="onMarginInput" @blur="validateMargin" />
            <span class="suffix">px</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from "vue"
  import { reactive, watch, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import type * as Request from "src/api/request.type"

  const { t } = useI18n()

  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem>,
      required: true
    }
  })

  // 預設樣式資料
  const defaultStyle = {
    displayStyle: "horizontal" as "horizontal" | "grid",
    rowShow: 1, // 每行張數（horizontal 模式使用）
    displayCount: 1, // 顯示數量（grid 模式使用）
    borderStyle: "rounded" as "square" | "rounded",
    backgroundColor: "",
    primaryColor: "", // 主要顏色（grid 模式切換按鈕）
    secondaryColor: "", // 次要顏色（grid 模式切換按鈕）
    marginBottom: 24
  }

  const styleData = reactive({ ...defaultStyle })

  // 選項
  const displayStyleOptions = [
    { value: "horizontal", icon: "view_array" },
    { value: "grid", icon: "space_dashboard" }
  ]

  const borderStyleOptions = [
    { label: t("cms.square"), value: "square" },
    { label: t("cms.rounded"), value: "rounded" }
  ]

  // 方法 - rowShow
  const decreaseRowShow = () => {
    if (styleData.rowShow > 1) {
      styleData.rowShow--
    }
  }

  const increaseRowShow = () => {
    styleData.rowShow++
  }

  const onRowShowInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    // 只允許正整數
    const value = target.value.replace(/[^0-9]/g, "")
    target.value = value
    if (value) {
      styleData.rowShow = parseInt(value, 10)
    }
  }

  const validateRowShow = () => {
    if (!styleData.rowShow || styleData.rowShow < 1) {
      styleData.rowShow = 1
    }
  }

  // 方法 - displayCount
  const decreaseCount = () => {
    if (styleData.displayCount > 1) {
      styleData.displayCount--
    }
  }

  const increaseCount = () => {
    styleData.displayCount++
  }

  // 方法 - marginBottom
  const onMarginSliderInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    styleData.marginBottom = parseInt(target.value, 10)
  }

  const onMarginInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    const value = target.value.replace(/[^0-9]/g, "")
    target.value = value
    if (value) {
      let num = parseInt(value, 10)
      if (num > 100) num = 100
      styleData.marginBottom = num
    }
  }

  const validateMargin = () => {
    if (styleData.marginBottom === undefined || styleData.marginBottom === null || isNaN(styleData.marginBottom)) {
      styleData.marginBottom = 0
    }
    if (styleData.marginBottom < 0) styleData.marginBottom = 0
    if (styleData.marginBottom > 100) styleData.marginBottom = 100
  }

  // 同步資料到 entrance.payload.style
  const syncToEntrance = () => {
    props.entrance.payload.style = { ...styleData }
  }

  // 標記是否已初始化
  let initialized = false

  // 初始化：從 entrance.payload.style 讀取資料
  onMounted(() => {
    if (props.entrance.payload.style && Object.keys(props.entrance.payload.style).length > 0) {
      // 已有資料，讀取現有資料
      Object.assign(styleData, props.entrance.payload.style)
    } else {
      // 如果不存在則寫入預設值
      syncToEntrance()
    }
    initialized = true
  })

  // 監聽變化並同步到 entrance.payload.style（僅在初始化後才同步）
  watch(
    styleData,
    () => {
      if (initialized) {
        syncToEntrance()
      }
    },
    { deep: true }
  )
</script>

<style lang="scss" scoped>
  .style-settings {
    padding: 1rem;

    .style-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 0;

      &:last-child {
        border-bottom: none;
      }

      .style-label {
        font-size: 14px;
        color: #333;
        flex-shrink: 0;
      }

      .style-control {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }

    .style-toggle {
      :deep(.q-btn) {
        padding: 0.25rem 0.75rem;
        font-size: 13px;
      }
    }

    .custom-toggle-group {
      display: inline-flex;
      border-radius: 20px;
      overflow: hidden;
      background: #fff;
      padding: 2px;

      .toggle-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 32px;
        border: none;
        background: transparent;
        cursor: pointer;
        color: #858585;
        border-radius: 16px;
        transition: all 0.2s;

        &:hover:not(.active) {
          background: rgba(0, 0, 0, 0.05);
        }

        &.active {
          background: #409eff;
          color: #fff;
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }

      &.text-toggle .toggle-btn {
        width: auto;
        padding: 0 16px;
        font-size: 13px;
      }

      &.count-toggle .toggle-btn {
        width: 36px;
        height: 32px;
        font-size: 14px;
        font-weight: 500;
      }
    }

    .number-input-group {
      display: flex;
      align-items: center;
      gap: 0.25rem;

      .number-input {
        width: 60px;
        :deep(.q-field__control) {
          height: 32px;
        }
        :deep(input) {
          text-align: center;
        }
      }
    }

    .color-control {
      .color-preview {
        width: 24px;
        height: 24px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .color-value {
        font-size: 13px;
        color: #666;
        min-width: 70px;
      }

      .reset-btn {
        font-size: 12px;
        color: #666;
      }
    }

    .spacing-control {
      flex: 1;
      max-width: 200px;

      .spacing-slider {
        flex: 1;
        min-width: 80px;
      }

      .spacing-input {
        width: 50px;
        :deep(.q-field__control) {
          height: 32px;
        }
        :deep(input) {
          text-align: center;
        }
      }

      .unit {
        font-size: 13px;
        color: #666;
      }
    }

    .custom-number-input {
      display: inline-flex;
      align-items: center;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      background: #fff;

      .stepper-btn {
        width: 36px;
        height: 36px;
        border: none;
        background: transparent;
        font-size: 18px;
        color: #666;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;

        &:hover:not(:disabled) {
          background: #f5f5f5;
        }

        &:disabled {
          color: #ccc;
          cursor: not-allowed;
        }
      }

      .input-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #e0e0e0;
        border-right: 1px solid #e0e0e0;
        padding: 0 8px;
        height: 36px;
        min-width: 48px;

        input {
          width: 32px;
          border: none;
          outline: none;
          text-align: center;
          font-size: 14px;
          color: #333;
          background: transparent;

          appearance: textfield;
          -moz-appearance: textfield;
          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            appearance: none;
            -webkit-appearance: none;
            margin: 0;
          }
        }
      }
    }

    .custom-slider-input {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;

      .slider {
        flex: 1;
        height: 6px;
        appearance: none;
        -webkit-appearance: none;
        border-radius: 3px;
        outline: none;
        cursor: pointer;

        &::-webkit-slider-runnable-track {
          height: 6px;
          background: transparent;
          border-radius: 3px;
        }

        &::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: #fff;
          border: 2px solid #409eff;
          border-radius: 50%;
          cursor: pointer;
          margin-top: -6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        &::-moz-range-track {
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
        }

        &::-moz-range-progress {
          height: 6px;
          background: #409eff;
          border-radius: 3px;
        }

        &::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #fff;
          border: 2px solid #409eff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
      }

      .value-input {
        display: flex;
        align-items: center;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        padding: 4px 8px;
        background: #fff;
        min-width: 70px;

        input {
          width: 36px;
          border: none;
          outline: none;
          text-align: right;
          font-size: 14px;
          color: #333;
          background: transparent;

          appearance: textfield;
          -moz-appearance: textfield;
          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            appearance: none;
            -webkit-appearance: none;
            margin: 0;
          }
        }

        .suffix {
          font-size: 14px;
          color: #666;
          margin-left: 4px;
        }
      }
    }
  }
</style>
