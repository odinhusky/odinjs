import { onBeforeUnmount, ref } from "vue"

/**
 * 控制 Tawk 原生 widget 的封裝。
 *
 * 本專案站台的 tawk 是透過「網站自訂代碼」整段插入 <head> 載入（非 useLiveChat 的 customer_services），
 * 後台 tawk script 維持原樣、不需任何改動。
 *
 * tawk v4 的入口由多個 iframe 組成（bubble launcher + greeting 通知卡 + 對話面板…），
 * 彼此用動態 id、無穩定 class。這裡以特徵（position:fixed + 高 z-index）篩出 tawk 的 iframe：
 * - bubble：面積最小的 launcher
 * - launcher（bubble + greeting）：高度 < 350 的可見 iframe（對話面板較高，藉此排除）
 * 移動入口時對「所有 launcher iframe」各自設 left/top（= 自然位置 + 相同位移量），使 bubble 與
 * greeting 一起平移、不影響對話面板。用 left/top 而非 transform，因 tawk 自己會在 launcher 上
 * 套 transform(rotate/translateZ) 並覆蓋，left/top 則不衝突。
 */

/** 高度門檻：≥ 此值視為對話面板，而非 launcher（bubble/greeting） */
const PANEL_MIN_HEIGHT = 350

/** 是否為 tawk 的 fixed 高層級 iframe */
function isTawkIframe(f: HTMLIFrameElement, cs: CSSStyleDeclaration): boolean {
  return cs.position === "fixed" && cs.display !== "none" && Number(cs.zIndex) >= 1000000
}

/**
 * 從特徵辨識 tawk bubble iframe（面積最小的 launcher）。
 * bubble 永遠是最小的那顆（greeting / 對話面板都比較大），不寫死絕對尺寸。
 */
function findTawkBubble(): HTMLElement | null {
  const frames = document.querySelectorAll<HTMLIFrameElement>("iframe")
  let bubble: HTMLElement | null = null
  let minArea = Infinity

  for (const f of frames) {
    const cs = getComputedStyle(f)
    if (!isTawkIframe(f, cs)) continue
    const r = f.getBoundingClientRect()
    if (r.width <= 0 || r.height <= 0) continue

    const area = r.width * r.height
    if (area < minArea) {
      minArea = area
      bubble = f
    }
  }

  return bubble
}

/** 取得「最大的可見 launcher」（greeting 在時為 greeting，否則為 bubble）——overlay/X 對齊用 */
function findPrimaryLauncher(): HTMLElement | null {
  let primary: HTMLElement | null = null
  let maxArea = -1
  for (const f of getLauncherIframes()) {
    const r = f.getBoundingClientRect()
    const area = r.width * r.height
    if (area > maxArea) {
      maxArea = area
      primary = f
    }
  }
  return primary
}

/**
 * 取得可隨入口一起平移的 tawk iframe。
 * includePanel=false：只含 launcher（bubble + greeting，排除對話面板）——手機用（面板全螢幕不能搬）。
 * includePanel=true：含對話面板——桌機用（讓對話視窗也跟著 bubble 移動）。
 */
function getMovableIframes(includePanel: boolean): HTMLIFrameElement[] {
  const out: HTMLIFrameElement[] = []
  const frames = document.querySelectorAll<HTMLIFrameElement>("iframe")
  for (const f of frames) {
    const cs = getComputedStyle(f)
    if (!isTawkIframe(f, cs)) continue
    const r = f.getBoundingClientRect()
    if (r.width <= 0 || r.height <= 0) continue
    if (!includePanel && r.height >= PANEL_MIN_HEIGHT) continue
    out.push(f)
  }
  return out
}

/** 取得所有 launcher iframe（bubble + greeting，排除對話面板）——overlay/primary 對齊用 */
function getLauncherIframes(): HTMLIFrameElement[] {
  return getMovableIframes(false)
}

/**
 * 偵測 tawk 對話視窗是否開啟。
 * tawk 不會觸發 onChatMaximized/Minimized callback，故改以 DOM 判斷：
 * 對話開啟時會出現高度 ≥ PANEL_MIN_HEIGHT 的 tawk iframe（面板），bubble/greeting 都較矮。
 */
function isTawkChatOpen(): boolean {
  const frames = document.querySelectorAll<HTMLIFrameElement>("iframe")
  for (const f of frames) {
    const cs = getComputedStyle(f)
    if (!isTawkIframe(f, cs)) continue
    if (f.getBoundingClientRect().height >= PANEL_MIN_HEIGHT) return true
  }
  return false
}

export function useTawkWidget() {
  /** 已辨識到的 tawk bubble iframe */
  const bubble = ref<HTMLElement | null>(null)

  let cleanup: (() => void) | null = null

  const getApi = () => window.Tawk_API

  const safe = (fn: () => void) => {
    try {
      fn()
    } catch {
      /* tawk 尚未就緒或方法不存在時忽略，不輸出 log */
    }
  }

  /**
   * 輪詢等待 bubble 出現（tawk 載入為非同步），就緒後執行 cb。
   * 預設每 500ms 一次、最多 30 秒後放棄。
   */
  const waitBubble = (cb: (el: HTMLElement) => void) => {
    const resolve = () => {
      const el = findTawkBubble()
      if (el) {
        bubble.value = el
        cleanup?.()
        cb(el)
        return true
      }
      return false
    }

    if (resolve()) return

    const timer = setInterval(resolve, 500)
    const stop = setTimeout(() => cleanup?.(), 30000)

    cleanup = () => {
      clearInterval(timer)
      clearTimeout(stop)
      cleanup = null
    }
  }

  /** 各 launcher iframe 未平移時的自然左上座標（首次見到時記錄） */
  const launcherNatural = new WeakMap<HTMLElement, { x: number; y: number }>()

  /**
   * 將 tawk 入口 iframe 平移 (dx, dy)：各自以「自然位置 + 位移」設 left/top。
   * 首次見到某 iframe 時記錄其自然位置（此時尚未被我們移動），之後皆以此換算，確保整組一起移動。
   * includePanel=true（桌機）時連對話面板一起搬，讓對話視窗跟著 bubble；false（手機）只搬 launcher。
   */
  const moveLaunchers = (dx: number, dy: number, includePanel = false) => {
    for (const f of getMovableIframes(includePanel)) {
      let nat = launcherNatural.get(f)
      if (!nat) {
        const r = f.getBoundingClientRect()
        nat = { x: Math.round(r.x), y: Math.round(r.y) }
        launcherNatural.set(f, nat)
      }
      const left = `${nat.x + dx}px`
      const top = `${nat.y + dy}px`
      if (f.style.left !== left || f.style.top !== top) {
        f.style.setProperty("left", left, "important")
        f.style.setProperty("top", top, "important")
        f.style.setProperty("right", "auto", "important")
        f.style.setProperty("bottom", "auto", "important")
      }
    }
  }

  /** 隱藏 Tawk 原生 bubble */
  const hideWidget = () => safe(() => getApi()?.hideWidget?.())
  /** 顯示 Tawk 原生 bubble */
  const showWidget = () => safe(() => getApi()?.showWidget?.())
  /** 切換對話視窗開合 */
  const toggle = () => safe(() => getApi()?.toggle?.())
  /** 開啟對話視窗 */
  const maximize = () => safe(() => getApi()?.maximize?.())

  /** 對話視窗是否開啟（DOM 偵測，tawk 不會觸發事件） */
  const isChatOpen = () => isTawkChatOpen()

  /** 取得最大的可見 launcher（overlay/X 對齊用） */
  const getPrimaryLauncher = () => findPrimaryLauncher()

  // --- 監看 tawk 容器：launcher（尤其 greeting）被 tawk 重建/改樣式時即時重新定位，避免回到原位 ---
  let launcherObserver: MutationObserver | null = null
  let observedContainer: HTMLElement | null = null
  let deltaGetter: (() => { dx: number; dy: number; includePanel?: boolean } | null) | null = null

  const reapplyLaunchers = () => {
    const d = deltaGetter?.()
    if (d) moveLaunchers(d.dx, d.dy, d.includePanel)
  }

  /**
   * 持續把 launcher 平移到目前位置，並監看 tawk 容器，於 launcher 被重建/改樣式時即時重套。
   * getDelta 回傳 null 時暫停（例如對話開啟時）。每次呼叫會重新對準容器並立即套用一次。
   */
  const watchLaunchers = (getDelta: () => { dx: number; dy: number; includePanel?: boolean } | null) => {
    deltaGetter = getDelta
    reapplyLaunchers()

    const container = getLauncherIframes()[0]?.parentElement
    if (container && observedContainer !== container) {
      launcherObserver?.disconnect()
      observedContainer = container
      launcherObserver = new MutationObserver(reapplyLaunchers)
      launcherObserver.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "width", "height"],
      })
    }
  }

  const stopWatchLaunchers = () => {
    launcherObserver?.disconnect()
    launcherObserver = null
    observedContainer = null
    deltaGetter = null
  }

  onBeforeUnmount(() => {
    cleanup?.()
    stopWatchLaunchers()
  })

  return {
    /** 已辨識到的 bubble iframe */
    bubble,
    /** 輪詢等待 bubble 就緒 */
    waitBubble,
    /** 平移所有 launcher iframe（bubble + greeting） */
    moveLaunchers,
    /** 監看並持續把 launcher 平移到目前位置（greeting 重建時即時重套） */
    watchLaunchers,
    /** 隱藏原生 bubble */
    hideWidget,
    /** 顯示原生 bubble */
    showWidget,
    /** 切換對話視窗 */
    toggle,
    /** 開啟對話視窗 */
    maximize,
    /** 對話視窗是否開啟 */
    isChatOpen,
    /** 取得最大的可見 launcher（overlay/X 對齊用） */
    getPrimaryLauncher,
  }
}
