<template>
  <div class="menu-bar">
    <ul class="menu-layout">
      <q-btn flat fab-mini class="menu-item" align="left" :to="{ name: 'home' }">
        <img :src="svgIcon('home')" alt="home-icon" />
        <span class="menu-btn">{{ $t(`menu.home`) }}</span>
      </q-btn>
      <q-btn
        flat
        fab-mini
        v-for="(cmsItem, cmsIndex) in navigationBarList"
        :key="cmsIndex"
        class="menu-item"
        :class="{
          'menu-item-active': isActive(cmsItem.Entrance[0], cmsIndex)
        }"
        @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
      >
        <img
          :src="
            isActive(cmsItem.Entrance[0], cmsIndex) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path
          "
        />
        <span class="menu-btn">{{
          limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string)
        }}</span>
      </q-btn>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/set_jokerhill/composables/useCms"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { MENU } from "app/template/set_jokerhill/utils/constants"
import { createDidRouteResolver, isCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import limitWordLength from "src/common/utils/limitWordLength"
import { ref } from "vue"
import { useRoute } from "vue-router"

const { svgIcon } = useSiteImg()
const { nowLang } = useLanguage()
const {
  navigationBarList,
} = useCms()
const { handleEntranceClick } = useEntranceHandler()

const emit = defineEmits(["changeLogin", "changeRegister", "update:modelValue"])
const route = useRoute()
const activeIndex = ref(0)

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

const isActive = (entrance: any, index: number) => {
  const active = isCmsEntranceActive(entrance, route, resolveCmsRouteByDid)

  if (active) {
    activeIndex.value = index
  }

  return active
}

</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "../../assets/css/menu.sass"

.menu-bar
  display: flex
  justify-content: center
  align-items: center
  background: #fff
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.10)
  width: 99.6vw
  margin: 0 auto
  height: 5rem
  overflow-x: auto
  +pc-width
    justify-content: flex-start
  .menu-layout
    width: auto
    min-width: 810px
    height: 100%
    overflow-x: auto
    display: flex
    justify-content: center
    align-items: center
    flex-direction: row
    +iphone-width
      justify-content: flex-start
    .menu-item
      width: 100px
      :deep(.q-btn__content)
        +setFlex
        flex-direction: column
        img
          width: 2rem
          height: 2rem
      +iphone-width
        width: 18vw
    .menu-item-active
      background: rgba(0, 0, 0, 0.10)
</style>
