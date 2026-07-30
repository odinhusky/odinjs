<template>
  <section class="custom-page-wrapper slider-theme">
    <div v-for="(entrance, index) in entranceList" :key="`entrance-${index}`" class="entrance-item">
      <component
        :is="getEntranceComponent(entrance.type as number)"
        :entrance="entrance"
        :handleEntranceClick="handleEntranceClick"
        :siteKey="(entrance.type as number) === CMS_PAGE_COMPONENT_TYPE.Enums.GAME_ENTRANCE && envInfo.siteKey"
      />
    </div>
    <FooterNav />
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import { useEntranceHandler } from "app/template/okbet/composables/useCms"
import { useEnvInfoStore } from "src/stores/envStore"
import FooterNav from "app/template/okbet/components/Footer/FooterNav.vue"
import CustomSlider from "src/common/components/CmsCustomComponents/CustomSlider.vue"
import CustomText from "src/common/components/CmsCustomComponents/CustomText.vue"
import CustomImage from "src/common/components/CmsCustomComponents/CustomImage.vue"
import CustomGameEntrance from "src/common/components/CmsCustomComponents/CustomGameEntrance.vue"
import CustomLeaderboard from "src/common/components/CmsCustomComponents/CustomLeaderboard.vue"
import CustomAnnouncement from "src/common/components/CmsCustomComponents/CustomAnnouncement.vue"
import CustomNavbar from "src/common/components/CmsCustomComponents/CustomNavbar.vue"
import { useDetailCms } from "src/common/apiHooks/cms/useDetailCms"
import { CMS_PAGE_COMPONENT_TYPE } from "src/common/utils/constants"

const route = useRoute()
const { envInfo } = useEnvInfoStore()

const cmsCustomPageId = computed(() => Number(route.params.cmsCustomPageId))

// 主要打 API 獲取 cms detail
const { cmsDetailData } = useDetailCms({ id: cmsCustomPageId.value })

const entranceList = computed(() => cmsDetailData.value?.Entrance ?? [])

const { handleEntranceClick } = useEntranceHandler()

const componentTypeMap = {
  [CMS_PAGE_COMPONENT_TYPE.Enums.SLIDER]: CustomSlider,
  [CMS_PAGE_COMPONENT_TYPE.Enums.TEXT]: CustomText,
  [CMS_PAGE_COMPONENT_TYPE.Enums.IMAGE]: CustomImage,
  [CMS_PAGE_COMPONENT_TYPE.Enums.GAME_ENTRANCE]: CustomGameEntrance,
  [CMS_PAGE_COMPONENT_TYPE.Enums.ANNOUNCEMENT]: CustomAnnouncement,
  [CMS_PAGE_COMPONENT_TYPE.Enums.LEADERBOARD]: CustomLeaderboard,
  [CMS_PAGE_COMPONENT_TYPE.Enums.NAVBAR]: CustomNavbar
} as const

const getEntranceComponent = (type: number) => {
  const component = componentTypeMap[type as keyof typeof componentTypeMap] || null
  if (!component) {
    console.warn(`[CmsCustomPage] Unknown entrance type: ${type}. Available types:`, Object.keys(componentTypeMap))
  }
  return component
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";

.custom-page-wrapper {
  @apply flex flex-col max-w-[75rem] mx-auto gap-[.625rem] p-4;

  @include phone-width {
    @apply pb-20;
  }
}
</style>
