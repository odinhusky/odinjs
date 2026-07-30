<template>
  <div class="content-wrapper" id="scrollDom" @scroll="handleInnerScroll()">
    <div class="home-content-cms" v-if="cmsHomeList.length">
      <div v-for="(cmsItem, cmsIndex) in cmsHomeList" :key="cmsIndex" class="content-item">
        <template v-if="shouldDisplayDevice(cmsItem)">
          <div v-if="cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] !== ''" class="title-wrapper">
            <div class="title-label-container">
              <q-img
                v-if="cmsItem.Setting.icon_path"
                :src="cmsItem.Setting.icon_path"
                :alt="cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] || ''"
                @error="setDefaultProductImg"
                class="title-icon"
              />
              <p class="title-label">
                {{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
              </p>
            </div>
            <q-btn
              v-if="cmsItem.Setting.payload?.view_all === CMS_VIEW_ALL.Enums.SHOW"
              :to="{ name: 'CmsHome', params: { cmsId: cmsItem.id } }"
              flat
              :label="$t('common.btn.viewAll')"
              class="view-all-btn"
            >
              <Icon icon="fa-solid:chevron-right" class="view-all-icon" width="0.875rem" height="0.875rem" aria-hidden="true" />
            </q-btn>
          </div>
          <template v-if="isCarousel(cmsItem)">
            <div class="game-list game-list-carousel">
              <div class="game-carousel">
                <Carousel :breakpoints="getBreakpoints(cmsItem)" :transition="500">
                  <Slide v-for="(entrance, entranceIndex) in cmsItem.Entrance" :key="entranceIndex">
                    <CmsGameItem :entrance="entrance" />
                  </Slide>
                  <template #addons>
                    <Navigation />
                  </template>
                </Carousel>
              </div>
            </div>
          </template>
          <template v-else>
            <ul class="game-list">
              <div class="game-grid" :style="getGridStyle(cmsItem)">
                <div v-for="(entrance, entranceIndex) in cmsItem.Entrance" :key="entranceIndex">
                  <CmsGameItem :entrance="entrance" />
                </div>
              </div>
            </ul>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { computed, ref } from "vue"
import { Carousel, Navigation, Slide } from "vue3-carousel"
import "vue3-carousel/dist/carousel.css"

import CmsGameItem from "app/template/set_r022/pages/HomePage/CMS/CmsGameItem.vue"
import type * as Response from "src/api/response.type"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { ensureFaSolidSubsetRegistered } from "src/common/icons/faSolidSubset"
import { CMS_VIEW_ALL, LANGUAGE_TYPE } from "src/common/utils/constants"

ensureFaSolidSubsetRegistered()

const {
  getBreakpoints,
  shouldDisplayDevice,
  getGridStyle,
  cmsHomeList,
} = useCms()
const { nowLang } = useLanguage()
const { setDefaultProductImg } = useCommonImg()

const innerScrollTop = ref(0)

const isCarousel = computed(() => (cmsItem: Response.CmsItem) => {
  return cmsItem.Setting.payload?.arrangement === 0
})

const handleInnerScroll = () => {
  const element = document.getElementById("scrollDom")
  innerScrollTop.value = element?.scrollTop ?? 0
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.home-content-cms {
  @apply flex flex-col gap-[1.5rem];

  .content-item {
    @apply flex flex-col;

    .title-wrapper {
      @apply flex items-center justify-between mb-1;

      .title-label-container {
        @apply flex items-center;

        .title-icon {
          @apply w-10 h-10;
        }

        .title-label {
          @apply text-xl ml-[.5rem];
          color: var(--secondary-01);
        }
      }

      .view-all-btn {
        @apply text-[.875rem] rounded-[.5rem];
        color: var(--primary-02);

        :deep(.view-all-icon) {
          @apply ml-[.25rem] shrink-0;
        }
      }
    }
  }

  .game-list {
    .carousel {
      @apply w-full;

      @include pad-large-width {
        @apply min-w-full;
        margin-left: 4px;
      }
    }

    :deep(.carousel__track) {
      @apply flex;
    }

    :deep(.carousel__slide) {
      @apply pr-4;

      @include pad-large-width {
        @apply pr-[8px];
      }
    }

    :deep(.carousel__prev),
    :deep(.carousel__next) {
      @apply absolute rounded-full overflow-hidden;
      color: var(--text-01);
      backdrop-filter: blur(0.125rem);
      text-indent: -6.25rem;
      background: rgba(var(--gray-01-rgb), 0.6);

      &:hover {
        background: var(--primary-01);
      }
    }
    :deep(.carousel__prev) {
      @apply left-[-14px];

      @include pad-large-width {
        @apply left-[-23px];
      }
    }
    :deep(.carousel__next) {
      @apply right-[-14px];

      @include pad-large-width {
        @apply right-[-14px];
      }
    }
  }

  .game-grid {
    @apply grid gap-4;
    grid-template-columns: repeat(var(--grid-columns), 1fr);

    @include pad-large-width {
      @apply grid gap-3;
    }
  }
}
</style>
