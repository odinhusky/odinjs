import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetMemberAgentCustomizeColumnParamType {
  type: string // 新增:register、編輯: manage
}

export type GetMemberAgentCustomizeColumnRequestType = GetMemberAgentCustomizeColumnParamType

export interface MemberCustomizeColumnResponseItem {
  column_name: string
  customize: boolean
  edit: boolean
  lang: {
    [key: string]: string
  }
  required: boolean
  type: number
  values: {
    label: string
    value: string
  }[]
  column_label?: string
}

export type GetMemberAgentCustomizeColumnResponseList = MemberCustomizeColumnResponseItem[]

export type GetMemberAgentCustomizeColumnResponseType = GetMemberAgentCustomizeColumnResponseList

// 取得後台會員資料自訂欄位
export const getMemberAgentCustomizeColumn = (params: GetMemberAgentCustomizeColumnParamType) => {
  return requestFn<GetMemberAgentCustomizeColumnRequestType, GetMemberAgentCustomizeColumnResponseType>(
    ENDPOINT_PATHS.USER_INFO.MEMBER_AGENT_CUSTOMIZE_COLUMN,
    params,
    {
      name: "getMemberAgentCustomizeColumn",
      method: "get"
    }
  )
}
