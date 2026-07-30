import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface MemberAgentTagListResponseItem {
  id: number
  name: string
  type: number
  remark: string
  enabled: boolean
  checked?: boolean
}

export type GetMemberAgentTagListResponseList = MemberAgentTagListResponseItem[]

export type GetMemberAgentTagListResponseType = GetMemberAgentTagListResponseList

// 取得標籤列表
export const getMemberAgentTagList = () => {
  return requestFn<EmptyType, GetMemberAgentTagListResponseType>(ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_TAG_LIST, null, {
    name: "getMemberAgentTagList",
    method: "get"
  })
}
