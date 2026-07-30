<template>
  <div class="w-full">
    <div>
      <!-- TODO: login/register btn OR user avatar/wallet in mobile view -->
      <GuestAuthButtons v-if="showMobileGuestAuthButtons" variant="home" />
      <div v-if="width < 769 && isLogin" class="home-x-spacing">
        <UserMobileWallet />
      </div>
      <div class="home-x-spacing">
        <MobileNav :isNeedPaddingX="false" />
      </div>
      <HomeBanner />
    </div>

    <div class="home-x-spacing">
      <div class="mt-6 phone:mt-0">
        <MarqueeList />
      </div>
    </div>

    <div class="home-content" id="scrollDom" @scroll="handleInnerScroll()">
      <div class="home-content-cms home-x-spacing" v-if="cmsHomeList.length">
        <div v-for="(cmsItem, cmsIndex) in cmsHomeList" :key="cmsIndex" class="game-show-area">
          <div v-if="shouldDisplayDevice(cmsItem)">
            <div class="carousel-header" v-if="shouldShowCarouselHeader(cmsItem)">
              <div class="home-title">
                <q-img
                  v-if="cmsItem.Setting.icon_path"
                  :src="cmsItem.Setting.icon_path"
                  class="home-title-icon"
                  @error="setDefaultProductImg"
                />
                <p class="title-label" v-if="getCmsTitle(cmsItem)">
                  {{ getCmsTitle(cmsItem) }}
                </p>
              </div>

              <div class="title-actions" v-if="isCarousel(cmsItem) && shouldShowActions(cmsItem)">
                <button
                  type="button"
                  class="custom-arrow"
                  :class="{ 'is-disabled': !canNavigateCarousel(cmsIndex, cmsItem, 'prev') }"
                  :disabled="!canNavigateCarousel(cmsIndex, cmsItem, 'prev')"
                  @click="handleCarouselNav(cmsIndex, cmsItem, 'prev')"
                >
                  <span class="custom-arrow-icon" :style="getArrowIconStyle('prev')" aria-hidden="true"></span>
                </button>
                <button
                  type="button"
                  class="custom-arrow"
                  :class="{ 'is-disabled': !canNavigateCarousel(cmsIndex, cmsItem, 'next') }"
                  :disabled="!canNavigateCarousel(cmsIndex, cmsItem, 'next')"
                  @click="handleCarouselNav(cmsIndex, cmsItem, 'next')"
                >
                  <span class="custom-arrow-icon" :style="getArrowIconStyle('next')" aria-hidden="true"></span>
                </button>
              </div>
            </div>
            <template v-if="isCarousel(cmsItem)">
              <ul class="game-list game-list-carousel long">
                <div class="game-carousel">
                  <Carousel
                    :ref="(el: any) => setCarouselRef(cmsIndex, el)"
                    :breakpoints="getBreakpoints(cmsItem)"
                    :wrap-around="false"
                    :transition="500"
                    @slide-start="handleCarouselSlideStart(cmsIndex, $event)"
                    @slide-end="handleCarouselSlideEnd(cmsIndex, $event)"
                  >
                    <Slide v-for="(entrance, entranceIndex) in cmsItem.Entrance" :key="entranceIndex">
                      <CmsGameItem :entrance="entrance" />
                    </Slide>
                  </Carousel>
                </div>
              </ul>
            </template>
            <template v-else>
              <ul class="game-list long">
                <div class="game-grid" :style="getGridStyle(cmsItem)">
                  <div v-for="(entrance, entranceIndex) in cmsItem.Entrance" :key="entranceIndex">
                    <CmsGameItem :entrance="entrance" />
                  </div>
                </div>
              </ul>
            </template>
          </div>
        </div>
      </div>

      <!-- 最新得獎跑馬燈 -->
      <RankBoard class="rank-board" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import HomeBanner from "app/template/set_r027/components/Banner/HomeBanner.vue"
import RankBoard from "app/template/set_r027/components/Carousel/RankBoard.vue"
// import GameTab from "app/template/set_r027/components/Tab/GameTab.vue"
import GuestAuthButtons from "app/template/set_r027/components/GuestAuthButtons.vue"
import MarqueeList from "app/template/set_r027/components/MarqueeList.vue"
import MobileNav from "app/template/set_r027/components/MobileNav.vue"
import UserMobileWallet from "app/template/set_r027/components/UserMobileWallet.vue"
import { useSiteImg } from "app/template/set_r027/hooks/useSiteImg"
import { useQuasar } from "quasar"
import type * as Response from "src/api/response.type"
import { useBanner } from "src/common/composables/useBanner"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import {
  AI_HELPER_EVENT_ROUTES,
  BANNER_POSITION,
  CMS_VIEW_ALL,
  LANGUAGE_TYPE} from "src/common/utils/constants"
import { breakpoints } from "src/common/utils/constants/breakpoints"
import { computed, onMounted, ref } from "vue"
import { Carousel, Slide } from "vue3-carousel"

import CmsGameItem from "./Cms/CmsGameItem.vue"

const { isLogin } = useAuth()
const {
  getBreakpoints,
  shouldDisplayDevice,
  getGridStyle,
  cmsHomeList,
} = useCms()
const { nowLang } = useLanguage()
const $q = useQuasar()
const { handleAIHelperRouteEvent } = useAIHelperEvent()
const { svgIcon } = useSiteImg()
const { width } = useMediaQuery()
const showMobileGuestAuthButtons = computed(() => width.value < breakpoints.phone)
const arrowIconStyleMap = {
  prev: {
    maskImage: `url(${svgIcon("game-arrow-left")})`,
    WebkitMaskImage: `url(${svgIcon("game-arrow-left")})`,
  },
  next: {
    maskImage: `url(${svgIcon("game-arrow-right")})`,
    WebkitMaskImage: `url(${svgIcon("game-arrow-right")})`,
  },
} as const

const getCmsTitle = (cmsItem: Response.CmsItem) => {
  const title = cmsItem?.Setting?.lang?.[nowLang.value as LANGUAGE_TYPE.Enums]
  return typeof title === "string" ? title.trim() : ""
}

const isCarousel = computed(() => (cmsItem: Response.CmsItem) => {
  return cmsItem.Setting.payload.arrangement === 0
})

// 判斷是否顯示箭頭：slide 數量 > CMS 設定「每頁顯示數量」才顯示
const shouldShowNavigation = computed(() => (cmsItem: Response.CmsItem) => {
  const totalSlides = cmsItem.Entrance?.length ?? 0
  const breakpoints = getBreakpoints.value(cmsItem)

  // 700 與 300 使用同一份設定（mobile），>= 1024 才切到 pc
  const itemsToShow = (width.value >= 1024 ? breakpoints[1024] : breakpoints[300])?.itemsToShow ?? 1

  return totalSlides > itemsToShow
})

const shouldShowActions = (cmsItem: Response.CmsItem) => {
  return cmsItem?.Setting?.payload?.view_all === CMS_VIEW_ALL.Enums.SHOW || shouldShowNavigation.value(cmsItem)
}

const shouldShowCarouselHeader = (cmsItem: Response.CmsItem) => {
  return Boolean(cmsItem?.Setting?.icon_path) || Boolean(getCmsTitle(cmsItem)) || shouldShowActions(cmsItem)
}

const innerScrollTop: any = ref(0)

const handleInnerScroll = () => {
  const element = document.getElementById("scrollDom")
  innerScrollTop.value = element?.scrollTop
}

const carouselRefs = ref<Record<number, any>>({})
const carouselSlideState = ref<Record<number, number>>({})

const setCarouselRef = (index: number, el: any) => {
  if (el) {
    carouselRefs.value[index] = el
    return
  }

  delete carouselRefs.value[index]
  delete carouselSlideState.value[index]
}

const getCarouselItemsToShow = (cmsItem: Response.CmsItem) => {
  const carouselBreakpoints = getBreakpoints.value(cmsItem)
  const itemsToShow = (width.value >= 1024 ? carouselBreakpoints[1024] : carouselBreakpoints[300])?.itemsToShow
  const parsedItemsToShow = Number(itemsToShow)

  return Number.isFinite(parsedItemsToShow) && parsedItemsToShow > 0 ? parsedItemsToShow : 1
}

const getCarouselCurrentSlide = (cmsIndex: number) => {
  return Math.max(carouselSlideState.value[cmsIndex] ?? 0, 0)
}

const getCarouselMaxSlide = (cmsItem: Response.CmsItem) => {
  return Math.max((cmsItem.Entrance?.length ?? 0) - getCarouselItemsToShow(cmsItem), 0)
}

const canNavigateCarousel = (cmsIndex: number, cmsItem: Response.CmsItem, direction: "prev" | "next") => {
  if (!shouldShowNavigation.value(cmsItem)) return false

  const currentSlide = getCarouselCurrentSlide(cmsIndex)
  const maxSlide = getCarouselMaxSlide(cmsItem)

  return direction === "prev" ? currentSlide > 0 : currentSlide < maxSlide
}

const updateCarouselSlideState = (cmsIndex: number, slideIndex: number) => {
  carouselSlideState.value[cmsIndex] = Math.max(slideIndex, 0)
}

const handleCarouselSlideStart = (
  cmsIndex: number,
  payload: {
    slidingToIndex: number
  }
) => {
  updateCarouselSlideState(cmsIndex, payload.slidingToIndex)
}

const handleCarouselSlideEnd = (
  cmsIndex: number,
  payload: {
    currentSlideIndex: number
  }
) => {
  updateCarouselSlideState(cmsIndex, payload.currentSlideIndex)
}

const getArrowIconStyle = (direction: keyof typeof arrowIconStyleMap) => {
  return arrowIconStyleMap[direction]
}

const handleCarouselNav = (cmsIndex: number, cmsItem: Response.CmsItem, direction: "prev" | "next") => {
  if (!canNavigateCarousel(cmsIndex, cmsItem, direction)) return

  const carousel = carouselRefs.value[cmsIndex]
  if (!carousel) return

  if (direction === "prev") {
    carousel.prev()
  } else {
    carousel.next()
  }
}

const { handleBannerList } = useBanner()
const { setDefaultProductImg } = useCommonImg()

onMounted(async () => {
  handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.HOME)
  await handleBannerList(BANNER_POSITION.Enums.Home)
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_r027/assets/css/_variable.scss"
@import "app/template/set_r027/assets/css/common.scss"

.home-game-tab
  width: 100% !important
  max-width: 100%
  margin-left: auto
  margin-right: auto

.home-x-spacing
  width: 100%
  box-sizing: border-box
  margin-left: auto
  margin-right: auto
  max-width: 1200px
  padding-left: 0 !important
  padding-right: 0 !important

  // 1000px–1439px: container width 923px
  @media (max-width: 1439px) and (min-width: 1000px)
    max-width: 923px

  // 769px–991px: container width 889px
  @media (max-width: 991px) and (min-width: 769px)
    max-width: 889px
    padding-left: 0 !important
    padding-right: 0 !important

  // <= 768px: don't limit width; padding 8px
  @media (max-width: 768px)
    max-width: none
    padding-left: 8px !important
    padding-right: 8px !important

.home-layout
  width: 100%
  max-width: 75rem
  height: auto
  position: relative
  padding: 0 0 1.875rem
  margin: 0 auto
  +phone-width
    padding: 0 0.875rem

.game-list
  .carousel
    width: 100%
    @include iphone-width
      min-width: 100%
.game-list.game-list-carousel
  position: relative
  display: flex
  align-items: center
  @apply w-screen overflow-hidden
  +iphone-width
    padding-right: 0 !important
    ::v-deep(.carousel__viewport)
      @apply overflow-visible
  // layout style
.home-content
  +setFlex
  flex-direction: column
  .home-content-cms
    width: 100%
  .game-show-area
    +setFlex
    align-self: stretch
    flex-direction: column
    // margin-top: 2rem
    width: 100%
    max-width: 100%
    margin: 0 auto
    +phone-width
      padding: 0
      & + .game-show-area
        margin-top: 12px
    &.provider
      padding-left: 0
      padding-right: 0
    .game-title
      width: 90%
      margin: 0 auto
      height: 4vw
      display: flex
      justify-content: flex-start
      align-items: center
      +pad-width
        height: 40px
      +iphone-width
        height: 8vw
        width: 100%
        padding: 0 5.5vw
      .title-icon
        width: 0.5vw
        height: 1.5vw
        background: $yellow-active
        +pad-width
          width: 5px
          height: 15px
        +iphone-width
          width: 1.2vw
          height: 3.4vw
    .game-list
      +setFlex
      list-style: none
      margin: 0
      padding-top: 0
      width: 100%
      max-width: 87.5rem
      // min-height: 215px
      position: relative
      // border-radius: 24px
      // background: $background-light-color
      +iphone-width
        display: flex
        background: transparent
        padding-top: 0
        width: 98vw
        min-height: 100px
        border-radius: 0px
        min-width: 0
      &.product
        width: 90%
        margin: 0 auto
        @apply grid grid-cols-2 gap-2
        +iphone-width
          width: 100%
          @apply grid-cols-1
        li
          width: 100%
          .game-box
            position: relative
            display: inline-block
            margin: 0 1% 1% 0
            padding: 0
            width: 100%
            cursor: pointer
            border-radius: 23px
            +iphone-width
              margin: 0
              width: 91vw
              border-radius: 12px
            .play-now
              position: absolute
              top: 8vw
              left: 2vw
              +iphone-width
                top: 24vw
                left: 6vw
            :deep(.q-focus-helper)
              opacity: 0 !important
      &.long
        width: 100%
        margin-bottom: 0px
        +pc-width
          width: 100%
        +iphone-width
          width: 100%
          padding-bottom: 0
        img
          +iphone-width
            width: 25vw
          border-radius: 0
      &.game-list-carousel.long:not(:has(.carousel-header))
        padding: 0px !important
        .game-carousel
          padding: 0px
          width: 100% !important
          :deep(.carousel__slide)
            margin: 0
            display: block !important
          :deep(.game-img)
            width: 100%
            height: 100%
            object-fit: cover
      &.join
          @apply grid grid-cols-3 gap-3
          li
            margin-right: 1vw
            img
              border-radius: .625rem
            &:last-child
              margin-right: 0
          +iphone-width
            width: 98vw
      img
        width: 100%
        height: 100%
        +pad-width
          width: 100%
        +iphone-width
          width: 91vw
    .provider-list
      @apply w-full bg-black flex overflow-auto gap-3
      color: $neutral01
      padding-left: 4.5vw
      padding-right: 4.5vw
      padding-top: .75rem
      padding-bottom: .75rem
      max-width: 100vw
      scrollbar-width: none
      -ms-overflow-style: none
      .provider-img
        width: 8.5rem
        height: 3rem
        max-width: 8.5rem
  .download-area
    +setFlex
    width: 100%
    box-sizing: border-box
    margin-left: auto
    margin-right: auto
    max-width: 1200px
    padding-left: 0
    padding-right: 0

    // 1000px–1439px: container width 923px
    @media (max-width: 1439px) and (min-width: 1000px)
      max-width: 923px

    // 769px–991px: container width 889px
    @media (max-width: 991px) and (min-width: 769px)
      max-width: 889px
      padding-left: 0 !important
      padding-right: 0 !important

    // <= 768px: don't limit width; padding 8px
    @media (max-width: 768px)
      max-width: none
      padding-left: 8px !important
      padding-right: 8px !important

    .download-main
      width: 100%
      height: auto
      margin: 50px 0
      background-size: 100%
      background-repeat: no-repeat
      background-image: url('../../assets/images/home/download.png')
      .article
        display: flex
        align-items: flex-start
        -webkit-box-pack: center
        justify-content: center
        flex-flow: column
        font-family: "OpenSans"
        @apply py-10
        h1
          font-family: "OpenSans"
          font-weight: 890
          font-size: 3vw
          line-height: 3vw
          letter-spacing: 0
          color: $neutral01
          margin-bottom: 10px
        h5
          font-family: "OpenSans"
          font-weight: 510
          font-size: 1.2vw
          line-height: 1.5vw
          color: $neutral01
          text-transform: capitalize
        p
          font-weight: 400
          font-size: 1vw
          line-height: 1.5vw
          width: 50%
          letter-spacing: 0.14px
          color: $neutral01
          text-transform: capitalize
          margin-top: 13px

// cms custom style
.game-show-area
  > div
    @apply w-full
  .carousel-header
    width: 100%
    max-width: 75rem
    margin: 24px auto 12px
    @apply flex items-center justify-between gap-3
    +iphone-width
      margin: 0rem auto 0.5rem

  .home-title
    @apply flex items-center gap-1 justify-start
    min-width: 0
  .title-actions
    @apply flex items-center gap-2
  // Keep arrow button look consistent with the previous carousel overlay controls
  .custom-arrow
    width: 40px
    height: 40px
    color: var(--icon-03)
    border-radius: 4px
    overflow: hidden
    margin: 0 !important
    padding: 0
    border: 0
    background: var(--icon-bg-04)
    display: flex
    align-items: center
    justify-content: center
    transition: background-color 0.2s ease
    &:hover:not(:disabled)
      background: var(--icon-bg-04)
    &:disabled,
    &.is-disabled
      background: transparent
      cursor: default
    .custom-arrow-icon
      width: 0.6875rem !important
      height: 0.75rem
      background-color: currentColor
      mask-repeat: no-repeat
      mask-position: center
      mask-size: contain
      -webkit-mask-repeat: no-repeat
      -webkit-mask-position: center
      -webkit-mask-size: contain
  .home-title-icon
    // 仿okbet 初始樣式
    width: 28px
    height: 28px
  .title-label
    font-size: 20px
    font-style: normal
    color: $neutral01
    font-weight: 700
    line-height: normal
    height: auto
    padding-right: 0 0.5vw
    margin-right: 0.5vw
    +iphone-width
      color: $neutral01
      font-weight: 700
      font-family: Helvetica
.game-carousel
  width: 100%
  .carousel
    padding-top: 0
    position: inherit
    ::v-deep(.carousel__track)
      .carousel__slide
        justify-content: flex-start
  +iphone-width
    .carousel
      padding-top: 0
    ::v-deep(.carousel__track)
      .carousel__slide
        justify-content: flex-start
        @apply pr-2

  @media (max-width: 575px)
    ::v-deep(.carousel__track)
      .carousel__slide
        padding-right: 0 !important
.game-grid
  @apply grid gap-3
  padding-top: 0
  grid-template-columns: repeat(var(--grid-columns), 1fr)
  +iphone-width
    @apply grid gap-4
    padding-top: 0
</style>
