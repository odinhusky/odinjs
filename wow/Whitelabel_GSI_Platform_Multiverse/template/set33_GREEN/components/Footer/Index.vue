<template>
  <div class="footer-wrapper">
    <footer class="layout-footer">
      <ul v-if="cmsFooterLogos && cmsFooterLogos.length" class="footer-logo-list">
        <li
          class="flex items-center py-1 phone:py-2 px-[.625rem] phone:px-[1.5625rem]"
          v-for="footer in cmsFooterLogos"
          :key="footer"
        >
          <q-img class="logo-image" :src="footer" fit="contain" :error-src="productDefaultImg" />
        </li>
      </ul>
      <div class="content-wrapper" v-if="cmsFooterTextContent?.content">
        <div class="content cms-content" v-html="cmsFooterTextContent?.content"></div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { useCms } from "src/common/composables/useCms"
import { useCommonImg } from "src/common/hooks/useCommonImg"

const { productDefaultImg } = useCommonImg()
const {
  cmsFooterLogos,
  cmsFooterTextContent,
} = useCms()

</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set33_GREEN/assets/css/_variable.sass";

.footer-wrapper {
  @apply bg-black text-white pb-[5.8rem];

  @include phone-width {
    @apply pb-[7.5rem];
  }

  @include iphone-width {
    @apply pb-[6rem];
  }

  .layout-footer {
    @apply flex flex-col;
    font-size: 0.6875rem;
    padding: 0 0.8125rem;
    max-width: 85.375rem;
    align-self: center;
    background-color: var(--neutral-2);
    margin: 0 auto;
  }
}

.footer-logo-list {
  @apply flex flex-wrap justify-center py-4;
  border-bottom: 1px dashed #fff;
}

.logo-image {
  @apply w-[7.5rem] h-auto object-contain;
}

.content-wrapper {
  @apply mt-4;
}
</style>
