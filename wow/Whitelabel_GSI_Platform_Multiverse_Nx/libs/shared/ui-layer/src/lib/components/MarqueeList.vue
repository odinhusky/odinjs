<script setup lang="ts">
interface Props {
  items: string[]
  iconSrc?: string
}

const props = defineProps<Props>()
const { t } = useI18n()

// Duplicate items for seamless CSS marquee loop
const marqueeItems = computed(() => {
  if (!props.items.length) return []
  return [...props.items, ...props.items]
})
</script>

<template>
  <div class="flex items-center gap-3 rounded-[100px] px-4 py-2 overflow-hidden bg-[var(--news-ticker-news-ticker-bg)]">
    <BaseImage
      :src="props.iconSrc || '/images/marquee.webp'"
      :alt="t('announcement_center')"
      class="w-6 h-6 flex-shrink-0"
    />

    <div class="overflow-hidden flex-1">
      <!-- 有資料：跑馬燈動畫 -->
      <div v-if="marqueeItems.length" class="marquee-track flex gap-8 w-max">
        <span
          v-for="(title, idx) in marqueeItems"
          :key="idx"
          class="whitespace-nowrap text-[14px] font-normal leading-[20px] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-[linear-gradient(90deg,var(--news-ticker-news-ticker-title-light)_0%,var(--news-ticker-news-ticker-title-dark)_100%)]"
        >
          {{ title }}
        </span>
      </div>
      <!-- 無資料：靜態提示文字 -->
      <span
        v-else
        class="whitespace-nowrap text-[14px] font-normal leading-[20px] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] bg-[linear-gradient(90deg,var(--news-ticker-news-ticker-title-light)_0%,var(--news-ticker-news-ticker-title-dark)_100%)]"
      >
        {{ t("common.no_data") }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.marquee-track {
  animation: marquee-scroll 20s linear infinite;
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
