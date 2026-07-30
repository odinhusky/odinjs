<script setup lang="ts">
definePageMeta({
  // Keep page instance stable when only productCode changes.
  key: (route) => `game-lobby-${String(route.params.gameType || "")}`
})
import { LOBBY_CONTAINER_PADDING_CLASS, LOBBY_SPACING_CLASS } from "@shared-lib/constants/lobby"

const {
  gameTypeId,
  lobbyTitle,
  gameTypeState,
  isProviderLoading,
  isGameListLoading,
  providerOptions,
  selectedProvider,
  selectedTag,
  searchKeyword,
  gameTagOptions,
  filteredGameList,
  showProviderPanel,
  getProductTabImage,
  toggleProviderPanel,
  selectProvider,
  setProviderItemRef,
  handleGameCardClick,
  handleToggleFavorite,
  isFavoriteMutating,
  mutatingGameIds,
  initialize
} = useGameLobby()

onMounted(async () => {
  await initialize()
})
</script>

<template>
  <section :class="cx('w-full min-h-full', LOBBY_CONTAINER_PADDING_CLASS, FLEX_COL, 'gap-8 mob:gap-3')">
    <div :class="cx(LOBBY_CONTAINER_MARGIN_CLASS)">
      <LobbyBanner :lobby-title="lobbyTitle" :game-type-id="gameTypeId" />
    </div>

    <div :class="cx('w-full', LAYOUT_MAX_WIDTH, 'mx-auto', LOBBY_SPACING_CLASS)">
      <GameLobbyFilterPanel
        :game-lobby-spacing-class="LOBBY_SPACING_CLASS"
        :provider-options="providerOptions"
        :selected-provider="selectedProvider"
        :selected-tag="selectedTag"
        :search-keyword="searchKeyword"
        :game-tag-options="gameTagOptions"
        :show-provider-panel="showProviderPanel"
        :get-product-tab-image="getProductTabImage"
        :set-provider-item-ref="setProviderItemRef"
        @update:search-keyword="searchKeyword = $event"
        @update:selected-tag="selectedTag = $event"
        @select-provider="selectProvider"
        @toggle-provider-panel="toggleProviderPanel"
      />

      <div v-if="isProviderLoading || isGameListLoading" class="py-10 text-center text-sm text-white/70">
        Loading games...
      </div>

      <div v-else-if="!filteredGameList.length" class="py-10">
        <NoData type="empty" />
      </div>

      <div
        v-else
        class="grid grid-cols-[repeat(auto-fit,minmax(161px,1fr))] phone:grid-cols-3 gap-3 justify-start gap-3"
      >
        <GameLobbyGameItem
          v-for="game in filteredGameList"
          :key="game.game_id"
          :game="game"
          :game-type-map="gameTypeState.map"
          :is-favorite-mutating="mutatingGameIds.has(Number(game.game_id))"
          @click="handleGameCardClick(game)"
          @toggle-favorite="handleToggleFavorite(game)"
        />
      </div>

      <div>
        <RankBoard :game-type="gameTypeId" />
      </div>
    </div>
  </section>
</template>
