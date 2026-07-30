import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface DeleteChatroomRelationParamsType {
  target_id: number
}
export type DeleteChatroomRelationRequestType = DeleteChatroomRelationParamsType

export const deleteChatroomRelation = (params: DeleteChatroomRelationParamsType) => {
  return requestFn<DeleteChatroomRelationRequestType, EmptyType>(ENDPOINT_PATHS.CHATROOM.RELATION, params, {
    name: "deleteChatroomRelation",
    method: "delete"
  })
}
