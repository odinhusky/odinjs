<template>
  <section class="digitain-wrapper">
    <DigitainArea />
  </section>
</template>

<script setup lang="ts">
import DigitainArea from "src/common/components/DigitainArea/Index.vue"
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";

.digitain-wrapper {
  @apply flex flex-col mx-auto w-full h-full;

  :deep(.q-btn) {
    @apply my-4 rounded-[.5rem] text-base w-[10rem] h-[3.125rem] text-center;
    @apply flex items-center justify-center;

    :deep(.q-btn__content) {
      @apply flex items-center justify-center;
    }
  }

  :deep(.digitain-area) {
  }
}
</style>
