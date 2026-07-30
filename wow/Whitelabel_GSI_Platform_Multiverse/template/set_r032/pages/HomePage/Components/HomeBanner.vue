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
        <div class="img" :style="{ backgroundImage: `url(${getBannerImage(banner)})` }"></div>
      </SwiperSlide>
    </Swiper>
    <div class="navigation" v-if="validBanners.length > 0">
      <q-btn
        class="nav-prev"
        :disable="!canGoPrev"
        flat
        dense
        rounded
        icon="fas fa-chevron-left"
        @click="productSwiper.slidePrev()"
      >
      </q-btn>
      <q-btn
        class="nav-next"
        :disable="!canGoNext"
        flat
        dense
        rounded
        icon="fas fa-chevron-right"
        @click="productSwiper.slideNext()"
      >
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation, Autoplay } from "swiper/modules"
import { useBanner } from "src/common/composables/useBanner"
import { BANNER_POSITION } from "src/common/utils/constants"
import "swiper/css"
import "swiper/css/navigation"

const { bannerList, handleBannerList, handleBannerRedirect, getBannerImage } = useBanner()

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

onMounted(async () => {
  await handleBannerList(BANNER_POSITION.Enums.Home)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r032/assets/css/_variable.scss";

.banner-container {
  @apply w-full relative;
  .carousel {
    @apply px-[5px];
    .slide {
      @apply aspect-[285/157] rounded-xl overflow-hidden;
      height: 9.375rem;
      .img {
        @apply w-full h-full bg-cover bg-center cursor-pointer;
      }
    }
  }
  .navigation {
    @apply absolute w-full;
    @apply flex justify-between items-center;
    @apply top-1/2 transform -translate-y-1/2;
    @apply z-10 pointer-events-none;
    ::v-deep(.q-btn) {
      background: var(--linear-gradient-primary-01);
      @apply w-[1.875rem] h-[1.875rem] min-h-[1.875rem];
      @apply pointer-events-auto rounded-full overflow-hidden;
      color: var(--text-01);

      .q-icon {
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
