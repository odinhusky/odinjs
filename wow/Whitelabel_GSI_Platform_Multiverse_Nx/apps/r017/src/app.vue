<script setup lang="ts">
import { StatusBar, Style } from "@capacitor/status-bar"
import { Capacitor } from "@capacitor/core"

const { refetch: refetchSetting } = useSetting({
  options: {
    enabled: false
  }
})

onMounted(async () => {
  // 每次都重新初始化設定
  await refetchSetting()

  // 確保只在手機原生環境執行
  if (Capacitor.isNativePlatform()) {
    // 1. 設定背景顏色 (例如設定為白色)
    await StatusBar.setBackgroundColor({ color: "#ffffff" })

    // 2. 設定文字風格 (Style.Light 會讓文字變黑色，適合淺色背景)
    await StatusBar.setStyle({ style: Style.Light })
  }
})
</script>

<template>
  <Toast position="top-right" />
  <ToastQueueBridge />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped lang="css">
.app-container {
  /* 自動偵測手機狀態列高度並留出內距 */
  padding-top: env(safe-area-inset-top);

  /* 如果有底部導航列，也可以避開手機底部的虛擬按鍵區域 */
  padding-bottom: env(safe-area-inset-bottom);

  min-height: 100vh;
}
</style>
