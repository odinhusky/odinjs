<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "#imports"
import { usePromotionFlow } from "../../composables/usePromotionFlow"

interface PromotionDetailPageClassObj {
  page?: string
  hero?: string
  title?: string
  content?: string
  detail?: string
  image?: string
  html?: string
}

const props = withDefaults(
  defineProps<{
    classObj?: PromotionDetailPageClassObj
  }>(),
  {
    classObj: () => ({})
  }
)

const { t } = useI18n()

const { backToPromotionList, emptyText, isFetching, isLoading, pageTitle, promotionDetail, rawPromotions } = usePromotionFlow()

const isInitialLoading = computed(() => (isLoading.value || isFetching.value) && rawPromotions.value.length === 0)
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

    <div :class="cx('mx-auto w-full max-w-[1280px] px-6 pb-10 pt-8 phone:px-4 phone:pb-6 phone:pt-4', props.classObj?.content)">
      <div v-if="isInitialLoading" class="flex min-h-[360px] items-center justify-center">
        <BaseIcon name="svg-spinners:ring-resize" size="2rem" class="text-[var(--icon-icon-primary-enabled)]" />
      </div>

      <div
        v-else-if="!promotionDetail"
        class="mx-auto flex min-h-[360px] w-full max-w-[720px] items-center justify-center rounded-lg bg-[var(--color-navy-950)] text-sm text-[var(--color-light-700)]"
      >
        {{ emptyText }}
      </div>

      <article v-else :class="cx('mx-auto w-full max-w-[720px]', props.classObj?.detail)">
        <div class="mb-6 flex items-center gap-3 phone:mb-4">
          <button
            type="button"
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent bg-[linear-gradient(180deg,var(--button-button-bg-secondary-left-enabled)_0%,var(--button-button-bg-secondary-right-enabled)_100%)] text-[var(--button-button-title-icon-secondary-enabled)] transition-colors hover:bg-[linear-gradient(180deg,var(--button-button-bg-icon-secondary-enabled)_0%,var(--button-button-bg-icon-secondary-enabled)_100%)] active:bg-[linear-gradient(180deg,var(--button-button-bg-icon-secondary-active)_0%,var(--button-button-bg-icon-secondary-active)_100%)]"
            :aria-label="t('common.btn.back')"
            @click="backToPromotionList"
          >
            <BaseIcon name="mdi:arrow-left" size="20px" />
          </button>

          <h2 class="min-w-0 text-[28px] font-bold leading-9 phone:text-2xl phone:leading-8">
            {{ promotionDetail.title }}
          </h2>
        </div>

        <BaseImage
          :src="promotionDetail.imageSrc"
          :alt="promotionDetail.title"
          :class-obj="{
            container: cx('block aspect-[2.44/1] w-full overflow-hidden rounded-lg bg-[var(--container-container-bg-secondary)]', props.classObj?.image),
            image: 'h-full w-full object-cover',
            placeholder: 'h-full min-h-0 bg-[var(--container-container-bg-secondary)]'
          }"
        />

        <div
          :class="cx('promotion-detail-html mt-6 text-base leading-6 text-[var(--color-light-900)] phone:mt-5 phone:text-base phone:leading-6', props.classObj?.html)"
          v-html="promotionDetail.contentHtml"
        />
      </article>
    </div>
  </section>
</template>

<style scoped>
.promotion-detail-html :deep(img) {
  max-width: 100%;
  height: auto;
}

.promotion-detail-html :deep(table) {
  width: 100%;
  border-collapse: collapse;
}

.promotion-detail-html :deep(th),
.promotion-detail-html :deep(td) {
  border: 1px solid currentColor;
  padding: 0.25rem 0.5rem;
}
</style>
