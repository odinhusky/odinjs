<template>
  <Promotion id="promotion" class="w-full" />
</template>

<script lang="ts" setup>
import Promotion from "src/common/components/Promotion/Index.vue"
</script>

<style lang="scss" scoped>
// #promotion {
//   --neutral-02: green;
// }
:deep(.promotion-area) {
  .content-area .promo-tab-wrap .tab {
    padding: 0.5rem 1.25rem!important;
  }

  .title-area {
    background: var(--bg-14, #FFFFFF1A);
  }
}

</style>
