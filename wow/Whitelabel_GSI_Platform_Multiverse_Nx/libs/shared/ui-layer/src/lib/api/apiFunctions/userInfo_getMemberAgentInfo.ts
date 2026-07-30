import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface MemberAgentInfoResponseType {
  [key: string]: any
}

// 取得下級會員資料
export const getMemberAgentInfo = (memberId: number) => {
  return requestFn<EmptyType, MemberAgentInfoResponseType>(
    `${ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_INFO}/${memberId}`,
    null,
    {
      name: "getMemberAgentInfo",
      method: "get"
    }
  )
}
