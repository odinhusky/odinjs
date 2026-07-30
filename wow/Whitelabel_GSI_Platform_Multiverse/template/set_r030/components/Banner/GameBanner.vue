<template>
  <div v-if="isMobile" class="banner-container flex justify-center items-center">
    <q-carousel
      v-if="carouselSlides.length && bannerLoaded"
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
        v-for="(bannerSlide, index) in carouselSlides"
        :key="bannerSlide.key"
        :name="index + 1"
        @click="handleBannerSlideClick(bannerSlide)"
      >
        <img :src="bannerSlide.imageUrl" alt="banner" class="banner-img" draggable="false" />
      </q-carousel-slide>
      <template v-slot:navigation-icon="{ active, onClick }">
        <div class="line-pagination" :class="{ active: active }" @click="onClick"></div>
      </template>
    </q-carousel>
  </div>

  <div v-else class="banner-container">
    <q-carousel
      v-if="carouselSlides.length && bannerLoaded"
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
        v-for="(bannerSlide, index) in carouselSlides"
        :key="bannerSlide.key"
        :name="index + 1"
        :img-src="bannerSlide.imageUrl"
        @click="handleBannerSlideClick(bannerSlide)"
      />
      <template v-slot:navigation-icon="{ active, onClick }">
        <div class="line-pagination" :class="{ active: active }" @click="onClick"></div>
      </template>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import type * as Response from "src/api/response.type"
import { type BannerListLoadResult, useBanner } from "src/common/composables/useBanner"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { BANNER_POSITION, GAME_TYPE } from "src/common/utils/constants"
import { getGameLobbyDefaultBanner } from "src/common/utils/gameLobbyDefaultBanner"
import { computed, ref, watch } from "vue"
import { useRoute } from "vue-router"

interface BannerSlide {
  banner?: Response.Banner
  imageUrl: string
  key: string
}

type BannerContext = {
  gameType: GAME_TYPE.Enums
  position: BANNER_POSITION.Enums
  productCode?: number
}

type BannerLoadState = "idle" | "loading" | BannerListLoadResult["status"]

const route = useRoute()
const { isMobile } = useMediaQuery()
const { bannerList, handleBannerList, handleBannerRedirect, getBannerImage, preloadImages } = useBanner()
const slide = ref(1)
const bannerLoaded = ref(false)
const bannerLoadState = ref<BannerLoadState>("idle")

const gameTypeId = computed<null | GAME_TYPE.Enums>(() => {
  const routeGameType = route.params.gameType
  const rawGameType = Array.isArray(routeGameType) ? routeGameType[0] : routeGameType
  const parsedGameType = Number(rawGameType)

  if (!GAME_TYPE.isGameType(parsedGameType)) {
    return null
  }

  return parsedGameType
})

const productCode = computed<number | null>(() => {
  const routeProductCode = route.params.productCode
  const rawProductCode = Array.isArray(routeProductCode) ? routeProductCode[0] : routeProductCode
  const parsedProductCode = Number(rawProductCode)

  if (!Number.isInteger(parsedProductCode) || parsedProductCode <= 0) {
    return null
  }

  return parsedProductCode
})

const defaultBannerImage = computed<string>(() => {
  if (gameTypeId.value === null) {
    return ""
  }

  return getGameLobbyDefaultBanner(gameTypeId.value)
})

const bannerPosition = computed<BANNER_POSITION.Enums | null>(() => {
  if (route.name === "ProductLobby") {
    return BANNER_POSITION.Enums.ProductLobby
  }

  if (route.name === "GameLobby") {
    return BANNER_POSITION.Enums.GameLobby
  }

  return null
})

const bannerContext = computed<BannerContext | null>(() => {
  if (bannerPosition.value === null || gameTypeId.value === null) {
    return null
  }

  if (bannerPosition.value === BANNER_POSITION.Enums.GameLobby) {
    if (productCode.value === null) {
      return null
    }

    return {
      gameType: gameTypeId.value,
      position: bannerPosition.value,
      productCode: productCode.value,
    }
  }

  return {
    gameType: gameTypeId.value,
    position: bannerPosition.value,
  }
})

const remoteBannerSlides = computed<BannerSlide[]>(() => {
  return bannerList.value.reduce<BannerSlide[]>((slides, banner, index) => {
    const imageUrl = getBannerImage(banner)
    if (!imageUrl) {
      return slides
    }

    slides.push({
      banner,
      imageUrl,
      key: String(banner.id ?? `banner-${index}`),
    })
    return slides
  }, [])
})

const carouselSlides = computed<BannerSlide[]>(() => {
  if (bannerContext.value === null) {
    return []
  }

  if (remoteBannerSlides.value.length) {
    return remoteBannerSlides.value
  }

  if (bannerLoadState.value !== "success") {
    return []
  }

  if (!defaultBannerImage.value) {
    return []
  }

  return [
    {
      imageUrl: defaultBannerImage.value,
      key: `default-${gameTypeId.value ?? "unknown"}`,
    },
  ]
})

function handleBannerSlideClick(bannerSlide: BannerSlide) {
  if (!bannerSlide.banner) {
    return
  }

  handleBannerRedirect(bannerSlide.banner)
}

watch(
  bannerContext,
  async (newBannerContext) => {
    slide.value = 1
    bannerLoaded.value = false

    if (!newBannerContext) {
      bannerLoadState.value = "idle"
      bannerLoaded.value = true
      return
    }

    bannerLoadState.value = "loading"
    const result = await handleBannerList(
      newBannerContext.position,
      newBannerContext.gameType,
      newBannerContext.productCode
    )

    if (result.status === "stale") {
      return
    }

    bannerLoadState.value = result.status

    if (!bannerList.value.length) {
      bannerLoaded.value = true
    }
  },
  { immediate: true }
)

watch(
  () => bannerList.value,
  (newBannerList) => {
    if (!newBannerList.length) {
      return
    }

    bannerLoaded.value = false
    const imageUrls = newBannerList.map((banner) => getBannerImage(banner)).filter((url): url is string => Boolean(url))

    preloadImages(imageUrls, {
      onComplete: () => {
        setTimeout(() => {
          bannerLoaded.value = true
        }, 300)
      },
    })
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r030/assets/css/_variable.scss";

.q-carousel {
  &.pc {
    @apply w-full h-auto bg-transparent;
    border-radius: 4px;
    margin-top: 24px;

    .q-carousel__slide {
      @apply w-full h-[23.75rem] cursor-pointer;
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
    @apply w-full h-auto relative bg-transparent;
    margin: 8px 0 12px;

    .q-carousel__slide {
      @apply w-full h-full p-0;
      background-size: cover;
      background-repeat: no-repeat;

      .banner-img {
        @apply w-full aspect-[404/176] h-auto rounded-lg bg-cover bg-no-repeat bg-center;
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
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 4px;
  max-width: 1200px;
  padding: 0;

  @media (max-width: 1439px) and (min-width: 1000px) {
    max-width: 923px;
  }

  @media (max-width: 991px) and (min-width: 768px) {
    max-width: 889px;
    padding: 0;
  }

  @media (max-width: 767px) {
    max-width: none;
    padding: 0 8px;
    border-radius: unset;
  }

  :deep(.q-carousel__control) {
    bottom: 4vw;
  }
}
</style>
