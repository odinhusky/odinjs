<template>
  <div class="provider-list-wrapper relative w-full">
    <!-- Tabs -->
    <q-tabs
      ref="tabsRef"
      v-model="activeTab"
      :class="cx('provider-list-container', 'w-full', SCROLLBAR_HIDDEN)"
      dense
      mobile-arrows
      outside-arrows
      align="left"
      :shrink="false"
      no-caps
      indicator-color="transparent"
    >
      <q-tab
        v-for="(product, key) in productList"
        :key="key"
        :name="product.product_code"
        :class="
          cx(
            'provider-unit',
            'flex-shrink-0',
            'w-[10.5rem] phone:w-[7.375rem] h-[4.375rem] phone:h-[3.375rem]',
            'overflow-hidden',
            'rounded-xl',
            'px-3.5 py-3',
            { 'tab-loading': !loadedTabs.has(product.product_code) }
          )
        "
        @click="emit('selectProductCode', product.product_code)"
      >
        <img
          :src="getProductTabImage({ ...product, siteKey: 'okbet' })"
          :class="cx('provider-img', 'w-full')"
          :alt="product.product_name"
          draggable="false"
          @dragstart.prevent
          @mousedown.prevent
          @load="onTabImgLoad(product.product_code)"
          @error="onTabImgError"
        />
      </q-tab>
    </q-tabs>

    <!-- Left gradient behind arrow -->
    <transition name="fade">
      <div
        v-if="showLeftGradient"
        class="gradient-left absolute left-0 top-0 h-full w-[94px] pointer-events-none z-10"
      ></div>
    </transition>

    <!-- Right gradient behind arrow -->
    <transition name="fade">
      <div
        v-if="showRightGradient"
        class="gradient-right absolute right-0 top-0 h-full w-[94px] pointer-events-none z-10"
      ></div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, watch } from "vue"
import { cx } from "src/common/utils/cx"
import { SCROLLBAR_HIDDEN } from "src/common/utils/constants/styles"
import type * as Response from "src/api/response.type"
import { useGame } from "src/common/composables/useGame"
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"

const props = defineProps<{
  productList: Response.ProductList
  selectedProductCode: number | null
}>()

const emit = defineEmits<{
  selectProductCode: [productCode: number]
}>()

const { getProductTabImage } = useGame()
const { setDefaultProductTabImg } = useSiteImg()

const activeTab = ref<number | string>(props.selectedProductCode ?? "")

watch(
  () => props.selectedProductCode,
  (val) => {
    if (val != null) activeTab.value = val
  }
)

// 已成功載入圖片的 product_code；用來控制骨架佔位是否移除
const loadedTabs = reactive(new Set<number>())

// 圖片載入成功：移除該格骨架
const onTabImgLoad = (productCode: number) => {
  loadedTabs.add(productCode)
}

// 圖片載入失敗：先帶 cache-buster 重試一次，仍失敗才落 default（並防止無限迴圈）
const onTabImgError = (e: Event) => {
  const img = e.target as HTMLImageElement

  if (!img.dataset.retried) {
    img.dataset.retried = "1"
    const base = img.src.split("#")[0]
    const sep = base.includes("?") ? "&" : "?"
    img.src = `${base}${sep}_retry=${Date.now()}`
    return
  }

  if (img.dataset.fallback) return
  img.dataset.fallback = "1"
  setDefaultProductTabImg(e)
}

const tabsRef = ref<any>(null)

const showLeftGradient = ref(false)
const showRightGradient = ref(false)

let scrollContainer: any = null
let resizeObserver: ResizeObserver | null = null

// Update gradients based on scroll position
const updateGradients = () => {
  if (!scrollContainer) {
    scrollContainer = tabsRef.value?.$el?.querySelector(".q-tabs__content")
  }

  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer
  const threshold = 5 // Tolerance for floating point precision

  // Update gradient visibility
  showLeftGradient.value = scrollLeft > threshold
  showRightGradient.value = scrollLeft + clientWidth < scrollWidth - threshold
}

const DRAG_THRESHOLD = 6

let isDragging = false
let dragMoved = false
let startX = 0
let startY = 0
let startScrollLeft = 0

const onMouseDown = (e: MouseEvent) => {
  if (!scrollContainer) return

  isDragging = true
  dragMoved = false
  startX = e.pageX
  startY = e.pageY
  startScrollLeft = scrollContainer.scrollLeft
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging || !scrollContainer) return

  const dx = e.pageX - startX
  const dy = e.pageY - startY

  if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
    dragMoved = true
  }

  if (!dragMoved) return

  e.preventDefault()
  scrollContainer.scrollLeft = startScrollLeft - dx
}

const onMouseUp = () => {
  isDragging = false
  // delay reset so click handler can read dragMoved
  setTimeout(() => {
    dragMoved = false
  }, 0)
}

const onClickCapture = (e: MouseEvent) => {
  if (dragMoved) {
    e.preventDefault()
    e.stopPropagation()
  }
}

// Initialize scroll listeners and observers
const initializeScrollHandling = () => {
  scrollContainer = tabsRef.value?.$el?.querySelector(".q-tabs__content")
  if (!scrollContainer) return

  scrollContainer.addEventListener("scroll", updateGradients, { passive: true })

  scrollContainer.addEventListener("mousedown", onMouseDown, { capture: true })
  window.addEventListener("mousemove", onMouseMove)
  window.addEventListener("mouseup", onMouseUp)

  scrollContainer.addEventListener("click", onClickCapture, true)

  // resize handling
  resizeObserver = new ResizeObserver(updateGradients)
  resizeObserver.observe(scrollContainer)

  setTimeout(updateGradients, 100)
}

const cleanup = () => {
  if (!scrollContainer) return

  scrollContainer.removeEventListener("scroll", updateGradients)
  scrollContainer.removeEventListener("mousedown", onMouseDown, { capture: true })
  scrollContainer.removeEventListener("click", onClickCapture, true)

  window.removeEventListener("mousemove", onMouseMove)
  window.removeEventListener("mouseup", onMouseUp)

  resizeObserver?.disconnect()
  resizeObserver = null
}

// Watch for product list changes
watch(
  () => props.productList,
  () => {
    nextTick(() => {
      // Re-check gradients when products change
      setTimeout(updateGradients, 100)
    })
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => {
    initializeScrollHandling()
  })
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";

/* ===============================
   Gradients behind arrows
   =============================== */
.gradient-left {
  background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
  transition: opacity 0.3s ease;
  opacity: 1;
}

.gradient-right {
  background: linear-gradient(270deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
  transition: opacity 0.3s ease;
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 骨架佔位動畫 */
@keyframes provider-tab-skeleton {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ===============================
   Tabs Styling
   =============================== */
.provider-list-container {
  .provider-unit {
    background-color: $white-color;
    /* 覆蓋 Quasar q-tab 預設 flex:1 1 auto，避免單一/少數 tab 被撐滿，維持一致寬度 */
    flex: 0 0 auto !important;
  }

  /* 圖片尚未成功載入時的骨架佔位（避免整批空白/破圖） */
  .provider-unit.tab-loading {
    background-image: linear-gradient(100deg, #f2f5fa 30%, #e6ecf5 50%, #f2f5fa 70%);
    background-size: 200% 100%;
    animation: provider-tab-skeleton 1.2s ease-in-out infinite;
  }

  /* Override Quasar focus overlay (default: background currentColor) */
  :deep(.provider-unit > .q-focus-helper),
  :deep(.provider-unit.q-focusable:focus > .q-focus-helper),
  :deep(.provider-unit.q-manual-focusable--focused > .q-focus-helper),
  :deep(.provider-unit.q-hoverable:hover > .q-focus-helper) {
    background: #fff !important;
    opacity: 0.15;
  }

  :deep(.q-tabs__content) {
    @apply gap-[12px] phone:gap-[4px];
    overflow-x: auto !important;
    overflow-y: hidden !important;
  }

  :deep(.q-tab__content) {
    @apply min-w-[initial] justify-center items-center h-full p-0;
  }

  /* 統一每格 logo 呈現：填滿固定框、置中、等比不裁切，避免大小/比例不一 */
  .provider-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }

  :deep(.q-tabs__arrow) {
    width: 28px;
    height: 28px;
    min-width: 28px;
    border-radius: 50%;
    background: #fbfcfd;
    box-shadow: 0px 0px 5px 0px #5a79bd66;
    z-index: 20;
  }

  :deep(.q-tabs__arrow:hover) {
    background: #fbfcfd;
    box-shadow: 0px 0px 5px 0px #5a79bd66;
  }

  :deep(.q-tabs__arrow .q-icon) {
    width: 5px;
    height: 9px;
    font-size: 0;
    position: relative;
  }

  :deep(.q-tabs__arrow .q-icon::before) {
    content: "";
    position: absolute;
    top: 3.33px;
    left: 5.33px;
    width: 5px;
    height: 9px;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }

  :deep(.q-tabs__arrow--left .q-icon::before) {
    transform: rotate(180deg);
  }

  :deep(.q-tabs__arrow--left.q-icon),
  :deep(.q-tabs__arrow--right.q-icon) {
    color: #025be8 !important;
  }

  &.q-tabs--scrollable.q-tabs__arrows--outside.q-tabs--horizontal {
    padding: 0px !important;
  }
  &.q-tabs--horizontal:deep(.q-tabs__arrow--left),
  &.q-tabs--horizontal:deep(.q-tabs__arrow--right) {
    top: 50% !important;
    transform: translateY(-50%) !important;
  }
  &.q-tabs--horizontal:deep(.q-tabs__arrow--left) {
    left: 0 !important;
  }
  &.q-tabs--horizontal:deep(.q-tabs__arrow--right) {
    right: 0 !important;
  }
}

.provider-unit {
  border: 1px solid transparent;
  transition: background 0.2s ease, box-shadow 0.2s ease, border-image-source 0.2s ease;

  &:hover {
    background: linear-gradient(105.42deg, #e3eeff 0%, #b6d2ff 100%);
    box-shadow: 0px 0px 6px 0px #5c8cf066;
  }

  &.q-tab--active {
    border-radius: 0.75rem;
    border: 1px solid transparent;
    background: linear-gradient(#fff, #fff) padding-box,
      linear-gradient(105.42deg, #0063ff 0%, #0295e8 52.88%, #aeceff 98.56%) border-box;

    &:hover {
      background: linear-gradient(105.42deg, #e3eeff 0%, #b6d2ff 100%) padding-box,
        linear-gradient(105.42deg, #0063ff 0%, #0295e8 52.88%, #aeceff 98.56%) border-box;
      box-shadow: 0px 0px 6px 0px #5c8cf066;
    }
  }
}
</style>
