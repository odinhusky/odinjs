<script setup lang="ts">
import { useToast } from "primevue/usetoast"

const toast = useToast()
const { queue } = useToastQueue()

const flushQueue = () => {
  if (!queue.value.length) return

  const pendingOrder = queue.value.splice(0, queue.value.length)
  for (const message of pendingOrder) {
    toast.add(message)
  }
}

watch(
  () => queue.value.length,
  (length) => {
    if (!length) return
    flushQueue()
  },
  { immediate: true }
)
</script>

<template>
  <span hidden aria-hidden="true" />
</template>
