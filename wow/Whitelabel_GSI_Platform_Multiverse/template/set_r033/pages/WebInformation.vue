<template>
  <div class="web-information-layout">
    <WebInformation />
  </div>
</template>

<script lang="ts" setup>
import WebInformation from "src/common/components/WebInformation/Index.vue"
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r033/assets/css/_variable.scss";

.web-information-layout {
  max-width: 75rem;
  margin: 0 auto;
  padding: 3.75rem 0 3.25rem;
  width: 100%;

  @include phone-width {
    padding-bottom: 1.25rem;
  }
}
</style>
