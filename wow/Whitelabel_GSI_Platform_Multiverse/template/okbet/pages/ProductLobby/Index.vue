<template>
  <GameBanner />

  <div v-if="isMobile" class="product-container h5">
    <MobileNav :isNeedPaddingX="false" />

    <div class="provider-title">
      <p class="item-desc">{{ $t("home.entertaining") }}</p>
      <h3 class="title">
        <span> {{ $t("home.game") }} </span> {{ $t(gameTypeTitleKey) }}
      </h3>
    </div>

    <ul class="product-row">
      <li
        v-for="product in productList"
        :key="product.product_name"
        class="product-item"
        @click="handleProductClick(product.integration_id, product.product_code)"
      >
        <div class="img-container">
          <img
            :src="getProductSquareImage({ ...product, siteKey: 'okbet' })"
            :alt="product.product_name"
            class="product-img"
            @error="setDefaultProductImg"
          />
        </div>
        <div class="product-name">{{ product.product_name }}</div>
      </li>
    </ul>
    <FooterNav />
  </div>

  <div v-else class="product-container pc">
    <div class="provider-title">
      <p class="item-desc">{{ $t("home.entertaining") }}</p>
      <h3 class="title">
        <span> {{ $t("home.game") }} </span> {{ $t(gameTypeTitleKey) }}
      </h3>
    </div>

    <ul class="product-row">
      <li v-for="product in productList" :key="product.product_name" class="product-item">
        <div class="img-container">
          <img
            :src="getProductSquareImage({ ...product, siteKey: 'okbet' })"
            :alt="product.product_name"
            class="product-img"
            @error="setDefaultProductImg"
          />
          <div class="play-btn-container">
            <q-btn
              class="btn-play hide-hover"
              @click="handleProductClick(product.integration_id, product.product_code, true)"
            >
              {{ $t("game.play_now") }}
            </q-btn>
          </div>
        </div>
        <div class="title-container">
          <span class="product-name">{{ product.product_name }}</span>
        </div>
      </li>
    </ul>
    <!-- 最新得獎跑馬燈 -->
    <!-- 先隱藏 -->
    <!-- <FeatureSlot /> -->
  </div>
  <RankBoard class="mx-auto my-6 rank-board" />

  <FooterArea v-if="!isMobile" />
</template>
<script lang="ts">
export default {
  name: "ProductLobby"
}
</script>
<script lang="ts" setup>
import { computed, watchEffect, onMounted, toRef } from "vue"
import GameBanner from "app/template/okbet/components/Banner/GameBanner.vue"
import RankBoard from "app/template/okbet/components/Carousel/RankBoard.vue"
import FooterArea from "app/template/okbet/components/Footer/Index.vue"
import MobileNav from "app/template/okbet/components/MobileNav.vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useBanner } from "src/common/composables/useBanner"
import { useProviderProductsLobby } from "src/common/composables/useProviderLobby"
import { useRedirectGameOpenProductLobby } from "src/common/composables/useRedirectGameOpenProductLobby"
import { useGame } from "src/common/composables/useGame"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { useProductLobbyRouteGuard } from "src/common/hooks/useProviderLobbyRouteGuards"
import { BANNER_POSITION, GAME_TYPE, AI_HELPER_EVENT_ROUTES } from "src/common/utils/constants"
import { useRoute, useRouter } from "vue-router"
import FooterNav from "../../components/Footer/FooterNav.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "padXl")

const route = useRoute()
const router = useRouter()

const { handleBannerList } = useBanner()
const { handleProductClick, getProductSquareImage } = useGame()
const { setDefaultProductImg } = useCommonImg()
const { handleAIHelperRouteEvent } = useAIHelperEvent()

const parsedGameTypeId = computed(() => {
  const value = Number(route.params.gameType)
  return Number.isNaN(value) ? null : value
})
const gameTypeId = computed(() =>
  parsedGameTypeId.value != null && parsedGameTypeId.value in GAME_TYPE.I18nKeys
    ? (parsedGameTypeId.value as GAME_TYPE.Enums)
    : GAME_TYPE.Enums.SLOT
)
const { productList } = useProviderProductsLobby(gameTypeId)

useProductLobbyRouteGuard({
  route,
  router,
  parsedGameType: parsedGameTypeId
})

useRedirectGameOpenProductLobby(router, gameTypeId, productList)

const gameTypeTitleKey = computed(() => {
  const key = GAME_TYPE.I18nKeys[gameTypeId.value as GAME_TYPE.Enums]
  return key || "home.providers"
})

async function getBanner() {
  await handleBannerList(BANNER_POSITION.Enums.ProductLobby, gameTypeId.value)
}

watchEffect(() => {
  if (gameTypeId.value) {
    getBanner()
  }
})

onMounted(() => {
  if (GAME_TYPE.Category[gameTypeId.value as GAME_TYPE.Enums] === GAME_TYPE.CategoryEnums.LobbyOpen) {
    handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.PRODUCT_LOBBY)
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/button.scss";
@import "app/template/okbet/assets/css/product.scss";

:deep(.base-image) {
  object-fit: contain !important;
}

.product-container {
  width: 100%;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  max-width: 1400px;
  padding-left: 0;
  padding-right: 0;
  padding-top: 24px;

  // 1000px–1439px: container width 923px
  @media (max-width: 1439px) and (min-width: 1000px) {
    max-width: 923px;
  }

  // < 992px: don't limit width; padding 20px
  @media (max-width: 991px) {
    max-width: none;
    padding-left: 20px !important;
    padding-right: 20px !important;
    padding-top: 24px !important;
  }

  // < 768px: don't limit width; padding 8px
  @media (max-width: 767px) {
    padding-left: 8px !important;
    padding-right: 8px !important;
    padding-top: 8px !important;
  }

  &.pc {
    margin-bottom: 24px;

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

    .product-row {
      @apply grid grid-cols-6 gap-x-[12px] gap-y-[16px];

      @include pc-2xl-width {
        @apply grid-cols-5;
      }

      @include pc-xl-width {
        @apply grid-cols-4;
      }

      .title-container {
        @apply flex justify-center items-center;
      }

      .product-item {
        @apply w-full;
      }
    }
  }
  &.h5 {
    @apply pt-[24px];

    // Match GameLobby behavior: hide title on mobile
    .item-desc,
    .title {
      display: none;
    }

    .product-row {
      @apply grid grid-cols-4 gap-x-[12px] gap-y-[16px];
      @apply phone:grid-cols-3;
      @apply iphone:grid-cols-3;
      padding-bottom: 0px !important;

      @include phone-width {
        @apply gap-x-1 gap-y-3;
      }

      @media (min-width: 991px) {
        @apply gap-x-3 gap-y-4;
      }

      @include pc-lg-width {
        margin: 0 0px;
      }

      .product-item {
        @apply w-full flex flex-col items-center;

        .img-container {
          @apply w-full h-auto pad:w-[14.125rem];
        }

        .product-name {
          @apply flex items-center justify-center;
          @apply w-full h-[20px] leading-[20px];
          @apply p-0 pb-0 iphone:p-0;
          @apply padLg:text-xl iphone:text-base;

          @media (max-width: 991px) {
            @apply h-[20px];
            line-height: 20px !important;
          }
        }
      }
    }
  }
}
</style>
