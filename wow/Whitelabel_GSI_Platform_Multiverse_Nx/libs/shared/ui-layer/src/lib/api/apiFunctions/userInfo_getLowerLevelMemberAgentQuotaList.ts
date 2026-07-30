import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { MemberAgentQuotaListData } from "@shared-lib/api/commonTypes/userInfoTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetLowerLevelMemberAgentQuotaListRequestType {
  currency_id: number
  downline_member_account: string
}

export interface GetLowerLevelMemberAgentQuotaListParamsType extends GetLowerLevelMemberAgentQuotaListRequestType {
  account?: number
}

export type GetLowerLevelMemberAgentQuotaListDataResponseType = MemberAgentQuotaListData

// 查看下級會員的 下級會員列表
export const getLowerLevelMemberAgentQuotaList = (params: GetLowerLevelMemberAgentQuotaListParamsType) => {
  const payload = {
    currency_id: params.currency_id,
    downline_member_account: params.downline_member_account
  }

  if (!params.account) {
    throw new Error("Account parameter is required")
  }

  return requestFn<GetLowerLevelMemberAgentQuotaListRequestType, GetLowerLevelMemberAgentQuotaListDataResponseType>(
    `${ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_QUOTA}/${params.account}`,
    payload,
    {
      name: "getLowerLevelMemberAgentQuotaList",
      method: "get"
    }
  )
}
