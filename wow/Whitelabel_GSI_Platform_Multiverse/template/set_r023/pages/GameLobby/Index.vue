<template>
  <div class="game-lobby-wrapper">
    <MobileNavCMS v-if="isLargeTablet" />
    <div class="search-wrapper">
      <SearchInput />
      <div v-if="isLargeTablet" class="provider-btn" @click="toggleSideProviders">
        <template v-if="!showSideProviders">
          <q-img
            :src="svgIcon(`provider-left${$q.dark.isActive ? '-dark' : ''}`)"
            alt="setting provider"
            class="mr-[0.1875rem]"
          />
          <q-img :src="svgIcon(`provider-right${$q.dark.isActive ? '-dark' : ''}`)" alt="setting provider" />
        </template>
        <q-img v-else :src="svgIcon(`provider-side${$q.dark.isActive ? '-dark' : ''}`)" alt="setting provider" />
      </div>
    </div>
    <GameBanner />
    <TagList v-if="showSideProviders" />
    <div class="game-content" :class="{ 'side-providers': showSideProviders }">
      <Providers :is-vertical="showSideProviders" />
      <div class="right-content">
        <TagList v-if="!showSideProviders" />
        <GameList />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch, provide } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { useProviderGameLobby } from "src/common/composables/useProviderLobby"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { useProviderGameLobbyRoute } from "src/common/composables/useProviderGameLobbyRoute"
import { SearchGameKey, SearchGame } from "app/template/set_r023/utils/constants/symbols"
import { useSiteImg } from "app/template/set_r023/hooks/useSiteImg"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { BANNER_POSITION, AI_HELPER_EVENT_ROUTES, GAME_TYPE } from "src/common/utils/constants"
import GameBanner from "app/template/set_r023/components/Banner/GameBanner.vue"
import SearchInput from "app/template/set_r023/pages/GameLobby/SearchInput.vue"
import Providers from "app/template/set_r023/pages/GameLobby/Providers.vue"
import TagList from "app/template/set_r023/pages/GameLobby/TagList.vue"
import GameList from "app/template/set_r023/pages/GameLobby/GameList.vue"
import MobileNavCMS from "app/template/set_r023/components/MobileNavCMS/Index.vue"

const route = useRoute()
const router = useRouter()
const { handleBannerList } = useBanner()
const { gameTagList } = useGame()
const { handleAIHelperRouteEvent } = useAIHelperEvent()
const { svgIcon } = useSiteImg()
const { isLargeTablet } = useMediaQuery()

const { safeGameType, routeIntegrationId, routeProductCode } = useProviderGameLobbyRoute(route, router)
const gameType = safeGameType


const {
  selectedProductCode,
  productList,
  searchKeyword,
  showGameList,
  selectProductCode,
  isGameFavorited,
  addFavorite,
  removeFavorite,
  gameSearchType
} = useProviderGameLobby(router, safeGameType, { routeIntegrationId, routeProductCode })

const showSideProviders = ref(false)

const searchGame: SearchGame = {
  gameTagList,
  gameSearchType,
  searchKeyword,
  showGameList,
  productList,
  selectedProductCode,
  selectProductCode,
  isGameFavorited,
  addFavorite,
  removeFavorite,
  gameType
}

provide(SearchGameKey, searchGame)

const toggleSideProviders = () => {
  if (isLargeTablet.value) {
    showSideProviders.value = !showSideProviders.value
  }
}

const getBanner = async () => {
  await handleBannerList(BANNER_POSITION.Enums.ProductLobby, gameType.value)
}

watch(
  () => isLargeTablet.value,
  (isMobile) => {
    // 因應客戶需求調整，PC固定在上方顯示、H5固定在側邊顯示
    showSideProviders.value = isMobile
  },
  { immediate: true }
)

onMounted(async () => {
  handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.GAME_LOBBY)
  await getBanner()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r023/assets/css/_variable.scss";

.game-lobby-wrapper {
  @apply w-full mx-auto flex flex-col gap-[1.25rem];
  @apply max-w-[87.5rem] py-[.625rem] px-[.625rem];

  @include pad-large-width {
    @apply gap-[.625rem];
  }
}

.game-content {
  @apply flex flex-col gap-[1.25rem];

  &.side-providers {
    @apply flex-row gap-[.625rem];
  }

  .right-content {
    @apply w-full flex flex-col gap-[1.25rem];
  }
}

.search-wrapper {
  @apply flex items-center gap-[.4375rem];

  .provider-btn {
    width: 2rem;
    height: 2rem;
    border-radius: 100%;
    background: var(--neutral-01);
    cursor: pointer;
    padding: 0.4375rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .q-img {
    width: 100%;
  }
}
</style>
