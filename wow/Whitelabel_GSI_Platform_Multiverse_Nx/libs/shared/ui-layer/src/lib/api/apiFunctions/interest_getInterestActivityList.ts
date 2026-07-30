import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType, TimeStringType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export type GetInterestActivityListContent = {
  activity_id: number
  detail: string
  image_path: string
  lang: string
  title: string
}

export type GetInterestActivityListPlan = {
  can_participate: boolean
  can_refund: boolean
  days: number
  expected_interest: string
  id: number
  interest_rate: string
  principal: string
}

export type GetInterestActivityItem = {
  audit_rate: string
  contents: GetInterestActivityListContent[]
  currency_code: string
  currency_id: number
  end_time: TimeStringType
  id: number
  is_auto_dispatch: number
  plans: GetInterestActivityListPlan[]
  start_time: TimeStringType
}

export type GetInterestActivityList = GetInterestActivityItem[]

export type GetInterestActivityListResponseType = GetInterestActivityList

//活動清單
export const getInterestActivityList = () => {
  return requestFn<EmptyType, GetInterestActivityListResponseType>(ENDPOINT_PATHS.INTEREST.ACTIVITY_LIST, null, {
    name: "getInterestActivityList",
    method: "get",
    needToken: true
  })
}
