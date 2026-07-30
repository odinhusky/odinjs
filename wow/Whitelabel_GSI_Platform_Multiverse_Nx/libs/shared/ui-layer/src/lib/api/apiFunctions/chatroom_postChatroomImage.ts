import { CHAT_MESSAGE_TYPE_ENUMS } from "@shared-lib/constants/enums/chatMessageType"
import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface PostChatroomImageParamsType {
  target_id: number
  images: File[]
}
export type PostChatroomImageRequestType = PostChatroomImageParamsType

export interface PostChatroomImageItem {
  id: number
  chat_room_id: string
  member_id: number
  target_id: number
  message: {
    message: string
    type: CHAT_MESSAGE_TYPE_ENUMS
  }
  created_at: string
}

export type PostChatroomImageResponseType = PostChatroomImageItem[]

export const postChatroomImage = (params: PostChatroomImageParamsType) => {
  const formData = new FormData()
  formData.append("target_id", params.target_id.toString())
  params.images.forEach((file) => formData.append("images", file))

  return requestFn<FormData, PostChatroomImageResponseType>(ENDPOINT_PATHS.CHATROOM.IMAGE, formData, {
    name: "postChatroomImage",
    method: "post",
    useFormData: true
  })
}
