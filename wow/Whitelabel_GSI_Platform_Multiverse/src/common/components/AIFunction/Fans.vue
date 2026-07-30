<template>
  <div v-if="isAIFansShow" class="iframe-content" :class="{ active: isAIFansIframeShow }" ref="iframeContainer">
    <!-- 拖曳區 -->
    <div class="drag-header" @mousedown="startDragging" @touchstart="handleTouchStart"></div>

    <q-btn class="absolute top-2.5 right-2 text-white" flat rounded size="lg" @click="isAIFansIframeShow = false">
      X
    </q-btn>
    <iframe
      v-if="iframeUrl"
      :src="iframeUrl"
      ref="aiFansIframeRef"
      allow="camera; microphone"
      allowfullscreen
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
    ></iframe>

    <template v-if="!isDown.phone">
      <div
        v-for="dir in resizeDirections"
        :key="dir"
        class="resizer"
        :class="dir"
        @mousedown="(e) => startResizing(e, dir)"
        @touchstart="(e) => handleTouchStartResize(e, dir)"
      />
      <div v-show="isResizing || isDragging" class="resize-overlay"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from "vue"
import { useAIFansEvent } from "src/common/hooks/useAIFansEvent"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { getFansOrigin, getFansUrl } from "src/common/utils/aimateConfig"

const props = defineProps({
  account: {
    type: String,
    required: true,
    default: ""
  }
})

const { isDown } = useMediaQuery()
const { iframeOrigin, iframeUrl, isAIFansShow, isAIFansIframeShow, aiFansIframeRef } = useAIFansEvent()

watch(
  () => props.account,
  (newVal: string) => {
    iframeUrl.value = getFansUrl(newVal)
  }
)

const iframeContainer = ref<HTMLElement | null>(null)
const resizeDirections = ["top-left", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left"]

let startX = 0
let startY = 0
let startWidth = 0
let startHeight = 0
let startTop = 0
let startLeft = 0
let resizeDir = ""

const isResizing = ref(false)
const isDragging = ref(false)
let currentAction: "none" | "drag" | "resize" = "none"

// 統一的拖移開始處理（支援滑鼠和觸控）
const startDragging = (e: MouseEvent | TouchEvent) => {
  if (currentAction !== "none") return
  if (!iframeContainer.value) return

  e.preventDefault()
  isDragging.value = true
  currentAction = "drag" // 🔒 鎖定動作

  const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
  const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

  startX = clientX
  startY = clientY
  const rect = iframeContainer.value.getBoundingClientRect()
  startLeft = rect.left
  startTop = rect.top

  document.addEventListener("mousemove", onDrag)
  document.addEventListener("touchmove", onDragTouch, { passive: false })
  document.addEventListener("mouseup", stopAction)
  document.addEventListener("touchend", stopAction)
}

// 觸控開始處理（拖移）
const handleTouchStart = (e: TouchEvent) => {
  startDragging(e)
}

const onDrag = (e: MouseEvent) => {
  if (!iframeContainer.value || !isDragging.value) return

  const dx = e.clientX - startX
  const dy = e.clientY - startY

  updateDragPosition(dx, dy)
}

const onDragTouch = (e: TouchEvent) => {
  if (!iframeContainer.value || !isDragging.value) return
  e.preventDefault()

  const dx = e.touches[0].clientX - startX
  const dy = e.touches[0].clientY - startY

  updateDragPosition(dx, dy)
}

const updateDragPosition = (dx: number, dy: number) => {
  if (!iframeContainer.value) return

  const el = iframeContainer.value
  const rect = el.getBoundingClientRect()

  // 新位置
  let newLeft = startLeft + dx
  let newTop = startTop + dy

  // 瀏覽器可視範圍
  const maxLeft = window.innerWidth - rect.width
  const maxTop = window.innerHeight + 50 - rect.height

  // 邊界限制 👇
  newLeft = Math.max(0, Math.min(maxLeft, newLeft))
  newTop = Math.max(0, Math.min(maxTop, newTop))

  el.style.left = `${newLeft}px`
  el.style.top = `${newTop}px`
}

const startResizing = (e: MouseEvent | TouchEvent, dir: string) => {
  if (currentAction !== "none") return
  if (!iframeContainer.value) return

  e.preventDefault()
  e.stopPropagation()
  isResizing.value = true
  currentAction = "resize"
  resizeDir = dir

  const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
  const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

  const rect = iframeContainer.value.getBoundingClientRect()
  startX = clientX
  startY = clientY
  startWidth = rect.width
  startHeight = rect.height
  startTop = rect.top
  startLeft = rect.left

  document.addEventListener("mousemove", onResize)
  document.addEventListener("touchmove", onResizeTouch, { passive: false })
  document.addEventListener("mouseup", stopAction)
  document.addEventListener("touchend", stopAction)
}

// 觸控開始處理（縮放）
const handleTouchStartResize = (e: TouchEvent, dir: string) => {
  startResizing(e, dir)
}
const MIN_WIDTH = 350
const MIN_HEIGHT = 200

const onResize = (e: MouseEvent) => {
  if (!iframeContainer.value || !isResizing.value) return

  const dx = e.clientX - startX
  const dy = e.clientY - startY

  updateResizePosition(dx, dy)
}

const onResizeTouch = (e: TouchEvent) => {
  if (!iframeContainer.value || !isResizing.value) return
  e.preventDefault()

  const dx = e.touches[0].clientX - startX
  const dy = e.touches[0].clientY - startY

  updateResizePosition(dx, dy)
}

const updateResizePosition = (dx: number, dy: number) => {
  if (!iframeContainer.value) return

  const el = iframeContainer.value
  let newWidth = startWidth
  let newHeight = startHeight
  let newLeft = startLeft
  let newTop = startTop

  // --- 水平縮放 ---
  if (resizeDir.includes("right")) {
    newWidth = startWidth + dx
  } else if (resizeDir.includes("left")) {
    newWidth = startWidth - dx
    newLeft = startLeft + dx
  }

  // --- 垂直縮放 ---
  if (resizeDir.includes("bottom")) {
    newHeight = startHeight + dy
  } else if (resizeDir.includes("top")) {
    newHeight = startHeight - dy
    newTop = startTop + dy
  }

  // --- 限制範圍 ---
  const maxW = window.innerWidth / 2
  const maxH = window.innerHeight + 30

  // 限制寬
  if (newWidth < MIN_WIDTH) {
    if (resizeDir.includes("left")) newLeft += newWidth - MIN_WIDTH
    newWidth = MIN_WIDTH
  } else if (newWidth > maxW) {
    if (resizeDir.includes("left")) newLeft += newWidth - maxW
    newWidth = maxW
  }

  // 限制高
  if (newHeight < MIN_HEIGHT) {
    if (resizeDir.includes("top")) newTop += newHeight - MIN_HEIGHT
    newHeight = MIN_HEIGHT
  } else if (newHeight > maxH) {
    if (resizeDir.includes("top")) newTop += newHeight - maxH
    newHeight = maxH
  }

  // --- 防止超出畫面 ---
  if (newLeft < 0) {
    newWidth += newLeft
    newLeft = 0
  }
  if (newTop < 0) {
    newHeight += newTop
    newTop = 0
  }
  if (newLeft + newWidth > window.innerWidth) {
    newWidth = window.innerWidth - newLeft
  }
  if (newTop + newHeight > window.innerHeight) {
    newHeight = window.innerHeight - newTop
  }

  el.style.width = `${newWidth}px`
  el.style.height = `${newHeight}px`
  el.style.left = `${newLeft}px`
  el.style.top = `${newTop}px`
}

const clampIframeWithinViewport = () => {
  if (!iframeContainer.value) return

  const el = iframeContainer.value
  const rect = el.getBoundingClientRect()

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let newWidth = rect.width
  let newHeight = rect.height
  let newLeft = rect.left
  let newTop = rect.top

  if (newWidth > viewportWidth) {
    newWidth = viewportWidth
  }
  if (newHeight > viewportHeight) {
    newHeight = viewportHeight
  }

  if (newLeft < 0) {
    newLeft = 0
  }
  if (newLeft + newWidth > viewportWidth) {
    newLeft = Math.max(0, viewportWidth - newWidth)
  }

  if (newTop < 0) {
    newTop = 0
  }
  if (newTop + newHeight > viewportHeight) {
    newTop = Math.max(0, viewportHeight - newHeight)
  }

  if (newWidth !== rect.width || el.style.width) {
    el.style.width = `${newWidth}px`
  }
  if (newHeight !== rect.height || el.style.height) {
    el.style.height = `${newHeight}px`
  }

  if (newLeft !== rect.left || el.style.left) {
    el.style.left = `${newLeft}px`
  }
  if (newTop !== rect.top || el.style.top) {
    el.style.top = `${newTop}px`
  }
}

const handleViewportResize = () => {
  window.requestAnimationFrame(clampIframeWithinViewport)
}

const stopAction = () => {
  isResizing.value = false
  isDragging.value = false
  currentAction = "none" // 🔓 解鎖

  document.removeEventListener("mousemove", onResize)
  document.removeEventListener("mousemove", onDrag)
  document.removeEventListener("touchmove", onResizeTouch)
  document.removeEventListener("touchmove", onDragTouch)
  document.removeEventListener("mouseup", stopAction)
  document.removeEventListener("touchend", stopAction)
  clampIframeWithinViewport()
}

onMounted(() => {
  iframeOrigin.value = getFansOrigin()

  if (props.account) {
    iframeUrl.value = getFansUrl(props.account)
  }

  window.addEventListener("resize", handleViewportResize)
  window.requestAnimationFrame(clampIframeWithinViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleViewportResize)
})

watch(isAIFansIframeShow, (visible) => {
  if (!visible) return
  window.requestAnimationFrame(clampIframeWithinViewport)
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.iframe-content {
  position: fixed;
  top: 120px;
  width: 30.1875rem;
  height: 37.5rem;
  background: transparent;
  z-index: -1;
  overflow: hidden;
  user-select: none;
  pointer-events: none; // 非 active 時不攔截事件，允許頁面滾動
  right: -30.1875rem;
  opacity: 0;
  transition: right 0.4s ease, opacity 0.4s ease;

  &.active {
    right: 0;
    opacity: 1;
    z-index: 10001;
    pointer-events: auto; // active 時恢復事件處理

    @include iphone-width() {
      width: 340px !important;
      height: 450px !important;
    }
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;

    @include iphone-width() {
      width: 340px !important;
      height: 450px !important;
    }
  }

  /* 透明拖曳區塊 */
  .drag-header {
    position: absolute;
    top: 13px;
    left: 15px;
    height: 28px;
    width: 85%;
    background: transparent;
    cursor: move;
    z-index: 10;
  }
  .close_btn {
    top: 5%;
    right: 4%;
    z-index: 11;
  }

  /* 防止 iframe 吃掉事件的遮罩 */
  .resize-overlay {
    position: absolute;
    inset: 0;
    z-index: 9000;
    background: transparent;
  }

  .resizer {
    position: absolute;
    background: transparent;
    z-index: 10000;

    /* 四角 */
    &.top-left {
      top: 0;
      left: 2%;
      width: 30px;
      height: 30px;
      cursor: nwse-resize;
    }
    &.top-right {
      top: 0;
      right: 2%;
      width: 30px;
      height: 30px;
      cursor: nesw-resize;
    }
    &.bottom-left {
      bottom: 0;
      left: 2%;
      width: 30px;
      height: 30px;
      cursor: nesw-resize;
    }
    &.bottom-right {
      bottom: 0;
      right: 2%;
      width: 30px;
      height: 30px;
      cursor: nwse-resize;
    }

    /* 四邊 */
    &.top {
      top: 1%;
      left: 8%;
      width: 84%;
      height: 8px;
      cursor: ns-resize;
    }
    &.bottom {
      bottom: 3%;
      left: 8%;
      width: 84%;
      height: 8px;
      cursor: ns-resize;
    }
    &.left {
      top: 8%;
      left: 1%;
      width: 8px;
      height: 84%;
      cursor: ew-resize;
    }
    &.right {
      top: 8%;
      right: 2%;
      width: 8px;
      height: 84%;
      cursor: ew-resize;
    }
  }
}
</style>
