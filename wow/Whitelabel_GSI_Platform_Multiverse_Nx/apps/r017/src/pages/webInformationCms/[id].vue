<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "#imports"
import CmsWebInformationPage from "@shared-src/lib/components/cmsWebInformation/CmsWebInformationPage.vue"

const route = useRoute()
const urlId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : raw
})
</script>

<template>
  <CmsWebInformationPage :url-id="urlId" />
</template>
