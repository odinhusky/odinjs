<template>
  <component :is="componentMap[props.entrance.type as CMS_PAGE_COMPONENT_TYPE.Enums]" :entrance="props.entrance" />
</template>

<script setup lang="ts">
  import type { PropType } from "vue"
  import { defineProps } from "vue"
  import type * as Request from "src/api/request.type"
  import { CMS_PAGE_COMPONENT_TYPE } from "src/utils/constants"
  import EditComponentText from "./Text.vue"
  import EditComponentSlider from "./Slider.vue"
  import EditComponentImage from "./Image.vue"
  import EditComponentGameEntrance from "./GameEntrance.vue"
  import EditComponentAnnouncement from "./Announcement.vue"
  import EditComponentLeaderboard from "./Leaderboard.vue"
  import EditComponentNavbar from "./Navbar.vue"

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
    [CMS_PAGE_COMPONENT_TYPE.Enums.SLIDER]: EditComponentSlider,
    [CMS_PAGE_COMPONENT_TYPE.Enums.TEXT]: EditComponentText,
    [CMS_PAGE_COMPONENT_TYPE.Enums.IMAGE]: EditComponentImage,
    [CMS_PAGE_COMPONENT_TYPE.Enums.GAME_ENTRANCE]: EditComponentGameEntrance,
    [CMS_PAGE_COMPONENT_TYPE.Enums.ANNOUNCEMENT]: EditComponentAnnouncement,
    [CMS_PAGE_COMPONENT_TYPE.Enums.LEADERBOARD]: EditComponentLeaderboard,
    [CMS_PAGE_COMPONENT_TYPE.Enums.NAVBAR]: EditComponentNavbar
  }
</script>

<style scoped lang="scss"></style>
