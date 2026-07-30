export interface MemberMessengerListRequest {
  offset?: number
  size?: number
  start_date?: number
  end_date?: number
  status?: number
}

export type MemberMessengerInboxRequest = MemberMessengerListRequest
export type MemberMessengerOutboxRequest = MemberMessengerListRequest

/** GET /platform/v1/player/messages/unread-count */
export interface MemberMessengerUnreadCount {
  notification_unread: number
  inquiry_unread: number
  total: number
}

export interface MemberMessengerLocalizedSubject {
  lang: string
  subject: string
}

export interface MemberMessengerInboxItem {
  id: number
  sender_type?: number
  biz_source?: number
  subject_key?: string
  /** 新 API：多語系標題 */
  subjects?: MemberMessengerLocalizedSubject[]
  /** 舊 API／寄件匣列表 */
  subject?: string
  /** 新 API：與 outbox 一致 */
  last_msg_at?: string
  view_status?: number
  published_at?: string
  is_read?: boolean
}

export type MemberMessengerInboxList = MemberMessengerInboxItem[]

/** GET /platform/v1/player/messages/outbox 列表單筆 */
export interface MemberMessengerOutboxItem {
  id: number
  subject: string
  /** 最後一則訊息時間（RFC3339／ISO），例：`2026-05-19T05:22:41Z` */
  last_msg_at: string
  /**
   * 與 {@link MemberMessengerStatus} 對齊（查詢參數 `status` 同語意）：
   * `1` 未讀、`2` 已讀、`3` 對話關閉
   */
  view_status: number
}

export type MemberMessengerOutboxList = MemberMessengerOutboxItem[]

/** POST /platform/v1/player/messages/outbox */
export interface MemberMessengerComposeRequest {
  subject: string
  content: string
  /** 選填：圖片路徑或 URL 字串陣列 */
  images?: string[]
}

/** POST /platform/v1/player/messages/outbox/{id}/reply 之 body */
export interface MemberMessengerOutboxReplyRequest {
  content: string
  /** 選填：圖片路徑或 URL 字串陣列 */
  images?: string[]
}

/** 回覆 API：`messageId` 走 URL，其餘為 body */
export type MemberMessengerOutboxReplyPayload = { messageId: number } & MemberMessengerOutboxReplyRequest

export interface MemberMessengerTranslation {
  lang: string
  subject: string
  content: string
  images: string[]
}

export type MemberMessengerTemplateParams = Record<string, string | number>

/** GET /platform/v1/player/messages/inbox/{id} */
export interface MemberMessengerInboxDetail {
  id: number
  translations: MemberMessengerTranslation[]
  sender_type?: number
  biz_source?: number
  subject_key?: string
  content_key?: string
  template_params?: MemberMessengerTemplateParams
  published_at: string
  created_at?: string
  sender_name: string
}

/** 收件匣詳情依語系解析後供畫面使用 */
export interface MemberMessengerInboxDetailView {
  id: number
  subject: string
  content: string
  images: string[]
  published_at: string
  sender_name: string
}

export interface MemberMessengerOutboxReply {
  /** `1` 玩家自身、`2` 管理員（與常數 `MemberMessengerReplySenderType` 對齊）。 */
  sender_type: number
  content: string
  images: string[]
  created_at: string
}

/** GET /platform/v1/player/messages/outbox/{id} */
export interface MemberMessengerOutboxDetail {
  id: number
  subject: string
  content: string
  images: string[]
  /** 建立時間（RFC3339／ISO），例：`2026-05-12T07:52:08Z` */
  created_at: string
  replies: MemberMessengerOutboxReply[]
}

export interface Pagination {
  offset: number
  size: number
  total: number
}

export interface BaseList<T> {
  list: T
  pagination: Pagination
}
