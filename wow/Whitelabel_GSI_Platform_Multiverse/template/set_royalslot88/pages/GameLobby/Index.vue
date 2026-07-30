<template>
  <div class="lobby_wrap lobby_wrap_slot">
    <div class="lobby_body_wrap">
      <div class="slots_inner_lobby_wrap_scroll">
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
            <div :key="`game-row-${index}`" class="slots_inner_lobby_wrap">
              <div v-for="game in gameRow" :key="game.game_id" class="game_wrap">
                <a
                  @click="openGame(game.integration_id, game.product_code, game.game_code, gameType, true)"
                  class="cursor-pointer"
                >
                  <img
                    :src="getGameImage(game)"
                    :alt="game.game_code"
                    class="rounded-[5px]"
                    loading="lazy"
                    decoding="async"
                    @error="setDefaultGameImg"
                  />
                  <div class="game-preview__hover">
                    <div class="game-preview__btn-play">{{ $t("game.play_now") }}</div>
                  </div>
                </a>
                <div class="slots_lobbyname overflow-hidden whitespace-nowrap text-ellipsis">{{ game.game_name }}</div>
              </div>
            </div>
          </template>
        </q-virtual-scroll>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "GameLobby"
}
</script>
<script lang="ts" setup>
import { onMounted, onUnmounted, computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useBanner } from "src/common/composables/useBanner"
import { useGameLobbyVirtualScroll } from "src/common/composables/useGameLobbyVirtualScroll"
import { useProviderGameLobby } from "src/common/composables/useProviderLobby"
import { useGame } from "src/common/composables/useGame"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useProviderGameLobbyRoute } from "src/common/composables/useProviderGameLobbyRoute"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { BANNER_POSITION, GAME_TYPE } from "src/common/utils/constants"

const route = useRoute()
const router = useRouter()
const { handleBannerList } = useBanner()
const { openGame, getGameImage } = useGame()
const { setDefaultGameImg } = useCommonImg()
const { isDesktop } = useMediaQuery()

const { safeGameType, routeIntegrationId, routeProductCode } = useProviderGameLobbyRoute(route, router)
const gameType = safeGameType


const { showGameList } = useProviderGameLobby(router, safeGameType, { routeIntegrationId, routeProductCode })

// 對齊 CSS pad-portrait：portrait 且 ≤999 → 3，其餘 7
const isPadPortrait = ref(false)
let padPortraitMedia: MediaQueryList | null = null
function syncPadPortrait() {
  isPadPortrait.value = padPortraitMedia?.matches ?? false
}

const rowItemsCount = computed(() => (isPadPortrait.value ? 3 : 7))

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

onMounted(() => {
  padPortraitMedia = window.matchMedia("(orientation: portrait) and (max-width: 999px)")
  syncPadPortrait()
  padPortraitMedia.addEventListener("change", syncPadPortrait)
  getBanner()
})

onUnmounted(() => {
  padPortraitMedia?.removeEventListener("change", syncPadPortrait)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.lobby_wrap {
  .slots_inner_lobby_wrap {
    @apply grid-cols-7;

    @include pad-portrait {
      @apply grid-cols-3;
    }
  }
}
</style>
