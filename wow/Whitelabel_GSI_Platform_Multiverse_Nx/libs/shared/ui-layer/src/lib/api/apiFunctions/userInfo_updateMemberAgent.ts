import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { MemberAgentPamramsType } from "@shared-lib/api/commonTypes/userInfoTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type UpdateMemberAgentPamramsType = MemberAgentPamramsType
export type UpdateMemberAgentRequestType = MemberAgentPamramsType

// 編輯下級會員
export const updateMemberAgent = (data: UpdateMemberAgentPamramsType) => {
  return requestFn<UpdateMemberAgentRequestType, EmptyType>(ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_INFO, data, {
    name: "updateMemberAgent",
    method: "put"
  })
}
