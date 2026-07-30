<template>
  <div class="cms-navigator" :class="{ h5: width < 1000 }">
    <div class="h5-navigator-menu" v-if="width < 1000" @click="h5NavigationActive = !h5NavigationActive">
      <img class="icon" :src="activeEntrance?.Setting.selected_icon_path || activeEntrance?.Setting.icon_path" />
      <div class="title">
        {{ activeEntrance?.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
      </div>
      <q-icon
        :name="h5NavigationActive ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        size="sm"
        color="grey"
        class="icon-last"
      ></q-icon>
    </div>
    <ul v-if="width >= 1000 || (width < 1000 && h5NavigationActive)">
      <li
        v-for="(cmsItem, cmsIndex) in navigationBarList"
        :key="cmsIndex"
        class="nav-item"
        :class="{
          active: isActive(cmsItem.Entrance[0])
        }"
      >
        <div class="nav-link" @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })">
          <img class="nav-icon" :src="cmsItem.Setting.icon_path" />
          <span class="nav-title">{{
            limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string)
          }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r029/assets/css/_variable.scss";

.cms-navigator {
  @apply flex items-center justify-end;
  @apply my-12;

  ul {
    @apply flex rounded-full;
    background: $r029-bg-section;

    .nav-item {
      @apply p-[10px] rounded-full cursor-pointer;
      color: $r029-text-secondary;
      transition: background 0.2s, color 0.2s;
      .nav-link {
        @apply flex items-center;
        .nav-icon {
          @apply w-5 mr-[6px];
        }
      }
      &.active {
        background: $r029-action-primary;
        color: #05312D;
      }
      &:hover:not(.active) {
        background: #22C55E;
        color: #05312D;
      }
    }
  }

  // h5
  &.h5 {
    @apply flex-col justify-center items-center;
    .h5-navigator-menu {
      @apply w-full cursor-pointer;
      @apply flex items-center gap-[20px] rounded-[10px];
      color: #22C55E;
      font-size: 1rem;
      font-weight: 800;
      padding: 14px 18px;
      background: $r029-bg-card;

      .icon {
        @apply w-8;
      }
      .title {
        .nav-title {
          color: #22c55e;
          font-weight: 800;
          font-size: 14px;
          line-height: 24px;
          letter-spacing: 0%;
        }
      }
      .icon-last {
        @apply justify-end grow;
      }
    }

    ul {
      @apply flex-col w-full rounded-[25px];
      .nav-item {
        .nav-link {
          .nav-icon {
          }
          .nav-title {
            color: #fff;
            font-weight: 800;
            font-size: 14px;
            line-height: 24px;
            letter-spacing: 0%;
          }
        }
        &.active {
          background: transparent;
        }
      }
    }
  }
}
</style>

<script setup lang="ts">
import { useWindowSize } from "@vueuse/core"
import { useEntranceHandler } from "app/template/set_r029/composables/useCms"
import { MENU } from "app/template/set_r029/utils/constants"
import { createDidRouteResolver, isCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import limitWordLength from "src/common/utils/limitWordLength"
import { computed, ref } from "vue"
import { useRoute } from "vue-router"

const { handleEntranceClick } = useEntranceHandler()
const { nowLang } = useLanguage()
const {
  navigationBarList,
} = useCms()
const route = useRoute()
const emit = defineEmits(["update:modelValue"])
const { width } = useWindowSize()
const h5NavigationActive = ref(false)

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

const isActive = (entrance: any) => {
  return isCmsEntranceActive(entrance, route, resolveCmsRouteByDid)
}

const activeEntrance = computed(() => {
  const found = navigationBarList.value.find((item: any) => isActive(item.Entrance[0]))
  return found ?? navigationBarList.value[0]
})

</script>
