<script setup lang="ts">
import { StatusBar, Style } from "@capacitor/status-bar"
import { Capacitor } from "@capacitor/core"
import { palette } from "@primevue/themes"

console.log("!! myPrimaryPalette", palette("#025be8"))

onMounted(async () => {
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
  <main class="app-container">
    <header :class="cx(FLEX_ITEMS_CENTER)">
      <nav class="mr-auto">
        <NuxtLink to="/"> Home </NuxtLink>
        <NuxtLink to="/about"> About </NuxtLink>
      </nav>

      <BaseLangSwitcher />
    </header>
    <nuxt-page />
  </main>
</template>

<style scoped lang="css">
header {
  line-height: 1.5;
  max-width: 100vw;
}

nav > a {
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 768px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
    margin-left: auto;
    margin-right: auto;
    max-width: 768px;
  }

  nav {
    text-align: left;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

.app-container {
  /* 自動偵測手機狀態列高度並留出內距 */
  padding-top: env(safe-area-inset-top);

  /* 如果有底部導航列，也可以避開手機底部的虛擬按鍵區域 */
  padding-bottom: env(safe-area-inset-bottom);

  min-height: 100vh;
}
</style>
