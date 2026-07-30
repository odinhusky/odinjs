import { storeToRefs } from "pinia"
import { useQuasar } from "quasar"
import { memberMessengerUnreadCount } from "src/api/memberMessenger"
import { useApi } from "src/common/hooks/useApi"
import { useEnv } from "src/common/hooks/useEnv"
import { useAuthStore } from "src/stores/authStore"
import { useWebSocketNotificationStore } from "src/stores/webSocketNotificationStore"
import type {
  WSNotificationData,
  WSNotificationPingData,
  WSNotificationPongMessage,
  WSNotificationResponse
} from "src/types/websocket-notification.types"
import { WSNotificationConnectionState, WSNotificationMessageType } from "src/types/websocket-notification.types"
import type { WatchStopHandle } from "vue"
import { computed, watch } from "vue"
import { useI18n } from "vue-i18n"

let ws: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let stopAuthWatcher: WatchStopHandle | null = null
let shouldReconnect = false

const INITIAL_RECONNECT_DELAY = 3000
const MAX_RECONNECT_DELAY = 30000

export function useWebSocketNotification() {
  const $q = useQuasar()
  const { t } = useI18n()
  const authStore = useAuthStore()
  const { envData } = useEnv()
  const notificationStore = useWebSocketNotificationStore()
  const { webSocketNotificationState } = storeToRefs(notificationStore)

  const isConnected = computed(() => webSocketNotificationState.value.isConnected)
  const connectionState = computed(() => webSocketNotificationState.value.connectionState)
  const unreadCount = computed(() => webSocketNotificationState.value.unreadCount)

  function connect() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return

    const token = authStore.access_token
    const { VITE_APP_BASE_API } = envData()

    if (!token || !VITE_APP_BASE_API) {
      notificationStore.setConnectionState(WSNotificationConnectionState.DISCONNECTED)
      notificationStore.setLastError(!token ? "Missing access_token" : "Missing VITE_APP_BASE_API")
      return
    }

    clearReconnectTimer()
    shouldReconnect = true

    try {
      const wsProtocol = VITE_APP_BASE_API.startsWith("https") ? "wss" : "ws"
      const wsBaseUrl = VITE_APP_BASE_API.replace(/^https?:\/\//, "").replace(/\/$/, "")
      const wsUrl = `${wsProtocol}://${wsBaseUrl}/platform/v1/player/notification?token=${encodeURIComponent(token)}`

      notificationStore.setConnectionState(
        webSocketNotificationState.value.reconnectAttempts > 0
          ? WSNotificationConnectionState.RECONNECTING
          : WSNotificationConnectionState.CONNECTING
      )

      ws = new WebSocket(wsUrl)
      ws.onopen = handleOpen
      ws.onmessage = handleMessage
      ws.onerror = handleError
      ws.onclose = handleClose
    } catch (error) {
      notificationStore.setConnectionState(WSNotificationConnectionState.ERROR)
      notificationStore.setLastError(getErrorMessage(error))
      scheduleReconnect()
    }
  }

  function handleOpen() {
    notificationStore.setConnectionState(WSNotificationConnectionState.CONNECTED)
    notificationStore.resetReconnectAttempts()
    notificationStore.clearError()
    void refreshUnreadCount()
  }

  function handleMessage(event: MessageEvent<string>) {
    try {
      const response = JSON.parse(event.data) as WSNotificationResponse

      if (response.code !== 0 || !response.data?.type) {
        notificationStore.setLastError(response.message || "Invalid notification response")
        return
      }

      if (response.data.type === WSNotificationMessageType.PING) {
        sendPong(response.data)
        return
      }

      if (response.data.type === WSNotificationMessageType.NOTIFICATION) {
        handleNotification(response.data)
      }
    } catch (error) {
      notificationStore.setLastError(getErrorMessage(error))
    }
  }

  function handleNotification(notification: WSNotificationData) {
    notificationStore.setLastNotification(notification)
    $q.notify({
      type: "positive",
      message: t(notification.subject_key),
      position: "top",
      timeout: 2500,
    })
    void refreshUnreadCount()
  }

  function sendPong(ping: WSNotificationPingData) {
    const pong: WSNotificationPongMessage = {
      type: "pong",
      timestamp: ping.timestamp,
    }
    sendMessage(pong)
  }

  function sendMessage(message: object): boolean {
    if (!ws || ws.readyState !== WebSocket.OPEN) return false

    try {
      ws.send(JSON.stringify(message))
      return true
    } catch (error) {
      notificationStore.setLastError(getErrorMessage(error))
      return false
    }
  }

  function handleError() {
    notificationStore.setConnectionState(WSNotificationConnectionState.ERROR)
    notificationStore.setLastError("WebSocket notification connection failed")
  }

  function handleClose() {
    ws = null
    notificationStore.setConnectionState(WSNotificationConnectionState.DISCONNECTED)
    if (shouldReconnect) scheduleReconnect()
  }

  function scheduleReconnect() {
    if (!shouldReconnect || reconnectTimer || !authStore.access_token) return

    notificationStore.incrementReconnectAttempts()
    notificationStore.setConnectionState(WSNotificationConnectionState.RECONNECTING)

    const exponent = Math.max(webSocketNotificationState.value.reconnectAttempts - 1, 0)
    const delay = Math.min(INITIAL_RECONNECT_DELAY * 2 ** exponent, MAX_RECONNECT_DELAY)

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null
      connect()
    }, delay)
  }

  async function refreshUnreadCount() {
    notificationStore.setRefreshingUnreadCount(true)

    try {
      const { status, data, msg } = await useApi(memberMessengerUnreadCount, undefined, { silent: true })

      if (status && data) {
        notificationStore.setUnreadCount(data)
      } else if (msg) {
        notificationStore.setLastError(msg)
      }

      return { status, data }
    } catch (error) {
      notificationStore.setLastError(getErrorMessage(error))
      return { status: false, data: undefined }
    } finally {
      notificationStore.setRefreshingUnreadCount(false)
    }
  }

  function disconnect() {
    shouldReconnect = false
    clearReconnectTimer()

    if (ws) {
      ws.onclose = null
      ws.close(1000, "[Close Normally]")
      ws = null
    }

    notificationStore.setConnectionState(WSNotificationConnectionState.DISCONNECTED)
    notificationStore.resetReconnectAttempts()
  }

  function startNotificationSocket() {
    if (stopAuthWatcher) return

    stopAuthWatcher = watch(
      () => authStore.access_token,
      (token, previousToken) => {
        if (!token) {
          disconnect()
          return
        }

        if (token !== previousToken) {
          disconnect()
          connect()
        }
      },
      { immediate: true }
    )
  }

  function stopNotificationSocket() {
    stopAuthWatcher?.()
    stopAuthWatcher = null
    disconnect()
  }

  return {
    isConnected,
    connectionState,
    unreadCount,
    webSocketNotificationState,
    connect,
    disconnect,
    startNotificationSocket,
    stopNotificationSocket,
    refreshUnreadCount,
  }
}

function clearReconnectTimer() {
  if (!reconnectTimer) return
  clearTimeout(reconnectTimer)
  reconnectTimer = null
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export function cleanupWebSocketNotification() {
  shouldReconnect = false
  clearReconnectTimer()

  if (ws) {
    ws.onclose = null
    ws.close(1000, "[Close Normally]")
    ws = null
  }

  useWebSocketNotificationStore().resetStore()
}
