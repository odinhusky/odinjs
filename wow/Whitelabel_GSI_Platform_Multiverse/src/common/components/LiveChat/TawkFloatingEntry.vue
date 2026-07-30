<template>
  <!-- 透明 overlay：覆蓋「最大的可見 launcher」(greeting 在時為 greeting，否則 bubble)，
       負責拖曳 / 點擊開窗 / 關閉；唯一的 X 固定在此 overlay 右上角 -->
  <div
    v-show="visible"
    ref="overlayRef"
    class="tawk-entry"
    :style="overlayStyle"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @click="onClick"
  >
    <button
      type="button"
      class="tawk-entry__close"
      aria-label="close"
      @pointerdown.stop
      @click.stop="handleClose"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from "@vueuse/core"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useTawkWidget } from "src/common/hooks/useTawkWidget"
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue"

interface Props {
  /** 桌機距右邊距（px） */
  pcRight?: number
  /** 桌機距底邊距（px） */
  pcBottom?: number
  /** 手機距右邊距（px） */
  mobileRight?: number
  /** 手機距底邊距（px，需高於底部菜單並避開 AI icon） */
  mobileBottom?: number
  /** overlay z-index（需高於 tawk 根容器的 2e9，否則會被整個 tawk 堆疊蓋住） */
  zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  pcRight: 40,
  pcBottom: 24,
  mobileRight: 24,
  mobileBottom: 80,
  zIndex: 2147483647,
})

const { waitBubble, moveLaunchers, watchLaunchers, getPrimaryLauncher, toggle, hideWidget, isChatOpen } =
  useTawkWidget()
const { isMobile } = useMediaQuery()
const { width, height } = useWindowSize()

/** bubble 是否已辨識就緒 */
const bubbleReady = ref(false)
/** 使用者是否按 X 關閉（當次 session，重整復原） */
const userClosed = ref(false)
/** tawk 對話視窗是否開啟（DOM 偵測，tawk 不會觸發事件） */
const chatOpen = ref(false)
/** overlay 顯示條件：bubble 就緒、未被關閉、對話未開啟 */
const visible = computed(() => bubbleReady.value && !userClosed.value && !chatOpen.value)

/** X 鈕凸出 overlay 的安全邊距（避免拖到上緣/右緣時被切到） */
const PAD = 10

/** overlay 對齊「最大 launcher」的矩形（位置 + 尺寸） */
const rect = reactive({ x: 0, y: 0, w: 60, h: 60 })
const overlayStyle = computed(() => ({
  left: `${rect.x}px`,
  top: `${rect.y}px`,
  width: `${rect.w}px`,
  height: `${rect.h}px`,
  zIndex: props.zIndex,
}))

const overlayRef = ref<HTMLElement | null>(null)

// 累積拖曳位移（套在所有 launcher：natural + offset），bubble 自然位置用來換算預設位
let offsetX = 0
let offsetY = 0
let bubbleBaseX = 0
let bubbleBaseY = 0
let bubbleW = 60
let bubbleH = 60

/** 桌機連對話面板一起搬（讓對話視窗跟著 bubble）；手機只搬 launcher（面板全螢幕不動） */
const includePanel = () => !isMobile.value

/** 把目前位移套到入口（含桌機的對話面板） */
const applyOffset = () => moveLaunchers(offsetX, offsetY, includePanel())

/** overlay 跟著最大 launcher（greeting 在就覆蓋 greeting，否則 bubble） */
const syncOverlay = () => {
  const el = getPrimaryLauncher()
  if (!el) return
  const r = el.getBoundingClientRect()
  rect.x = Math.round(r.x)
  rect.y = Math.round(r.y)
  rect.w = Math.round(r.width)
  rect.h = Math.round(r.height)
}

/** 夾制：讓 overlay（最大 launcher）不超出可視範圍（含 X 凸出的 PAD），必要時回推 offset */
const clampToView = () => {
  const cx = Math.min(Math.max(0, rect.x), Math.max(0, width.value - rect.w - PAD))
  const cy = Math.min(Math.max(PAD, rect.y), Math.max(PAD, height.value - rect.h))
  if (cx !== rect.x || cy !== rect.y) {
    offsetX += cx - rect.x
    offsetY += cy - rect.y
    applyOffset()
    syncOverlay()
  }
}

// --- 手動拖曳（需求二）---
let dragging = false
let movedFlag = false
let startPointerX = 0
let startPointerY = 0
let startOffsetX = 0
let startOffsetY = 0

const onPointerDown = (e: PointerEvent) => {
  dragging = true
  movedFlag = false
  startPointerX = e.clientX
  startPointerY = e.clientY
  startOffsetX = offsetX
  startOffsetY = offsetY
  overlayRef.value?.setPointerCapture(e.pointerId)
}

const onPointerMove = (e: PointerEvent) => {
  if (!dragging) return
  const dx = e.clientX - startPointerX
  const dy = e.clientY - startPointerY
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) movedFlag = true
  offsetX = startOffsetX + dx
  offsetY = startOffsetY + dy
  applyOffset()
  syncOverlay()
  clampToView()
}

const onPointerUp = () => {
  dragging = false
}

const onClick = () => {
  // 拖曳後放開不視為點擊，避免拖完誤觸開窗
  if (movedFlag) {
    movedFlag = false
    return
  }
  toggle()
}

// 需求一：關閉 → 收起整個 tawk（bubble + greeting）+ 隱藏 overlay（當次 session，重整復原）
const handleClose = () => {
  hideWidget()
  userClosed.value = true
}

/** 手機要避開的懸浮圖標：CMS 圖標 `.float-wrapper` + 加了標記的 AI icon `[data-tawk-avoid]` */
const AVOID_SELECTOR = ".float-wrapper, [data-tawk-avoid]"
/** tawk 疊在懸浮圖標上方的間距（px） */
const STACK_GAP = 12

/** 取得要避開元素中「最高（top 最小）」的 top；都沒有則回 null */
const getAvoidTop = (): number | null => {
  let top: number | null = null
  document.querySelectorAll<HTMLElement>(AVOID_SELECTOR).forEach((el) => {
    const cs = getComputedStyle(el)
    if (cs.display === "none" || cs.visibility === "hidden") return
    const r = el.getBoundingClientRect()
    if (r.width <= 0 || r.height <= 0) return
    if (top === null || r.top < top) top = r.top
  })
  return top
}

// 需求四：依 RWD 設定入口預設位（手機右下偏上）；手機若有懸浮圖標，疊到最高那顆上方（避開 AI icon / CMS 圖標）
const applyDefaultPosition = () => {
  const right = isMobile.value ? props.mobileRight : props.pcRight
  const bottom = isMobile.value ? props.mobileBottom : props.pcBottom
  const targetX = Math.max(0, width.value - right - bubbleW)
  let targetY = Math.max(0, height.value - bottom - bubbleH)

  if (isMobile.value) {
    const avoidTop = getAvoidTop()
    if (avoidTop !== null) {
      // 疊到最高懸浮圖標上方：tawk 底部在圖標頂部之上 STACK_GAP
      targetY = Math.max(0, avoidTop - STACK_GAP - bubbleH)
    }
  }

  offsetX = targetX - bubbleBaseX
  offsetY = targetY - bubbleBaseY
  applyOffset()
  syncOverlay()
  clampToView()
}

let pollTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  waitBubble((el) => {
    const r = el.getBoundingClientRect()
    bubbleW = Math.round(r.width) || 60
    bubbleH = Math.round(r.height) || 60
    // bubble 未平移時的自然位置
    bubbleBaseX = Math.round(r.x)
    bubbleBaseY = Math.round(r.y)

    applyDefaultPosition()
    bubbleReady.value = true
    watchLaunchers(() => ({ dx: offsetX, dy: offsetY, includePanel: includePanel() }))

    // tawk 不觸發 onChatMaximized/Minimized，改用 DOM 輪詢 + MutationObserver：
    // 1) 持續維持 launcher 位置 + overlay 跟隨最大 launcher（greeting 重建/出現時即時對齊，需求1）
    // 2) 偵測對話開關 → 控制 overlay 顯示（避免 X 壓住聊天頁，需求2）
    pollTimer = setInterval(() => {
      chatOpen.value = isChatOpen()
      watchLaunchers(() => ({ dx: offsetX, dy: offsetY, includePanel: includePanel() }))
      if (!chatOpen.value && !dragging) syncOverlay()
    }, 250)
  })
})

onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<style scoped lang="scss">
.tawk-entry {
  position: fixed;
  cursor: grab;
  touch-action: none;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  &__close {
    position: absolute;
    top: -6px;
    right: -4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
  }
}
</style>
