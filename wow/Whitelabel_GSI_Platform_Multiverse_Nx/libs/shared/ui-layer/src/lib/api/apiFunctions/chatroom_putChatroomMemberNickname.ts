import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface PutChatroomMemberNicknameParamsType {
  target_id: number
  nickname: string
}
export type PutChatroomMemberNicknameRequestType = PutChatroomMemberNicknameParamsType

export const putChatroomMemberNickname = (params: PutChatroomMemberNicknameParamsType) => {
  return requestFn<PutChatroomMemberNicknameRequestType, EmptyType>(ENDPOINT_PATHS.CHATROOM.NICKNAME, params, {
    name: "putChatroomMemberNickname",
    method: "put"
  })
}
