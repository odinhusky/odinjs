<template>
  <div class="home-layout">
    <MobileNavCMS v-if="isLargeTablet" />
    <HomeBanner />
    <MarqueeList />

    <DeferredMount min-height="28rem" trigger="interaction">
      <HomeBetBy />
    </DeferredMount>

    <DeferredMount min-height="12rem">
      <HomeInformationCMS />
    </DeferredMount>

    <DeferredMount min-height="20rem">
      <HomeListCMS />
    </DeferredMount>

    <DeferredMount v-if="envInfo.leaderboard_enabled" min-height="16rem">
      <Leaderboard />
    </DeferredMount>
  </div>
</template>

<script lang="ts" setup>
import DeferredMount from "app/template/set_r022/components/DeferredMount.vue"
import MarqueeList from "app/template/set_r022/components/MarqueeList/Index.vue"
import MobileNavCMS from "app/template/set_r022/components/MobileNavCMS/Index.vue"
import HomeBanner from "app/template/set_r022/pages/HomePage/Components/HomeBanner.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useEnvInfoStore } from "src/stores/envStore"
import { defineAsyncComponent } from "vue"

/** 以下區塊拆成獨立 chunk，並等接近視窗才載入/執行，降低首屏 unused JS */
const HomeBetBy = defineAsyncComponent(
  () => import("app/template/set_r022/pages/HomePage/Components/HomeBetBy.vue")
)
const HomeInformationCMS = defineAsyncComponent(
  () => import("app/template/set_r022/pages/HomePage/Components/HomeInformationCMS.vue")
)
const HomeListCMS = defineAsyncComponent(
  () => import("app/template/set_r022/pages/HomePage/Components/HomeListCMS.vue")
)
const Leaderboard = defineAsyncComponent(() => import("src/common/components/Leaderboard/Index.vue"))

const { envInfo } = useEnvInfoStore()
const { isLargeTablet } = useMediaQuery()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.home-layout {
  @apply w-full mx-auto flex flex-col gap-[1.5rem];
  @apply max-w-[87.5rem] py-[1.875rem];

  @include pad-large-width {
    @apply gap-[.75rem] p-[.625rem];
  }
}
</style>
