<template>
  <GameBanner />
  <div class="game-lobby-wrapper" :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`" @click="handleWrapperClick">
    <q-input
      v-model.trim="searchKeyword"
      borderless
      class="game-search-input"
      :placeholder="$t('placeholder.searchGame')"
    >
      <template #prepend>
        <q-img :src="svgIcon('game-search')" loading="lazy" class="icon-style w-5 h-5"></q-img>
      </template>
    </q-input>
    <div class="game-filter-item">
      <div class="filter-box">
        <q-img :src="svgIcon('filter')" loading="lazy" class="icon-style w-5 h-5"></q-img>
        <span>{{ $t("common.filter_label") }}</span>
        <q-select
          outlined
          :model-value="selectedProductCode"
          :options="productCodeOption"
          class="custom-select"
          color="white"
          :popup-content-style="{
            backgroundColor: '#191E2D',
            color: '#fff'
          }"
          emit-value
          map-options
          @update:model-value="selectProductCode"
        >
          <template v-slot:selected>
            <div class="flex flex-row align-center w-[13.75rem] phone:w-auto">
              <img
                v-if="selectedProduct"
                :src="getProductTabImage({ ...selectedProduct, siteKey: 'set_r030' })"
                :class="cx('provider-img', 'w-auto')"
                :alt="String(selectedProductCode)"
                @error="setDefaultProductTabImg"
              />
              <q-item-label class="ml-3">
                {{ selectedProduct?.product_name }}
              </q-item-label>
            </div>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" :key="scope.opt.value">
              <q-item-section avatar>
                <img
                  :src="getProductTabImage({ product_code: scope.opt.value, siteKey: 'set_r030' })"
                  :class="cx('provider-img', 'w-auto')"
                  :alt="scope.opt.value"
                  @error="setDefaultProductTabImg"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="filter-box">
        <q-img :src="svgIcon('filter')" loading="lazy" class="icon-style w-5 h-5"></q-img>
        <span>{{ $t("common.sort_label") }}</span>
        <q-select
          outlined
          v-model="gameSearchType"
          :options="gameTagList"
          class="custom-select"
          emit-value
          map-options
          color="white"
          :popup-content-style="{
            backgroundColor: '#191E2D',
            color: '#fff'
          }"
        />
      </div>
    </div>
    <div class="game-tab scrollX mb-[1.25rem]">
      <GameTab />
    </div>
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
          <li v-for="game in gameRow" :key="game.game_id" class="game-item">
            <div class="img-container">
              <img
                :src="getGameImage(game)"
                :alt="game.game_code"
                class="game-img"
                loading="lazy"
                decoding="async"
                @error="setDefaultGameImg"
                @click="handleGameClick(game.game_id, $event)"
              />
              <!-- 已經收藏平常就要顯示 -->
              <q-btn
                v-if="isGameFavorited(game)"
                class="btn-favorite hide-hover"
                round
                flat
                @click="removeFavorite(game, true)"
              >
                <img :src="svgIcon('heart-btn-active')" alt="" />
              </q-btn>
              <div class="play-btn-container" :class="{ show: selectedGameId === game.game_id && !isDesktop }">
                <q-btn
                  class="btn-play hide-hover"
                  @click="openGame(game.integration_id, game.product_code, game.game_code, gameType, true)"
                >
                  {{ $t("game.play_now") }}
                </q-btn>
                <!-- 還沒收藏，hover才顯示 -->
                <q-btn
                  v-if="!isGameFavorited(game)"
                  class="btn-favorite hide-hover"
                  round
                  flat
                  @click="addFavorite(game, true)"
                >
                  <img :src="svgIcon('heart-btn')" alt="" />
                </q-btn>
              </div>
            </div>

            <div class="hot-tag">
              <img v-if="game.hot" :src="hotTagImg" loading="lazy" decoding="async" />
              <img v-if="game.newly" :src="newTagImg" loading="lazy" decoding="async" />
            </div>

            <div class="title-container">
              <div class="game-name">{{ game.game_name }}</div>
            </div>
          </li>
        </ul>
      </template>
    </q-virtual-scroll>
    <!-- 最新得獎跑馬燈 -->
    <RankBoard class="rank-board" />
  </div>
</template>

<script setup lang="ts">
import GameBanner from "app/template/set_r030/components/Banner/GameBanner.vue"
import RankBoard from "app/template/set_r030/components/Carousel/RankBoard.vue"
import GameTab from "app/template/set_r030/components/Tab/GameTab.vue"
import { useSiteImg } from "app/template/set_r030/hooks/useSiteImg"
import { useGameLobbyVirtualScroll } from "src/common/composables/useGameLobbyVirtualScroll"
import { useProviderGameLobby } from "src/common/composables/useProviderLobby"
import { useGame } from "src/common/composables/useGame"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useProviderGameLobbyRoute } from "src/common/composables/useProviderGameLobbyRoute"
import { AI_HELPER_EVENT_ROUTES, GAME_TYPE } from "src/common/utils/constants"
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { cx } from "src/common/utils/cx"

const route = useRoute()
const router = useRouter()
const { gameTagList, getProductTabImage, openGame, getGameImage } = useGame()
const { setDefaultGameImg } = useCommonImg()
const { isDesktop } = useMediaQuery()
const { svgIcon, hotTagImg, newTagImg, setDefaultProductTabImg } = useSiteImg()
const { handleAIHelperRouteEvent } = useAIHelperEvent()

const { safeGameType, routeIntegrationId, routeProductCode } = useProviderGameLobbyRoute(route, router)
const gameType = safeGameType


const {
  selectedProductCode,
  selectedProduct,
  productCodeOption,
  searchKeyword,
  showGameList,
  selectProductCode,
  isGameFavorited,
  addFavorite,
  removeFavorite,
  gameSearchType,
} = useProviderGameLobby(router, safeGameType, { routeIntegrationId, routeProductCode })

const {
  virtualScrollRef,
  virtualRowHeight,
  virtualScrollSliceSize,
  virtualScrollSliceRatioBefore,
  virtualScrollSliceRatioAfter,
  resolvedVirtualScrollTarget,
  gameRows,
} = useGameLobbyVirtualScroll(showGameList, isDesktop)

const selectedGameId = ref<number | null>(null)

const handleGameClick = (gameId: number, event: Event) => {
  event.stopPropagation()

  if (!isDesktop.value) {
    selectedGameId.value = selectedGameId.value === gameId ? null : gameId
  }
}

const handleWrapperClick = (event: Event) => {
  const target = event.target as HTMLElement
  if (target.closest(".img-container")) {
    return
  }
  selectedGameId.value = null
}

onMounted(() => {
  handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.GAME_LOBBY)
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r030/assets/css/_variable.scss";
@import "app/template/set_r030/assets/css/form.scss";
@import "app/template/set_r030/assets/css/common.scss";
@import "app/template/set_r030/assets/css/game.scss";
@import "app/template/set_r030/assets/css/button.scss";

// select 共用樣式
.custom-select {
  background-color: var(--bg-04);
  border-radius: 6px;
  color: var(--text-01);
  height: 40px;
  display: flex;
  align-items: center;

  :deep(.q-field__control) {
    height: 40px;
    min-height: 40px;
    padding: 0 10px;
    font-size: 14px;
    color: var(--text-01);
    display: flex;
    align-items: center;
    border-radius: 4px;
    border: 2px solid var(--bg-line-02);
    background: #161F2B;
    /* input陰影 */
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  }

  :deep(.q-field__append) {
    height: 40px;
    min-height: 40px;
  }

  :deep(.q-field__native),
  :deep(.q-placeholder) {
    line-height: 40px;
    min-height: 40px;
    height: 40px;
    color: var(--text-01);
    span {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }

  :deep(.q-select__dropdown-icon) {
    color: var(--text-01);
  }
}

.provider-img {
  width: 3.75rem;
  height: 1.25rem;
}

.game-banner-wrapper {
  width: 100%;
  :deep(.game-banner-content) {
    width: 70vw;
    height: auto;
    max-width: 75rem;
    @include phone-width {
      width: 90%;
    }
  }
}

.game-lobby-wrapper {
  width: 100%;
  height: auto;
  max-width: 75rem;
  margin: 1.5rem auto 1.5rem;
  @include phone-width {
    width: 90%;
  }

  @media (min-width: 769px) {
    .game-tab {
      width: 100%;
      max-width: 100%;
    }
  }

  .game-banner-content {
    margin: 1.5rem auto 1.5rem;
  }

  .game-search-input {
    border-radius: 999px;
    border: 1px solid var(--bg-line-01);
    background: var(--color-black-deep-black);
    margin-bottom: 2rem;
    :deep(.q-field__inner) {
      padding: 0 1rem;
      .q-field__prepend {
        filter: brightness(0) invert(1);
      }
      .q-field__native {
        color: var(--text-01);
      }
    }
  }
}

.game-filter-item {
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .filter-box {
    color: $neutral01;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    span {
      margin: 0 0.5rem;
    }

    @include phone-width {
      padding: 0;
      span {
        display: none;
      }
      :deep(.q-img) {
        display: none;
      }
    }
  }
}

.game-row {
  width: 100%;
  @apply grid grid-cols-6 gap-6 mb-6;

  .hot-tag {
    position: absolute;
    left: -8%;
    top: 3%;
    z-index: 10;
    width: 71px;
    height: auto;
  }

  @include phone-width {
    @apply grid-cols-3;
    gap: 1rem;

    .hot-tag {
      left: -6%;
    }
  }

  .title-container {
    @include phone-width {
      width: 100%;
      text-align: center;
      margin-top: 0.375rem;
    }

    .game-name {
      @include phone-width {
        padding: 0;
      }
    }
  }
}
</style>
