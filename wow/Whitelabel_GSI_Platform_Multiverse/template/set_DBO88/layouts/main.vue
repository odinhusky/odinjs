<template>
  <main class="app-layout" v-if="isReady">
    <q-layout :class="['dbo88-route', { 'dbo88-home-route': isHomeRoute }]">
      <HeaderArea @toggle-drawer="toggleDrawer" />

      <q-drawer :width="232" show-if-above v-model="drawer" side="left" class="drawer-wrapper">
        <SideMenu />
      </q-drawer>

      <q-page-container :class="['dbo88-route', { 'dbo88-home-route': isHomeRoute }]">
        <div class="route-content">
          <router-view />
        </div>
        <FooterArea class="footer-anchor" />
      </q-page-container>

      <FloatIconCMS />
    </q-layout>
    <GS1MiniGamße />
  </main>
  <LoginModal />
  <BankDetailsModal />
  <H5BottomMenu v-if="width <= 1000" />
  <CurrencySupportDialog />
  <LaunchGameDialog />
  <CryptoWalletDialog />
  <div ref="htmlContainer" v-html="htmlContent"></div>
</template>

<script setup lang="ts">
import { useWindowSize } from "@vueuse/core"
import FloatIconCMS from "app/template/set_DBO88/components/FloatIconCMS/Index.vue"
import FooterArea from "app/template/set_DBO88/components/Footer/Index.vue"
import H5BottomMenu from "app/template/set_DBO88/components/H5BottomMenu/index.vue"
import HeaderArea from "app/template/set_DBO88/components/Header/Index.vue"
import LoginModal from "app/template/set_DBO88/components/Modal/LoginWithRegister.vue"
import SideMenu from "app/template/set_DBO88/components/SideMenu/Index.vue"
import { useSiteRedirect } from "app/template/set_DBO88/composables/useSiteRedirect"
import BankDetailsModal from "app/template/set_DBO88/pages/BankDetails/Index.vue"
import CryptoWalletDialog from "src/common/components/dialog/CryptoWalletDialog.vue"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import { useGame } from "src/common/composables/useGame"
import { useInit } from "src/common/composables/useInit"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useEnv } from "src/common/hooks/useEnv"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from "vue"
import { useRoute } from "vue-router"

const { width } = useWindowSize()
const drawer = ref(false)
const route = useRoute()
const isHomeRoute = computed(() => route.name === "Home")

const toggleDrawer = () => { drawer.value = !drawer.value }

const { isReady, initialize } = useInit()
const { visitWebsite } = useEnv()
const { getAgentSetting } = useLanguage()
const { handleLogoList } = useLogo()
const { initGameTypeList } = useGame()
const { handleSiteRedirect } = useSiteRedirect()
const { useBasicInfoQuery, getUserWalletList } = useUserInfo()
useBasicInfoQuery()
const { htmlContent, htmlContainer, enableConfig, injectHtml } = useLiveChat()
const { handleGetPixelCodes } = usePixelCodes()

const toggleDbo88RouteClass = (enabled: boolean) => {
  const method = enabled ? "add" : "remove"

  document.documentElement.classList[method]("dbo88-route")
  document.body.classList[method]("dbo88-route")
  document.getElementById("q-app")?.classList[method]("dbo88-route")
}

const toggleHomeRouteClass = (enabled: boolean) => {
  const method = enabled ? "add" : "remove"

  document.documentElement.classList[method]("dbo88-home-route")
  document.body.classList[method]("dbo88-home-route")
  document.getElementById("q-app")?.classList[method]("dbo88-home-route")
}

const findWidgetElement = () => {
  const widgetElement = document.querySelector(".widget-visible")
  if (widgetElement) {
    console.log("找到 widget-visible 元件:", widgetElement)
    // widgetElement.style.cssText += "transform: translateY(-60px) !important;"

    return widgetElement
  }
  return null
}

watchEffect(async () => {
  if (enableConfig.value) {
    await injectHtml()
    window.Tawk_API.onLoad = function () {
      console.log(findWidgetElement().style.cssText)
      findWidgetElement().style.cssText = "transform: translateY(-60px) !important;"
    }
    window.Tawk_API.onChatMaximized = function () {
      console.log(findWidgetElement().style.cssText)
      findWidgetElement().style.cssText = ""
      console.log(findWidgetElement().style.cssText)
    }
    window.Tawk_API.onChatMinimized = function () {
      console.log(findWidgetElement().style.cssText)
      findWidgetElement().style.cssText = "transform: translateY(-60px) !important;"
      console.log(findWidgetElement().style.cssText)
    }
    const observer = new MutationObserver((_mutations) => {
      const widget = findWidgetElement()
      if (widget) {
        console.log("widget-visible 元件已載入並設定樣式")
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true })
  }
})

onMounted(() => {
  toggleDbo88RouteClass(true)
  toggleHomeRouteClass(isHomeRoute.value)

  initialize({
    task: [
      visitWebsite,

      getAgentSetting,
      handleLogoList,
      initGameTypeList,
      getUserWalletList,
      handleGetPixelCodes,
    ],
    siteRedirect: handleSiteRedirect })
})

watch(
  isHomeRoute,
  (enabled) => { toggleHomeRouteClass(enabled) },
  { immediate: true }
)

onUnmounted(() => {
  toggleDbo88RouteClass(false)
  toggleHomeRouteClass(false)
})
</script>

<style>
@import "app/template/set_DBO88/assets/css/scrollbar.css";
@import "app/template/set_DBO88/assets/css/font.css";

html.dbo88-route,
body.dbo88-route,
#q-app.dbo88-route,
.q-layout.dbo88-route,
.q-page-container.dbo88-route,
.dbo88-route .q-page {
  /* min-height: 100% !important; */
  height: 100% !important;
}

html.dbo88-home-route,
body.dbo88-home-route,
#q-app.dbo88-home-route,
.q-layout.dbo88-home-route,
.q-page-container.dbo88-home-route,
.dbo88-home-route .q-page {
  /* min-height: 100% !important; */
  height: 100% !important;
}

html,
body,
#q-app,
.q-layout,
.q-page-container,
.q-page { overflow: unset; }
</style>

<style scoped lang="scss">
@import "app/template/set_DBO88/assets/css/_variable.scss";

.app-layout {
  min-height: 100%;
  height: 100%;
  font-family: "Montserrat", sans-serif;
  background: #191b1e;

  .q-layout {
    min-height: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .drawer-wrapper {
    :deep(q-drawer) { @apply w-[14.5rem]; }
  }

  .q-page-container {
    flex: 1 0 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding-top: 1.5rem !important;
    height: calc(100% - 64px);
    min-height: calc(100% - 64px);
  }

  .route-content {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;

    :deep(.q-page) { flex: 1 0 auto; }
  }

  .footer-anchor { margin-top: auto; }
}
</style>
