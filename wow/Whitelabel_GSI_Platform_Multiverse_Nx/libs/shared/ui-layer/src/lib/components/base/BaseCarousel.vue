<script setup lang="ts">
import Carousel from "primevue/carousel"

interface Props {
  value?: any[]
  numVisible?: number
  numScroll?: number
  peekWidth?: number
  fitContent?: boolean
  circular?: boolean
  autoplayInterval?: number
  showIndicators?: boolean
  showNavigators?: boolean
  responsiveOptions?: Array<{ breakpoint: string; numVisible: number; numScroll: number }>
  classObj?: {
    wrapper?: string
    carousel?: string
    item?: string
    indicators?: string
    navigator?: string
    navigatorPrev?: string
    navigatorNext?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  value: () => [],
  numVisible: 1,
  numScroll: 1,
  peekWidth: 0,
  fitContent: false,
  circular: false,
  autoplayInterval: 0,
  showIndicators: false,
  showNavigators: true,
  responsiveOptions: () => [],
  classObj: () => ({})
})

const emit = defineEmits<{
  page: [index: number]
}>()

const page = defineModel<number>("page", { default: 0 })

const maxPage = computed(() => {
  const total = props.value.length
  if (total <= 1) return 0
  return total - 1
})

const canPrev = computed(() => props.circular || page.value > 0)
const canNext = computed(() => props.circular || page.value < maxPage.value)

const goPrev = () => {
  if (!canPrev.value) return
  const next = props.circular ? (page.value <= 0 ? maxPage.value : page.value - 1) : Math.max(0, page.value - 1)
  page.value = next
  emit("page", next)
}

const goNext = () => {
  if (!canNext.value) return
  const next = props.circular
    ? page.value >= maxPage.value
      ? 0
      : page.value + 1
    : Math.min(maxPage.value, page.value + 1)
  page.value = next
  emit("page", next)
}
</script>

<template>
  <div :class="cx('w-full relative', props.classObj?.wrapper)">
    <Carousel
      :value="props.value"
      :num-visible="props.numVisible"
      :num-scroll="props.numScroll"
      :circular="props.circular"
      :autoplay-interval="props.autoplayInterval"
      :show-navigators="false"
      :show-indicators="props.showIndicators"
      :responsive-options="props.responsiveOptions"
      :page="page"
      :pt="{
        root: {
          class: cx('w-full overflow-hidden', props.classObj?.carousel)
        },
        viewport: {
          class: 'overflow-hidden'
        },
        item: {
          class: cx(props.classObj?.item)
        },
        indicators: {
          class: cx(props.classObj?.indicators)
        },
        previousButtonIcon: {
          class: 'text-base'
        },
        nextButtonIcon: {
          class: 'text-base'
        }
      }"
      @update:page="
        (nextPage) => {
          page = nextPage
          emit('page', nextPage)
        }
      "
    >
      <template #item="slotProps">
        <slot :item="slotProps.data" :index="slotProps.index" />
      </template>
    </Carousel>

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
  </div>
</template>
