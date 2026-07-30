<template>
  <div class="side-menu" :class="{ isClose: modelValue }">
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

    <!-- menu list -->
    <div style="padding: 8px 0px !important" class="button-area button-area-bottom" v-if="isLogin">
      <ul class="account-list">
        <li
          v-if="!isLogin"
          class="btn-title"
          @click="setActiveItem('account', 'AIAgent')"
          :class="{ 'btn-title-active': activeItem.type === 'other' && activeItem.id === 'AIAgent' }"
        >
          <q-btn class="normal-btn btn-common cms-menu-btn" align="left" flat :to="{ name: 'AIAgent' }">
            <img class="home-title-icon" :src="svgIcon('ai-agent')" alt="" />
            <span class="btn-title">AI AGENT</span>
          </q-btn>
        </li>
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
        <li
          v-if="!isLogin"
          class="btn-title"
          @click="setActiveItem('account', 'Proxy')"
          :class="{ 'btn-title-active': activeItem.type === 'account' && activeItem.id === 'Proxy' }"
        >
          <q-btn class="normal-btn btn-common cms-menu-btn" align="left" flat :to="{ name: 'Proxy' }">
            <img class="home-title-icon" :src="svgIcon('proxy')" alt="" />
            <span class="btn-title">{{ $t("menu.refer") }}</span>
          </q-btn>
        </li>
        <li class="btn-title">
          <q-btn class="normal-btn btn-common cms-menu-btn" align="left" flat @click="logout" :loading="isLoading">
            <img class="home-title-icon" :src="svgIcon('logout')" alt="" />
            <span class="btn-title">{{ $t("common.btn.logout") }}</span>
          </q-btn>
        </li>
      </ul>
    </div>
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
import { isSetR027CmsEntranceActive, useEntranceHandler } from "app/template/set_r027/composables/useCms"
import { useSiteImg } from "app/template/set_r027/hooks/useSiteImg"
import { createDidRouteResolver, useCms } from "src/common/composables/useCms"
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

defineProps({
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
  return isSetR027CmsEntranceActive(entrance, route, resolveCmsRouteByDid)
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
@import "app/template/set_r027/assets/css/_variable.scss"

::-webkit-scrollbar
  display: none

.q-btn
  padding: 0px
  &:before
    box-shadow: none
  &:hover
    background: linear-gradient(90deg, $primany02 0%, rgba(209, 45, 0, 0.00) 100%)
  :deep(.q-btn__content)
    display: flex
    justify-content: flex-start
    height: 100%
    padding-left: 10px
    // border-radius: 12px !important
// common style
.home-title-icon
  min-width: 20px
  margin: 0 0.5rem
  // margin-right: 0px
  width: 20px
  &.isClose
    margin-right: 0px
.btn-title
  color: var(--btn-text-02)
  font-family: Arial
  font-weight: 700
  text-overflow: ellipsis
  font-size: 14px
  font-style: bold
  line-height: normal
.btn-common-active
  background: linear-gradient(to right, var(--btn-bg-01) 0%, var(--btn-bg-03) 100%)
  .btn-title
    color: var(--btn-text-01) !important
.btn-title-active
  .q-btn
    background: linear-gradient(to right, var(--btn-bg-01) 0%, var(--btn-bg-03) 100%)
  .btn-title
    color: var(--btn-text-01) !important
.btn-content
  color: rgba($secondary02, 0.70)
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
    color: $yellow-active
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
  background: rgba($secondary02, 0.5)
  z-index: 10
.side-menu
  flex-shrink: 0
  width: 270px
  padding: 10px 14px 20px
  height: 100%
  vertical-align: top
  display: table-cell
  background-color: var(--bg-sidebar)
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
        padding-left: 0px
    .button-area
      .normal-btn
        .btn-title
          display: none
    +phone-width
      width: 0px
      display: none
  .button-area
    border-radius: 12px
    background: linear-gradient(to right, var(--bg-06) 0%, var(--bg-07) 100%)
    width: auto
    margin: 0 auto
    height: auto
    overflow-y: scroll
    padding: 0px
    +phone-width
      padding: 0.475rem 0.3125rem
    +setFlex
    flex-direction: column
    .account-list
      width: 100%
      .btn-title
        color: var(--text-01)
      .home-title-icon
        display: block
        width: 20px
        height: 20px
        padding: 4px
        border-radius: 8px
        box-sizing: content-box
        background: linear-gradient(to right, var(--icon-bg-05) 0%, var(--icon-bg-06) 100%)
    .normal-btn
      cursor: pointer
      display: flex
      align-items: center
      width: 100%
      height: 3vw
      line-height: 3vw
      border-bottom: 1px solid var(--bg-line-01)
      &:last-child
        border-bottom: none
      text-transform: none
      span
        margin-left: 10px
      &.btn-logout
        display: grid
        background: transparent
        border: 1px solid rgba($secondary02, 0.7)
      &.q-btn
        :deep(.q-btn__content)
          width: 100%
    .button-title
      span
        margin-left: 0.7vw
  .button-area-bottom
    margin-bottom: 10px
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
        // border-radius: 12px
        background: $secondary02
        +iphone-width
          height: 10vw
          +setFlex
        &:hover
          background: linear-gradient(0deg, rgba($secondary02, 0.20) 0%, rgba($secondary02, 0.20) 100%), $yellow-active
        span
          color: $secondary02
      img
        margin-right: 0.5vw
</style>
