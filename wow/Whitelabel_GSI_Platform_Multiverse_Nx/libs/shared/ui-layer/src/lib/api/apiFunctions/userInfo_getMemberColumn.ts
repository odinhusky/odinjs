import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { BaseListType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { INPUT_TYPE_ENUMS } from "@shared-lib/constants/enums/inputType"

export type GetMemberColumnRequestType = { type: string }

export interface MemberColumn {
  column_name: string
  customize: boolean
  lang?: {
    [key: string]: string
  }
  required: boolean
  edit: boolean
  type: INPUT_TYPE_ENUMS
  values: BaseListType[]
  column_label?: string
}

export type MemberColumnList = MemberColumn[]
export type GetMemberColumnResponseType = MemberColumnList

export const getMemberColumn = () => {
  return requestFn<GetMemberColumnRequestType, GetMemberColumnResponseType>(
    ENDPOINT_PATHS.USER_INFO.MEMBER_COLUMN,
    { type: "center" },
    {
      name: "getMemberColumn",
      method: "get"
    }
  )
}
