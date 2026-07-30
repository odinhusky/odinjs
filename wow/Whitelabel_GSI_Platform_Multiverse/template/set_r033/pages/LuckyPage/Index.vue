<template>
  <section class="lucky-wrapper">
    <LuckyArea />
  </section>
</template>

<script setup lang="ts">
import LuckyArea from "src/common/components/LuckyArea/Index.vue"
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r033/assets/css/_variable.scss";

.lucky-wrapper {
  @apply flex flex-col mx-auto w-full h-full;

  :deep(.q-btn) {
    @apply my-4 rounded-[.5rem] text-base w-[10rem] h-[3.125rem] text-center;
    @apply flex items-center justify-center;

    :deep(.q-btn__content) {
      @apply flex items-center justify-center;
    }
  }

  :deep(.lucky-area) {
  }
}
</style>
