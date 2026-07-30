<template>
  <link rel="stylesheet" href="/css/_var.css" />
  <link rel="stylesheet" href="/css/site/r022/_var.css" />
  <main v-if="isReady" class="app-layout">
    <q-layout>
      <Header @toggle-drawer="toggleDrawer" />
      <AsideMenu v-model="drawer" />
      <q-page-container>
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
        <FooterArea />
      </q-page-container>
    </q-layout>
    <div ref="ClaimGiftButton" :style="style" style="position: fixed" class="z-[998]" data-tawk-avoid>
      <div class="flex flex-col gap-4">
        <div
          class="relative w-fit cursor-pointer"
          v-if="isLogin && giftState.list.length > 0"
          @click="handleClick"
          @mousedown="isDragging = false"
        >
          <div class="bg-red w-[15px] h-[15px] rounded-full ml-auto"></div>
          <q-img class="w-[60px] lg:w-[120px]" :src="claimGiftImg('giftBox.png')" loading="lazy" />
        </div>
        <FloatingIconBtn />
      </div>
    </div>
    <GS1MiniGame />
  </main>

  <ClaimGift />
  <FloatIconCMS />
  <LoginRegisterDialog :show="isAuthDialogOpen" :mode="authDialogMode" @close="closeAuthDialog" />
  <ForgotPasswordDialog />
  <DepositWithWithdrawalModal :show="isWalletDialogOpen" :mode="walletDialogMode" @close="closeWalletDialog" />
  <CurrencySupportDialog />
  <BonusTransferDetailDialog />
  <BankDetailsModal />
  <LiveChat />
  <SlideVerify />
  <AgeWarningDialog v-if="showAgeWarningDialog" />
  <LaunchGameDialog />
  <CryptoWalletDialog />
  <KycDialog v-if="showKycDialog" v-model="showKycDialog" />
  <CustomAnnouncement />
</template>

<script lang="ts" setup>
import { useDraggable, useWindowSize } from "@vueuse/core"
import AsideMenu from "app/template/set_r022/components/AsideMenu/Index.vue"
import CustomAnnouncement from "app/template/set_r022/components/CustomAnnouncement/Index.vue"
import BankDetailsModal from "app/template/set_r022/components/Dialog/BankDetails/Index.vue"
import BonusTransferDetailDialog from "app/template/set_r022/components/Dialog/BonusTransferDetail.vue"
import ClaimGift from "app/template/set_r022/components/Dialog/ClaimGift.vue"
import CurrencySupportDialog from "app/template/set_r022/components/Dialog/CurrencySupport.vue"
import DepositWithWithdrawalModal from "app/template/set_r022/components/Dialog/DepositWithWithdrawal/Index.vue"
import ForgotPasswordDialog from "app/template/set_r022/components/Dialog/ForgotPassword.vue"
import LoginRegisterDialog from "app/template/set_r022/components/Dialog/LoginRegister.vue"
import FloatIconCMS from "app/template/set_r022/components/FloatIconCMS/Index.vue"
import Header from "app/template/set_r022/components/Header/index.vue"
import { useSiteRedirect } from "app/template/set_r022/composables/useSiteRedirect"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { MENU } from "app/template/set_r022/utils/constants"
import CryptoWalletDialog from "src/common/components/dialog/CryptoWalletDialog.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import FloatingIconBtn from "src/common/components/FloatingIcon/Btn.vue"
import SlideVerify from "src/common/components/modal/SlideVerify.vue"
import { useBank } from "src/common/composables/useBank"
import { useGame } from "src/common/composables/useGame"
import { useInit } from "src/common/composables/useInit"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useWebSocketNotification } from "src/common/composables/useWebSocketNotification"
import { useAuth } from "src/common/hooks/useAuth"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useEnv } from "src/common/hooks/useEnv"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { injectStrict } from "src/common/utils/injectTyped"
import { useEnvInfoStore } from "src/stores/envStore"
import { EventBusKey } from "src/symbols"
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import KycDialog from "../MemberCenter/components/KycDialog.vue"

/** 首屏非關鍵：拆 chunk，避免與 Banner / CMS 搶下載與解析 */
const AgeWarningDialog = defineAsyncComponent(
  () => import("app/template/set_r022/components/Dialog/AgeWarningDialog.vue")
)
const FooterArea = defineAsyncComponent(() => import("app/template/set_r022/components/Footer/Index.vue"))
const GS1MiniGame = defineAsyncComponent(() => import("src/common/components/gs1/MiniGame.vue"))
const LiveChat = defineAsyncComponent(() => import("src/common/components/LiveChat/Index.vue"))
const { handleLogoList } = useLogo()
const { initGameTypeList } = useGame()
const { isReady, initialize } = useInit()
const { handleGetPixelCodes } = usePixelCodes()
const { getAgentSetting } = useLanguage()
const { getAvailCurrencyList } = useBank()
const { visitWebsite } = useEnv()
const { handleSiteRedirect } = useSiteRedirect()
const { useBasicInfoQuery, getUserWalletList } = useUserInfo()
useBasicInfoQuery()
const { getGiftsList, giftState } = useClaimGift()
const { claimGiftImg } = useSiteImg()
const { width, height } = useWindowSize()
const { isLogin } = useAuth()
const { startNotificationSocket, stopNotificationSocket } = useWebSocketNotification()
const route = useRoute()
const router = useRouter()
const { envInfo } = useEnvInfoStore()
const showKycDialog = ref(false)
const eventbus = injectStrict(EventBusKey)

const AUTH_ROUTE_NAMES = new Set(["Login", "Register"])

const isAuthDialogOpen = computed(() => AUTH_ROUTE_NAMES.has(String(route.name)))

const authDialogMode = computed<"login" | "register">(() => (route.name === "Register" ? "register" : "login"))

const isWalletDialogOpen = computed(() => MENU.WalletRouteNames.has(String(route.name)))

const walletDialogMode = computed<"deposit" | "withdrawal">(() =>
  route.name === "MemberWithdrawal" ? "withdrawal" : "deposit"
)

function closeAuthDialog() {
  router.replace({ name: "home", query: route.query })
}

function closeWalletDialog() {
  router.replace({ name: "home", query: route.query })
}

function redirectLoggedInUserFromAuthRoute() {
  if (!isReady.value) return

  if (isAuthDialogOpen.value && isLogin.value) {
    closeAuthDialog()
  }
}

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

watch(x, () => {
  isDragging.value = true
})

const handleClick = () => {
  if (!isDragging.value) {
    eventbus.emit("openClaimGiftDialog", true)
  }
  isDragging.value = false
}

watch(x, (val) => {
  x.value = width.value > 768 ? width.value - 150 : width.value - 70
  console.log(val)
})

const drawer = ref(false)

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

watch([isReady, isLogin, () => route.name], redirectLoggedInUserFromAuthRoute, { immediate: true })

onMounted(() => {
  startNotificationSocket()

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

  eventbus.on("openKycDialog", (show: boolean) => {
    showKycDialog.value = show
  })

  eventbus.on("openLogin", (show: boolean) => {
    if (show) {
      if (route.name !== "Login") {
        router.push({ name: "Login", query: route.query })
      }
      return
    }

    if (isAuthDialogOpen.value) {
      closeAuthDialog()
    }
  })

  eventbus.on("openRegister", (show: boolean) => {
    if (show) {
      if (route.name !== "Register") {
        router.push({ name: "Register", query: route.query })
      }
      return
    }

    if (isAuthDialogOpen.value) {
      closeAuthDialog()
    }
  })

  eventbus.on("openDepositWithWithdrawal", (show: boolean, type?: string) => {
    if (show) {
      const routeName = MENU.WalletTypeToRouteName[type || "deposit"] || "MemberDeposit"
      if (route.name !== routeName) {
        router.push({ name: routeName, query: route.query })
      }
      return
    }

    if (isWalletDialogOpen.value) {
      closeWalletDialog()
    }
  })
})

onBeforeUnmount(() => {
  stopNotificationSocket()
})
</script>

<style lang="scss">
@import "app/template/set_r022/assets/css/_variable.scss";

.app-layout {
  @apply w-full;
}

body {
  background: var(--bg-main-bg) !important;

  &.body--light {
    @include theme-vars(light);
  }

  &.body--dark {
    @include theme-vars(dark);
  }
}
</style>
