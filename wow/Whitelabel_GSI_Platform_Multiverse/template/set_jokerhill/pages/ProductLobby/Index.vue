<template>
  <CommonCarouselBanner v-if="isMobile" />
  <CarouselBanner v-else />
  <div class="product-container">
    <ul class="product-row">
      <li
        v-for="product in productList"
        :key="product.product_name"
        class="product-item"
        @click="handleProductClick(product.integration_id, product.product_code)"
      >
        <img
          :src="getProductSquareImage({ ...product, siteKey: 'set_jokerhill' })"
          :alt="product.product_name"
          class="product-img"
          @error="setDefaultProductImg"
        />
        <q-btn class="btn-play">{{ $t("game.play_now") }} ></q-btn>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import CarouselBanner from "app/template/set_jokerhill/components/CarouselBanner.vue"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import CommonCarouselBanner from "src/common/components/banner/CarouselBanner.vue"
import { useBanner } from "src/common/composables/useBanner"
import { useProviderProductsLobby } from "src/common/composables/useProviderLobby"
import { useGame } from "src/common/composables/useGame"
import { useProductLobbyRouteGuard } from "src/common/hooks/useProviderLobbyRouteGuards"
import { BANNER_POSITION, GAME_TYPE } from "src/common/utils/constants"
import { computed, ref, watch, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"

let isMobile = ref(false)
const { width } = useWindowSize()
const route = useRoute()
const router = useRouter()
const { handleBannerList } = useBanner()
const { handleProductClick, getProductSquareImage } = useGame()
const { setDefaultProductImg } = useSiteImg()

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

async function getBanner() {
  await handleBannerList(BANNER_POSITION.Enums.ProductLobby, gameTypeId.value)
}

watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)

watchEffect(() => {
  if (gameTypeId.value) {
    getBanner()
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

.product-container
  @apply p-5 mx-auto box-border
  max-width: 85.375rem
  .product-row
    @apply grid grid-cols-3 gap-4
    +phone-width
      @apply grid-cols-1
    .product-item
      @apply list-none box-border relative
      aspect-ratio: 500/215
      .product-img
        @apply w-full h-auto cursor-pointer
        transition: all .6s ease-in-out
        &:hover
          // transform: scale(1.1)
      .btn-play
        color: #fff
        position: absolute
        bottom: 13%
        left: 10%
        padding: .3125rem 1.25rem
        border-radius: .9375rem
        font-weight: 700
        text-transform: none
        -webkit-transition: all .6s ease-in-out
        background: #333333
        font-size: .75rem
        transition: all .6s ease-in-out
        letter-spacing: .04rem
        +iphone-width
          padding: .3125rem .9rem
          font-size: .7rem
        &:hover
          // transform: scale(1.1)
</style>
