<template>
  <div class="outer-layout" :class="`${devicePlatform}`">
    <router-view />

    <!-- 全版通用：tawk 懸浮入口（自帶 gating，無 tawk 的站台不顯示） -->
    <TawkFloatingEntry />

    <component v-if="VueQueryDevtools" :is="VueQueryDevtools" />
    <DebugPanel />
  </div>
</template>

<script setup lang="ts">
import TawkFloatingEntry from "src/common/components/LiveChat/TawkFloatingEntry.vue"
import { useSessionIdleTimeout } from "src/common/composables/useSessionIdleTimeout"
import useSwipeLeft from "src/common/hooks/useSwipeLeft"
import DebugPanel from "src/common/components/DebugPanel/index.vue"
import { defineAsyncComponent, onMounted } from "vue"
import { getSite } from "src/api/site"

const VueQueryDevtools = import.meta.env.DEV
  ? defineAsyncComponent(() => import("@tanstack/vue-query-devtools").then((m) => m.VueQueryDevtools))
  : null

const devicePlatform = window.device?.platform || ""
useSwipeLeft(devicePlatform)
useSessionIdleTimeout()

onMounted(async () => {
  console.log("[Init URL]: ", window.location.href)
  try {
    const res = await getSite()
    if (res.data?.title) {
      document.title = res.data.title
    }
  } catch {
    // fallback: keep whatever title was set at build time
  }
})
</script>

<style lang="sass">
.outer-layout
  position: relative
</style>
