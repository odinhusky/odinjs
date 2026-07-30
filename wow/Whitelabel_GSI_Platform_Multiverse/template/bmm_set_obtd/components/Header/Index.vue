<template>
  <div class="header" :class="route.name">
    <div class="header-left">
      <div class="outer_logo" :class="{ isClose: modelValue }" @click="$router.push('/')" v-if="!isMobile">
        <img v-if="getWideLogo()" class="outer_logo_img" :src="getWideLogo()" />
      </div>
      <div class="hamburger-box" v-if="isMobile" @click="emit('update:modelValue', true)">
        <div class="menu-icon">
          <img :src="svgIcon('hamburger')" alt="" />
        </div>
      </div>
      <q-btn flat fab-mini class="h5_logo" @click="$router.push('/')">
        <img v-if="getWideLogo()" class="h5_logo" :src="getWideLogo()" />
      </q-btn>
    </div>
    <div class="header-center">
      <ul class="nav-bar">
        <li
          v-for="(cmsItem, cmsIndex) in navigationBarList"
          :key="cmsIndex"
          class="nav-item menuimg"
          :class="{
            active: isActive(cmsItem.Entrance[0]),
          }"
        >
          <div class="navlink" @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })">
            <span class="btn-title">{{
              limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string)
            }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="nav header-right">
      <ul>
        <li v-if="isLogin">
          <WalletDropdown />
        </li>
        <li>
          <div v-if="isLogin" @click="$router.push({ name: 'MemberDeposit' })" class="deposit-btn">
            <span>{{ $t("common.btn.deposit") }}</span>
          </div>
          <div v-if="!isMobile && isLogin" @click="$router.push({ name: 'MemberWithdrawal' })" class="wallet-btn">
            <div class="wallet-icon"></div>
            <span>{{ $t("common.btn.wallet") }}</span>
          </div>
          <div v-if="isLogin" class="user-info">
            <div class="user-wrapper">
              <q-btn
                flat
                :ripple="false"
                class="px-1 user-name normal-case font-bold no-ripple"
                :class="route.name"
                @click="$router.push({ name: 'memberProfileDetail' })"
              >
                {{ userInfo2.account || userInfo2.nickname }}
              </q-btn>
              <div class="logout-modal">
                <div @click="logout" class="dropdown-item">{{ $t("menu.logout2") }}</div>
              </div>
            </div>
            <q-btn flat fab-mini color="white" class="menuft inbox-btn" @click="$router.push({ name: 'memberInbox' })">
              <q-icon name="mail" class=""></q-icon>
              <q-badge
                v-if="inboxUnreadTotal > 0"
                class="inbox-unread-badge"
                color="negative"
                rounded
                :label="inboxUnreadTotal > 99 ? '99+' : inboxUnreadTotal"
              />
            </q-btn>
          </div>
          <q-btn
            v-if="!isLogin"
            class="loginBtn"
            color="primary"
            @click="showLogin($q.platform.is.mobile ? true : false)"
            >{{ $t("common.btn.loginAndRegister") }}</q-btn
          >
          <LanguageDropdown class="language-bar" btnSize="md" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from "@vueuse/core"
import { useEntranceHandler } from "app/template/bmm_set_obtd/composables/useCms"
import { useSiteImg } from "app/template/bmm_set_obtd/hooks/useSiteImg"
import LanguageDropdown from "src/common/components/LanguageDropdown.vue"
import { createDidRouteResolver, isCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import limitWordLength from "src/common/utils/limitWordLength"
import { useEnvInfoStore } from "src/stores/envStore"
import { useWebSocketNotificationStore } from "src/stores/webSocketNotificationStore"
import { EventBusKey } from "src/symbols"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import { MENU } from "../../utils/constants"
import WalletDropdown from "./components/WalletDropdown.vue"

const eventbus = injectStrict(EventBusKey)

function showLogin(forcePasswordLogin = false) {
  eventbus.emit("openLogin", true, forcePasswordLogin)
}

const { svgIcon } = useSiteImg()
const { handleEntranceClick } = useEntranceHandler()
const { nowLang } = useLanguage()
const { userInfo2 } = useUserInfo()
const { navigationBarList } = useCms()
const router = useRouter()
const route = useRoute()
const { envInfo } = useEnvInfoStore()
const { getWideLogo } = useLogo()
const prop = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue"])
const { isLogin, handleLogout, isLoading } = useAuth()
const { isTelegramMiniApp, closeMiniApp } = useTelegram()
const webSocketNotificationStore = useWebSocketNotificationStore()
const inboxUnreadTotal = computed(() => webSocketNotificationStore.webSocketNotificationState.unreadCount.total)

const { width } = useWindowSize()
let isMobile = ref(false)

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })

  if (isTelegramMiniApp.value) closeMiniApp()
}

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

const isActive = (entrance: any) => {
  return isCmsEntranceActive(entrance, route, resolveCmsRouteByDid)
}

watch(
  width,
  (newWidth) => {
    if (newWidth >= 1025) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/bmm_set_obtd/assets/css/_variable.sass"
@import "app/template/bmm_set_obtd/assets/css/button.scss"

@keyframes okbetNiceMove
  0%
    left: 0px
  20%
    left: 110%
  100%
    left: 110%


// common
.menuft
  border-radius: 12px !important
  margin-left: 40px
  height: 40px
  display: flex
  -webkit-box-align: center
  align-items: center
  font-style: normal
  font-weight: 700
  font-size: 16px
  line-height: 12px
  padding: 0px 10px
  color: $text-sky-gray-color !important
  background: $background-pale-silver-color
  backdrop-filter: blur(3px)
  min-width: 0px
  white-space: nowrap
.inbox-btn
  position: relative
.inbox-unread-badge
  position: absolute
  top: -6px
  right: -8px
  min-width: 18px
  height: 18px
  padding: 0 5px
  display: flex
  align-items: center
  justify-content: center
  font-size: 10px
  line-height: 18px
.loginBtn
  &.q-btn
    @apply mx-5
    position: relative
    border-radius: 50px
    font-family: OpenSans
    font-weight: 510
    font-size: 16px
    line-height: 19px
    color: $text-light-color
    width: 220px
    height: 30px
    display: flex
    -webkit-box-align: center
    align-items: center
    padding: 0px
    background: $primary-color
    box-shadow: transparent 0px 4px 5px 0px
    overflow: hidden
    +iphone-width
      @apply mx-0 mr-0 whitespace-nowrap px-4
      font-size: .75rem
      width: auto
      min-width: 4rem
    &::before
      content: ""
      border-radius: 0px
      background-color: rgba($background-light-color, 0.8)
      height: 100%
      width: 3em
      display: block
      position: absolute
      top: 0px
      left: -4.5em
      transform: skewX(-45deg) translateX(0px)
      transition: none 0s ease 0s
      animation: 2s ease-out 1s infinite normal none running okbetNiceMove
.language-bar
  margin-right: .5rem
// base layout
.header
  z-index: 99
  width: 100%
  position: sticky
  top: 0
  display: flex
  align-items: center
  justify-content: space-between
  flex-direction: row
  // overflow-x: auto
  // overflow-y: hidden
  // &::-webkit-scrollbar
  //   display: none
  // scrollbar-width: none
  // -ms-overflow-style: none
  height: 78px
  box-shadow: rgba($box-shadow-dark-color, 0.05) 2px 0px 14px, rgba($box-shadow-dark-color, 0.05) 0px 2px 14px
  background: $background-light-color
  backdrop-filter: blur(8px)
  transition: background 0.26s ease 0s
  @media (max-width: 1024px)
    position: fixed
    height: 55px
  &.home
    position: absolute
    background: rgba($background-light-color, 0.05)
    .menuft
      color: $text-light-color !important
      background: transparent
    @media (max-width: 1024px)
      position: fixed
      background: $background-light-color
  .header-left
    flex: 2
    display: flex
    justify-content: flex-start
    align-items: center
    +iphone-width
      height: 100%
    .outer_logo
      @apply w-auto min-w-[4.375rem] max-w-[8.75rem] cursor-pointer z-10
      position: absolute
      margin: 0 1vw
      left: -165px
      transition: left 0.26s ease 0s
      display: none
      @media (min-width: 1441px)
        display: block
      .outer_logo_img
        @apply h-auto w-auto max-w-full max-h-full
        object-fit: contain
      :deep(.q-btn__content)
        justify-content: flex-start
      &.isClose
        @apply left-0
    .h5_logo
      @apply object-contain
      width: auto
      height: auto
      max-height: 3rem
      padding: 0
      display: none
      @media (max-width: 1024px)
        display: block
        margin-right: .25rem
      :deep(.q-btn__content)
        justify-content: flex-start
    .hamburger-box
      cursor: pointer
      display: flex
      justify-content: center
      align-items: center
      @media (min-width: 1025px)
        display: none
      .menu-icon
        width: 50px
        display: flex
        justify-content: center
        align-items: center
        margin: 0 16px
        +iphone-width
          margin: 0 5px
        img
          width: 25px
  .header-center
    height: 100%
    @media (max-width: 1024px)
      display: none
    .nav-bar
      height: 100%
      display: flex
      -webkit-box-pack: end
      justify-content: flex-end
      -webkit-box-align: center
      align-items: center
      li
        line-height: 100%
        height: 100%
        cursor: pointer
        position: relative
        margin: 0px 22px
        font-family: OpenSans
        font-weight: 400
        font-size: 16px
        user-select: none
        color: $text-slate-blue-color
        white-space: nowrap
        +setFlex
        &.active
          color: $primary-color
          font-weight: 500
          &::before
            position: absolute
            background: $primary-color
            bottom: 0px
            content: ""
            height: 3px
            width: 100%
        .navlink
          +setFlex
          height: 100%
  .header-right
    margin-right: 10px
    flex: 1
    display: flex
    justify-content: flex-end
    +iphone-width
      margin-right: 0px
  @media (max-width: 1024px)
    width: 100%
  .menu-icon
    margin: 0 1vw
    width: 3vw
    cursor: pointer
  ::v-deep(.menu-icon)
    margin: 0
  .logo
    display: flex
    cursor: pointer
    img
      width: 6vw
      +iphone-width
        width: 15vw
  .nav
    color: $text-light-color
    display: flex
    justify-content: flex-end
    align-items: center
    width: 97%
    height: 100%

    ul
      width: 100%
      height: 100%
      +setFlex(flex-end)
      padding: 0
      margin: 0
      li
        font-size: 18px
        height: 100%
        cursor: pointer
        margin: 0 0.5vw
        list-style: none
        +setFlex
        .user-info
          +setFlex
          width: auto
          min-width: 160px
          @media (max-width: 1024px)
            display: none
          .user-name
            color: $text-night-sky-color
          .home
            color: $text-light-color
.wallet-btn
  @apply flex justify-center items-center p-[1.25rem] h-[2.5rem] mx-[0.5rem]
  font-family: OpenSans
  font-weight: 510
  font-size: 16px
  background: linear-gradient(124.59deg, $background-cyan-blue-color -9.08%, $background-electric-blue-color 114.33%)
  border-radius: 3.125rem
  @media (max-width: 1024px)
    display: none
  .wallet-icon
    @apply w-[1.5rem] h-[1.5rem] mr-[.25rem]
    background-image: url("../../assets/images/wallet.svg")
    background-size: contain
    background-repeat: no-repeat
    background-position: center
  span
    text-wrap: nowrap
.deposit-btn
  @apply flex justify-center items-center
  font-family: OpenSans
  font-weight: 510
  font-size: 16px
  height: 2.5rem
  border-radius: 1.875rem
  min-width: 3.25rem
  padding: 0px 0.75rem
  background: linear-gradient(116deg, $background-cyan-blue-color 0%, $primary-color 100%)
  color: $text-light-color
  @media (max-width: 1024px)
    @apply text-xs
    height: 2rem
    margin-right: 0rem
  span
    text-wrap: nowrap
.user-wrapper
  @apply relative
  &:hover
    .logout-modal
      display: block
</style>

<style lang="scss">
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";

.logout-modal {
  display: none;
  position: absolute;
  top: 105%;
  right: 0;
  background-color: $background-light-color;
  border: 1px solid $border-steel-blue-color;
  padding: 10px 0px;
  box-shadow: rgba($box-shadow-dark-color, 0.1) 0px 2px 10px;
  z-index: 10;
  white-space: nowrap;
  left: 50%;
  transform: translateX(-50%);
  min-width: min-content;
  border-radius: 4px;
}

.logout-modal .dropdown-item {
  padding: 0px 10px;
  color: $text-steel-blue-color;
}

.logout-modal .dropdown-item:hover {
  color: $text-light-steel-blue-color;
  background: $background-pale-blue-color;
}
</style>
