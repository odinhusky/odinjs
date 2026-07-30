<script setup lang="ts">
import type { CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"

const {
  homeCmsList,
  isCmsLoading,
  allProductList,
  isAllProductLoading,
  getProductTabImage,
  handleCmsEntranceClick,
  handleProviderClick
} = useHome()
</script>

<template>
  <div :class="cx('w-full py-6 mob:py-2', HOMEVIEW_CONTAINER_GAPPING_CLASS)">
    <!-- Full-width banner (handles its own data) -->
    <HomeBanner />

    <!-- CMS home information image (full-width, outside padded container) -->
    <HomeInformationImageSection />

    <!-- Main content with max-width container -->
    <div :class="cx(HOMEVIEW_CONTAINER_PADDING_X_CLASS)">
      <div :class="cx('w-full', LAYOUT_MAX_WIDTH, 'mx-auto', HOMEVIEW_CONTAINER_GAPPING_CLASS)">
        <!-- Announcement marquee -->
        <HomeMarqueeList />

        <!-- CMS home sections -->
        <template v-if="homeCmsList?.length">
          <div v-for="cmsItem in homeCmsList" :key="cmsItem.id">
            <HomeCmsSection
              :cms-item="cmsItem"
              @entrance-click="(entrance: CmsEntranceItem) => handleCmsEntranceClick(entrance)"
            />
          </div>
        </template>
        <template v-else-if="isCmsLoading">
          <div v-for="sectionIdx in 2" :key="sectionIdx" class="space-y-3">
            <div class="h-7 w-40 rounded bg-[var(--card-card-bg-primary-enabled)] opacity-60" />
            <div class="grid grid-cols-3 gap-3 md:grid-cols-5">
              <div
                v-for="itemIdx in 5"
                :key="itemIdx"
                :class="
                  cx(
                    'h-[132px] rounded-lg bg-[var(--card-card-bg-primary-enabled)] opacity-60 md:h-[182px]',
                    itemIdx > 3 && 'hidden md:block'
                  )
                "
              />
            </div>
          </div>
        </template>

        <!-- Provider carousel (all products) -->
        <div class="min-h-[82px] phone:min-h-[74px]">
          <ProviderListCarousel
            v-if="allProductList?.length"
            :provider-options="allProductList"
            :selected-provider-code="null"
            :get-product-tab-image="getProductTabImage"
            @select-provider="handleProviderClick"
          />
          <div v-else-if="isAllProductLoading" class="grid grid-flow-col auto-cols-[130px] gap-2 overflow-hidden">
            <div
              v-for="idx in 6"
              :key="idx"
              class="h-[74px] rounded-lg bg-[var(--card-card-bg-primary-enabled)] opacity-60"
            />
          </div>
        </div>

        <!-- RankBoard (no game-type = show all) -->
        <RankBoard class="min-h-[588px] phone:min-h-[536px]" />
      </div>
    </div>
  </div>
</template>
