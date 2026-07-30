/**
 * WebSocket 聊天室型別定義
 * @description Player Chatroom WebSocket 相關的型別定義
 */

// ==================== 列舉 ====================

/**
 * WebSocket 訊息類型
 */
export enum WSMessageType {
  PING = 'ping',
  PONG = 'pong',
  TEXT = 'text',
  IMAGE = 'image',
  GET_HISTORY = 'get_history',
  UPDATE_NICKNAME = 'update_nickname'
}

/**
 * WebSocket 連線狀態
 */
export enum WSConnectionState {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  RECONNECTING = 'RECONNECTING',
  ERROR = 'ERROR'
}

/**
 * WebSocket 錯誤代碼
 */
export enum WSErrorCode {
  CONNECTION_NOT_FOUND = 400008001,
  MESSAGE_FORMAT_ERROR = 400008002,
  CONTENT_SENSITIVE = 400008003,
  TYPE_NOT_SUPPORTED = 400008004,
  HANDLE_FAILED = 400008005,
  INVALID_FILE_EXTENSION = 400008006,
  CLIENT_DISCONNECTED = 400008007,
  SERVER_DISCONNECTED = 400008008,
  TOO_FREQUENT = 400008009,
  FETCH_HISTORY_FAILED = 400008010,
  FETCH_NICKNAME_ERROR = 400008011,
  EMPTY_NICKNAME = 400008012,
  NICKNAME_TOO_LONG = 400008013,
  NICKNAME_IN_USE = 400008014,
  NICKNAME_RESERVED = 400008015,
  NICKNAME_INVALID_BYTE = 400008016,
  NICKNAME_WITH_SOCIAL_NAME = 400008017,
  NICKNAME_WITH_DOMAIN = 400008018,
  NICKNAME_WITH_PHONE = 400008019,
  NICKNAME_WITH_REPEATED_CHARS = 400008020,
  TOO_MANY_REQUESTS = 400008021,
  DEFAULT_ERROR = 400008999
}

// ==================== 基礎介面 ====================

/**
 * 基礎 WebSocket 回應
 */
export interface WSBaseResponse<T = any> {
  message: string
  code: number
  data: T
}

/**
 * 圖片資訊
 */
export interface WSImageInfo {
  name: string
  full_path: string
  path: string
}

// ==================== 接收的訊息 ====================

/**
 * Ping 訊息資料
 */
export interface WSPingData {
  timestamp: number
  trace_id: string
  type: 'ping'
}

/**
 * 聊天室訊息 (接收)
 */
export interface WSChatMessage {
  agent_id: number
  message_id: number
  sender: string
  sender_id: number
  timestamp: number
  type: 'text' | 'image'
  content?: string  // text 類型時存在
  image_info_list?: WSImageInfo[]  // image 類型時存在
}

/**
 * 歷史訊息回應資料
 */
export interface WSHistoryData {
  type: 'get_history'
  timestamp: number
  history: WSChatMessage[]
}

// ==================== 發送的訊息 ====================

/**
 * Pong 訊息 (發送)
 */
export interface WSSendPongMessage {
  type: 'pong'
  timestamp: number
}

/**
 * 文字訊息 (發送)
 */
export interface WSSendTextMessage {
  type: 'text'
  timestamp: number
  content: string
}

/**
 * 圖片訊息 (發送)
 */
export interface WSSendImageMessage {
  type: 'image'
  timestamp: number
  image_info_list: WSImageInfo[]
}

/**
 * 更新暱稱 (發送)
 */
export interface WSSendUpdateNicknameMessage {
  type: 'update_nickname'
  nickname: string
}

/**
 * 請求歷史訊息 (發送)
 */
export interface WSSendGetHistoryMessage {
  type: 'get_history'
  timestamp?: number
}

// ==================== 聯合類型 ====================

/**
 * 所有發送的訊息類型
 */
export type WSSendMessage =
  | WSSendPongMessage
  | WSSendTextMessage
  | WSSendImageMessage
  | WSSendUpdateNicknameMessage
  | WSSendGetHistoryMessage

/**
 * 錯誤訊息 i18n key 對應表
 * 使用方式: $t(`websocket.${WSErrorI18nKeys[errorCode]}`)
 */
export const WSErrorI18nKeys: Record<WSErrorCode, string> = {
  [WSErrorCode.CONNECTION_NOT_FOUND]: 'connection_doesnt_exit',
  [WSErrorCode.MESSAGE_FORMAT_ERROR]: 'message_format_incorrect',
  [WSErrorCode.CONTENT_SENSITIVE]: 'message_with_baned_content',
  [WSErrorCode.TYPE_NOT_SUPPORTED]: 'message_with_unsupported_type',
  [WSErrorCode.HANDLE_FAILED]: 'handle_message_fail',
  [WSErrorCode.INVALID_FILE_EXTENSION]: 'invalid_file_extension',
  [WSErrorCode.CLIENT_DISCONNECTED]: 'client_disconnection',
  [WSErrorCode.SERVER_DISCONNECTED]: 'server_actively_disconnection',
  [WSErrorCode.TOO_FREQUENT]: 'too_many_messages_sent',
  [WSErrorCode.FETCH_HISTORY_FAILED]: 'fail_to_get_history',
  [WSErrorCode.FETCH_NICKNAME_ERROR]: 'fail_to_get_nickname',
  [WSErrorCode.EMPTY_NICKNAME]: 'without_nickname',
  [WSErrorCode.NICKNAME_TOO_LONG]: 'nickname_too_long',
  [WSErrorCode.NICKNAME_IN_USE]: 'nickname_duplicated',
  [WSErrorCode.NICKNAME_RESERVED]: 'nickname_reserved_word',
  [WSErrorCode.NICKNAME_INVALID_BYTE]: 'nickname_not_allow_punctionMark',
  [WSErrorCode.NICKNAME_WITH_SOCIAL_NAME]: 'nickname_with_social_media_words',
  [WSErrorCode.NICKNAME_WITH_DOMAIN]: 'nickname_with_domain_info',
  [WSErrorCode.NICKNAME_WITH_PHONE]: 'nickname_with_phone_number',
  [WSErrorCode.NICKNAME_WITH_REPEATED_CHARS]: 'nickname_with_series_char',
  [WSErrorCode.TOO_MANY_REQUESTS]: 'too_many_messages_sent_again',
  [WSErrorCode.DEFAULT_ERROR]: 'default_error'
}
