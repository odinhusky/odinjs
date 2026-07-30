<template>
  <div
    v-if="pageContent"
    v-html="pageContent"
    class="custom-text-wrapper px-2"
    :style="{
      backgroundColor: settingStyle?.backgroundColor,
      color: settingStyle?.textColor,
      padding: settingStyle?.padding ? `${settingStyle.padding}px` : undefined
    }"
  ></div>
  <div
    v-else
    class="custom-text-wrapper"
    :style="{
      backgroundColor: settingStyle?.backgroundColor,
      color: settingStyle?.textColor,
      padding: settingStyle?.padding ? `${settingStyle.padding}px` : undefined
    }"
  >
    {{ $t("cms.title_text") }}
  </div>
</template>

<script setup lang="ts">
  import { PropType, computed } from "vue"
  import { useCms } from "src/composables/useCms"
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

  const { parsePage } = useCms()

  // 從 entrance.payload.style 讀取樣式
  const settingStyle = computed(() => props.entrance?.payload?.style)

  const pageContent = computed(() => {
    const page = parsePage(props.entrance.payload.page)

    if (page) return page.content

    return ""
  })
</script>

<style scoped lang="scss">
  .custom-text-wrapper {
    cursor: pointer;
    padding: 0.4063rem 0;
    font-family: OpenSans;
    font-weight: 700;
    font-size: 1.25rem;
    color: #2a354b;

    :deep(a) {
      pointer-events: none;
      cursor: default;
    }
  }
</style>
