<template>
  <!-- flex flex-col gap-[.625rem] -->
  <section id="cms-custom-page-wrapper" class="slider-theme w-full grid grid-cols-1 gap-[.625rem]">
    <div v-for="(entrance, index) in entranceList" :key="`entrance-${index}`" class="entrance-item flex-none w-full">
      <component
        :is="getEntranceComponent(entrance.type as number)"
        :entrance="entrance"
        :handleEntranceClick="handleEntranceClick"
        :siteKey="(entrance.type as number) === CMS_PAGE_COMPONENT_TYPE.Enums.GAME_ENTRANCE && envInfo.siteKey"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from "vue"
import { useQuasar } from "quasar"
import { useRoute, useRouter } from "vue-router"
import { useCms } from "src/common/composables/useCms"
import { useEntranceHandler } from "app/template/okbet/composables/useCms"
import { useEnvInfoStore } from "src/stores/envStore"
import { useGlobalStore } from "src/stores/globalStore"
import CustomSlider from "src/common/components/CmsCustomComponents/CustomSlider.vue"
import CustomText from "src/common/components/CmsCustomComponents/CustomText.vue"
import CustomImage from "src/common/components/CmsCustomComponents/CustomImage.vue"
import CustomGameEntrance from "src/common/components/CmsCustomComponents/CustomGameEntrance.vue"
import CustomLeaderboard from "src/common/components/CmsCustomComponents/CustomLeaderboard.vue"
import CustomAnnouncement from "src/common/components/CmsCustomComponents/CustomAnnouncement.vue"
import CustomNavbar from "src/common/components/CmsCustomComponents/CustomNavbar.vue"
import { CMS_PAGE_COMPONENT_TYPE } from "src/common/utils/constants"

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const { cmsDetail, handleCmsDetail } = useCms()
const { handleEntranceClick } = useEntranceHandler()
const { envInfo } = useEnvInfoStore()
const globalStore = useGlobalStore()

const cmsCustomPageId = computed(() => Number(route.params.cmsCustomPageId))
const entranceList = computed(() => cmsDetail.value?.Entrance ?? [])

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

const getCmsDetail = async () => {
  $q.loading.show()
  await handleCmsDetail(cmsCustomPageId.value)
  $q.loading.hide()

  if (cmsDetail.value === undefined) {
    if (globalStore.globalState.backRouteName) {
      router.push({ name: globalStore.globalState.backRouteName })
      return
    }

    router.push({ path: "/" })
  }
}

watch(
  () => cmsCustomPageId.value,
  (newVal) => {
    getCmsDetail()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss"></style>
