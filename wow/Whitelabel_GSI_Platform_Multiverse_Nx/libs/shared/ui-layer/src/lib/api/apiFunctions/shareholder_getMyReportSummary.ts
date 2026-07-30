import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { MyReportBaseParamsType } from "@shared-lib/api/commonTypes/shareholderTypes"
import { BaseListWithPage } from "@shared-lib/api/commonTypes"

export type GetMyReportSummaryParamsType = MyReportBaseParamsType
export type GetMyReportSummaryRequestType = MyReportBaseParamsType

export interface MyReportSummaryEvents {
  member_id: number // 會員 ID
  member_account: string // 會員帳號
  valid_bet: number // 有效投注額
  profit: number // 盈虧
  settlement_rate: number // 佣金金額
  commission: string
}

export type MyReportSummaryEventsList = MyReportSummaryEvents[]

export type GetMyReportSummaryResponseType = BaseListWithPage<MyReportSummaryEventsList>

// 取得我的報表結算
export const getMyReportSummary = (params: GetMyReportSummaryParamsType) => {
  return requestFn<GetMyReportSummaryRequestType, GetMyReportSummaryResponseType>(
    ENDPOINT_PATHS.SHAREHOLDER.MY_REPORT_SUMMARY,
    params,
    {
      name: "getMyReport",
      method: "get"
    }
  )
}
