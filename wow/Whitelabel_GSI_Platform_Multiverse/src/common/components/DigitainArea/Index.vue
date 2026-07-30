<template>
  <div class="digitain-area">
    <!-- Loading Skeleton -->
    <DigitainSkeletonLoader v-if="isLoading && !widgetUrl" />

    <!-- Actual content -->
    <div v-show="!isLoading || widgetUrl" class="iframe-stack">
      <!-- 前端 JS 串接的版本 (Asian View) -->
      <div id="digitain-container" class="digitain-iframe"></div>

      <!-- 使用 iframe 開啟 URL 的版本 (Fallback) -->
      <iframe
        v-if="widgetUrl && !useAsianView"
        ref="iframeRef"
        id="digitain-sportsbook"
        class="digitain-iframe"
        :src="widgetUrl"
        frameborder="0"
        allow="clipboard-write; encrypted-media; fullscreen"
        allowfullscreen
        referrerpolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue"
import { useDigitainGame } from "src/common/hooks/useDigitainGame"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import DigitainSkeletonLoader from "src/common/components/DigitainArea/DigitainSkeletonLoader.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLanguage } from "src/common/composables/useLanguage"

const { initDigitainGame, isLoading, widgetUrl, initializeDigitainRenderer, cleanupDigitainRenderer } =
  useDigitainGame()
const { width, isMobile, isLargeTablet } = useMediaQuery()
const { registerActiveWalletChangeFunc, unregisterActiveWalletChangeFunc } = useUserInfo()
const { registerLanguageChangeFunc, unregisterLanguageChangeFunc, nowLang } = useLanguage()

const iframeRef = ref<HTMLIFrameElement | null>(null)

// 是否使用 Asian View 模式（如果 URL 中有 token 和 sportPartner 則使用）
const useAsianView = computed(() => {
  if (!widgetUrl.value) return false
  try {
    const url = new URL(widgetUrl.value)
    return !!(url.searchParams.get("token") && url.searchParams.get("sportPartner"))
  } catch {
    return false
  }
})

// 錢包變更時的 function
const handleWalletChange = async () => {
  await initDigitainGame()
}

// 語系變更時的 function
const handleLanguageChange = async () => {
  initializeDigitainRenderer()
}

onMounted(async () => {
  try {
    await initDigitainGame()
    registerActiveWalletChangeFunc(handleWalletChange)
    registerLanguageChangeFunc(handleLanguageChange)
  } catch (error) {
    console.log("Digitain 組件初始化失敗:", error)
  }
})

onBeforeUnmount(() => {
  unregisterActiveWalletChangeFunc(handleWalletChange)
  unregisterLanguageChangeFunc(handleLanguageChange)
  cleanupDigitainRenderer()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.digitain-area {
  @apply flex w-full h-full;

  @include pad-large-width {
    @apply px-0;
  }
}

.iframe-stack {
  @apply flex w-full h-full;

  .digitain-iframe {
    @apply w-full h-full;
    min-height: 900px;
  }
}
</style>
