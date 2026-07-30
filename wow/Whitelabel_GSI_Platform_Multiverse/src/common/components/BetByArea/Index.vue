<template>
  <div class="betby-area">
    <!-- Loading Skeleton -->
    <BetBySkeletonLoader v-show="isLoading" />

    <!-- Actual iframes -->
    <div v-show="!isLoading" class="iframe-stack betby-renderer-stack">
      <!-- 前端 js 直接串接的版本 -->
      <div id="betby-sportsbook" class="betby-iframe"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue"
import { useBetByGame } from "src/common/hooks/useBetByGame"
import { useAuth } from "src/common/hooks/useAuth"
import BetBySkeletonLoader from "src/common/components/BetByArea/BetBySkeletonLoader.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useLanguage } from "src/common/composables/useLanguage"

// 站點客製 props；全部 optional，未傳時行為與原本完全相同
const props = defineProps<{
  /** 覆寫 BTRenderer betslipZIndex；未傳維持既有 default */
  betslipZIndex?: number
  /** 覆寫投注單登入行為；未傳維持既有 please-login notification */
  onLogin?: () => void
  /** 站點的投注單隱藏條件（如 sidebar 開啟時）；未傳維持既有行為 */
  hideBetslip?: boolean
}>()

const { initBetByGame, relaunchBetByGame, isLoading, cleanupBetByRenderer, isBetSlipOpen, setBetSlipHidden } =
  useBetByGame({
    betslipZIndex: () => props.betslipZIndex,
    onLogin: () => props.onLogin,
    hideMobileClosedBetslip: () => props.hideBetslip,
  })
const { registerActiveWalletChangeFunc, unregisterActiveWalletChangeFunc, activeWalletCurrencyCode } = useUserInfo()
const { registerLanguageChangeFunc, unregisterLanguageChangeFunc } = useLanguage()
const { isLogin } = useAuth()

const reloadTimer = ref<NodeJS.Timeout | null>(null)

// 等待錢包資料更新的 flag
const isWaitingForWallet = ref(false)

// 錢包變更時的 function
const handleWalletChange = async () => {
  // 如果正在等待取得錢包資料，跳過調用避免重複呼叫
  if (isWaitingForWallet.value) {
    console.log("正在等待取得錢包資料，跳過調用避免重複呼叫")
    return
  }
  await relaunchBetByGame()
}

// 語系變更時的 function
const handleLanguageChange = async () => {
  await relaunchBetByGame()
}

// 站點隱藏條件變化（如 sidebar 開關）時同步投注單可見性；未傳 prop 的站點不會觸發
watch(
  () => props.hideBetslip,
  (hidden) => {
    if (hidden === undefined) return
    setBetSlipHidden(hidden)
  }
)

// 隱藏條件成立期間投注單仍回報 open（init/relaunch race 或使用者嘗試開啟）時，立即重新隱藏
watch(
  () => isBetSlipOpen.value,
  (isOpen) => {
    if (isOpen && props.hideBetslip === true) {
      setBetSlipHidden(true)
    }
  }
)

onMounted(async () => {
  try {
    await initBetByGame()
  } catch (error) {
    console.log("BetBy 組件初始化失敗:", error)
  }
  registerActiveWalletChangeFunc(handleWalletChange)
  registerLanguageChangeFunc(handleLanguageChange)
})

onBeforeUnmount(() => {
  unregisterActiveWalletChangeFunc(handleWalletChange)
  unregisterLanguageChangeFunc(handleLanguageChange)
  cleanupBetByRenderer()

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
            await relaunchBetByGame()
            isWaitingForWallet.value = false
          }
        },
        { immediate: true }
      )

      // 設置 timeout 避免無限等待
      reloadTimer.value = setTimeout(() => {
        stopWatchWallet()
        isWaitingForWallet.value = false
        relaunchBetByGame()
      }, 5000)
    } else {
      // 未登入或已有錢包資料則直接執行
      await relaunchBetByGame()
    }
  }
)
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.betby-area {
  @apply flex w-full h-full;
}

.iframe-stack {
  @apply flex w-full h-full;

  .betby-iframe {
    @apply w-full h-full;
  }
}
</style>
