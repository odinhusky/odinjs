import { deleteData, get, post } from "@/utils/request"

export enum MessageNotificationStatus {
  SENT = 1,
  FAILED = 2
}

export const MessageNotificationStatusI18nKeys: Record<number, string> = {
  [MessageNotificationStatus.SENT]: "message_notification.status.sent",
  [MessageNotificationStatus.FAILED]: "message_notification.status.failed"
}

export enum MessageNotificationTargetType {
  ALL_MEMBERS = 0,
  SPECIFIC_MEMBERS = 1,
  MEMBER_LEVEL = 2,
  MEMBER_TAG = 3
}

export const MessageNotificationTargetTypeI18nKeys: Record<number, string> = {
  [MessageNotificationTargetType.ALL_MEMBERS]: "message_notification.target_type.all_members",
  [MessageNotificationTargetType.SPECIFIC_MEMBERS]: "message_notification.target_type.specific_members",
  [MessageNotificationTargetType.MEMBER_LEVEL]: "message_notification.target_type.member_level",
  [MessageNotificationTargetType.MEMBER_TAG]: "message_notification.target_type.member_tag"
}

export enum MemberInquiryStatus {
  ALL = 0,
  UNREAD = 1,
  READ = 2,
  REPLIED = 3,
  CLOSED = 4
}

export const MemberInquiryStatusI18nKeys: Record<number, string> = {
  [MemberInquiryStatus.ALL]: "common.all",
  [MemberInquiryStatus.UNREAD]: "message_management.member_inquiries.status.unread",
  [MemberInquiryStatus.READ]: "message_management.member_inquiries.status.read",
  [MemberInquiryStatus.REPLIED]: "message_management.member_inquiries.status.replied",
  [MemberInquiryStatus.CLOSED]: "message_management.member_inquiries.status.closed"
}

export enum MemberInquiryReplySenderType {
  USER = 1,
  ADMIN = 2
}

export namespace Request {
  export type GetMessageNotificationList = {
    /** 查詢表單毫秒 timestamp，`start`/`end` 於 GET interceptor 送出前轉 RFC3339 */
    start?: number
    end?: number
    status?: MessageNotificationStatus | number
    memberAccount?: string
    offset?: number
    size?: number
    [key: string]: unknown
  }

  export type CreateMessageNotification = {
    target_type: number
    recipient_ids?: number[]
    translations: Array<{
      lang: string
      subject: string
      content: string
      images: string[]
    }>
  }

  export type GetMemberInquiryList = {
    start_date?: string | number
    end_date?: string | number
    status?: MemberInquiryStatus | number
    memberAccount?: string
    offset?: number
    size?: number
    [key: string]: unknown
  }

  export type ReplyMemberInquiry = {
    content: string
    images?: string[]
  }
}

export namespace Response {
  export type MessageNotificationMember = {
    id: number
    account: string
  }

  export type MessageNotificationLevel = {
    id: number
    name: string
  }

  export type MessageNotificationTag = {
    id: number
    name: string
  }

  export type MessageNotificationTranslation = {
    lang: string
    subject: string
    content: string
    images: string[]
  }

  export type MessageNotificationBase = {
    id: number
    target_type: number
    published_at: string
    status: number
    translations: MessageNotificationTranslation[]
  }

  export type MessageNotificationItem = MessageNotificationBase & {
    sender_account: string
  }

  export type MessageNotificationDetail = MessageNotificationBase & {
    members: MessageNotificationMember[]
    levels: MessageNotificationLevel[]
    tags: MessageNotificationTag[]
    default_lang: string
  }

  export type GetMessageNotificationList = {
    list: MessageNotificationItem[]
    pagination: {
      offset: number
      size: number
      total: number
    }
  }

  export type MemberInquiryItem = {
    id: number
    member_account: string
    subject: string
    last_msg_at: string
    agent_view_status: number
  }

  export type MemberInquiryReply = {
    sender_type: number
    sender_account: string
    sender_name?: string
    time?: string
    created_at?: string
    content?: string
    message?: string
    images?: string[]
  }

  export type MemberInquiryDetail = {
    id: number
    subject: string
    content: string
    images: string[]
    replies: MemberInquiryReply[]
    status: number
  }

  export type GetMemberInquiryList = {
    list: MemberInquiryItem[]
    pagination: {
      offset: number
      size: number
      total: number
    }
  }
}

/**
 * Message Management API 統一管理
 * 所有訊息管理相關 API 都在這裡定義
 */

/**
 * 取得系統訊息列表
 * GET /messages/notifications
 */
export const getSystemMessages = (params: Request.GetMessageNotificationList = {}) =>
  get<Response.GetMessageNotificationList>("/messages/notifications", params, {
    name: "getSystemMessages",
    usePlatform: true
  })

/**
 * 取得單筆系統訊息
 * GET /messages/notifications/{id}
 */
export const getSystemMessageDetail = (id: number) =>
  get<Response.MessageNotificationDetail>(`/messages/notifications/${id}`, undefined, {
    name: "getSystemMessageDetail",
    usePlatform: true
  })

/**
 * 刪除系統訊息
 * DELETE /messages/notifications/{id}
 */
export const deleteSystemMessage = (id: number) =>
  deleteData(`/messages/notifications/${id}`, {}, { name: "deleteSystemMessage", usePlatform: true })

/**
 * 新增系統訊息
 * POST /messages/notifications
 */
export const createSystemMessage = (payload: Request.CreateMessageNotification) =>
  post("/messages/notifications", payload, { name: "createSystemMessage", usePlatform: true })

/**
 * 取得會員詢問列表
 * GET /messages/inquiries
 */
export const getMemberInquiries = (params: Request.GetMemberInquiryList = {}) =>
  get<Response.GetMemberInquiryList>("/messages/inquiries", params, {
    name: "getMemberInquiries",
    usePlatform: true
  })

/**
 * 關閉會員詢問
 * POST /messages/inquiries/{id}/close
 */
export const closeMemberInquiry = (id: number) =>
  post(`/messages/inquiries/${id}/close`, {}, { name: "closeMemberInquiry", usePlatform: true })

/**
 * 取得會員詢問詳情
 * GET /messages/inquiries/{id}
 */
export const getMemberInquiryDetail = (id: number) =>
  get<Response.MemberInquiryDetail>(`/messages/inquiries/${id}`, undefined, {
    name: "getMemberInquiryDetail",
    usePlatform: true
  })

/**
 * 回覆會員詢問
 * POST /messages/inquiries/{id}/reply
 */
export const replyMemberInquiry = (id: number, payload: Request.ReplyMemberInquiry) =>
  post(`/messages/inquiries/${id}/reply`, payload, {
    name: "replyMemberInquiry",
    usePlatform: true
  })
