<template>
  <div v-if="isMobile" :class="cx('banner-container', bannerContainerStyle)">
    <q-carousel
      v-if="bannerList.length"
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
  <div v-else :class="cx('banner-container', bannerContainerStyle)">
    <q-carousel
      v-if="bannerList.length"
      class="pc"
      animated
      v-model="slide"
      navigation
      swipeable
      infinite
      :autoplay="5000"
      transition-prev="slide-right"
      transition-next="slide-left"
      transition-duration="500"
    >
      <q-carousel-slide
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
import { ref, toRef } from "vue"
import { useBanner } from "src/common/composables/useBanner"
import BannerImage from "src/common/components/banner/BannerImage.vue"
import "vue3-carousel/dist/carousel.css"
import { cx } from "src/common/utils/cx"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "padXl")

const { bannerList, handleBannerRedirect, getBannerImage } = useBanner()

const slide = ref(1)

const props = defineProps({
  isNeedMaxWidth: {
    type: [Boolean],
    required: false,
    default: true
  }
})

const bannerContainerStyle = cx("w-full", {
  "banner-container--max": props.isNeedMaxWidth
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";

$pagination-height: 0.375rem;
$pagination-rounded: 0.625rem;

.banner-container--max {
  width: 100%;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  max-width: 1400px;
  padding-left: 0;
  padding-right: 0;

  // 1000px–1439px: container width 923px
  @media (max-width: 1439px) and (min-width: 1000px) {
    max-width: 923px;
  }

  // < 992px: don't limit width; padding 20px
  @media (max-width: 991px) {
    max-width: none;
    padding-left: 20px;
    padding-right: 20px;
  }

  // < 768px: don't limit width; padding 8px
  @media (max-width: 767px) {
    padding-left: 8px;
    padding-right: 8px;
  }
}

.q-carousel {
  &.pc {
    @apply mt-6 mb-0 w-full h-auto bg-transparent;

    .q-carousel__slide {
      @apply w-full h-full cursor-pointer;
      height: 23.75rem;
      border-radius: 1.375rem;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
    }

    .line-pagination {
      @apply mx-1 relative opacity-100;
      width: 3.75rem;
      height: $pagination-height;
      border-radius: $pagination-rounded;
      background: rgba($background-dark-color, 0.3);

      &::after {
        content: "";
        transition: width 2.5s linear;
        position: absolute;
        left: 0px;
        top: 0px;
        width: 0px;
        height: $pagination-height;
        border-radius: $pagination-rounded;
      }

      &.active {
        &::after {
          background: $background-primary-color;
          width: 100%;
        }
      }
    }
  }

  &.h5 {
    @apply h-auto relative;
    margin: 0rem;
    margin-top: 8px;
    background: $background-pale-silver-color;

    .q-carousel__slide {
      @apply w-full h-full rounded-lg p-0;
      background-size: cover;
      background-repeat: no-repeat;

      .banner-img {
        @apply w-full aspect-[404/176] h-auto rounded-lg bg-cover bg-center;
      }
    }

    :deep(.q-carousel__navigation-inner) {
      justify-content: flex-end;

      .line-pagination {
        @apply mx-1 opacity-100;
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 0.75rem;
        background: rgba($background-light-color, 0.4);

        &.active {
          width: 1.5rem;
          background: $background-bright-blue-purple-color;
        }

        @include iphone-width {
          width: 0.375rem;
          height: 0.375rem;

          &.active {
            width: 0.75rem;
          }
        }
      }
    }
  }
}
</style>
