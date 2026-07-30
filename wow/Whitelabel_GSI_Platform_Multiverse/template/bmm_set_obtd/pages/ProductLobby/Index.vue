<template>
  <GameBanner />
  <div v-if="$q.platform.is.mobile" class="product-container h5">
    <MobileNav />
    <ul class="product-row">
      <li
        v-for="product in productList"
        :key="product.product_name"
        class="product-item"
        @click="handleProductClick(product.integration_id, product.product_code)"
      >
        <div class="img-container">
          <img
            :src="getProductSquareImage({ ...product, siteKey: 'bmm_set_obtd' })"
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
            :src="getProductSquareImage({ ...product, siteKey: 'bmm_set_obtd' })"
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
    <!-- 最新得獎跑馬燈 -->
    <RankBoard class="mx-auto my-8 rank-board" />
    <!-- 先隱藏 -->
    <!-- <FeatureSlot /> -->
  </div>
  <FooterArea v-if="!$q.platform.is.mobile" />
</template>
<script lang="ts">
export default {
  name: "ProductLobby"
}
</script>
<script lang="ts" setup>
import { computed, watchEffect, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import GameBanner from "app/template/bmm_set_obtd/components/Banner/GameBanner.vue"
import RankBoard from "app/template/bmm_set_obtd/components/Carousel/RankBoard.vue"
import FooterArea from "app/template/bmm_set_obtd/components/Footer/Index.vue"
import MobileNav from "app/template/bmm_set_obtd/components/MobileNav.vue"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useBanner } from "src/common/composables/useBanner"
import { useProviderProductsLobby } from "src/common/composables/useProviderLobby"
import { useRedirectGameOpenProductLobby } from "src/common/composables/useRedirectGameOpenProductLobby"
import { useGame } from "src/common/composables/useGame"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { useProductLobbyRouteGuard } from "src/common/hooks/useProviderLobbyRouteGuards"
import { BANNER_POSITION, GAME_TYPE, AI_HELPER_EVENT_ROUTES } from "src/common/utils/constants"
import FooterNav from "../../components/Footer/FooterNav.vue"

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
@import "app/template/bmm_set_obtd/assets/css/button.scss";
@import "app/template/bmm_set_obtd/assets/css/product.scss";

.product-container {
  &.pc {
    margin: 2rem 2rem 8rem 5rem;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    .product-row {
      @apply grid grid-cols-5 gap-5;
      @include pc-xl-width {
        @apply grid-cols-4;
      }
    }
  }
  &.h5 {
    .product-row {
      @apply flex flex-wrap pb-24;
      @include iphone-width {
        @apply grid grid-cols-3 gap-2 px-3;
        margin: 0 0.2rem;
      }
    }
  }
}
</style>
