import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { PaginatedList } from "@shared-lib/api/commonTypes"
import { GetReferralSettingBase, Revenue } from "@shared-lib/api/commonTypes/referralTypes"

export type GetReferralStatementListParamTypes = GetReferralSettingBase
export type GetReferralStatementListRequestTypes = GetReferralSettingBase

export type ReferralStatementListResponseType = PaginatedList<{
  statement_id: number
  billing_date: string
  billing_start: string
  billing_end: string
  cashback_count: number
  revenues: Revenue
}>

export const getReferralStatementList = (params: GetReferralStatementListParamTypes) => {
  return requestFn<GetReferralStatementListRequestTypes, ReferralStatementListResponseType>(
    ENDPOINT_PATHS.REFERRAL.STATEMENTS_LIST,
    params,
    {
      name: "getReferralStatementList",
      method: "get"
    }
  )
}
