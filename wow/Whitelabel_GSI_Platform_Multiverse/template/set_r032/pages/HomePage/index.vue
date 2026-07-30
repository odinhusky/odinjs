<template>
  <main v-if="isReady" class="app-layout">
    <q-layout>
      <Header @toggle-drawer="toggleDrawer" />
      <AsideMenu v-model="drawer" />
      <q-page-container>
        <div class="page-glow-wrapper">
          <transition name="fade" mode="out-in">
            <router-view />
          </transition>
          <FooterArea />
        </div>
      </q-page-container>
    </q-layout>
    <div ref="ClaimGiftButton" :style="style" style="position: fixed" class="z-[998]">
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
  <LoginRegisterDialog />
  <ForgotPasswordDialog />
  <DepositWithWithdrawalModal />
  <CurrencySupportDialog />
  <BankDetailsModal />
  <LiveChat />
  <SlideVerify />
  <AgeWarningDialog v-if="showAgeWarningDialog" />
  <LaunchGameDialog />
  <KycDialog v-if="showKycDialog" v-model="showKycDialog" />
  <CustomAnnouncement />
</template>

<script lang="ts" setup>
import { useDraggable, useWindowSize } from "@vueuse/core"
import AsideMenu from "app/template/set_r032/components/AsideMenu/Index.vue"
import CustomAnnouncement from "app/template/set_r032/components/CustomAnnouncement/Index.vue"
import BankDetailsModal from "app/template/set_r032/components/Dialog/BankDetails/Index.vue"
import ClaimGift from "app/template/set_r032/components/Dialog/ClaimGift.vue"
import DepositWithWithdrawalModal from "app/template/set_r032/components/Dialog/DepositWithWithdrawal/Index.vue"
import ForgotPasswordDialog from "app/template/set_r032/components/Dialog/ForgotPassword.vue"
import LoginRegisterDialog from "app/template/set_r032/components/Dialog/LoginRegister.vue"
import FloatIconCMS from "app/template/set_r032/components/FloatIconCMS/Index.vue"
import FooterArea from "app/template/set_r032/components/Footer/Index.vue"
import Header from "app/template/set_r032/components/Header/index.vue"
import { useSiteRedirect } from "app/template/set_r032/composables/useSiteRedirect"
import { useSiteImg } from "app/template/set_r032/hooks/useSiteImg"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
import LiveChat from "src/common/components/LiveChat/Index.vue"
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
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { injectStrict } from "src/common/utils/injectTyped"
import { useEnvInfoStore } from "src/stores/envStore"
import { EventBusKey } from "src/symbols"
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch, watchEffect } from "vue"

import KycDialog from "../MemberCenter/components/KycDialog.vue"

// 動態引入 AgeWarningDialog
const AgeWarningDialog = defineAsyncComponent(
  () => import("app/template/set_r032/components/Dialog/AgeWarningDialog.vue")
)

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
const { envInfo } = useEnvInfoStore()
const showKycDialog = ref(false)
const { enableConfig, injectHtml } = useLiveChat()

const eventbus = injectStrict(EventBusKey)
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

const findWidgetElement = () => {
  const widgetElement = document.querySelector(".widget-visible")
  if (widgetElement) {
    console.log("找到 widget-visible 元件:", widgetElement)
    return widgetElement
  }
  return null
}

// 安全地設定樣式的函數
const setWidgetStyle = (style) => {
  const widget = findWidgetElement()
  if (widget) {
    console.log("設定樣式前:", widget.style.cssText)
    widget.style.cssText = style
    console.log("設定樣式後:", widget.style.cssText)
    return true
  } else {
    console.log("找不到 widget-visible 元件")
    return false
  }
}

// 重試機制
const retrySetStyle = (style, maxRetries = 10, delay = 500) => {
  let retries = 0
  const trySet = () => {
    if (setWidgetStyle(style)) {
      return true
    }
    if (retries < maxRetries) {
      retries++
      console.log(`重試設定樣式 (${retries}/${maxRetries})`)
      setTimeout(trySet, delay)
    } else {
      console.log("達到最大重試次數，無法設定樣式")
    }
  }
  trySet()
}

watchEffect(async () => {
  if (enableConfig.value) {
    await injectHtml()

    // 使用重試機制設定初始樣式
    retrySetStyle("transform: translateY(-60px) !important;")

    window.Tawk_API.onLoad = function () {
      console.log("Tawk_API onLoad 觸發")
      retrySetStyle("transform: translateY(-60px) !important;")
    }

    window.Tawk_API.onChatMaximized = function () {
      console.log("Tawk_API onChatMaximized 觸發")
      setWidgetStyle("")
    }

    window.Tawk_API.onChatMinimized = function () {
      console.log("Tawk_API onChatMinimized 觸發")
      setWidgetStyle("transform: translateY(-60px) !important;")
    }

    const observer = new MutationObserver((_mutations) => {
      const widget = findWidgetElement()
      if (widget) {
        console.log("widget-visible 元件已載入")
        // 確保樣式被正確設定
        retrySetStyle("transform: translateY(-60px) !important;")
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }
})

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
})

onBeforeUnmount(() => {
  stopNotificationSocket()
})
</script>

<style lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r032/assets/css/_variable.scss";

.app-layout {
  @apply w-full;
}

.page-glow-wrapper {
  position: relative;
  min-height: 100vh;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    box-shadow: inset 26px 0 25px -30px var(--neutral-03);
    pointer-events: none;
    z-index: 10;

    // H5 / 平板（pad-large-width）關掉這個內陰影，只 PC 才有
    @include pad-large-width {
      box-shadow: none;
    }
  }
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

// 統一 q-select 配色（light / dark theme 分開設定，方便日後針對單一主題微調）
.q-select {
  @include light {
    .q-field__control::before {
      border-color: var(--primary-01);
    }

    &.q-field--focused .q-field__control::after {
      border-color: var(--primary-01);
    }

    .q-field__append {
      color: var(--primary-01);
    }

    &.q-field--focused .q-field__label {
      color: var(--primary-01);
    }
  }

  @include dark {
    .q-field__control::before {
      border-color: var(--primary-01);
    }

    &.q-field--focused .q-field__control::after {
      border-color: var(--primary-01);
    }

    .q-field__append {
      color: var(--primary-01);
    }

    &.q-field--focused .q-field__label {
      color: var(--primary-01);
    }
  }
}

// q-select 下拉選單（q-menu 透過 teleport 渲染到 body 之外，需獨立全域覆寫
// Quasar 預設 $primary = #1976D2，因此 .q-item--active 與 .text-primary 仍會吃到藍色）
.q-menu {
  @include light {
    .q-item--active,
    .q-item--active.text-primary,
    .q-item.text-primary {
      color: var(--secondary-01) !important;
    }

    .q-item--active {
      background-color: color-mix(in srgb, var(--text-01) 15%, transparent) !important;
    }
  }

  @include dark {
    .q-item--active,
    .q-item--active.text-primary,
    .q-item.text-primary {
      color: var(--secondary-01) !important;
    }

    .q-item--active {
      background-color: color-mix(in srgb, var(--text-01) 18%, transparent) !important;
    }
  }
}

// q-checkbox 用 color="term" 但專案沒定義這個色，這邊把 .text-term / .bg-term 對映到 primary-01
// Quasar 會依 color prop 自動套上這兩個 class（unchecked 用 text-${color}、checked 用 bg-${color}）
.text-term {
  color: var(--primary-01) !important;
}

.bg-term {
  background-color: var(--primary-01) !important;
}

// 打勾 SVG 在 dark theme 改黑色（dark 的 primary-01 是黃色，白勾在黃底看不清）
// Quasar 把 text-${color} 加在 .q-checkbox__inner（不是 .q-checkbox__bg），
// 所以用 truthy + text-term 鎖定「勾選後 + 用 term 色」的 q-checkbox
body.body--dark {
  .q-checkbox__inner--truthy.text-term .q-checkbox__svg {
    color: #000 !important;
  }
}

// 註冊彈窗中 PhoneInput 元件的國碼/手機欄位
// PhoneInput 是子元件，ModeLoginRegister 的 scoped style 裡 .form-input 規則
// 因為 scope 不對 match 不到，所以在這邊用全域非 scoped style 直接寫，讓它跟其他欄位視覺一致
.phone-group .form-input {
  @include light {
    .q-field__control {
      color: transparent !important;

      &::before {
        border-color: var(--neutral-03) !important;
      }
    }
  }

  @include dark {
    // 預設（未 focus）— #dfdfdf 30% 透明度 + border-soft 紫光
    .q-field__control {
      border: 1px solid rgba(223, 223, 223, 0.3);
      box-shadow: 0 0 10px 2px var(--border-soft);
      color: var(--text-1) !important;

      &::before {
        border-color: var(--text-1) !important;
      }
    }

    // focus 時：邊框與文字提亮
    &.q-field--focused {
      .q-field__control {
        color: #dfdfdf !important;

        &::before {
          border-color: #dfdfdf !important;
        }
      }
    }
  }
}

// 統一 set_r032 內所有 q-date 配色到 var(--primary-01)
// q-date 多由 q-menu teleport 到 body 之外，scoped style 不容易處理，故統一寫在這邊
// 注意：故意不覆寫 .text-primary，因為 Quasar 在 range 中段日子用 text-primary 設文字色，
//       覆寫會導致 light mode 文字跟範圍底色同色變得難讀
.q-date {
  // 範圍中段日子的按鈕文字色 → 用 neutral-09 確保兩個主題都可讀
  // (light: 近黑、dark: 近白；蓋掉 Quasar 預設 text-primary 在 range 中段疊範圍底色不清楚的問題)
  .q-date__range .q-btn,
  .q-date__edit-range .q-btn {
    color: var(--neutral-09) !important;
  }

  // q-date popup 容器與內部元件配色（用主題變數自動切換 light/dark）
  background: var(--primary-07);
  color: var(--secondary-01);

  .q-date__header {
    background: var(--linear-gradient-primary-01);
    color: var(--text-01);
  }

  .q-date__calendar-item .q-btn {
    color: var(--secondary-01);
  }

  .q-date__today .q-btn {
    border-color: var(--primary-01);
  }

  .q-date__arrow {
    color: var(--secondary-01);
  }

  .q-date__view {
    color: var(--secondary-01);
  }

  // 底部 action 區（CLOSE 按鈕）— Quasar 預設套用 text-primary 為藍色，
  // 此處統一為 var(--primary-01)
  .q-date__actions .q-btn {
    color: var(--primary-01) !important;
  }

  @include light {
    // 已選日 / 範圍兩端 / 年月選單 active 項
    .bg-primary {
      background: var(--primary-01) !important;
    }

    // 「今天」外框
    .q-date__today {
      box-shadow: 0 0 1px 0 var(--primary-01) inset;
    }

    // 範圍 highlight 底色（淡 primary-01）
    .q-date__range::before,
    .q-date__edit-range::before,
    .q-date__range-from::before,
    .q-date__range-to::before {
      background-color: color-mix(in srgb, var(--primary-01) 22%, transparent) !important;
    }
  }

  @include dark {
    // dark 主題 primary-01 是黃色，白字在黃底看不清 → 強制改深色文字
    .bg-primary {
      background: var(--primary-01) !important;
      color: var(--neutral-100) !important;
    }

    .q-date__today {
      box-shadow: 0 0 1px 0 var(--primary-01) inset;
    }

    .q-date__range::before,
    .q-date__edit-range::before,
    .q-date__range-from::before,
    .q-date__range-to::before {
      background-color: color-mix(in srgb, var(--primary-01) 25%, transparent) !important;
    }
  }
}

.full-screen-container .title-container {
  background: var(--bg-headerbottom) !important;
  border-bottom-color: var(--bg-headerbottom) !important;
  box-shadow: 0px 0px 12px 0px var(--neutral-03) !important;

  .title,
  .btn-back .q-icon {
    color: var(--secondary-01) !important;
  }
}
</style>
