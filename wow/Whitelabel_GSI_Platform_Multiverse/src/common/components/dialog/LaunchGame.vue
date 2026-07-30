<template>
  <div class="q-pa-md q-gutter-sm" v-if="launchGameDialog.show">
    <q-dialog
      v-model="launchGameDialog.show"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      class="z-[9400]"
    >
      <q-card class="bg-dark text-white">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" @click="() => launchGameDialog.closeDialog()">
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <iframe
          v-if="launchGameDialog.gameUrl"
          :src="launchGameDialog.gameUrl"
          class="gameIframe"
          @load="handleIframeLoad"
        ></iframe>
        <iframe
          v-if="launchGameDialog.gameContent"
          ref="iframe"
          frameborder="0"
          class="gameIframe"
          @load="handleIframeLoad"
        ></iframe>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useGame } from "src/common/composables/useGame"
import { onMounted, onUnmounted, ref, watchEffect } from "vue"

const { launchGameDialog } = useGame()
const CLOSE_EVENT_TYPE = "launch-game-dialog-close"

const iframe = ref<HTMLIFrameElement | null>(null)

function closeLaunchGameDialog() {
  if (launchGameDialog.show) {
    launchGameDialog.closeDialog()
  }
}

function handleIframeLoad(event: Event) {
  const target = event.target as HTMLIFrameElement | null

  // 外部金流頁面多為跨網域，只有導回同網域 /windowClose 才能讀取 pathname
  try {
    const pathname = target?.contentWindow?.location?.pathname
    if (pathname === "/windowClose") {
      closeLaunchGameDialog()
    }
  } catch (error) {
    // 忽略跨網域存取限制錯誤
  }
}

function handleCloseMessage(event: MessageEvent) {
  if (event.origin !== window.location.origin) return
  if (event.data?.type !== CLOSE_EVENT_TYPE) return

  closeLaunchGameDialog()
}

watchEffect(() => {
  if (launchGameDialog.gameContent && iframe.value) {
    iframe.value.contentDocument?.open()
    iframe.value.contentDocument?.write(launchGameDialog.gameContent)
    iframe.value.contentDocument?.close()
  }
})

onMounted(() => {
  window.addEventListener("message", handleCloseMessage)
})

onUnmounted(() => {
  window.removeEventListener("message", handleCloseMessage)
})
</script>

<style lang="scss" scoped>
.gameIframe {
  width: 100%;
  height: calc(100% - 32px);
}
</style>
