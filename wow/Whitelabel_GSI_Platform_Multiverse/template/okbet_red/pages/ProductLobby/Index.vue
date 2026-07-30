<template>
  <GameBanner />

  <div v-if="isMobile" class="product-container h5">
    <MobileNav :isNeedPaddingX="false" />

    <ul class="product-row">
      <li
        v-for="product in productList"
        :key="product.product_name"
        class="product-item"
        @click="handleProductClick(product.integration_id, product.product_code)"
      >
        <div class="img-container">
          <img
            :src="getProductSquareImage({ ...product, siteKey: 'okbet_red' })"
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
    <ul class="product-row">
      <li v-for="product in productList" :key="product.product_name" class="product-item">
        <div class="img-container">
          <img
            :src="getProductSquareImage({ ...product, siteKey: 'okbet_red' })"
            :alt="product.product_name"
            class="product-img"
            @error="setDefaultProductImg"
          />
          <div class="play-btn-container">
            <q-btn
              class="btn-play hide-hover"
              @click="handleProductClick(product.integration_id, product.product_code)"
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
    <RankBoard class="mx-auto my-8 rank-board" variant="productLobby" />
  </div>
  <FooterArea v-if="!isMobile" />
</template>
<script lang="ts">
export default {
  name: "ProductLobby"
}
</script>
<script lang="ts" setup>
import GameBanner from "app/template/okbet_red/components/Banner/GameBanner.vue"
import RankBoard from "app/template/okbet_red/components/Carousel/RankBoard.vue"
import FooterArea from "app/template/okbet_red/components/Footer/Index.vue"
import MobileNav from "app/template/okbet_red/components/MobileNav.vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useQuasar } from "quasar"
import { useBanner } from "src/common/composables/useBanner"
import { useProviderProductsLobby } from "src/common/composables/useProviderLobby"
import { useRedirectGameOpenProductLobby } from "src/common/composables/useRedirectGameOpenProductLobby"
import { useGame } from "src/common/composables/useGame"
import { useProductLobbyRouteGuard } from "src/common/hooks/useProviderLobbyRouteGuards"
import { BANNER_POSITION, GAME_TYPE } from "src/common/utils/constants"
import { computed, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import FooterNav from "../../components/Footer/FooterNav.vue"

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const isMobile = $q.platform.is.mobile
const { handleBannerList } = useBanner()
const { handleProductClick, getProductSquareImage } = useGame()
const { setDefaultProductImg } = useCommonImg()

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

async function getBanner() {
  await handleBannerList(BANNER_POSITION.Enums.ProductLobby, gameTypeId.value)
}

watchEffect(() => {
  if (gameTypeId.value) {
    getBanner()
  }
})

</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_red/assets/css/button.scss";
@import "app/template/okbet_red/assets/css/product.scss";

.product-container {
  @apply px-6 py-5;

  @include phone-width {
    @apply px-4 py-5;
  }

  &.pc {
    margin: 2rem 2rem 8rem 5rem;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    .product-row {
      @apply grid grid-cols-6 gap-4;

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
    @apply pt-0 pb-20;

    .product-row {
      @apply grid grid-cols-4 gap-4;
      @apply phone:grid-cols-3;
      @apply iphone:grid-cols-2;

      @include pc-lg-width {
        margin: 0 0.2rem;
      }

      @include phone-width {
        @apply grid-cols-3 gap-2 px-3;
      }

      .product-item {
        @apply w-full flex flex-col items-center justify-between;

        .img-container {
          @apply w-full h-auto pad:w-[14.125rem];
        }

        .product-name {
          @apply flex items-center justify-center;
          @apply w-full leading-[1];
          @apply p-4 pb-0 iphone:p-0 iphone:py-2;
          @apply padLg:text-xl iphone:text-base;
        }
      }
    }
  }
}
</style>
