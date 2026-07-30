<template>
  <div class="style-settings">
    <!-- 圖標 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.icon") }}</span>
      <div class="style-control">
        <div class="icon-upload-container">
          <PreviewImage
            :parentImage="styleData.icon"
            :defaultImage="cmsIconUploadDefault()"
            :aspectRatio="'1/1'"
            :maxWidth="'3rem'"
            @update:modelValue="updateIconUrl"
            @update:img-file="updateIconFile"
            imageToBase64
          />
        </div>
        <img v-if="styleData.icon" :src="btnTrash()" alt="delete-button" class="icon-delete-btn" @click="removeIcon" />
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
            :class="{ active: styleData.borderStyle === 'rounded' }"
            @click="styleData.borderStyle = 'rounded'"
          >
            {{ $t("cms.rounded") }}
          </button>
          <button
            type="button"
            class="toggle-btn"
            :class="{ active: styleData.borderStyle === 'square' }"
            @click="styleData.borderStyle = 'square'"
          >
            {{ $t("cms.square") }}
          </button>
        </div>
      </div>
    </div>

    <!-- 文字顏色 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.text_color") }}</span>
      <div class="style-control color-control">
        <div class="color-preview" :style="{ backgroundColor: styleData.textColor || '#409eff' }">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="styleData.textColor" format-model="hex" />
          </q-popup-proxy>
        </div>
        <q-btn flat dense class="reset-btn" @click="styleData.textColor = defaultStyle.textColor">{{
          $t("btn.reset")
        }}</q-btn>
      </div>
    </div>

    <!-- 背景顏色 -->
    <div class="style-row">
      <span class="style-label">{{ $t("cms.background_color") }}</span>
      <div class="style-control color-control">
        <div class="color-preview" :style="{ backgroundColor: styleData.backgroundColor || '#DCEEFF' }">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="styleData.backgroundColor" format-model="hex" />
          </q-popup-proxy>
        </div>
        <q-btn flat dense class="reset-btn" @click="styleData.backgroundColor = defaultStyle.backgroundColor">{{
          $t("btn.reset")
        }}</q-btn>
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
  import { useImage } from "src/hook/useImage"
  import { useCms } from "src/composables/useCms"
  import type * as Request from "src/api/request.type"
  import PreviewImage from "@/components/forms/PreviewImage.vue"

  const { cmsIconUploadDefault, btnTrash } = useImage()
  const { setFile } = useCms()

  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem>,
      required: true
    }
  })

  // 預設樣式資料
  const defaultStyle = {
    icon: "",
    iconFileName: "",
    borderStyle: "rounded" as "square" | "rounded",
    textColor: "#409eff",
    backgroundColor: "#EFF7FF",
    marginBottom: 0
  }

  const styleData = reactive({ ...defaultStyle })

  // 圖標上傳
  const updateIconUrl = (value: string) => {
    styleData.icon = value
  }

  const updateIconFile = async (file: File) => {
    if (file) {
      setFile(file)
      styleData.iconFileName = file.name
    }
  }

  const removeIcon = () => {
    styleData.icon = ""
    styleData.iconFileName = ""
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

    .icon-upload-container {
      width: 48px;
      height: 48px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
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
      }

      &.text-toggle .toggle-btn {
        width: auto;
        padding: 0 16px;
        font-size: 13px;
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
