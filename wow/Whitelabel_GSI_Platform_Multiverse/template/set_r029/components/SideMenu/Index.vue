<template>
  <div class="left-menu-container-wrap min-h-full p-4">
    <div class="left-menu-container mb-4">
      <div class="left-menu-container-inner">
        <div class="bg-wrapper flex column p-2 rounded-lg">
          <div
            v-for="item in fliterDisplayDeviceAndLogin"
            :key="item.id"
            class="menu-item flex items-center w-full p-2 cursor-pointer"
            :class="{ active: isActive(item.Entrance[0]) }"
            @click="handleEntranceClick({ entrance: item.Entrance[0] })"
          >
            <div class="imgWrapper mr-2 w-[36px] h-[36px] flex items-center justify-center rounded-lg">
              <img class="default-icon" :src="item.Setting.icon_path" width="24px" height="24px" />
              <img class="selected-icon" :src="item.Setting.selected_icon_path" width="24px" height="24px" />
            </div>
            <span class="text-sm leading-6 font-bold">{{ returnLabel(item.Setting.lang) }}</span>
          </div>
        </div>
      </div>
    </div>
    <LangOption />
  </div>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/set_r029/composables/useCms"
import { RouterNameMapping } from "app/template/set_r029/utils/constants/menu"
import type { CmsEntranceItem } from "src/api/response.type"
import { useCms } from "src/common/composables/useCms"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"

import LangOption from "./LangOption.vue"

type SupportedLanguage = "en" | "th" | "id" | "vi" | "zh-cn" | "zh-tw" | "jp" | "ko"

const { locale, t } = useI18n()
const lang = computed<SupportedLanguage>(() => locale.value as SupportedLanguage)
const route = useRoute()

const { handleEntranceClick } = useEntranceHandler()
const {
  fliterDisplayDeviceAndLogin,
} = useCms()
const { handleOpenLiveChat } = useLiveChat()

const returnLabel = (langObj: Partial<Record<SupportedLanguage, string>>): string => {
  return langObj[lang.value] || langObj["en"] || ""
}

const isActive = (entrance: CmsEntranceItem) => {
  const { game_type, did } = entrance.payload
  if (game_type) {
    return String(route.params.gameType) === String(game_type)
  }

  if (did) {
    return route.name === RouterNameMapping[did]
  }
  return false
}

</script>

<style lang="scss" scoped>
@import "app/template/set_r029/assets/css/_variable.scss";

.left-menu-container-wrap {
  background: $r029-bg-home;
  .bg-wrapper {
    background: $r029-bg-section;
  }

  @media (max-width: 1000px) {
    margin-top: 63px;
  }
}

.menu-item {
  color: $r029-text-secondary;
  border-radius: 0.5rem;
  transition: background 0.2s, color 0.2s;

  .selected-icon {
    display: none;
  }
  .default-icon {
    display: block;
  }

  &.active,
  &:hover {
    color: $r029-text-primary;
    background: $r029-bg-card;

    .imgWrapper {
      background-color: $r029-action-primary;
      box-shadow: 0px 0px 10px 2px rgba($r029-action-primary, 0.45);
      border-radius: 10px;
      .selected-icon {
        display: block;
      }
      .default-icon {
        display: none;
      }
    }
  }
}
</style>
