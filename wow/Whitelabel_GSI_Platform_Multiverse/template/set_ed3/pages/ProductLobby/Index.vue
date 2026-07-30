<template>
  <div class="product-lobby">
    <div class="product-lobby-title" v-if="!$q.platform.is.mobile">
      <div class="title-icon"></div>
      <div class="title-label">{{ $t(GAME_TYPE.I18nKeys[gameTypeId as GAME_TYPE.Enums]) }}</div>
    </div>
    <ul class="product-row">
      <li
        v-for="product in productList"
        :key="product.product_code"
        class="product-item"
        @click="handleProductClick(product.integration_id, product.product_code)"
      >
        <div class="img-container">
          <img
            :src="getProductSquareImage({ ...product, siteKey: 'set_ed3' })"
            :alt="product.product_name"
            class="product-img"
            @error="setDefaultProductImg"
          />
        </div>
      </li>
    </ul>
    <div class="provider-title">{{ $t("home.providers") }}</div>
    <ProviderList class="provider-list" />
  </div>
</template>
<script lang="ts">
export default {
  name: "ProductLobby"
}
</script>
<script lang="ts" setup>
import ProviderList from "../Home/components/ProviderList.vue"
import { useSiteImg } from "app/template/set_ed3/hooks/useSiteImg"
import { useQuasar } from "quasar"
import { useBanner } from "src/common/composables/useBanner"
import { useProviderProductsLobby } from "src/common/composables/useProviderLobby"
import { useRedirectGameOpenProductLobby } from "src/common/composables/useRedirectGameOpenProductLobby"
import { useGame } from "src/common/composables/useGame"
import { useProductLobbyRouteGuard } from "src/common/hooks/useProviderLobbyRouteGuards"
import { BANNER_POSITION, GAME_TYPE } from "src/common/utils/constants"
import { computed, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
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
@import "app/template/set_ed3/assets/css/_variable.scss";

.product-lobby {
  @apply px-[15px] py-[40px];
  @include phone-width {
    @apply py-[20px];
  }
  .product-lobby-title {
    @apply inline-block;
    background: $green01;
    padding: 8px 20px;
    border-radius: 0px 20px 20px 0px;
    align-items: center;
    text-transform: uppercase;
    color: $text01;
    font-size: 17px;
  }
  .product-row {
    @apply grid grid-cols-7 gap-[15px] my-4;
    @include pad-width {
      @apply grid-cols-4;
    }
    @include phone-width {
      @apply grid-cols-3;
    }
    .product-item {
      @apply cursor-pointer;
      .img-container {
        .product-img {
          @apply rounded-[.3125rem];
        }
      }
    }
  }
  .provider-title {
    @apply px-[10px] pb-[10px] text-[15px] font-semibold uppercase;
    color: $text01;
    @include phone-width {
      @apply text-[12px];
    }
  }
}
</style>
