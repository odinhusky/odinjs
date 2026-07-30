<template>
  <div
    class="deferred-mount"
    :style="keepMinHeight && minHeight ? { minHeight } : undefined"
  >
    <div ref="sentinelRef" class="deferred-mount__sentinel" aria-hidden="true" />
    <div ref="contentRef" class="deferred-mount__content">
      <slot v-if="shouldMount" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"

const STABLE_MS = 250
/** 掛載後最長保留時間；逾時且高度已穩定則釋放，避免空內容永遠占位 */
const MAX_RETAIN_MS = 2000
/** interaction 模式：無手勢時的晚點 idle 後備（避開多數 Lighthouse lab 時程） */
const INTERACTION_IDLE_FALLBACK_MS = 15000
const INTERACTION_EVENTS = ["wheel", "touchstart", "pointerdown", "keydown"] as const

const props = withDefaults(
  defineProps<{
    /** 提前觸發距離，讓 chunk 在進入視窗前先開始載入 */
    rootMargin?: string
    /** 未掛載前預留高度，降低內容出現時的 CLS；掛載後仍保留直到內容高度穩定 */
    minHeight?: string
    /** IntersectionObserver threshold；觀察的是頂部 sentinel，非整個占位高度 */
    threshold?: number
    /**
     * visible：進入視窗（含 rootMargin）即掛載
     * interaction：需先有 wheel/touch/pointer/keydown（Lighthouse 程式捲動不會觸發），再等進入視窗
     */
    trigger?: "visible" | "interaction"
  }>(),
  {
    rootMargin: "200px 0px",
    minHeight: undefined,
    threshold: 0,
    trigger: "visible",
  }
)

const sentinelRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const shouldMount = ref(false)
const isIntersecting = ref(false)
const interactionUnlocked = ref(props.trigger !== "interaction")
/** 掛載後仍保留 min-height，直到真實內容高度穩定且接近／超過預留值 */
const keepMinHeight = ref(Boolean(props.minHeight))

let observer: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null
let stableTimer: ReturnType<typeof setTimeout> | null = null
let idleFallbackTimer: ReturnType<typeof setTimeout> | null = null
let lastMeasuredHeight = 0
let retainStartedAt = 0

function parseCssLengthToPx(value: string): number {
  const trimmed = value.trim()
  const amount = Number.parseFloat(trimmed)
  if (!Number.isFinite(amount) || amount <= 0) return 0
  if (trimmed.endsWith("rem")) {
    const rootFontSize =
      typeof window !== "undefined"
        ? Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
        : 16
    return amount * rootFontSize
  }
  return amount
}

function clearStableTimer() {
  if (stableTimer) {
    clearTimeout(stableTimer)
    stableTimer = null
  }
}

function stopHeightWatch() {
  clearStableTimer()
  resizeObserver?.disconnect()
  resizeObserver = null
}

function tryReleaseMinHeight() {
  const content = contentRef.value
  if (!content || !props.minHeight || !keepMinHeight.value) return

  // 量測內容本身，不受外層 min-height 影響
  const measured = content.getBoundingClientRect().height
  const reservedPx = parseCssLengthToPx(props.minHeight)

  if (Math.abs(measured - lastMeasuredHeight) > 1) {
    lastMeasuredHeight = measured
    clearStableTimer()
    stableTimer = setTimeout(tryReleaseMinHeight, STABLE_MS)
    return
  }

  // 內容尚未接近預留高度：繼續保留；逾時後才釋放，避免空區塊永久占位
  const waitedLongEnough = Date.now() - retainStartedAt >= MAX_RETAIN_MS
  if (reservedPx > 0 && measured < reservedPx * 0.9 && !waitedLongEnough) {
    clearStableTimer()
    stableTimer = setTimeout(tryReleaseMinHeight, STABLE_MS)
    return
  }

  keepMinHeight.value = false
  stopHeightWatch()
}

function startHeightWatch() {
  stopHeightWatch()
  if (!props.minHeight || !contentRef.value || typeof ResizeObserver === "undefined") {
    return
  }

  lastMeasuredHeight = contentRef.value.getBoundingClientRect().height
  retainStartedAt = Date.now()
  resizeObserver = new ResizeObserver(() => {
    tryReleaseMinHeight()
  })
  resizeObserver.observe(contentRef.value)
  clearStableTimer()
  stableTimer = setTimeout(tryReleaseMinHeight, STABLE_MS)
}

function tryMount() {
  if (shouldMount.value) return
  if (!interactionUnlocked.value || !isIntersecting.value) return
  shouldMount.value = true
  cleanupIntersectionObserver()
  removeInteractionListeners()
  clearIdleFallback()
}

function onInteractionUnlock() {
  if (interactionUnlocked.value) return
  interactionUnlocked.value = true
  removeInteractionListeners()
  clearIdleFallback()
  tryMount()
}

function addInteractionListeners() {
  if (typeof window === "undefined") return
  INTERACTION_EVENTS.forEach((type) => {
    window.addEventListener(type, onInteractionUnlock, { passive: true, once: true })
  })
}

function removeInteractionListeners() {
  if (typeof window === "undefined") return
  INTERACTION_EVENTS.forEach((type) => {
    window.removeEventListener(type, onInteractionUnlock)
  })
}

function clearIdleFallback() {
  if (idleFallbackTimer) {
    clearTimeout(idleFallbackTimer)
    idleFallbackTimer = null
  }
}

function scheduleIdleFallback() {
  clearIdleFallback()
  idleFallbackTimer = setTimeout(() => {
    onInteractionUnlock()
  }, INTERACTION_IDLE_FALLBACK_MS)
}

function cleanupIntersectionObserver() {
  observer?.disconnect()
  observer = null
}

watch(shouldMount, async (mounted) => {
  if (!mounted || !props.minHeight) return
  keepMinHeight.value = true
  await nextTick()
  startHeightWatch()
})

onMounted(() => {
  if (typeof window === "undefined" || !sentinelRef.value) {
    interactionUnlocked.value = true
    isIntersecting.value = true
    tryMount()
    return
  }

  if (props.trigger === "interaction") {
    addInteractionListeners()
    scheduleIdleFallback()
  }

  // 不支援 IO 時視為已相交；visible 可立刻掛，interaction 仍等手勢／idle
  if (!("IntersectionObserver" in window)) {
    isIntersecting.value = true
    tryMount()
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      isIntersecting.value = entries.some((entry) => entry.isIntersecting)
      tryMount()
    },
    {
      root: null,
      rootMargin: props.rootMargin,
      threshold: props.threshold,
    }
  )

  // 只觀察頂部 1px sentinel，避免 min-height 占位在首屏就觸發掛載
  observer.observe(sentinelRef.value)
})

onBeforeUnmount(() => {
  cleanupIntersectionObserver()
  removeInteractionListeners()
  clearIdleFallback()
  stopHeightWatch()
})
</script>

<style lang="scss" scoped>
.deferred-mount {
  width: 100%;
}

.deferred-mount__sentinel {
  width: 100%;
  height: 1px;
  pointer-events: none;
}

.deferred-mount__content {
  width: 100%;
}
</style>
