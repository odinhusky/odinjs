import { computed } from "vue"
import { useQuasar } from "quasar"
import { storeToRefs } from "pinia"
import { useI18n } from "vue-i18n"
import { useEnv } from "src/common/hooks/useEnv"
import { useEventBus } from "src/common/hooks/useEventBus"
import { useWebSocketChatStore } from "src/stores/webSocketChatStore"
import { useAuthStore } from "src/stores/authStore"
import type {
  WSBaseResponse,
  WSPingData,
  WSSendPongMessage,
  WSSendTextMessage,
  WSSendImageMessage,
  WSSendUpdateNicknameMessage,
  WSSendGetHistoryMessage,
  WSChatMessage,
  WSHistoryData,
  WSImageInfo
} from "src/types/websocket-chatroom.types"
import { WSErrorI18nKeys, WSConnectionState, WSErrorCode } from "src/types/websocket-chatroom.types"

// ==================== 單例模式：模組層級變數 ====================
// WebSocket 實例（全域共享，避免多次呼叫 useWebSocketChat 時重複創建）
let ws: WebSocket | null = null

// 重連計時器（全域共享）
let reconnectTimer: ReturnType<typeof setTimeout> | null = null

// 重連配置
const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_DELAY = 3000 // 3秒

/**
 * WebSocket 聊天室 Composable
 * @description 管理 WebSocket 連線和訊息處理（單例模式）
 */
export function useWebSocketChat() {
  const $q = useQuasar()
  const { t: $t } = useI18n()
  const authStore = useAuthStore()
  const { envData } = useEnv()
  const { eventEmit } = useEventBus()
  const webSocketChatStore = useWebSocketChatStore()
  const { webSocketChatState } = storeToRefs(webSocketChatStore)

  // ==================== Computed ====================

  const isConnected = computed(() => webSocketChatState.value.isConnected)
  const connectionState = computed(() => webSocketChatState.value.connectionState)
  const messages = computed(() => webSocketChatState.value.messages)

  // ==================== 連線管理 ====================

  /**
   * 建立 WebSocket 連線
   */
  function connect() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.warn("[WebSocketChat] 已經連線中")
      return
    }

    const { VITE_APP_BASE_API } = envData()
    const token = authStore.access_token

    if (!token) {
      console.error("[WebSocketChat] Missing access_token") // 缺少 access_token
      // 打開登入 Dialog
      eventEmit("openLogin", true)
      return
    }

    try {
      // 將 http(s) 轉換為 ws(s)
      const wsProtocol = VITE_APP_BASE_API.startsWith("https") ? "wss" : "ws"
      const wsBaseUrl = VITE_APP_BASE_API.replace(/^https?:\/\//, "")

      // 透過 Query String 傳遞 token
      const wsUrl = `${wsProtocol}://${wsBaseUrl}/platform/v1/player/chatroom?token=${token}`

      console.log("[WebSocketChat] 開始連線...", wsUrl)
      webSocketChatStore.setConnectionState(WSConnectionState.CONNECTING)

      ws = new WebSocket(wsUrl)

      // 監聽連線開啟
      ws.onopen = handleOpen

      // 監聽訊息
      ws.onmessage = handleMessage

      // 監聽錯誤
      ws.onerror = handleError

      // 監聽連線關閉
      ws.onclose = handleClose
    } catch (error) {
      console.error("[WebSocketChat] 連線失敗:", error)
      webSocketChatStore.setConnectionState(WSConnectionState.ERROR)
      const errorMsg = error instanceof Error ? error.message : $t("websocket.connection_fail")
      webSocketChatStore.setLastError(errorMsg)
      showErrorNotify(errorMsg)
    }
  }

  /**
   * 連線開啟處理
   */
  function handleOpen() {
    console.log("[WebSocketChat] 連線成功")
    webSocketChatStore.setConnectionState(WSConnectionState.CONNECTED)
    webSocketChatStore.resetReconnectAttempts()
    webSocketChatStore.clearError()

    // 連線成功後自動請求歷史訊息
    requestHistory()
  }

  /**
   * 訊息處理
   */
  function handleMessage(event: MessageEvent) {
    try {
      const response: WSBaseResponse = JSON.parse(event.data)

      console.log("[WebSocketChat] 收到訊息:", response)

      // 處理成功回應 (code === 0)
      if (response.code === 0) {
        handleSuccessMessage(response)
      }
      // 處理錯誤回應
      else {
        handleErrorResponse(response)
      }
    } catch (error) {
      console.error("[WebSocketChat] 解析訊息失敗:", error)
      showErrorNotify($t("websocket.message_parse_fail"))
    }
  }

  /**
   * 處理成功訊息
   */
  function handleSuccessMessage(response: WSBaseResponse) {
    const { data } = response

    // 判斷訊息類型
    if (!data || !data.type) {
      console.warn("[WebSocketChat] 訊息缺少 type 欄位:", data)
      return
    }

    switch (data.type) {
      case "ping":
        // 收到 ping，回應 pong
        handlePing(data as WSPingData)
        break

      case "get_history":
        // 收到歷史訊息
        handleHistory(data as WSHistoryData)
        break

      case "text":
      case "image":
        // 收到新的聊天訊息
        handleChatMessage(data as WSChatMessage)
        break

      default:
        console.log("[WebSocketChat] 未處理的訊息類型:", data.type)
    }
  }

  /**
   * 處理 Ping
   */
  function handlePing(data: WSPingData) {
    console.log("[WebSocketChat] 收到 ping, 回應 pong")
    sendPong(data.timestamp)
  }

  /**
   * 處理歷史訊息
   */
  function handleHistory(data: WSHistoryData) {
    console.log("[WebSocketChat] 收到歷史訊息:", data.history.length, "筆")
    webSocketChatStore.setMessages(data.history.reverse()) // 反轉順序，讓最新的在最後
    webSocketChatStore.setLoadingHistory(false)
  }

  /**
   * 處理聊天訊息
   */
  function handleChatMessage(message: WSChatMessage) {
    console.log("[WebSocketChat] 收到新訊息:", message)
    webSocketChatStore.addMessage(message)

    // 新訊息通知（如果聊天室未開啟）
    // TODO: 未來需求 - 新訊息通知功能
    // if (!webSocketChatState.value.isChatRoomOpen) {
    //   $q.notify({
    //     type: "info",
    //     message: `${message.sender}: ${message.content || "圖片訊息"}`,
    //     position: "top-right",
    //     timeout: 2000,
    //     actions: [
    //       {
    //         label: "查看",
    //         color: "white",
    //         handler: () => {
    //           webSocketChatStore.setChatRoomOpen(true)
    //         }
    //       }
    //     ]
    //   })
    // }
  }

  /**
   * 處理錯誤回應
   */
  function handleErrorResponse(response: WSBaseResponse) {
    const { code, message } = response

    console.error("[WebSocketChat] 錯誤:", code, message)

    // 不需要做任何處理的錯誤碼
    const IGNORE_ERROR_CODES: number[] = [WSErrorCode.FETCH_NICKNAME_ERROR, WSErrorCode.FETCH_NICKNAME_ERROR]

    if (IGNORE_ERROR_CODES.includes(Number(code))) return

    // 從錯誤代碼取得 i18n key，然後翻譯
    const i18nKey = WSErrorI18nKeys[code as WSErrorCode]
    const errorMessage = i18nKey ? $t(`websocket.${i18nKey}`) : message || $t("websocket.default_error")

    webSocketChatStore.setLastError(errorMessage)

    // 特殊處理：需要輸入暱稱（400008012）
    if (Number(code) === WSErrorCode.EMPTY_NICKNAME) {
      webSocketChatStore.setNeedNickname(true)
      webSocketChatStore.setNicknameDialogOpen(true)
      // 不顯示錯誤通知並打開暱稱輸入彈窗
      // showErrorNotify(errorMessage)
      return
    }

    // 特殊處理：暱稱重複的文案修正
    if (Number(code) === WSErrorCode.NICKNAME_IN_USE) {
      showErrorNotify($t("chat_room.nickname_duplicated"))
      return
    }

    // 顯示錯誤通知
    showErrorNotify(errorMessage)
  }

  /**
   * 錯誤處理
   */
  function handleError(event: Event) {
    console.error("[WebSocketChat] 發生錯誤:", event)
    webSocketChatStore.setConnectionState(WSConnectionState.ERROR)
    webSocketChatStore.setLastError($t("websocket.connection_fail"))
    showErrorNotify($t("websocket.connection_fail"))
  }

  /**
   * 連線關閉處理
   */
  function handleClose(event: CloseEvent) {
    console.log("[WebSocketChat] 連線關閉:", event.code, event.reason)
    webSocketChatStore.setConnectionState(WSConnectionState.DISCONNECTED)

    // 正常關閉 (code 1000) 不需要重連
    if (event.code === 1000) {
      $q.notify({
        type: "info",
        message: $t("chatRoom.chatroom_break"),
        position: "top",
        timeout: 1500
      })
      return
    }

    // 非正常關閉，嘗試重連
    if (webSocketChatState.value.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      attemptReconnect()
    } else {
      console.log("連線已中斷，請重新整理頁面")
    }
  }

  /**
   * 嘗試重新連線
   */
  function attemptReconnect() {
    webSocketChatStore.incrementReconnectAttempts()
    webSocketChatStore.setConnectionState(WSConnectionState.RECONNECTING)

    const attempts = webSocketChatState.value.reconnectAttempts
    console.log(`[WebSocketChat] 嘗試重連 (${attempts}/${MAX_RECONNECT_ATTEMPTS})`)

    $q.notify({
      type: "warning",
      message: $t("chatRoom.chatroom_reconnect", { attempts, max_reconnect_attemps: MAX_RECONNECT_ATTEMPTS }),
      position: "top",
      timeout: 1500
    })

    reconnectTimer = setTimeout(() => {
      connect()
    }, RECONNECT_DELAY)
  }

  // ==================== 發送訊息 ====================

  /**
   * 發送訊息（通用方法）
   * @description UI 層已透過 disabled 屬性防止未連線時的操作，此函式僅處理實際發送邏輯
   */
  function sendMessage(message: object): boolean {
    // UI 層已經透過 disabled 屬性檢查 isConnected，這裡只做防禦性檢查 (defensive check)
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("[WebSocketChat] Connection not established") // 連線尚未建立或已關閉
      return false
    }

    try {
      const messageStr = JSON.stringify(message)
      console.log("[WebSocketChat] Sending message:", messageStr) // 發送訊息
      ws.send(messageStr)
      return true
    } catch (error) {
      console.error("[WebSocketChat] Failed to send message:", error) // 發送訊息失敗
      showErrorNotify($t("process_status.failed")) // 發送訊息失敗
      return false
    }
  }

  /**
   * 發送 Pong
   */
  function sendPong(timestamp: number) {
    const message: WSSendPongMessage = {
      type: "pong",
      timestamp
    }
    sendMessage(message)
  }

  /**
   * 發送文字訊息
   */
  function sendText(content: string): boolean {
    if (!content.trim()) {
      return false
    }

    const message: WSSendTextMessage = {
      type: "text",
      timestamp: Date.now(),
      content: content.trim()
    }

    const success = sendMessage(message)
    if (success) {
      // 清除草稿
      webSocketChatStore.clearDraftMessage()
    }
    return success
  }

  /**
   * 發送圖片訊息
   */
  function sendImage(imageInfoList: WSImageInfo[]): boolean {
    if (!imageInfoList || imageInfoList.length === 0) {
      showErrorNotify($t("chat_room.please_select_image"))
      return false
    }

    const message: WSSendImageMessage = {
      type: "image",
      timestamp: Date.now(),
      image_info_list: imageInfoList
    }

    return sendMessage(message)
  }

  /**
   * 更新暱稱
   */
  function updateNickname(nickname: string): boolean {
    const message: WSSendUpdateNicknameMessage = {
      type: "update_nickname",
      nickname: nickname.trim()
    }

    const success = sendMessage(message)
    if (success) {
      webSocketChatStore.setCurrentNickname(nickname.trim())
      webSocketChatStore.setNeedNickname(false)
      webSocketChatStore.setNicknameDialogOpen(false)

      // 暱稱創建成功不需要 notify
      // $q.notify({
      //   type: "positive",
      //   message: $t("common.alarm.createSuccess"), // 暱稱已創建
      //   position: "top",
      //   timeout: 1500
      // })

      // 更新暱稱成功後請求歷史訊息
      requestHistory()
    }
    return success
  }

  /**
   * 請求歷史訊息
   */
  function requestHistory(): boolean {
    webSocketChatStore.setLoadingHistory(true)

    const message: WSSendGetHistoryMessage = {
      type: "get_history",
      timestamp: Date.now()
    }

    const success = sendMessage(message)
    if (!success) {
      webSocketChatStore.setLoadingHistory(false)
    }
    return success
  }

  // ==================== 中斷連線 ====================

  /**
   * 中斷連線
   */
  function disconnect() {
    console.log("[WebSocketChat] 主動中斷連線")

    // 清除重連計時器
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }

    // 關閉 WebSocket
    if (ws) {
      ws.close(1000, "[Close Normally]") // 正常關閉
      ws = null
    }

    webSocketChatStore.setConnectionState(WSConnectionState.DISCONNECTED)
    webSocketChatStore.resetReconnectAttempts()
  }

  // ==================== 工具方法 ====================

  /**
   * 顯示錯誤通知
   */
  function showErrorNotify(message: string) {
    $q.notify({
      type: "negative",
      message,
      position: "top",
      timeout: 2500
    })
  }

  // ==================== 生命週期 ====================

  // 只在關閉分頁或登出時斷線，不在元件卸載時斷線
  // 監聽瀏覽器關閉或重新整理
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", disconnect)
  }

  // ==================== 返回 ====================

  return {
    // 狀態
    isConnected,
    connectionState,
    messages,

    // 連線管理
    connect,
    disconnect,

    // 發送訊息
    sendText,
    sendImage,
    updateNickname,
    requestHistory
  }
}

/**
 * 清理 WebSocket 連線（獨立函式，避免循環依賴）
 * @description 供登出時使用，不需要創建 useWebSocketChat 實例
 */
export function cleanupWebSocketChat() {
  // 清除重連計時器
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  // 關閉 WebSocket
  if (ws) {
    ws.close(1000, "[Close Normally]") // 正常關閉
    ws = null
  }

  // 移除 beforeunload 事件監聽器
  if (typeof window !== "undefined") {
    // 由於 disconnect 函式在 useWebSocketChat 內部，這裡需要重新定義關閉邏輯
    // 或者將 disconnect 也提升到模組層級
  }

  // 重置 store 狀態
  const webSocketChatStore = useWebSocketChatStore()
  webSocketChatStore.setConnectionState(WSConnectionState.DISCONNECTED)
  webSocketChatStore.resetReconnectAttempts()

  // 關閉聊天室面板（登出時收合）
  webSocketChatStore.setChatRoomOpen(false)

  // 清空聊天記錄和其他狀態
  webSocketChatStore.resetStore()
}
