<template>
  <div class="home-layout">
    <MobileNavCMS v-if="isLargeTablet" />
    <HomeBanner />
    <MarqueeList />
    <HomeBetBy />
    <HomeInformationCMS />
    <HomeListCMS />
    <HomeRankBoard />
  </div>
</template>

<script lang="ts" setup>
import MarqueeList from "app/template/set_r032/components/MarqueeList/Index.vue"
import MobileNavCMS from "app/template/set_r032/components/MobileNavCMS/Index.vue"
import HomeBanner from "app/template/set_r032/pages/HomePage/Components/HomeBanner.vue"
import HomeBetBy from "app/template/set_r032/pages/HomePage/Components/HomeBetBy.vue"
import HomeInformationCMS from "app/template/set_r032/pages/HomePage/Components/HomeInformationCMS.vue"
import HomeListCMS from "app/template/set_r032/pages/HomePage/Components/HomeListCMS.vue"
import HomeRankBoard from "app/template/set_r032/pages/HomePage/Components/HomeRankBoard.vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { isLargeTablet } = useMediaQuery()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r032/assets/css/_variable.scss";

.home-layout {
  @apply w-full mx-auto flex flex-col gap-[1.5rem];
  @apply max-w-[87.5rem] py-[1.875rem];

  @include pad-large-width {
    @apply gap-[.75rem] p-[.625rem];
  }
}
</style>
