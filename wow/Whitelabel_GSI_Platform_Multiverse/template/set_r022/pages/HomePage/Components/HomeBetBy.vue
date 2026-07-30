<template>
  <section v-if="shouldShowBetBy" class="betby-home-section">
    <div
      ref="betbyContentRef"
      class="betby-home-content"
      :class="{ 'betby-home-content--mounted': hasMountedRenderer }"
    >
      <BetByArea />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { getProductList } from "src/api/game"
import type * as Response from "src/api/response.type"
import BetByArea from "src/common/components/BetByArea/Index.vue"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useApi } from "src/common/hooks/useApi"
import { GAME_TYPE } from "src/common/utils/constants"

const BETBY_PRODUCT_CODE = 1244

const { isFA11 } = useAgentCode()
const betbyContentRef = ref<HTMLElement | null>(null)
const hasMountedRenderer = ref(false)
const sportsbookProducts = ref<Response.ProductList>([])

let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null
let measurementFrame = 0
const normalizedElements = new WeakSet<HTMLElement>()

const betbyProduct = computed(() => {
  return sportsbookProducts.value.find((item) => item.product_code === BETBY_PRODUCT_CODE)
})

const betbyProductName = computed(() => {
  return betbyProduct.value?.product_name || "BetBy"
})

const shouldShowBetBy = computed(() => {
  return isFA11.value && !!betbyProduct.value
})

const getSportsbookProducts = async () => {
  if (!isFA11.value) {
    sportsbookProducts.value = []
    return
  }

  const { status, data } = await useApi(getProductList, {
    game_type_id: GAME_TYPE.Enums.SPORTBOOK
  })

  sportsbookProducts.value = status && data?.length ? [...data] : []
}

const isViewportSizedElement = (element: HTMLElement) => {
  const style = window.getComputedStyle(element)
  const rect = element.getBoundingClientRect()
  const minHeight = Number.parseFloat(style.minHeight || "0") || 0
  const height = Number.parseFloat(style.height || "0") || 0
  const viewportHeight = window.innerHeight
  const className = typeof element.className === "string" ? element.className : ""

  return (
    /q-layout|q-layout-container|q-page-container|q-page|q-scrollarea/.test(className) ||
    style.minHeight.includes("vh") ||
    style.height.includes("vh") ||
    rect.height >= viewportHeight - 24 ||
    minHeight >= viewportHeight - 24 ||
    height >= viewportHeight - 24
  )
}

const forceBetByAutoHeight = (mountElement: HTMLElement) => {
  const descendants = Array.from(mountElement.querySelectorAll<HTMLElement>("*"))

  descendants.forEach((element) => {
    if (!isViewportSizedElement(element) || normalizedElements.has(element)) return

    normalizedElements.add(element)
    element.style.setProperty("min-height", "0px", "important")
    element.style.setProperty("height", "auto", "important")
    element.style.setProperty("max-height", "none", "important")
  })
}

const updateBetByMountedState = () => {
  const contentElement = betbyContentRef.value

  if (!contentElement) return

  const mountElement = contentElement.querySelector("#betby-sportsbook")
  const hasInjectedContent = mountElement instanceof HTMLElement && mountElement.childElementCount > 0

  hasMountedRenderer.value = hasInjectedContent

  if (mountElement instanceof HTMLElement) {
    forceBetByAutoHeight(mountElement)
  }
}

const scheduleBetByMeasurement = () => {
  if (measurementFrame) {
    cancelAnimationFrame(measurementFrame)
  }

  measurementFrame = requestAnimationFrame(() => {
    measurementFrame = 0
    updateBetByMountedState()
  })
}

const cleanupBetByObservers = () => {
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
  resizeObserver = null
  mutationObserver = null

  if (measurementFrame) {
    cancelAnimationFrame(measurementFrame)
    measurementFrame = 0
  }
}

const observeBetByTargets = () => {
  const contentElement = betbyContentRef.value

  if (!contentElement || !resizeObserver) return

  const observedElements = [
    contentElement.querySelector("#betby-sportsbook"),
    contentElement.querySelector("#betby-sportsbook > *"),
    contentElement.querySelector("#betby-sportsbook > * > *")
  ]

  observedElements.forEach((element) => {
    if (element) {
      resizeObserver?.observe(element)
    }
  })
}

const setupBetByObservers = async () => {
  await nextTick()

  const contentElement = betbyContentRef.value

  if (!contentElement) return

  cleanupBetByObservers()
  scheduleBetByMeasurement()

  resizeObserver = new ResizeObserver(() => {
    scheduleBetByMeasurement()
  })
  observeBetByTargets()

  mutationObserver = new MutationObserver(() => {
    observeBetByTargets()
    scheduleBetByMeasurement()
  })
  mutationObserver.observe(contentElement, {
    attributes: true,
    childList: true,
    subtree: true
  })
}

watch(
  () => shouldShowBetBy.value,
  async (isVisible) => {
    if (!isVisible) {
      hasMountedRenderer.value = false
      cleanupBetByObservers()
      return
    }

    await setupBetByObservers()
  },
  { immediate: true }
)

onMounted(async () => {
  await getSportsbookProducts()
})

onBeforeUnmount(() => {
  cleanupBetByObservers()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.betby-home-section {
  @apply flex flex-col gap-4 rounded-[1rem] p-4;
  background: var(--neutral-01);

  @include pad-large-width {
    @apply gap-3 rounded-[.75rem] p-3;
  }
}

.betby-home-content {
  @apply w-full overflow-hidden rounded-[.75rem];
  min-height: 34rem;
  background: var(--bg-main-bg);

  @include pad-large-width {
    min-height: 28rem;
  }

  &.betby-home-content--mounted {
    min-height: 0;
  }

  :deep(.betby-area) {
    @apply w-full;
    height: auto;
  }

  :deep(.betby-renderer-stack) {
    @apply w-full;
    height: auto;
  }

  :deep(.betby-iframe) {
    @apply w-full;
    height: auto;
  }

  :deep(#betby-sportsbook) {
    min-height: 0;
    height: auto;
  }

  :deep(#betby-sportsbook .q-layout),
  :deep(#betby-sportsbook .q-layout-container),
  :deep(#betby-sportsbook .q-page-container),
  :deep(#betby-sportsbook .q-page),
  :deep(#betby-sportsbook .q-scrollarea),
  :deep(#betby-sportsbook .q-scrollarea__container),
  :deep(#betby-sportsbook .q-scrollarea__content) {
    min-height: 0 !important;
    height: auto !important;
    max-height: none !important;
  }
}
</style>
