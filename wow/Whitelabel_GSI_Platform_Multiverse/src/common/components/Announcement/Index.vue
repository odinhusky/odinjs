<template>
  <div>
    <component
      :is="compMap[props.module]"
      :style-class="get(props, 'styleClass', {})"
      :enable-advanced-announcement-filters="props.enableAdvancedAnnouncementFilters"
    />
  </div>
</template>

<script setup lang="ts">
import Module1 from "./components/module1/Index.vue"
import type { NestedStyle } from "./types/announcementTypes"
import get from "lodash/get"

const props = withDefaults(
  defineProps<{
    module?: "module1"
    styleClass?: NestedStyle
    enableAdvancedAnnouncementFilters?: boolean
  }>(),
  {
    module: "module1",
    enableAdvancedAnnouncementFilters: false
  }
)

const compMap = {
  module1: Module1
} as const
</script>

<style scoped></style>
