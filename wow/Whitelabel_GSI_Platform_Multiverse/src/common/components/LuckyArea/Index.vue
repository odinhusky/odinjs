<template>
  <div class="lucky-area">
    <!-- Loading Skeleton -->
    <LuckySkeletonLoader v-if="isLoading" />

    <!-- Actual iframes -->
    <div v-else class="iframe-stack">
      <iframe
        ref="iframeRef"
        title="Lucky sport"
        class="lucky-iframe"
        :src="widgetUrl"
        frameborder="0"
        allow="clipboard-write; encrypted-media; fullscreen"
        allowfullscreen
        referrerpolicy="no-referrer"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue"
import { useLuckyGame } from "src/common/hooks/useLuckyGame"
import { useAuth } from "src/common/hooks/useAuth"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import LuckySkeletonLoader from "src/common/components/LuckyArea/LuckySkeletonLoader.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLanguage } from "src/common/composables/useLanguage"

const { initLuckyGame, isLoading, widgetUrl } = useLuckyGame()
const { width, isMobile, isLargeTablet } = useMediaQuery()
const { registerActiveWalletChangeFunc, unregisterActiveWalletChangeFunc, activeWalletCurrencyCode } = useUserInfo()
const { registerLanguageChangeFunc, unregisterLanguageChangeFunc } = useLanguage()
const { isLogin } = useAuth()
const iframeRef = ref<HTMLIFrameElement | null>(null)

const reloadTimer = ref<NodeJS.Timeout | null>(null)

// 等待錢包資料更新的 flag
const isWaitingForWallet = ref(false)

// 錢包變更時的 function
const handleWalletChange = async () => {
  await initLuckyGame()
}

// 語系變更時的 function
const handleLanguageChange = async () => {
  initLuckyGame()
}

onMounted(async () => {
  try {
    await initLuckyGame()
  } catch (error) {
    console.log("Lucky 組件初始化失敗:", error)
  }
  registerActiveWalletChangeFunc(handleWalletChange)
  registerLanguageChangeFunc(handleLanguageChange)
})

onBeforeUnmount(() => {
  unregisterActiveWalletChangeFunc(handleWalletChange)
  unregisterLanguageChangeFunc(handleLanguageChange)

  reloadTimer.value && clearTimeout(reloadTimer.value)
})

watch(
  () => isLogin.value,
  async (newVal, oldVal) => {
    // 清除之前的 timer
    if (reloadTimer.value) {
      clearTimeout(reloadTimer.value)
      reloadTimer.value = null
    }

    await nextTick()

    // 如果登入時，需等待取得錢包資料
    if (newVal && !activeWalletCurrencyCode.value) {
      isWaitingForWallet.value = true

      // 使用 watch 等待 activeWalletCurrencyCode 有值
      const stopWatchWallet = watch(
        () => activeWalletCurrencyCode.value,
        async (walletCode) => {
          if (walletCode) {
            stopWatchWallet()
            // 清除計時器
            if (reloadTimer.value) {
              clearTimeout(reloadTimer.value)
              reloadTimer.value = null
            }
            await initLuckyGame()
            isWaitingForWallet.value = false
          }
        },
        { immediate: true }
      )

      // 設置 timeout 避免無限等待
      reloadTimer.value = setTimeout(() => {
        stopWatchWallet()
        isWaitingForWallet.value = false
        initLuckyGame()
      }, 5000)
    } else {
      // 未登入或已有錢包資料則直接執行
      await initLuckyGame()
    }
  }
)
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.lucky-area {
  @apply flex w-full h-full;

  @include pad-large-width {
    @apply px-0;
  }
}

.iframe-stack {
  @apply flex w-full h-full;

  .lucky-iframe {
    @apply w-full h-full;
  }
}
</style>
