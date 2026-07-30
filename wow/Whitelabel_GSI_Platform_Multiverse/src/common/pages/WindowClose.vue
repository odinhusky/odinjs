<template>
  <div></div>
</template>

<script setup lang="ts">
const CLOSE_EVENT_TYPE = "launch-game-dialog-close"

const closeEventPayload = {
  type: CLOSE_EVENT_TYPE
}

if (window.parent && window.parent !== window) {
  window.parent.postMessage(closeEventPayload, window.location.origin)
}

if (window.opener) {
  window.opener.postMessage(closeEventPayload, window.location.origin)
}

window.close()
</script>

<style scoped></style>
