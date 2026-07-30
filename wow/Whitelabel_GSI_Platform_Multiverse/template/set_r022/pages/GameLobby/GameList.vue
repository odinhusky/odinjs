<template>
  <section class="game-list-container">
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
        <ul :key="`game-row-${index}`" class="game-row">
          <li v-for="game in gameRow" :key="game.game_id" class="game-item" @click="handleGameClick(game)">
            <div class="img-container">
              <img
                :src="getGameImage(game)"
                :alt="game.game_code"
                class="game-img"
                loading="lazy"
                decoding="async"
                @error="setDefaultGameImg"
              />
              <q-btn
                v-if="isGameFavorited(game)"
                class="btn-favorite hide-hover"
                round
                flat
                @click.stop="removeFavorite(game, true)"
              >
                <img :src="svgIcon('heart-btn-active')" alt="" />
              </q-btn>
              <q-btn v-else class="btn-favorite hide-hover" round flat @click.stop="addFavorite(game, true)">
                <img :src="svgIcon('heart-btn')" alt="" />
              </q-btn>
              <!-- PC版顯示 play button -->
              <div v-if="isDesk" class="play-btn-container">
                <q-btn
                  class="btn-play hide-hover"
                  @click.stop="
                    openGame(
                      game.integration_id,
                      game.product_code,
                      game.game_code,
                      gameType,
                      true,
                      undefined,
                      undefined,
                      false,
                      undefined,
                      game.support_currency
                    )
                  "
                >
                  {{ $t("game.play_now") }}
                </q-btn>
              </div>
            </div>

            <div class="hot-tag">
              <img v-if="game.hot" :src="hotTagImg" loading="lazy" decoding="async" />
              <img v-if="game.newly" :src="newTagImg" loading="lazy" decoding="async" />
            </div>

            <div class="game-name">{{ game.game_name }}</div>
            <div class="game-favorites">
              <img :src="svgIcon('heart-collet')" :alt="game.game_name" />
              <span> {{ formatNumberKM(game.favorite_count) }} </span>
            </div>
          </li>
        </ul>
      </template>
    </q-virtual-scroll>
    <div v-else class="no-data-container">
      <img v-if="getWideLogo" :src="getWideLogo()" alt="no data" />
      <span>{{ $t("tableHeader.no_data") }}</span>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { SearchGameKey } from "app/template/set_r022/utils/constants/symbols"
import { useGameLobbyVirtualScroll } from "src/common/composables/useGameLobbyVirtualScroll"
import { useGame } from "src/common/composables/useGame"
import { useLogo } from "src/common/composables/useLogo"
import { useCommon } from "src/common/hooks/useCommon"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { openGame, getGameImage } = useGame()
const searchGame = inject(SearchGameKey)
if (!searchGame) {
  throw new Error("searchGame is not provided")
}
const { showGameList, isGameFavorited, addFavorite, removeFavorite, gameType } = searchGame
const { svgIcon, hotTagImg, newTagImg } = useSiteImg()
const { formatNumberKM } = useCommon()
const { getWideLogo } = useLogo()
const { setDefaultGameImg } = useCommonImg()
const { isDesk, isUp } = useMediaQuery()

// isUp 為 reactive，屬性已自動解包；不可再取 .value（會變成 undefined）
const isGameGridDesktop = computed(() => isUp.padLg)

const {
  virtualScrollRef,
  virtualRowHeight,
  virtualScrollSliceSize,
  virtualScrollSliceRatioBefore,
  virtualScrollSliceRatioAfter,
  resolvedVirtualScrollTarget,
  gameRows
} = useGameLobbyVirtualScroll(showGameList, isGameGridDesktop, {
  desktopRowItemsCount: 6,
  mobileRowItemsCount: 2
})

const handleGameClick = (game: (typeof showGameList.value)[number]) => {
  if (!isDesk.value) {
    openGame(
      game.integration_id,
      game.product_code,
      game.game_code,
      gameType.value,
      true,
      undefined,
      undefined,
      false,
      undefined,
      game.support_currency
    )
  }
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.game-list-container {
  .game-row {
    @apply grid grid-cols-6 gap-4 mb-4;

    @include pad-large-width {
      @apply grid-cols-2;
    }
  }
}

.game-item {
  @apply w-full h-auto relative rounded-xl cursor-pointer;
  background: var(--neutral-01);

  .img-container {
    @apply rounded-xl relative overflow-hidden w-full h-auto;

    .game-img {
      @apply w-full h-full relative overflow-hidden z-0;
    }

    .play-btn-container {
      @apply absolute top-0 right-0 bottom-0 left-0 z-10 rounded-xl hidden;
      background: rgba(var(--black-01-rgb), 0.5);
    }

    .btn-favorite {
      @apply absolute z-20 top-2 right-2 min-w-0 min-h-0;

      img {
        @apply w-6 h-6;

        @include pad-large-width {
          @apply w-4 h-4;
        }
      }
    }
  }

  .hot-tag {
    @apply absolute z-10 w-[4.4375rem] h-[3.125rem];
    left: -5%;
    top: 9%;
  }

  .game-name {
    @apply w-full text-left overflow-hidden whitespace-nowrap text-ellipsis;
    font-size: 14px;
    line-height: 14px;
    font-weight: 700;
    padding: 0.75rem 0.625rem 0.5rem 0.625rem;
    color: var(--secondary-01);

    @include pad-large-width {
      font-size: 12px;
      line-height: 12px;
    }
  }

  .game-favorites {
    @apply flex items-center gap-2 mt-1 text-left;
    @apply text-base;
    color: var(--primary-02);
    padding: 0 0.625rem 0.5rem 0.625rem;

    img {
      @apply w-4 h-4;
    }
  }

  &:hover {
    .play-btn-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.btn-play {
  @apply capitalize z-20;
  padding: 0.5rem 1.875rem;
  background: var(--primary-01);
  color: var(--text-01);
  border-radius: 2.375rem;
  font-style: normal;
  font-weight: 510;
  font-size: 0.875rem;
  line-height: 1.0625rem;

  :deep(.q-btn__content) {
    @apply whitespace-nowrap;
  }
}

.no-data-container {
  @apply flex flex-col justify-center items-center w-full my-8;
  img {
    @apply w-48 h-auto mb-4;
  }
  span {
    @apply text-lg;
    color: var(--primary-01);
  }
}
</style>
