<template>
  <section v-if="shouldShowFBSports" class="fb-sports-home-section">
    <div class="fb-sports-home-content">
      <FBSportsArea />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { getProductList } from "src/api/game"
import type * as Response from "src/api/response.type"
import FBSportsArea from "src/common/components/FBSportsArea/Index.vue"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useApi } from "src/common/hooks/useApi"
import { GAME_TYPE } from "src/common/utils/constants"
import { FB_SPORTS_PRODUCT_CODE } from "src/common/utils/fbSportsLaunch"
import { computed, onMounted, ref } from "vue"

const { allowAgentCodes } = useAgentCode()
const sportsbookProducts = ref<Response.ProductList>([])

const isBBF1 = computed(() => allowAgentCodes(["BBF1"]))

const fbSportsProduct = computed(() => {
  return sportsbookProducts.value.find((item) => item.product_code === FB_SPORTS_PRODUCT_CODE)
})

const shouldShowFBSports = computed(() => {
  return isBBF1.value && !!fbSportsProduct.value
})

const getSportsbookProducts = async () => {
  if (!isBBF1.value) {
    sportsbookProducts.value = []
    return
  }

  const { status, data } = await useApi(getProductList, {
    game_type_id: GAME_TYPE.Enums.SPORTBOOK,
  })

  sportsbookProducts.value = status && data?.length ? [...data] : []
}

onMounted(async () => {
  await getSportsbookProducts()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.fb-sports-home-section {
  @apply w-full py-4;

  @include iphone-width {
    @apply py-2;
  }
}

.fb-sports-home-content {
  @apply h-[680px] w-full overflow-hidden rounded;
  background: #001006;

  @include iphone-width {
    height: 100vh;
    min-height: 600px;
    border-radius: 0;
  }

  :deep(.fb-sports-area),
  :deep(.iframe-stack) {
    height: 100%;
    width: 100%;
  }
}
</style>
