<template>
  <div class="side-menu" :class="{ isClose: modelValue }">
    <!-- menu list -->
    <div class="button-area button-area-bottom" v-if="isLogin">
      <ul class="account-list">
        <!-- <li
          class="btn-title"
          @click="setActiveItem('account', 'AIAgent')"
          :class="{ 'btn-title-active': activeItem.type === 'other' && activeItem.id === 'AIAgent' }"
        >
          <q-btn class="normal-btn btn-common cms-menu-btn" align="left" flat :to="{ name: 'AIAgent' }">
            <img class="home-title-icon" :src="svgIcon('ai-agent')" alt="" />
            <span class="btn-title">AI AGENT</span>
          </q-btn>
        </li> -->
        <li
          class="btn-title"
          @click="setActiveItem('account', 'memberSummary')"
          :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'memberSummary' }"
        >
          <q-btn class="normal-btn btn-common cms-menu-btn" align="left" flat :to="{ name: 'memberSummary' }">
            <img class="home-title-icon" :src="svgIcon('account')" alt="" />
            <span class="btn-title">{{ $t("menu.memberCenter") }}</span>
          </q-btn>
        </li>
        <li
          class="btn-title"
          @click="setActiveItem('account', 'MemberDeposit')"
          :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'MemberDeposit' }"
        >
          <q-btn class="normal-btn btn-common cms-menu-btn" align="left" flat :to="{ name: 'MemberDeposit' }">
            <img class="home-title-icon" :src="svgIcon('deposit')" alt="" />
            <span class="btn-title">{{ $t("menu.deposit") }}</span>
          </q-btn>
        </li>

        <li
          class="btn-title"
          @click="setActiveItem('account', 'MemberWithdraw')"
          :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'MemberWithdraw' }"
        >
          <q-btn class="normal-btn btn-common cms-menu-btn" align="left" flat :to="{ name: 'MemberWithdraw' }">
            <img class="home-title-icon" :src="svgIcon('withdrawal')" alt="" />
            <span class="btn-title">{{ $t("menu.withdrawal") }}</span>
          </q-btn>
        </li>
        <li
          class="btn-title"
          @click="setActiveItem('account', 'history')"
          :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'history' }"
        >
          <q-btn class="normal-btn btn-common cms-menu-btn" align="left" flat :to="{ name: 'history' }">
            <img class="home-title-icon" :src="svgIcon('history')" alt="" />
            <span class="btn-title">{{ $t("menu.history") }}</span>
          </q-btn>
        </li>
        <li
          class="btn-title"
          @click="setActiveItem('account', 'MemberOrder')"
          :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'MemberOrder' }"
        >
          <q-btn class="normal-btn btn-common cms-menu-btn" align="left" flat :to="{ name: 'MemberOrder' }">
            <img class="home-title-icon" :src="svgIcon('order')" alt="" />
            <span class="btn-title">{{ $t("menu.order") }}</span>
          </q-btn>
        </li>
        <li
          class="btn-title"
          @click="setActiveItem('account', 'memberInbox')"
          :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'memberInbox' }"
        >
          <q-btn class="normal-btn btn-common cms-menu-btn" align="left" flat :to="{ name: 'memberInbox' }">
            <img class="home-title-icon" :src="svgIcon('my-messages')" alt="" />
            <span class="btn-title">{{ $t("member.mail.myMessages") }}</span>
          </q-btn>
        </li>
        <li
          class="btn-title"
          @click="setActiveItem('account', 'MemberVip')"
          :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'MemberVip' }"
        >
          <q-btn class="normal-btn btn-common cms-menu-btn" align="left" flat :to="{ name: 'MemberVip' }">
            <img class="home-title-icon" :src="svgIcon('vip')" alt="" />
            <span class="btn-title">{{ $t("menu.vip") }}</span>
          </q-btn>
        </li>
        <!-- <li
          class="btn-title"
          @click="setActiveItem('account', 'Proxy')"
          :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'Proxy' }"
        >
          <q-btn class="normal-btn btn-common cms-menu-btn" align="left" flat :to="{ name: 'Proxy' }">
            <img class="home-title-icon" :src="svgIcon('proxy')" alt="" />
            <span class="btn-title">{{ $t("menu.refer") }}</span>
          </q-btn>
        </li> -->
        <li class="btn-title">
          <q-btn class="normal-btn btn-common cms-menu-btn" align="left" flat @click="logout" :loading="isLoading">
            <img class="home-title-icon" :src="svgIcon('logout')" alt="" />
            <span class="btn-title">{{ $t("common.btn.logout") }}</span>
          </q-btn>
        </li>
      </ul>
    </div>

    <div class="button-area button-area-bottom">
      <q-btn
        v-for="(cmsItem, cmsIndex) in fliterDisplayDeviceAndLogin"
        :key="cmsIndex"
        class="normal-btn btn-common cms-menu-btn"
        :class="{ 'btn-common-active': isActive(cmsItem.Entrance[0]) }"
        align="left"
        @click="handleAsideClick(cmsItem.Entrance[0])"
      >
        <!-- <img :src="svgIcon(item.frontendKey as string)" alt="" /> -->
        <img
          v-if="cmsItem.Setting.icon_path"
          class="home-title-icon"
          :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
        />
        <div v-else class="home-title-icon"></div>
        <span class="btn-title">{{
          limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string)
        }}</span>
      </q-btn>
    </div>

    <LanguageDropdown class="language-bar" btnSize="md" :isClose="modelValue" />
  </div>
  <q-dialog v-model="loginStatus">
    <q-card>
      <q-card-section>
        <div class="text-h6">Alert</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro.
        Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import { useEntranceHandler } from "app/template/set_r030/composables/useCms"
import { useSiteImg } from "app/template/set_r030/hooks/useSiteImg"
import { createDidRouteResolver, isCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useAuth } from "src/common/hooks/useAuth"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import limitWordLength from "src/common/utils/limitWordLength"
import { EventBusKey } from "src/symbols"
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import { MENU } from "../utils/constants"
import LanguageDropdown from "./LanguageDropdown.vue"

const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits(["update:modelValue"])

const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const {
  fliterDisplayDeviceAndLogin,
} = useCms()
const { svgIcon } = useSiteImg()
const router = useRouter()
const route = useRoute()
const { width } = useWindowSize()
const { isLogin, handleLogout, isLoading } = useAuth()
const { gameTypeState } = useGame()
const eventbus = injectStrict(EventBusKey)
const { isTelegramMiniApp, closeMiniApp } = useTelegram()

let isMobile = ref(false)
let loginStatus = ref(false)
let memberMenuExpanded = ref(false)

interface ActiveItem {
  type: "game" | "other" | "account"
  id: number | string
}

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

const isActive = (entrance: any) => {
  return isCmsEntranceActive(entrance, route, resolveCmsRouteByDid)
}

const activeItem = ref<ActiveItem>({ type: "game", id: 0 })

const setActiveItem = (type: "game" | "other" | "account", id: number | string) => {
  activeItem.value = { type, id }

  if (isMobile.value) {
    emit("update:modelValue", true)
  }
}

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })

  if (isTelegramMiniApp.value) closeMiniApp()
}

const handleAsideClick = (entrance: any) => {
  if (isMobile.value) {
    emit("update:modelValue", true)
  }
  handleEntranceClick({
    entrance: entrance,
  })
}

watch(
  width,
  (newWidth) => {
    if (newWidth >= 769) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)

watch(route, (newRoute) => {
  if (isMobile.value) {
    emit("update:modelValue", true)
  }
  const newPath = newRoute.path

  // 當不在與member相關的path須重設activeItem
  // 避免持續顯示active Class
  if (!newPath.includes("member")) {
    activeItem.value = { type: "game", id: 0 }
    memberMenuExpanded.value = false
  }
})

// Listen for event bus updates when navigation happens without a refresh
eventbus.on("updateAsideMenu", ({ type, id }) => {
  setActiveItem(type, id)
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_r030/assets/css/_variable.scss"

::-webkit-scrollbar
  display: none

.q-btn
  padding: 4px 7px
  &:before
    box-shadow: none
  &:hover
    background: linear-gradient(90deg, var(--btn-bg-02) 0%, transparent 93.97%)
  :deep(.q-btn__content)
    display: flex
    justify-content: flex-start
    height: 100%
// common style
.home-title-icon
  min-width: 20px
  margin: 0 0.5rem
  width: 20px
.btn-title
  color: var(--text-01)
  font-family: OpenSans, "PingFang SC", "Microsoft YaHei", D-DIN, Arial, SimHei, Helvetica, sans-serif
  font-weight: 400
  text-overflow: ellipsis
  font-size: 13px
  font-style: normal
  line-height: normal
.btn-common-active
  background: linear-gradient(90deg, var(--btn-bg-02) 0%, transparent 93.97%)
.btn-title-active
  color: var(--bg-navbar)
.btn-content
  color: color-mix(in srgb, var(--bg-navbar) 70%, transparent)
  font-family: "Century Gothic"
  font-weight: 400
  font-size: 14px
  font-style: normal
  line-height: normal
  text-transform: uppercase
  :deep(.q-focus-helper)
    opacity: 0 !important
  +iphone-width
    font-size: 3vw
  &.yellow
    color: var(--text-07)
    text-decoration: underline
// layout style
.cover
  width: 100%
  height: 100%
  position: fixed
  +setFlex
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  background: color-mix(in srgb, var(--bg-navbar) 50%, transparent)
  z-index: 10
.side-menu
  flex-shrink: 0
  width: 270px
  padding: 0 14px 20px
  height: 100%
  vertical-align: top
  display: table-cell
  background-color: #111827
  overflow-y: auto
  position: absolute
  left: 0
  z-index: 100
  transition: width 0.2s ease 0s
  +phone-width
    width: 100%
    position: fixed
    padding-top: 4.6875rem
  &.isClose
    width: 70px
    .q-btn
      :deep(.q-btn__content)
        +setFlex
    .button-area
      .normal-btn
        .btn-title
          display: none
    +phone-width
      width: 0px
      display: none
  .button-area
    border-radius: 12px
    background: linear-gradient(90deg, #1F2937 0%, #111827 100%)
    width: auto
    margin: 0 auto
    height: auto
    overflow-y: scroll
    padding: 8px 12px
    +phone-width
      padding: 0.475rem 0.3125rem
    +setFlex
    flex-direction: column
    .account-list
      width: 100%
    .normal-btn
      cursor: pointer
      display: flex
      align-items: center
      width: 100%
      height: 2vw
      line-height: 2vw
      border-top-left-radius: 12px
      border-bottom-left-radius: 12px
      margin: .3rem 0
      margin-left: 0px
      text-transform: none
      img
        color: var(--bg-navbar)
      span
        margin-left: 8px
      &.btn-logout
        display: grid
        background: transparent
        border: 1px solid color-mix(in srgb, var(--bg-navbar) 70%, transparent)
      &.q-btn
        :deep(.q-btn__content)
          width: 100%
    .button-title
      span
        margin-left: 0.7vw
  .button-area-bottom
    margin-bottom: 1rem
  .flex-layout
    width: 100%
    margin: 2% 0
    +setFlex
    &.hover-style
      cursor: pointer
    .layout-image
      width: 90%
    div
      display: flex
      justify-content: flex-start
      align-items: center
      padding: 1.2vw 0 1.2vw 0.8vw
      cursor: pointer
      &.join-btn
        width: 50%
        margin: 0 2%
        height: 4vw
        border-radius: 0.4vw
        background: var(--bg-navbar)
        +iphone-width
          height: 10vw
          +setFlex
        &:hover
          background: linear-gradient(0deg, color-mix(in srgb, var(--bg-navbar) 20%, transparent), color-mix(in srgb, var(--bg-navbar) 20%, transparent)), var(--btn-bg-01)
        span
          color: var(--bg-navbar)
      img
        margin-right: 0.5vw
</style>
