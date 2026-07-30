<template>
  <div v-if="enabled" class="debug-panel" :class="{ open }">
    <button class="debug-toggle" @click="open = !open">
      {{ open ? "×" : "DBG" }}
    </button>
    <div v-if="open" class="debug-body">
      <div class="debug-header">
        <strong>Device Debug</strong>
        <button class="debug-copy" @click="copy">{{ copied ? "Copied" : "Copy" }}</button>
      </div>
      <pre class="debug-pre">{{ infoText }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

const ALLOWED_HOSTS = ["demo1.playsoft88.com"]
// 每次修改此檔請更新 PANEL_VERSION 字串，部署後可從回傳資料確認版本是否正確更新
const PANEL_VERSION = "202605290900-paint-longtask"
const enabled = ref(false)
const open = ref(false)
const copied = ref(false)

interface DebugInfo {
  panelVersion: string
  url: string
  collectedAt: string
  userAgent: string
  platform: string
  language: string
  languages: readonly string[]
  vendor: string
  isMobile: boolean
  isIOS: boolean
  isAndroid: boolean
  touchPoints: number
  cookieEnabled: boolean
  online: boolean
  screen: {
    width: number
    height: number
    availWidth: number
    availHeight: number
    devicePixelRatio: number
    orientation: string
    colorDepth: number
  }
  viewport: {
    innerWidth: number
    innerHeight: number
    visualViewport?: { width: number; height: number; scale: number }
  }
  connection: {
    effectiveType?: string
    downlink?: number
    rtt?: number
    saveData?: boolean
    type?: string
  } | null
  hardware: {
    deviceMemoryGB?: number
    hardwareConcurrency?: number
  }
  performanceMemory: {
    jsHeapSizeLimitMB?: number
    totalJSHeapSizeMB?: number
    usedJSHeapSizeMB?: number
  } | null
  prefers: {
    reducedMotion: boolean
    colorScheme: "dark" | "light"
  }
  pageTiming: {
    domContentLoadedMs?: number
    loadEventEndMs?: number
    firstPaintMs?: number
    firstContentfulPaintMs?: number
  }
  popupOpenSamplesMs: number[]
  popupPaintSamplesMs: number[]
  popupImgLoadSamplesMs: number[]
  popupDebug: {
    pointerEvents: number
    detectedMethod: string[]
    lastTriggerSelector: string | null
    lastMenuImgCount: number | null
  }
  longTasksMs: number[]
  errors: string[]
}

const info = ref<DebugInfo | null>(null)
const errors = ref<string[]>([])
const popupSamples = ref<number[]>([])
const popupPaintSamples = ref<number[]>([])
const popupImgLoadSamples = ref<number[]>([])
const detectedMethod = ref<string[]>([])
const pointerEventCount = ref(0)
const lastTriggerSelector = ref<string | null>(null)
const lastMenuImgCount = ref<number | null>(null)
const longTasks = ref<number[]>([])

const infoText = computed(() => JSON.stringify(info.value, null, 2))

function detectMobile(ua: string) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
}

function getPaintTiming(name: string): number | undefined {
  try {
    const entries = performance.getEntriesByType("paint") as PerformanceEntry[]
    return entries.find((e) => e.name === name)?.startTime
  } catch {
    return undefined
  }
}

function getNavTiming(): { dcl?: number; load?: number } {
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
    if (!nav) return {}
    return {
      dcl: nav.domContentLoadedEventEnd - nav.startTime,
      load: nav.loadEventEnd - nav.startTime
    }
  } catch {
    return {}
  }
}

function collect(): DebugInfo {
  const ua = navigator.userAgent
  const conn =
    (navigator as unknown as { connection?: Record<string, unknown> }).connection ||
    (navigator as unknown as { webkitConnection?: Record<string, unknown> }).webkitConnection ||
    null
  const perfMem = (performance as unknown as { memory?: Record<string, number> }).memory
  const nav = getNavTiming()
  const vv = (window as unknown as { visualViewport?: VisualViewport }).visualViewport

  return {
    panelVersion: PANEL_VERSION,
    url: location.href,
    collectedAt: new Date().toISOString(),
    userAgent: ua,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages,
    vendor: navigator.vendor,
    isMobile: detectMobile(ua),
    isIOS: /iPhone|iPad|iPod/i.test(ua),
    isAndroid: /Android/i.test(ua),
    touchPoints: navigator.maxTouchPoints,
    cookieEnabled: navigator.cookieEnabled,
    online: navigator.onLine,
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      devicePixelRatio: window.devicePixelRatio,
      orientation: screen.orientation?.type ?? "unknown",
      colorDepth: screen.colorDepth
    },
    viewport: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      visualViewport: vv
        ? { width: vv.width, height: vv.height, scale: vv.scale }
        : undefined
    },
    connection: conn
      ? {
          effectiveType: conn.effectiveType as string | undefined,
          downlink: conn.downlink as number | undefined,
          rtt: conn.rtt as number | undefined,
          saveData: conn.saveData as boolean | undefined,
          type: conn.type as string | undefined
        }
      : null,
    hardware: {
      deviceMemoryGB: (navigator as unknown as { deviceMemory?: number }).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency
    },
    performanceMemory: perfMem
      ? {
          jsHeapSizeLimitMB: Math.round(perfMem.jsHeapSizeLimit / 1048576),
          totalJSHeapSizeMB: Math.round(perfMem.totalJSHeapSize / 1048576),
          usedJSHeapSizeMB: Math.round(perfMem.usedJSHeapSize / 1048576)
        }
      : null,
    prefers: {
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    },
    pageTiming: {
      domContentLoadedMs: nav.dcl,
      loadEventEndMs: nav.load,
      firstPaintMs: getPaintTiming("first-paint"),
      firstContentfulPaintMs: getPaintTiming("first-contentful-paint")
    },
    popupOpenSamplesMs: popupSamples.value.slice(),
    popupPaintSamplesMs: popupPaintSamples.value.slice(),
    popupImgLoadSamplesMs: popupImgLoadSamples.value.slice(),
    popupDebug: {
      pointerEvents: pointerEventCount.value,
      detectedMethod: detectedMethod.value.slice(),
      lastTriggerSelector: lastTriggerSelector.value,
      lastMenuImgCount: lastMenuImgCount.value
    },
    longTasksMs: longTasks.value.slice(),
    errors: errors.value.slice()
  }
}

function refresh() {
  info.value = collect()
}

function onError(ev: ErrorEvent) {
  errors.value.push(`[${new Date().toISOString()}] ${ev.message} @ ${ev.filename}:${ev.lineno}`)
  if (errors.value.length > 30) errors.value.splice(0, errors.value.length - 30)
  refresh()
}

function onRejection(ev: PromiseRejectionEvent) {
  errors.value.push(`[${new Date().toISOString()}] unhandledrejection: ${String(ev.reason)}`)
  if (errors.value.length > 30) errors.value.splice(0, errors.value.length - 30)
  refresh()
}

// 量測 q-select / 任何 popup 從 pointer 事件到 popup 顯示的時間
// 策略：多事件來源 + childList/attributes 雙監聽 + rAF polling 兜底
const TRIGGER_SELECTOR = ".q-select, .q-field, .custom-select, [role='combobox']"
const MENU_SELECTOR = ".q-menu, [role='listbox'], .q-virtual-scroll"

let pendingOpenAt: number | null = null
let pollHandle: number | null = null
let pollDeadline = 0

function isMenuVisible(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false
  const style = getComputedStyle(el)
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false
  const rect = el.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}

function pushSample(arr: number[], v: number, cap = 10) {
  arr.push(v)
  if (arr.length > cap) arr.shift()
}

function measurePaintAndImages(menu: Element, openedAt: number) {
  // (1) 第一個 paint frame：popup mount 後下一個 rAF callback 約等同於下一次螢幕更新
  requestAnimationFrame(() => {
    const paintMs = Math.round(performance.now() - openedAt)
    pushSample(popupPaintSamples.value, paintMs)
    refresh()
  })

  // (2) popup 內所有 <img> 都完成載入的時間
  const imgs = Array.from(menu.querySelectorAll("img"))
  lastMenuImgCount.value = imgs.length
  if (imgs.length === 0) return

  let remaining = imgs.length
  let done = false
  const onAllDone = () => {
    if (done) return
    done = true
    const loadMs = Math.round(performance.now() - openedAt)
    pushSample(popupImgLoadSamples.value, loadMs)
    refresh()
  }
  imgs.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      if (--remaining === 0) onAllDone()
      return
    }
    const settle = () => {
      img.removeEventListener("load", settle)
      img.removeEventListener("error", settle)
      if (--remaining === 0) onAllDone()
    }
    img.addEventListener("load", settle)
    img.addEventListener("error", settle)
  })
  // 兜底：3 秒沒全載完就以當下為準
  setTimeout(() => {
    if (!done) onAllDone()
  }, 3000)
}

function tryRegisterOpen(method: string, menu?: Element) {
  if (pendingOpenAt == null) return false
  const openedAt = pendingOpenAt
  const delta = Math.round(performance.now() - openedAt)
  pushSample(popupSamples.value, delta)
  if (!detectedMethod.value.includes(method)) detectedMethod.value.push(method)
  pendingOpenAt = null
  stopPolling()
  if (menu) measurePaintAndImages(menu, openedAt)
  refresh()
  return true
}

function pollOnce() {
  if (pendingOpenAt == null) return
  const menus = document.querySelectorAll(MENU_SELECTOR)
  for (const el of Array.from(menus)) {
    if (isMenuVisible(el)) {
      if (tryRegisterOpen("polling", el)) return
    }
  }
  if (performance.now() > pollDeadline) {
    stopPolling()
    return
  }
  pollHandle = requestAnimationFrame(pollOnce)
}

function startPolling() {
  stopPolling()
  pollDeadline = performance.now() + 3000
  pollHandle = requestAnimationFrame(pollOnce)
}

function stopPolling() {
  if (pollHandle != null) {
    cancelAnimationFrame(pollHandle)
    pollHandle = null
  }
}

function describeTarget(el: Element): string {
  const tag = el.tagName.toLowerCase()
  const cls =
    typeof el.className === "string"
      ? el.className.split(/\s+/).slice(0, 3).join(".")
      : ""
  return cls ? `${tag}.${cls}` : tag
}

function onUserPointer(ev: Event) {
  const target = ev.target as HTMLElement | null
  if (!target) return
  const trigger = target.closest(TRIGGER_SELECTOR) as HTMLElement | null
  if (trigger) {
    pendingOpenAt = performance.now()
    pointerEventCount.value++
    lastTriggerSelector.value = describeTarget(trigger)
    startPolling()
    refresh()
  }
  // 不要 else reset — 避免 Quasar 內部 pointer 事件清掉計時器
}

let menuObserver: MutationObserver | null = null
function startMenuObserver() {
  menuObserver = new MutationObserver((mutations) => {
    if (pendingOpenAt == null) return
    for (const m of mutations) {
      if (m.type === "childList") {
        for (const node of Array.from(m.addedNodes)) {
          if (!(node instanceof Element)) continue
          const menu = node.matches?.(MENU_SELECTOR)
            ? node
            : (node.querySelector?.(MENU_SELECTOR) as Element | null)
          if (menu && isMenuVisible(menu)) {
            if (tryRegisterOpen("childList", menu)) return
          }
        }
      }
      if (m.type === "attributes" && m.target instanceof Element) {
        const el = m.target
        if (el.matches?.(MENU_SELECTOR) && isMenuVisible(el)) {
          if (tryRegisterOpen("attributes", el)) return
        }
      }
    }
  })
  menuObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style", "aria-hidden"]
  })
}

async function copy() {
  try {
    await navigator.clipboard.writeText(infoText.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    /* ignore */
  }
}

let resizeHandler: (() => void) | null = null
let longTaskObserver: PerformanceObserver | null = null

function startLongTaskObserver() {
  // longtask 是主執行緒被卡 ≥50ms 的事件；iOS Safari (>= 16.4) 與 Chromium 支援
  try {
    longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        pushSample(longTasks.value, Math.round(entry.duration), 20)
      }
      refresh()
    })
    longTaskObserver.observe({ type: "longtask", buffered: true })
  } catch {
    /* 瀏覽器不支援就略過 */
  }
}

onMounted(() => {
  enabled.value = ALLOWED_HOSTS.includes(location.hostname)
  if (!enabled.value) return
  refresh()
  resizeHandler = () => refresh()
  window.addEventListener("resize", resizeHandler)
  window.addEventListener("orientationchange", resizeHandler)
  window.addEventListener("error", onError)
  window.addEventListener("unhandledrejection", onRejection)
  document.addEventListener("pointerdown", onUserPointer, true)
  document.addEventListener("touchstart", onUserPointer, { capture: true, passive: true })
  document.addEventListener("mousedown", onUserPointer, true)
  document.addEventListener("click", onUserPointer, true)
  startMenuObserver()
  startLongTaskObserver()
})

onBeforeUnmount(() => {
  if (!enabled.value) return
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler)
    window.removeEventListener("orientationchange", resizeHandler)
  }
  window.removeEventListener("error", onError)
  window.removeEventListener("unhandledrejection", onRejection)
  document.removeEventListener("pointerdown", onUserPointer, true)
  document.removeEventListener("touchstart", onUserPointer, true)
  document.removeEventListener("mousedown", onUserPointer, true)
  document.removeEventListener("click", onUserPointer, true)
  menuObserver?.disconnect()
  longTaskObserver?.disconnect()
  stopPolling()
})
</script>

<style scoped lang="scss">
.debug-panel {
  position: fixed;
  right: 8px;
  bottom: 8px;
  z-index: 99999;
  font-family: ui-monospace, Menlo, Consolas, monospace;
}
.debug-toggle {
  background: #ff3b30;
  color: #fff;
  border: none;
  border-radius: 999px;
  width: 44px;
  height: 44px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}
.debug-body {
  position: absolute;
  right: 0;
  bottom: 52px;
  width: min(92vw, 420px);
  max-height: 70vh;
  background: rgba(0, 0, 0, 0.88);
  color: #f1f1f1;
  border-radius: 8px;
  padding: 8px;
  overflow: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
}
.debug-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
}
.debug-copy {
  background: #1d125d;
  color: #fff;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
  cursor: pointer;
}
.debug-pre {
  margin: 0;
  font-size: 11px;
  line-height: 1.35;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
