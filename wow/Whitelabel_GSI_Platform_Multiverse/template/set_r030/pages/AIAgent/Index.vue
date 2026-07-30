<template>
  <section class="agent-wrapper">
    <BackgroundAnimation />
    <DesktopAIAgent v-if="!isMobile" theme="set_r030" />
    <MobileAIAgent v-else theme="set_r030" />
  </section>
</template>

<script setup lang="ts">
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import DesktopAIAgent from "app/template/set_r030/pages/AIAgent/Desktop/DesktopAIAgent.vue"
import MobileAIAgent from "app/template/set_r030/pages/AIAgent/Mobile/MobileAIAgent.vue"
import BackgroundAnimation from "app/template/set_r030/components/BackgroundAnimation/Index.vue"

const { isMobile } = useMediaQuery()
</script>

<style lang="scss">
@import "src/common/css/AIAgent/theme.scss";
</style>

<style scoped lang="scss">
.agent-wrapper {
  position: relative;
  min-height: 100vh;
  background: #0b0f19;
  overflow: hidden;

  :deep(.background-animation-wrapper) {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  > *:not(:first-child) {
    position: relative;
    z-index: 1;
  }
}
</style>
