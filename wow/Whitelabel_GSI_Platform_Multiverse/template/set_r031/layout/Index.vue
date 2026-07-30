<template>
  <div v-if="isReady" class="home-page" :class="{ 'set-r031-bcym-betby-host': isBcymBetByPage }">
    <BackgroundAnimation />
    <HeaderArea v-model="isAsideShow"></HeaderArea>
    <div class="layout-main wide" id="layout-main">
      <div class="aside-layout">
        <Transition>
          <AsideMenu v-model="isAsideShow" />
        </Transition>
      </div>
      <div class="hm-content" :class="{ isClose: isAsideShow }">
        <div class="inner-content" :class="{ 'betby-flex-col': isBetByPage && !isBcymBetByPage }" ref="scrollRef">
          <div class="page-layout" :class="`${String(route.name)} ${route.meta.className}`">
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </div>
          <FooterArea />
        </div>
      </div>
    </div>
    <AIFunction :account="accountInfo.account" :bgColor="`var(--bg-11)`" />
    <FloatIconCMS />
    <GS1MiniGame />
    <div
      ref="ClaimGiftButton"
      :style="style"
      style="position: fixed"
      v-if="isLogin && giftState.list.length > 0"
      class="z-[1000]"
    >
      <div class="relative w-fit cursor-pointer" @click="handleClick" @mousedown="isDragging = false">
        <div v-if="giftState.list.length > 0" class="bg-red w-[15px] h-[15px] rounded-full ml-auto"></div>
        <q-img class="w-[60px] lg:w-[120px]" :src="claimGiftImg('giftBox.png')" loading="lazy" />
      </div>
    </div>
  </div>
  <CurrencySupportDialog />
  <LaunchGameDialog />
  <CryptoWalletDialog />
  <BonusTransferDetailDialog />
  <ClaimGift />
  <!-- <LiveChat /> -->
  <BetDetailDialog />
  <LoginRegisterDialog />
  <SlideVerify />
  <AgeWarningDialog v-if="showAgeWarningDialog" />
  <Announcement
    id="announcement-dialog-wrapper"
    :enable-advanced-announcement-filters="enableAdvancedAnnouncementFilters"
  />
</template>

<script lang="ts" setup>
import { useDraggable, useWindowSize } from "@vueuse/core"
import BackgroundAnimation from "app/template/set_r031/components/BackgroundAnimation/Index.vue"
import AgeWarningDialog from "app/template/set_r031/components/Dialog/AgeWarningDialog.vue"
import BetDetailDialog from "app/template/set_r031/components/Dialog/BetDetail.vue"
import BonusTransferDetailDialog from "app/template/set_r031/components/Dialog/BonusTransferDetail.vue"
import ClaimGift from "app/template/set_r031/components/Dialog/ClaimGift.vue"
import CurrencySupportDialog from "app/template/set_r031/components/Dialog/CurrencySupport.vue"
import LoginRegisterDialog from "app/template/set_r031/components/Dialog/LoginRegister.vue"
import FloatIconCMS from "app/template/set_r031/components/FloatIconCMS/Index.vue"
import FooterArea from "app/template/set_r031/components/Footer/Index.vue"
import HeaderArea from "app/template/set_r031/components/Header/Index.vue"
import { useSiteRedirect } from "app/template/set_r031/composables/useSiteRedirect"
import { useSiteImg } from "app/template/set_r031/hooks/useSiteImg"
import AsideMenu from "app/template/set_r031/layout/AsideMenu.vue"
import { useQuasar } from "quasar"
// import LiveChat from "src/common/components/LiveChat/Index.vue"
import AIFunction from "src/common/components/AIFunction/index.vue"
import Announcement from "src/common/components/Announcement/Index.vue"
import CryptoWalletDialog from "src/common/components/dialog/CryptoWalletDialog.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
import SlideVerify from "src/common/components/modal/SlideVerify.vue"
import { useBank } from "src/common/composables/useBank"
import { useGame } from "src/common/composables/useGame"
import { backgroundTask, blockingTask, useInit } from "src/common/composables/useInit"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useWebSocketNotification } from "src/common/composables/useWebSocketNotification"
import { useAuth } from "src/common/hooks/useAuth"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useEnv } from "src/common/hooks/useEnv"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { injectStrict } from "src/common/utils/injectTyped"
import { useEnvInfoStore } from "src/stores/envStore"
import { useGlobalStore } from "src/stores/globalStore"
import { EventBusKey } from "src/symbols"
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"

const { isReady, initialize } = useInit()
const { visitWebsite, setIsDark } = useEnv()
const { getAgentSetting } = useLanguage()
const { useBasicInfoQuery, getUserWalletList, accountInfo } = useUserInfo()
useBasicInfoQuery()
const { isLogin } = useAuth()
const { startNotificationSocket, stopNotificationSocket } = useWebSocketNotification()
const { initGameTypeList } = useGame()
const { handleLogoList } = useLogo()
const { getAvailCurrencyList } = useBank()
const { handleSiteRedirect } = useSiteRedirect()
const { getGiftsList, giftState } = useClaimGift()
const { claimGiftImg } = useSiteImg()
const { handleGetPixelCodes } = usePixelCodes()
const { envInfo } = useEnvInfoStore()
const globalStore = useGlobalStore()
const eventbus = injectStrict(EventBusKey)
const { width, height } = useWindowSize()

const $q = useQuasar()
let isAsideShow = ref($q.platform.is.mobile)
const route = useRoute()
const { isBCYM } = useAgentCode()
const isBetByPage = computed(() => route.name === "BetByPage")
const isBcymBetByPage = computed(() => isBCYM.value && (route.name === "home" || route.name === "BetByPage"))
const betbyHostClass = "set-r031-bcym-betby-host"
const enableAdvancedAnnouncementFilters = true
const ClaimGiftButton = ref<HTMLElement | null>(null)
const { x, style } = useDraggable(ClaimGiftButton, {
  initialValue: {
    x: width.value > 768 ? width.value - 150 : width.value - 70,
    y: height.value > 768 ? height.value - 200 : height.value - 140,
  },
})
const isDragging = ref(false)

// 取得 age_confirmation 決定是否顯示 AgeWarningDialog
const showAgeWarningDialog = computed(() => envInfo.age_confirmation)

watch(
  () => isAsideShow.value,
  (newVal) => {
    globalStore.setIsAsideShow(newVal as boolean)
  },
  { immediate: true }
)

const toggleBetByHostClass = (active: boolean) => {
  document.documentElement.classList.toggle(betbyHostClass, active)
  document.body.classList.toggle(betbyHostClass, active)
  document.getElementById("q-app")?.classList.toggle(betbyHostClass, active)
}

watch(isBcymBetByPage, toggleBetByHostClass, { immediate: true })

onBeforeUnmount(() => {
  toggleBetByHostClass(false)
})

watch(x, () => {
  isDragging.value = true
})

const handleClick = () => {
  if (!isDragging.value) {
    eventbus.emit("openClaimGiftDialog", true)
  }
  isDragging.value = false
}

onMounted(() => {
  startNotificationSocket()

  initialize({
    task: [
      backgroundTask(visitWebsite),
      blockingTask(getAgentSetting),
      blockingTask(handleLogoList),
      backgroundTask(initGameTypeList),
      backgroundTask(getUserWalletList),
      backgroundTask(getAvailCurrencyList),
      backgroundTask(getGiftsList),
      backgroundTask(handleGetPixelCodes),
    ],
    siteRedirect: handleSiteRedirect,
  })

  setIsDark(true)
})

onBeforeUnmount(() => {
  stopNotificationSocket()
})
</script>

<style lang="scss">
@import "app/template/set_r031/assets/css/_variable.scss";
@import "app/template/set_r031/assets/css/common.scss";

.bg-date {
  @apply bg-[var(--text-07)];
}

.text-select {
  @apply text-[var(--text-07)];
}

.wallet-popup {
  background: $primany11 !important;
}

:root {
  --r031-announcement-gradient-bg: linear-gradient(90deg, #ce4388 0%, #a10020 100%);
  --r031-announcement-menu-bg: #1e1335;
  --r031-announcement-text: #ffffff;
  --r031-announcement-menu-border: 2px solid #d2d2d240;
  --r031-announcement-menu-radius: 4px;
  --r031-announcement-menu-shadow: 0px 0px 10px 0px #ce4388;
}

// BETBY 官方要求 target 及其所有祖先不可套用自訂 display / position / overflow。
// 只在 set_r031 的 BCY1 BETBY 頁面回復 UA defaults，離開頁面即移除 host class。
html.set-r031-bcym-betby-host,
html.set-r031-bcym-betby-host > body,
html.set-r031-bcym-betby-host > body > #q-app,
html.set-r031-bcym-betby-host > body > #q-app > .outer-layout,
html.set-r031-bcym-betby-host > body > #q-app > .outer-layout > .home-page.set-r031-bcym-betby-host,
html.set-r031-bcym-betby-host > body > #q-app > .outer-layout > .home-page.set-r031-bcym-betby-host > #layout-main,
html.set-r031-bcym-betby-host
  > body
  > #q-app
  > .outer-layout
  > .home-page.set-r031-bcym-betby-host
  > #layout-main
  > .hm-content,
html.set-r031-bcym-betby-host
  > body
  > #q-app
  > .outer-layout
  > .home-page.set-r031-bcym-betby-host
  > #layout-main
  > .hm-content
  > .inner-content,
html.set-r031-bcym-betby-host
  > body
  > #q-app
  > .outer-layout
  > .home-page.set-r031-bcym-betby-host
  > #layout-main
  > .hm-content
  > .inner-content
  > .page-layout,
html.set-r031-bcym-betby-host .page-layout > .betby-wrapper,
html.set-r031-bcym-betby-host .page-layout > .betby-wrapper > .betby-area,
html.set-r031-bcym-betby-host .page-layout > .betby-wrapper > .betby-area > .betby-renderer-stack,
html.set-r031-bcym-betby-host .page-layout > .betby-wrapper > .betby-area > .betby-renderer-stack > #betby-sportsbook {
  display: revert !important;
  position: revert !important;
  overflow: revert !important;
}

// PC 改由 document 自然捲動；Header / Sidebar 是 BETBY 的 sibling，可固定在 viewport。
@media (min-width: 769px) {
  html.set-r031-bcym-betby-host > body > #q-app > .outer-layout > .home-page.set-r031-bcym-betby-host {
    height: auto;
    min-height: 100dvh;
  }

  html.set-r031-bcym-betby-host > body > #q-app > .outer-layout > .home-page.set-r031-bcym-betby-host > .header {
    position: fixed !important;
    inset: 0 0 auto;
    z-index: 1000;
  }

  html.set-r031-bcym-betby-host > body > #q-app > .outer-layout > .home-page.set-r031-bcym-betby-host > #layout-main {
    height: auto;
    min-height: 100dvh;
    padding-top: 4.25rem;
  }

  html.set-r031-bcym-betby-host
    > body
    > #q-app
    > .outer-layout
    > .home-page.set-r031-bcym-betby-host
    > #layout-main
    > .aside-layout
    > .side-menu {
    position: fixed;
    top: 4.25rem;
    bottom: 0;
    height: auto;
  }

  html.set-r031-bcym-betby-host
    > body
    > #q-app
    > .outer-layout
    > .home-page.set-r031-bcym-betby-host
    > #layout-main
    > .hm-content,
  html.set-r031-bcym-betby-host
    > body
    > #q-app
    > .outer-layout
    > .home-page.set-r031-bcym-betby-host
    > #layout-main
    > .hm-content
    > .inner-content {
    height: auto;
    min-height: calc(100dvh - 4.25rem);
  }
}

body .announcement-type-menu-popup {
  background: #1E1335 !important;
  border: 2px solid #D2D2D240 !important;
  border-radius: 4px !important;
  box-shadow: 0px 0px 10px 0px #CE4388 !important;
  -webkit-box-shadow: 0px 0px 10px 0px #CE4388 !important;
  overflow: hidden;

  .q-item {
    color: #FFFFFF !important;
    background: #1E1335 !important;
  }

  .q-item.q-item--active,
  .q-item.q-item--focused {
    background: linear-gradient(90deg, #CE4388 0%, #A10020 100%) !important;
    color: #FFFFFF !important;
  }
}
</style>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "src/css/modal.sass"
@import "app/template/set_r031/assets/css/_variable.scss"

// fadeIn
.v-enter-active,
.v-leave-active
  transition: opacity 0.3s ease

.v-enter-from,
.v-leave-to
  opacity: 0

// modal slot
.form-item
  margin: 10px 0
  p
    margin-bottom: 5px
    color: rgba($neutral01, 0.70)
    font-family: "Century Gothic"
    font-size: 14px
    font-style: normal
    font-weight: 700
    line-height: normal
    text-transform: capitalize

// layout style
.home-page
  position: relative
  // background-image: url('app/template/set_r031/assets/images/bg.jpg')
  margin: 0
  padding: 0
  height: 100%
  background-color: $secondary07
  overflow: hidden
  // baground-size: 100% 100%
  // background-repeat: no-repeat
#announcement-dialog-wrapper
  :deep(.announcement-filter-bar)
    background-color: var(--bg-04)
.page-layout.AnnouncementCenter
  :deep(.announcement-filter-bar)
    background-color: var(--bg-04)
#announcement-dialog-wrapper,
.page-layout.AnnouncementCenter
  :deep(.filter-search-btn),
  :deep(.quick-filter-tab--active)
    background: var(--r031-announcement-gradient-bg) !important
    color: var(--r031-announcement-text) !important
  :deep(.filter-search-btn .q-icon)
    color: var(--r031-announcement-text) !important
  :deep(.sidebar-pagination),
  :deep(.mobile-pagination)
    .q-pagination__content,
    .q-pagination__middle
      gap: .5rem
    .q-btn
      min-height: 2rem
      min-width: 2rem
      border-radius: .25rem
      background: var(--bg-pagination, var(--bg-08)) !important
      color: var(--text-pagination-enabled, var(--tab-text-01)) !important
      font-weight: 700
      margin: 0
      &::before
        box-shadow: none !important
      &[aria-current="true"]
        background: var(--r031-announcement-gradient-bg) !important
        color: var(--r031-announcement-text) !important
      &.disabled
        background: var(--bg-pagination, var(--bg-08)) !important
        color: var(--icon-01) !important
        opacity: 1 !important
    .q-pagination__middle button[aria-current="true"]
      background: var(--r031-announcement-gradient-bg) !important
      color: var(--r031-announcement-text) !important
.btn-common
  margin: 0vw
  img
    width: 1.2vw
    +iphone-width
      width: 3vw
#slide_right
  +setFlex
  bottom: 208px
  width: 68px
  height: 56px
  border-radius: 50% 0px 0px 50%
  backdrop-filter: blur(10px)
  background: rgba($secondary01, 0.7)
  border: 1px solid $secondary01
  box-shadow: rgba($secondary01, 0.05) 0px 4px 8px 0px
  position: fixed
  top: 15vw
  right: 0vw
  z-index: 9
  +iphone-width
    top: unset
    bottom: 25vw
    backdrop-filter: none
    box-shadow: rgba($secondary01, 0.4) 0px 2px 10px
    width: 40px
    height: 40px
  img
    width: 3rem
    margin-right: 0.5rem
    cursor: pointer
// common style
.btn-common
  margin: 0vw
  img
    width: 1.2vw
.btn-title
  color: rgba($neutral01, 0.70)
  font-family: "Century Gothic"
  font-size: 1.2vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
.btn-content
  color: rgba($neutral01, 0.70)
  font-family: "Century Gothic"
  font-size: 0.8vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
  &.yellow
    color: $yellow-active
// layout style
.layout-main
  position: relative
  height: calc(100vh - 4.25rem)
  overflow: hidden
  +phone-width
    height: calc(100vh - 3.6875rem)
  .hm-content
    width: 100%
    margin-left: 0
    padding-left: 270px
    height: 100%
    position: relative
    // display: table
    justify-content: flex-start
    align-items: flex-start
    flex-direction: row
    transition: margin-left 0.2s ease 0s, padding-left 0.2s ease 0s
    +phone-width
      margin-left: 0px
      width: 100%
      padding-left: 0
    &.isClose
      width: 100%
      margin-left: 0
      padding-left: 70px
      +phone-width
        width: 100%
        margin-left: 0px
        padding-left: 0
    .inner-content
      width: 100%
      height: 100%
      overflow-y: auto
      &.betby-flex-col
        display: flex
        flex-direction: column
      &::-webkit-scrollbar
        display: none
      .page-layout
        padding: 0
        position: relative
        margin: 0 auto
        min-height: 100%
        +phone-width
          padding: 0
        &.PrivacyPolicy, &.TermAndCondition, &.ResponsibleGaming, &.without-padding, &.promotion, &.PromotionDetail
          padding: 0
          +phone-width
            padding: 0
      +iphone-width
        // width: 90vw
        margin: 0 auto
.reset-btn
  text-transform: none
  margin: 0 .3125rem
  color: $neutral01
  text-decoration-line: none !important
.btn-live-chat
  @apply flex justify-center items-center fixed z-30 transform-none
  width: 2.25rem
  height: 2.25rem
  bottom: 4.75rem
  right: .375rem
  font-weight: 580
  font-size: 1.25rem
  background-size: 100% 100%
  background-color: $secondary05
  box-shadow: rgba($secondary05, 0.4) 0px 2px 10px
  color: $neutral01
  border-radius: 50%
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) , visibility 0.3s ease
  &.tg-mini-app
    bottom: 5.75rem
  &.hide
    transform: translateY(112px)
    visibility: hidden
</style>
