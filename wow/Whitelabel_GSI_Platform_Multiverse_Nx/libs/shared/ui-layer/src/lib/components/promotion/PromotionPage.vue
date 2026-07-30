<script setup lang="ts">
import { computed } from "vue"
import { usePromotionFlow } from "../../composables/usePromotionFlow"
import type { PROMOTION_TYPE_ENUMS } from "../../constants/enums/promotionType"

interface PromotionPageClassObj {
  page?: string
  hero?: string
  title?: string
  content?: string
  tabs?: string
  grid?: string
  card?: string
}

const props = withDefaults(
  defineProps<{
    classObj?: PromotionPageClassObj
  }>(),
  {
    classObj: () => ({})
  }
)

const {
  activeType,
  emptyText,
  isFetching,
  isLoading,
  pageTitle,
  promotionList,
  rawPromotions,
  typeOptions,
  changeType,
  detailRoute
} = usePromotionFlow()

const isInitialLoading = computed(() => (isLoading.value || isFetching.value) && rawPromotions.value.length === 0)

const updateActiveType = (value: PROMOTION_TYPE_ENUMS) => {
  changeType(value)
}
</script>

<template>
  <section :class="cx('min-h-full text-[var(--text-text-primary)]', props.classObj?.page)">
    <div
      :class="
        cx(
          'mx-auto flex h-[118px] w-full max-w-[1280px] items-center overflow-hidden px-10 phone:h-[92px] phone:px-4',
          props.classObj?.hero
        )
      "
    >
      <h1 :class="cx('text-[36px] font-bold leading-[44px] phone:text-2xl phone:leading-8', props.classObj?.title)">
        {{ pageTitle }}
      </h1>
    </div>

    <div :class="cx('mx-auto w-full max-w-[1280px] px-6 pb-10 pt-8 phone:px-0 phone:pb-6 phone:pt-0', props.classObj?.content)">
      <div :class="cx('mx-auto w-full max-w-[1120px] phone:max-w-none', props.classObj?.tabs)">
        <PromotionCategoryTabs :model-value="activeType" :options="typeOptions" @update:model-value="updateActiveType" />
      </div>

      <div v-if="isInitialLoading" class="flex min-h-[360px] items-center justify-center">
        <BaseIcon name="svg-spinners:ring-resize" size="2rem" class="text-[var(--icon-icon-primary-enabled)]" />
      </div>

      <div
        v-else-if="!promotionList.length"
        class="mx-auto mt-8 flex min-h-[260px] w-full max-w-[1120px] items-center justify-center rounded-lg bg-[var(--color-navy-950)] text-sm text-[var(--color-light-700)] phone:mx-4 phone:w-auto"
      >
        {{ emptyText }}
      </div>

      <div
        v-else
        :class="
          cx(
            'mx-auto mt-6 grid w-full max-w-[1120px] grid-cols-3 gap-5 phone:mt-3 phone:grid-cols-1 phone:gap-5 phone:px-4',
            props.classObj?.grid
          )
        "
      >
        <PromotionCard
          v-for="promotion in promotionList"
          :key="promotion.detail.promotion_id"
          :title="promotion.detail.title"
          :image-src="promotion.imageSrc"
          :to="detailRoute(promotion.detail.promotion_id)"
          :class="props.classObj?.card"
        />
      </div>
    </div>
  </section>
</template>
