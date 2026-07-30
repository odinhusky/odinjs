<template>
  <div class="game-lobby">
    <div class="game-lobby-title" v-if="!$q.platform.is.mobile">
      <div class="title-icon">
        <img :src="gameTitleIcon(gameType)" alt="" srcset="" />
      </div>
      <div class="title-label">{{ $t(GAME_TYPE.I18nKeys[gameType as GAME_TYPE.Enums]) }}</div>
    </div>

    <div class="swiper-container">
      <Swiper
        :modules="[Navigation]"
        @swiper="onSwiper"
        @slide-change="updateNavigationState"
        class="product-row"
        :breakpoints="{
          300: { slidesPerView: 3, spaceBetween: 10 },
          500: { slidesPerView: 4, spaceBetween: 10 },
          1024: { slidesPerView: 6, spaceBetween: 10 }
        }"
        ref="productSwiperRef"
      >
        <SwiperSlide
          v-for="product in productList"
          :key="product.product_code"
          class="product-item cursor-pointer"
          @click="selectProductCode(product.product_code)"
        >
          <div class="img-container">
            <img
              :src="getProductSquareImage({ ...product, siteKey: 'set_DBO88' })"
              :alt="product.product_name"
              class="product-img"
              @error="setDefaultProductImg"
            />
          </div>
        </SwiperSlide>
      </Swiper>
      <div class="navigation" v-if="productList.length > 0">
        <q-btn flat dense rounded icon="fas fa-chevron-left" @click="productSwiper.slidePrev()"> </q-btn>
        <q-btn flat dense rounded icon="fas fa-chevron-right" @click="productSwiper.slideNext()"> </q-btn>
      </div>
    </div>

    <div class="game-bar">
      <div class="left">
        <a
          class="bar-btn"
          v-for="tag in cloneGameTagList"
          :key="`tag-${tag.value}`"
          :name="tag.value"
          :class="{ active: gameSearchType === tag.value }"
          @click="gameSearchType = tag.value"
        >
          {{ tag.label }}
        </a>
      </div>
      <div class="right" v-if="!$q.platform.is.mobile">
        <q-input
          v-model.trim="searchKeyword"
          borderless
          dense
          class="search-input"
          :placeholder="$t('common.btn.search')"
        >
          <template #prepend> <q-icon name="search" /> </template
        ></q-input>
      </div>
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
              <div class="play-btn-container">
                <q-btn
                  unelevated
                  no-caps
                  class="btn-play"
                  @click="openGame(game.integration_id, game.product_code, game.game_code, gameType, true)"
                >
                  {{ $t("game.play_now") }}
                </q-btn>
              </div>
              <div class="tag-img">
                <img v-if="game.hot" :src="hotTagImg" />
                <img v-if="game.newly" :src="newTagImg" />
              </div>
            </div>
          </li>
        </ul>
      </template>
    </q-virtual-scroll>
    <div v-else class="no-data-container no-data">
      <img class="w-16" v-if="getWideLogo" :src="getWideLogo()" alt="" />
      <span>{{ $t("tableHeader.no_data") }}</span>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "GameLobby"
}
</script>
<script lang="ts" setup>
import { useSiteImg } from "app/template/set_DBO88/hooks/useSiteImg"
import { useGameLobbyVirtualScroll } from "src/common/composables/useGameLobbyVirtualScroll"
import { useProviderGameLobby } from "src/common/composables/useProviderLobby"
import { useGame } from "src/common/composables/useGame"
import { useLogo } from "src/common/composables/useLogo"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useProviderGameLobbyRoute } from "src/common/composables/useProviderGameLobbyRoute"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { GAME_TAG_TYPE, GAME_TYPE } from "src/common/utils/constants"
import "swiper/css"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/vue"
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const { gameTagList, openGame, getGameImage, getProductSquareImage } = useGame()
const { setDefaultGameImg } = useCommonImg()
const { gameTitleIcon, hotTagImg, newTagImg, setDefaultProductImg } = useSiteImg()
const { getWideLogo } = useLogo()
const { isDown, isDesktop } = useMediaQuery()

const { safeGameType, routeIntegrationId, routeProductCode } = useProviderGameLobbyRoute(route, router)
const gameType = safeGameType


const { productList, searchKeyword, showGameList, selectProductCode, gameSearchType } = useProviderGameLobby(
  router,
  safeGameType,
  { routeProductCode }
)

// 對齊 CSS：7 → pad 4 → phone 3
const rowItemsCount = computed(() => {
  if (isDown.phone) return 3
  if (isDown.pad) return 4
  return 7
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

const cloneGameTagList = computed(() => {
  return gameTagList.value.filter((item) => item.value !== GAME_TAG_TYPE.Enums.Favorites)
})

const productSwiper = ref()
const canGoNext = ref(true)
const canGoPrev = ref(true)

const onSwiper = (swiper: any) => {
  productSwiper.value = swiper
  updateNavigationState()
}
const updateNavigationState = () => {
  canGoPrev.value = !productSwiper.value.isBeginning
  canGoNext.value = !productSwiper.value.isEnd
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_DBO88/assets/css/_variable.scss";

.game-lobby {
  @apply px-[15px] py-[40px];
  .game-lobby-title {
    @apply inline-flex text-[1.125rem] mb-[1.875rem];
    align-items: center;
    text-transform: uppercase;
    color: $text-sky-blue;
    .title-icon {
      img {
        @apply max-h-[40px] mr-[10px];
      }
    }
    .title-label {
    }
  }
  .swiper-container {
    @apply relative;
    @include phone-width {
      @apply px-[10px];
    }
    .navigation {
      @apply absolute w-full;
      @apply flex justify-between items-center;
      @apply top-1/2 transform -translate-y-1/2;
      @apply z-10 pointer-events-none;
      ::v-deep(.q-btn) {
        background: $midnight-blue-bg;
        color: $text-sky-blue;
        @apply w-[30px] h-[30px];
        @apply text-white pointer-events-auto;
        .q-icon {
          @apply text-[20px];
        }
      }
      @include phone-width {
        @apply -ml-[10px];
      }
    }
  }
  .game-row {
    @apply grid grid-cols-7 my-4 gap-[1.25rem];
    @include pad-width {
      @apply grid-cols-4 gap-[1.125rem];
    }
    @include phone-width {
      @apply grid-cols-3 gap-[5.5px];
    }
    .game-item {
      .img-container {
        @apply flex h-full justify-center relative;
        .play-btn-container {
          @apply absolute rounded-[8px] w-full h-full;
          @apply top-0 left-0 cursor-pointer;
          @apply transition-all duration-300 hover:bg-black/50;
          @apply hidden items-center justify-center;

          .btn-play {
            @apply rounded-full font-bold;
            background-color: $primary-color;
            color: $text-white;
          }
        }
        .tag-img {
          @apply absolute w-16 left-2 top-2;
        }
        &:hover {
          .play-btn-container {
            @apply flex;
          }
        }
      }
    }
  }
  .game-bar {
    @apply rounded-full my-[40px] p-[10px];
    @apply flex justify-between items-center;
    background: #171f2b;
    border: 1px solid #272f3b;
    @include phone-width {
      @apply my-[15px];
    }
    .left {
      @apply flex pl-4 gap-[20px];
      .bar-btn {
        @apply text-white text-[14px] font-semibold;
        @apply cursor-pointer transition-all;

        &:hover {
          color: $text-sky-blue;
        }
        &.active {
          color: $text-sky-blue;
        }
      }
    }
    .right {
      .search-input {
        @apply rounded-full px-2 py-1;
        background-color: $secondary-color;
        ::v-deep(.q-icon) {
          color: $text-white;
        }

        ::v-deep(input) {
          @apply placeholder:text-white text-white;
        }
      }
    }
  }
  .no-data-container {
    @apply h-[200px] w-full flex gap-4 flex-col items-center justify-center;
    color: $text-white;
  }
}
</style>
