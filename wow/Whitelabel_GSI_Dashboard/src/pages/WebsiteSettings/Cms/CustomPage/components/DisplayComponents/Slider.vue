<template>
  <div
    class="slider-wrapper px-2"
    :style="{
      backgroundColor: settingStyle?.backgroundColor,
      '--primary-color': settingStyle?.primaryColor || '#fff',
      '--secondary-color': settingStyle?.secondaryColor || '#ccc'
    }"
  >
    <q-carousel
      v-if="props.entrance.payload.nested_entrance"
      animated
      v-model="slide"
      :navigation="settingStyle?.carouselStyle !== 'arrows'"
      control-color="[#000]"
      infinite
      :autoplay="settingStyle?.autoPlaySeconds ? settingStyle.autoPlaySeconds * 1000 : 3000"
      :arrows="settingStyle?.carouselStyle === 'arrows'"
      :class="['cursor-pointer', 'px-2', settingStyle?.borderStyle === 'square' ? '!rounded-none' : '!rounded-lg']"
    >
      <template v-slot:navigation-icon="{ active, btnProps, onClick }">
        <q-btn size="sm" :icon="btnProps.icon" color="white" flat round dense @click.stop="onClick" />
      </template>
      <q-carousel-slide
        v-for="(item, index) in props.entrance.payload.nested_entrance"
        :name="index"
        :img-src="
          item.img ? item.img : cmsCustomPage(CMS_PAGE_COMPONENT_TYPE.ImageName[CMS_PAGE_COMPONENT_TYPE.Enums.SLIDER])
        "
      />
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
  import { PropType, ref, watch, computed } from "vue"
  import { useImage } from "src/hook/useImage"
  import { CMS_PAGE_COMPONENT_TYPE } from "src/utils/constants"
  import type * as Request from "src/api/request.type"

  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem> | null,
      required: true,
      default: () => {
        return null
      }
    }
  })

  const { cmsCustomPage } = useImage()

  // 從 entrance.payload.style 讀取樣式
  const settingStyle = computed(() => props.entrance?.payload?.style)

  const slide = ref(0)

  watch(
    () => props.entrance.payload.nested_entrance,
    (newValue) => {
      if (newValue) {
        if (slide.value > newValue?.length - 1) {
          slide.value = 0
        }
      }
    },
    { immediate: true }
  )
</script>

<style scoped lang="scss">
  .slider-wrapper {
    width: 100%;
  }

  .q-carousel {
    height: 7.9375rem;
    box-shadow: 0px 0px 16px 0px #0000001a;
    border-radius: 10px;
    :deep(.q-carousel__slides-container) {
      height: auto;
      .q-carousel__slide {
        height: 7.9375rem;
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
