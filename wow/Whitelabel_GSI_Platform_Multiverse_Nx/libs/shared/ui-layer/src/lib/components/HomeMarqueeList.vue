<script setup lang="ts">
import { useAnnouncementList } from "@shared-lib/api/hooks/useAnnouncementList"

const { locale } = useI18n()
const { announcementList } = useAnnouncementList()

const titles = computed(() => {
  if (!announcementList.value?.length) return []
  return announcementList.value
    .map((ann) => ann.detail?.[locale.value]?.title || ann.detail?.["en"]?.title || "")
    .filter(Boolean)
})
</script>

<template>
  <MarqueeList :items="titles" />
</template>
