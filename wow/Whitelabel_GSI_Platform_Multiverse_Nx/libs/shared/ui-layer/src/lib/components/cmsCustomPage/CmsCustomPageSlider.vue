<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, Pagination, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import type { CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"
import type { CmsSliderPayload, CmsStyleSettings } from "@shared-lib/api/commonTypes/cmsCustomPageTypes"
import { CMS_ENTRANCE_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsEntranceType"

const props = defineProps<{
  entrance: CmsEntranceItem
}>()

const router = useRouter()
const runtimeConfig = useRuntimeConfig()
const { openGame } = useOpenGame()

const payload = computed((): CmsSliderPayload => {
  return (props.entrance.payload as unknown as CmsSliderPayload) ?? {}
})

const settingStyle = computed((): CmsStyleSettings | undefined => payload.value?.style)

const wrapperStyle = computed(() => {
  const style: Record<string, string> = {}
  if (settingStyle.value?.marginBottom !== undefined) {
    style.marginBottom = `${settingStyle.value.marginBottom}px`
  }
  if (settingStyle.value?.backgroundColor) {
    style.backgroundColor = settingStyle.value.backgroundColor
  }
  return style
})

const isArrows = computed(() => settingStyle.value?.carouselStyle === "arrows")
const autoPlayDelay = computed(() => (settingStyle.value?.autoPlaySeconds ?? 3) * 1000)

// ── 圖片建構 ──────────────────────────────────────────────────────────────────
const imageConfig = computed(() => ({
  imageBase: removeTrailingSlash(String(runtimeConfig.public.imageBase || "")),
  origin: process.client ? window.location.origin : "",
  staticResourceUrl: removeTrailingSlash(String(runtimeConfig.public.staticResourceUrl || ""))
}))

const getSlideImage = (item: CmsEntranceItem): string => {
  return buildCmsEntranceImageSrc(item, imageConfig.value)
}

// ── 點擊處理（與首頁 handleCmsEntranceClick 邏輯一致） ────────────────────────
const handleSlideClick = (item: CmsEntranceItem) => {
  const { type, payload: p } = item

  if (type === CMS_ENTRANCE_TYPE_ENUMS.GAME_LINK) {
    openGame(Number(p.integration_id), Number(p.product_code), String(p.game_code || ""), Number(p.game_type))
    return
  }

  if (!p.link) return

  const isExternal = /^https?:\/\//i.test(p.link)
  const normalizedLink = p.link.startsWith("/") ? p.link : `/${p.link}`

  if (p.opening_method === 1 /* NEW_TAB */) {
    window.open(isExternal ? p.link : `${window.location.origin}${normalizedLink}`, "_blank")
  } else {
    if (isExternal) {
      window.location.href = p.link
    } else {
      router.push(normalizedLink)
    }
  }
}

const sliderItems = computed((): CmsEntranceItem[] => {
  return Array.isArray(payload.value?.nested_entrance) ? payload.value.nested_entrance : []
})

const swiperModules = computed(() => (isArrows.value ? [Autoplay, Navigation] : [Autoplay, Pagination]))

const borderRadius = computed(() => (settingStyle.value?.borderStyle === "square" ? "0" : "8px"))

// box-shadow: 固定使用與 HomeBanner 相同的橘色光暈
const containerStyle = computed(() => ({
  ...wrapperStyle.value,
  borderRadius: borderRadius.value,
  overflow: "hidden"
}))
</script>

<template>
  <!-- shell は常にレンダリング（データが無くても外枠を表示） -->
  <div class="shadow-[0_0_30px_0_#FF8181]" :style="containerStyle">
    <!-- データあり：Swiper -->
    <Swiper
      v-if="sliderItems.length"
      :modules="swiperModules"
      :autoplay="{ delay: autoPlayDelay, disableOnInteraction: false }"
      :pagination="!isArrows ? { clickable: true } : false"
      :navigation="isArrows ? true : false"
      :loop="sliderItems.length > 1"
      class="cms-slider w-full"
    >
      <SwiperSlide v-for="(item, idx) in sliderItems" :key="idx">
        <div
          class="w-full cursor-pointer aspect-[1200/380] mob:aspect-[16/9] bg-cover bg-center bg-no-repeat"
          :style="{ backgroundImage: `url(${getSlideImage(item)})` }"
          @click="handleSlideClick(item)"
        />
      </SwiperSlide>
    </Swiper>

    <!-- データなし：空のプレースホルダー（縦横比だけ確保） -->
    <div v-else class="w-full aspect-[1200/380] mob:aspect-[16/9] bg-white/5" />
  </div>
</template>

<style scoped>
.cms-slider :deep(.swiper-pagination-bullet) {
  background: var(--base-content, #fff);
  opacity: 0.5;
}
.cms-slider :deep(.swiper-pagination-bullet-active) {
  background: var(--primary, #fff);
  opacity: 1;
}
.cms-slider :deep(.swiper-button-next),
.cms-slider :deep(.swiper-button-prev) {
  color: #fff;
}
</style>
