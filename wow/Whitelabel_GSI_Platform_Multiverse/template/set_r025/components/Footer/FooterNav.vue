<template>
  <div class="footer-nav" :class="{ 'tg-mini-app': isTelegramMiniApp }">
    <section class="menu-position">
      <div class="menu-wrapper">
        <div
          v-for="(cmsItem, cmsIndex) in h5BottomMenuList"
          :key="cmsIndex"
          class="menu-list"
          :class="{ active: isActive(cmsItem.Entrance[0]) }"
          @click="handleFooterMenuClick(cmsItem)"
        >
          <img
            class="home-title-icon"
            :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
          />
          <p class="menu-text">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/set_r025/composables/useCms"
import type * as Response from "src/api/response.type"
import { createDidRouteResolver, isCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { FB_SPORTS_PRODUCT_CODE } from "src/common/utils/fbSportsLaunch"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { useSiteImg } from "../../hooks/useSiteImg"
import { MENU } from "../../utils/constants"
import { useSiteRedirect } from "../../composables/useSiteRedirect"
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const { handleSiteRedirect } = useSiteRedirect()
const {
  handleEntrance,
  h5BottomMenuList,
} = useCms()
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

const normalizeDid = (did?: string) => {
  return did?.replace(/-/g, "_").replace(/[A-Z]/g, "_$&").toLowerCase()
}

const isFBSportsEntrance = (entrance?: Response.CmsEntranceItem) => {
  if (!entrance) return false
  const did = normalizeDid(entrance.payload?.did)
  return Number(entrance.payload?.product_code) === FB_SPORTS_PRODUCT_CODE || did === "fb_page"
}

const getPrimaryEntrance = (entrances: Response.CmsEntranceItem[] = []) => {
  return entrances.find(isFBSportsEntrance) ?? entrances[0]
}

const handleFooterMenuClick = (cmsItem: any) => {
  const openingMethod = cmsItem.Setting.payload.opening_method
  const primaryEntrance = getPrimaryEntrance(cmsItem.Entrance)
  if (isFBSportsEntrance(primaryEntrance)) {
    handleSiteRedirect({ did: "fb_page", opening_method: openingMethod })
    return
  }

  handleEntranceClick({
    entrance: primaryEntrance,
    opening_method: openingMethod
  })
}

const isActive = (entrance: any) => {
  return isCmsEntranceActive(entrance, route, resolveCmsRouteByDid)
}

</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r025/assets/css/_variable.sass";

// common style
.home-title-icon {
  width: 25px;
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
    background: $background-header;

    .menu-list {
      @apply flex flex-col justify-center items-center;
      color: $functional-btn-text-primany;
      font-size: 0.625rem;
      font-weight: 600;
      transition: color 0.3s ease;

      img {
        width: 2.25rem;
        height: 2.25rem;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      &.active {
        color: $primany-01;
        filter: drop-shadow(0 0 10px $primany-01);
        text-shadow: 0px 0px 14px $primany-01;
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
