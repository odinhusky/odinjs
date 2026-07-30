export enum WSNotificationConnectionState {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  RECONNECTING = "reconnecting",
  ERROR = "error"
}

export enum WSNotificationMessageType {
  NOTIFICATION = "notification",
  PING = "ping"
}

export interface WSNotificationData {
  type: WSNotificationMessageType.NOTIFICATION
  biz_source: number
  subject_key: string
}

export interface WSNotificationPingData {
  type: WSNotificationMessageType.PING
  trace_id: string
  timestamp: number
}

export type WSNotificationResponseData = WSNotificationData | WSNotificationPingData

export interface WSNotificationResponse {
  message: string
  code: number
  data: WSNotificationResponseData
}

export interface WSNotificationPongMessage {
  type: "pong"
  timestamp: number
}
