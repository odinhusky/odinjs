<template>
  <div v-if="isReady" class="home-page">
    <BackgroundAnimation />
    <HeaderArea v-model="isAsideShow"></HeaderArea>
    <div class="layout-main wide" id="layout-main">
      <div class="aside-layout">
        <Transition>
          <AsideMenu v-model="isAsideShow" />
        </Transition>
      </div>
      <div class="hm-content" :class="{ isClose: isAsideShow }">
        <div class="inner-content scroll" :class="{ 'betby-flex-col': isBetByPage }" ref="scrollRef">
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
    <PlayerChatroom v-if="isGsiChatroomEnabled" />
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
import BackgroundAnimation from "app/template/set_r017/components/BackgroundAnimation/Index.vue"
import AgeWarningDialog from "app/template/set_r017/components/Dialog/AgeWarningDialog.vue"
import BetDetailDialog from "app/template/set_r017/components/Dialog/BetDetail.vue"
import BonusTransferDetailDialog from "app/template/set_r017/components/Dialog/BonusTransferDetail.vue"
import ClaimGift from "app/template/set_r017/components/Dialog/ClaimGift.vue"
import CurrencySupportDialog from "app/template/set_r017/components/Dialog/CurrencySupport.vue"
import LoginRegisterDialog from "app/template/set_r017/components/Dialog/LoginRegister.vue"
import FloatIconCMS from "app/template/set_r017/components/FloatIconCMS/Index.vue"
import FooterArea from "app/template/set_r017/components/Footer/Index.vue"
import HeaderArea from "app/template/set_r017/components/Header/Index.vue"
import { useSiteRedirect } from "app/template/set_r017/composables/useSiteRedirect"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import AsideMenu from "app/template/set_r017/layout/AsideMenu.vue"
import { storeToRefs } from "pinia"
import { useQuasar } from "quasar"
// import LiveChat from "src/common/components/LiveChat/Index.vue"
import AIFunction from "src/common/components/AIFunction/index.vue"
import Announcement from "src/common/components/Announcement/Index.vue"
import CryptoWalletDialog from "src/common/components/dialog/CryptoWalletDialog.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
import PlayerChatroom from "src/common/components/PlayerChatroom/index.vue"
import SlideVerify from "src/common/components/modal/SlideVerify.vue"
import { useBank } from "src/common/composables/useBank"
import { useGame } from "src/common/composables/useGame"
import { useInit } from "src/common/composables/useInit"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useEnv } from "src/common/hooks/useEnv"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { injectStrict } from "src/common/utils/injectTyped"
import { useEnvInfoStore } from "src/stores/envStore"
import { useGlobalStore } from "src/stores/globalStore"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"

const { isReady, initialize } = useInit()
const { visitWebsite, setIsDark } = useEnv()
const { getAgentSetting } = useLanguage()
const { useBasicInfoQuery, getUserWalletList, accountInfo } = useUserInfo()
useBasicInfoQuery()
const { isLogin } = useAuth()
const { initGameTypeList } = useGame()
const { handleLogoList } = useLogo()
const { getAvailCurrencyList } = useBank()
const { handleSiteRedirect } = useSiteRedirect()
const { getGiftsList, giftState } = useClaimGift()
const { claimGiftImg } = useSiteImg()
const { handleGetPixelCodes } = usePixelCodes()
const { envInfo } = useEnvInfoStore()
// 依後台設定 gsi_chatroom_enabled 決定是否顯示聊天室
const { isGsiChatroomEnabled } = storeToRefs(useEnvInfoStore())
const globalStore = useGlobalStore()
const eventbus = injectStrict(EventBusKey)
const { width, height } = useWindowSize()

const $q = useQuasar()
let isAsideShow = ref($q.platform.is.mobile)
const route = useRoute()
const isBetByPage = computed(() => route.name === "BetByPage")
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
  initialize({
    task: [
      visitWebsite,

      getAgentSetting,
      handleLogoList,
      initGameTypeList,
      getUserWalletList,
      getAvailCurrencyList,
      getGiftsList,
      handleGetPixelCodes,
    ],
    siteRedirect: handleSiteRedirect,
  })

  setIsDark(true)
})
</script>

<style lang="scss">
@import "app/template/set_r017/assets/css/_variable.scss";
@import "app/template/set_r017/assets/css/common.scss";
@import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";

.bg-date {
  @apply bg-[var(--text-07)];
}

.q-menu:has(.q-date) {
  color: inherit !important;
}

.text-select {
  @apply text-[var(--text-07)];
}
</style>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "src/css/modal.sass"
@import "app/template/set_r017/assets/css/_variable.scss"

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
  // background-image: url('app/template/set_r017/assets/images/bg.jpg')
  margin: 0
  padding: 0
  height: 100%
  background-color: #0A0A35
  overflow: hidden
  // baground-size: 100% 100%
  // background-repeat: no-repeat
#announcement-dialog-wrapper,
.page-layout.AnnouncementCenter
  --announcement-dialog-bg: var(--dialog-bg, #1d125d)
  --announcement-body-bg: var(--bg-04, #000025)
  --announcement-field-bg: var(--bg-08, #0c0c1c)
  --announcement-field-border: var(--bg-line-02, #79739e)
  --announcement-sidebar-bg: var(--card-bg-01, #000000)
  --announcement-sidebar-active-bg: var(--card-bg-02, #25167f)
  --announcement-gradient-bg: linear-gradient(90deg, var(--btn-bg-01, #f26319) 0%, var(--btn-bg-02, #d12d00) 100%)
  --announcement-text: var(--text-01, #ffffff)
  --announcement-muted-text: var(--text-02, rgba(255, 255, 255, .6))
  --announcement-pagination-bg: var(--dialog-bg, #1d125d)
  --announcement-pagination-active-text: var(--text-pagination-focused, var(--btn-text-05, #ffffff))
  --ann-checkbox-bg-active: #409EFF

  :deep(.dialog-header)
    background: var(--announcement-dialog-bg) !important

  :deep(.dialog-body),
  :deep(.body-content)
    background: var(--announcement-body-bg) !important

  :deep(.announcement-filter-bar)
    display: block !important
    background: var(--announcement-body-bg) !important
    background-color: var(--announcement-body-bg) !important
    border-color: var(--bg-line-01, rgba(255, 255, 255, .18)) !important

  :deep(.select-announcement-type-toolbar .q-field__control),
  :deep(.filter-date-range-input .q-field__control),
  :deep(.keyword-input .q-field__control)
    background: var(--announcement-field-bg) !important
    background-color: var(--announcement-field-bg) !important
    color: var(--announcement-text) !important

  :deep(.select-announcement-type-toolbar .q-field__native),
  :deep(.filter-date-range-input .q-field__native),
  :deep(.keyword-input .q-field__native),
  :deep(.select-announcement-type-toolbar .q-field__input),
  :deep(.filter-date-range-input .q-field__input),
  :deep(.keyword-input .q-field__input)
    color: var(--announcement-text) !important

  :deep(.select-announcement-type-toolbar .q-field__append),
  :deep(.filter-date-range-input .q-field__append),
  :deep(.keyword-input .q-field__prepend),
  :deep(.keyword-input .q-field__append),
  :deep(.select-announcement-type-toolbar .q-select__dropdown-icon),
  :deep(.filter-date-range-input .q-icon),
  :deep(.keyword-input .q-icon)
    color: var(--announcement-text) !important

  :deep(.quick-filter-tab)
    background: transparent !important
    color: var(--announcement-text) !important

  :deep(.quick-filter-tab--active)
    background: var(--announcement-gradient-bg) !important
    color: var(--announcement-text) !important

  :deep(.filter-search-btn)
    background: var(--announcement-gradient-bg) !important
    color: var(--announcement-text) !important

  :deep(.body-nav),
  :deep(.sidebar-wrapper),
  :deep(.sidebar-list)
    background: var(--announcement-body-bg) !important
    background-color: var(--announcement-body-bg) !important

  :deep(.body-nav)
    display: flex !important

  :deep(.sidebar-wrapper)
    display: flex !important

  :deep(.sidebar-list .sidebar-item)
    background: var(--announcement-sidebar-bg) !important
    background-color: var(--announcement-sidebar-bg) !important
    color: var(--announcement-text) !important

  :deep(.sidebar-list .sidebar-item.active)
    background: var(--announcement-sidebar-active-bg) !important
    background-color: var(--announcement-sidebar-active-bg) !important

  :deep(.sidebar-type-tag)
    background: var(--announcement-gradient-bg) !important
    color: var(--announcement-text) !important

  :deep(.sidebar-date)
    color: var(--announcement-muted-text) !important

  :deep(.sidebar-text)
    color: var(--announcement-text) !important

  :deep(.announcement-checkbox-wrapper .q-checkbox__inner--truthy)
    color: #409EFF !important

    .q-checkbox__bg,
    .q-checkbox__svg
      background: #409EFF !important
      background-color: #409EFF !important
      border-color: #409EFF !important

  :deep(.sidebar-pagination),
  :deep(.mobile-pagination)
    display: flex !important
    .q-pagination__content,
    .q-pagination__middle
      gap: .5rem
    .q-btn
      min-height: 2rem
      min-width: 2rem
      border-radius: .25rem
      background: var(--announcement-pagination-bg) !important
      color: var(--announcement-text) !important
      font-weight: 700
      margin: 0
      &::before
        box-shadow: none !important
      &[aria-current="true"]
        background: var(--announcement-gradient-bg) !important
        color: var(--announcement-pagination-active-text) !important
      &.disabled
        background: var(--announcement-pagination-bg) !important
        color: var(--announcement-text) !important
        opacity: 1 !important
    .q-btn.q-btn--active,
    .q-btn.q-btn--standard[aria-current="true"],
    .q-pagination__middle button[aria-current="true"]
      background: var(--announcement-gradient-bg) !important
      color: var(--announcement-pagination-active-text) !important
.page-layout.AnnouncementCenter
  @media (max-width: 768px)
    :deep(.sidebar-pagination)
      display: none !important
#announcement-dialog-wrapper
  @media (max-width: 768px)
    :deep(.dialog-body--advanced .body-nav)
      display: none !important
    :deep(.sidebar-pagination)
      display: none !important
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
