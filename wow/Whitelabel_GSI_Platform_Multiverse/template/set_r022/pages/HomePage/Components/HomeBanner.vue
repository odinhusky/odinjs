<template>
  <div class="banner-container" v-if="validBanners.length">
    <Swiper
      class="carousel"
      :modules="[Navigation, Autoplay]"
      :autoplay="{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }"
      @swiper="onSwiper"
      @slide-change="updateNavigationState"
      :breakpoints="{
        300: { slidesPerView: 1, spaceBetween: 10 },
        500: { slidesPerView: 2, spaceBetween: 10 },
        1024: { slidesPerView: 3, spaceBetween: 10 }
      }"
      ref="productSwiperRef"
    >
      <SwiperSlide
        class="slide"
        v-for="(banner, index) in validBanners"
        :key="index"
        @click="handleBannerRedirect(banner)"
      >
        <BannerImage
          class="img"
          :banner="banner"
          alt=""
          :loading="index === 0 ? 'eager' : 'lazy'"
          :fetchpriority="index === 0 ? 'high' : 'auto'"
          decoding="async"
          :sizes="bannerImageSizes"
        />
      </SwiperSlide>
    </Swiper>
    <div class="navigation" v-if="validBanners.length > 0">
      <q-btn
        class="nav-prev"
        :disable="!canGoPrev"
        flat
        dense
        rounded
        aria-label="Previous slide"
        @click="productSwiper.slidePrev()"
      >
        <Icon icon="fa-solid:chevron-left" width="1rem" height="1rem" aria-hidden="true" />
      </q-btn>
      <q-btn
        class="nav-next"
        :disable="!canGoNext"
        flat
        dense
        rounded
        aria-label="Next slide"
        @click="productSwiper.slideNext()"
      >
        <Icon icon="fa-solid:chevron-right" width="1rem" height="1rem" aria-hidden="true" />
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { Navigation, Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/vue"
import { onUnmounted, ref, computed, watch } from "vue"
import "swiper/css"
import "swiper/css/navigation"

import BannerImage from "src/common/components/banner/BannerImage.vue"
import { BANNER_IMAGE_SIZES, useBanner } from "src/common/composables/useBanner"
import { ensureFaSolidSubsetRegistered } from "src/common/icons/faSolidSubset"
import { BANNER_POSITION } from "src/common/utils/constants"

ensureFaSolidSubsetRegistered()

const bannerImageSizes = BANNER_IMAGE_SIZES.SWIPER_MULTI_WITH_DRAWER

const {
  bannerList,
  handleBannerList,
  hydrateHomeBannerFromEarlyCache,
  handleBannerRedirect,
  getBannerImage,
  getBannerImageSrcSet,
  preloadLcpBannerImage,
  clearLcpBannerPreload,
} = useBanner()

const productSwiper = ref()
const canGoNext = ref(true)
const canGoPrev = ref(true)

// Filter out banners without valid images
const validBanners = computed(() => {
  return bannerList.value.filter((banner) => getBannerImage(banner))
})

const onSwiper = (swiper: any) => {
  productSwiper.value = swiper
  updateNavigationState()
}
const updateNavigationState = () => {
  canGoPrev.value = !productSwiper.value.isBeginning
  canGoNext.value = !productSwiper.value.isEnd
}

watch(
  validBanners,
  (banners) => {
    const first = banners[0]
    if (!first) {
      clearLcpBannerPreload()
      return
    }

    const href = getBannerImage(first)
    if (!href) {
      clearLcpBannerPreload()
      return
    }

    preloadLcpBannerImage({
      href,
      imagesrcset: getBannerImageSrcSet(first) || undefined,
      imagesizes: bannerImageSizes,
    })
  },
  { immediate: true }
)

// setup：吃 router 階段已啟動的 early prefetch（不必等 onMounted）
hydrateHomeBannerFromEarlyCache()
void handleBannerList(BANNER_POSITION.Enums.Home)

onUnmounted(() => {
  clearLcpBannerPreload()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.banner-container {
  @apply w-full relative;
  .carousel {
    @apply px-[5px];
    .slide {
      @apply aspect-[285/157] rounded-xl overflow-hidden;
      height: 9.375rem;
      .img {
        @apply w-full h-full object-cover object-center cursor-pointer block;
      }
    }
  }
  .navigation {
    @apply absolute w-full;
    @apply flex justify-between items-center;
    @apply top-1/2 transform -translate-y-1/2;
    @apply z-10 pointer-events-none;
    ::v-deep(.q-btn) {
      background: var(--primary-01);
      @apply w-[1.875rem] h-[1.875rem] min-h-[1.875rem];
      @apply pointer-events-auto rounded-full overflow-hidden;
      color: var(--text-01);

      .q-icon,
      svg {
        @apply text-[1rem];
      }
    }
    ::v-deep(.nav-prev) {
      @apply left-[-4px];

      @include pad-large-width {
        @apply left-[-7px];
      }
    }
    ::v-deep(.nav-next) {
      @apply right-[-4px];

      @include pad-large-width {
        @apply right-[-7px];
      }
    }
  }
}
</style>
