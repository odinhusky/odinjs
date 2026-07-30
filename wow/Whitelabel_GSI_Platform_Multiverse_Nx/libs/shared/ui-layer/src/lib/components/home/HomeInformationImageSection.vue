<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { useCmsHomeInformationImage } from "@shared-lib/composables/useCmsHomeInformationImage"

const { visibleList, handleImageClick } = useCmsHomeInformationImage()
const swiperModules = [Autoplay, Pagination]
</script>

<template>
  <div :class="cx(LAYOUT_MAX_WIDTH, 'mx-auto w-full rounded overflow-hidden mob:px-3')">
    <Swiper
      v-if="visibleList.length"
      :modules="swiperModules"
      :autoplay="{ delay: 4000, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      :loop="visibleList.length > 1"
      class="home-info-swiper w-full"
    >
      <SwiperSlide v-for="item in visibleList" :key="item.id">
        <div
          class="w-full aspect-[1200/380] mob:aspect-[16/9] bg-cover bg-center bg-no-repeat"
          :class="{ 'cursor-pointer': item.hasEntrance }"
          :style="{ backgroundImage: `url(${item.imageUrl})` }"
          @click="item.hasEntrance ? handleImageClick(item) : undefined"
        />
      </SwiperSlide>
    </Swiper>
    <div v-else class="w-full aspect-[1200/380] mob:aspect-[16/9]" aria-hidden="true" />
  </div>
</template>

<style scoped>
.home-info-swiper :deep(.swiper-pagination-bullet) {
  background: var(--base-content, #fff);
  opacity: 0.5;
}
.home-info-swiper :deep(.swiper-pagination-bullet-active) {
  background: var(--primary, #fff);
  opacity: 1;
}
</style>
