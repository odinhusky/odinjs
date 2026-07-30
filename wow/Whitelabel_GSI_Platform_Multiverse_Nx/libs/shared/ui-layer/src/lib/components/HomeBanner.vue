<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import type { Banner } from "@shared-lib/api/apiFunctions/banner_getBannerList"
import { useBanner } from "@shared-lib/api/hooks/useBanner"
import { BANNER_POSITION_ENUMS } from "@shared-lib/constants/enums/bannerPosition"
import { BANNER_OPENING_METHOD_ENUMS } from "@shared-lib/constants/enums/bannerOpeningMethod"
import { useOpenGame } from "../composables/useOpenGame"
const router = useRouter()
const runtimeConfig = useRuntimeConfig()
const imageBaseUrl = computed(() => removeTrailingSlash(String(runtimeConfig.public.imageBase || "")))

const { locale } = useI18n()
const { openGame } = useOpenGame()
const { bannerList } = useBanner({ params: { position: BANNER_POSITION_ENUMS.HOME } })

const hasBanners = computed(() => Boolean(bannerList.value?.length))

const getBannerImage = (banner: Banner): string => {
  const lang = locale.value
  const v2 = banner.image_json_v2
  const v1 = banner.image_json
  const rawPath = v2?.[lang] || v2?.["en"] || v1?.[lang] || v1?.["en"] || Object.values(v2 ?? v1 ?? {})[0] || ""
  return withBase(imageBaseUrl.value, rawPath)
}

const handleBannerClick = (banner: Banner) => {
  handleGlobalClick({
    target: "home-banner-click",
    payload: banner,
    callback: (b) => {
      if (!b) return
      // 1. 有遊戲資訊 → 直接開遊戲
      if (b.game_code && b.product_code) {
        openGame(0, b.product_code, b.game_code, b.game_type)
        return
      }

      if (!b.link) return

      const isFullUrl = /^https?:\/\//i.test(b.link)
      const normalizedLink = b.link.startsWith("/") ? b.link : `/${b.link}`

      // 2. 依 opening_method 決定跳轉方式（對應原版 handleBannerRedirect）
      switch (b.opening_method) {
        case BANNER_OPENING_METHOD_ENUMS.REDIRECT:
          // 當前頁面跳轉
          if (isFullUrl) {
            window.location.href = b.link
          } else {
            try {
              router.push(b.link.startsWith("/") || b.link.includes("/") ? b.link : { name: b.link })
            } catch {
              router.push(normalizedLink)
            }
          }
          break

        case BANNER_OPENING_METHOD_ENUMS.NEW_TAB:
        default:
          // 另開新視窗
          window.open(isFullUrl ? b.link : `${window.location.origin}${normalizedLink}`, "_blank")
          break
      }
    }
  })
}

const swiperModules = [Autoplay, Pagination]
</script>

<template>
  <div :class="cx(HOMEVIEW_CONTAINER_PADDING_X_CLASS)">
    <div
      :class="
        cx(
          LAYOUT_MAX_WIDTH,
          'mx-auto rounded overflow-hidden aspect-[1200/380] mob:aspect-[16/9]',
          hasBanners && 'shadow-[0_0_30px_0_#FF8181]'
        )
      "
    >
      <Swiper
        v-if="hasBanners"
        :modules="swiperModules"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :pagination="{ clickable: true }"
        :loop="true"
        class="home-banner-swiper h-full w-full"
      >
        <SwiperSlide v-for="(banner, idx) in bannerList" :key="banner.id">
          <img
            :src="getBannerImage(banner)"
            :alt="banner.title || ''"
            :fetchpriority="idx === 0 ? 'high' : undefined"
            :loading="idx === 0 ? 'eager' : 'lazy'"
            decoding="async"
            class="h-full w-full cursor-pointer object-cover object-center"
            @click="handleBannerClick(banner)"
          />
        </SwiperSlide>
      </Swiper>
      <div v-else class="h-full w-full" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.home-banner-swiper :deep(.swiper-pagination-bullet) {
  background: var(--base-content, #fff);
  opacity: 0.5;
}
.home-banner-swiper :deep(.swiper-pagination-bullet-active) {
  background: var(--primary, #fff);
  opacity: 1;
}
</style>
