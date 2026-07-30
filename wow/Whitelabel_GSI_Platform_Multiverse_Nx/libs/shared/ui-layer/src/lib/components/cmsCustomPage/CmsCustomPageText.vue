<script setup lang="ts">
import type { CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"
import type {
  CmsTextPayload,
  CmsTextPageItem,
  CmsStyleSettings
} from "@shared-lib/api/commonTypes/cmsCustomPageTypes"

const props = defineProps<{
  entrance: CmsEntranceItem
}>()

const { locale } = useI18n()

const payload = computed((): CmsTextPayload => {
  return (props.entrance.payload as unknown as CmsTextPayload) ?? {}
})

const settingStyle = computed((): CmsStyleSettings | undefined => payload.value?.style)

/** 根據目前語言找到對應的頁面資料，fallback 第一筆 */
const currentPage = computed((): CmsTextPageItem | undefined => {
  const pages = payload.value?.page ?? []
  if (!pages.length) return undefined
  return pages.find((p) => p.lang === locale.value) ?? pages[0]
})

const wrapperStyle = computed(() => {
  const style: Record<string, string> = {}
  if (settingStyle.value?.marginBottom !== undefined) {
    style.marginBottom = `${settingStyle.value.marginBottom}px`
  }
  return style
})

const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  if (settingStyle.value?.backgroundColor) style.backgroundColor = settingStyle.value.backgroundColor
  if (settingStyle.value?.textColor) style.color = settingStyle.value.textColor
  if (settingStyle.value?.padding !== undefined) style.padding = `${settingStyle.value.padding}px`
  return style
})

const borderClass = computed(() => (settingStyle.value?.borderStyle === "square" ? "rounded-none" : "rounded-lg"))
</script>

<template>
  <div v-if="currentPage" :style="wrapperStyle">
    <div :class="['cms-text', borderClass, 'overflow-hidden']" :style="containerStyle">
      <h2 v-if="currentPage.title" class="cms-text__title mb-2 text-xl font-semibold" v-html="currentPage.title" />
      <div class="cms-text__content text-sm leading-relaxed" v-html="currentPage.content" />
    </div>
  </div>
</template>

<style scoped>
.cms-text__title :deep(*) {
  all: revert;
}
.cms-text__content :deep(*) {
  all: revert;
}
</style>
