<template>
  <nav class="h5-bottom-menu">
    <button
      v-for="(item, index) in h5BottomMenuList"
      :key="index"
      class="flex-1 flex flex-col items-center bottom-menu-item"
      :class="{ active: isActive(item.Entrance[0]) }"
      @click="handleEntranceClick({ entrance: item.Entrance[0] })"
    >
      <img :src="isActive(item.Entrance[0]) ? (item.Setting.selected_icon_path || item.Setting.icon_path) : item.Setting.icon_path" :alt="returnLabel(item.Setting.lang)" />
      <span class="text-center text-xs">{{ returnLabel(item.Setting.lang) }}</span>
    </button>
  </nav>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/set_r029/composables/useCms"
import { MENU } from "app/template/set_r029/utils/constants"
import { createDidRouteResolver, isCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"

const { handleEntranceClick } = useEntranceHandler()
const {
  h5BottomMenuList,
} = useCms()
const { locale } = useI18n()
const route = useRoute()

const isActive = (entrance: any) => {
  return isCmsEntranceActive(entrance, route, resolveCmsRouteByDid)
}

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

type SupportedLocale = "en" | "th" | "id" | "vi" | "zh-cn" | "zh-tw" | "jp" | "ko"
const lang = computed(() => locale.value as SupportedLocale)

const returnLabel = (obj: Record<string, string>): string => obj[lang.value]

// 初始化底部選單
</script>

<style lang="scss" scoped>
@import "app/template/set_r029/assets/css/_variable.scss";

.h5-bottom-menu {
  @apply flex z-10 py-2 fixed bottom-0 left-0 right-0;
  background: #111827;
  color: $input-text-color;
}
.bottom-menu-item {
  transition: opacity 0.2s ease;
  img {
    @apply max-w-[35px] mb-1;
  }

  &.active {
    color: #22C55E;
  }

  &:hover {
    opacity: 0.8;
  }
}
</style>
