import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { TimeStringType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface GetInterestActivityDetailListParamsDataType {
  end_time?: TimeStringType
  offset?: number
  size?: number
  start_time?: TimeStringType
}

export type GetInterestActivityDetailListRequestType = GetInterestActivityDetailListParamsDataType

export type GetInterestActivityDetailContent = {
  lang: string
  title: string
  detail: string
  image_path: string
}

export type GetInterestActivityDetailListItem = {
  activity_name: string
  apply_time: string
  contents: GetInterestActivityDetailContent[]
  currency_code: string
  days: number
  expected_interest: string
  id: number
  interest_rate: string
  principal: string
  status: number
}

export type GetInterestActivityDetailListPagination = {
  offset: number
  size: number
  total: number
}

export type GetInterestActivityDetailList = {
  list: GetInterestActivityDetailListItem[]
  pagination: GetInterestActivityDetailListPagination
}

export type GetInterestActivityDetailListResponseType = GetInterestActivityDetailList

//詳情清單
export const getInterestActivityDetailList = (data: GetInterestActivityDetailListParamsDataType) => {
  return requestFn<GetInterestActivityDetailListRequestType, GetInterestActivityDetailListResponseType>(
    ENDPOINT_PATHS.INTEREST.ACTIVITY_DETAIL_LIST,
    data,
    {
      name: "getInterestActivityDetailList",
      method: "get",
      needToken: true
    }
  )
}
