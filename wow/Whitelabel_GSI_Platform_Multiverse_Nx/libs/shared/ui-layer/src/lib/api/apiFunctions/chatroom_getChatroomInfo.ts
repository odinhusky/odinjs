import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { ChatroomRelationItem } from "@shared-lib/api/commonTypes/chatroomTypes"

export interface GetChatroomInfoParamsType {
  target_id: number
}

export type GetChatroomInfoRequestType = GetChatroomInfoParamsType

export interface GetChatroomInfoResponseType {
  chat_room_id: string
  member_relation: ChatroomRelationItem
}

export const getChatroomInfo = (params: GetChatroomInfoParamsType) => {
  return requestFn<GetChatroomInfoRequestType, GetChatroomInfoResponseType>(ENDPOINT_PATHS.CHATROOM.INFO, params, {
    name: "getChatroomInfo",
    method: "get"
  })
}
