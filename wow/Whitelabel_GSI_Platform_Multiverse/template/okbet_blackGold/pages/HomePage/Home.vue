<template>
  <div class="w-full">
    <HomeBanner />
  </div>

  <div class="home-layout">
    <div class="home-x-spacing">
      <MarqueeList />
    </div>

    <div class="home-x-spacing">
      <MobileNav :isNeedPaddingX="false" />
    </div>

    <div class="home-content" id="scrollDom" @scroll="handleInnerScroll()">
      <div class="home-content-cms home-x-spacing" v-if="cmsHomeList.length">
        <div v-for="(cmsItem, cmsIndex) in cmsHomeList" :key="cmsIndex" class="game-show-area">
          <template v-if="shouldDisplayDevice(cmsItem)">
            <template v-if="isCarousel(cmsItem)">
              <ul class="game-list game-list-carousel long">
                <div class="carousel-header" v-if="shouldShowCarouselHeader(cmsItem)">
                  <div class="home-title">
                    <q-img
                      v-if="cmsItem.Setting.icon_path"
                      :src="cmsItem.Setting.icon_path"
                      class="home-title-icon"
                      @error="setDefaultProductImg"
                    />

                    <div class="title-label-area">
                      <p class="title-label" v-if="getCmsTitle(cmsItem)">
                        {{ getCmsTitle(cmsItem) }}
                      </p>
                      <div class="title-actions" v-if="shouldShowActions(cmsItem)">
                        <q-btn
                          v-if="cmsItem.Setting.payload?.view_all === CMS_VIEW_ALL.Enums.SHOW"
                          :to="{ name: 'CmsHome', params: { cmsId: cmsItem.id } }"
                          flat
                          :label="$t('common.btn.viewAll')"
                          class="view-all"
                        />
                        <button
                          v-if="shouldShowNavigation(cmsItem)"
                          class="carousel-nav-btn carousel-nav-prev"
                          @click="handleCarouselNav(cmsIndex, 'prev')"
                        >
                          <svg class="carousel-nav-icon" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M15 18L9 12L15 6"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          v-if="shouldShowNavigation(cmsItem)"
                          class="carousel-nav-btn carousel-nav-next"
                          @click="handleCarouselNav(cmsIndex, 'next')"
                        >
                          <svg class="carousel-nav-icon" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M9 18L15 12L9 6"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="game-carousel">
                  <Carousel
                    :ref="(el: any) => setCarouselRef(cmsIndex, el)"
                    :breakpoints="getBreakpoints(cmsItem)"
                    :transition="500"
                  >
                    <Slide v-for="(entrance, entranceIndex) in cmsItem.Entrance" :key="entranceIndex">
                      <CmsGameItem :entrance="entrance" />
                    </Slide>
                  </Carousel>
                </div>
              </ul>
            </template>

            <template v-else>
              <ul class="game-list long flex">
                <div class="carousel-header" v-if="shouldShowCarouselHeader(cmsItem)">
                  <div class="home-title">
                    <q-img
                      v-if="cmsItem.Setting.icon_path"
                      :src="cmsItem.Setting.icon_path"
                      class="home-title-icon"
                      @error="setDefaultProductImg"
                    />

                    <div class="title-label-area">
                      <p class="title-label" v-if="getCmsTitle(cmsItem)">
                        {{ getCmsTitle(cmsItem) }}
                      </p>
                      <div class="title-actions" v-if="shouldShowActions(cmsItem)">
                        <q-btn
                          v-if="cmsItem.Setting.payload?.view_all === CMS_VIEW_ALL.Enums.SHOW"
                          :to="{ name: 'CmsHome', params: { cmsId: cmsItem.id } }"
                          flat
                          :label="$t('common.btn.viewAll')"
                          class="view-all"
                        />
                        <button
                          v-if="shouldShowNavigation(cmsItem)"
                          class="carousel-nav-btn carousel-nav-prev"
                          @click="handleGridNav(cmsIndex, 'prev')"
                        >
                          <svg class="carousel-nav-icon" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M15 18L9 12L15 6"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          v-if="shouldShowNavigation(cmsItem)"
                          class="carousel-nav-btn carousel-nav-next"
                          @click="handleGridNav(cmsIndex, 'next')"
                        >
                          <svg class="carousel-nav-icon" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M9 18L15 12L9 6"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="game-grid" :ref="(el: any) => setGridRef(cmsIndex, el)" :style="getGridStyle(cmsItem)">
                  <div v-for="(entrance, entranceIndex) in cmsItem.Entrance" :key="entranceIndex" class="grid-item">
                    <CmsGameItem :entrance="entrance" />
                  </div>
                </div>
              </ul>
            </template>
          </template>
        </div>
      </div>

      <!-- download -->
      <div class="download-area relative">
        <div class="download-main">
          <!-- <img :src="downloadImg" alt="" /> -->
          <div class="article">
            <h1>{{ $t("slogan.title1") }}</h1>
            <h5>{{ $t("slogan.subtitle1") }}</h5>
            <p>{{ $t("slogan.content1") }}</p>
          </div>
        </div>
      </div>

      <!-- 最新得獎跑馬燈 -->
      <div :class="cx('w-full', FLEX_JUSTIFY_CENTER)">
        <Leaderboard v-if="envInfo.leaderboard_enabled" class="rank-board" variant="home" />
      </div>
    </div>
  </div>
  <FooterArea />
</template>

<script lang="ts" setup>
import HomeBanner from "app/template/okbet_blackGold/components/Banner/HomeBanner.vue"
import FooterArea from "app/template/okbet_blackGold/components/Footer/Index.vue"
import MarqueeList from "app/template/okbet_blackGold/components/MarqueeList/Index.vue"
import MobileNav from "app/template/okbet_blackGold/components/MobileNav.vue"
import type * as Response from "src/api/response.type"
import Leaderboard from "src/common/components/Leaderboard/Index.vue"
import { useBanner } from "src/common/composables/useBanner"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { BANNER_POSITION, CMS_VIEW_ALL,LANGUAGE_TYPE } from "src/common/utils/constants"
import { FLEX_JUSTIFY_CENTER } from "src/common/utils/constants/styles"
import { cx } from "src/common/utils/cx"
import { useEnvInfoStore } from "src/stores/envStore"
import { computed, onMounted, ref } from "vue"
import { Carousel, Slide } from "vue3-carousel"

import CmsGameItem from "./Cms/CmsGameItem.vue"
const { width } = useMediaQuery()
const { envInfo } = useEnvInfoStore()

const {
  getBreakpoints,
  shouldDisplayDevice,
  getGridStyle,
  cmsHomeList,
} = useCms()
const { nowLang } = useLanguage()

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

const { handleBannerList } = useBanner()
const { setDefaultProductImg } = useCommonImg()

const carouselRefs = ref<Record<number, any>>({})
const setCarouselRef = (index: number, el: any) => {
  if (el) {
    carouselRefs.value[index] = el
  }
}

const handleCarouselNav = (cmsIndex: number, direction: "prev" | "next") => {
  const carousel = carouselRefs.value[cmsIndex]
  if (carousel) {
    if (direction === "prev") {
      carousel.prev()
    } else {
      carousel.next()
    }
  }
}

const gridRefs = ref<Record<number, HTMLElement | null>>({})

const setGridRef = (index: number, el: HTMLElement | null) => {
  if (el) {
    gridRefs.value[index] = el
  }
}

const handleGridNav = (cmsIndex: number, direction: "prev" | "next") => {
  const gridElement = gridRefs.value[cmsIndex]
  if (gridElement) {
    // Get the first grid item to calculate its actual width
    const firstItem = gridElement.querySelector(".grid-item") as HTMLElement
    if (!firstItem) return

    const itemWidth = firstItem.getBoundingClientRect().width

    const computedStyle = window.getComputedStyle(gridElement)
    const gap = computedStyle.gap || computedStyle.columnGap
    const gapValue = parseFloat(gap) || 0

    const scrollAmount = itemWidth + gapValue

    if (direction === "prev") {
      gridElement.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    } else {
      gridElement.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }
}

onMounted(async () => {
  await handleBannerList(BANNER_POSITION.Enums.Home)
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/okbet_blackGold/assets/css/button.scss"

.home-x-spacing
  width: 100%
  box-sizing: border-box
  margin-left: auto
  margin-right: auto
  max-width: 1400px
  padding-left: 0 !important
  padding-right: 0 !important

  // 1000px–1439px: container width 923px
  @media (max-width: 1439px) and (min-width: 1000px)
    max-width: 923px

  // < 992px: don't limit width; padding 20px
  @media (max-width: 991px)
    max-width: none
    padding-left: 20px !important
    padding-right: 20px !important

  // < 768px: don't limit width; padding 8px
  @media (max-width: 767px)
    padding-left: 8px !important
    padding-right: 8px !important

.home-layout
  width: 100%
  height: auto
  padding-top: 0
  position: relative
  // large PC only (>= 1441px)
  @media (min-width: 1201px)
    padding-top: 24px

.game-list
  .carousel
    width: 100%
    @include iphone-width
      min-width: 100%
  // Exclude carousel lists from general arrow styles
  &:not(.game-list-carousel)
    :deep(.carousel__prev)
      color: #fff
      backdrop-filter: blur(2px)
      border-radius: 50%
      text-indent: -100px
      overflow: hidden
      background: #343434
      left: 0vw
      opacity: 92%
      +iphone-width
        left: 0vw
      &:hover
        background: #D0D0D0
    :deep(.carousel__next)
      color: #fff
      border-radius: 50%
      background: #343434
      right: 0vw
      opacity: 92%
      &:hover
        background: #D0D0D0
.game-list.game-list-carousel.long
  @apply w-full flex flex-col
  position: relative
  overflow-x: hidden
  overflow-y: visible
  // Add padding for first/last carousel items: 18px + 6px margin = 24px at edges
  .carousel-header
    @apply flex items-center justify-start w-full relative
    margin-bottom: 24px
    +iphone-width
      margin-bottom: 8px
      padding: 0px
    .home-title
      margin: 0
      +iphone-width
        margin: 0
    .carousel-nav-buttons
      @apply flex items-center gap-2
      position: absolute
      right: 0px
      top: 0
      +iphone-width
        gap: 4px
    .carousel-nav-btn
      @apply flex items-center justify-center
      width: 32px
      height: 32px
      border-radius: 4px
      background: #00000099
      color: #FFFFFF
      border: none
      cursor: pointer
      padding: 0
      transition: background 0.2s ease
      &:hover
        background: #D0D0D0
      &:active
        background: #B0B0B0
      +iphone-width
        width: 24px
        height: 24px
      .carousel-nav-icon
        width: 24px
        height: 24px
        display: block
        stroke: currentColor
        +iphone-width
          width: 12px
          height: 12px
  // Apply original navigation button styles when .carousel-header doesn't exist
  &:not(:has(.carousel-header))
    .game-carousel
      :deep(.carousel__prev)
        color: #fff
        backdrop-filter: blur(2px)
        border-radius: 50%

        overflow: hidden
        background: rgba(#BEC7DC, 0.6)
        left: 0vw
        display: flex !important
        align-items: center !important
        justify-content: center !important
        opacity: 1 !important
        visibility: visible !important
        z-index: 10 !important
        +iphone-width
          left: 0vw
          width: 24px !important
          height: 24px !important
        &:hover
          background: #D0D0D0
        .carousel__icon
          fill: currentColor
          width: 20px !important
          height: 20px !important
          +iphone-width
            width: 16px !important
            height: 16px !important
      :deep(.carousel__next)
        color: #fff
        border-radius: 50%
        background: rgba(#BEC7DC, 0.6)
        right: 0vw
        display: flex !important
        align-items: center !important
        justify-content: center !important
        opacity: 1 !important
        visibility: visible !important
        z-index: 10 !important
        +iphone-width
          width: 24px !important
          height: 24px !important
        &:hover
          background: #D0D0D0
        .carousel__icon
          fill: currentColor
          width: 20px !important
          height: 20px !important
          +iphone-width
            width: 16px !important
            height: 16px !important
  // Only apply new navigation button styles when .carousel-header (with .home-title) exists
  &:has(.carousel-header)
    .game-carousel
      padding: 0px
      position: relative
      overflow: visible
      // Position navigation buttons in top right corner (aligned with header)
      :deep(.carousel)
        position: relative
      :deep(button.carousel__prev),
      :deep(button.carousel__next)
        width: 32px !important
        height: 32px !important
        border-radius: 4px !important
        background: #00000099 !important
        color: #FFFFFF !important
        top: -56px !important
        left: auto !important
        right: auto !important
        text-indent: 0 !important
        overflow: visible !important
        display: flex !important
        align-items: center !important
        justify-content: center !important
        z-index: 10 !important
        cursor: pointer !important
        &:hover
          background: #D0D0D0 !important
        .carousel__icon
          fill: #FFFFFF !important
          color: #FFFFFF !important
          width: 24px !important
          height: 24px !important
          display: block !important
          margin: 0 !important
      :deep(button.carousel__prev)
        right: 40px !important
      :deep(button.carousel__next)
        right: 0 !important
      +iphone-width
        :deep(button.carousel__prev),
        :deep(button.carousel__next)
          width: 24px !important
          height: 24px !important
          top: -32px !important
          .carousel__icon
            fill: #FFFFFF !important
            color: #FFFFFF !important
            width: 12px !important
            height: 12px !important
        :deep(button.carousel__prev)
          right: 28px !important
      :deep(.carousel__viewport)
        overflow: hidden
  @media (max-width: 767px)
    &:has(.carousel-header)
      .game-carousel
        padding: 0 !important
.game-list.long
  @apply w-full overflow-hidden
  // layout style
  // Styles for grid template with carousel-header
  .carousel-header
    @apply flex items-center justify-start w-full relative
    margin-bottom: 24px
    +iphone-width
      margin-bottom: 8px
      padding: 0px
    .home-title
      margin: 0
      +iphone-width
        margin: 0
      .carousel-nav-buttons
        @apply flex items-center gap-2
        position: absolute
        right: 0px
        top: 0
        +iphone-width
          gap: 4px
        .carousel-nav-btn
          @apply flex items-center justify-center
          width: 32px
          height: 32px
          border-radius: 4px
          background: #00000099
          color: #FFFFFF
          border: none
          cursor: pointer
          padding: 0
          transition: background 0.2s ease
          &:hover
            background: #D0D0D0
          &:active
            background: #B0B0B0
          +iphone-width
            width: 24px
            height: 24px
          .carousel-nav-icon
            width: 24px
            height: 24px
            display: block
            stroke: currentColor
            +iphone-width
              width: 12px
              height: 12px

  // Grid layout styles (when arrangement !== 0)
  .game-grid
    @apply w-full flex gap-1
    flex-direction: row
    flex-wrap: wrap
    overflow-x: visible
    overflow-y: visible
    // 12px gap for pad and PC views
    @media (min-width: 769px)
      gap: 12px

  .grid-item
    // Calculate width dynamically based on --grid-columns from API
    // Formula: (100% - (gap * (columns - 1))) / columns
    flex: 0 0 calc((100% - (4px * (var(--grid-columns, 4) - 1))) / var(--grid-columns, 4))
    min-width: 0
    @media (min-width: 769px)
      flex: 0 0 calc((100% - (12px * (var(--grid-columns, 4) - 1))) / var(--grid-columns, 4))
    .game-item
      margin: 0

.home-content
  +setFlex
  flex-direction: column
  width: 100%
  .home-content-cms
    width: 100%
  .game-show-area
    +setFlex
    flex-direction: column
    align-self: stretch
    width: 100%
    max-width: 100%
    margin: 0 auto

    +iphone-width
      padding: 0
      & + .game-show-area
        margin-top: 12px
    &.provider
      padding-left: 0
      padding-right: 0
      margin: 0 auto
      display: flex
      justify-content: flex-start
      align-items: center
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
      justify-content: space-between
      list-style: none
      margin: 0 0
      padding: 24px 0
      width: 100%
      position: relative
      border-radius: 24px
      background: $primary-black-color
      +pc-width
        width: 100%
      +iphone-width
        display: inline-block
        background: transparent
        width: 98vw
        min-height: auto
        padding: 0 0rem
        border-radius: 0px
        min-width: 0
      &.product
        width: 100%
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
        margin-bottom: 24px
        // 24px padding for PC and pad views only
        @media (min-width: 769px)
          padding-left: 24px
          padding-right: 24px
        +pc-width
          width: 100%
        +iphone-width
          width: 100%
          padding-bottom: 0
          margin-bottom: 0rem
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
        // margin-right: 1vw
        // max-width: 500px
        width: 100%
        height: 100%
        +pad-width
          width: 100%
        +iphone-width
          width: 91vw
        // max-width: 200px
    .provider-list
      @apply w-full bg-black text-white flex  overflow-auto gap-3
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
    max-width: 1400px
    padding-left: 0
    padding-right: 0

    // 1000px–1439px: container width 923px
    @media (max-width: 1439px) and (min-width: 1000px)
      max-width: 923px

    // < 992px: don't limit width; padding 20px
    @media (max-width: 991px)
      max-width: none
      padding-left: 20px
      padding-right: 20px

    // < 768px: don't limit width; padding 8px
    @media (max-width: 767px)
      padding-left: 8px
      padding-right: 8px
    margin-bottom: 24px
    flex-direction: column
    +iphone-width
      display: none
    .download-main
      @apply w-full min-h-[343px]
      @apply bg-center bg-[size:100%_auto] bg-no-repeat
      background-image: url('../../assets/images/home/download.png')
      box-sizing: border-box
      height: auto
      display: flex
      align-items: center
      .article
        @apply py-0 w-1/2
        display: flex
        align-items: flex-start
        -webkit-box-pack: center
        justify-content: center
        flex-flow: column
        font-family: "OpenSans"
        h1
          @apply text-[2.5rem] phone:text-2xl iphone:text-xl leading-none font-black
          font-family: "OpenSans"
          letter-spacing: 0
          color: #fff
          margin-bottom: 10px
        h5
          @apply text-lg phone:text-base iphone:text-sm leading-[1.2] font-medium
          font-family: "OpenSans"
          color: #fff
        p
          @apply text-base phone:text-sm iphone:text-xs leading-[1.5] font-normal
          letter-spacing: 0.14px
          color: #fff
          margin-top: 13px

// cms custom style
.game-show-area
  > div
    @apply w-full
  .home-title
    width: 100%
    margin: 0rem auto 24px auto
    @apply flex items-center gap-1 justify-start
    +pc-width
      width: 100%
    +iphone-width
      min-height: 24px !important
      margin-bottom: 8px
      padding: 0px
  &:first-child
    .home-title
      +iphone-width
        margin: 0px 0px 8px 0px
  .home-title-icon
    @apply w-[1.5vw] h-[1.5vw]
    // 仿okbet 初始樣式
    min-width: 25px
    min-height: 25px
    @include iphone-width
      @apply w-[1rem] h-[1rem] min-w-[1rem] min-h-[1rem]
  .title-label-area
    @apply flex items-center justify-between w-full min-h-[24px]
    +iphone-width
      margin: 0rem
  .title-actions
    @apply flex items-center gap-2
    +iphone-width
      gap: 4px
  .title-label
    @apply text-2xl phone:text-lg iphone:text-base
    font-style: normal
    color: #fff
    font-weight: 700
    height: auto
    line-height: 1.2vw
    padding-right: 0 0.5vw
    margin: 0 .5vw
    +iphone-width
      font-weight: 700
      font-family: Helvetica
      margin: 0
      height: auto
      line-height: 1rem
  .view-all
    @apply capitalize font-normal
    padding: 0px
    :deep(.block)
      @apply text-sm
      font-family: "OpenSans"
      color: #6D7693 !important
    +iphone-width
      padding-top: 0
      padding-bottom: 0
      min-height: auto
      line-height: 1rem

.game-carousel
  +iphone-width
    ::v-deep(.carousel__track)
      .carousel__slide
        // @apply pr-2
</style>
