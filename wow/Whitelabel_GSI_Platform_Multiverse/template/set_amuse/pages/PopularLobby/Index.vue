<template>
  <div class="game-container">
    <h2 class="title">{{ $t("home.popularGames") }}</h2>
    <q-separator />
    <div class="game-row">
      <div
        v-for="game in popularGames"
        :key="game.game_id"
        class="game-item"
        @click="handleOpenGame(game)"
      >
        <img
          :src="getGameImage(game)"
          :alt="game.game_code"
          class="w-full h-auto rounded-lg cursor-pointer"
          @error="setDefaultGameImg"
        />
        <p class="game-name">{{ game.game_name }}</p>
        <q-btn class="btn-play">{{ $t("game.play_now") }}</q-btn>
        <q-btn
          v-if="isGameFavorited(game)"
          class="btn-favorite hide-hover"
          round
          flat
          @click.stop="removeFavorite(game, true)"
        >
          <img :src="iconHeart('heart-btn-active')" alt="" />
        </q-btn>
        <q-btn v-else class="btn-favorite hide-hover" round flat @click.stop="addFavorite(game, true)">
          <img :src="iconHeart('heart-btn')" alt="" />
        </q-btn>
      </div>
    </div>
  </div>
  <CurrencySupportDialog />
  <LaunchGameDialog />
  <CryptoWalletDialog />
</template>
<script lang="ts">
export default {
  name: "PopularLobby"
}
</script>
<script lang="ts" setup>
import { computed, nextTick } from "vue"
import { useQueryClient } from "@tanstack/vue-query"
import { useGame } from "src/common/composables/useGame"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import { useSiteImg } from "app/template/set_amuse/hooks/useSiteImg"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import {
  favoriteIdsToMap,
  isProviderGameFavorited,
  useProviderFavoriteActions
} from "src/common/composables/useProviderFavorites"
import { providerQueryKeys, useProviderFavoriteList, useProviderGames } from "src/common/composables/useProviderQueries"
import { GAME_TYPE, LANGUAGE_CODE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import CryptoWalletDialog from "src/common/components/dialog/CryptoWalletDialog.vue"

const queryClient = useQueryClient()
const { getGameImage, openGame } = useGame()
const { setGameTypeUsing } = useGameTypeStore()
const { iconHeart } = useSiteImg()
const { setDefaultGameImg } = useCommonImg()
const { addFavorite, removeFavorite } = useProviderFavoriteActions()

useProviderGames(GAME_TYPE.Enums.SLOT)
useProviderGames(GAME_TYPE.Enums.FISHING)

const favoriteListQuery = useProviderFavoriteList()
const favoriteMap = computed(() => favoriteIdsToMap(favoriteListQuery.data.value ?? []))

function isGameFavorited(game: Response.GameItem) {
  return isProviderGameFavorited(game.game_id, favoriteMap.value)
}

const allCachedGames = computed(() => {
  const games: Response.GameList = []
  const seenIds = new Set<number>()

  for (const gameTypeId of Object.keys(GAME_TYPE.I18nKeys).map(Number)) {
    const cached = queryClient.getQueryData<Response.GameList>(providerQueryKeys.games(gameTypeId))
    if (!cached?.length) continue

    for (const game of cached) {
      if (seenIds.has(game.game_id)) continue
      seenIds.add(game.game_id)
      games.push(game)
    }
  }

  return games
})

const popularGames = computed(() => allCachedGames.value.filter((game) => game.hot))

const handleOpenGame = async (game: Response.GameItem) => {
  setGameTypeUsing(game.game_type_id)
  await nextTick()
  openGame(
    game.integration_id,
    game.product_code,
    game.game_code,
    game.game_type_id,
    false,
    null,
    LANGUAGE_CODE.Enums.en
  )
}
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "../../assets/css/game.sass"

.game-container
  @apply px-10 pt-5 mx-auto box-border
  max-width: 95rem
  padding-bottom: 7rem
  +iphone-width
    padding-bottom: 5rem
  +pad-width
    @apply px-5
  .title
    @apply mt-6 text-center
    font-size: 2.25rem
    +pad-width
      font-size: 2.25rem
    +phone-width
      @apply mt-2
  .q-separator
    @apply mt-5 mb-10
    background: #5b5b5c
    +phone-width
      @apply mt-2 mb-4
  .game-row
    @apply grid grid-cols-8 gap-4
    +pc-width
      @apply grid-cols-6
    +pad-width
      @apply grid-cols-4
    +phone-width
      @apply grid-cols-3

.game-item
  .btn-favorite
    position: absolute
    top: 0.4rem
    right: 0.4rem
    display: block
    +iphone-width
      display: block
  &:hover
    .btn-favorite
      :deep(.q-focus-helper)
        opacity: 0
        background: transparent
</style>
