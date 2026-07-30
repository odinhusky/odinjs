<template>
  <div class="footer-nav">
    <section class="menu-position">
      <div class="menu-wrapper">
        <div
          v-for="(cmsItem, cmsIndex) in h5BottomMenuList"
          :key="cmsIndex"
          class="menu-list"
          @click="
            handleEntranceClick({
              entrance: cmsItem.Entrance[0],
              opening_method: cmsItem.Setting.payload.opening_method
            })
          "
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
import { useEntranceHandler } from "app/template/set_ed8888/composables/useCms"
import { createDidRouteResolver, isCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { MENU } from "../../utils/constants"
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const {
  handleEntrance,
  h5BottomMenuList,
} = useCms()

// const { footerSvg } = useSiteImg()
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
  eventbus.emit("openLoginWithRegister", true)
}

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

const isActive = (entrance: any) => {
  return isCmsEntranceActive(entrance, route, resolveCmsRouteByDid)
}

</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_ed8888/assets/css/_variable.scss";

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
    @apply grid grid-cols-5 relative h-full;
    text-align: center;
    // background: $bg-nav-gradient;

    .menu-list {
      @apply flex flex-col justify-center items-center;
      // color: $text-light-secondary;
      font-size: 0.625rem;
      font-weight: 600;
      transition: color 0.3s ease;

      img {
        width: 2.25rem;
        height: 2.25rem;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      &.active {
        // color: $bg-secondary;
      }
    }
  }
}
</style>
