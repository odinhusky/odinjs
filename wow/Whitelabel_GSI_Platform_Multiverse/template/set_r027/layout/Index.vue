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
        <div class="inner-content scroll" ref="scrollRef">
          <div class="page-layout" :class="`${ String(route.name) } ${ route.meta.className }`">
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
  <ClaimGift />
  <!-- <LiveChat /> -->
  <BetDetailDialog />
  <LoginRegisterDialog />
  <SlideVerify />
  <AgeWarningDialog v-if="showAgeWarningDialog" />
  <Announcement id="announcement-dialog-wrapper" />
</template>

<script lang="ts" setup>
import { useDraggable, useWindowSize } from "@vueuse/core"
import BackgroundAnimation from "app/template/set_r027/components/BackgroundAnimation/Index.vue"
import AgeWarningDialog from "app/template/set_r027/components/Dialog/AgeWarningDialog.vue"
import BetDetailDialog from "app/template/set_r027/components/Dialog/BetDetail.vue"
import ClaimGift from "app/template/set_r027/components/Dialog/ClaimGift.vue"
import LoginRegisterDialog from "app/template/set_r027/components/Dialog/LoginRegister.vue"
import FloatIconCMS from "app/template/set_r027/components/FloatIconCMS/Index.vue"
import FooterArea from "app/template/set_r027/components/Footer/Index.vue"
import HeaderArea from "app/template/set_r027/components/Header/Index.vue"
import { useSiteRedirect } from "app/template/set_r027/composables/useSiteRedirect"
import { useSiteImg } from "app/template/set_r027/hooks/useSiteImg"
import AsideMenu from "app/template/set_r027/layout/AsideMenu.vue"
import { useQuasar } from "quasar"
// import LiveChat from "src/common/components/LiveChat/Index.vue"
import AIFunction from "src/common/components/AIFunction/index.vue"
import Announcement from "src/common/components/Announcement/Index.vue"
import CryptoWalletDialog from "src/common/components/dialog/CryptoWalletDialog.vue"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
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
const globalStore = useGlobalStore()
const eventbus = injectStrict(EventBusKey)
const { width, height } = useWindowSize()

const $q = useQuasar()
let isAsideShow = ref($q.platform.is.mobile)
const route = useRoute()
const ClaimGiftButton = ref<HTMLElement | null>(null)
const { x, style } = useDraggable(ClaimGiftButton, {
  initialValue: {
    x: width.value > 768 ? width.value - 150 : width.value - 70,
    y: height.value > 768 ? height.value - 200 : height.value - 140 } })
const isDragging = ref(false)

// 取得 age_confirmation 決定是否顯示 AgeWarningDialog
const showAgeWarningDialog = computed(() => envInfo.age_confirmation)

watch(
  () => isAsideShow.value,
  (newVal) => { globalStore.setIsAsideShow(newVal as boolean) },
  { immediate: true }
)

watch(x, () => { isDragging.value = true })

const handleClick = () => {
  if (!isDragging.value) { eventbus.emit("openClaimGiftDialog", true) }
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
    siteRedirect: handleSiteRedirect })

  setIsDark(true)
})
</script>

<style lang="scss">
@import "app/template/set_r027/assets/css/_variable.scss";
@import "app/template/set_r027/assets/css/dropdown.scss";
@import "src/common/css/_variable.sass";

.q-menu:has(.q-date) {
  border-radius: 0px !important;
  overflow: hidden;
}

.q-date {
  background: var(--dialog-bg-02) !important;
  color: var(--text-01);
  border-radius: 0px !important;
  box-shadow: none;
  padding: 24px;
  min-width: 310px;
  box-sizing: border-box;
}

.q-date__content,
.q-date__main,
.q-date__calendar,
.q-date__calendar-days-container {
  background: var(--date-picker-surface-bg);
  color: var(--text-01);
}

.q-date__header {
  background: var(--date-picker-header-bg);
  color: var(--text-01);
}

.q-date__header-subtitle,
.q-date__header-title,
.q-date__view,
.q-date__navigation,
.q-date__navigation .q-btn,
.q-date__arrow { color: var(--text-01); }

.q-date__calendar-weekdays,
.q-date__calendar-weekdays > div,
.q-date__day--out,
.q-date__day--out .q-btn__content,
.q-date__day--disabled,
.q-date__day--disabled .q-btn__content {
  color: var(--text-02);
  opacity: 1 !important;
}

.q-date__range,
.q-date__edit-range { background: var(--date-picker-range-bg); }

.q-date__range:before,
.q-date__range-from:before,
.q-date__range-to:before {
  background-color: rgb(36 36 51);
  position: absolute;
  opacity: 1 !important;
}

.q-date .bg-primary {
  background: linear-gradient(90deg, #6420bc 0%, #2e1d64 100%) !important;
  color: #fff !important;
}

.bg-date { background: linear-gradient(90deg, #6420bc 0%, #2e1d64 100%) !important; }

.member-history-date-popup {
  border-radius: 12px !important;
  box-shadow: none !important;
  overflow: hidden;
  scrollbar-width: none;

  @media (min-width: 768px) { background: transparent !important; }

  @include phone-width { background: transparent !important; }

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}

.member-history-date-popup .q-dialog__inner,
.member-history-date-popup .q-dialog__inner > div {
  overflow: hidden !important;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}

.member-history-date-pop {
  border-radius: 12px !important;
  box-shadow: none !important;
  overflow: hidden;
  position: relative;

  .date-pop-body.q-col-gutter-md { margin-left: 0; }

  .date-pop-body.q-col-gutter-md > * { padding-left: 0; }

  .date-pop-calendar { position: relative; }

  @media (min-width: 600px) {
    .row > .col-sm-7 { width: auto; }
  }

  .member-history-q-date {
    border-radius: 12px !important;
    overflow: hidden;
    width: 100%;

    .q-date__header { border-top-left-radius: 0px; }

    &.q-date--portrait-standard .q-date__header { border-top-right-radius: 0px; }
  }

  @include phone-width {
    background: transparent !important;
    margin: 0 auto;
    top: 15px;

    .member-history-date-shortcuts {
      position: absolute;
      top: 39px;
      left: 12px;
      right: 12px;
      z-index: 2;
      margin-bottom: 0 !important;
    }

    .member-history-q-date {
      padding-top: 68px;
      min-width: min(330px, calc(100vw - 32px));
    }
  }
}

#announcement-dialog-wrapper {
  --ann-checkbox-border: 1px solid var(--bg-line-03);
  --ann-checkbox-svg-bg: var(--btn-bg-04);
  --ann-checkbox-svg-bg-active: var(--btn-bg-04);

  .announcement-footer .q-checkbox {
    :deep(.q-checkbox__inner) {
      color: var(--ann-checkbox-bg, #dcdfe6);

      .q-checkbox__bg { border: 1px solid rgba(255, 255, 255, 0.75) !important; }

      .q-checkbox__svg {
        background: var(--ann-checkbox-svg-bg, var(--ann-checkbox-bg, #ffffff));
        color: var(--ann-checkbox-icon, #ffffff);
      }

      &.q-checkbox__inner--truthy {
        color: var(--ann-checkbox-bg-active, #025be8);

        .q-checkbox__svg { background: var(--ann-checkbox-svg-bg-active, var(--ann-checkbox-bg-active, #025be8)); }
      }
    }
  }
}
</style>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "src/css/modal.sass"
@import "app/template/set_r027/assets/css/_variable.scss"

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
  // background-image: url('app/template/set_r027/assets/images/bg.jpg')
  margin: 0
  padding: 0
  height: 100%
  background-color: var(--bg-04)
  overflow: hidden
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
      &::-webkit-scrollbar
        display: none
      &.mobile
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
  text-decoration-line:important
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
