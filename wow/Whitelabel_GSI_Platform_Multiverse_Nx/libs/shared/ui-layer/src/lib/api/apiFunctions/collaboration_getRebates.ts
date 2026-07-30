import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { REBATE_STATUS_ENUMS } from "@shared-lib/constants/enums/rebateStatus"
import { Pagination, TimeStringType } from "@shared-lib/api/commonTypes"

export interface GetRebates {
  start_time: TimeStringType
  end_time: TimeStringType
  currency_id: number
  // status: REBATE_STATUS.Enums
  offset: number
  size: number
}

export interface RebateItem {
  id: number
  settled_time: string
  active_member_count: number
  valid_bet_amount: number
  level: number
  rebate_amount: number
  currency_id: number
  currency_code: string
  status: REBATE_STATUS_ENUMS
}

export interface RebateList {
  list: RebateItem[]
  pagination: Pagination & { page: number }
}

export type GetRebatesParamsType = GetRebates
export type GetRebatesRequestType = GetRebates
export type GetRebatesResponseType = RebateList

export const getRebates = (params: GetRebatesParamsType) => {
  return requestFn<GetRebatesRequestType, GetRebatesResponseType>(ENDPOINT_PATHS.COLLABORATION.REBATES, params, {
    name: "getRebates",
    method: "get"
  })
}
