<template>
  <div class="fb-sports-page-content">
    <section class="fb-sports-wrapper">
      <FBSportsArea />
    </section>
    <FooterNav />
  </div>
</template>

<script setup lang="ts">
import FooterNav from "app/template/set_r025/components/Footer/FooterNav.vue"
import FBSportsArea from "src/common/components/FBSportsArea/Index.vue"
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.fb-sports-page-content {
  @apply flex h-full w-full flex-col;

  @include pad-large-width {
    width: 100vw;
    min-width: 375px;
    height: 100dvh;
    min-height: 600px;
    padding-top: 3.4375rem;
    overflow: hidden;
  }
}

.fb-sports-wrapper {
  @apply mx-auto flex h-full w-full max-w-[87.5rem] flex-col;
  position: relative;
  z-index: 1;

  @include pad-large-width {
    width: 100vw;
    min-width: 375px;
    height: calc(100dvh - 3.4375rem - 3.75rem);
    min-height: 600px;
    max-width: none;
    overflow: hidden;
  }
}

@include pad-large-width {
  :deep(.footer-nav) {
    display: block;
  }
}
</style>
