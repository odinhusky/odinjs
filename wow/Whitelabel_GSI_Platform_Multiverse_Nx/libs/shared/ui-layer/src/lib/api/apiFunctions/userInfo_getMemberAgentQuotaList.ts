import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { MemberAgentQuotaListData } from "@shared-lib/api/commonTypes/userInfoTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetMemberAgentQuotaListParamsType {
  currency_id: number
  downline_member_account?: string
  recommender_account?: string
  size?: string
  offset?: string
}

export type GetMemberAgentQuotaListRequestType = GetMemberAgentQuotaListParamsType

export type GetMemberAgentQuotaListDataResponseType = MemberAgentQuotaListData

// 取得下級會員列表
export const getMemberAgentQuotaList = (params: GetMemberAgentQuotaListParamsType) => {
  return requestFn<GetMemberAgentQuotaListRequestType, GetMemberAgentQuotaListDataResponseType>(
    ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_QUOTA_LIST,
    params,
    {
      name: "getMemberAgentQuotaList",
      method: "get"
    }
  )
}
