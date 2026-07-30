<script setup lang="ts">
import type { CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"
import type {
  CmsAnnouncementPayload,
  CmsAnnouncementStyleSettings
} from "@shared-lib/api/commonTypes/cmsCustomPageTypes"

const props = defineProps<{
  entrance: CmsEntranceItem
}>()

const { locale } = useI18n()

const payload = computed((): CmsAnnouncementPayload => {
  return (props.entrance.payload as unknown as CmsAnnouncementPayload) ?? {}
})

const settingStyle = computed((): CmsAnnouncementStyleSettings | undefined => payload.value?.style)

// ── 從 nested_entrance 提取各語言公告文字 ─────────────────────────────────────
const announcements = computed((): string[] => {
  return (payload.value?.nested_entrance ?? [])
    .map((ne) => {
      const details = ne.payload?.details ?? []
      const matched = details.find((d) => d.lang === locale.value) ?? details[0]
      return matched?.content ?? ""
    })
    .filter(Boolean)
})

// ── 外層 marginBottom 樣式（動態，保留 inline style） ─────────────────────────
const wrapperStyle = computed(() => {
  if (settingStyle.value?.marginBottom !== undefined) {
    return { marginBottom: `${settingStyle.value.marginBottom}px` }
  }
  return {}
})

// ── MarqueeList 容器覆蓋樣式（顏色 + 圓角均為動態 CMS 值，保留 inline style） ────
const marqueeStyle = computed(() => {
  const style: Record<string, string> = {}
  if (settingStyle.value?.backgroundColor) {
    style.backgroundColor = settingStyle.value.backgroundColor
  }
  style.borderRadius = settingStyle.value?.borderStyle === "square" ? "8px" : "50px"
  return style
})
</script>

<template>
  <div :style="wrapperStyle">
    <MarqueeList :items="announcements" :icon-src="settingStyle?.icon || undefined" :style="marqueeStyle" />
  </div>
</template>
