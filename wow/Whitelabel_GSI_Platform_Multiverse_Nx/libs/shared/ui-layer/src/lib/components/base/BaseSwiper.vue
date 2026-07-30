<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue"
import type { Swiper as SwiperInstance } from "swiper/types"
import "swiper/css"

interface Props {
  value?: any[]
  page?: number
  itemWidth?: number
  itemGap?: number
  mobileBreakpoint?: number
  circular?: boolean
  showIndicators?: boolean
  showNavigators?: boolean
  classObj?: {
    wrapper?: string
    swiper?: string
    item?: string
    indicators?: string
    indicator?: string
    indicatorActive?: string
    navigator?: string
    navigatorPrev?: string
    navigatorNext?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  value: () => [],
  itemWidth: 424,
  itemGap: 16,
  mobileBreakpoint: 480,
  circular: false,
  showIndicators: false,
  showNavigators: true,
  classObj: () => ({})
})

const emit = defineEmits<{
  page: [index: number]
}>()

const page = defineModel<number>("page", { default: 0 })
const swiperRef = shallowRef<SwiperInstance | null>(null)
const isBeginning = ref(true)
const isEnd = ref(false)

const containerStyle = computed(() => ({
  "--base-swiper-item-width": `${props.itemWidth}px`,
  "--base-swiper-mobile-breakpoint": `${props.mobileBreakpoint}px`
}))

const canPrev = computed(() => props.circular || !isBeginning.value)
const canNext = computed(() => props.circular || !isEnd.value)

const syncEdgeState = () => {
  const instance = swiperRef.value
  if (!instance) return
  isBeginning.value = instance.isBeginning
  isEnd.value = instance.isEnd
}

const normalizePage = (index: number) => {
  const max = props.value.length - 1
  if (max < 0) return 0
  return Math.min(Math.max(index, 0), max)
}

const slideToPage = (index: number, speed = 300) => {
  const instance = swiperRef.value
  if (!instance) return
  const target = normalizePage(index)

  if (props.circular) {
    instance.slideToLoop(target, speed)
    return
  }

  instance.slideTo(target, speed)
}

const handleSwiperInit = (instance: SwiperInstance) => {
  swiperRef.value = instance
  slideToPage(page.value, 0)
  nextTick(syncEdgeState)
}

const handleSlideChange = (instance: SwiperInstance) => {
  const nextIndex = props.circular ? instance.realIndex : instance.activeIndex

  if (page.value !== nextIndex) {
    page.value = nextIndex
    emit("page", nextIndex)
  }

  syncEdgeState()
}

const goPrev = () => {
  if (!canPrev.value) return
  swiperRef.value?.slidePrev()
}

const goNext = () => {
  if (!canNext.value) return
  swiperRef.value?.slideNext()
}

watch(
  () => page.value,
  (nextPage) => {
    const instance = swiperRef.value
    if (!instance) return

    const activeIndex = props.circular ? instance.realIndex : instance.activeIndex
    const targetPage = normalizePage(nextPage)
    if (activeIndex === targetPage) return

    slideToPage(targetPage)
  }
)

watch(
  () => props.value.length,
  (length) => {
    if (!length) {
      page.value = 0
      isBeginning.value = true
      isEnd.value = true
      return
    }

    const safePage = normalizePage(page.value)
    if (safePage !== page.value) {
      page.value = safePage
    }

    nextTick(() => {
      slideToPage(page.value, 0)
      syncEdgeState()
    })
  },
  { immediate: true }
)
</script>

<template>
  <div :class="cx('w-full relative', props.classObj?.wrapper)" :style="containerStyle">
    <Swiper
      :slides-per-view="'auto'"
      :slides-per-group="1"
      :space-between="props.itemGap"
      :loop="props.circular"
      :allow-touch-move="true"
      :watch-overflow="true"
      :class="cx('w-full', props.classObj?.swiper)"
      @swiper="handleSwiperInit"
      @slide-change="handleSlideChange"
      @transition-end="syncEdgeState"
      @resize="syncEdgeState"
    >
      <SwiperSlide
        v-for="(item, index) in props.value"
        :key="`base-swiper-${index}`"
        :class="cx('base-swiper__slide', props.classObj?.item)"
      >
        <slot :item="item" :index="index" />
      </SwiperSlide>
    </Swiper>

    <div
      v-if="props.showNavigators"
      :class="
        cx(
          'absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none',
          props.classObj?.navigatorPrev
        )
      "
    >
      <BaseIconBtn
        icon="material-symbols:arrow-back-rounded"
        :disabled="!canPrev"
        :theme="BASE_ICON_BTN_THEME_OBJ.NORMAL"
        :class-obj="{
          button: cx('pointer-events-auto', props.classObj?.navigator),
          icon: 'text-[var(--text-text-primary)]'
        }"
        @click="goPrev"
      />
    </div>

    <div
      v-if="props.showNavigators"
      :class="
        cx(
          'absolute inset-y-0 right-0 w-12 flex items-center justify-center pointer-events-none',
          props.classObj?.navigatorNext
        )
      "
    >
      <BaseIconBtn
        icon="material-symbols:arrow-forward-rounded"
        :disabled="!canNext"
        :theme="BASE_ICON_BTN_THEME_OBJ.NORMAL"
        :class-obj="{
          button: cx('pointer-events-auto', props.classObj?.navigator),
          icon: 'text-[var(--text-text-primary)]'
        }"
        @click="goNext"
      />
    </div>

    <div
      v-if="props.showIndicators && props.value.length > 1"
      :class="cx('mt-3 flex items-center justify-center gap-2', props.classObj?.indicators)"
    >
      <button
        v-for="(_, index) in props.value"
        :key="`base-swiper-indicator-${index}`"
        type="button"
        :class="
          cx(
            'w-2 h-2 rounded-full transition-colors bg-[var(--surface-border)]',
            page === index && 'bg-[var(--text-text-primary)]',
            props.classObj?.indicator,
            page === index && props.classObj?.indicatorActive
          )
        "
        @click="slideToPage(index)"
      />
    </div>
  </div>
</template>

<style scoped>
.base-swiper__slide {
  width: min(100%, var(--base-swiper-item-width));
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .base-swiper__slide {
    width: 100%;
  }
}
</style>
