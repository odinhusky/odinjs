<template>
  <div v-if="marqueeAnnouncements.length" class="marquee-area">
    <img :src="svgIcon('marquee')" alt="marquee-icon" />
    <div class="w-[calc(100%-1.5rem)]">
      <Vue3Marquee>
        <div
          v-for="marquee in marqueeAnnouncements"
          :key="marquee.id"
          class="marquee-item"
          @click="handleShowSingleAnnouncement(marquee.id)"
        >
          {{ marquee.langDetail?.title }}
        </div>
      </Vue3Marquee>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/okbet_green/hooks/useSiteImg"
import { useAnnouncement } from "src/common/composables/useAnnonucement"
import { Vue3Marquee } from "vue3-marquee"

const { svgIcon } = useSiteImg()
const { marqueeAnnouncements, handleShowSingleAnnouncement } = useAnnouncement()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_green/assets/css/_variable.sass";

.marquee-area {
  @apply flex items-center gap-3 px-4 w-full;
  border-radius: 999px;
  height: 2.3755rem;
  line-height: 2.3755rem;
  background: var(--secondary-10);
  backdrop-filter: blur(2px);
  margin-bottom: 0.75rem;

  @include iphone-width {
    margin: 0.75rem 0;
  }

  .marquee-item {
    background-image: linear-gradient(to right, var(--ticker-01) 0%, var(--ticker-02) 100%);
    @apply bg-clip-text text-transparent;
    height: 2.3755rem;
    line-height: 2.3755rem;
    font-size: 0.875rem;
    margin-left: 1.25rem;
    cursor: pointer;
  }

  img {
    width: 1.5rem;
    position: relative;
  }
}
</style>
