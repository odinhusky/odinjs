<template>
  <div class="t-footer">
    <section class="menu-btm">
      <div class="menu-wrapper">
        <a
          v-for="(cmsItem, cmsIndex) in h5BottomMenuList.slice(0, 2)"
          :key="cmsIndex"
          class="menuft"
          @click="handleEntranceClick(cmsItem.Entrance[0])"
        >
          <img
            class="home-title-icon"
            :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
          />
          <p class="menu-text">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
        </a>
        <a>
          <div></div>
        </a>
        <a
          v-for="(cmsItem, cmsIndex) in h5BottomMenuList.slice(3, 5)"
          :key="cmsIndex"
          class="menuft"
          @click="handleEntranceClick(cmsItem.Entrance[0])"
        >
          <img class="home-title-icon" :src="cmsItem.Setting.icon_path" />
          <p class="menu-text">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
        </a>
        <a
          v-for="(cmsItem, cmsIndex) in h5BottomMenuList.slice(2, 3)"
          :key="cmsIndex"
          class="menuft aff-qr"
          @click="handleEntranceClick(cmsItem.Entrance[0])"
        >
          <img class="home-title-icon" :src="cmsItem.Setting.icon_path" />
        </a>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/set33_RED/composables/useCms"
import { createDidRouteResolver, isCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { useRoute } from "vue-router"

import { MENU } from "../../utils/constants"

const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const { h5BottomMenuList } = useCms()

const route = useRoute()

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

const isActive = (entrance: any) => {
  return isCmsEntranceActive(entrance, route, resolveCmsRouteByDid)
}

</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set33_RED/assets/css/_variable.sass"
@import "app/template/set33_RED/assets/css/main.sass"

.t-footer
  display: none
  position: fixed
  width: 100%
  bottom: 0
  z-index: 99
  +phone-width
    display: block
  .menu-btm
    position: fixed
    max-width: 991px
    margin: auto
    width: 100%
    bottom: 0
    left: 0
    right: 0
    background: url('../../assets/images/footer/ftr-menu-bar.png') no-repeat top center
    background-size: 100%
  .aff-qr
    background: #D14444
    width: 15%
    height: 100%
    border-radius: 100%
    position: absolute
    left: -1px
    right: 0
    bottom: 26px
    margin: auto
    z-index: 9
  .menu-wrapper
    display: grid
    grid-template-columns: repeat(5,1fr)
    text-align: center
    padding: 11px 0 1px
    position: relative
    a
      color: #fff
      font-size: 9px
      text-transform: uppercase
      font-weight: 600
      padding: 5px 0
    .menuft
      @apply flex flex-col items-center justify-center
      img
        max-width: 33%
        margin: auto
        filter: brightness(0) invert(1)
</style>
