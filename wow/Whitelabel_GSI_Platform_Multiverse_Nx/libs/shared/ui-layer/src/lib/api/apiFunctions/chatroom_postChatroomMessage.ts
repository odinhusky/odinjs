import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface PostChatroomMessageParamsType {
  target_id: number
  message: string
}
export type PostChatroomMessageRequestType = PostChatroomMessageParamsType

export const postChatroomMessage = (params: PostChatroomMessageParamsType) => {
  return requestFn<PostChatroomMessageRequestType, EmptyType>(
    ENDPOINT_PATHS.CHATROOM.MESSAGE,
    params,
    {
      name: "postChatroomMessage",
      method: "post"
    }
  )
}
