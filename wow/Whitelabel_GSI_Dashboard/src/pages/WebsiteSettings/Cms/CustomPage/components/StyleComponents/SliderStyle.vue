<template>
  <div class="style-settings">
    <!-- 輪播樣式 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.carousel_style") }}</span>
      <div class="style-control">
        <div class="custom-toggle-group">
          <button
            type="button"
            class="toggle-btn"
            :class="{ active: styleData.carouselStyle === 'dots' }"
            @click="styleData.carouselStyle = 'dots'"
          >
            <q-icon name="more_horiz" size="20px" />
          </button>
          <button
            type="button"
            class="toggle-btn arrows-btn"
            :class="{ active: styleData.carouselStyle === 'arrows' }"
            @click="styleData.carouselStyle = 'arrows'"
          >
            <q-icon name="chevron_left" size="18px" />
            <q-icon name="chevron_right" size="18px" />
          </button>
        </div>
      </div>
    </div>

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

    <!-- 輪播秒數 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.autoplay_seconds") }}</span>
      <div class="style-control">
        <div class="custom-number-input">
          <button type="button" class="stepper-btn" :disabled="styleData.autoPlaySeconds <= 1" @click="decreaseSeconds">
            −
          </button>
          <div class="input-wrapper">
            <input type="text" :value="styleData.autoPlaySeconds" @input="onSecondsInput" @blur="validateSeconds" />
            <span class="suffix">秒</span>
          </div>
          <button type="button" class="stepper-btn" @click="increaseSeconds">+</button>
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

    <!-- 主要顏色 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.primary_color") }}</span>
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

    <!-- 次要顏色 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.secondary_color") }}</span>
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
    carouselStyle: "dots" as "dots" | "arrows",
    borderStyle: "rounded" as "square" | "rounded",
    autoPlaySeconds: 3,
    backgroundColor: "",
    primaryColor: "",
    secondaryColor: "",
    marginBottom: 24
  }

  const styleData = reactive({ ...defaultStyle })

  // 選項
  const carouselStyleOptions = [
    { value: "dots", slot: "dots" },
    { value: "arrows", slot: "arrows" }
  ]

  const borderStyleOptions = [
    { label: t("cms.square"), value: "square" },
    { label: t("cms.rounded"), value: "rounded" }
  ]

  // 方法
  const decreaseSeconds = () => {
    if (styleData.autoPlaySeconds > 1) {
      styleData.autoPlaySeconds--
    }
  }

  const increaseSeconds = () => {
    styleData.autoPlaySeconds++
  }

  const onSecondsInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    // 只允許正整數
    const value = target.value.replace(/[^0-9]/g, "")
    target.value = value
    if (value) {
      styleData.autoPlaySeconds = parseInt(value, 10)
    }
  }

  const validateSeconds = () => {
    if (!styleData.autoPlaySeconds || styleData.autoPlaySeconds < 1) {
      styleData.autoPlaySeconds = 1
    }
  }

  const onMarginSliderInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    styleData.marginBottom = parseInt(target.value, 10)
  }

  const onMarginInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    // 只允許數字
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
        border-left: 1px solid #e0e0e0;
        border-right: 1px solid #e0e0e0;
        padding: 0 8px;
        height: 36px;

        input {
          width: 32px;
          border: none;
          outline: none;
          text-align: center;
          font-size: 14px;
          color: #333;
          background: transparent;

          /* 隱藏 number input 的箭頭 */
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
          margin-left: 2px;
        }
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
    }

    .number-input-group {
      display: flex;
      align-items: center;
      gap: 0.25rem;

      .number-input {
        width: 60px;
        :deep(input) {
          text-align: center;
        }

        &.with-suffix {
          width: 80px;
          :deep(input) {
            text-align: left;
            padding-right: 0;
          }
        }

        .input-suffix {
          font-size: 13px;
          color: #666;
        }
      }

      .unit {
        font-size: 13px;
        color: #666;
      }
    }

    .color-control {
      .color-preview {
        width: 24px;
        height: 24px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        cursor: pointer;
        background-color: #dceeff;
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
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
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
