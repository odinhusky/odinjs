import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface UpdateMemberAgentQuotaBalancePamramsType {
  member_account: string
  currency_id: number
  type: number
  /*
    type
    1: 增加
    2: 扣款
  */
  amount: string
}

export type UpdateMemberAgentQuotaBalanceRequestType = UpdateMemberAgentQuotaBalancePamramsType

// 更新下級會員額度
export const updateMemberAgentQuotaBalance = (data: UpdateMemberAgentQuotaBalancePamramsType) => {
  return requestFn<UpdateMemberAgentQuotaBalanceRequestType, EmptyType>(
    ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_QUOTA,
    data,
    {
      name: "updateMemberAgentQuotaBalance",
      method: "post"
    }
  )
}
