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
        <!-- 以 div + q-menu 取代 q-select，避免手機板 q-select 彈窗 behavior 判定造成的延遲，外觀維持不變 -->
        <div class="custom-select select-trigger" role="button" tabindex="0">
          <div class="select-trigger__selected flex flex-row align-center w-[13.75rem] phone:w-auto">
            <img
              v-if="selectedProduct"
              :src="getProductTabImage({ ...selectedProduct, siteKey: 'set_r017' })"
              :class="cx('provider-img', 'w-auto')"
              :alt="String(selectedProductCode)"
              loading="lazy"
              @error="setDefaultProductTabImg"
            />
            <q-item-label class="ml-3">
              {{ selectedProduct?.product_name }}
            </q-item-label>
          </div>
          <q-icon name="arrow_drop_down" class="select-trigger__icon" />
          <q-menu
            fit
            anchor="bottom left"
            self="top left"
            :offset="[0, 4]"
            class="no-text-select"
            :style="{ backgroundColor: '#1d125d', color: '#fff' }"
          >
            <q-list>
              <q-item
                v-for="opt in productCodeOption"
                :key="opt.value"
                clickable
                v-close-popup
                :style="opt.value === selectedProductCode ? { background: 'rgba(255, 255, 255, 0.12)' } : undefined"
                @click="selectProductCode(opt.value)"
              >
                <q-item-section avatar>
                  <img
                    :src="getProductTabImage({ product_code: opt.value, siteKey: 'set_r017' })"
                    :class="cx('provider-img', 'w-auto')"
                    :alt="opt.value"
                    loading="lazy"
                    decoding="async"
                    width="60"
                    height="20"
                    @error="setDefaultProductTabImg"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </div>
      <div class="filter-box">
        <q-img :src="svgIcon('filter')" loading="lazy" class="icon-style w-5 h-5"></q-img>
        <span>{{ $t("common.sort_label") }}</span>
        <!-- 與產品篩選一致：div + q-menu 取代 q-select -->
        <div class="custom-select select-trigger" role="button" tabindex="0">
          <div class="select-trigger__selected">
            <q-item-label>
              {{ gameTagList.find((item) => item.value === gameSearchType)?.label }}
            </q-item-label>
          </div>
          <q-icon name="arrow_drop_down" class="select-trigger__icon" />
          <q-menu
            fit
            anchor="bottom left"
            self="top left"
            :offset="[0, 4]"
            class="no-text-select"
            :style="{ backgroundColor: '#1d125d', color: '#fff' }"
          >
            <q-list>
              <q-item
                v-for="opt in gameTagList"
                :key="opt.value"
                clickable
                v-close-popup
                :style="opt.value === gameSearchType ? { background: 'rgba(255, 255, 255, 0.12)' } : undefined"
                @click="gameSearchType = opt.value"
              >
                <q-item-section>
                  <q-item-label>{{ opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
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
                  @click="
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
  </div>
</template>

<script setup lang="ts">
import GameBanner from "app/template/set_r017/components/Banner/GameBanner.vue"
import GameTab from "app/template/set_r017/components/Tab/GameTab.vue"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
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
import { useAuth } from "src/common/hooks/useAuth"
import { useEventBus } from "src/common/hooks/useEventBus"
import { cx } from "src/common/utils/cx"

const route = useRoute()
const router = useRouter()
const { gameTagList, getProductTabImage, openGame, getGameImage } = useGame()
const { setDefaultGameImg } = useCommonImg()
const { isDesktop } = useMediaQuery()
const { isLogin } = useAuth()
const { eventEmit } = useEventBus()
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

  // 未登入時，點擊直接跳出登入彈窗，不疊加顯示 Play 按鈕
  if (!isLogin.value) {
    eventEmit("openLogin", true)
    return
  }

  // 在手機版時，點擊遊戲圖片來切換按鈕顯示
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
@import "app/template/set_r017/assets/css/_variable.scss";
@import "app/template/set_r017/assets/css/form.scss";
@import "app/template/set_r017/assets/css/common.scss";
@import "app/template/set_r017/assets/css/game.scss";
@import "app/template/set_r017/assets/css/button.scss";

// select 共用樣式
.custom-select {
  background-color: #1b0059;
  border-radius: 6px;
  color: white;
  height: 40px;
  display: flex;
  align-items: center;
  // 移除 iOS Safari 對 tap 的延遲（300ms double-tap zoom）+ 禁用 long-press 選字
  touch-action: manipulation;
  -webkit-touch-callout: none;

  :deep(.q-field__control),
  :deep(.q-field__native),
  :deep(.q-field__append),
  :deep(.q-field__prepend) {
    touch-action: manipulation;
  }

  // readonly input 在 iOS 仍會被 focus；font-size < 16px 會誘發頁面 zoom 探測，補齊到 16px 避免延遲
  :deep(input) {
    font-size: 16px;
  }
  // 移除 iOS Safari 觸控決策延遲 (~300ms)，讓 tap 立即觸發
  touch-action: manipulation;

  :deep(.q-field__control) {
    height: 40px;
    min-height: 40px;
    padding: 0 10px;
    font-size: 14px;
    color: white;
    display: flex;
    align-items: center;
    border-radius: 4px;
    border: 2px solid $neutral04;
    background: $secondary06;
    /* input陰影 */
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    // 確保內層元素也套用，避免事件目標是子元素時被父層的決策邏輯接管
    touch-action: manipulation;
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
    color: white;
    span {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }

  :deep(.q-select__dropdown-icon) {
    color: white;
  }
}

// div + q-menu 版下拉觸發器，外觀對齊原 q-select 的 .q-field__control
.select-trigger {
  position: relative;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 14px;
  border-radius: 4px;
  border: 2px solid $neutral04;
  background: $secondary06;
  /* input陰影 */
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);

  .select-trigger__selected {
    display: flex;
    align-items: center;
    height: 40px;
    color: white;
  }

  .select-trigger__icon {
    flex-shrink: 0;
    color: white;
    font-size: 24px;
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
    border: 1px solid #454545;
    background: #0a0a0a;
    margin-bottom: 2rem;
    :deep(.q-field__inner) {
      padding: 0 1rem;
      .q-field__prepend {
        filter: brightness(0) invert(1);
      }
      .q-field__native {
        color: $neutral01;
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
