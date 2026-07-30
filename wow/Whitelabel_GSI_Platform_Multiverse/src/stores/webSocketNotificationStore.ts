import { defineStore } from "pinia"
import type { MemberMessengerUnreadCount } from "src/api/memberMessenger.type"
import type { WSNotificationData } from "src/types/websocket-notification.types"
import { WSNotificationConnectionState } from "src/types/websocket-notification.types"
import { reactive } from "vue"

type WebSocketNotificationState = {
  connectionState: WSNotificationConnectionState
  isConnected: boolean
  lastError: string
  reconnectAttempts: number
  unreadCount: MemberMessengerUnreadCount
  isRefreshingUnreadCount: boolean
  lastNotification: WSNotificationData | null
}

const initialUnreadCount = (): MemberMessengerUnreadCount => ({
  notification_unread: 0,
  inquiry_unread: 0,
  total: 0,
})

export const useWebSocketNotificationStore = defineStore("webSocketNotificationStore", () => {
  const webSocketNotificationState = reactive<WebSocketNotificationState>({
    connectionState: WSNotificationConnectionState.DISCONNECTED,
    isConnected: false,
    lastError: "",
    reconnectAttempts: 0,
    unreadCount: initialUnreadCount(),
    isRefreshingUnreadCount: false,
    lastNotification: null,
  })

  function setConnectionState(state: WSNotificationConnectionState) {
    webSocketNotificationState.connectionState = state
    webSocketNotificationState.isConnected = state === WSNotificationConnectionState.CONNECTED
  }

  function setLastError(error: string) {
    webSocketNotificationState.lastError = error
  }

  function clearError() {
    webSocketNotificationState.lastError = ""
  }

  function incrementReconnectAttempts() {
    webSocketNotificationState.reconnectAttempts++
  }

  function resetReconnectAttempts() {
    webSocketNotificationState.reconnectAttempts = 0
  }

  function setUnreadCount(unreadCount: MemberMessengerUnreadCount) {
    webSocketNotificationState.unreadCount = unreadCount
  }

  function setRefreshingUnreadCount(isRefreshing: boolean) {
    webSocketNotificationState.isRefreshingUnreadCount = isRefreshing
  }

  function setLastNotification(notification: WSNotificationData) {
    webSocketNotificationState.lastNotification = notification
  }

  function resetStore() {
    webSocketNotificationState.connectionState = WSNotificationConnectionState.DISCONNECTED
    webSocketNotificationState.isConnected = false
    webSocketNotificationState.lastError = ""
    webSocketNotificationState.reconnectAttempts = 0
    webSocketNotificationState.unreadCount = initialUnreadCount()
    webSocketNotificationState.isRefreshingUnreadCount = false
    webSocketNotificationState.lastNotification = null
  }

  return {
    webSocketNotificationState,
    setConnectionState,
    setLastError,
    clearError,
    incrementReconnectAttempts,
    resetReconnectAttempts,
    setUnreadCount,
    setRefreshingUnreadCount,
    setLastNotification,
    resetStore,
  }
})
