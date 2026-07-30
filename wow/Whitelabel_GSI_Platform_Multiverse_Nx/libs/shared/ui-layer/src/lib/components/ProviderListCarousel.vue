<script setup lang="ts">
import type { ProductItem } from "@shared-lib/api/commonTypes/gameTypes"
import { Swiper, SwiperSlide } from "swiper/vue"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import type { Swiper as SwiperType } from "swiper"

const props = withDefaults(
  defineProps<{
    providerOptions: ProductItem[]
    selectedProviderCode?: number | null
    getProductTabImage: (productCode: number) => string
    slidesPerViewDesktop?: number
    slidesPerViewMobile?: number
  }>(),
  {
    selectedProviderCode: null,
    slidesPerViewDesktop: 5.5,
    slidesPerViewMobile: 3.5
  }
)

const emit = defineEmits<{
  (event: "select-provider", provider: ProductItem): void
}>()

const swiperRef = ref<SwiperType | null>(null)

const setCarouselRef = (swiper: SwiperType) => {
  swiperRef.value = swiper
}

const breakpoints = computed(() => ({
  0: { slidesPerView: props.slidesPerViewMobile },
  768: { slidesPerView: props.slidesPerViewDesktop }
}))

const swiperModules = [FreeMode]

const isProviderActive = (provider: ProductItem) => Number(props.selectedProviderCode) === Number(provider.product_code)
</script>

<template>
  <Swiper
    :modules="swiperModules"
    :free-mode="true"
    :breakpoints="breakpoints"
    :space-between="8"
    class="provider-list-carousel"
    @swiper="setCarouselRef"
  >
    <SwiperSlide v-for="provider in providerOptions" :key="provider.product_code">
      <ProviderItem
        :provider="provider"
        :image-src="getProductTabImage(provider.product_code)"
        :is-active="isProviderActive(provider)"
        @select="(p) => emit('select-provider', p)"
      />
    </SwiperSlide>
  </Swiper>
</template>
