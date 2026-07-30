import { reactive } from "vue"
import { defineStore } from "pinia"
import type { WSChatMessage } from "src/types/websocket-chatroom.types"
import { WSConnectionState } from "src/types/websocket-chatroom.types"

/**
 * WebSocket 聊天室 Store 狀態
 */
type WebSocketChatState = {
  // WebSocket 連線相關
  connectionState: WSConnectionState // 連線狀態
  isConnected: boolean // 是否已連線
  lastError: string // 最後一次錯誤訊息
  reconnectAttempts: number // 重連次數

  // 訊息相關
  messages: WSChatMessage[] // 聊天訊息列表
  unreadCount: number // 未讀訊息數量
  isLoadingHistory: boolean // 是否正在載入歷史訊息

  // 使用者相關
  currentNickname: string // 當前暱稱
  needNickname: boolean // 是否需要輸入暱稱
  isNicknameDialogOpen: boolean // 暱稱輸入彈窗是否開啟

  // UI 相關
  isChatRoomOpen: boolean // 聊天室是否開啟
  isScrolledToBottom: boolean // 是否滾動到底部
  isTyping: boolean // 是否正在輸入

  // 草稿
  draftMessage: string // 草稿訊息
}

/**
 * WebSocket 聊天室 Store
 * @description 管理 WebSocket 聊天室的狀態和邏輯
 */
export const useWebSocketChatStore = defineStore("webSocketChatStore", () => {
  const webSocketChatState = reactive<WebSocketChatState>({
    // 連線狀態
    connectionState: WSConnectionState.DISCONNECTED,
    isConnected: false,
    lastError: "",
    reconnectAttempts: 0,

    // 訊息
    messages: [],
    unreadCount: 0,
    isLoadingHistory: false,

    // 使用者
    currentNickname: "",
    needNickname: false,
    isNicknameDialogOpen: false,

    // UI
    isChatRoomOpen: false,
    isScrolledToBottom: true,
    isTyping: false,

    // 草稿
    draftMessage: ""
  })

  // ==================== 連線狀態管理 ====================

  /**
   * 設定連線狀態
   */
  function setConnectionState(state: WSConnectionState) {
    webSocketChatState.connectionState = state
    webSocketChatState.isConnected = state === WSConnectionState.CONNECTED
  }

  /**
   * 設定最後錯誤訊息
   */
  function setLastError(error: string) {
    webSocketChatState.lastError = error
  }

  /**
   * 清除錯誤訊息
   */
  function clearError() {
    webSocketChatState.lastError = ""
  }

  /**
   * 設定重連次數
   */
  function setReconnectAttempts(attempts: number) {
    webSocketChatState.reconnectAttempts = attempts
  }

  /**
   * 增加重連次數
   */
  function incrementReconnectAttempts() {
    webSocketChatState.reconnectAttempts++
  }

  /**
   * 重置重連次數
   */
  function resetReconnectAttempts() {
    webSocketChatState.reconnectAttempts = 0
  }

  // ==================== 訊息管理 ====================

  /**
   * 設定訊息列表 (用於載入歷史訊息)
   */
  function setMessages(messages: WSChatMessage[]) {
    webSocketChatState.messages = messages
  }

  /**
   * 新增單一訊息
   */
  function addMessage(message: WSChatMessage) {
    // 檢查訊息是否已存在（根據 message_id 去重）
    const exists = webSocketChatState.messages.some((msg: WSChatMessage) => msg.message_id === message.message_id)
    if (exists) {
      console.warn(`[WebSocketChatStore] 訊息已存在，跳過添加: message_id=${message.message_id}`)
      return
    }

    webSocketChatState.messages.push(message)

    // 如果聊天室未開啟或未滾動到底部，增加未讀數量
    if (!webSocketChatState.isChatRoomOpen || !webSocketChatState.isScrolledToBottom) {
      webSocketChatState.unreadCount++
    }
  }

  /**
   * 批次新增訊息 (用於載入歷史訊息)
   */
  function addMessages(messages: WSChatMessage[]) {
    // 歷史訊息通常是從舊到新，直接 concat
    webSocketChatState.messages = [...messages, ...webSocketChatState.messages]
  }

  /**
   * 根據 message_id 更新訊息
   */
  function updateMessage(messageId: number, updates: Partial<WSChatMessage>) {
    const index = webSocketChatState.messages.findIndex((msg: WSChatMessage) => msg.message_id === messageId)
    if (index !== -1) {
      webSocketChatState.messages[index] = {
        ...webSocketChatState.messages[index],
        ...updates
      }
    }
  }

  /**
   * 根據 message_id 刪除訊息
   */
  function removeMessage(messageId: number) {
    webSocketChatState.messages = webSocketChatState.messages.filter(
      (msg: WSChatMessage) => msg.message_id !== messageId
    )
  }

  /**
   * 清空所有訊息
   */
  function clearMessages() {
    webSocketChatState.messages = []
  }

  /**
   * 設定歷史訊息載入狀態
   */
  function setLoadingHistory(loading: boolean) {
    webSocketChatState.isLoadingHistory = loading
  }

  // ==================== 未讀訊息管理 ====================

  /**
   * 設定未讀數量
   */
  function setUnreadCount(count: number) {
    webSocketChatState.unreadCount = count
  }

  /**
   * 增加未讀數量
   */
  function incrementUnreadCount() {
    webSocketChatState.unreadCount++
  }

  /**
   * 清除未讀數量
   */
  function clearUnreadCount() {
    webSocketChatState.unreadCount = 0
  }

  // ==================== 暱稱管理 ====================

  /**
   * 設定當前暱稱
   */
  function setCurrentNickname(nickname: string) {
    webSocketChatState.currentNickname = nickname
  }

  /**
   * 設定是否需要輸入暱稱
   */
  function setNeedNickname(need: boolean) {
    webSocketChatState.needNickname = need
    // 自動開啟暱稱輸入彈窗
    if (need) {
      webSocketChatState.isNicknameDialogOpen = true
    }
  }

  /**
   * 設定暱稱彈窗開啟狀態
   */
  function setNicknameDialogOpen(open: boolean) {
    webSocketChatState.isNicknameDialogOpen = open
  }

  // ==================== UI 狀態管理 ====================

  /**
   * 設定聊天室開啟狀態
   */
  function setChatRoomOpen(open: boolean) {
    webSocketChatState.isChatRoomOpen = open
    // 開啟聊天室時清除未讀數量
    if (open) {
      clearUnreadCount()
    }
  }

  /**
   * 切換聊天室開啟狀態
   */
  function toggleChatRoom() {
    setChatRoomOpen(!webSocketChatState.isChatRoomOpen)
  }

  /**
   * 設定是否滾動到底部
   */
  function setScrolledToBottom(scrolled: boolean) {
    webSocketChatState.isScrolledToBottom = scrolled
    // 滾動到底部時清除未讀數量
    if (scrolled && webSocketChatState.isChatRoomOpen) {
      clearUnreadCount()
    }
  }

  /**
   * 設定是否正在輸入
   */
  function setTyping(typing: boolean) {
    webSocketChatState.isTyping = typing
  }

  // ==================== 草稿管理 ====================

  /**
   * 設定草稿訊息
   */
  function setDraftMessage(draft: string) {
    webSocketChatState.draftMessage = draft
  }

  /**
   * 清除草稿訊息
   */
  function clearDraftMessage() {
    webSocketChatState.draftMessage = ""
  }

  // ==================== 重置 ====================

  /**
   * 重置整個 Store 狀態
   */
  function resetStore() {
    webSocketChatState.connectionState = WSConnectionState.DISCONNECTED
    webSocketChatState.isConnected = false
    webSocketChatState.lastError = ""
    webSocketChatState.reconnectAttempts = 0
    webSocketChatState.messages = []
    webSocketChatState.unreadCount = 0
    webSocketChatState.isLoadingHistory = false
    webSocketChatState.currentNickname = ""
    webSocketChatState.needNickname = false
    webSocketChatState.isNicknameDialogOpen = false
    webSocketChatState.isChatRoomOpen = false
    webSocketChatState.isScrolledToBottom = true
    webSocketChatState.isTyping = false
    webSocketChatState.draftMessage = ""
  }

  return {
    // 狀態
    webSocketChatState,

    // 連線狀態
    setConnectionState,
    setLastError,
    clearError,
    setReconnectAttempts,
    incrementReconnectAttempts,
    resetReconnectAttempts,

    // 訊息管理
    setMessages,
    addMessage,
    addMessages,
    updateMessage,
    removeMessage,
    clearMessages,
    setLoadingHistory,

    // 未讀訊息
    setUnreadCount,
    incrementUnreadCount,
    clearUnreadCount,

    // 暱稱管理
    setCurrentNickname,
    setNeedNickname,
    setNicknameDialogOpen,

    // UI 狀態
    setChatRoomOpen,
    toggleChatRoom,
    setScrolledToBottom,
    setTyping,

    // 草稿
    setDraftMessage,
    clearDraftMessage,

    // 重置
    resetStore
  }
})
