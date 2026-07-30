<template>
  <div class="custom-image-container px-2" :style="wrapperStyle">
    <!-- Grid 模式：帶有左右切換按鈕 -->
    <template v-if="settingStyle?.displayStyle === 'grid'">
      <div class="grid-navigation">
        <button
          class="nav-btn prev-btn text-white"
          :style="{ backgroundColor: settingStyle?.secondaryColor || '#fff' }"
          @click="prevGroup"
          :disabled="currentGroupIndex <= 0"
        >
          <q-icon name="chevron_left" size="24px" />
        </button>
        <button
          class="nav-btn next-btn text-white"
          :style="{ backgroundColor: settingStyle?.primaryColor || '#fff' }"
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
          v-for="(item, index) in displayImages"
          :key="index"
          :src="item.img ? item.img : handleDefaultImage(item)"
          :class="[settingStyle?.borderStyle === 'square' ? 'rounded-none' : 'rounded-lg', getGridItemClass(index)]"
        ></q-img>
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
          v-for="(item, index) in displayImages"
          :key="index"
          :src="item.img ? item.img : handleDefaultImage(item)"
          :class="[settingStyle?.borderStyle === 'square' ? 'rounded-none' : 'rounded-lg']"
        ></q-img>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { PropType, computed, ref } from "vue"
  import { useImage } from "src/hook/useImage"
  import { useQueryStore } from "src/stores/queryStore"
  import { CMS_PAGE_COMPONENT_TYPE } from "src/utils/constants"
  import type * as Request from "src/api/request.type"

  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem> | null,
      required: true,
      default: () => {
        return null
      }
    }
  })

  const { cmsCustomPage, getGamePublicImg } = useImage()
  const queryStore = useQueryStore()

  // 從 entrance.payload.style 讀取樣式
  const settingStyle = computed(() => props.entrance?.payload?.style)

  // grid 模式下每組顯示 3 個圖片
  const GRID_GROUP_SIZE = 3

  // Grid 模式切換
  const gridContainer = ref<HTMLElement | null>(null)
  const currentGroupIndex = ref(0)

  const totalGroups = computed(() => {
    return Math.ceil(displayImages.value.length / GRID_GROUP_SIZE)
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

  // 計算要顯示的圖片
  const displayImages = computed(() => {
    return props.entrance?.payload?.nested_entrance || []
  })

  // 計算外層容器樣式
  const wrapperStyle = computed(() => {
    return {
      backgroundColor: settingStyle.value?.backgroundColor
    }
  })

  // 計算容器樣式
  const containerStyle = computed(() => {
    const style: Record<string, string | undefined> = {}

    if (settingStyle.value?.displayStyle === "grid") {
      // grid 模式：每組 3 張圖片佔滿 100% 寬度
      const groupCount = Math.ceil(displayImages.value.length / GRID_GROUP_SIZE)
      style["grid-template-columns"] = `repeat(${groupCount}, 50% 50%)`
      style["grid-template-rows"] = "repeat(2, 1fr)"
    } else {
      // horizontal 模式：使用 rowShow 設定每行張數，超過換行
      const rowShow = settingStyle.value?.rowShow || 1
      style["grid-template-columns"] = `repeat(${rowShow}, 1fr)`
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

  const handleDefaultImage = (item: Request.CmsEntranceItem) => {
    if (item.payload.game_type && item.payload.product_code && item.payload.game_code) {
      const gameTypeString = queryStore.gameTypeIdMap[item.payload.game_type || 1]
      const integrationId = (item.payload.product_integration_id || 1) as number
      return getGamePublicImg(integrationId, gameTypeString, item.payload.product_code, item.payload.game_code)
    }

    return cmsCustomPage(CMS_PAGE_COMPONENT_TYPE.ImageName[CMS_PAGE_COMPONENT_TYPE.Enums.IMAGE])
  }
</script>

<style scoped lang="scss">
  .custom-image-container {
    position: relative;
    border-radius: 0.625rem;
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
