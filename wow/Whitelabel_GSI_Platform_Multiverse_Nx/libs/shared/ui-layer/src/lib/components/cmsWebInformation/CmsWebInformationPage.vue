<script setup lang="ts">
import { navigateTo } from "#imports"
import { useCmsWebInformationPage } from "@shared-lib/composables/useCmsWebInformationPage"

const props = defineProps<{
  urlId: number | string
}>()

const { title, content, hasContent, isLoading, isError, tabs } = useCmsWebInformationPage(() => props.urlId)
</script>

<template>
  <div :class="cx(HOMEVIEW_CONTAINER_PADDING_X_CLASS, HOMEVIEW_CONTAINER_PADDING_Y_CLASS)">
    <div :class="cx('w-full mx-auto', LAYOUT_MAX_WIDTH)">
      <div class="w-full">
        <div
          v-if="tabs.length"
          class="w-full overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div class="flex w-max flex-nowrap items-start">
            <BaseTab
              v-for="tab in tabs"
              :key="tab.urlId"
              category="default"
              :active="tab.isActive"
              :class-obj="{ item: 'shrink-0 min-w-fit whitespace-nowrap' }"
              @click="navigateTo(tab.to)"
            >
              {{ tab.label }}
            </BaseTab>
          </div>
        </div>

        <div
          :class="
            cx(
              'min-h-[556px] w-full bg-[var(--surface-surface-contrainer)] px-6 py-5 mob:min-h-0 mob:p-3',
              'rounded-tr-lg rounded-br-lg rounded-bl-lg',
              '[box-shadow:0_-2px_8px_rgba(0,0,0,0.3)]',
              !tabs.length && 'rounded-tl-lg'
            )
          "
        >
          <div v-if="isLoading" class="cms-web-information__state">Loading...</div>
          <div v-else-if="isError" class="cms-web-information__state">Failed to load content.</div>
          <div v-else-if="!hasContent" class="cms-web-information__state">No content available.</div>
          <article v-else class="flex flex-col gap-4">
            <h1 v-if="title" class="m-0 text-2xl leading-7 font-bold text-[var(--text-text-primary)]">
              {{ title }}
            </h1>
            <div
              v-if="content"
              class="cms-web-information__content text-base leading-6 text-[var(--text-text-primary)]"
              v-html="content"
            ></div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cms-web-information__state {
  padding: 2rem 0;
  text-align: center;
  color: var(--p-text-muted-color, #888);
}

.cms-web-information__content {
  overflow-wrap: break-word;
  word-break: break-word;
}

.cms-web-information__content :deep(img) {
  max-width: 100%;
  height: auto;
}

.cms-web-information__content :deep(table) {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
}

.cms-web-information__content :deep(a) {
  word-break: break-all;
}
</style>
