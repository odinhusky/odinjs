<template>
  <div class="footer-nav" :class="{ 'tg-mini-app': isTelegramMiniApp }">
    <section class="menu-position">
      <div class="menu-wrapper">
        <div
          v-for="(cmsItem, cmsIndex) in h5BottomMenuList"
          :key="cmsIndex"
          class="menu-list"
          :class="{ active: isActive(cmsItem.Entrance[0]) }"
          @click="
            handleEntranceClick({
              entrance: cmsItem.Entrance[0],
              opening_method: cmsItem.Setting.payload.opening_method,
            })
          "
        >
          <div class="menu-icon-wrapper">
            <img
              class="home-title-icon"
              :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
            />
            <q-badge
              v-if="cmsItem.Entrance[0]?.payload?.did === 'site_message' && inboxUnreadTotal > 0"
              class="site-message-unread-badge"
              color="negative"
              rounded
              :label="inboxUnreadTotal > 99 ? '99+' : inboxUnreadTotal"
            />
          </div>
          <p class="menu-text">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/okbet_red/composables/useCms"
import { createDidRouteResolver, isCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { useWebSocketNotificationStore } from "src/stores/webSocketNotificationStore"
import { EventBusKey } from "src/symbols"
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { useSiteImg } from "../../hooks/useSiteImg"
import { MENU } from "../../utils/constants"
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const { handleEntrance, h5BottomMenuList } = useCms()
const webSocketNotificationStore = useWebSocketNotificationStore()
const inboxUnreadTotal = computed(() => webSocketNotificationStore.webSocketNotificationState.unreadCount.total)
const { isTelegramMiniApp } = useTelegram()

const { footerSvg } = useSiteImg()
const route = useRoute()
const router = useRouter()
const { gameTypeState } = useGame()
const eventbus = injectStrict(EventBusKey)

const navList = ref([
  { active: "home", name: "menu.home", router: "home" },
  { active: "casino", name: "menu.casino", router: "ProductLobby" },
  { active: "slots", name: "menu.slots", router: "GameLobby" },
  { active: "promo", name: "menu.promos", router: "promotion" },
  { active: "account", name: "menu.account", router: "memberProfile" },
])

function showLogin() {
  eventbus.emit("openLogin", true)
}

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

const isActive = (entrance: any) => {
  return isCmsEntranceActive(entrance, route, resolveCmsRouteByDid)
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_red/assets/css/_variable.sass";

// common style
.home-title-icon {
  width: 25px;
}
.menu-icon-wrapper {
  position: relative;
}
.site-message-unread-badge {
  position: absolute;
  top: -5px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
}

.footer-nav {
  display: none;
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 40;

  @include phone-width {
    display: block;
  }

  .menu-position {
    position: fixed;
    margin: auto;
    width: 100%;
    height: 3.75rem;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
  }

  .menu-wrapper {
    @apply flex items-center justify-around w-full relative h-full;
    text-align: center;
    background: $background-light-color;

    .menu-list {
      @apply flex flex-col justify-center items-center;
      color: $text-steel-blue-color;
      font-size: 0.625rem;
      font-weight: 600;
      transition: color 0.3s ease;

      img {
        width: 2.25rem;
        height: 2.25rem;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      &.active {
        color: $secondary-color;
      }
    }
  }

  &.tg-mini-app {
    .menu-position {
      height: calc(3.75rem + 1.5rem);
      background-color: $background-light-color;
      padding-bottom: 14px;
    }
  }
}
</style>
