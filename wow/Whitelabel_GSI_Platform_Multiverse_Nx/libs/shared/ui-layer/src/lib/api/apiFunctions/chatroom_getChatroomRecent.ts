import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { CHAT_MESSAGE_TYPE_ENUMS } from "@shared-lib/constants/enums/chatMessageType"

export interface ChatroomRecentItem {
  chat_room_id: string
  last_message: {
    type: string
    message: CHAT_MESSAGE_TYPE_ENUMS
  }
  last_message_at: string
  target_account: string
  target_id: number
  target_nickname: string
}

export interface GetChatroomRecentRequestType {
 size?: string
  page?: string
}

export type GetChatroomRecentResponseType = ChatroomRecentItem[]

export const getChatroomRecent = (params: GetChatroomRecentRequestType) => {
  return requestFn<GetChatroomRecentRequestType, GetChatroomRecentResponseType>(
    ENDPOINT_PATHS.CHATROOM.RECENT,
    params,
    {
      name: "getChatroomRecent", // 原本是 Cecent，已修正為 Recent
      method: "get"
    }
  )
}
