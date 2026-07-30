<template>
  <div class="custom-text-wrapper" :style="wrapperStyle">
    <div
      v-if="currentContent"
      class="text-container"
      :class="[settingStyle?.borderStyle === 'square' ? 'rounded-none' : 'rounded-lg']"
      :style="containerStyle"
    >
      <div v-if="currentContent.title" v-html="currentContent.title" class="title" />
      <div v-html="currentContent.content" class="content" />
    </div>
    <div
      v-else
      class="text-container"
      :class="[settingStyle?.borderStyle === 'square' ? 'rounded-none' : 'rounded-lg']"
      :style="containerStyle"
    >
      {{ $t("cms.title_text") }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useLanguage } from "src/common/composables/useLanguage"
import type * as Response from "src/api/response.type"
import type { CmsTextPayload, CmsTextPageItem, CmsStyleSettings } from "src/types/cmsCustomPage"

const { nowLang } = useLanguage()

const props = defineProps<{
  entrance: Response.CmsEntranceItem
}>()

const payload = computed(() => props.entrance.payload as unknown as CmsTextPayload)

// 從 entrance.payload.style 讀取樣式
const settingStyle = computed((): CmsStyleSettings | undefined => payload.value?.style)

// 計算外層容器樣式（包含 marginBottom）
const wrapperStyle = computed(() => {
  const style: Record<string, string | undefined> = {}

  if (settingStyle.value?.marginBottom !== undefined) {
    style.marginBottom = `${settingStyle.value.marginBottom}px`
  }

  return style
})

// 計算內層容器樣式
const containerStyle = computed(() => {
  const style: Record<string, string | undefined> = {}

  if (settingStyle.value?.backgroundColor) {
    style.backgroundColor = settingStyle.value.backgroundColor
  }
  if (settingStyle.value?.textColor) {
    style.color = settingStyle.value.textColor
  }
  if (settingStyle.value?.padding !== undefined) {
    style.padding = `${settingStyle.value.padding}px`
  }

  return style
})

const currentContent = computed((): CmsTextPageItem | null => {
  if (!payload.value?.page || !Array.isArray(payload.value.page)) {
    return null
  }

  const currentLangContent = payload.value.page.find((item: CmsTextPageItem) => item.lang === nowLang.value)

  return currentLangContent || payload.value.page[0] || null
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.custom-text-wrapper {
  width: 100%;
}

.text-container {
  cursor: pointer;
  font-family: OpenSans;

  .title {
    @apply text-[1.25rem] font-bold mb-2;
    color: inherit;
  }

  .content {
    @apply text-[1rem];
    color: inherit;

    :deep(a) {
      pointer-events: auto;
      cursor: pointer;
      color: var(--primary-color, #3b82f6);

      &:hover {
        text-decoration: underline;
      }
    }

    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      color: inherit;
    }

    :deep(p) {
      color: inherit;
      margin: 0;
    }

    :deep(em) {
      color: inherit;
    }
  }
}
</style>
