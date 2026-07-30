<template>
  <div
    class="slider-wrapper"
    :style="{
      marginBottom: settingStyle?.marginBottom ? `${settingStyle.marginBottom}px` : undefined,
      backgroundColor: settingStyle?.backgroundColor,
      '--primary-color': settingStyle?.primaryColor || '#fff',
      '--secondary-color': settingStyle?.secondaryColor || '#ccc'
    }"
  >
    <q-carousel
      v-if="sliderItems.length"
      animated
      v-model="slide"
      :navigation="settingStyle?.carouselStyle !== 'arrows'"
      control-color="white"
      infinite
      :autoplay="30000"
      :arrows="settingStyle?.carouselStyle === 'arrows'"
      :class="['cursor-pointer', settingStyle?.borderStyle === 'square' ? '!rounded-none' : '!rounded-lg']"
    >
      <template v-slot:navigation-icon="{ btnProps, onClick }">
        <q-btn size="sm" :icon="btnProps.icon" color="white" flat round dense @click.stop="onClick" />
      </template>
      <q-carousel-slide
        v-for="(item, index) in sliderItems"
        :key="index"
        :name="index"
        :img-src="item.img_path"
        @click="handleSlideClick(item)"
      />
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useCmsImage } from "src/common/composables/useCmsImage"
import { useGame } from "src/common/composables/useGame"
import type * as Response from "src/api/response.type"
import type {
  CmsSliderPayload,
  CmsSliderNestedEntrance,
  CmsSliderProcessedItem,
  CmsGamePayload,
  CmsLinkPayload,
  CmsNestedEntrancePayload,
  CmsStyleSettings
} from "src/types/cmsCustomPage"

const { getCmsImageSource } = useCmsImage()
const { getGameImageByCustomPage } = useGame()

const props = defineProps<{
  entrance: Response.CmsEntranceItem
  handleEntranceClick: (item: { entrance: CmsSliderProcessedItem; opening_method?: number }) => void
}>()

const payload = computed(() => props.entrance.payload as unknown as CmsSliderPayload)

// 從 entrance.payload.style 讀取樣式
const settingStyle = computed((): CmsStyleSettings | undefined => payload.value?.style)

const slide = ref(0)

// 監聽 nested_entrance 變化，重置 slide
watch(
  () => payload.value?.nested_entrance,
  (newValue) => {
    if (newValue) {
      if (slide.value > newValue.length - 1) {
        slide.value = 0
      }
    }
  },
  { immediate: true }
)

const getFallbackImage = (item: CmsSliderNestedEntrance): string => {
  const gamePayload = item.payload as CmsGamePayload

  if (
    gamePayload?.game_code &&
    gamePayload?.product_code &&
    gamePayload?.product_integration_id &&
    gamePayload?.game_type
  ) {
    return getGameImageByCustomPage({
      game_type: gamePayload.game_type,
      product_integration_id: gamePayload.product_integration_id,
      product_code: gamePayload.product_code,
      game_code: gamePayload.game_code
    })
  }

  return ""
}

const sliderItems = computed((): CmsSliderProcessedItem[] => {
  if (payload.value?.nested_entrance && Array.isArray(payload.value.nested_entrance)) {
    return payload.value.nested_entrance.map((item: CmsSliderNestedEntrance): CmsSliderProcessedItem => {
      let imgPath = getCmsImageSource(item)

      if (!imgPath) {
        imgPath = getFallbackImage(item)
      }

      return {
        ...item,
        img_path: imgPath,
        alt_tag: (item.payload as CmsGamePayload)?.alt_tag || "slider image"
      }
    })
  }
  return []
})

const hasOpeningMethod = (payload: CmsNestedEntrancePayload): payload is CmsLinkPayload => {
  return "opening_method" in payload
}

const handleSlideClick = (item: CmsSliderProcessedItem) => {
  const openingMethod = hasOpeningMethod(item.payload) ? item.payload.opening_method : undefined

  props.handleEntranceClick({
    entrance: item,
    opening_method: openingMethod
  })
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.slider-wrapper {
  width: 100%;
  padding: 1rem;
}

.q-carousel {
  box-shadow: 0px 0px 16px 0px #0000001a;
  border-radius: 10px;

  :deep(.q-carousel__slides-container) {
    height: 100%;

    .q-carousel__slide {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
    }
  }

  :deep(.q-carousel__control) {
    bottom: 0;

    .q-carousel__navigation-inner {
      .q-btn {
        font-size: 8px !important;
        margin-bottom: 0;
      }
    }
  }

  :deep(.q-carousel__next-arrow) {
    .q-btn {
      background-color: var(--primary-color, #fff) !important;
    }
  }

  :deep(.q-carousel__prev-arrow) {
    .q-btn {
      background-color: var(--secondary-color, #fff) !important;
    }
  }
}
</style>
