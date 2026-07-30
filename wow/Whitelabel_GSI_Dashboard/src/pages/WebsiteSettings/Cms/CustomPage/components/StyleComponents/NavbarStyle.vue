<template>
  <div class="style-settings">
    <!-- 顯示數量 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.display_count") }}</span>
      <div class="style-control">
        <div class="number-input">
          <input
            type="text"
            :value="styleData.displayCount"
            @input="onDisplayCountInput"
            @blur="validateDisplayCount"
          />
        </div>
      </div>
    </div>

    <!-- 背景顏色 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.background_color") }}</span>
      <div class="style-control color-control">
        <div class="color-preview" :style="{ backgroundColor: styleData.backgroundColor || '#FFFFFF' }">
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
        <div class="color-preview" :style="{ backgroundColor: styleData.textColor || '#333333' }">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="styleData.textColor" format-model="hex" />
          </q-popup-proxy>
        </div>
        <q-btn flat dense class="reset-btn" @click="styleData.textColor = defaultStyle.textColor">{{
          $t("btn.reset")
        }}</q-btn>
      </div>
    </div>

    <!-- 選擇文字顏色 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.selected_text_color") }}</span>
      <div class="style-control color-control">
        <div class="color-preview" :style="{ backgroundColor: styleData.selectedTextColor || '#409EFF' }">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="styleData.selectedTextColor" format-model="hex" />
          </q-popup-proxy>
        </div>
        <q-btn flat dense class="reset-btn" @click="styleData.selectedTextColor = defaultStyle.selectedTextColor">{{
          $t("btn.reset")
        }}</q-btn>
      </div>
    </div>

    <!-- 選擇背景顏色 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.selected_background_color") }}</span>
      <div class="style-control color-control">
        <div class="color-preview" :style="{ backgroundColor: styleData.selectedBackgroundColor || '#E6F2FF' }">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="styleData.selectedBackgroundColor" format-model="hex" />
          </q-popup-proxy>
        </div>
        <q-btn
          flat
          dense
          class="reset-btn"
          @click="styleData.selectedBackgroundColor = defaultStyle.selectedBackgroundColor"
          >{{ $t("btn.reset") }}</q-btn
        >
      </div>
    </div>

    <!-- 頁面間距 -->
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
    displayCount: 4,
    backgroundColor: "#FFFFFF",
    textColor: "#7983a2",
    selectedTextColor: "#ffffff",
    selectedBackgroundColor: "#025be8",
    marginBottom: 0
  }

  const styleData = reactive({ ...defaultStyle })

  // 顯示數量
  const onDisplayCountInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    const value = target.value.replace(/[^0-9]/g, "")
    target.value = value
    if (value) {
      let num = parseInt(value, 10)
      if (num < 1) num = 1
      if (num > 10) num = 10
      styleData.displayCount = num
    }
  }

  const validateDisplayCount = () => {
    if (styleData.displayCount === undefined || styleData.displayCount === null || isNaN(styleData.displayCount)) {
      styleData.displayCount = 4
    }
    if (styleData.displayCount < 1) styleData.displayCount = 1
    if (styleData.displayCount > 10) styleData.displayCount = 10
  }

  // 頁面間距
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
      Object.assign(styleData, props.entrance.payload.style)
    } else {
      syncToEntrance()
    }
    initialized = true
  })

  // 監聽變化並同步到 entrance.payload.style
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

    .number-input {
      display: flex;
      align-items: center;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 4px 8px;
      background: #fff;
      min-width: 60px;

      input {
        width: 40px;
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

    .color-control {
      .color-preview {
        width: 32px;
        height: 32px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .reset-btn {
        font-size: 12px;
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
        min-width: 50px;

        input {
          width: 36px;
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
  }
</style>
