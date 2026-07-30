import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetChatroomMemberSearchRequestType {
  account: string
}

export interface GetChatroomMemberSearchResponseType {
  account: string
  member_id: number
}

export const getChatroomMemberSearch = (params: GetChatroomMemberSearchRequestType) => {
  return requestFn<GetChatroomMemberSearchRequestType, GetChatroomMemberSearchResponseType>(
    ENDPOINT_PATHS.CHATROOM.MEMBER_SEARCH,
    params,
    {
      name: "getChatroomMemberSearch",
      method: "get"
    }
  )
}
