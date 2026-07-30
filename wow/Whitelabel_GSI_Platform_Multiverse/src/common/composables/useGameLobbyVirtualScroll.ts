import { computed, nextTick, onMounted, ref, watch, type ComputedRef, type MaybeRefOrGetter, toValue } from "vue"
import type * as Response from "src/api/response.type"

export type VirtualScrollInstance = {
  $el: HTMLElement
  refresh: () => void
}

export type UseGameLobbyVirtualScrollOptions = {
  rowItemsCount?: MaybeRefOrGetter<number>
  desktopRowItemsCount?: number
  mobileRowItemsCount?: number
  sliceSize?: MaybeRefOrGetter<number>
  desktopSliceSize?: number
  mobileSliceSize?: number
  rowHeight?: MaybeRefOrGetter<number>
  desktopRowHeight?: number
  mobileRowHeight?: number
}

export function useGameLobbyVirtualScroll(
  showGameList: ComputedRef<Response.GameList>,
  isDesktop: MaybeRefOrGetter<boolean>,
  options: UseGameLobbyVirtualScrollOptions = {}
) {
  const virtualScrollRef = ref<VirtualScrollInstance | null>(null)
  const virtualScrollTarget = ref<Element>()

  const rowItemsCount = computed(() => {
    if (options.rowItemsCount != null) return toValue(options.rowItemsCount)
    return toValue(isDesktop)
      ? (options.desktopRowItemsCount ?? 6)
      : (options.mobileRowItemsCount ?? 3)
  })
  const virtualRowHeight = computed(() => {
    if (options.rowHeight != null) return toValue(options.rowHeight)
    return toValue(isDesktop) ? (options.desktopRowHeight ?? 300) : (options.mobileRowHeight ?? 300)
  })
  const virtualScrollSliceSize = computed(() => {
    if (options.sliceSize != null) return toValue(options.sliceSize)
    return toValue(isDesktop) ? (options.desktopSliceSize ?? 6) : (options.mobileSliceSize ?? 4)
  })
  const virtualScrollSliceRatioBefore = computed(() => 0.4)
  const virtualScrollSliceRatioAfter = computed(() => 0.4)
  const resolvedVirtualScrollTarget = computed(
    () => virtualScrollTarget.value || document.scrollingElement || document.documentElement
  )

  const gameRows = computed(() => {
    const rows: Response.GameList[] = []
    for (let index = 0; index < showGameList.value.length; index += rowItemsCount.value) {
      rows.push(showGameList.value.slice(index, index + rowItemsCount.value))
    }
    return rows
  })

  async function resolveVirtualScrollTarget() {
    await nextTick()
    const virtualScrollEl = virtualScrollRef.value?.$el
    if (!virtualScrollEl) {
      virtualScrollTarget.value = document.scrollingElement || document.documentElement
      return
    }

    let parentElement = virtualScrollEl.parentElement
    while (parentElement) {
      const style = window.getComputedStyle(parentElement)
      const isScrollable =
        /(auto|scroll)/.test(style.overflowY) && parentElement.scrollHeight > parentElement.clientHeight
      if (isScrollable) {
        virtualScrollTarget.value = parentElement
        return
      }
      parentElement = parentElement.parentElement
    }

    virtualScrollTarget.value = document.scrollingElement || document.documentElement
  }

  watch(
    () => showGameList.value.length,
    async (length, prevLength) => {
      if (length === 0) return

      if (prevLength === 0 || prevLength === undefined) {
        await resolveVirtualScrollTarget()
      }

      await nextTick()
      virtualScrollRef.value?.refresh()
    },
    { immediate: true }
  )

  onMounted(() => {
    virtualScrollTarget.value = document.scrollingElement || document.documentElement
  })

  return {
    virtualScrollRef,
    virtualRowHeight,
    virtualScrollSliceSize,
    virtualScrollSliceRatioBefore,
    virtualScrollSliceRatioAfter,
    resolvedVirtualScrollTarget,
    gameRows
  }
}
