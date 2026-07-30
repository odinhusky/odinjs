<template>
  <CommonCarouselBanner v-if="isMobile" />
  <CarouselBanner v-else />
  <div class="game-container game-top">
    <q-virtual-scroll
      ref="virtualScrollRef"
      v-if="showGameList.length > 0"
      :items="gameRows"
      :virtual-scroll-item-size="virtualRowHeight"
      :virtual-scroll-slice-size="virtualScrollSliceSize"
      :virtual-scroll-slice-ratio-before="virtualScrollSliceRatioBefore"
      :virtual-scroll-slice-ratio-after="virtualScrollSliceRatioAfter"
      :scroll-target="resolvedVirtualScrollTarget"
    >
      <template #default="{ item: gameRow, index }">
        <div :key="`game-row-${index}`" class="game-row">
          <div
            v-for="game in gameRow"
            :key="game.game_id"
            class="game-item"
            @click="openGame(game.integration_id, game.product_code, game.game_code, gameType, true)"
          >
            <img
              :src="getGameImage(game)"
              :alt="game.game_code"
              class="game-img"
              loading="lazy"
              decoding="async"
              @error="setDefaultGameImg"
            />
            <q-btn class="btn-play">
              <img :src="playBtnImg" alt="" />
            </q-btn>
          </div>
        </div>
      </template>
    </q-virtual-scroll>
  </div>
</template>
<script lang="ts">
export default {
  name: "GameLobby"
}
</script>
<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import CarouselBanner from "app/template/set_jokerhill/components/CarouselBanner.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import CommonCarouselBanner from "src/common/components/banner/CarouselBanner.vue"
import { useBanner } from "src/common/composables/useBanner"
import { useGameLobbyVirtualScroll } from "src/common/composables/useGameLobbyVirtualScroll"
import { useProviderGameLobby } from "src/common/composables/useProviderLobby"
import { useGame } from "src/common/composables/useGame"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useProviderGameLobbyRoute } from "src/common/composables/useProviderGameLobbyRoute"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { BANNER_POSITION, GAME_TYPE } from "src/common/utils/constants"
import { computed, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

let isMobile = ref(false)
const { width } = useWindowSize()
const route = useRoute()
const router = useRouter()
const { handleBannerList } = useBanner()
const { openGame, getGameImage } = useGame()
const { playBtnImg } = useSiteImg()
const { setDefaultGameImg } = useCommonImg()
const { isDown, isDesktop } = useMediaQuery()

const { safeGameType, routeIntegrationId, routeProductCode } = useProviderGameLobbyRoute(route, router)
const gameType = safeGameType


const { showGameList } = useProviderGameLobby(router, safeGameType, { routeIntegrationId, routeProductCode })

// 對齊 CSS：5 → phone 4 → iphone 2
const rowItemsCount = computed(() => {
  if (isDown.iphone) return 2
  if (isDown.phone) return 4
  return 5
})

const {
  virtualScrollRef,
  virtualRowHeight,
  virtualScrollSliceSize,
  virtualScrollSliceRatioBefore,
  virtualScrollSliceRatioAfter,
  resolvedVirtualScrollTarget,
  gameRows
} = useGameLobbyVirtualScroll(showGameList, isDesktop, { rowItemsCount })

async function getBanner() {
  await handleBannerList(BANNER_POSITION.Enums.GameLobby, gameType.value)
}

watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)

onMounted(() => {
  getBanner()
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "../../assets/css/game.sass"

.game-container
  @apply py-5 mx-auto box-border
  max-width: 85.375rem
  padding-top: 1.25rem
  +phone-width
    padding-top: 1.25rem
  .game-row
    @apply grid grid-cols-5 gap-5 mb-5
    padding: .625rem
    +pad-width
      @apply grid-cols-5
    +phone-width
      @apply grid-cols-4
    +iphone-width
      @apply grid-cols-2
</style>
