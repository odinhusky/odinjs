<template>
  <link rel="stylesheet" href="/css/_var.css" />
  <link rel="stylesheet" href="/css/site/r008/_var.css" />
  <div v-if="isReady">
    <q-layout view="hHh lpr fff" container style="height: 100vh" class="bg-grey-1">
      <HeaderComp :key="headerKey" />
      <ContactUsComp />
      <q-page-container
        class="page-container"
        :class="{ 'referral-rebate-page': ['ReferralRebateEvent', 'ReferralRebate'].includes(route.name) }"
      >
        <q-page class="mainWrapper">
          <div class="mx-auto items-center text-white">
            <router-view :key="route.params.gameType" />
          </div>
        </q-page>
      </q-page-container>
      <FooterComp />
    </q-layout>
    <FooterNav />
    <div
      ref="claimGiftButton"
      :style="style"
      style="position: fixed"
      v-if="isLogin && giftState.list.length > 0"
      class="z-[1000]"
    >
      <div class="relative w-fit cursor-pointer" @click="handleClaimGiftClick" @mousedown="isDragging = false">
        <div v-if="giftState.list.length > 0" class="bg-red-500 w-[15px] h-[15px] rounded-full ml-auto"></div>
        <q-img class="w-[60px] lg:w-[120px]" :src="claimGiftImg('giftBox.png')" loading="lazy" />
      </div>
    </div>
    <CurrencySupportDialog />
    <LaunchGameDialog />
  <CryptoWalletDialog />
    <GS1MiniGame />
  </div>
  <LiveChat />
  <FloatIconCMS />
  <ClaimGift />
</template>

<script lang="ts" setup>
import "vue3-carousel/dist/carousel.css"

import { useDraggable, useWindowSize } from "@vueuse/core"
import ContactUsComp from "app/template/set33_RED/components/ContactUs/Index.vue"
import ClaimGift from "app/template/set33_RED/components/Dialog/ClaimGift.vue"
import FloatIconCMS from "app/template/set33_RED/components/FloatIconCMS/Index.vue"
import FooterNav from "app/template/set33_RED/components/Footer/FooterNav.vue"
import FooterComp from "app/template/set33_RED/components/Footer/Index.vue"
import HeaderComp from "app/template/set33_RED/components/Header/Index.vue"
import { useSiteImg } from "app/template/set33_RED/hooks/useSiteImg"
import { useQuasar } from "quasar"
import CryptoWalletDialog from "src/common/components/dialog/CryptoWalletDialog.vue"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
import LiveChat from "src/common/components/LiveChat/Index.vue"
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
import { EventBusKey } from "src/symbols"
import { onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"

const _$q = useQuasar()
const route: any = useRoute()
const { isReady, initialize } = useInit()
const { handleGetPixelCodes } = usePixelCodes()
const { visitWebsite } = useEnv()
const { getAgentSetting } = useLanguage()
const { useBasicInfoQuery, getUserWalletList } = useUserInfo()
useBasicInfoQuery()
const { initGameTypeList } = useGame()
const { handleLogoList } = useLogo()
const { isLogin } = useAuth()
const { getGiftsList, giftState } = useClaimGift()
const { claimGiftImg } = useSiteImg()
const headerKey = ref(0)
const eventbus = injectStrict(EventBusKey)
const claimGiftButton = ref<HTMLElement | null>(null)
const { width, height } = useWindowSize()
const { x, style } = useDraggable(claimGiftButton, {
  initialValue: {
    x: width.value > 768 ? width.value - 150 : width.value - 70,
    y: height.value > 768 ? height.value - 200 : height.value - 140 } })
const isDragging = ref(false)

watch(x, () => { isDragging.value = true })

function handleClaimGiftClick() {
  if (!isDragging.value) { eventbus.emit("openClaimGiftDialog", true) }
  isDragging.value = false
}

watch(isLogin, (newValue) => {
  if (newValue) { headerKey.value++ }
})

onMounted(() => {
  initialize({
    task: [
      visitWebsite,

      getAgentSetting,
      handleLogoList,
      initGameTypeList,
      getUserWalletList,
      getGiftsList,
      handleGetPixelCodes,
    ] })
})
</script>

<style lang="sass">
@import "src/common/css/_variable.sass"
@import "app/template/set33_RED/assets/css/_variable.sass"
@import "app/template/set33_RED/assets/css/main.sass"
body
  +hideScrollBar
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
    padding: 3.5%
    width: 15%
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
      img
        max-width: 31%
        display: block
        margin: auto auto 2px
        filter: brightness(0) invert(1)
.page-container
  padding-top: 160px !important
  +pc-width
    padding-top: 14vw !important
  .mainWrapper
    min-height: 32.1rem !important


// 当路径为 referral_rebate 时，修改 padding-top
.page-container.referral-rebate-page
  padding-top: 60px !important
  +pc-width
    padding-top: 30px !important
</style>
