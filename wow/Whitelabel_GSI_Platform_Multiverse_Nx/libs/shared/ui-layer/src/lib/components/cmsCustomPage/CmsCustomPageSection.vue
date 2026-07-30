<script setup lang="ts">
import type { CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"
import { CMS_PAGE_COMPONENT_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsPageComponentType"

defineProps<{
  entrance: CmsEntranceItem
}>()
</script>

<template>
  <!-- SLIDER (101)：Banner 輪播 -->
  <CmsCustomPageSlider v-if="entrance.type === CMS_PAGE_COMPONENT_TYPE_ENUMS.SLIDER" :entrance="entrance" />

  <!-- TEXT (102)：富文字區塊 -->
  <CmsCustomPageText v-else-if="entrance.type === CMS_PAGE_COMPONENT_TYPE_ENUMS.TEXT" :entrance="entrance" />

  <!-- IMAGE (103)：圖片展示（grid / horizontal） -->
  <CmsCustomPageImage v-else-if="entrance.type === CMS_PAGE_COMPONENT_TYPE_ENUMS.IMAGE" :entrance="entrance" />

  <!-- GAME_ENTRANCE (104)：遊戲/供應商入口 -->
  <CmsCustomPageGameEntrance
    v-else-if="entrance.type === CMS_PAGE_COMPONENT_TYPE_ENUMS.GAME_ENTRANCE"
    :entrance="entrance"
  />

  <!-- ANNOUNCEMENT (105)：跑馬燈公告 -->
  <CmsCustomPageAnnouncement
    v-else-if="entrance.type === CMS_PAGE_COMPONENT_TYPE_ENUMS.ANNOUNCEMENT"
    :entrance="entrance"
  />

  <!-- LEADERBOARD (106)：排行榜 -->
  <CmsCustomPageLeaderboard
    v-else-if="entrance.type === CMS_PAGE_COMPONENT_TYPE_ENUMS.LEADERBOARD"
    :entrance="entrance"
  />

  <!-- NAVBAR (107)：頁內導覽列 -->
  <CmsCustomPageNavbar v-else-if="entrance.type === CMS_PAGE_COMPONENT_TYPE_ENUMS.NAVBAR" :entrance="entrance" />
</template>
