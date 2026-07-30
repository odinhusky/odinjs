<template>
  <div class="game-lobby-wrapper w-full flex justify-center items-center">
    <GameBanner :isNeedMaxWidth="false" />
  </div>

  <MobileNav />

  <div class="game-lobby-wrapper w-full">
    <div class="provider-container" :class="`${isMobile ? 'h5' : 'pc'}`">
      <div class="provider-title">
        <p class="item-desc">{{ $t("home.entertaining") }}</p>
        <h3 class="title">
          <span> {{ $t("home.game") }} </span> {{ $t(gameTypeTitleKey) }}
        </h3>
      </div>

      <!-- Provider List 替換 swiper -->
      <ProviderList
        :product-list="productList"
        :selected-product-code="selectedProductCode"
        @select-product-code="selectProductCode"
      />
    </div>
  </div>

  <div class="game-lobby-wrapper w-full">
    <div v-if="isMobile" class="game-container h5">
      <div class="search-container">
        <div class="tabs">
          <q-btn
            v-for="tag in gameTagList"
            :key="`tag-${tag.value}`"
            flat
            class="hide-hover btn-tag"
            :class="{ active: gameSearchType === tag.value }"
            @click="gameSearchType = tag.value"
            :disable="gameSearchType === tag.value"
          >
            <q-icon :name="tag.icon" class="mr-2"></q-icon>
            {{ tag.label }}
          </q-btn>
        </div>
        <q-input
          v-model.trim="searchKeyword"
          borderless
          clearable
          clear-icon="close"
          class="search-input"
          :placeholder="$t('placeholder.searchGame')"
        >
          <template #append> <q-icon name="search" /> </template
        ></q-input>
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
            <li
              v-for="game in gameRow"
              :key="game.game_id"
              class="game-item"
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
              <div class="img-container">
                <img
                  :src="getGameImage(game)"
                  :alt="game.game_code"
                  class="game-img"
                  loading="lazy"
                  decoding="async"
                  @error="setDefaultGameImg"
                />

                <!-- 收藏按鈕改為總是顯示在右上方 -->
                <div :class="cx('favorite-container', { 'pr-2': game.favorite_count > 0 })">
                  <div class="favorite-icon-container">
                    <div
                      v-if="isGameFavorited(game)"
                      class="btn-favorite-icon btn-favorite-active"
                      @click.stop="removeFavorite(game, true)"
                    >
                      <img class="rounded-full" :src="svgIcon('heart-btn-active')" alt="" />
                    </div>

                    <div
                      v-else
                      class="btn-favorite-icon btn-favorite-unactive"
                      @click.stop="addFavorite(game, true)"
                    >
                      <img class="rounded-full" :src="svgIcon('heart-btn')" alt="" />
                    </div>

                    <div class="btn-favorite-icon-dummy btn-favorite-unactive">
                      <img class="rounded-full" :src="svgIcon('heart-btn')" alt="" />
                    </div>
                  </div>

                  <!-- 有收藏才顯示 -->
                  <span v-if="game.favorite_count > 0" class="favorite-count-span">{{
                    formatNumberKM(game.favorite_count)
                  }}</span>
                </div>
              </div>

              <div class="hot-tag">
                <img v-if="game.hot" :src="hotTagImg" />
                <img v-if="game.newly" :src="newTagImg" />
              </div>

              <div class="game-name">{{ game.game_name }}</div>
            </li>
          </ul>
        </template>
      </q-virtual-scroll>

      <div v-else class="no-data-container no-data">
        <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
        <span>{{ $t("tableHeader.no_data") }}</span>
      </div>
      <FooterNav />
    </div>

    <div v-else class="game-container pc">
      <div class="search-container">
        <div class="tabs">
          <swiper :slides-per-view="4" :space-between="16">
            <swiper-slide v-for="tag in gameTagList" :key="`tag-${tag.value}`" :name="tag.value">
              <q-btn
                flat
                class="hide-hover btn-tag"
                :class="{ active: gameSearchType === tag.value }"
                @click="gameSearchType = tag.value"
                :disable="gameSearchType === tag.value"
              >
                {{ tag.label }}
              </q-btn>
            </swiper-slide>
          </swiper>
        </div>
        <q-input
          v-model.trim="searchKeyword"
          borderless
          clearable
          clear-icon="close"
          class="search-input"
          :placeholder="$t('placeholder.searchGame')"
        >
          <template #append> <q-icon name="search" /> </template>
        </q-input>
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
                />
                <!-- 收藏按鈕改為總是顯示在右上方 -->
                <div :class="cx('favorite-container', { 'pr-2': game.favorite_count > 0 })">
                  <div class="favorite-icon-container">
                    <div
                      v-if="isGameFavorited(game)"
                      class="btn-favorite-icon btn-favorite-active"
                      @click.stop="removeFavorite(game, true)"
                    >
                      <img class="rounded-full" :src="svgIcon('heart-btn-active')" alt="" />
                    </div>

                    <div
                      v-else
                      class="btn-favorite-icon btn-favorite-unactive"
                      @click.stop="addFavorite(game, true)"
                    >
                      <img class="rounded-full" :src="svgIcon('heart-btn')" alt="" />
                    </div>

                    <div class="btn-favorite-icon-dummy btn-favorite-unactive">
                      <img class="rounded-full" :src="svgIcon('heart-btn')" alt="" />
                    </div>
                  </div>

                  <span v-if="game.favorite_count > 0" class="favorite-count-span">{{
                    formatNumberKM(game.favorite_count)
                  }}</span>
                </div>

                <!-- hover才顯示 -->
                <div class="play-btn-container">
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
                </div>
              </div>

              <div class="hot-tag">
                <img v-if="game.hot" :src="hotTagImg" />
                <img v-if="game.newly" :src="newTagImg" />
              </div>

              <div class="title-container">
                <span class="game-name">{{ game.game_name }}</span>
              </div>
            </li>
          </ul>
        </template>
      </q-virtual-scroll>
      <div v-else class="no-data-container no-data">
        <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
        <span>{{ $t("tableHeader.no_data") }}</span>
      </div>
      <!-- 最新得獎跑馬燈 -->
      <!-- 先隱藏 -->
      <!-- <FeatureLiveCasino /> -->
    </div>
  </div>
  <RankBoard class="mx-auto my-6 rank-board" />

  <FooterArea v-if="!isMobile" />
</template>
<script lang="ts">
export default {
  name: "GameLobby",
}
</script>
<script lang="ts" setup>
import { computed, onMounted, toRef } from "vue"
import GameBanner from "app/template/okbet/components/Banner/GameBanner.vue"
import RankBoard from "app/template/okbet/components/Carousel/RankBoard.vue"
import FooterArea from "app/template/okbet/components/Footer/Index.vue"
import MobileNav from "app/template/okbet/components/MobileNav.vue"
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import { useBanner } from "src/common/composables/useBanner"
import { useGameLobbyVirtualScroll } from "src/common/composables/useGameLobbyVirtualScroll"
import { useProviderGameLobby } from "src/common/composables/useProviderLobby"
import { useGame } from "src/common/composables/useGame"
import { useLogo } from "src/common/composables/useLogo"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { useCommon } from "src/common/hooks/useCommon"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useProviderGameLobbyRoute } from "src/common/composables/useProviderGameLobbyRoute"
import { AI_HELPER_EVENT_ROUTES, BANNER_POSITION, GAME_TYPE } from "src/common/utils/constants"
import "swiper/css"
import { Swiper, SwiperSlide } from "swiper/vue"
import { useRoute, useRouter } from "vue-router"
import FooterNav from "../../components/Footer/FooterNav.vue"
import { cx } from "src/common/utils/cx"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import ProviderList from "app/template/okbet/components/ProviderList/index.vue"

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "padXl")
const isDesktop = computed(() => !isMobile.value)

// 對齊 CSS .game-row 欄位數：
// PC: >1900 → 6 / ≤1900 → 5 / ≤1600 → 4
// H5: ≤1440 → 4 / ≤768 → 3
const rowItemsCount = computed(() => {
  if (isMobile.value) return isDown.phone ? 3 : 4
  if (isDown.pcXl) return 4
  if (isDown.pc2xl) return 5
  return 6
})

const route = useRoute()
const router = useRouter()
const { handleBannerList } = useBanner()
const { gameTagList, openGame, getGameImage } = useGame()
const { svgIcon, hotTagImg, newTagImg } = useSiteImg()
const { setDefaultGameImg } = useCommonImg()
const { formatNumberKM } = useCommon()
const { getWideLogo } = useLogo()
const { handleAIHelperRouteEvent } = useAIHelperEvent()

const { safeGameType, routeIntegrationId, routeProductCode } = useProviderGameLobbyRoute(route, router)
const gameType = safeGameType


const {
  selectedProductCode,
  productList,
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
} = useGameLobbyVirtualScroll(showGameList, isDesktop, {
  rowItemsCount,
  desktopSliceSize: 6,
  mobileSliceSize: 4,
  desktopRowHeight: 300,
  mobileRowHeight: 300,
})

const gameTypeTitleKey = computed(() => {
  const key = GAME_TYPE.I18nKeys[gameType.value as GAME_TYPE.Enums]
  return key || "home.providers"
})

async function getBanner() {
  await handleBannerList(BANNER_POSITION.Enums.ProductLobby, gameType.value)
}

onMounted(async () => {
  handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.GAME_LOBBY)
  await getBanner()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";
@import "app/template/okbet/assets/css/game.scss";
@import "app/template/okbet/assets/css/button.scss";
@import "app/template/okbet/assets/css/data.scss";

.game-lobby-wrapper {
  width: 100%;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  max-width: 1400px;
  padding-left: 0;
  padding-right: 0;

  // 1000px–1439px: container width 923px
  @media (max-width: 1439px) and (min-width: 1000px) {
    max-width: 923px;
  }

  // < 992px: don't limit width; padding 20px
  @media (max-width: 991px) {
    max-width: none;
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  // < 768px: don't limit width; padding 8px
  @media (max-width: 767px) {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
}

.provider-container {
  @include setFlex;
  // max-width: 1200px;
  margin: 0px;
  flex-direction: column;

  &.pc {
    @apply w-full mb-6 mt-6;

    .provider-title {
      width: 100%;
    }

    .item-desc {
      font-family: OpenSans;
      font-style: normal;
      font-weight: 860;
      font-size: 0.75rem;
      line-height: 0.875rem;
      color: rgba($text-primary-color, 0.5);
      text-transform: uppercase;
    }

    .title {
      @apply relative mb-6;
      font-family: OpenSans;
      font-style: normal;
      font-size: 1.75rem;
      line-height: 2.0625rem;
      color: $text-night-sky-color;
      font-weight: 500;

      span {
        color: $primary-color;
        font-weight: 860;
      }
    }

    .swiper {
      width: 100%;

      .swiper-slide {
        width: 260px;
        height: 100px;
        background: $background-light-color;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 auto;
        margin-left: 0;
        overflow: hidden;
        cursor: pointer;
      }

      .tab-img {
        width: 70%;
      }
    }
  }

  &.h5 {
    @apply pt-0 mt-3 md:mt-6 mb-6 iphone:mb-3 mx-0;
    @apply max-w-none;

    .item-desc {
      display: none;
    }

    .title {
      display: none;
    }

    .swiper {
      width: 100vw;
      @include iphone-width {
        max-width: 92vw;
      }

      .swiper-slide {
        width: auto;
        @apply w-auto h-[6.25rem] phone:h-20;

        background: $background-light-color;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 auto;
        margin-left: 0;
        overflow: hidden;
        cursor: pointer;
      }

      .tab-img {
        width: 200px;
      }
    }
  }
}

.hot-tag {
  position: absolute;
  left: -5%;
  top: 5%;
  z-index: 10;

  width: 71px;
  height: 50px;

  @media (max-width: 767px) {
    // Adjustments for iPhone width or similar small screens
    width: 50px;
    height: 35px;
    left: -7%;
    top: 3%;
  }
}

.game-container {
  @include setFlex;
  flex-direction: column;

  &.pc {
    margin: 1.5rem 2rem 8rem 1.5rem;
    // max-width: 1200px;
    width: 100%;
    margin: 0px;

    .search-container {
      width: 100%;
      @apply flex justify-end;

      .tabs {
        width: 100%;
        display: flex;
        flex: 1 1 0%;
        margin-bottom: 24px;
        margin-right: 20px;
        overflow-x: auto;
        border-radius: 16px;
        padding-bottom: 4px;

        .swiper {
          margin: 0;

          .swiper-slide {
            width: auto !important;

            .btn-tag {
              padding: 10px 20px;
              border-radius: 100px;
              border: 1px solid transparent;
              font-family: OpenSans;
              font-style: normal;
              font-weight: 400;
              font-size: 16px;
              line-height: 19px;
              margin-left: 0px;
              background: $background-light-color;
              color: $text-steel-blue-color;
              white-space: nowrap;
              flex: 0 0 auto;
              text-transform: none;
              transition: background 0.2s ease, border-color 0.2s ease;

              &:not(.active):hover {
                background: linear-gradient(#fff, #fff) padding-box,
                  linear-gradient(105.42deg, #0063ff 0%, #0295e8 52.88%, #aeceff 98.56%) border-box;
              }

              &.active {
                font-weight: 510;
                color: $text-light-color;
                background: $primary-color;
              }

              &.disabled {
                opacity: 1 !important;
              }
            }
          }
        }
      }

      .search-input {
        width: 13.75rem;
        height: 2.5rem;
        border-radius: 2.125rem;
        background: $background-light-color;

        :deep(.q-field__control) {
          height: 2.5rem;
          font-family: Roboto, Helvetica, Arial, sans-serif;
          font-weight: 400;
          font-size: 1rem;
          line-height: 1.4375em;
          letter-spacing: 0.00938em;
          color: rgba($text-dark-color, 0.87);
          box-sizing: border-box;
          cursor: text;
          display: inline-flex;
          align-items: center;
          position: relative;
          border-radius: 4px;
          padding-right: 0.875rem;

          input {
            color: $text-sky-gray-color;
            font-family: OpenSans;
            font-style: normal;
            font-weight: 400;
            font-size: 1rem;
            line-height: 1.1875rem;
            padding-left: 1.25rem;
          }

          .q-icon {
            color: $text-sky-gray-color;
          }
        }
      }
    }

    .game-row {
      width: 100%;
      @apply grid grid-cols-6 gap-3;
      @apply pt-0 pb-0;

      .hot-tag {
        position: absolute;
        left: -5%;
        top: 9%;
        z-index: 10;
        width: 71px;
        height: 50px;
      }

      @include pc-2xl-width {
        @apply grid-cols-5;
      }

      @include pc-xl-width {
        @apply grid-cols-4;
      }
    }
  }

  &.h5 {
    padding-bottom: 0rem;

    .search-container {
      @apply w-full;
      @apply flex justify-center items-center flex-wrap gap-6 iphone:gap-3;
      @apply rounded-lg overflow-hidden;

      .tabs {
        width: 100%;
        display: flex;
        overflow-x: auto;
        border-radius: 0.5rem;
        justify-content: space-between;

        .btn-tag {
          @apply rounded-lg;
          border: 1px solid transparent;
          width: 23.5%;
          padding: 5px 0;
          font-family: OpenSans;
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 19px;
          margin-left: 0px;
          background: $background-light-color;
          color: $text-steel-blue-color;
          white-space: nowrap;
          flex: 0 0 auto;
          text-transform: none;
          transition: background 0.2s ease, border-color 0.2s ease;

          &:not(.active):hover {
            background: linear-gradient(#fff, #fff) padding-box,
              linear-gradient(105.42deg, #0063ff 0%, #0295e8 52.88%, #aeceff 98.56%) border-box;
          }

          &.active {
            font-weight: 510;
            color: $text-light-color;
            background: $primary-color;
          }

          &.disabled {
            opacity: 1 !important;
          }
        }
      }

      .search-input {
        @apply w-full h-9 px-2 rounded-lg;
        background: $background-light-color;

        :deep(.q-field__control) {
          @apply h-9;
        }

        :deep(.q-field__marginal) {
          @apply h-9;

          .q-field__focusable-action {
            font-size: 14px;
            font-weight: bold;
            margin-right: 6px;
            color: $text-midnight-ocean-color;
            opacity: 1;
          }
        }
      }
    }

    .game-row {
      @apply w-full;
      @apply py-6 phone:pt-3 pb-0;
      @apply flex flex-wrap;
      @apply grid grid-cols-4 gap-x-[12px] gap-y-[16px];
      @apply phone:grid-cols-3;

      .hot-tag {
        width: 50px;
        height: 35px;
        left: -7%;
        top: 9%;
        position: absolute;
        z-index: 10;
      }

      .game-item {
        @apply w-full h-auto pb-2 rounded-lg;

        .img-container {
          @apply h-auto rounded-lg;

          img {
            @apply rounded-lg;
          }
        }

        .game-name {
          @apply mt-2;
          font-size: 12px;

          @media (min-width: 993px) {
            font-size: 16px;
          }

          text-align: center !important;
          // display: -webkit-box;
          // -webkit-box-orient: vertical;
          // -webkit-line-clamp: 2;
          // overflow: hidden;
          // white-space: unset;
          // height: auto;
        }

        .game-favorites {
          img {
            @apply w-5 h-5;
          }
        }
      }

      @include phone-width {
        @apply gap-x-1 gap-y-3;
      }
    }
  }
}
</style>
