import { requestApi } from "src/common/utils/request"

import type {
  BaseList,
  MemberMessengerComposeRequest,
  MemberMessengerInboxDetail,
  MemberMessengerInboxList,
  MemberMessengerInboxRequest,
  MemberMessengerOutboxDetail,
  MemberMessengerOutboxList,
  MemberMessengerOutboxReplyPayload,
  MemberMessengerOutboxReplyRequest,
  MemberMessengerOutboxRequest,
  MemberMessengerUnreadCount
} from "./memberMessenger.type"

export const memberMessengerUnreadCount = () => {
  return requestApi<null, MemberMessengerUnreadCount>("/platform/v1/player/messages/unread-count", null, {
    name: "memberMessengerUnreadCount",
    method: "get",
    needToken: true,
  })
}

export const memberMessengerInbox = (params: MemberMessengerInboxRequest) => {
  return requestApi<MemberMessengerInboxRequest, BaseList<MemberMessengerInboxList>>(
    "/platform/v1/player/messages/inbox",
    params,
    {
      name: "memberMessengerInbox",
      method: "get",
      needToken: true,
    }
  )
}

export const memberMessengerOutbox = (params: MemberMessengerOutboxRequest) => {
  return requestApi<MemberMessengerOutboxRequest, BaseList<MemberMessengerOutboxList>>(
    "/platform/v1/player/messages/outbox",
    params,
    {
      name: "memberMessengerOutbox",
      method: "get",
      needToken: true,
    }
  )
}

export const memberMessengerInboxDetail = (id: number) => {
  return requestApi<null, MemberMessengerInboxDetail>(`/platform/v1/player/messages/inbox/${id}`, null, {
    name: "memberMessengerInboxDetail",
    method: "get",
    needToken: true,
  })
}

export const memberMessengerOutboxDetail = (id: number) => {
  return requestApi<null, MemberMessengerOutboxDetail>(`/platform/v1/player/messages/outbox/${id}`, null, {
    name: "memberMessengerOutboxDetail",
    method: "get",
    needToken: true,
  })
}

export const memberMessengerCompose = (params: MemberMessengerComposeRequest) => {
  return requestApi<MemberMessengerComposeRequest, unknown>("/platform/v1/player/messages/outbox", params, {
    name: "memberMessengerCompose",
    method: "post",
    needToken: true,
  })
}

export const memberMessengerOutboxReply = ({
  messageId,
  content,
  images,
}: MemberMessengerOutboxReplyPayload) => {
  const body: MemberMessengerOutboxReplyRequest = {
    content,
    ...(images != null && images.length > 0 ? { images } : {}),
  }
  return requestApi<MemberMessengerOutboxReplyRequest, unknown>(
    `/platform/v1/player/messages/outbox/${messageId}/reply`,
    body,
    {
      name: "memberMessengerOutboxReply",
      method: "post",
      needToken: true,
    }
  )
}

/** 關閉寄件匣對話串（後端路徑若不同請改此處） */
export const memberMessengerOutboxCloseThread = (id: number) => {
  return requestApi<Record<string, never>, unknown>(`/platform/v1/player/messages/outbox/${id}/close`, {}, {
    name: "memberMessengerOutboxCloseThread",
    method: "post",
    needToken: true,
  })
}
