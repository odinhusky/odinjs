<template>
  <CarouselBanner />
  <div class="game-container">
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
              class="w-full h-auto cursor-pointer rounded-lg"
              loading="lazy"
              decoding="async"
              @error="setDefaultGameImg"
            />
            <q-btn class="btn-play">{{ $t("game.play_now") }}</q-btn>
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
import { useCommonImg } from "src/common/hooks/useCommonImg"
import CarouselBanner from "src/common/components/banner/CarouselBanner.vue"
import { useBanner } from "src/common/composables/useBanner"
import { useGameLobbyVirtualScroll } from "src/common/composables/useGameLobbyVirtualScroll"
import { useProviderGameLobby } from "src/common/composables/useProviderLobby"
import { useGame } from "src/common/composables/useGame"
import { useProviderGameLobbyRoute } from "src/common/composables/useProviderGameLobbyRoute"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { BANNER_POSITION, GAME_TYPE } from "src/common/utils/constants"
import { watchEffect, computed } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const { handleBannerList } = useBanner()
const { openGame, getGameImage } = useGame()
const { setDefaultGameImg } = useCommonImg()
const { isDown, isDesktop } = useMediaQuery()

const { safeGameType, routeIntegrationId, routeProductCode } = useProviderGameLobbyRoute(route, router)
const gameType = safeGameType

// 對齊 CSS：7 → pad 5 → phone 4 → iphone 2
const rowItemsCount = computed(() => {
  if (isDown.iphone) return 2
  if (isDown.phone) return 4
  if (isDown.pad) return 5
  return 7
})

const { showGameList } = useProviderGameLobby(router, safeGameType, { routeIntegrationId, routeProductCode })

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

watchEffect(() => {
  if (gameType.value) {
    getBanner()
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

.game-container
  @apply py-5 mx-auto box-border
  max-width: 85.375rem
  :deep(.carousel)
    .banner-item
      width: 100vw
  .game-row
    @apply grid grid-cols-7 gap-1 mb-1
    background: linear-gradient(to right,#D72F2F 0%,#410000 100%)
    border-radius: .9375rem
    border: 1px solid #D14444
    padding: .625rem
    +pad-width
      @apply grid-cols-5
    +phone-width
      @apply grid-cols-4
    +iphone-width
      @apply grid-cols-2
    .game-item
      @apply w-full h-full relative cursor-pointer
      aspect-ratio: 1/1
      background: #410000
      border-radius: .9375rem
      border: 1px solid #D14444
      padding: .625rem
      &:before
        position: absolute
        bottom: 0
        left: 0
        right: 0
        top: 100%
        content: ''
        background-color: rgba(0, 0, 0, 0.8)
        -webkit-transition: all 0.25s ease
        transition: all 0.25s ease
        -webkit-transition-delay: 0.25s
        transition-delay: 0.25s
        border-radius: 1.875rem
      &:hover:before
        top:0
        transition-delay: inherit
        border-radius: 15px
        background-color: #0009
      &:hover
        .btn-play
          opacity: 1
          top: 50%
          transition-delay: 0.3s
      *
        -webkit-box-sizing: border-box
        box-sizing: border-box
        -webkit-transition: all 0.25s ease
        transition: all 0.25s ease
      .btn-play
        width: 7.5rem
        color: #fff
        padding: .625rem 0
        font-size: .875rem
        font-weight: 700
        text-transform: uppercase
        background: linear-gradient(180deg, #f5e386 0%, #9c7c24 100%)
        box-shadow: inset 0 0 .3125rem #fff
        border: none
        border-radius: 1.25rem
        position: absolute
        left:50%
        transform: translate(-50%, -50%)
        top: 30%
        opacity: 0
        transition-delay: inherit
</style>
