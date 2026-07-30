<template>
  <div
    class="custom-image-container"
    :style="{
      marginBottom: settingStyle?.marginBottom ? `${settingStyle.marginBottom}px` : undefined,
      backgroundColor: settingStyle?.backgroundColor || undefined
    }"
  >
    <!-- Grid 模式：帶有左右切換按鈕 -->
    <template v-if="isGridMode">
      <div class="grid-navigation">
        <button
          class="nav-btn prev-btn text-white"
          :style="{ backgroundColor: settingStyle?.secondaryColor || '#ccc' }"
          @click="prevGroup"
          :disabled="currentGroupIndex <= 0"
        >
          <q-icon name="chevron_left" size="24px" />
        </button>
        <button
          class="nav-btn next-btn text-white"
          :style="{ backgroundColor: settingStyle?.primaryColor || '#3b82f6' }"
          @click="nextGroup"
          :disabled="currentGroupIndex >= totalGroups - 1"
        >
          <q-icon name="chevron_right" size="24px" />
        </button>
      </div>
      <div
        ref="gridContainer"
        class="custom-image-wrapper grid-mode"
        :class="[settingStyle?.borderStyle === 'square' ? 'rounded-none' : 'rounded-lg']"
        :style="containerStyle"
      >
        <q-img
          v-for="(item, index) in imageItems"
          :key="index"
          :src="item.img_path"
          :alt="item.alt_tag"
          :class="[settingStyle?.borderStyle === 'square' ? 'rounded-none' : 'rounded-lg', getGridItemClass(index)]"
          @click="handleImageClick(item)"
        />
      </div>
    </template>

    <!-- Horizontal 模式 -->
    <template v-else>
      <div
        class="custom-image-wrapper horizontal-mode"
        :class="[settingStyle?.borderStyle === 'square' ? 'rounded-none' : 'rounded-lg']"
        :style="containerStyle"
      >
        <q-img
          v-for="(item, index) in imageItems"
          :key="index"
          :src="item.img_path"
          :alt="item.alt_tag"
          :class="[settingStyle?.borderStyle === 'square' ? 'rounded-none' : 'rounded-lg']"
          @click="handleImageClick(item)"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useLanguage } from "src/common/composables/useLanguage"
import { useCmsImage } from "src/common/composables/useCmsImage"
import { useGame } from "src/common/composables/useGame"
import type * as Response from "src/api/response.type"
import type {
  CmsImagePayload,
  CmsImageNestedEntrance,
  CmsImageProcessedItem,
  CmsGamePayload,
  CmsLinkPayload,
  CmsNestedEntrancePayload,
  CmsStyleSettings
} from "src/types/cmsCustomPage"

const { nowLang } = useLanguage()
const { getCmsImageSource } = useCmsImage()
const { getGameImageByCustomPage } = useGame()

const props = defineProps<{
  entrance: Response.CmsEntranceItem
  handleEntranceClick: (item: { entrance: CmsImageProcessedItem; opening_method?: number }) => void
}>()

const payload = computed(() => props.entrance.payload as unknown as CmsImagePayload)

// 從 entrance.payload.style 讀取樣式
const settingStyle = computed((): CmsStyleSettings | undefined => payload.value?.style)

// 是否為 Grid 模式
const isGridMode = computed(() => settingStyle.value?.displayStyle === "grid")

// grid 模式下每組顯示 3 個圖片
const GRID_GROUP_SIZE = 3

// 計算 rowShow（優先使用 style.rowShow，否則使用 payload.row_show）
const rowShow = computed(() => settingStyle.value?.rowShow || payload.value?.row_show || 3)

// Grid 模式切換
const gridContainer = ref<HTMLElement | null>(null)
const currentGroupIndex = ref(0)

const totalGroups = computed(() => {
  return Math.ceil(imageItems.value.length / GRID_GROUP_SIZE)
})

const prevGroup = () => {
  if (currentGroupIndex.value > 0) {
    currentGroupIndex.value--
    scrollToGroup()
  }
}

const nextGroup = () => {
  if (currentGroupIndex.value < totalGroups.value - 1) {
    currentGroupIndex.value++
    scrollToGroup()
  }
}

const scrollToGroup = () => {
  if (gridContainer.value) {
    const containerWidth = gridContainer.value.clientWidth
    gridContainer.value.scrollTo({
      left: currentGroupIndex.value * containerWidth,
      behavior: "smooth"
    })
  }
}

// 計算內層容器樣式
const containerStyle = computed(() => {
  const style: Record<string, string | undefined> = {}

  if (isGridMode.value) {
    // grid 模式：每組 3 張圖片佔滿 100% 寬度
    const groupCount = Math.ceil(imageItems.value.length / GRID_GROUP_SIZE)
    style["grid-template-columns"] = `repeat(${groupCount}, 50% 50%)`
    style["grid-template-rows"] = "repeat(2, 1fr)"
  } else {
    // horizontal 模式：使用 rowShow 設定每行張數，超過換行
    style["grid-template-columns"] = `repeat(${rowShow.value}, 1fr)`
  }

  return style
})

// 根據索引獲取 grid item 的 class（用於 grid 模式）
const getGridItemClass = (index: number) => {
  const positionInGroup = index % GRID_GROUP_SIZE
  if (positionInGroup === 0) {
    return "grid-item-large"
  }
  return "grid-item-small"
}

const getFallbackImage = (item: CmsImageNestedEntrance): string => {
  const gamePayload = item.payload as CmsGamePayload

  if (
    gamePayload?.game_code &&
    gamePayload?.product_code &&
    gamePayload?.product_integration_id &&
    gamePayload?.game_type
  ) {
    return getGameImageByCustomPage({
      game_type: gamePayload.game_type,
      product_integration_id: gamePayload.product_integration_id,
      product_code: gamePayload.product_code,
      game_code: gamePayload.game_code
    })
  }

  return ""
}

const imageItems = computed((): CmsImageProcessedItem[] => {
  if (payload.value?.nested_entrance && Array.isArray(payload.value.nested_entrance)) {
    return payload.value.nested_entrance.map((item: CmsImageNestedEntrance): CmsImageProcessedItem => {
      let imgPath = getCmsImageSource(item)

      if (!imgPath) {
        imgPath = getFallbackImage(item)
      }

      return {
        ...item,
        img_path: imgPath,
        alt_tag: (item.payload as CmsGamePayload)?.alt_tag || "image",
        title: item.lang?.[nowLang.value as keyof typeof item.lang] || Object.values(item.lang || {})[0] || ""
      }
    })
  }
  return []
})

const hasOpeningMethod = (payload: CmsNestedEntrancePayload): payload is CmsLinkPayload => {
  return "opening_method" in payload
}

const handleImageClick = (item: CmsImageProcessedItem) => {
  const openingMethod = hasOpeningMethod(item.payload) ? item.payload.opening_method : undefined

  props.handleEntranceClick({
    entrance: item,
    opening_method: openingMethod
  })
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.custom-image-container {
  position: relative;
  width: 100%;
  border-radius: 0.625rem;
  padding: 8px;
}

.grid-navigation {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
  margin-left: auto;
  gap: 4px;

  .nav-btn {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: opacity 0.2s;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.custom-image-wrapper {
  @apply grid gap-2 cursor-pointer;

  .q-img {
    border-radius: 0.625rem;
    box-shadow: 0px 0px 16px 0px #0000001a;
  }

  // horizontal 模式：使用 grid 佈局，依 rowShow 設定每行張數，超過換行
  &.horizontal-mode {
    display: grid;
    grid-auto-flow: row;

    .q-img {
      width: 100%;
    }
  }

  // grid 模式：每組 3 張佔滿 100% 寬度，使用按鈕切換
  &.grid-mode {
    display: grid;
    overflow-x: hidden;
    overflow-y: hidden;
    grid-auto-flow: column;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;

    // 隱藏滾動條
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }

    .grid-item-large {
      grid-row: 1 / span 2;
      scroll-snap-align: start;
    }

    .grid-item-small {
      grid-row: span 1;
    }
  }
}
</style>
