<template>
  <div class="game-container">
    <h2 class="title">{{ $t(GAME_TYPE.I18nKeys[gameType as GAME_TYPE.Enums]) }}</h2>
    <q-separator />
    <div class="sub-menu-bar">
      <q-tabs
        ref="tabsRef"
        :model-value="selectedProductCode"
        inline-label
        outside-arrows
        :shrink="false"
        align="left"
        @update:model-value="handleTabClick"
      >
        <q-tab v-for="product in productList" :key="product.product_code" :name="product.product_code">
          <img
            :src="getProductTabImage({ ...product, siteKey: 'set_amuse' })"
            class="tab-img"
            :alt="product.product_name"
            @error="setDefaultProductTabImg"
          />
        </q-tab>
      </q-tabs>
      <game-keyword-search v-model="searchKeyword" v-model:is-focus="searchState.isFocus" class="search-container" />
    </div>
    <CategoryTabs v-model="gameSearchType" />
    <q-virtual-scroll
      ref="virtualScrollRef"
      v-if="showGameList.length > 0"
      :items="gameRows"
      :virtual-scroll-item-size="virtualRowHeight"
      :virtual-scroll-slice-size="virtualScrollSliceSize"
      :virtual-scroll-slice-ratio-before="virtualScrollSliceRatioBefore"
      :virtual-scroll-slice-ratio-after="virtualScrollSliceRatioAfter"
      :scroll-target="resolvedVirtualScrollTarget"
    >
      <template #default="{ item: gameRow, index }">
        <div :key="`game-row-${index}`" class="game-row">
          <div
            v-for="game in gameRow"
            :key="game.game_id"
            class="game-item"
            @click="handleOpenGame(game)"
          >
            <div class="game-image-wrapper">
              <img v-lazy-load="getGameImage(game)" :alt="game.game_code" class="game-img" @error="setDefaultGameImg" />
              <div v-if="game.newly" class="tag-badge tag-new"></div>
              <div v-if="game.hot" class="tag-badge tag-hot"></div>
            </div>
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
      </template>
    </q-virtual-scroll>
  </div>
  <CurrencySupportDialog />
  <LaunchGameDialog />
  <CryptoWalletDialog />
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useSiteImg } from "app/template/set_amuse/hooks/useSiteImg"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useGame } from "src/common/composables/useGame"
import { useGameLobbyVirtualScroll } from "src/common/composables/useGameLobbyVirtualScroll"
import { useProviderGameLobby } from "src/common/composables/useProviderLobby"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useProviderGameLobbyRoute } from "src/common/composables/useProviderGameLobbyRoute"
import { GAME_TAG_TYPE, GAME_TYPE, LANGUAGE_CODE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import CryptoWalletDialog from "src/common/components/dialog/CryptoWalletDialog.vue"
import GameKeywordSearch from "app/template/set_amuse/components/GameKeywordSearch.vue"
import CategoryTabs from "app/template/set_amuse/pages/GameLobby/components/CategoryTabs.vue"

const route = useRoute()
const router = useRouter()
const { openGame, getGameImage, getProductTabImage } = useGame()
const { setGameTypeUsing } = useGameTypeStore()
const { setDefaultGameImg } = useCommonImg()
const { setDefaultProductTabImg, iconHeart } = useSiteImg()
const { isDown, isMobile } = useMediaQuery()

const searchState = ref({ isFocus: false })
const tabsRef = ref<{ $el: HTMLElement } | null>(null)

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

gameSearchType.value = GAME_TAG_TYPE.Enums.New

const rowItemsCount = computed(() => {
  if (isMobile.value) return 3
  // isDown 為 reactive，屬性已自動解包；不可再取 .value
  if (isDown.pad) return 4
  if (isDown.pc) return 6
  return 8
})
const isDesktop = computed(() => !isMobile.value)

const {
  virtualScrollRef,
  virtualRowHeight,
  virtualScrollSliceSize,
  virtualScrollSliceRatioBefore,
  virtualScrollSliceRatioAfter,
  resolvedVirtualScrollTarget,
  gameRows
} = useGameLobbyVirtualScroll(showGameList, isDesktop, { rowItemsCount })

function syncArrowDisabled() {
  const root = tabsRef.value?.$el
  if (!root) return

  const content = root.querySelector(".q-tabs__content")
  const prev = root.querySelector(".q-tabs__arrow--left")
  const next = root.querySelector(".q-tabs__arrow--right")
  if (!content || !prev || !next) return

  const max = content.scrollWidth - content.clientWidth

  prev.classList.toggle("q-tabs__arrow--disabled", content.scrollLeft <= 0)
  next.classList.toggle("q-tabs__arrow--disabled", content.scrollLeft >= max)
}

const handleOpenGame = async (game: Response.GameItem) => {
  setGameTypeUsing(game.game_type_id)
  await nextTick()
  openGame(game.integration_id, game.product_code, game.game_code, "", false, null, LANGUAGE_CODE.Enums.en)
}

function handleTabClick(productCode: number) {
  selectProductCode(productCode)
}

function handleTabsMouse() {
  const tabsContent = document.querySelector(".q-tabs__content") as HTMLElement
  let isMouseDown = false
  let startX = 0

  if (tabsContent) {
    tabsContent.addEventListener("mousedown", (e) => {
      e.preventDefault()
      isMouseDown = true
      startX = e.clientX
    })

    tabsContent.addEventListener("mouseup", (e) => {
      e.preventDefault()
      isMouseDown = false
    })

    tabsContent.addEventListener("mousemove", (e) => {
      if (isMouseDown) {
        if (tabsContent) {
          if (startX > e.clientX) {
            tabsContent.scrollLeft += 20
          } else {
            tabsContent.scrollLeft -= 20
          }
          startX = e.clientX
        }
      }
    })

    tabsContent.addEventListener("mouseleave", () => {
      isMouseDown = false
    })
  }
}

onMounted(async () => {
  await nextTick()
  syncArrowDisabled()
  handleTabsMouse()

  tabsRef.value?.$el
    ?.querySelector(".q-tabs__content")
    ?.addEventListener("scroll", syncArrowDisabled, { passive: true })
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "../../assets/css/game.sass"

.sub-menu-bar
  @apply flex justify-between items-center relative
  margin-bottom: 4.125rem
  +phone-width
    margin-bottom: 1.125rem
  :deep(.q-tabs)
    @apply bg-transparent
    padding-left: 4rem !important
    padding-right: 4rem !important
    width: 70%
    +phone-width
      width: 83%
      padding-left: 0 !important
      padding-right: 0 !important
    .q-tabs__content
      overflow: scroll
    .q-tab
      @apply p-0 mr-3
      background:  url("app/template/set_amuse/assets/images/tabs/bg.png")
      background-size: cover
      min-width: 9rem
      width: 9rem
      height: 4.1875rem
      border-radius: 0.8125rem
      border: 1px solid rgba(255, 255, 255, 0.5)
      overflow:hidden
      &:before
        content: ''
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        background: rgba(0, 0, 0, 0.8)
        pointer-events: none
        border-radius: 0.8125rem
      +phone-width
        min-width: 4.8rem
        width: 4.8rem
        height: 2rem

      &.q-tab--active
        border: 1px solid #EDEDED
        border-radius: .8125rem
        &:before
          background: rgba(0, 0, 0, 0)
      .q-tab__content
        padding: .5rem
        +phone-width
          padding: 0
        .tab-img
          width: 100%
          height: auto
      .q-focus-helper
        opacity: 0.3
        background: #000
        border-radius: .8125rem
      .q-tab__indicator
        display: none
    .q-tabs__arrow
      width: 3.3125rem
      height: 3.3125rem
      border: 1px solid #fff
      border-radius: 50%
      top: .4375rem
      +phone-width
        display: none
  .search-container
    width: 24%
    +phone-width
      width: 3rem
      height: 3rem

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
    @apply grid grid-cols-8 gap-4 mb-4
    +pc-width
      @apply grid-cols-6
    +pad-width
      @apply grid-cols-4
    +phone-width
      @apply grid-cols-3

.game-item
  position: relative

  .game-image-wrapper
    position: relative
    width: 100%

    .game-img
      width: 100%
      height: auto
      display: block

    .tag-badge
      width: 50px
      height: 35px
      left: -14%
      position: absolute
      z-index: 10

      +iphone-width
        width: 50px
        height: 35px
        left: -18%
        position: absolute
        z-index: 10

    .tag-new
      top: 9%
      background-image: url("app/template/set_amuse/assets/images/newtag.png")
      background-size: cover
      background-position: center

      +iphone-width
        top: 9%

    .tag-hot
      top: 9%
      background-image: url("app/template/set_amuse/assets/images/hottag.png")
      background-size: cover
      background-position: center

      +iphone-width
        top: 9%

    .tag-new ~ .tag-hot
      top: calc(9% + 32px)

      +iphone-width
        top: calc(9% + 30px)

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

:deep(.q-tabs__arrow)
  display: flex !important
  opacity: 1
  pointer-events: auto
  +phone-width
    display: none !important

:deep(.q-tabs__arrow--disabled)
  opacity: .35 !important
  pointer-events: none !important

:deep(body.mobile .q-tabs--scrollable.q-tabs--mobile-without-arrows.q-tabs__arrows--outside)
  padding-left: 4rem !important
  padding-right: 4rem !important
</style>
