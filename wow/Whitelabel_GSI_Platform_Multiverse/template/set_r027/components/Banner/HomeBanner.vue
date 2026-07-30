<template>
  <div v-if="isMobile" class="banner-container flex justify-center items-center">
    <q-carousel
      v-if="bannerList.length && bannerLoaded"
      class="h5"
      animated
      v-model="slide"
      navigation
      swipeable
      infinite
      :autoplay="3000"
      transition-prev="slide-right"
      transition-next="slide-left"
      transition-duration="500"
    >
      <q-carousel-slide
        v-for="(banner, index) in bannerList"
        :key="index"
        :name="index + 1"
        @click="handleBannerRedirect(banner)"
      >
        <BannerImage :banner="banner" alt="banner" class="banner-img" />
      </q-carousel-slide>
      <template v-slot:navigation-icon="{ active, onClick }">
        <div class="line-pagination" :class="{ active: active }" @click="onClick"></div>
      </template>
    </q-carousel>
  </div>

  <div v-else class="banner-container">
    <q-carousel
      v-if="bannerList.length && bannerLoaded"
      class="pc"
      animated
      v-model="slide"
      navigation
      swipeable
      infinite
      :autoplay="3000"
      transition-prev="slide-right"
      transition-next="slide-left"
      transition-duration="500"
    >
      <q-carousel-slide
        class="slide-pagination"
        v-for="(banner, index) in bannerList"
        :key="index"
        :name="index + 1"
        :img-src="getBannerImage(banner)"
        @click="handleBannerRedirect(banner)"
      />
      <template v-slot:navigation-icon="{ active, onClick }">
        <div class="line-pagination" :class="{ active: active }" @click="onClick"></div>
      </template>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { useBanner } from "src/common/composables/useBanner"
import BannerImage from "src/common/components/banner/BannerImage.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { ref, watch } from "vue"
import "vue3-carousel/dist/carousel.css"
const { bannerList, handleBannerRedirect, getBannerImage, preloadImages } = useBanner()

const { isMobile } = useMediaQuery()
const { isDown } = useMediaQuery()
const slide = ref(1)
const bannerLoaded = ref(false)

// 預加載所有 banner 圖片
watch(
  () => bannerList.value,
  (newBannerList) => {
    if (newBannerList && newBannerList.length > 0) {
      bannerLoaded.value = false
      const imageUrls = newBannerList
        .map((banner) => getBannerImage(banner))
        .filter((url): url is string => Boolean(url))

      preloadImages(imageUrls, {
        onComplete: (allLoaded) => {
          setTimeout(() => {
            bannerLoaded.value = true
          }, 300)
        }
      })
    } else {
      bannerLoaded.value = true
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r027/assets/css/_variable.scss";

.q-carousel {
  &.pc {
    @apply w-full h-full bg-transparent;
    border-radius: 30px;
    margin-top: 24px;

    @media (max-width: 1024px) {
      margin: 0;
    }

    .q-carousel__slide {
      @apply w-full h-full cursor-pointer;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
    }

    .line-pagination {
      @apply mx-1 relative opacity-100 w-[3.75rem] h-[0.375rem] rounded-[0.625rem];
      background: var(--slider-pagination-inactive, rgba(0, 0, 0, 0.3));

      &::after {
        @apply absolute left-0 top-0 h-[0.375rem] rounded-[0.625rem];
        content: "";
        transition: width 2.5s linear;
      }

      &.active {
        &::after {
          @apply w-full;
          background: var(--slider-pagination-active, #3b82f6);
        }
      }
    }
  }

  &.h5 {
    @apply w-full h-full relative bg-transparent;
    border-radius: 20px;
    margin-bottom: 12px;

    .q-carousel__slide {
      @apply w-full h-full p-0;
      background-size: cover;
      background-repeat: no-repeat;

      .banner-img {
        @apply w-full h-full object-cover rounded-lg;
      }
    }

    :deep(.q-carousel__navigation-inner) {
      justify-content: flex-end;

      .line-pagination {
        @apply mx-1 opacity-100 w-[0.75rem] h-[0.75rem] rounded-[0.75rem];
        background: var(--slider-pagination-mobile-inactive, rgba(255, 255, 255, 0.4));

        &.active {
          @apply w-[1.5rem];
          background: var(--slider-pagination-mobile-active, #3b82f6);
        }
      }
    }
  }
}

.banner-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 30px;
  aspect-ratio: 1200 / 259;

  // >= 1440px: container width 1200px (centered)
  max-width: 1200px;
  padding: 0;

  // 1000px–1439px: container width 923px (centered)
  @media (max-width: 1439px) and (min-width: 1000px) {
    max-width: 923px;
  }

  // 769px–991px: container width 889px (centered)
  @media (max-width: 991px) and (min-width: 769px) {
    max-width: 889px;
    margin-bottom: 12px;
    padding: 0;
  }

  // <= 768px: keep 8px side spacing without affecting ratio
  @media (max-width: 768px) {
    width: calc(100% - 16px);
    max-width: none;
    aspect-ratio: 359 / 93;
    padding: 0;
    margin-bottom: 12px;
    border-radius: 20px;
  }

  :deep(.q-carousel__control) {
    bottom: 4vw;
  }
}
</style>
