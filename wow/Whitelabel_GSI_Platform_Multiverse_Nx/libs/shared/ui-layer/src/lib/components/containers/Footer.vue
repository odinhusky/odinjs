<script setup lang="ts">
import { useCmsFooter } from "@shared-lib/composables/useCmsFooter"

const { cmsFooterLogos, cmsFooterTextContent, hasFooterContent } = useCmsFooter()
</script>

<template>
  <footer v-if="hasFooterContent" class="w-full bg-[var(--footer-footer-bg)] p-10 phone:p-5">
    <div :class="cx(FLEX_COL, 'gap-4 mx-auto w-[90%] max-w-[1400px] phone:w-full')">
      <ul
        v-if="cmsFooterLogos.length"
        :class="cx(FLEX_CENTER, 'flex-row flex-wrap gap-x-[1.5625rem] gap-y-2 phone:gap-x-[0.625rem]')"
      >
        <li v-for="src in cmsFooterLogos" :key="src" class="py-2 phone:py-1">
          <BaseImage
            :src="src"
            :alt="src"
            :class-obj="{ container: 'w-[7.5rem] h-auto', image: 'w-[7.5rem] h-auto object-contain' }"
          />
        </li>
      </ul>

      <div
        v-if="cmsFooterTextContent?.content"
        class="cms-content text-sm leading-5 text-[var(--footer-footer-title)]"
        v-html="cmsFooterTextContent.content"
      />
    </div>
  </footer>
</template>
