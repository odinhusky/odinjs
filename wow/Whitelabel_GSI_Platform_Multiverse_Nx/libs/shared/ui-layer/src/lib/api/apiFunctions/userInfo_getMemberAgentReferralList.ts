import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface MemberAgentReferralResponseItem {
  member_id: number
  member_account: string
}

export type GetMemberAgentReferralListResponseList = MemberAgentReferralResponseItem[]

export type GetMemberAgentReferralListResponseType = GetMemberAgentReferralListResponseList

// 取得推薦人列表
export const getMemberAgentReferralList = () => {
  return requestFn<EmptyType, GetMemberAgentReferralListResponseType>(
    ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_REFERRAL_LIST,
    null,
    {
      name: "getMemberAgentReferralList",
      method: "get"
    }
  )
}
