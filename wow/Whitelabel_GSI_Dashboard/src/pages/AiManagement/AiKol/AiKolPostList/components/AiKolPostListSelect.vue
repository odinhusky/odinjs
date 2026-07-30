<template>
  <div class="kol-select-wrapper">
    <div class="w-full flex flex-col gap-1.5">
      <div class="flex items-center gap-1.5">
        <h5 class="text-sm m-0 p-0">{{ t("ai_kol.select_one_KOL") }}</h5>
        <div class="red_dot w-1.5 h-1.5 rounded-full bg-red-500"></div>
      </div>

      <q-select
        v-model="computedSelected"
        :options="mergedOptions"
        :loading="loading"
        :label="displayValueText"
        outlined
        color="primary"
        option-value="id"
        option-label="name"
        class="kol-select"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section v-if="scope.opt.id !== 'all'" avatar>
              <q-avatar>
                <img :src="getAvatarUrl(scope.opt)" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ scope.opt.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:selected-item="scope">
          <div class="flex items-center overflow-hidden">
            <q-avatar v-if="scope.opt.id !== 'all'" size="30px" class="q-mr-sm flex-shrink-0">
              <img :src="getAvatarUrl(scope.opt)" />
            </q-avatar>
            <span class="text-weight-medium truncate">{{ scope.opt.name }}</span>
          </div>
        </template>

        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> {{ t("no_data") }} </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, watch, ref } from "vue"
  import type { PropType } from "vue"
  import type * as Response from "src/api/response.type"
  import { useI18n } from "vue-i18n"

  const { t } = useI18n()

  // 定義特殊的「全部KOL」選項類型
  type AllKolOption = { id: "all"; name: string; preview_image_url: null }
  type SelectOption = Response.Kol | AllKolOption

  // 定義 Props，接收從父元件傳來的資料
  const props = defineProps({
    modelValue: {
      type: Object as PropType<SelectOption | null>,
      default: null
    },
    options: {
      type: Array as PropType<Response.Kol[]>,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  })

  // 定義 Emits，用於雙向綁定
  const emit = defineEmits(["update:modelValue"])

  // 建立「全部KOL」選項 - 使用 computed 讓語系切換時能即時更新
  const allKolOption = computed<AllKolOption>(() => ({
    id: "all",
    name: t("ai_kol.all_KOL"),
    preview_image_url: null
  }))

  // 合併選項：將「全部KOL」放在最前面
  const mergedOptions = computed<SelectOption[]>(() => {
    return [allKolOption.value, ...props.options]
  })

  // 使用 Computed 處理 v-model 的 get/set，保持單向數據流
  const computedSelected = computed({
    get: () => props.modelValue || allKolOption.value,
    set: (val) => emit("update:modelValue", val)
  })

  // 建立圖片快取映射表 (原始URL -> Blob URL)
  const imageCache = ref<Map<string, string>>(new Map())

  // 處理圖片顯示邏輯 - 返回 Blob URL (記憶體快取)
  const getAvatarUrl = (opt: SelectOption) => {
    const originalUrl = opt.preview_image_url || ""
    if (!originalUrl) return ""

    // 如果已經轉成 Blob URL，直接返回
    if (imageCache.value.has(originalUrl)) {
      return imageCache.value.get(originalUrl)!
    }

    // 還沒載入完成，暫時返回原始 URL
    return originalUrl
  }

  // 處理 Label 顯示邏輯
  const displayValueText = computed(() => {
    return undefined // 始終不顯示 label（因為預設選中「全部KOL」）
  })

  // 預載圖片並轉成 Blob URL 存在記憶體中
  const preloadImage = async (url: string): Promise<void> => {
    if (!url || imageCache.value.has(url)) {
      return
    }

    try {
      // 用 fetch 下載圖片
      const response = await fetch(url)
      const blob = await response.blob()

      // 建立 Blob URL (這會存在瀏覽器記憶體中)
      const blobUrl = URL.createObjectURL(blob)

      // 存入快取
      imageCache.value.set(url, blobUrl)

      console.log(`✅ Cached: ${url.substring(0, 50)}...`)
    } catch (error) {
      console.warn(`❌ Failed to cache: ${url}`, error)
    }
  }

  // 當 options 資料進來時，批次預載所有圖片
  watch(
    () => props.options,
    async (newOptions) => {
      if (newOptions && newOptions.length > 0) {
        const urls = newOptions
          .map((kol) => kol.preview_image_url)
          .filter((url): url is string => !!url && !imageCache.value.has(url))

        if (urls.length === 0) {
          console.log("📦 All images already cached")
          return
        }

        console.log(`🔄 Preloading ${urls.length} new images...`)
        await Promise.all(urls.map((url) => preloadImage(url)))
        console.log(`✨ Total cached: ${imageCache.value.size} images`)
      }
    },
    { immediate: true }
  )
</script>

<style scoped lang="scss">
  $select-height: 3.125rem; // 50px
  $select-padding-left: 1rem; // 16px
  $select-padding-right: 0.75rem; // 12px
  $select-padding-vertical: 0.5rem; // 8px

  .kol-select-wrapper {
    width: 100%;
  }

  .kol-select {
    width: 100%;

    :deep(.q-field__control) {
      height: $select-height !important;
      min-height: $select-height !important;
      max-height: $select-height !important;
      padding: 0 $select-padding-right 0 $select-padding-left;
    }

    :deep(.q-field__native) {
      padding-top: $select-padding-vertical;
      padding-bottom: $select-padding-vertical;
      padding-left: 0;
      min-height: $select-height !important;
      display: flex;
      align-items: center;
    }

    :deep(.q-field__label) {
      font-size: 0.875rem;
      font-weight: 500;
    }

    :deep(.q-field__marginal) {
      height: $select-height;
      display: flex;
      align-items: center;
    }

    :deep(.q-field__label) {
      top: 50% !important;
      transform: translateY(-50%) !important;
      line-height: 1 !important;
      padding-left: 0;
    }

    :deep(.q-field__control-container) {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      padding-left: 0 !important;
    }

    :deep(.q-field__inner) {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
  }
</style>
