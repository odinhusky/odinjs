import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { BaseListWithPage } from "@shared-lib/api/commonTypes"

export interface MyReportDetailParamsType {
  account?: string
  currency_id?: number
  entry_id: number
  offset?: number
  size?: number
}

export type GetMyReportDetailRequestType = MyReportDetailParamsType

export interface MyReportDetailsEvents {
  id: number
  member_id: number
  member_account: string
  currency_id: number
  total_deposit: number
  valid_bet: number
  profit: number
  commission: number
  active_rate: boolean
}

export type MyReportDetailsEventsList = MyReportDetailsEvents[]

export type GetMyReportDetailResponseType = BaseListWithPage<MyReportDetailsEventsList>

// 取得我的報表 - 明細
export const getMyReportDetail = (entry_id: number, params: MyReportDetailParamsType) => {
  return requestFn<GetMyReportDetailRequestType, GetMyReportDetailResponseType>(
    ENDPOINT_PATHS.SHAREHOLDER.MY_REPORT_DETAIL({ entry_id }),
    params,
    {
      name: "getMyReportDetail",
      method: "get"
    }
  )
}
