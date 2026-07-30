<template>
  <div class="fb-sports-area">
    <div v-if="showLoader" class="fb-sports-loader">
      <FBSportsSkeletonLoader />
    </div>

    <div v-if="widgetUrl" class="iframe-stack" :class="{ 'is-loading': !isIframeLoaded }">
      <iframe
        title="FB Sports"
        class="fb-sports-iframe"
        :src="widgetUrl"
        frameborder="0"
        allow="clipboard-write; encrypted-media; fullscreen"
        allowfullscreen
        referrerpolicy="no-referrer"
        @load="handleIframeLoad"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useFBSportsColor } from "src/common/hooks/useFBSportsColor"
import { useFBSportsGame } from "src/common/hooks/useFBSportsGame"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import {
  isFBSportsLoginMessage,
  resolveFBSportsChangeUrl,
  resolveFBSportsVersion,
} from "src/common/utils/fbSportsLaunch"
import { EventBusKey } from "src/symbols"
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"

import FBSportsSkeletonLoader from "./FBSportsSkeletonLoader.vue"

const { initFBSportsGame, isLoading, widgetUrl } = useFBSportsGame()
const { isLogin } = useAuth()
const { isMobile, isLargeTablet } = useMediaQuery()
const { registerActiveWalletChangeFunc, unregisterActiveWalletChangeFunc, activeWalletCurrencyCode } = useUserInfo()
const { registerLanguageChangeFunc, unregisterLanguageChangeFunc } = useLanguage()
const { applyDefaultColor } = useFBSportsColor()
const eventbus = inject(EventBusKey)
const reloadTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const iframeLoadTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const isIframeLoaded = ref(false)
const useH5Platform = computed(() => isMobile.value || isLargeTablet.value)
const showLoader = computed(() => isLoading.value || (Boolean(widgetUrl.value) && !isIframeLoaded.value))

const iframeOrigin = computed(() => {
  if (!widgetUrl.value) return ""

  try {
    return new URL(widgetUrl.value).origin
  } catch (error) {
    return ""
  }
})

const reloadFBSports = async () => {
  try {
    if (iframeLoadTimer.value) {
      clearTimeout(iframeLoadTimer.value)
      iframeLoadTimer.value = null
    }
    isIframeLoaded.value = false
    await initFBSportsGame()
  } catch (error) {
    console.log("FB Sports 組件初始化失敗:", error)
  }
}

const handleWalletChange = async () => {
  await reloadFBSports()
}

const handleLanguageChange = async () => {
  await reloadFBSports()
}

const handleIframeLoad = () => {
  if (iframeLoadTimer.value) {
    clearTimeout(iframeLoadTimer.value)
  }

  iframeLoadTimer.value = setTimeout(() => {
    isIframeLoaded.value = true
    iframeLoadTimer.value = null
  }, 300)
}

const handleMessage = (event: MessageEvent) => {
  if (iframeOrigin.value && event.origin !== iframeOrigin.value) return

  const changeUrl = resolveFBSportsChangeUrl(event.data)
  if (changeUrl) {
    widgetUrl.value = applyDefaultColor(changeUrl)
  }

  const version = resolveFBSportsVersion(event.data)
  if (version) {
    localStorage.setItem("fbSportsVersion", version)
  }

  if (!isLogin.value && isFBSportsLoginMessage(event.data)) {
    eventbus?.emit("openLogin", true)
  }
}

onMounted(async () => {
  window.addEventListener("message", handleMessage)
  await reloadFBSports()
  registerActiveWalletChangeFunc(handleWalletChange)
  registerLanguageChangeFunc(handleLanguageChange)
})

onBeforeUnmount(() => {
  window.removeEventListener("message", handleMessage)
  unregisterActiveWalletChangeFunc(handleWalletChange)
  unregisterLanguageChangeFunc(handleLanguageChange)

  if (reloadTimer.value) {
    clearTimeout(reloadTimer.value)
  }

  if (iframeLoadTimer.value) {
    clearTimeout(iframeLoadTimer.value)
  }
})

watch(
  () => widgetUrl.value,
  () => {
    if (iframeLoadTimer.value) {
      clearTimeout(iframeLoadTimer.value)
      iframeLoadTimer.value = null
    }
    isIframeLoaded.value = false
  }
)

watch(
  () => isLogin.value,
  async (newVal) => {
    if (reloadTimer.value) {
      clearTimeout(reloadTimer.value)
      reloadTimer.value = null
    }

    await nextTick()

    if (newVal && !activeWalletCurrencyCode.value) {
      const stopWatchWallet = watch(
        () => activeWalletCurrencyCode.value,
        async (walletCode) => {
          if (!walletCode) return

          stopWatchWallet()
          if (reloadTimer.value) {
            clearTimeout(reloadTimer.value)
            reloadTimer.value = null
          }
          await reloadFBSports()
        },
        { immediate: true }
      )

      reloadTimer.value = setTimeout(() => {
        stopWatchWallet()
        reloadFBSports()
      }, 5000)
      return
    }

    await reloadFBSports()
  }
)

watch(
  () => useH5Platform.value,
  async () => {
    await reloadFBSports()
  }
)
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.fb-sports-area {
  @apply relative flex h-full w-full overflow-hidden;
  background: #001006;

  @include pad-large-width {
    @apply px-0;
  }
}

.fb-sports-loader {
  @apply absolute inset-0 z-[2] h-full w-full;
  background: #001006;
}

.iframe-stack {
  @apply flex h-full w-full;
  pointer-events: auto;

  &.is-loading {
    opacity: 0;
  }

  .fb-sports-iframe {
    @apply h-full w-full;
    pointer-events: auto;
    touch-action: manipulation;
  }
}
</style>
