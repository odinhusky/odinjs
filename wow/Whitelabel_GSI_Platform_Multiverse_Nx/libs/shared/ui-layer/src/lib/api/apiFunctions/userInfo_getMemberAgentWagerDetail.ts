import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetMemberAgentWagerDetailParamsType {
  wager_code: string
  product_code: number
}

export type GetMemberAgentWagerDetailRequestType = GetMemberAgentWagerDetailParamsType

export interface GetMemberAgentWagerDetailResponseType {
  content: string
}

// 取得派彩詳細頁面（第三方頁面）
export const getMemberAgentWagerDetail = (data: GetMemberAgentWagerDetailParamsType) => {
  return requestFn<GetMemberAgentWagerDetailRequestType, GetMemberAgentWagerDetailResponseType>(
    ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_WAGER_DETAIL,
    data,
    {
      name: "getMemberAgentWagerDetail",
      method: "get"
    }
  )
}
