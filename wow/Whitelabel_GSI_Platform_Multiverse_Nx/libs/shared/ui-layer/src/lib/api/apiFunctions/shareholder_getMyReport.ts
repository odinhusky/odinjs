import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { MyReportBaseParamsType } from "@shared-lib/api/commonTypes/shareholderTypes"
import { GAME_TYPE_ENUMS } from "@shared-lib/constants/enums/gameType"
import { BaseListWithPage } from "@shared-lib/api/commonTypes"

export type GetMyReportParamsType = MyReportBaseParamsType
export type GetMyReportRequestType = MyReportBaseParamsType

export interface MyReportEvents {
  member_id: number // 會員 ID
  member_account: string // 會員帳號
  game_type: GAME_TYPE_ENUMS // 遊戲類別 ID
  valid_bet: number // 有效投注額
  profit: number // 盈虧
  settlement_rate: number // 佣金金額
}

export type MyReportEventsList = MyReportEvents[]

export type GetMyReportResponseType = BaseListWithPage<MyReportEventsList>

// 取得我的報表
export const getMyReport = (params: GetMyReportParamsType) => {
  return requestFn<GetMyReportRequestType, GetMyReportResponseType>(ENDPOINT_PATHS.SHAREHOLDER.MY_REPORT, params, {
    name: "getMyReport",
    method: "get"
  })
}
