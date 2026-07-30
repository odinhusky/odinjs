import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { PENDING_SEARCH_TYPE_ENUMS } from "@shared-lib/constants/enums/pendingSearchType"
import { REPORT_DATE_TYPES_ENUMS } from "@shared-lib/constants/enums/reportDateTypes"
import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"
import { PENDING_STATUS_ENUMS } from "@shared-lib/constants/enums/pendingStatus"
import { BaseList } from "@shared-lib/api/commonTypes"

export interface GetMoneyPendingParamTypes {
  search_type: PENDING_SEARCH_TYPE_ENUMS
  start_date: string
  end_date: string
  offset: number
  size: number
  dateType?: REPORT_DATE_TYPES_ENUMS
}

export type GetMoneyPendingListRequestTypes = GetMoneyPendingParamTypes

export interface GetMoneyPendingResponseItem {
  order_type?: PENDING_SEARCH_TYPE_ENUMS
  trans_code: string
  payment_type?: FUND_METHOD_TYPE_ENUMS
  payment_gateway_id?: number
  payment_gateway_name?: string
  currency?: number
  amount?: string
  actual_amount?: string
  submit_date?: string
  status?: PENDING_STATUS_ENUMS
  isActive?: boolean
  needUploadDetailFundType?: boolean
}

export type GetMoneyPendingResponseList = GetMoneyPendingResponseItem[]

export type GetMoneyPendingListResponseType = BaseList<GetMoneyPendingResponseList>

export const getPendingHistoryList = (params: GetMoneyPendingParamTypes) => {
  return requestFn<GetMoneyPendingListRequestTypes, GetMoneyPendingListResponseType>(
    ENDPOINT_PATHS.REPORT.MONEY_PENDING_LIST,
    params,
    {
      name: "getPendingHistoryList",
      method: "get"
    }
  )
}
