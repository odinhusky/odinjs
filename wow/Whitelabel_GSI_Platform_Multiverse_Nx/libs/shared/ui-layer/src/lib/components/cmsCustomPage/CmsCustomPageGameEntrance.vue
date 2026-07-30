<script setup lang="ts">
import type { CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"
import type { CmsGameEntrancePayload, CmsStyleSettings } from "@shared-lib/api/commonTypes/cmsCustomPageTypes"
import type { ProductItem, GameItem } from "@shared-lib/api/commonTypes/gameTypes"
import { CMS_GAME_ENTRANCE_ENUMS } from "@shared-lib/constants/enums/cmsGameEntrance"
import { useGameList } from "@shared-lib/api/hooks/useGameList"
import { getProductList } from "@shared-lib/api/apiFunctions/game_getProductList"
import {
  useGameTypeList,
  toGameTypeState,
  type GameTypeListApiResponse,
  type GameTypeState
} from "@shared-lib/api/hooks/useGameTypeList"
import { toGameLobbyRoute } from "@shared-lib/constants/routePath"
import { useFavorite } from "../../composables/useFavorite"

const props = defineProps<{
  entrance: CmsEntranceItem
}>()

const router = useRouter()
const { openGame } = useOpenGame()
const { syncFavoriteFlag, mutatingGameIds, handleToggleFavorite } = useFavorite()

const payload = computed((): CmsGameEntrancePayload => {
  return (props.entrance.payload as unknown as CmsGameEntrancePayload) ?? {}
})

// ── 客製化樣式 ────────────────────────────────────────────────────────────────
const settingStyle = computed((): CmsStyleSettings | undefined => payload.value?.style)

const wrapperStyle = computed(() => {
  const style: Record<string, string> = {}
  if (settingStyle.value?.marginBottom !== undefined) {
    style.marginBottom = `${settingStyle.value.marginBottom}px`
  }
  return style
})

const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  if (settingStyle.value?.backgroundColor) {
    style.backgroundColor = settingStyle.value.backgroundColor
  }
  if (settingStyle.value?.padding !== undefined) {
    style.padding = `${settingStyle.value.padding}px`
  }
  return style
})

// ── 遊戲列表 (GAME_LIST) ──────────────────────────────────────────────────────
// Reactive params — query auto-runs per (gameType, product) combination with its own cache entry
const gameListParams = computed(() => {
  const p = payload.value
  if (p.game_type_entrance_type !== CMS_GAME_ENTRANCE_ENUMS.GAME_LIST) return null
  if (!p.game_type_id || !p.product_integration_id || !p.product_code) return null
  return {
    game_type_id: p.game_type_id,
    integration_id: p.product_integration_id,
    product_code: p.product_code
  }
})

const { data: gamesList, isLoading: isGamesLoading } = useGameList({ params: gameListParams })

// ── 產品列表 (SINGLE_ENTRY) ────────────────────────────────────────────────────
// 不使用 useProductList（其 query key 不含 game_type_id，多個 section 會共用同一份快取）
// 改用直接呼叫 API，與 GAME_LIST 的 mutation 模式保持一致，確保每個 section 資料獨立
const productsList = ref<ProductItem[]>([])
const isProductsLoading = ref(false)

// ── gameTypeState for fallback image paths in item components ──────────────────
const { data: gameTypeStateData } = useGameTypeList<GameTypeState>({
  options: {
    select: (response: GameTypeListApiResponse) => toGameTypeState(response.data ?? [])
  }
})
const gameTypeState = computed<GameTypeState>(() => gameTypeStateData.value ?? { list: [], map: {} })

console.log("!! gameTypeState.value:", gameTypeState.value)

// ── 顯示資料 (限制數量) ────────────────────────────────────────────
const maxCount = computed(() => (payload.value.row_show ?? 2) * (payload.value.row_num ?? 3))

const displayGames = computed(() => syncFavoriteFlag((gamesList.value ?? []).slice(0, maxCount.value)))
const displayProducts = computed(() => productsList.value.slice(0, maxCount.value))

// ── 點擊處理 ──────────────────────────────────────────────────────────────────
const handleGameItemClick = (game: GameItem) => {
  handleGlobalClick({
    target: `cmsCustomPageGameEntrance_game_${game.game_id}`,
    debounceTimer: 150,
    callback: () => {
      openGame(game.integration_id, game.product_code, game.game_code, payload.value.game_type_id ?? 0)
    }
  })
}

const handleProductItemClick = (product: ProductItem) => {
  handleGlobalClick({
    target: `cmsCustomPageGameEntrance_product_${product.product_code}`,
    debounceTimer: 150,
    callback: () => {
      const gameTypeId = payload.value.game_type_id
      if (!gameTypeId || !product.product_code) return
      router.push(toGameLobbyRoute(gameTypeId, product.product_code))
    }
  })
}

// ── 初始化資料 (SINGLE_ENTRY) ──────────────────────────────────────────────────
// GAME_LIST is driven reactively by gameListParams — no onMounted call needed
onMounted(async () => {
  if (payload.value.game_type_entrance_type !== CMS_GAME_ENTRANCE_ENUMS.SINGLE_ENTRY) return
  const gameTypeId = payload.value.game_type_id ?? 0
  if (!gameTypeId) return
  isProductsLoading.value = true
  try {
    const res = await getProductList({ game_type_id: gameTypeId })
    productsList.value = res?.data ?? []
  } finally {
    isProductsLoading.value = false
  }
})
</script>

<template>
  <div class="cms-game-entrance-wrapper" :style="wrapperStyle">
    <div
      class="cms-game-entrance"
      :class="settingStyle?.borderStyle === 'square' ? 'rounded-none' : 'rounded-lg'"
      :style="containerStyle"
    >
      <!-- 標題 -->
      <h3
        v-if="payload.title"
        class="mb-2 text-xl font-bold"
        :style="{ color: settingStyle?.textColor || 'var(--card-card-title-primary-enabled)' }"
      >
        {{ payload.title }}
      </h3>

      <!-- 遊戲列表 (GAME_LIST) -->
      <div
        v-if="payload.game_type_entrance_type === CMS_GAME_ENTRANCE_ENUMS.GAME_LIST"
        class="grid gap-2"
        :style="{ gridTemplateColumns: `repeat(${payload.row_show ?? 2}, minmax(0, 1fr))` }"
      >
        <GameLobbyGameItem
          v-for="game in displayGames"
          :key="game.game_id"
          :game="game"
          :game-type-map="gameTypeState.map"
          :is-favorite-mutating="mutatingGameIds.has(Number(game.game_id))"
          :style="{ width: '100%' }"
          @click="handleGameItemClick(game)"
          @toggle-favorite="handleToggleFavorite(game)"
        />
        <div
          v-if="!isGamesLoading && displayGames.length === 0"
          class="col-span-full py-4 text-center text-sm opacity-50"
        >
          No games available
        </div>
      </div>

      <!-- 產品列表 (SINGLE_ENTRY) -->
      <div
        v-else-if="payload.game_type_entrance_type === CMS_GAME_ENTRANCE_ENUMS.SINGLE_ENTRY"
        class="grid gap-2"
        :style="{ gridTemplateColumns: `repeat(${payload.row_show ?? 2}, minmax(0, 1fr))` }"
      >
        <ProductLobbyGameItem
          v-for="product in displayProducts"
          :key="product.product_code"
          :product="product"
          :game-type-map="gameTypeState.map"
          @click="handleProductItemClick(product)"
        />
        <div
          v-if="!isProductsLoading && displayProducts.length === 0"
          class="col-span-full py-4 text-center text-sm opacity-50"
        >
          No products available
        </div>
      </div>
    </div>
  </div>
</template>
