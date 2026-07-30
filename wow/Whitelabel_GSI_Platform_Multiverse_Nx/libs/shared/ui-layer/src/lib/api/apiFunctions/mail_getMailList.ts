import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { BaseList } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { MAIL_TYPE_ENUMS } from "@shared-lib/constants/enums/mailType"
import { MAIL_STATUS_ENUMS } from "@shared-lib/constants/enums/mailStatus"

export interface MailListParamsType {
  size: number
  offset?: number
  page?: number
}

export interface ResponseMailItem {
  index: number
  id: number
  mail_type: MAIL_TYPE_ENUMS
  mail_title: string
  mail_body: string
  status: MAIL_STATUS_ENUMS
  send_at: string
}
export type ResponseMailList = ResponseMailItem[]
export type MailListRequestType = MailListParamsType
export type MailListResponseType = BaseList<ResponseMailList>

export const getMailList = (params: MailListParamsType) => {
  return requestFn<MailListRequestType, MailListResponseType>(ENDPOINT_PATHS.MAIL.LIST, params, {
    name: "getMailList",
    method: "get",
    needToken: true
  })
}
