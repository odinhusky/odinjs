<template>
  <component :is="componentMap[props.entrance.type as CMS_PAGE_COMPONENT_TYPE.Enums]" :entrance="props.entrance" />
</template>

<script setup lang="ts">
  import type { PropType } from "vue"
  import { defineProps } from "vue"
  import type * as Request from "src/api/request.type"
  import { CMS_PAGE_COMPONENT_TYPE } from "src/utils/constants"
  import DisplayComponentText from "./Text.vue"
  import DisplayComponentSlider from "./Slider.vue"
  import DisplayComponentImage from "./Image.vue"
  import DisplayComponentGameEntrance from "./GameEntrance.vue"
  import DisplayComponentAnnouncement from "./Announcement.vue"
  import DisplayComponentLeaderboard from "./Leaderboard.vue"
  import DisplayComponentNavbar from "./Navbar.vue"

  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem> | null,
      required: true,
      default: () => {
        return null
      }
    }
  })

  const componentMap = {
    [CMS_PAGE_COMPONENT_TYPE.Enums.SLIDER]: DisplayComponentSlider,
    [CMS_PAGE_COMPONENT_TYPE.Enums.TEXT]: DisplayComponentText,
    [CMS_PAGE_COMPONENT_TYPE.Enums.IMAGE]: DisplayComponentImage,
    [CMS_PAGE_COMPONENT_TYPE.Enums.GAME_ENTRANCE]: DisplayComponentGameEntrance,
    [CMS_PAGE_COMPONENT_TYPE.Enums.ANNOUNCEMENT]: DisplayComponentAnnouncement,
    [CMS_PAGE_COMPONENT_TYPE.Enums.LEADERBOARD]: DisplayComponentLeaderboard,
    [CMS_PAGE_COMPONENT_TYPE.Enums.NAVBAR]: DisplayComponentNavbar
  }
</script>

<style scoped lang="scss"></style>
