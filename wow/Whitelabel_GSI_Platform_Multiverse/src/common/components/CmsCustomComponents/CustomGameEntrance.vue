<template>
  <div class="custom-game-entrance-wrapper" :style="wrapperStyle">
    <div
      class="custom-game-entrance"
      :class="[settingStyle?.borderStyle === 'square' ? 'rounded-none' : 'rounded-lg']"
      :style="containerStyle"
    >
      <div v-if="payload.title" class="entrance-title" :style="{ color: settingStyle?.textColor }">
        {{ payload.title }}
      </div>
      <div class="entrance-content">
        <!-- 產品列表 (SINGLE_ENTRY - 供應商入口) -->
        <div
          v-if="
            payload.game_type_entrance_type === CMS_GAME_ENTRANCE.Enums.SINGLE_ENTRY && displayProductsList.length > 0
          "
          class="product-grid"
          :style="{ 'grid-template-columns': `repeat(${payload.row_show ?? 2}, 1fr)` }"
        >
          <div
            v-for="product in displayProductsList"
            :key="product.product_code"
            class="product-item"
            @click="handleProductItemClick(product)"
          >
            <div class="img-container">
              <img
                :src="getProductSquareImage({ ...product, siteKey: currentSiteKey })"
                :alt="product.product_name"
                class="product-img"
                @error="setDefaultProductImg"
              />
            </div>
            <!-- <div class="product-name">{{ product.product_name }}</div> -->
          </div>
        </div>
        <!-- 遊戲列表 (GAME_LIST - 遊戲入口) -->
        <div
          v-if="payload.game_type_entrance_type === CMS_GAME_ENTRANCE.Enums.GAME_LIST && displayGamesList.length > 0"
          class="game-grid"
          :style="{ 'grid-template-columns': `repeat(${payload.row_show ?? 2}, 1fr)` }"
        >
          <div v-for="game in displayGamesList" :key="game.game_id" class="game-item" @click="handleGameClick(game)">
            <div class="img-container">
              <img :src="getGameImage(game)" :alt="game.game_code" class="game-img" @error="setDefaultGameImg" />
            </div>
            <!-- <div class="game-name">{{ game.game_name }}</div> -->
          </div>
        </div>
        <!-- 無資料時顯示預設圖片 -->
        <div
          v-if="
            (payload.game_type_entrance_type === CMS_GAME_ENTRANCE.Enums.SINGLE_ENTRY &&
              displayProductsList.length === 0) ||
            (payload.game_type_entrance_type === CMS_GAME_ENTRANCE.Enums.GAME_LIST && displayGamesList.length === 0)
          "
          class="no-data"
        >
          {{ $t("tableHeader.no_data") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useGame } from "src/common/composables/useGame"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import type * as Response from "src/api/response.type"
import type { CmsGameEntrancePayload, CmsStyleSettings } from "src/types/cmsCustomPage"
import { CMS_GAME_ENTRANCE, GAME_TYPE } from "src/common/utils/constants"

const {
  productState,
  gameState,
  getProducts,
  getGames,
  openGame,
  handleProductClick,
  getGameImage,
  getProductSquareImage
} = useGame()
const { setGameTypeUsing } = useGameTypeStore()
const { setDefaultGameImg, setDefaultProductImg } = useCommonImg()

const props = defineProps<{
  entrance: Response.CmsEntranceItem
  handleEntranceClick?: (entrance: Response.CmsEntranceItem) => void
  siteKey?: string
}>()

const payload = computed(() => props.entrance.payload as unknown as CmsGameEntrancePayload)
const currentSiteKey = computed(() => props.siteKey)

// 從 entrance.payload.style 讀取樣式
const settingStyle = computed((): CmsStyleSettings | undefined => payload.value?.style)

// 計算外層容器樣式（包含 marginBottom）
const wrapperStyle = computed(() => {
  const style: Record<string, string | undefined> = {}

  if (settingStyle.value?.marginBottom !== undefined) {
    style.marginBottom = `${settingStyle.value.marginBottom}px`
  }

  return style
})

// 計算內層容器樣式
const containerStyle = computed(() => {
  const style: Record<string, string | undefined> = {}

  if (settingStyle.value?.backgroundColor) {
    style.backgroundColor = settingStyle.value.backgroundColor
  }
  if (settingStyle.value?.padding !== undefined) {
    style.padding = `${settingStyle.value.padding}px`
  }

  return style
})

const gamesList = ref<any[]>([])
const productsList = ref<any[]>([])

// 計算要顯示的最大數量 (row_show * row_num)
const maxDisplayCount = computed(() => {
  return (payload.value.row_show ?? 2) * (payload.value.row_num ?? 3)
})

// 限制顯示的遊戲列表
const displayGamesList = computed(() => {
  return gamesList.value.slice(0, maxDisplayCount.value)
})

// 限制顯示的產品列表
const displayProductsList = computed(() => {
  return productsList.value.slice(0, maxDisplayCount.value)
})

const handleGameClick = (game: any) => {
  const gameTypeId = payload.value.game_type_id
  openGame(game.integration_id, game.product_code, game.game_code, gameTypeId, true)
}

const handleProductItemClick = (product: any) => {
  const gameTypeId = payload.value.game_type_id
  if (gameTypeId) {
    setGameTypeUsing(gameTypeId as GAME_TYPE.Enums)
  }
  handleProductClick(product.integration_id, product.product_code)
}

const fetchData = async () => {
  const gameTypeId = payload.value.game_type_id
  const entranceType = payload.value.game_type_entrance_type

  if (entranceType === CMS_GAME_ENTRANCE.Enums.SINGLE_ENTRY) {
    // 供應商入口：顯示產品列表，同 ProductLobby 邏輯
    await getProducts(gameTypeId as GAME_TYPE.Enums)
    productsList.value = [...productState.list]
  } else if (entranceType === CMS_GAME_ENTRANCE.Enums.GAME_LIST) {
    // 遊戲入口：顯示遊戲列表，類似 GameLobby 邏輯
    const productCode = payload.value.product_code
    const integrationId = payload.value.product_integration_id

    if (productCode && integrationId) {
      await getGames(integrationId, gameTypeId as GAME_TYPE.Enums, productCode)
      gamesList.value = [...gameState.list]
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.custom-game-entrance-wrapper {
  width: 100%;
}

.custom-game-entrance {
  .entrance-title {
    font-family: OpenSans;
    font-weight: 700;
    font-size: 1.25rem;
    color: #2a354b;
    margin-bottom: 0.375rem;
  }

  .entrance-content {
    @apply w-full;
  }

  .game-grid,
  .product-grid {
    @apply grid gap-1.5;

    .game-item,
    .product-item {
      @apply cursor-pointer rounded-lg overflow-hidden transition-all duration-300;
      border-radius: 0.625rem;
      box-shadow: 0px 0px 16px 0px #0000001a;
      background: var(--game-entrance-item-bg, #ffffff);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 0.5rem 1.5625rem rgba(0, 0, 0, 0.15);
      }

      .img-container {
        @apply w-full h-auto rounded-lg overflow-hidden;

        .game-img,
        .product-img {
          @apply w-full h-auto object-cover;
        }
      }

      .game-name,
      .product-name {
        @apply w-full text-left overflow-hidden whitespace-nowrap text-ellipsis;
        @apply px-4 pb-4 pt-2 font-bold text-[1.25rem];
        font-family: OpenSans;
        color: var(--game-entrance-text-color, #2a354b);

        @include iphone-width {
          @apply h-4 leading-4 text-[0.875rem];
        }
      }
    }
  }

  .no-data {
    @apply text-center py-8 text-gray-500;
  }
}
</style>
