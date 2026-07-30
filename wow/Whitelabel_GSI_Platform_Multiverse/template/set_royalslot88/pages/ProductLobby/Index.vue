<template>
  <div class="product-lobby-layout">
    <div class="product-lobby-content">
      <CarouselItems v-if="slides.length" :itemToShow="5" :slides="slides" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useProviderProductsLobby } from "src/common/composables/useProviderLobby"
import { useGame } from "src/common/composables/useGame"
import { useProductLobbyRouteGuard } from "src/common/hooks/useProviderLobbyRouteGuards"
import { GAME_TYPE } from "src/common/utils/constants"
import CarouselItems from "app/template/set_royalslot88/components/CarouselItems.vue"

const route = useRoute()
const router = useRouter()
const { handleProductClick, getProductSquareImage } = useGame()

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

const slides = computed(() => {
  return productList.value.map((product) => {
    return {
      img: getProductSquareImage({ ...product, siteKey: "set_royalslot88", imgType: "gif" }),
      onSlideClick: () => {
        handleProductClick(product.integration_id, product.product_code, true)
      }
    }
  })
})
</script>

<style lang="scss" scoped>
.product-lobby-layout {
  @apply w-full h-[100dvh];
  @apply flex flex-col items-center justify-center;
  .product-lobby-content {
    @apply w-full;
  }
}
</style>
