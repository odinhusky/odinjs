<template>
  <div ref="htmlContainer" v-html="htmlContent"></div>
</template>

<script setup lang="ts">
import { watchEffect, computed } from "vue"
import { useRoute } from "vue-router"
import { useLiveChat } from "src/common/hooks/useLiveChat"

interface LiveChatProps {
  isRWD?: boolean
}

const props = withDefaults(defineProps<LiveChatProps>(), {
  isRWD: false
})

// 直接傳入 isRWD 參數
const { htmlContent, htmlContainer, enableConfig, injectHtml, showLivechat, hideLivechat } = useLiveChat(
  undefined,
  props.isRWD
)
const route = useRoute()

watchEffect(() => {
  if (enableConfig.value) {
    injectHtml()

    console.log(route.meta.hideLiveChat)
    if (route.meta.hideLiveChat) {
      hideLivechat()
    } else {
      showLivechat()
    }
  }
})
</script>
