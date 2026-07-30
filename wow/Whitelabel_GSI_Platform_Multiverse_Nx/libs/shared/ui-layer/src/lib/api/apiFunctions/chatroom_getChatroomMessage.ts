import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { CHAT_MESSAGE_TYPE_ENUMS } from "@shared-lib/constants/enums/chatMessageType"

export interface GetChatroomMessage {
  chat_room_id: string
  size: string
  before_ts?: number
  after_ts?: number
}

export interface ChatroomMsgItem {
  id: number
  chat_room_id: string
  member_id: number
  target_id: number
  message: {
    message?: string
    path?: string
    type: CHAT_MESSAGE_TYPE_ENUMS
  }
  created_at: string
}

export type GetChatroomMessageList = ChatroomMsgItem[]
export type GetChatroomMessageParamsType = GetChatroomMessage
export type GetChatroomMessageRequestType = GetChatroomMessage
export type GetChatroomMessageResponseType = GetChatroomMessageList

export const getChatroomMessage = (params: GetChatroomMessageParamsType) => {
  return requestFn<GetChatroomMessageRequestType, GetChatroomMessageResponseType>(
    ENDPOINT_PATHS.CHATROOM.MESSAGE,
    params,
    {
      name: "getChatroomMessage",
      method: "get"
    }
  )
}
