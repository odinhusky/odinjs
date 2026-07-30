import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { MemberAgentPamramsType } from "@shared-lib/api/commonTypes/userInfoTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type CreateMemberAgentPamramsType = MemberAgentPamramsType
export type CreateMemberAgentRequestType = MemberAgentPamramsType

// 建立下級會員
export const createMemberAgent = (data: CreateMemberAgentPamramsType) => {
  return requestFn<CreateMemberAgentRequestType, EmptyType>(ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_INFO, data, {
    name: "createMemberAgent",
    method: "post"
  })
}
