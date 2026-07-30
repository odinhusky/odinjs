import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { BaseListWithPage } from "@shared-lib/api/commonTypes"
import { ShareholderBaseParamsType } from "@shared-lib/api/commonTypes/shareholderTypes"

export type GetYesterdayReportParamsType = ShareholderBaseParamsType
export type GetYesterdayReportRequestType = ShareholderBaseParamsType

export interface YesterdayReportEvents {
  game_type: number
  prize_amount: string
  profit: string
  valid_bet: string
}

export type YesterdayReportEventsList = YesterdayReportEvents[]

export type GetYesterdayReportResponseType = BaseListWithPage<YesterdayReportEventsList>

// 取得昨日報表
export const getYesterdayReport = (params: GetYesterdayReportParamsType) => {
  return requestFn<GetYesterdayReportRequestType, GetYesterdayReportResponseType>(
    ENDPOINT_PATHS.SHAREHOLDER.YESTERDAY_REPORT,
    params,
    {
      name: "getYesterdayReport",
      method: "get"
    }
  )
}
