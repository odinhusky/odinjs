<template>
  <component :is="componentMap[props.entrance.type as CMS_PAGE_COMPONENT_TYPE.Enums]" :entrance="props.entrance" />
</template>

<script setup lang="ts">
  import type { PropType } from "vue"
  import { defineProps } from "vue"
  import type * as Request from "src/api/request.type"
  import { CMS_PAGE_COMPONENT_TYPE } from "src/utils/constants"
  import SliderStyle from "./SliderStyle.vue"
  import TextStyle from "./TextStyle.vue"
  import ImageStyle from "./ImageStyle.vue"
  import GameEntranceStyle from "./GameEntranceStyle.vue"
  import AnnouncementStyle from "./AnnouncementStyle.vue"
  import LeaderboardStyle from "./LeaderboardStyle.vue"
  import NavbarStyle from "./NavbarStyle.vue"

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
    [CMS_PAGE_COMPONENT_TYPE.Enums.SLIDER]: SliderStyle,
    [CMS_PAGE_COMPONENT_TYPE.Enums.TEXT]: TextStyle,
    [CMS_PAGE_COMPONENT_TYPE.Enums.IMAGE]: ImageStyle,
    [CMS_PAGE_COMPONENT_TYPE.Enums.GAME_ENTRANCE]: GameEntranceStyle,
    [CMS_PAGE_COMPONENT_TYPE.Enums.ANNOUNCEMENT]: AnnouncementStyle,
    [CMS_PAGE_COMPONENT_TYPE.Enums.LEADERBOARD]: LeaderboardStyle,
    [CMS_PAGE_COMPONENT_TYPE.Enums.NAVBAR]: NavbarStyle
  }
</script>

<style scoped lang="scss"></style>
