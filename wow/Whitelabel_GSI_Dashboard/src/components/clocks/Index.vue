<template>
  <span
    class="flex flex-nowrap items-center gap-x-2 whitespace-nowrap text-xs leading-5 text-[#9E9E9E] tabular-nums font-['Roboto']"
  >
    <span class="text-left">{{ formattedDateTime }}</span>
    <span>{{ utcAppendString }}</span>
  </span>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, computed, watch } from "vue"
  import { useTimeZoneStore } from "@/stores/timezoneStore"
  import { useCommon } from "@/hook/useCommon"

  const { genTimeFormat } = useCommon()

  const timezoneStore = useTimeZoneStore()
  const formattedDateTime = ref("")

  const utcAppendString = computed(() => {
    if (timezoneStore.isClientTimezone) {
      return `(GMT` + timezoneStore.offsetFormatted + `)`
    }
    return `(GMT+0)`
  })

  function updateDateTime() {
    formattedDateTime.value = genTimeFormat(new Date(), "yyyy-MM-dd HH:mm:ss")!
  }

  watch(
    () => [timezoneStore.timeZone, timezoneStore.utcOffset],
    () => {
      updateDateTime()
    }
  )

  let timer: ReturnType<typeof setTimeout> | null = null

  const startTimer = () => {
    updateDateTime()
    const now = new Date()
    const delay = 1000 - now.getMilliseconds() + 10 // 校正到下一秒開頭
    timer = setTimeout(startTimer, delay)
  }

  onMounted(() => {
    startTimer()
  })

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })
</script>
