import throttle from "lodash/throttle"
import { storeToRefs } from "pinia"
import { Notify } from "quasar"
import { authLogout } from "src/api/login"
import { useAuth } from "src/common/hooks/useAuth"
import { ERROR_CODE_TYPE, LOGOUT_REASON } from "src/common/utils/constants"
import { SESSION_IDLE_TIMEOUT } from "src/common/utils/constants/durationTime"
import { router } from "src/router/index"
import { useAuthStore } from "src/stores/authStore"
import { useEnvInfoStore } from "src/stores/envStore"
import { computed, onUnmounted, watch } from "vue"
import { useRoute } from "vue-router"

/**
 * Session 閒置逾時：client 端偵測無操作後登出，以及 server 回傳 901011 時的共用處理。
 * 僅在 `/v1/player/settings` 的 `mga_mode === 1` 且已登入時啟用 client 端偵測。
 */

/** 供遊戲／下注等程式化操作主動重置閒置計時器 */
export const SESSION_IDLE_ACTIVITY_EVENT = "session-idle-activity"

export type HandleSessionIdleTimeoutOptions = {
  message?: string
  fallbackMessage?: string
  resetAuth?: () => void
  /** client 觸發時通知後端登出，不等待回應 */
  notifyServer?: boolean
}

/** 防止 client / server 同時觸發時重複 notify、清除與跳轉 */
let isHandlingSessionIdleTimeout = false

/** 登出或 reset auth 後重置，避免重新登入後無法再次觸發 idle timeout */
export function resetSessionIdleTimeoutGuard() {
  isHandlingSessionIdleTimeout = false
}

/** 優先使用 i18n，無翻譯時 fallback 至 API msg 或空字串 */
function resolveIdleTimeoutMessage(message?: string, fallbackMessage?: string) {
  const i18nKey = ERROR_CODE_TYPE.I18nKeys[ERROR_CODE_TYPE.Enums.CORE_SESSION_IDLE_TIMEOUT] as string

  if (message && message !== i18nKey) return message

  if (typeof $te !== "undefined" && $te(i18nKey)) {
    return $t(i18nKey)
  }

  return fallbackMessage || message || ""
}

/**
 * 閒置逾時登出共用流程：Notify →（可選）authLogout → 清除 auth → 跳轉登入頁。
 * client 與 server（901011）皆呼叫此函式；server 觸發時不帶 notifyServer。
 */
export function handleSessionIdleTimeout(options: HandleSessionIdleTimeoutOptions = {}) {
  const authStore = useAuthStore()
  const accessToken = authStore.access_token

  if (!accessToken || isHandlingSessionIdleTimeout) return

  isHandlingSessionIdleTimeout = true

  // 必須在 resetAuth 前先送出，並帶入當下 token，避免 interceptor 讀到已清空的 store
  if (options.notifyServer) {
    authLogout({ reason: LOGOUT_REASON.Enums.IdleTimeout }, accessToken).catch(() => undefined)
  }

  const notifyMessage = resolveIdleTimeoutMessage(options.message, options.fallbackMessage)

  Notify.create({
    type: "negative",
    position: "top",
    message: notifyMessage,
    icon: "warning",
    timeout: 1000,
  })

  const resetAuth = options.resetAuth ?? (() => useAuth().reset())
  resetAuth()

  router.push({ path: "/login" })
}

export function touchSessionActivity() {
  window.dispatchEvent(new Event(SESSION_IDLE_ACTIVITY_EVENT))
}

const ACTIVITY_LISTENER_OPTIONS: AddEventListenerOptions = { passive: true, capture: true }

/**
 * 監聽使用者互動事件，30 分鐘無操作時觸發 client 端 idle timeout 登出。
 * 在 App.vue 全域啟用；mga_mode !== 1 或未登入時不監聽。
 */
export function useSessionIdleTimeout() {
  const { isLogin, reset } = useAuth()
  const envStore = useEnvInfoStore()
  const { isMgaModeEnabled } = storeToRefs(envStore)
  const route = useRoute()

  const shouldWatchIdle = computed(() => isLogin.value && isMgaModeEnabled.value)

  let idleTimer: ReturnType<typeof setTimeout> | null = null
  let isHandlingTimeout = false

  const clearIdleTimer = () => {
    if (idleTimer !== null) {
      clearTimeout(idleTimer)
      idleTimer = null
    }
  }

  const handleIdleTimeout = () => {
    if (!isLogin.value || isHandlingTimeout) return

    if (import.meta.env.DEV) {
      console.debug("[session-idle] timeout fired")
    }

    isHandlingTimeout = true
    clearIdleTimer()

    handleSessionIdleTimeout({
      resetAuth: reset,
      notifyServer: true,
    })
  }

  const resetIdleTimer = () => {
    if (!shouldWatchIdle.value) return

    clearIdleTimer()
    idleTimer = setTimeout(handleIdleTimeout, SESSION_IDLE_TIMEOUT)
  }

  const onActivity = throttle(
    () => {
      resetIdleTimer()
    },
    1000,
    // mousemove 高頻觸發，節流避免過度重置計時器
    { leading: true, trailing: true }
  )

  const bindActivityListeners = () => {
    window.addEventListener("mousemove", onActivity, ACTIVITY_LISTENER_OPTIONS)
    window.addEventListener("click", onActivity, ACTIVITY_LISTENER_OPTIONS)
    window.addEventListener("keydown", onActivity, ACTIVITY_LISTENER_OPTIONS)
    window.addEventListener("touchstart", onActivity, ACTIVITY_LISTENER_OPTIONS)
    // 遊戲 iframe 請改用 touchSessionActivity()；window message 太頻繁會不斷重置計時器
    window.addEventListener(SESSION_IDLE_ACTIVITY_EVENT, onActivity, ACTIVITY_LISTENER_OPTIONS)
  }

  const unbindActivityListeners = () => {
    window.removeEventListener("mousemove", onActivity, ACTIVITY_LISTENER_OPTIONS)
    window.removeEventListener("click", onActivity, ACTIVITY_LISTENER_OPTIONS)
    window.removeEventListener("keydown", onActivity, ACTIVITY_LISTENER_OPTIONS)
    window.removeEventListener("touchstart", onActivity, ACTIVITY_LISTENER_OPTIONS)
    window.removeEventListener(SESSION_IDLE_ACTIVITY_EVENT, onActivity, ACTIVITY_LISTENER_OPTIONS)
    onActivity.cancel()
  }

  const startIdleWatcher = () => {
    bindActivityListeners()
    resetIdleTimer()
  }

  const stopIdleWatcher = () => {
    clearIdleTimer()
    unbindActivityListeners()
    isHandlingTimeout = false
  }

  watch(
    shouldWatchIdle,
    (enabled) => {
      if (import.meta.env.DEV) {
        console.debug("[session-idle]", enabled ? "start watcher" : "stop watcher", {
          isLogin: isLogin.value,
          mga_mode: envStore.envInfo.mga_mode,
          timeoutMs: SESSION_IDLE_TIMEOUT,
        })
      }

      if (enabled) {
        startIdleWatcher()
      } else {
        stopIdleWatcher()
      }
    },
    { immediate: true }
  )

  watch(
    () => route.fullPath,
    () => {
      // 頁面切換視為有效互動，直接重置（不走 throttle）
      if (shouldWatchIdle.value) {
        resetIdleTimer()
      }
    }
  )

  onUnmounted(() => {
    stopIdleWatcher()
  })
}
