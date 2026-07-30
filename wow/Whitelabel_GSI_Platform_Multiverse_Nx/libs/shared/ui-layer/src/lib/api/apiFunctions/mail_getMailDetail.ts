import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { MAIL_TYPE_ENUMS } from "@shared-lib/constants/enums/mailType"

export interface MailDetailResponseType {
  id: number
  mail_type: MAIL_TYPE_ENUMS
  mail_title: string
  mail_body: string
  send_at: string
}

export const getMailDetail = (id: number) => {
  return requestFn<EmptyType, MailDetailResponseType>(`${ENDPOINT_PATHS.MAIL.LIST}/${id}`, null, {
    name: "getMailDetail",
    method: "get",
    needToken: true
  })
}
