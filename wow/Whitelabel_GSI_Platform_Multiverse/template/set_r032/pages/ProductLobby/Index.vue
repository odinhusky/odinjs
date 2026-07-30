<template>
  <section class="product-lobby-wrapper">
    <MobileNavCMS v-if="isLargeTablet" />
    <GameBanner />
    <div class="lobby-container">
      <ul class="product-row">
        <li
          v-for="product in productList"
          :key="product.product_code"
          class="product-item"
          @click="checkProductClick(product)"
        >
          <div class="img-container">
            <img
              :src="getProductSquareImage({ ...product, siteKey: 'set_r032' })"
              :alt="product.product_name"
              class="product-img"
              @error="setDefaultProductImg"
            />
            <!-- PC版顯示 play button -->
            <div v-if="isDesk" class="play-btn-container" @click.stop>
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
    </div>
    <HomeRankBoard />
  </section>
</template>

<script lang="ts" setup>
import { computed, watchEffect, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useBanner } from "src/common/composables/useBanner"
import { useProviderProductsLobby } from "src/common/composables/useProviderLobby"
import { useRedirectGameOpenProductLobby } from "src/common/composables/useRedirectGameOpenProductLobby"
import { useGame } from "src/common/composables/useGame"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { useProductLobbyRouteGuard } from "src/common/hooks/useProviderLobbyRouteGuards"
import { BANNER_POSITION, GAME_TYPE, AI_HELPER_EVENT_ROUTES } from "src/common/utils/constants"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import GameBanner from "app/template/set_r032/components/Banner/GameBanner.vue"
import HomeRankBoard from "app/template/set_r032/pages/HomePage/Components/HomeRankBoard.vue"
import MobileNavCMS from "app/template/set_r032/components/MobileNavCMS/Index.vue"

const route = useRoute()
const router = useRouter()
const { handleBannerList } = useBanner()
const { handleProductClick, getProductSquareImage } = useGame()
const { setDefaultProductImg } = useCommonImg()
const { handleAIHelperRouteEvent } = useAIHelperEvent()
const { isLargeTablet, isDesk } = useMediaQuery()

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

function checkProductClick(product: (typeof productList.value)[number]) {
  handleProductClick(product.integration_id, product.product_code)
}

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

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r032/assets/css/_variable.scss";
@import "app/template/set_r032/assets/css/button.scss";

.product-lobby-wrapper {
  @apply w-full mx-auto flex flex-col gap-[1.25rem];
  @apply max-w-[87.5rem] py-[.625rem] px-[.625rem] pt-[2.5rem];

  @include pad-large-width {
    @apply py-[.625rem] gap-[.625rem];
  }

  .product-row {
    @apply grid grid-cols-8 padXl:grid-cols-5 phone:grid-cols-3;
    @apply gap-4 phone:gap-5 iphone:gap-2.5;
  }
}

.product-item {
  @apply relative cursor-pointer rounded-xl;
  background: var(--neutral-01);

  .img-container {
    @apply rounded-xl overflow-hidden relative;
  }

  &:hover {
    .play-btn-container {
      @apply opacity-100;
    }

    .product-img {
      transform: scale(1.1);
    }
  }
  .product-img {
    @apply w-full rounded-lg;
    aspect-ratio: 1/1;
    transition: all 0.3s ease;
    object-fit: contain;
    object-position: center;
  }

  .play-btn-container {
    @apply absolute w-full h-full top-0 left-0 flex justify-center items-center;
    @apply opacity-0;
    background: rgba(var(--black-01-rgb), 0.5);
    transition: all 0.3s ease;
  }
  .hide-hover {
    background: var(--linear-gradient-primary-01);
  }
  .btn-play {
    color: var(--neutral-01);
  }
}

.title-container {
  @apply w-full;
  @apply flex justify-between items-center;
  @apply md:pb-3 px-2 pb-2.5;
}

.product-name {
  @apply text-[13px] md:text-lg font-bold;
  @apply w-full text-left overflow-hidden whitespace-nowrap text-ellipsis;
  color: var(--secondary-01);
}
</style>
