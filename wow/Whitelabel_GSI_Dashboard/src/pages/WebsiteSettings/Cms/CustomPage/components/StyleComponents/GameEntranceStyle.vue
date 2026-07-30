<template>
  <div class="style-settings">
    <!-- 背景顏色 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.background_color") }}</span>
      <div class="style-control color-control">
        <div class="color-preview" :style="{ backgroundColor: styleData.backgroundColor || 'transparent' }">
          <q-icon v-if="!styleData.backgroundColor" name="close" size="16px" color="grey" />
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="styleData.backgroundColor" format-model="hex" />
          </q-popup-proxy>
        </div>
        <q-btn flat dense class="reset-btn" @click="styleData.backgroundColor = defaultStyle.backgroundColor">{{
          $t("btn.reset")
        }}</q-btn>
      </div>
    </div>

    <!-- 文字顏色 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.text_color") }}</span>
      <div class="style-control color-control">
        <div class="color-preview" :style="{ backgroundColor: styleData.textColor }">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="styleData.textColor" format-model="hex" />
          </q-popup-proxy>
        </div>
        <span class="color-value">{{ styleData.textColor || "#131313" }}</span>
        <q-btn flat dense class="reset-btn" @click="styleData.textColor = defaultStyle.textColor">{{
          $t("btn.reset")
        }}</q-btn>
      </div>
    </div>

    <!-- 頁面間距 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.padding") }}</span>
      <div class="style-control">
        <div class="custom-slider-input">
          <input
            type="range"
            class="slider"
            :value="styleData.padding"
            min="0"
            max="100"
            :style="{
              background: `linear-gradient(to right, #409EFF 0%, #409EFF ${styleData.padding}%, #e0e0e0 ${styleData.padding}%, #e0e0e0 100%)`
            }"
            @input="onPaddingSliderInput"
          />
          <div class="value-input">
            <input type="text" :value="styleData.padding" @input="onPaddingInput" @blur="validatePadding" />
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
  import type * as Request from "src/api/request.type"

  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem>,
      required: true
    }
  })

  // 預設樣式資料
  const defaultStyle = {
    backgroundColor: "",
    textColor: "#131313",
    padding: 24
  }

  const styleData = reactive({ ...defaultStyle })

  // 方法 - padding
  const onPaddingSliderInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    styleData.padding = parseInt(target.value, 10)
  }

  const onPaddingInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    const value = target.value.replace(/[^0-9]/g, "")
    target.value = value
    if (value) {
      let num = parseInt(value, 10)
      if (num > 100) num = 100
      styleData.padding = num
    }
  }

  const validatePadding = () => {
    if (styleData.padding === undefined || styleData.padding === null || isNaN(styleData.padding)) {
      styleData.padding = 0
    }
    if (styleData.padding < 0) styleData.padding = 0
    if (styleData.padding > 100) styleData.padding = 100
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
