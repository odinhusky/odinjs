<template>
  <div class="footer-nav" :class="{ 'tg-mini-app': isTelegramMiniApp }">
    <section class="menu-position">
      <div class="menu-wrapper">
        <div
          v-for="(cmsItem, cmsIndex) in h5BottomMenuList"
          :key="cmsIndex"
          class="menu-list"
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
import { useEntranceHandler } from "app/template/set_r032/composables/useCms"
import { createDidRouteResolver, isCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { useWebSocketNotificationStore } from "src/stores/webSocketNotificationStore"
import { computed } from "vue"
import { useRoute } from "vue-router"

import { MENU } from "../../utils/constants"

const { h5BottomMenuList } = useCms()
const webSocketNotificationStore = useWebSocketNotificationStore()
const inboxUnreadTotal = computed(() => webSocketNotificationStore.webSocketNotificationState.unreadCount.total)

const route = useRoute()
const { nowLang } = useLanguage()
const { isTelegramMiniApp } = useTelegram()
const { handleEntranceClick } = useEntranceHandler()

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

const isActive = (entrance: any) => {
  return isCmsEntranceActive(entrance, route, resolveCmsRouteByDid)
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r032/assets/css/_variable.scss";

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
  z-index: 9000;

  @include pad-large-width {
    display: block;
  }

  .menu-position {
    position: fixed;
    margin: auto;
    width: 100%;
    height: 4.0625rem;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9000;
  }

  .menu-wrapper {
    @apply flex items-center justify-around w-full relative h-full;
    text-align: center;
    background: var(--neutral-01);
    border: 1px solid var(--border-soft);
    border-bottom: none;
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;

    // dark theme 改用三段漸層 border：neutral-11（上）→ neutral-03（中）→ neutral-12（下）
    // 用 background-clip 雙層做漸層 border：
    //   padding-box 那層蓋掉內部，露出 1px 透明 border 區給下層 border-box 漸層透出
    @include dark {
      border: 1px solid transparent;
      border-bottom: none;
      background: linear-gradient(var(--neutral-01), var(--neutral-01)) padding-box,
        linear-gradient(180deg, var(--neutral-11) 0%, var(--neutral-03) 50%, var(--neutral-12) 100%) border-box;
    }

    .menu-list {
      @apply flex flex-col justify-center items-center;
      color: var(--primary-02);
      font-size: 0.625rem;
      font-weight: 600;
      transition: color 0.3s ease;

      &.active {
        color: var(--primary-01);

        // dark theme：active 時 icon 圖片發光
        // 用 drop-shadow 而不是 box-shadow，這樣光暈會貼著圖片實際輪廓，不是矩形 bbox
        @include dark {
          .home-title-icon {
            filter: drop-shadow(0 0 4px var(--primary-05)) drop-shadow(0 0 8px var(--primary-05));
          }
        }
      }

      .home-title-icon {
        width: 1.5rem;
        height: 1.5rem;
        margin-bottom: 0.25rem;
        transition: transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
      }
    }
  }

  &.tg-mini-app {
    .menu-position {
      height: calc(3.75rem + 1.5rem);
      background-color: var(--text-01);
      padding-bottom: 14px;
    }
  }
}
</style>
