import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetMemberAgentQuotaAmountParamsType {
  currency_id: number
}

export type GetMemberAgentQuotaAmountRequestType = GetMemberAgentQuotaAmountParamsType

export interface GetMemberAgentQuotaAmountResponseType extends GetMemberAgentQuotaAmountParamsType {
  remain_quota_amount: string
  total_quota_amount: string
}

// 取得會員額度
export const getMemberAgentQuotaAmount = (params: GetMemberAgentQuotaAmountParamsType) => {
  return requestFn<GetMemberAgentQuotaAmountRequestType, GetMemberAgentQuotaAmountResponseType>(
    ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_QUOTA,
    params,
    {
      name: "getMemberAgentQuotaAmount",
      method: "get"
    }
  )
}
