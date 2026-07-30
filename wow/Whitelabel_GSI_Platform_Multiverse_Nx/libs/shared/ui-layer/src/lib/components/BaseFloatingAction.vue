<script setup lang="ts">
interface FloatingPosition {
  x: number
  y: number
}

interface Props {
  storageKey: string
  badge?: string | number
  ariaLabel?: string
  size?: number
  initialRight?: number
  initialBottom?: number
  mobileBottomOffset?: number
  dragThreshold?: number
  zIndexClass?: string
  disableHoverScale?: boolean
  classObj?: {
    root?: string
    button?: string
    badge?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: "Floating action",
  size: 72,
  initialRight: 24,
  initialBottom: 120,
  mobileBottomOffset: 84,
  dragThreshold: 6,
  zIndexClass: "z-40",
  disableHoverScale: false,
  classObj: () => ({})
})

const emit = defineEmits<{
  click: []
}>()

const position = reactive<FloatingPosition>({ x: 0, y: 0 })
const dragStart = reactive({ x: 0, y: 0, pointerX: 0, pointerY: 0 })
const isReady = ref(false)
const isDragging = ref(false)
const hasMoved = ref(false)

const isBrowser = typeof window !== "undefined"
const isLeftSide = computed(() => position.x + props.size / 2 < (isBrowser ? window.innerWidth : 0) / 2)
const isTopHalf = computed(() => position.y + props.size / 2 < (isBrowser ? window.innerHeight : 0) / 2)

const getViewport = () => ({
  width: window.innerWidth,
  height: window.innerHeight
})

const getDefaultPosition = (): FloatingPosition => {
  const viewport = getViewport()
  const bottomOffset = viewport.width <= 768 ? props.mobileBottomOffset : props.initialBottom

  return {
    x: viewport.width - props.size - props.initialRight,
    y: viewport.height - props.size - bottomOffset
  }
}

const clampPosition = (next: FloatingPosition): FloatingPosition => {
  const viewport = getViewport()
  const margin = 8

  return {
    x: Math.min(Math.max(next.x, margin), viewport.width - props.size - margin),
    y: Math.min(Math.max(next.y, margin), viewport.height - props.size - margin)
  }
}

const savePosition = () => {
  if (!isBrowser) return
  window.localStorage.setItem(props.storageKey, JSON.stringify({ x: position.x, y: position.y }))
}

const loadPosition = () => {
  if (!isBrowser) return

  const fallback = getDefaultPosition()
  const raw = window.localStorage.getItem(props.storageKey)

  if (!raw) {
    Object.assign(position, clampPosition(fallback))
    return
  }

  try {
    const parsed = JSON.parse(raw) as Partial<FloatingPosition>
    Object.assign(
      position,
      clampPosition({
        x: Number(parsed.x ?? fallback.x),
        y: Number(parsed.y ?? fallback.y)
      })
    )
  } catch {
    Object.assign(position, clampPosition(fallback))
  }
}

const snapToNearestEdge = () => {
  const viewport = getViewport()
  const nextX = position.x + props.size / 2 < viewport.width / 2 ? 8 : viewport.width - props.size - 8
  Object.assign(position, clampPosition({ x: nextX, y: position.y }))
  savePosition()
}

const onPointerMove = (event: PointerEvent) => {
  if (!isDragging.value) return

  const deltaX = event.clientX - dragStart.pointerX
  const deltaY = event.clientY - dragStart.pointerY
  const distance = Math.hypot(deltaX, deltaY)

  if (distance >= props.dragThreshold) {
    hasMoved.value = true
  }

  Object.assign(
    position,
    clampPosition({
      x: dragStart.x + deltaX,
      y: dragStart.y + deltaY
    })
  )
}

const cleanupPointerListeners = () => {
  window.removeEventListener("pointermove", onPointerMove)
  window.removeEventListener("pointerup", onPointerUp)
  window.removeEventListener("pointercancel", onPointerUp)
}

function onPointerUp() {
  if (!isDragging.value) return

  isDragging.value = false
  cleanupPointerListeners()

  if (hasMoved.value) {
    snapToNearestEdge()
    return
  }

  emit("click")
}

const onPointerDown = (event: PointerEvent) => {
  if (!isBrowser) return

  isDragging.value = true
  hasMoved.value = false
  dragStart.x = position.x
  dragStart.y = position.y
  dragStart.pointerX = event.clientX
  dragStart.pointerY = event.clientY

  window.addEventListener("pointermove", onPointerMove)
  window.addEventListener("pointerup", onPointerUp)
  window.addEventListener("pointercancel", onPointerUp)
}

const handleResize = () => {
  Object.assign(position, clampPosition(position))
  savePosition()
}

onMounted(() => {
  loadPosition()
  isReady.value = true
  window.addEventListener("resize", handleResize)
})

onBeforeUnmount(() => {
  cleanupPointerListeners()
  window.removeEventListener("resize", handleResize)
})
</script>

<template>
  <div
    v-if="isReady"
    :class="cx('fixed left-0 top-0 select-none touch-none', props.zIndexClass, props.classObj?.root)"
    :style="{
      width: `${props.size}px`,
      height: `${props.size}px`,
      transform: `translate3d(${position.x}px, ${position.y}px, 0)`
    }"
    @pointerdown.prevent="onPointerDown"
  >
    <button
      type="button"
      :aria-label="props.ariaLabel"
      :class="
        cx(
          'relative grid h-full w-full place-items-center rounded-full border-0 bg-transparent p-0',
          'cursor-pointer touch-none outline-none transition-transform duration-200',
          !isDragging && !props.disableHoverScale && 'hover:scale-105 active:scale-95',
          props.classObj?.button
        )
      "
      @keydown.enter.prevent="emit('click')"
      @keydown.space.prevent="emit('click')"
    >
      <slot />

      <span
        v-if="badge !== undefined && badge !== null && String(badge).length"
        :class="
          cx(
            'absolute -right-1 -top-1 min-w-6 rounded-full bg-[#EF4444] px-1.5 py-0.5',
            'text-center text-xs font-bold leading-5 text-white shadow-lg',
            props.classObj?.badge
          )
        "
      >
        {{ badge }}
      </span>
    </button>

    <div v-if="$slots.overlay" class="pointer-events-none absolute inset-0">
      <slot
        name="overlay"
        :is-left-side="isLeftSide"
        :is-top-half="isTopHalf"
        :position="position"
        :size="props.size"
      />
    </div>
  </div>
</template>
