import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { ChatroomRelationList } from "@shared-lib/api/commonTypes/chatroomTypes"

export type GetChatroomRelationResponseType = ChatroomRelationList

export const getChatroomRelation = () => {
  return requestFn<EmptyType, GetChatroomRelationResponseType>(ENDPOINT_PATHS.CHATROOM.RELATION, null, {
    name: "getChatroomRelation",
    method: "get"
  })
}
