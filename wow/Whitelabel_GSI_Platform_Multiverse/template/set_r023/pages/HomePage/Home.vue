<template>
  <link rel="stylesheet" href="/css/_var.css" />
  <link rel="stylesheet" href="/css/site/r023/_var.css" />
  <div class="home-layout">
    <MobileNavCMS v-if="isLargeTablet" />
    <HomeBanner />
    <MarqueeList />
    <HomeInformationCMS />
    <HomeListCMS />
    <Leaderboard v-if="envInfo.leaderboard_enabled" />
  </div>
</template>

<script lang="ts" setup>
import { useEnvInfoStore } from "src/stores/envStore"
import Leaderboard from "src/common/components/Leaderboard/Index.vue"
import MarqueeList from "app/template/set_r023/components/MarqueeList/Index.vue"
import MobileNavCMS from "app/template/set_r023/components/MobileNavCMS/Index.vue"
import HomeBanner from "app/template/set_r023/pages/HomePage/Components/HomeBanner.vue"
import HomeInformationCMS from "app/template/set_r023/pages/HomePage/Components/HomeInformationCMS.vue"
import HomeListCMS from "app/template/set_r023/pages/HomePage/Components/HomeListCMS.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { envInfo } = useEnvInfoStore()
const { isLargeTablet } = useMediaQuery()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r023/assets/css/_variable.scss";

.home-layout {
  @apply w-full mx-auto flex flex-col gap-[1.5rem];
  @apply max-w-[87.5rem] py-[1.875rem];

  @include pad-large-width {
    @apply gap-[.75rem] p-[.625rem];
  }
}
</style>
