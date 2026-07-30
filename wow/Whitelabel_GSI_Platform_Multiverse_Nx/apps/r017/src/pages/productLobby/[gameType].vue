<script setup lang="ts">
import { LOBBY_CONTAINER_PADDING_CLASS, LOBBY_SPACING_CLASS } from "@shared-lib/constants/lobby"

const { gameTypeId, gameTypeState, lobbyTitle, productList, isLoading, handleProductCardClick } = useGame()
const { isDown } = useCustomBreakpoints()

const shouldKeepCardWidth = computed(() => {
  return !isDown.phone && productList.value.length > 0 && productList.value.length <= 5
})

const pageStyle = computed(() => {
  const backgroundUrl = isDown.mob ? "/images/bg/common-bg-m.png" : "/images/bg/common-bg-d.png"
  return {
    backgroundImage: `url(${backgroundUrl})`
  }
})
</script>

<template>
  <section :class="cx('w-full min-h-full')" :style="pageStyle">
    <div :class="cx('w-full', LOBBY_CONTAINER_PADDING_CLASS, FLEX_COL, 'gap-6')">
      <div :class="cx(LOBBY_CONTAINER_MARGIN_CLASS)">
        <LobbyBanner :lobby-title="lobbyTitle" :game-type-id="gameTypeId" />
      </div>

      <div :class="cx('w-full mx-auto', FLEX_CENTER)">
        <div :class="cx('w-full', LAYOUT_MAX_WIDTH, LOBBY_SPACING_CLASS)">
          <div v-if="isLoading" class="py-10 text-center text-sm text-white/70">Loading products...</div>

          <div v-else-if="!productList.length" class="py-10">
            <NoData type="empty" />
          </div>

          <div
            v-else
            :class="
              cx(
                'grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] phone:grid-cols-3 gap-3',
                shouldKeepCardWidth && 'grid-cols-[repeat(auto-fill,minmax(190px,190px))] justify-start'
              )
            "
          >
            <ProductLobbyGameItem
              v-for="product in productList"
              :key="`${product.integration_id}-${product.product_code}`"
              :product="product"
              :game-type-map="gameTypeState.map"
              @click="handleProductCardClick(product)"
            />
          </div>

          <div>
            <RankBoard :game-type="gameTypeId" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
