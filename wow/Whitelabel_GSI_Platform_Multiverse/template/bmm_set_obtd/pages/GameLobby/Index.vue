<template>
  <GameBanner />
  <MobileNav v-if="$q.platform.is.mobile" />
  <div class="provider-container" :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <div class="provider-title">
      <p class="item-desc">{{ $t("home.entertaining") }}</p>
      <h3 class="title">
        <span> {{ $t("home.game") }} </span> {{ $t("home.providers") }}
      </h3>
    </div>
    <q-tabs
      :model-value="selectedProductCode"
      class="provider-tabs"
      inline-label
      outside-arrows
      mobile-arrows
      :shrink="false"
      align="left"
      no-caps
      indicator-color="transparent"
      @update:model-value="selectProductCode"
    >
      <q-tab v-for="product in productList" :key="product.product_code" :name="product.product_code">
        <img
          :src="getProductTabImage({ ...product, siteKey: 'bmm_set_obtd' })"
          class="tab-img"
          :alt="product.product_name"
          @error="setDefaultProductTabImg"
        />
      </q-tab>
    </q-tabs>
  </div>
  <div v-if="$q.platform.is.mobile" class="game-container h5">
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
        :placeholder="$t('placeholder.gameName')"
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
            @click="openGame(game.integration_id, game.product_code, game.game_code, gameType, true)"
          >
            <div class="img-container">
              <img :src="getGameImage(game)" :alt="game.game_code" class="game-img" loading="lazy" decoding="async" @error="setDefaultGameImg" />
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
            </div>

            <div class="hot-tag">
              <img v-if="game.hot" :src="hotTagImg" />
              <img v-if="game.newly" :src="newTagImg" />
            </div>

            <div class="game-name">{{ game.game_name }}</div>
            <div class="game-favorites">
              <img :src="svgIcon('heart-collet')" alt="" />
              <span> {{ formatNumberKM(game.favorite_count) }} </span>
            </div>
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
      <q-input v-model.trim="searchKeyword" borderless class="search-input">
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
              <img :src="getGameImage(game)" :alt="game.game_code" class="game-img" loading="lazy" decoding="async" @error="setDefaultGameImg" />
              <q-btn
                v-if="isGameFavorited(game)"
                class="btn-favorite hide-hover"
                round
                flat
                @click="removeFavorite(game, true)"
              >
                <img :src="svgIcon('heart-btn-active')" alt="" />
              </q-btn>
              <div class="play-btn-container">
                <q-btn
                  class="btn-play hide-hover"
                  @click="openGame(game.integration_id, game.product_code, game.game_code, gameType, true)"
                >
                  {{ $t("game.play_now") }}
                </q-btn>
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
              <img v-if="game.hot" :src="hotTagImg" />
              <img v-if="game.newly" :src="newTagImg" />
            </div>

            <div class="title-container">
              <span class="game-name">{{ game.game_name }}</span>
              <span class="game-favorites">
                <img :src="svgIcon('heart-collet')" alt="" />
                {{ formatNumberKM(game.favorite_count) }}
              </span>
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
    <RankBoard class="rank-board my-8 w-full" />
    <!-- 先隱藏 -->
    <!-- <FeatureLiveCasino /> -->
  </div>
  <FooterArea v-if="!$q.platform.is.mobile" />
</template>
<script lang="ts">
export default {
  name: "GameLobby"
}
</script>
<script lang="ts" setup>
import GameBanner from "app/template/bmm_set_obtd/components/Banner/GameBanner.vue"
import RankBoard from "app/template/bmm_set_obtd/components/Carousel/RankBoard.vue"
import FooterArea from "app/template/bmm_set_obtd/components/Footer/Index.vue"
import MobileNav from "app/template/bmm_set_obtd/components/MobileNav.vue"
import { useSiteImg } from "app/template/bmm_set_obtd/hooks/useSiteImg"
import { useBanner } from "src/common/composables/useBanner"
import { useGameLobbyVirtualScroll } from "src/common/composables/useGameLobbyVirtualScroll"
import { useProviderGameLobby } from "src/common/composables/useProviderLobby"
import { useGame } from "src/common/composables/useGame"
import { useLogo } from "src/common/composables/useLogo"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { useCommon } from "src/common/hooks/useCommon"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useProviderGameLobbyRoute } from "src/common/composables/useProviderGameLobbyRoute"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { AI_HELPER_EVENT_ROUTES, BANNER_POSITION, GAME_TYPE } from "src/common/utils/constants"
import "swiper/css"
import { Swiper, SwiperSlide } from "swiper/vue"
import { computed, onMounted, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useQuasar } from "quasar"
import FooterNav from "../../components/Footer/FooterNav.vue"

const { isDown } = useMediaQuery()
const $q = useQuasar()
const isMobile = $q.platform.is.mobile
const isDesktop = computed(() => !isMobile)

// 對齊 main：PC 6→5→4；H5 flex 1 欄 / iphone 3
const rowItemsCount = computed(() => {
  if (isMobile) return isDown.iphone ? 3 : 1
  if (isDown.pcXl) return 4
  if (isDown.pc2xl) return 5
  return 6
})

const route = useRoute()
const router = useRouter()
const { handleBannerList } = useBanner()
const { gameTagList, openGame, getGameImage, getProductTabImage } = useGame()
const { setDefaultProductTabImg, svgIcon, hotTagImg, newTagImg } = useSiteImg()
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
  gameSearchType
} = useProviderGameLobby(router, safeGameType, { routeIntegrationId, routeProductCode })

const {
  virtualScrollRef,
  virtualRowHeight,
  virtualScrollSliceSize,
  virtualScrollSliceRatioBefore,
  virtualScrollSliceRatioAfter,
  resolvedVirtualScrollTarget,
  gameRows
} = useGameLobbyVirtualScroll(showGameList, isDesktop, { rowItemsCount })

watchEffect(() => {
  if (gameType.value) {
    handleBannerList(BANNER_POSITION.Enums.ProductLobby, gameType.value)
  }
})

onMounted(() => {
  handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.GAME_LOBBY)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/game.scss";
@import "app/template/bmm_set_obtd/assets/css/button.scss";
@import "app/template/bmm_set_obtd/assets/css/data.scss";

.provider-container {
  @include setFlex;
  max-width: 1200px;
  margin: 0 auto;
  flex-direction: column;

  &.pc {
    @apply w-full mb-8;

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
      @apply relative mb-5;
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

    .provider-tabs {
      width: 100%;

      :deep(.q-tab) {
        width: 260px;
        height: 100px;
        background: $background-light-color;
        border-radius: 12px;
        flex: 0 0 auto;
        margin-left: 0;
        overflow: hidden;
        cursor: pointer;
        padding: 0;
      }

      :deep(.q-tab__content) {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .tab-img {
        width: 70%;
      }
    }
  }

  &.h5 {
    margin-top: 0.5rem;

    .item-desc {
      display: none;
    }

    .title {
      display: none;
    }

    .provider-tabs {
      width: 100vw;
      @include iphone-width {
        max-width: 92vw;
      }

      :deep(.q-tab) {
        width: auto;
        min-width: 200px;
        height: auto;
        background: $background-light-color;
        border-radius: 5px;
        flex: 0 0 auto;
        margin-left: 0;
        overflow: hidden;
        cursor: pointer;
        padding: 0.5rem;
      }

      .tab-img {
        width: 200px;
      }
    }
  }
}

:deep(.provider-tabs) {
  .q-tabs__content {
    gap: 10px;
    overflow-x: auto !important;
    overflow-y: hidden !important;
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
    margin: 2rem 2rem 8rem 2rem;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;

    .search-container {
      width: 100%;
      @apply flex justify-end pr-5;

      .tabs {
        width: 100%;
        display: flex;
        flex: 1 1 0%;
        margin-bottom: 20px;
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
      @apply grid grid-cols-6 gap-4;
      @apply pb-5;
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
    padding-bottom: 7rem;

    .search-container {
      width: 100%;
      margin: 0.4rem;
      @apply px-4 rounded-lg overflow-hidden flex justify-center items-center flex-wrap;

      .tabs {
        width: 100%;
        display: flex;
        overflow-x: auto;
        border-radius: 0.5rem;
        margin-bottom: 0.4rem;
        justify-content: space-between;

        .btn-tag {
          @apply rounded-lg;
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
      @apply w-full px-4;
      @apply flex flex-wrap;

      .hot-tag {
        width: 50px;
        height: 35px;
        left: -7%;
        top: 9%;
        position: absolute;
        z-index: 10;
      }

      .game-item {
        @apply w-full h-auto pb-3 rounded-lg;

        .img-container {
          @apply h-auto rounded-lg;

          img {
            @apply rounded-lg;
          }
        }

        .game-name {
          @apply mt-2;
        }

        .game-favorites {
          img {
            @apply w-5 h-5;
          }
        }
      }

      @include iphone-width {
        @apply grid grid-cols-3 gap-2;
      }
    }
  }
}
</style>
