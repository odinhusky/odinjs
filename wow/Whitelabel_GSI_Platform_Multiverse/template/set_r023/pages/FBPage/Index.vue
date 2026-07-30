<template>
  <div class="fb-sports-page">
    <section class="fb-sports-wrapper">
      <FBSportsArea />
    </section>
    <FooterNav />
  </div>
</template>

<script setup lang="ts">
import FooterNav from "app/template/set_r023/components/Footer/FooterNav.vue"
import FBSportsArea from "src/common/components/FBSportsArea/Index.vue"
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.fb-sports-page {
  @apply flex h-full w-full flex-col;
}

.fb-sports-wrapper {
  @apply mx-auto flex h-full w-full max-w-[87.5rem] flex-col;
  position: relative;
  z-index: 1;

  @include pad-large-width {
    width: 100vw;
    min-width: 375px;
    height: calc(100dvh - 3.125rem - 4.0625rem);
    min-height: 600px;
    max-width: none;
    overflow: hidden;
  }
}
</style>
