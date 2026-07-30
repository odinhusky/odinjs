<script setup lang="ts">
import type { CmsItem, CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"
import { CMS_ARRANGEMENT_ENUMS } from "@shared-lib/constants/enums/cmsArrangement"
import { CMS_ENTRANCE_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsEntranceType"
import { BASE_ICON_BTN_THEME_OBJ, BASE_ICON_BTN_SIZE_OBJ } from "@shared-lib/constants/propsCategoryObj"
import { Swiper, SwiperSlide } from "swiper/vue"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import type { Swiper as SwiperType } from "swiper"

const props = defineProps<{
  cmsItem: CmsItem
}>()

const emit = defineEmits<{
  (event: "entrance-click", entrance: CmsEntranceItem): void
}>()

const { locale } = useI18n()

const sectionTitle = computed(() => {
  const lang = locale.value
  const titles = props.cmsItem.Setting?.lang ?? {}
  return (titles[lang as keyof typeof titles] as string) || (titles["en"] as string) || ""
})

const iconPath = computed(() => props.cmsItem.Setting?.icon_path || "")

const entranceList = computed(() => props.cmsItem.Entrance ?? [])

const isCarousel = computed(() => props.cmsItem.Setting?.payload?.arrangement === CMS_ARRANGEMENT_ENUMS.SINGLE_COLUMN)

// 依第一筆 entrance 的 type 判斷整個分類的類型
const firstEntranceType = computed(() => entranceList.value[0]?.type)
const isGameLinkSection = computed(() => firstEntranceType.value === CMS_ENTRANCE_TYPE_ENUMS.GAME_LINK)
const isProductLobbySection = computed(() => firstEntranceType.value === CMS_ENTRANCE_TYPE_ENUMS.CATEGORY_LOBBY)

const swiperRef = ref<SwiperType | null>(null)

const setCarouselRef = (swiper: SwiperType) => {
  swiperRef.value = swiper
}

// 從 CMS 後端設定讀取每行顯示數量（對應原版 row_show_pc / row_show_mob）
const colsPC = computed(() => Number(props.cmsItem.Setting?.payload?.row_show_pc) || 5)
const colsMob = computed(() => Number(props.cmsItem.Setting?.payload?.row_show_mob) || 3)

// Grid 模式：使用 CSS 變數讓每格等寬平均分配，與原版 repeat(var(--grid-columns), 1fr) 一致
const gridStyle = computed(() => ({
  "--grid-columns-pc": String(colsPC.value),
  "--grid-columns-mob": String(colsMob.value)
}))

// Carousel 模式：依視窗寬度選擇 CMS 設定的每頁顯示數
const slidesPerViewPC = computed(() => colsPC.value)
const slidesPerViewMob = computed(() => colsMob.value)

const carouselSwiperProps = computed(() => ({
  slidesPerView: slidesPerViewMob.value as number,
  breakpoints: {
    1024: { slidesPerView: slidesPerViewPC.value }
  }
}))

const handlePrev = () => {
  swiperRef.value?.slidePrev()
}
const handleNext = () => {
  swiperRef.value?.slideNext()
}

const swiperModules = [FreeMode]

const handleEntranceClick = (entrance: CmsEntranceItem) => {
  emit("entrance-click", entrance)
}
</script>

<template>
  <div class="w-full">
    <!-- Section header -->
    <div v-if="sectionTitle" class="flex items-center gap-2 mb-3">
      <BaseImage
        v-if="iconPath"
        :src="iconPath"
        :alt="sectionTitle"
        :class-obj="{
          container: 'w-6 h-6 shrink-0',
          image: 'w-full h-full object-contain'
        }"
      />
      <h2 :class="cx('text-[var(--text-text-title)] text-[24px] font-bold leading-[28px] capitalize')">
        {{ sectionTitle }}
      </h2>
      <div v-if="isCarousel" class="ml-auto flex items-center gap-2">
        <BaseIconBtn
          :theme="BASE_ICON_BTN_THEME_OBJ.NORMAL"
          :size="BASE_ICON_BTN_SIZE_OBJ.LG"
          icon="mdi:chevron-left"
          @click="handlePrev"
        />
        <BaseIconBtn
          :theme="BASE_ICON_BTN_THEME_OBJ.SECONDARY"
          :size="BASE_ICON_BTN_SIZE_OBJ.LG"
          icon="mdi:chevron-right"
          @click="handleNext"
        />
      </div>
    </div>

    <!-- Carousel layout (SINGLE_COLUMN arrangement) -->
    <Swiper
      v-if="isCarousel"
      :modules="swiperModules"
      :free-mode="false"
      :space-between="12"
      v-bind="carouselSwiperProps"
      @swiper="setCarouselRef"
    >
      <SwiperSlide v-for="(entrance, idx) in entranceList" :key="idx">
        <HomeCmsGameLobbyItem v-if="isGameLinkSection" :entrance="entrance" @click="handleEntranceClick" />
        <HomeCmsProductLobbyItem v-else-if="isProductLobbySection" :entrance="entrance" @click="handleEntranceClick" />
        <HomeCmsGameItem v-else :entrance="entrance" @click="handleEntranceClick" />
      </SwiperSlide>
    </Swiper>

    <!-- Grid layout (MULTIPLE_COLUMNS arrangement) -->
    <div v-else class="overflow-x-auto scrollbar-hide">
      <div class="cms-game-grid" :style="gridStyle">
        <template v-for="(entrance, idx) in entranceList" :key="idx">
          <HomeCmsGameLobbyItem v-if="isGameLinkSection" :entrance="entrance" @click="handleEntranceClick" />
          <HomeCmsProductLobbyItem
            v-else-if="isProductLobbySection"
            :entrance="entrance"
            @click="handleEntranceClick"
          />
          <HomeCmsGameItem v-else :entrance="entrance" @click="handleEntranceClick" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 與原版 game-grid 一致：repeat(N, 1fr) 讓每格等寬平均分配 */
.cms-game-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(var(--grid-columns-mob), 1fr);
}

@media (min-width: 1024px) {
  .cms-game-grid {
    grid-template-columns: repeat(var(--grid-columns-pc), 1fr);
  }
}
</style>
